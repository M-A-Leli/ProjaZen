import express from 'express';
import examplesRoutes from './ExamplesRoutes';
// import other routes

const router = express.Router();

// Mount routes
router.use('/assignments', examplesRoutes);
// mount other routers

export default router;
