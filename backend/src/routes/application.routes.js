import { Router } from 'express';
import { listApplications, submitApplication, getApplicationDetails } from '../controllers/application.controller.js';
import { triggerAiCheckEndpoint } from '../controllers/ai.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, listApplications);
router.post('/', authenticate, requireRole('BUSINESS', 'ADMIN'), submitApplication);
router.get('/:id', authenticate, getApplicationDetails);
router.post('/:applicationId/ai-check', authenticate, triggerAiCheckEndpoint);

export default router;
