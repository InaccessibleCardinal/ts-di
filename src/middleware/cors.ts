import { Request, Response, NextFunction } from 'express';
import { corsHeaders } from '../constants/headers';

export function cors(req: Request, res: Response, next: NextFunction) {
  for (const [key, value] of Object.entries(corsHeaders)) {
    res.setHeader(key, value);
  }
  next();
}
