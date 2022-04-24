import { Response } from 'express';
import { okResponse, errorResponse } from './apiResponses';

const mockRes = {
  status: jest.fn(() => mockRes),
  json: jest.fn(),
} as unknown as Response;

describe('okResponse', () => {
  it('should invoke response methods', () => {
    okResponse({data: 'test'}, mockRes, 200);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({data: 'test'});
  });
});

describe('errorResponse', () => {
  it('should invoke response methods', () => {
    const testErr = new Error('you mad');
    errorResponse(testErr, mockRes, 400);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({message: 'you mad'});
  });
});