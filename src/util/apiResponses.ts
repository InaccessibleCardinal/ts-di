import { Response } from 'express';

export function okResponse(value: any, res: Response, statusCode: number) {
  res.status(statusCode).json(value);
}

export function errorResponse(err: Error, res: Response, statusCode: number) {
  res.status(statusCode).json({ message: err.message });
}
