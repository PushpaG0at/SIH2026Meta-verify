import prisma from '../prisma.js';
import { generateCertificateNo, generateTamperProofQRCode, computeAuditBlockHash } from '../services/trustChain.js';

export async function getOfficerApplications(req, res) {
  try {
    const { filter } = req.query;

    const where = {};
    if (filter === 'PENDING') {
      where.status = 'INSPECTION_COMPLETED';
    } else if (filter === 'APPROVED') {
      where.status = 'OFFICER_APPROVED';
    } else if (filter === 'REJECTED') {
      where.status = 'OFFICER_REJECTED';
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        business: { select: { id: true, name: true, orgName: true, phone: true, email: true, licenseNo: true } },
        instrument: true,
        documents: true,
        inspection: {
          include: {
            inspector: { select: { id: true, name: true, orgName: true, phone: true, licenseNo: true } }
          }
        },
        officerReview: true,
        certificate: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ applications });
  } catch (error) {
    console.error('Officer get applications error:', error);
    res.status(500).json({ error: 'Failed to retrieve officer review queue' });
  }
}

export async function makeOfficerDecision(req, res) {
  try {
    const { applicationId } = req.params;
    const { decision, remarks, stampingCode } = req.body;

    const validDecisions = ['APPROVED', 'REJECTED', 'CORRECTION_REQUESTED', 'RETURNED_FOR_REINSPECTION'];
    if (!decision || !validDecisions.includes(decision)) {
      return res.status(400).json({ error: `Decision must be one of [${validDecisions.join(', ')}]` });
    }

    if (!remarks) {
      return res.status(400).json({ error: 'Officer remarks are mandatory' });
    }

    const application = await prisma.application.findFirst({
      where: {
        OR: [{ id: applicationId }, { applicationNo: applicationId }]
      },
      include: {
        instrument: true,
        inspection: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const targetAppId = application.id;
    const issuedAt = new Date();
    // 1 Year validity under Legal Metrology rules
    const validUntil = new Date(issuedAt.getTime() + 365 * 24 * 60 * 60 * 1000);

    // 1. Record Officer Review
    const officerReview = await prisma.officerReview.upsert({
      where: { applicationId: targetAppId },
      create: {
        applicationId: targetAppId,
        officerId: req.user.id,
        decision,
        remarks,
        stampingCode: stampingCode || `IND/LM/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
        validUntil: decision === 'APPROVED' ? validUntil : null,
        reviewedAt: issuedAt
      },
      update: {
        officerId: req.user.id,
        decision,
        remarks,
        stampingCode: stampingCode || `IND/LM/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
        validUntil: decision === 'APPROVED' ? validUntil : null,
        reviewedAt: issuedAt
      }
    });

    let certificate = null;

    if (decision === 'APPROVED') {
      const certificateNo = generateCertificateNo();
      const evidenceHash = application.inspection?.evidenceHash || '0000000000000000000000000000000000000000000000000000000000000000';

      const publicBaseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:5174';
      const { verificationUrl, qrDataUrl } = await generateTamperProofQRCode(
        certificateNo,
        evidenceHash,
        publicBaseUrl
      );

      // Create Certificate
      certificate = await prisma.certificate.create({
        data: {
          certificateNo,
          applicationId: targetAppId,
          instrumentId: application.instrumentId,
          issuedAt,
          validUntil,
          qrPayload: verificationUrl,
          qrCodeDataUrl: qrDataUrl,
          evidenceHash,
          status: 'VALID'
        }
      });

      // Update Instrument Status to VERIFIED
      await prisma.instrument.update({
        where: { id: application.instrumentId },
        data: { currentStatus: 'VERIFIED' }
      });

      // Update Application status
      await prisma.application.update({
        where: { id: targetAppId },
        data: { status: 'OFFICER_APPROVED' }
      });
    } else if (decision === 'REJECTED') {
      await prisma.instrument.update({
        where: { id: application.instrumentId },
        data: { currentStatus: 'FLAGGED' }
      });

      await prisma.application.update({
        where: { id: targetAppId },
        data: { status: 'OFFICER_REJECTED' }
      });
    } else {
      // CORRECTION_REQUESTED / RETURNED_FOR_REINSPECTION
      await prisma.application.update({
        where: { id: targetAppId },
        data: { status: 'CORRECTION_REQUESTED' }
      });
    }

    // Record in Audit Log
    const actionName = decision === 'APPROVED' 
      ? 'OFFICER_APPROVED_CERT_ISSUED' 
      : (decision === 'REJECTED' ? 'OFFICER_REJECTED' : 'OFFICER_CORRECTION_REQUESTED');

    const blockHash = computeAuditBlockHash({
      action: actionName,
      entityId: targetAppId,
      actorId: req.user.id,
      details: {
        decision,
        remarks,
        certificateNo: certificate?.certificateNo,
        stampingCode: officerReview.stampingCode
      },
      timestamp: issuedAt
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'APPLICATION',
        entityId: targetAppId,
        action: actionName,
        actorId: req.user.id,
        actorRole: req.user.role,
        details: JSON.stringify({ decision, certificateNo: certificate?.certificateNo }),
        blockHash
      }
    });

    res.json({
      message: decision === 'APPROVED' 
        ? 'Application approved. Tamper-evident Digital Verification Certificate generated.' 
        : (decision === 'REJECTED'
          ? 'Application rejected. Deficiencies communicated to applicant.'
          : 'Deficiency notice dispatched to applicant for correction.'),
      decision,
      officerReview,
      certificate
    });
  } catch (error) {
    console.error('Officer decision error:', error);
    res.status(500).json({ error: 'Failed to record officer decision' });
  }
}
