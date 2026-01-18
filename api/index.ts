import "dotenv/config";
import express from "express";
import { setupRoutes } from "../server/setupRoutes";
import cors from "cors";

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "https://pocket-fund-theta.vercel.app",
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

// Initialize routes once
let isInitialized = false;

async function initialize() {
  if (isInitialized) return;
  
  try {
    console.log('Initializing routes...');
    await setupRoutes(app);
    isInitialized = true;
    console.log('Routes initialized successfully');
  } catch (err) {
    console.error('Failed to initialize routes:', err);
    throw err;
  }
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    await initialize();
    return app(req, res);
  } catch (error: any) {
    console.error("Handler error:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: error?.message || String(error),
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
}
