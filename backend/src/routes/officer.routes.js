import { Router } from 'express';
import { getOfficerApplications, makeOfficerDecision } from '../controllers/officer.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/applications', authenticate, requireRole('OFFICER', 'ADMIN'), getOfficerApplications);
router.post('/applications/:applicationId/decision', authenticate, requireRole('OFFICER', 'ADMIN'), makeOfficerDecision);

export default router;
