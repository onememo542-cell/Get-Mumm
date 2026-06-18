// For Vercel serverless: Use a simple handler approach
let appCache;

export default async (req, res) => {
  try {
    // Cache the app import to avoid reimporting on every request
    if (!appCache) {
      const imported = await import('../backend/dist/index.mjs');
      appCache = imported.default;
    }
    
    const app = appCache;
    
    // Log for debugging
    console.log(`[Handler] ${req.method} ${req.url}`);
    
    // Call Express app with request and response objects
    // Express middleware chains work with Node.js req/res objects
    return app(req, res);
  } catch (error) {
    console.error('[Handler Error]', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      environment: {
        isVercel: process.env.VERCEL === "1",
        nodeEnv: process.env.NODE_ENV,
      }
    });
  }
};


