require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function fix() {
  const email = process.env.OWNER_EMAIL || 'jadenshia34@gmail.com';
  console.log(`Updating profile role to owner for ${email}...`);
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'owner' })
    .eq('email', email);

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Successfully updated profile role!');
  }
}
fix();
