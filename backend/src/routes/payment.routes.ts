import { Router } from 'express';
import { addPayment } from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { paymentSchema } from '../validators';

const router = Router();

router.use(protect, authorize('ADMIN', 'COLLECTION'));

router.post('/:loanId', validate(paymentSchema), addPayment);

export default router;
