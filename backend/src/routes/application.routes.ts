import { Router } from 'express';
import { submitPersonalDetails, uploadSalarySlip } from '../controllers/application.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { applicationSchema } from '../validators';

const router = Router();

// Only BORROWER can apply
router.use(protect, authorize('BORROWER'));

router.post('/personal-details', validate(applicationSchema), submitPersonalDetails);
router.post('/upload-slip', uploadSalarySlip);

export default router;
