import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const {name, description, price, stockQuantity, categoryId, vendorId} = req.body;

        const product = await prisma.products.create({
            data: {
                name,
                description,
                price,
                stockQuantity,
                category : categoryId ?  {connect: {id: categoryId}} : undefined,
                vendor : vendorId ? {connect: {id: vendorId}} : undefined
            }
            
        });
        res.status(201).json(product);
    } catch (error) {
        console.log('Product adding error', error);
        res.status(500).json({message: 'Product eklerken hata.'});
    }
});


router.get('/allProducts', async (req, res) => {
    try {
        const products = await prisma.products.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;