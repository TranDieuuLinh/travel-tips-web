import { validateUsersCookie } from '../controllers/cookie.ts';
import type { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: { userId: bigint };
        }
    }
}

export function authmiddleware(req:Request,res:Response,next:NextFunction){
    const cookies = req.cookies;
    if(!cookies.information)  return res.status(401).json({ message: 'Unauthorized' });
    const parsed = validateUsersCookie(cookies.information);
    if (!parsed || !parsed.userId) return res.status(401).json({ message: 'Unauthorized' });
    req.user = { userId: parsed.userId };
    next();
}