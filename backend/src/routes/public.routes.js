import { Router } from 'express';
import { verifyCertificatePublic, getPublicStats } from '../controllers/certificate.controller.js';

const router = Router();

router.get('/verify', verifyCertificatePublic);
router.get('/verify/:query', verifyCertificatePublic);
router.get('/stats', getPublicStats);

export default router;
