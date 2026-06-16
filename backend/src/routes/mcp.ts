import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Secure with an MCP API key header
const MCP_HEADER = 'x-mcp-key';

function requireMcpKey(req: any, res: any, next: any) {
  const key = process.env.MCP_API_KEY;
  if (!key) return res.status(500).json({ error: 'MCP not configured on server' });
  const incoming = req.header(MCP_HEADER);
  if (!incoming || incoming !== key) return res.status(401).json({ error: 'Unauthorized' });
  return next();
}

// POST /api/mcp/select
// body: { table: string, columns?: string, filters?: [{col, op, value}], limit?: number }
router.post('/mcp/select', requireMcpKey, async (req, res) => {
  try {
    const { table, columns = '*', filters = [], limit } = req.body;
    if (!table) return res.status(400).json({ error: 'table is required' });

    let q: any = supabase.from(table).select(columns);

    for (const f of filters) {
      const { col, op = 'eq', value } = f;
      if (!col) continue;
      if (op === 'eq') q = q.eq(col, value);
      else if (op === 'neq') q = q.neq(col, value);
      else if (op === 'like') q = q.ilike(col, value);
      else if (op === 'in' && Array.isArray(value)) q = q.in(col, value);
    }

    if (limit && Number.isInteger(limit)) q = q.limit(limit);

    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// POST /api/mcp/insert
// body: { table: string, rows: [...] }
router.post('/mcp/insert', requireMcpKey, async (req, res) => {
  try {
    const { table, rows } = req.body;
    if (!table || !rows) return res.status(400).json({ error: 'table and rows are required' });
    const { data, error } = await supabase.from(table).insert(rows);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// POST /api/mcp/upsert
router.post('/mcp/upsert', requireMcpKey, async (req, res) => {
  try {
    const { table, rows, onConflict } = req.body;
    if (!table || !rows) return res.status(400).json({ error: 'table and rows are required' });
    const { data, error } = await supabase.from(table).upsert(rows, { onConflict });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// POST /api/mcp/delete
// body: { table: string, filters: [{col, op, value}] }
router.post('/mcp/delete', requireMcpKey, async (req, res) => {
  try {
    const { table, filters = [] } = req.body;
    if (!table) return res.status(400).json({ error: 'table is required' });
    let q: any = supabase.from(table).delete();
    for (const f of filters) {
      const { col, op = 'eq', value } = f;
      if (!col) continue;
      if (op === 'eq') q = q.eq(col, value);
      else if (op === 'in' && Array.isArray(value)) q = q.in(col, value);
    }
    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
});

export default router;
