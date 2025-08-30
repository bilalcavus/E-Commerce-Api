import bcrypt from 'bcrypt';
import express from 'express';
import jwt from "jsonwebtoken";
import { PrismaClient } from '../generated/prisma/index.js';
import { verifyToken } from '../middlewares/auth.js';
import { AuthError, ValidationError } from '../utils/handler/app_error.js';
import { asyncHandler } from '../utils/handler/async_handler.js';

const prisma = new PrismaClient();

const router = express.Router();

router.post('/register', asyncHandler(async  (req, res) => {
        const {name, surname, email, password, phone, address, role} = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new ValidationError("Already registered this email")
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: {
                name,
                surname,
                email,
                password: hashedPassword,
                phone,
                address,
                role,
            }

        });
        const { password: _, ...data } = user;
        res.status(201).json({success: true, data});
    
}));

router.post('/login', asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        }); //email'e göre kullanıcıyı bulma

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!user || !isValidPassword) {
            throw new AuthError("Invalid email or password");
        }

        const { password: _, ...userWithoutPassword } = user;

        const token = jwt.sign(
            {id: user.id, email: user.email}, process.env.JWT_SCRET, {expiresIn: "1h"}
        );
        res.status(200).json({
            success: true,
            user: userWithoutPassword,
            token: token
        });
}))


router.get('/getUser/:id', verifyToken, asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    if(!id || id.trim() === ""){
        throw new ValidationError("Invalid user id");
    }

    const user = await prisma.user.findUnique({
        where: {id: id}
    });

    if(!user){
        throw new NotFoundError("User not found");
    }

    res.json({success: true, data: user});
}));

export default router;