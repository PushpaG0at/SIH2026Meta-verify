import { Router } from 'express';
import { listApplications, submitApplication, getApplicationDetails } from '../controllers/application.controller.js';
import { triggerAiCheckEndpoint } from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, listApplications);
router.post('/', authenticate, submitApplication);
router.get('/:id', authenticate, getApplicationDetails);
router.post('/:applicationId/ai-check', authenticate, triggerAiCheckEndpoint);

export default router;
