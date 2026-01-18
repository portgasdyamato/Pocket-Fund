// Minimal serverless function for debugging
export default async function handler(req: any, res: any) {
  try {
    // Log environment to help debug
    console.log('Function invoked:', {
      url: req.url,
      method: req.method,
      hasDbUrl: !!process.env.DATABASE_URL,
      hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
      nodeEnv: process.env.NODE_ENV
    });

    // Simple health check
    if (req.url === '/api/health' || req.url === '/health') {
      return res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        env: {
          hasDbUrl: !!process.env.DATABASE_URL,
          hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
          nodeEnv: process.env.NODE_ENV
        }
      });
    }

    // For now, return a simple response for all other routes
    return res.status(200).json({ 
      message: 'API is running',
      path: req.url,
      note: 'Full routes coming soon'
    });

  } catch (error: any) {
    console.error("Handler error:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: error?.message || String(error),
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
}
