require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);
async function setup() {
  console.log('Creating bucket...');
  const { data, error } = await supabase.storage.createBucket('content', {
    public: true,
  });
  if (error) console.error(error.message);
  else console.log('Bucket created successfully!');
}
setup();
