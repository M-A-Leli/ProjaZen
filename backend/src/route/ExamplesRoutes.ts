import { Router } from 'express';
import ExamplesController from '../controller/ExamplesController';

const router = Router();

router.get('/', ExamplesController.fetchAllExamples);
router.get('/:id', ExamplesController.fetchExampleById);
router.post('/', ExamplesController.createExample);
router.put('/:id', ExamplesController.updateExample);
router.delete('/:id', ExamplesController.deleteExample);

export default router;
