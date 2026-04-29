import { Router } from 'express';
import authRoutes from './auth.routes';
import applicationRoutes from './application.routes';
import loanRoutes from './loan.routes';
import dashboardRoutes from './dashboard.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/application', applicationRoutes);
router.use('/loan', loanRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/payment', paymentRoutes);

export default router;
