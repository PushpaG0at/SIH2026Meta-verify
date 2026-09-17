import prisma from '../prisma.js';
import { generateDigitalInstrumentId, computeAuditBlockHash } from '../services/trustChain.js';

export async function listInstruments(req, res) {
  try {
    const isBusiness = req.user.role === 'BUSINESS';
    const where = isBusiness ? { businessId: req.user.id } : {};

    const instruments = await prisma.instrument.findMany({
      where,
      include: {
        business: {
          select: { name: true, orgName: true, phone: true }
        },
        applications: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        certificates: {
          orderBy: { issuedAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ instruments });
  } catch (error) {
    console.error('List instruments error:', error);
    res.status(500).json({ error: 'Failed to retrieve instruments' });
  }
}

export async function registerInstrument(req, res) {
  try {
    const {
      category,
      brand,
      modelNo,
      serialNo,
      maxCapacity,
      minCapacity,
      leastCount,
      installationAddress,
      latitude,
      longitude
    } = req.body;

    if (!category || !brand || !modelNo || !serialNo || !maxCapacity || !leastCount || !installationAddress) {
      return res.status(400).json({
        error: 'Required: category, brand, modelNo, serialNo, maxCapacity, leastCount, installationAddress'
      });
    }

    const existing = await prisma.instrument.findUnique({ where: { serialNo } });
    if (existing) {
      return res.status(409).json({ error: `Instrument with Serial No '${serialNo}' already registered` });
    }

    const uin = generateDigitalInstrumentId(category);

    const instrument = await prisma.instrument.create({
      data: {
        uin,
        businessId: req.user.id,
        category,
        brand,
        modelNo,
        serialNo,
        maxCapacity: parseFloat(maxCapacity),
        minCapacity: parseFloat(minCapacity || 0),
        leastCount: parseFloat(leastCount),
        installationAddress,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        currentStatus: 'UNVERIFIED'
      }
    });

    // Record in Audit Log
    const blockHash = computeAuditBlockHash({
      action: 'INSTRUMENT_REGISTERED',
      entityId: instrument.id,
      actorId: req.user.id,
      details: { uin: instrument.uin, serialNo: instrument.serialNo, modelNo: instrument.modelNo },
      timestamp: new Date()
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'INSTRUMENT',
        entityId: instrument.id,
        action: 'INSTRUMENT_REGISTERED',
        actorId: req.user.id,
        actorRole: req.user.role,
        details: JSON.stringify({ uin: instrument.uin, serialNo: instrument.serialNo }),
        blockHash
      }
    });

    res.status(201).json({
      message: 'Instrument registered successfully. Unique UIN issued.',
      instrument
    });
  } catch (error) {
    console.error('Register instrument error:', error);
    res.status(500).json({ error: 'Failed to register instrument' });
  }
}

export async function getInstrumentDetails(req, res) {
  try {
    const { id } = req.params;

    const instrument = await prisma.instrument.findFirst({
      where: {
        OR: [{ id }, { uin: id }, { serialNo: id }]
      },
      include: {
        business: {
          select: { id: true, name: true, orgName: true, email: true, phone: true, licenseNo: true }
        },
        applications: {
          include: {
            documents: true,
            inspection: {
              include: {
                inspector: { select: { name: true, orgName: true } }
              }
            },
            officerReview: {
              include: {
                officer: { select: { name: true, orgName: true } }
              }
            },
            certificate: true
          },
          orderBy: { createdAt: 'desc' }
        },
        certificates: {
          orderBy: { issuedAt: 'desc' }
        }
      }
    });

    if (!instrument) {
      return res.status(404).json({ error: 'Instrument not found' });
    }

    res.json({ instrument });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get instrument details' });
  }
}
