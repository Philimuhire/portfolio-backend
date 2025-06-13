import express from 'express';
import { 
  search, 
  searchProjectsOnly, 
  searchBlogsOnly,
  advancedSearchProjects,
  advancedSearchBlogs,
  getSearchSuggestions,
  getPopularSearchTerms
} from '../controllers/searchController';
import { cacheMiddleware } from '../middleware/cacheMiddleware';

const router = express.Router();

// Basic search endpoints
router.get('/', search);
router.get('/projects', searchProjectsOnly);
router.get('/blogs', searchBlogsOnly);

// Advanced search endpoints
router.get('/projects/advanced', advancedSearchProjects);
router.get('/blogs/advanced', advancedSearchBlogs);

// Search utilities
router.get('/suggestions', cacheMiddleware(2 * 60 * 1000), getSearchSuggestions); // Cache for 2 minutes
router.get('/popular', cacheMiddleware(60 * 60 * 1000), getPopularSearchTerms); // Cache for 1 hour

export default router;