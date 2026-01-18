import "dotenv/config";
import express from "express";
import { setupAuth, isAuthenticated } from "../server/googleAuth";
import { storage } from "../server/storage";
import { chatWithFinancialAssistant, categorizePurchase, generateFinancialInsight } from "../server/geminiService";
import { insertGoalSchema, insertTransactionSchema, insertStashTransactionSchema } from "@shared/schema";
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
    // Setup authentication
    await setupAuth(app);
    
    // Register all API routes directly here
    app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
      try {
        const userId = req.user.id;
        const user = await storage.getUser(userId);
        res.json(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
      }
    });

    // Add a simple health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
    isInitialized = true;
    console.log("Routes initialized successfully");
  } catch (err) {
    console.error("Failed to initialize routes:", err);
    throw err;
  }
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    await initialize();
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error", message: String(error) });
  }
}
