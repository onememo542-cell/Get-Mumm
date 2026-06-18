import app from '../backend/dist/index.mjs';

// Create a handler that Express can use in serverless
export default async (req, res) => {
  // Set necessary headers for streaming responses
  res.setHeader('Content-Type', 'application/json');
  
  // Call Express app as middleware
  try {
    app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

