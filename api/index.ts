import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import cors from "cors";

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === "development" 
    ? "http://localhost:5173" 
    : process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// Basic middleware
app.use(express.json({
  limit: '10mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Initialize routes
let routesInitialized = false;
const initializeRoutes = async () => {
  if (!routesInitialized) {
    await registerRoutes(app);
    routesInitialized = true;
  }
};

// Vercel serverless function handler
export default async (req: Request, res: Response) => {
  await initializeRoutes();
  return app(req, res);
};
