/**
 * Vercel Serverless Function Handler
 * This file handles all requests and routes them to the Express backend
 */

// Import the bundled Express app
import app from '../backend/dist/index.mjs';

/**
 * Main handler for Vercel Serverless Function
 * Vercel will call this function for each incoming request
 */
export default function handler(req, res) {
  // Ensure proper CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'https://get-mumm.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Call the Express app to handle the request
  return app(req, res);
}

