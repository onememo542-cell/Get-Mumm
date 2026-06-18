// For Vercel serverless: Use a simple handler approach
export default async (req, res) => {
  try {
    // Import dynamically to avoid module loading issues
    const { default: app } = await import('../backend/dist/index.mjs');
    
    // Call Express app with request and response objects
    // Express middleware chains work with Node.js req/res objects
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};


