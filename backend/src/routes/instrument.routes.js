import { Router } from 'express';
import { listInstruments, registerInstrument, getInstrumentDetails } from '../controllers/instrument.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, listInstruments);
router.post('/', authenticate, requireRole('BUSINESS', 'ADMIN'), registerInstrument);
router.get('/:id', authenticate, getInstrumentDetails);

export default router;
