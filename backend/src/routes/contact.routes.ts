import { Router } from 'express';
import * as contactController from '../controllers/contact.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { createContactSchema, updateContactSchema } from '../validations/contact.validation';

const router = Router();

// All contact routes require authentication
router.use(protect);

router
  .route('/')
  .post(validate(createContactSchema), contactController.createContact)
  .get(contactController.getContacts);

router
  .route('/:id')
  .get(contactController.getContactById)
  .put(validate(updateContactSchema), contactController.updateContact)
  .delete(contactController.deleteContact);

export default router;