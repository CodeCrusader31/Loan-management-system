import { Router } from 'express';
import {
  getSalesDashboard,
  getSanctionDashboard,
  updateLoanSanction,
  getDisbursementDashboard,
  updateLoanDisburse,
  getCollectionDashboard,
} from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';

const router = Router();

router.use(protect);

// SALES
router.get('/sales', authorize('ADMIN', 'SALES'), getSalesDashboard);

// SANCTION
router.get('/sanction', authorize('ADMIN', 'SANCTION'), getSanctionDashboard);
router.patch('/loan/:id/sanction', authorize('ADMIN', 'SANCTION'), updateLoanSanction);

// DISBURSEMENT
router.get('/disbursement', authorize('ADMIN', 'DISBURSEMENT'), getDisbursementDashboard);
router.patch('/loan/:id/disburse', authorize('ADMIN', 'DISBURSEMENT'), updateLoanDisburse);

// COLLECTION
router.get('/collection', authorize('ADMIN', 'COLLECTION'), getCollectionDashboard);

export default router;
