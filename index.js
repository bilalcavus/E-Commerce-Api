import authRouter from './routes/authentication_router.js'
import express from 'express'

const app = express();
const port = 3000;

app.use(express.json());
app.get('/health', (req, res) => {
    res.status(200).json({status: 'ok', message: 'Server is running!'})
});

app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});