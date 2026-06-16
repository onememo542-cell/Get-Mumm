import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://apzezakdeaqbwolodaum.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwemV6YWtkZWFxYndvbG9kYXVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTYwNTg1NiwiZXhwIjoyMDk3MTgxODU2fQ.t_L-UNRLfmejQ5Yto-G_jtCWha3xG3JLmf872MrzzfU';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, serviceRoleKey);

try {
  const { data, error } = await supabase.from('categories').select('*').limit(1);
  
  if (error) {
    console.error('❌ Supabase error:', error);
  } else {
    console.log('✅ Supabase connected! Data:', data?.length, 'rows');
  }
} catch (err) {
  console.error('❌ Exception:', err.message);
}
