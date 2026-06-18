/**
 * Vercel Serverless Function Handler
 * This file handles all requests and routes them to the Express backend
 */

import app from '../backend/dist/index.mjs';

/**
 * Main handler for Vercel Serverless Function
 * Wraps the Express app to work with Vercel's serverless runtime
 */
export default function handler(req, res) {
  // Set proper response headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, PATCH, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Invoke the Express app as a serverless function handler
  // The Express app has already been built and bundled in backend/dist/index.mjs
  return app(req, res);
}

