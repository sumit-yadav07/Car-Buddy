// supabase/functions/addCar.js
import { serve } from 'https://deno.land/x/supabase_functions@v0.0.1/mod.ts';

serve(async (req) => {
  const { make, model, year, price } = await req.json();

  if (!make || !model || !year || !price) {
    return new Response(JSON.stringify({ message: 'All fields are required.' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('cars')
    .insert([{ make, model, year, price }]);

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
});
