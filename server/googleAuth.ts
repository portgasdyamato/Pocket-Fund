import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Environment variable GOOGLE_CLIENT_ID not provided");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Environment variable GOOGLE_CLIENT_SECRET not provided");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("Environment variable SESSION_SECRET not provided");
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

async function upsertUser(profile: any) {
  await storage.upsertUser({
    id: profile.id,
    email: profile.emails?.[0]?.value,
    firstName: profile.name?.givenName,
    lastName: profile.name?.familyName,
    profileImageUrl: profile.photos?.[0]?.value,
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/api/auth/google/callback",
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          await upsertUser(profile);
          return done(null, profile);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
  }));

  app.get("/api/auth/google/callback", 
    passport.authenticate("google", { 
      failureRedirect: process.env.NODE_ENV === "production" 
        ? "https://pocket-fund-theta.vercel.app/login"
        : "http://localhost:3000/login"
    }),
    (req, res) => {
      const redirectUrl = process.env.NODE_ENV === "production"
        ? "https://pocket-fund-theta.vercel.app"
        : "http://localhost:3000";
      res.redirect(redirectUrl);
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};

