import { Router, type RequestHandler } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

// Secure with an MCP API key header
const MCP_HEADER = "x-mcp-key";

/**
 * Middleware to verify MCP API key
 */
const requireMcpKey: RequestHandler = (req, res, next) => {
  const key = process.env.MCP_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "MCP not configured on server" });
  }
  const incoming = req.header(MCP_HEADER);
  if (!incoming || incoming !== key) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
};

/**
 * POST /api/mcp/select
 * Query data from a table with optional filters and limit
 */
router.post(
  "/mcp/select",
  requireMcpKey,
  async (req, res): Promise<void> => {
    try {
      const { table, columns = "*", filters = [], limit } = req.body;
      if (!table) {
        res.status(400).json({ error: "table is required" });
        return;
      }

      let q: any = supabase.from(table).select(columns);

      for (const f of filters) {
        const { col, op = "eq", value } = f;
        if (!col) continue;
        if (op === "eq") q = q.eq(col, value);
        else if (op === "neq") q = q.neq(col, value);
        else if (op === "like") q = q.ilike(col, value);
        else if (op === "in" && Array.isArray(value)) q = q.in(col, value);
      }

      if (limit && Number.isInteger(limit)) q = q.limit(limit);

      const { data, error } = await q;
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.json({ data });
    } catch (err: any) {
      res.status(500).json({ error: err.message || String(err) });
    }
  },
);

/**
 * POST /api/mcp/insert
 * Insert rows into a table
 */
router.post(
  "/mcp/insert",
  requireMcpKey,
  async (req, res): Promise<void> => {
    try {
      const { table, rows } = req.body;
      if (!table || !rows) {
        res.status(400).json({ error: "table and rows are required" });
        return;
      }
      const { data, error } = await supabase.from(table).insert(rows);
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.json({ data });
    } catch (err: any) {
      res.status(500).json({ error: err.message || String(err) });
    }
  },
);

/**
 * POST /api/mcp/upsert
 * Upsert rows into a table
 */
router.post(
  "/mcp/upsert",
  requireMcpKey,
  async (req, res): Promise<void> => {
    try {
      const { table, rows, onConflict } = req.body;
      if (!table || !rows) {
        res.status(400).json({ error: "table and rows are required" });
        return;
      }
      const { data, error } = await supabase
        .from(table)
        .upsert(rows, { onConflict });
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.json({ data });
    } catch (err: any) {
      res.status(500).json({ error: err.message || String(err) });
    }
  },
);

/**
 * POST /api/mcp/delete
 * Delete rows from a table
 */
router.post(
  "/mcp/delete",
  requireMcpKey,
  async (req, res): Promise<void> => {
    try {
      const { table, filters = [] } = req.body;
      if (!table) {
        res.status(400).json({ error: "table is required" });
        return;
      }
      let q: any = supabase.from(table).delete();
      for (const f of filters) {
        const { col, op = "eq", value } = f;
        if (!col) continue;
        if (op === "eq") q = q.eq(col, value);
        else if (op === "in" && Array.isArray(value)) q = q.in(col, value);
      }
      const { data, error } = await q;
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.json({ data });
    } catch (err: any) {
      res.status(500).json({ error: err.message || String(err) });
    }
  },
);

export default router;

