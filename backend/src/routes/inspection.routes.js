import { Router } from 'express';
import { getAssignedInspections, submitInspectionEvidence } from '../controllers/inspection.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/assigned', authenticate, requireRole('INSPECTOR', 'ADMIN'), getAssignedInspections);
router.post('/:inspectionId/submit-evidence', authenticate, requireRole('INSPECTOR', 'ADMIN'), submitInspectionEvidence);

export default router;
