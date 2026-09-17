import { Router } from 'express';
import authRoutes from './auth.routes.js';
import instrumentRoutes from './instrument.routes.js';
import applicationRoutes from './application.routes.js';
import inspectionRoutes from './inspection.routes.js';
import officerRoutes from './officer.routes.js';
import publicRoutes from './public.routes.js';
import certificateRoutes from './certificate.routes.js';
import uploadRoutes from './upload.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/instruments', instrumentRoutes);
apiRouter.use('/applications', applicationRoutes);
apiRouter.use('/inspections', inspectionRoutes);
apiRouter.use('/officer', officerRoutes);
apiRouter.use('/certificates', certificateRoutes);
apiRouter.use('/public', publicRoutes);
apiRouter.use('/upload', uploadRoutes);

export default apiRouter;

