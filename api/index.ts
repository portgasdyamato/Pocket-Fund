
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

// Register routes
// We need to use an async wrapper because registerRoutes is async
// but Vercel expects an exported app or a handler.
// Express apps are valid handlers.
// However, registerRoutes awaits setupAuth which might await DB connection.
// We should ensure this happens.

// To handle async initialization in Vercel/Express:
// We can lazily initialize inside the handler or just hope top-level await works (it does in newer Node versions on Vercel).
// But standard Express export doesn't wait.

// Better pattern for Vercel + Express + Async Init:
registerRoutes(app).catch(err => {
  console.error("Failed to register routes", err);
});

export default app;
