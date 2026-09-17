import { Router } from 'express';
import { listInstruments, registerInstrument, getInstrumentDetails } from '../controllers/instrument.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, listInstruments);
router.post('/', authenticate, registerInstrument);
router.get('/:id', authenticate, getInstrumentDetails);

export default router;
