import { Router } from 'express';
import { applyForLoan, getMyLoans } from '../controllers/loan.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { loanApplySchema } from '../validators';

const router = Router();

router.use(protect, authorize('BORROWER'));

router.post('/apply', validate(loanApplySchema), applyForLoan);
router.get('/my-loans', getMyLoans);

export default router;
