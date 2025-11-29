import express from 'express';
import productCommRouter from './productCommentRouter.js';
import { upload } from '../middlewares/imageUpload.js';
import { parseFormData } from '../middlewares/formDataParser.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { CreateProduct, PatchProduct } from '../structs/productStructs.js';
import {
  createProduct,
  patchProduct,
  getProductDetail,
  getProductList,
  deleteProduct,
} from '../controllers/productController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

// productComment
router.use('/comments', productCommRouter);

router
  .route('/')
  .post(
    upload.array('images', 1),
    parseFormData,
    validate(CreateProduct),
    authenticate,
    asyncHandler(createProduct),
  )
  .get(asyncHandler(getProductList));

router
  .route('/:id')
  .patch(
    upload.array('images', 1),
    parseFormData,
    validate(PatchProduct),
    authenticate,
    asyncHandler(patchProduct),
  )
  .get(asyncHandler(getProductDetail))
  .delete(authenticate, asyncHandler(deleteProduct));

export default router;
