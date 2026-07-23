import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { createCategorySchema, updateCategorySchema } from '../validations/category.validation';

const router = Router();

// All category routes require authentication
router.use(protect);

router
  .route('/')
  .post(validate(createCategorySchema), categoryController.createCategory)
  .get(categoryController.getCategories);

router
  .route('/:id')
  .put(validate(updateCategorySchema), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default router;