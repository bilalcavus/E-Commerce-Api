import bcrypt from 'bcrypt';
import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import { verifyToken } from '../middlewares/auth.js';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({message: 'Bu email adresi zaten kayıtlı'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }

        });
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.log('Register error', error);
        res.status(500).json({message: 'Kayıt hatası'});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({message: 'Geçersiz email veya şifre'});
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({message: 'Geçersiz email veya şifre'});
        }


        const { password: _, ...userWithoutPassword } = user;

        const token = jwt.sign(
            {
                id: user.id, email: user.email
            }, process.env.JWT_SCRET, {expiresIn: "1h"}
        );
        res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword,
            token: token
        });
    } catch (error) {
        console.log('Login error', error);
        res.status(500).json({message: 'Giriş hatası'});
    }
});

export default router;