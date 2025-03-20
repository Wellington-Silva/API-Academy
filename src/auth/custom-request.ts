/* istanbul ignore file */
import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: { id: string; email: string; type?: number };
}