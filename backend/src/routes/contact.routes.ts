import { Router } from 'express';
import * as contactController from '../controllers/contact.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { uploadCSV } from '../middlewares/upload.middleware';
import { createContactSchema, updateContactSchema, getContactsQuerySchema } from '../validations/contact.validation';

const router = Router();

router.use(protect);

router.get('/stats/dashboard', contactController.getDashboardStats);

// NEW: Import/Export Routes
router.get('/export', contactController.exportContacts);
router.post('/import', uploadCSV.single('file'), contactController.importContacts);

router
  .route('/')
  .post(validate(createContactSchema), contactController.createContact)
  .get(validate(getContactsQuerySchema), contactController.getContacts);

router
  .route('/:id')
  .get(contactController.getContactById)
  .put(validate(updateContactSchema), contactController.updateContact)
  .delete(contactController.deleteContact);

export default router;