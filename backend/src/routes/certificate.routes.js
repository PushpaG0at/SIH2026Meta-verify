import { Router } from 'express';
import { listCertificates, getCertificateDetails, verifyCertificatePublic } from '../controllers/certificate.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, listCertificates);
router.get('/:id', getCertificateDetails);
router.get('/verify/:query', verifyCertificatePublic);

export default router;
