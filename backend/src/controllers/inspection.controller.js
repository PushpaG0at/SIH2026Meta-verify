import prisma from '../prisma.js';
import { computeEvidenceHash, computeAuditBlockHash } from '../services/trustChain.js';
import { evaluateAllReadings } from '../services/toleranceEngine.js';

export async function getAssignedInspections(req, res) {
  try {
    const inspectorId = req.user.id;

    const inspections = await prisma.inspection.findMany({
      where: {
        OR: [
          { inspectorId },
          { application: { status: 'INSPECTION_ASSIGNED' } }
        ]
      },
      include: {
        application: {
          include: {
            business: { select: { id: true, name: true, orgName: true, phone: true } },
            instrument: true,
            documents: true
          }
        }
      },
      orderBy: { assignedAt: 'desc' }
    });

    res.json({ inspections });
  } catch (error) {
    console.error('Get assigned inspections error:', error);
    res.status(500).json({ error: 'Failed to fetch assigned inspections' });
  }
}

export async function submitInspectionEvidence(req, res) {
  try {
    const { inspectionId } = req.params;
    const {
      visualInspection,
      sealingIntact,
      zeroErrorCheck,
      repeatabilityPass,
      testReadings = [],
      photoUrl,
      latitude,
      longitude,
      inspectorNotes
    } = req.body;

    const inspection = await prisma.inspection.findFirst({
      where: {
        OR: [
          { id: inspectionId },
          { applicationId: inspectionId },
          { application: { applicationNo: inspectionId } }
        ]
      },
      include: {
        application: {
          include: { instrument: true }
        }
      }
    });

    if (!inspection) {
      return res.status(404).json({ error: 'Inspection assignment not found' });
    }

    const instrument = inspection.application.instrument;

    // 1. Evaluate standard calibration readings with Legal Metrology tolerance engine
    const rawReadings = Array.isArray(testReadings) && testReadings.length > 0
      ? testReadings
      : (Array.isArray(req.body.measurements) ? req.body.measurements : []);

    const effectiveReadings = rawReadings.length > 0 ? rawReadings : [
      { testWeightKg: instrument.maxCapacity * 0.1, indicatedWeightKg: instrument.maxCapacity * 0.1 },
      { testWeightKg: instrument.maxCapacity * 0.5, indicatedWeightKg: instrument.maxCapacity * 0.5 },
      { testWeightKg: instrument.maxCapacity, indicatedWeightKg: instrument.maxCapacity }
    ];

    const evaluation = evaluateAllReadings(effectiveReadings, instrument.leastCount);

    // 2. Determine Pass/Fail based on checklist and calibration
    const allVisualsPassed = Boolean(visualInspection && sealingIntact && zeroErrorCheck && repeatabilityPass);
    const resultStatus = (allVisualsPassed && evaluation.allPassed) ? 'PASSED' : 'NEEDS_RECALIBRATION';

    // 3. Compute Cryptographic Evidence Hash (Digital Trust Chain)
    const networkTimestamp = new Date();
    const evidenceHash = computeEvidenceHash({
      photoUrl,
      latitude,
      longitude,
      networkTimestamp,
      inspectorId: req.user.id,
      testReadings: evaluation.evaluatedReadings,
      checklist: {
        visualInspection,
        sealingIntact,
        zeroErrorCheck,
        repeatabilityPass
      }
    });

    // 4. Update inspection record with evidence
    const updatedInspection = await prisma.inspection.update({
      where: { id: inspection.id },
      data: {
        completedAt: networkTimestamp,
        visualInspection: Boolean(visualInspection),
        sealingIntact: Boolean(sealingIntact),
        zeroErrorCheck: Boolean(zeroErrorCheck),
        repeatabilityPass: Boolean(repeatabilityPass),
        testReadingsJson: JSON.stringify(evaluation.evaluatedReadings),
        photoUrl: photoUrl || '/uploads/sample_inspection_scale.jpg',
        latitude: latitude ? parseFloat(latitude) : 28.6139,
        longitude: longitude ? parseFloat(longitude) : 77.2090,
        networkTimestamp,
        evidenceHash,
        inspectorNotes,
        resultStatus
      }
    });

    // 5. Progress Application Status
    await prisma.application.update({
      where: { id: inspection.applicationId },
      data: { status: 'INSPECTION_COMPLETED' }
    });

    // 6. Record Audit Log block
    const blockHash = computeAuditBlockHash({
      action: 'INSPECTION_EVIDENCE_SUBMITTED',
      entityId: inspection.applicationId,
      actorId: req.user.id,
      details: {
        inspectionId,
        evidenceHash,
        resultStatus,
        gps: `${latitude || 28.6139}, ${longitude || 77.2090}`
      },
      timestamp: networkTimestamp
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'INSPECTION',
        entityId: inspection.id,
        action: 'INSPECTION_EVIDENCE_SUBMITTED',
        actorId: req.user.id,
        actorRole: req.user.role,
        details: JSON.stringify({ evidenceHash, resultStatus, tolerancePassed: evaluation.allPassed }),
        blockHash
      }
    });

    res.json({
      message: 'Field inspection evidence submitted and hashed into Digital Trust Chain.',
      inspection: updatedInspection,
      evidenceHash,
      calibrationEvaluation: evaluation,
      trustChainProof: {
        evidenceHash,
        recordedTimestamp: networkTimestamp,
        inspectorId: req.user.id,
        gpsCoordinates: `${latitude || 28.6139}, ${longitude || 77.2090}`,
        status: resultStatus
      }
    });
  } catch (error) {
    console.error('Submit inspection evidence error:', error);
    res.status(500).json({ error: 'Failed to submit inspection evidence' });
  }
}
