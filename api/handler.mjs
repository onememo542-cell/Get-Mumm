// Import the built Express app
import appModule from '../backend/dist/index.mjs';

// Get the Express app instance (it's the default export)
const app = appModule;

/**
 * Vercel Serverless Handler
 * Express middleware doesn't natively work as a serverless handler,
 * but Express apps created with express() can be invoked directly
 * with Node.js http.ServerRequest and http.ServerResponse objects
 */
export default (req, res) => {
  // Call the Express app directly with request and response
  // This works because Express internally handles the middleware chain
  app(req, res);
};


