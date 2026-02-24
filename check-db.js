require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function check() {
  console.log('Checking profiles...');
  const { data, error } = await supabase.from('profiles').select('*');
  console.log('Profiles:', data);
  if (error) console.error(error);
}
check();
