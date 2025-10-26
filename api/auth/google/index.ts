import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setupAuth } from '../../../server/googleAuth';
import express from 'express';

const app = express();
setupAuth(app);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}