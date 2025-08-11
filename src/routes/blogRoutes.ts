import express from 'express';
import { 
  getBlogs, 
  getBlogById, 
  createBlog, 
  updateBlog, 
  deleteBlog,
  addBlogComment,
  getBlogComments,
  addBlogReaction,
  getBlogReactions
} from '../controllers/blogController';
import { protect, admin } from '../middleware/auth';
import { blogValidation, commentValidation, reactionValidation } from '../middleware/validators';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, admin, upload.single('coverImage'), blogValidation, createBlog);

router.route('/:id')
  .get(getBlogById)
  .put(protect, admin, blogValidation, updateBlog)
  .delete(protect, admin, deleteBlog);

router.route('/:id/comments')
  .get(getBlogComments)
  .post(commentValidation, addBlogComment);

router.route('/:id/reactions')
  .get(getBlogReactions)
  .post(reactionValidation, addBlogReaction);

export default router;