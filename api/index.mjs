/**
 * Vercel Serverless Function Handler
 * This file handles all requests and routes them to the Express backend
 */

// Import the bundled Express app
import app from '../backend/dist/index.mjs';

/**
 * Main handler for Vercel
 */
export default async (req, res) => {
  // Set headers for streaming
  res.setHeader('Connection', 'keep-alive');
  
  try {
    // Pass request through Express app
    return new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Handler error:', error);
    
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
      });
    }
  }
};
