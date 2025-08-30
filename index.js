import express from 'express';
import authRouter from './routes/authentication_router.js';
import productRouter from './routes/product_router.js';
import categoryRouter from './routes/category_router.js';

import { PrismaClient } from './generated/prisma/index.js';
import { errorHandler } from './middlewares/error_handler.js';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());
app.get('/health', (req, res) => {
    res.status(200).json({status: 'ok', message: 'Server is running!'})
});

app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});