import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is required");
  }
  
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: sessionTtl,
      domain: process.env.NODE_ENV === "development" ? "localhost" : undefined
    },
  });
}

async function upsertUser(profile: any) {
  // Only upsert safe identity fields — never touch walletBalance or other user data
  await storage.upsertUser({
    id: String(profile.id),  // Ensure it's always a string
    email: profile.emails?.[0]?.value,
    firstName: profile.name?.givenName,
    lastName: profile.name?.familyName,
    profileImageUrl: profile.photos?.[0]?.value,
  });
}

export async function setupAuth(app: Express) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("GOOGLE_CLIENT_ID not set");
    return;
  }
  
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.error("GOOGLE_CLIENT_SECRET not set");
    return;
  }
  
  if (!process.env.SESSION_SECRET) {
    console.error("SESSION_SECRET not set");
    return;
  }

  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          await upsertUser(profile);
          // Fetch the full user from DB to ensure we have the correct object
          const dbUser = await storage.getUser(String(profile.id));
          if (!dbUser) {
            return done(new Error("Failed to create/retrieve user"), false);
          }
          return done(null, dbUser);
        } catch (error) {
          console.error("[Auth] Error in GoogleStrategy:", error);
          return done(error, false);
        }
      }
    )
  );

  // ✅ FIXED: Store only the user's DB ID in the session (not the giant profile object)
  passport.serializeUser((user: any, cb) => {
    cb(null, user.id);
  });

  // ✅ FIXED: Re-fetch the user from DB using the stored ID
  passport.deserializeUser(async (id: string, cb) => {
    try {
      const user = await storage.getUser(String(id));
      if (!user) {
        return cb(null, false);
      }
      cb(null, user);
    } catch (error) {
      console.error("[Auth] deserializeUser error:", error);
      cb(error, false);
    }
  });

  app.get("/api/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"  // Always show account picker for multi-account support
  }));

  app.get("/api/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/?auth_error=1" }),
    (req, res) => {
      // Successful authentication — redirect to dashboard
      res.redirect("/");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      req.session.destroy(() => {
        res.redirect("/");
      });
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};
