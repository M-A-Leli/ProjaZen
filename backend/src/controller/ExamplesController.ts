import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ExampleService from '../service/ExamplesService';
import Example from '../model/Example';

class ExampleController {
    constructor() {
        this.fetchAllExamples = this.fetchAllExamples.bind(this);
        this.fetchExampleById = this.fetchExampleById.bind(this);
        this.createExample = this.createExample.bind(this);
        this.updateExample = this.updateExample.bind(this);
        this.deleteExample = this.deleteExample.bind(this);
    }

    async fetchAllExamples(req: Request, res: Response, next: NextFunction) {
        try {
            const dummies = await ExampleService.getAllExamples();
            res.json(dummies.map((example: Example) => this.transformExample(example)));
        } catch (error) {
            next(error);
        }
    }

    async fetchExampleById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const example = await ExampleService.getExampleById(id);
            res.json(this.transformExample(example));
        } catch (error) {
            next(error);
        }
    }

    async createExample(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newExample = await ExampleService.createExample(req.body.attr1, req.body.attr2);
            res.status(201).json(this.transformExample(newExample));
        } catch (error) {
            next(error);
        }
    }

    async updateExample(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const exampleToUpdate = new Example(
                id,
                req.body.attr1,
                req.body.attr2
            );
            const updatedExample = await ExampleService.updateExample(exampleToUpdate);
            res.json(this.transformExample(updatedExample));
        } catch (error) {
            next(error);
        }
    }

    async deleteExample(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deletedExample = await ExampleService.deleteExample(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    private transformExample(example: Example) {
        return {
            id: example.id,
            attr1: example.attr1,
            attr2: example.attr2
        };
    }
}

export default new ExampleController();
