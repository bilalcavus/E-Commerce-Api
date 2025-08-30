import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({message: "Token required!"});
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SCRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid token!"});
    }
};
