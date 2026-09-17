import prisma from '../prisma.js';
import { generateApplicationNo, computeAuditBlockHash } from '../services/trustChain.js';
import { runAiPreCheck } from './ai.controller.js';

export async function listApplications(req, res) {
  try {
    const { status } = req.query;
    const isBusiness = req.user.role === 'BUSINESS';
    const isInspector = req.user.role === 'INSPECTOR';

    const where = {};
    if (isBusiness) {
      where.businessId = req.user.id;
    }
    if (isInspector) {
      where.OR = [
        { inspection: { inspectorId: req.user.id } },
        { status: 'SUBMITTED' },
        { status: 'AI_REVIEWED' },
        { status: 'INSPECTION_ASSIGNED' }
      ];
    }
    if (status) {
      where.status = status;
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        business: { select: { id: true, name: true, orgName: true, phone: true } },
        instrument: true,
        inspection: {
          include: {
            inspector: { select: { id: true, name: true } }
          }
        },
        officerReview: {
          include: {
            officer: { select: { id: true, name: true } }
          }
        },
        certificate: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ applications });
  } catch (error) {
    console.error('List applications error:', error);
    res.status(500).json({ error: 'Failed to retrieve applications' });
  }
}

export async function submitApplication(req, res) {
  try {
    const { instrumentId, documents = [] } = req.body;

    if (!instrumentId) {
      return res.status(400).json({ error: 'instrumentId is required' });
    }

    const instrument = await prisma.instrument.findFirst({
      where: {
        OR: [{ id: instrumentId }, { uin: instrumentId }, { serialNo: instrumentId }]
      }
    });

    if (!instrument) {
      return res.status(404).json({ error: 'Instrument not found in registry' });
    }

    const applicationNo = generateApplicationNo();

    // Create Application
    const application = await prisma.application.create({
      data: {
        applicationNo,
        businessId: req.user.id,
        instrumentId: instrument.id,
        status: 'SUBMITTED',
        feeAmount: 500.0,
        feeStatus: 'PAID'
      }
    });

    // Save attached documents
    if (Array.isArray(documents) && documents.length > 0) {
      await prisma.document.createMany({
        data: documents.map(d => ({
          applicationId: application.id,
          docType: d.docType || 'INVOICE',
          fileName: d.fileName || 'document.pdf',
          fileUrl: d.fileUrl || '/uploads/sample-doc.pdf',
          ocrExtractedText: d.ocrExtractedText || null,
          verifiedByAi: false
        }))
      });
    } else {
      // Create standard sample documents so demo has complete data
      await prisma.document.createMany({
        data: [
          {
            applicationId: application.id,
            docType: 'MODEL_APPROVAL',
            fileName: 'Model_Approval_Cert_Rule18.pdf',
            fileUrl: '/uploads/model_approval_sample.pdf',
            ocrExtractedText: `Govt. of India Model Approval Certificate: Brand: ${instrument.brand}, Model: ${instrument.modelNo}, Max: ${instrument.maxCapacity}kg, e: ${instrument.leastCount}kg`,
            verifiedByAi: true
          },
          {
            applicationId: application.id,
            docType: 'INVOICE',
            fileName: 'Purchase_Tax_Invoice.pdf',
            fileUrl: '/uploads/invoice_sample.pdf',
            ocrExtractedText: `Tax Invoice #9841. Buyer: ${req.user.name}. Item: ${instrument.brand} Scale ${instrument.modelNo}, Serial: ${instrument.serialNo}`,
            verifiedByAi: true
          }
        ]
      });
    }

    // Assign an inspector automatically from available inspectors
    const availableInspector = await prisma.user.findFirst({
      where: { role: 'INSPECTOR' }
    });

    if (availableInspector) {
      await prisma.inspection.create({
        data: {
          applicationId: application.id,
          inspectorId: availableInspector.id
        }
      });
    }

    // Trigger AI Decision-Support Pre-Check
    const aiResult = await runAiPreCheck(application.id, instrument);

    // Audit Log entry
    const blockHash = computeAuditBlockHash({
      action: 'APPLICATION_SUBMITTED',
      entityId: application.id,
      actorId: req.user.id,
      details: { applicationNo, instrumentUin: instrument.uin, aiScore: aiResult.score },
      timestamp: new Date()
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'APPLICATION',
        entityId: application.id,
        action: 'APPLICATION_SUBMITTED',
        actorId: req.user.id,
        actorRole: req.user.role,
        details: JSON.stringify({ applicationNo, aiStatus: aiResult.status }),
        blockHash
      }
    });

    const updatedApp = await prisma.application.findUnique({
      where: { id: application.id },
      include: {
        instrument: true,
        documents: true,
        inspection: true
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully. AI Pre-Check completed.',
      application: updatedApp,
      aiPreCheck: aiResult
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ error: 'Failed to submit verification application' });
  }
}

export async function getApplicationDetails(req, res) {
  try {
    const { id } = req.params;

    const application = await prisma.application.findFirst({
      where: {
        OR: [{ id }, { applicationNo: id }]
      },
      include: {
        business: {
          select: { id: true, name: true, email: true, phone: true, orgName: true, licenseNo: true }
        },
        instrument: true,
        documents: true,
        inspection: {
          include: {
            inspector: { select: { id: true, name: true, orgName: true, phone: true, licenseNo: true } }
          }
        },
        officerReview: {
          include: {
            officer: { select: { id: true, name: true, orgName: true, licenseNo: true } }
          }
        },
        certificate: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Fetch related audit logs to expose complete Digital Trust Chain
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        OR: [
          { entityId: application.id },
          { entityId: application.instrumentId }
        ]
      },
      orderBy: { timestamp: 'asc' }
    });

    res.json({ application, auditTrail: auditLogs });
  } catch (error) {
    console.error('Get application details error:', error);
    res.status(500).json({ error: 'Failed to retrieve application details' });
  }
}
