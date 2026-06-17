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
  // Call the Express app to handle the request
  app(req, res);
}

