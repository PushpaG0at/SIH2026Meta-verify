import { Router } from 'express';
import { preCheckUploadEndpoint, triggerAiCheckEndpoint } from '../controllers/ai.controller.js';
import { upload } from './upload.routes.js';

const router = Router();

// AI Pre-check and vision analysis on uploaded documents
router.post('/pre-check', upload.single('file'), preCheckUploadEndpoint);
router.post('/analyze-document', upload.single('file'), preCheckUploadEndpoint);

// Application-specific AI pre-check triggers
router.post('/run-check/:applicationId', triggerAiCheckEndpoint);
router.post('/trigger/:applicationId', triggerAiCheckEndpoint);

// AI Engine health / info endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'METRA-VERIFY AI Pre-Check & Vision Scrutiny Engine',
    capabilities: ['Tesseract OCR', 'Rule 18 Verification', 'Gemini Vision (Optional)', 'Heuristic Compliance']
  });
});

export default router;
