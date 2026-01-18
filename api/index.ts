import "dotenv/config";
import express from "express";
import { registerRoutes } from "../server/routes";
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
let initPromise: Promise<void> | null = null;

async function initialize() {
  if (isInitialized) return;
  if (initPromise) return initPromise;
  
  initPromise = registerRoutes(app).then(() => {
    isInitialized = true;
    console.log("Routes initialized successfully");
  }).catch(err => {
    console.error("Failed to initialize routes:", err);
    throw err;
  });
  
  return initPromise;
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    await initialize();
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
