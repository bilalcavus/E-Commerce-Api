import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const {name, parentId} = req.body;
        const category = await prisma.categories.create({
            data: {
                name,
                parent: parentId ? {connect: {id: parentId} } : undefined
            }
        });

        res.status(201).json(category);
    } catch (error) {
        console.log('Category error', error);
        res.status(500).json({message: 'Category error'});
    }
});

router.get('/allCategories', async (req, res) => {
    try {
        const categories = await prisma.categories.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;