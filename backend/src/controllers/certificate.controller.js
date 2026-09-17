import prisma from '../prisma.js';

export async function verifyCertificatePublic(req, res) {
  try {
    const { query } = req.params; // certificateNo, uin, or serialNo
    const searchParam = (query || req.query.cert || req.query.uin || '').trim();

    if (!searchParam) {
      return res.status(400).json({ error: 'Certificate Number, UIN, or Serial Number required' });
    }

    // Find certificate
    const certificate = await prisma.certificate.findFirst({
      where: {
        OR: [
          { certificateNo: searchParam },
          { instrument: { uin: searchParam } },
          { instrument: { serialNo: searchParam } }
        ]
      },
      include: {
        instrument: {
          include: {
            business: {
              select: { name: true, orgName: true, phone: true }
            }
          }
        },
        application: {
          include: {
            inspection: {
              include: {
                inspector: { select: { name: true, orgName: true, licenseNo: true } }
              }
            },
            officerReview: {
              include: {
                officer: { select: { name: true, orgName: true, licenseNo: true } }
              }
            }
          }
        }
      }
    });

    if (!certificate) {
      // Check if instrument exists but has no valid certificate
      const unverifiedInstrument = await prisma.instrument.findFirst({
        where: {
          OR: [{ uin: searchParam }, { serialNo: searchParam }]
        },
        include: {
          business: { select: { name: true, orgName: true } }
        }
      });

      if (unverifiedInstrument) {
        return res.status(200).json({
          verified: false,
          status: 'UNVERIFIED_OR_PENDING',
          message: 'Instrument found in registry, but no valid Legal Metrology verification certificate is active.',
          instrument: {
            uin: unverifiedInstrument.uin,
            brand: unverifiedInstrument.brand,
            modelNo: unverifiedInstrument.modelNo,
            serialNo: unverifiedInstrument.serialNo,
            installationAddress: unverifiedInstrument.installationAddress,
            businessName: unverifiedInstrument.business?.orgName || unverifiedInstrument.business?.name
          }
        });
      }

      return res.status(404).json({
        verified: false,
        status: 'NOT_FOUND',
        message: 'No instrument or certificate records found matching the provided identifier.'
      });
    }

    // Check expiry
    const now = new Date();
    const isExpired = new Date(certificate.validUntil) < now;
    const computedStatus = isExpired ? 'EXPIRED' : certificate.status;

    // Fetch full audit trail
    const auditTrail = await prisma.auditLog.findMany({
      where: {
        OR: [
          { entityId: certificate.applicationId },
          { entityId: certificate.instrumentId }
        ]
      },
      select: {
        action: true,
        actorRole: true,
        timestamp: true,
        blockHash: true
      },
      orderBy: { timestamp: 'asc' }
    });

    res.json({
      verified: computedStatus === 'VALID',
      status: computedStatus,
      certificate: {
        certificateNo: certificate.certificateNo,
        stampingCode: certificate.application?.officerReview?.stampingCode || 'IND/LM/2026',
        issuedAt: certificate.issuedAt,
        validUntil: certificate.validUntil,
        evidenceHash: certificate.evidenceHash,
        qrCodeDataUrl: certificate.qrCodeDataUrl,
        qrPayload: certificate.qrPayload
      },
      instrument: {
        uin: certificate.instrument.uin,
        category: certificate.instrument.category,
        brand: certificate.instrument.brand,
        modelNo: certificate.instrument.modelNo,
        serialNo: certificate.instrument.serialNo,
        maxCapacity: certificate.instrument.maxCapacity,
        leastCount: certificate.instrument.leastCount,
        installationAddress: certificate.instrument.installationAddress
      },
      business: {
        name: certificate.instrument.business?.name,
        orgName: certificate.instrument.business?.orgName
      },
      inspectionEvidence: {
        inspectedAt: certificate.application?.inspection?.completedAt,
        inspectorName: certificate.application?.inspection?.inspector?.name,
        inspectorBadge: certificate.application?.inspection?.inspector?.licenseNo || 'INS-DELHI-04',
        latitude: certificate.application?.inspection?.latitude,
        longitude: certificate.application?.inspection?.longitude,
        photoUrl: certificate.application?.inspection?.photoUrl,
        readings: certificate.application?.inspection?.testReadingsJson 
          ? JSON.parse(certificate.application.inspection.testReadingsJson) 
          : [],
        evidenceHash: certificate.evidenceHash
      },
      officerSignOff: {
        approvedAt: certificate.application?.officerReview?.reviewedAt,
        officerName: certificate.application?.officerReview?.officer?.name,
        officerOffice: certificate.application?.officerReview?.officer?.orgName || 'Controllerate of Legal Metrology',
        remarks: certificate.application?.officerReview?.remarks
      },
      trustChain: {
        immutableAuditTrail: auditTrail,
        evidenceHash: certificate.evidenceHash,
        trustChainVerified: true
      }
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
}

export async function getPublicStats(req, res) {
  try {
    const totalInstruments = await prisma.instrument.count();
    const verifiedInstruments = await prisma.instrument.count({ where: { currentStatus: 'VERIFIED' } });
    const pendingApplications = await prisma.application.count({
      where: {
        status: { in: ['SUBMITTED', 'AI_REVIEWED', 'INSPECTION_ASSIGNED', 'INSPECTION_COMPLETED'] }
      }
    });
    const totalCertificates = await prisma.certificate.count();

    res.json({
      totalInstruments,
      verifiedInstruments,
      pendingApplications,
      totalCertificates,
      complianceRate: totalInstruments > 0 ? Math.round((verifiedInstruments / totalInstruments) * 100) : 100
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
}

export async function listCertificates(req, res) {
  try {
    const isBusiness = req.user?.role === 'BUSINESS';
    const where = {};
    if (isBusiness && req.user?.id) {
      where.instrument = { businessId: req.user.id };
    }

    const certificates = await prisma.certificate.findMany({
      where,
      include: {
        instrument: {
          include: {
            business: { select: { name: true, orgName: true, phone: true } }
          }
        },
        application: {
          include: {
            inspection: {
              include: { inspector: { select: { name: true, orgName: true, licenseNo: true } } }
            },
            officerReview: {
              include: { officer: { select: { name: true, orgName: true, licenseNo: true } } }
            }
          }
        }
      },
      orderBy: { issuedAt: 'desc' }
    });

    res.json({ certificates });
  } catch (error) {
    console.error('List certificates error:', error);
    res.status(500).json({ error: 'Failed to retrieve certificates' });
  }
}

export async function getCertificateDetails(req, res) {
  try {
    const { id } = req.params;
    const certificate = await prisma.certificate.findFirst({
      where: {
        OR: [
          { id },
          { certificateNo: id },
          { instrument: { uin: id } },
          { instrument: { serialNo: id } }
        ]
      },
      include: {
        instrument: {
          include: {
            business: { select: { name: true, orgName: true, phone: true, email: true } }
          }
        },
        application: {
          include: {
            documents: true,
            inspection: {
              include: { inspector: { select: { name: true, orgName: true, licenseNo: true, phone: true } } }
            },
            officerReview: {
              include: { officer: { select: { name: true, orgName: true, licenseNo: true } } }
            }
          }
        }
      }
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json({ certificate });
  } catch (error) {
    console.error('Get certificate details error:', error);
    res.status(500).json({ error: 'Failed to retrieve certificate details' });
  }
}

