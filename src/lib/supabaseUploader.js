require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const uploadToSupabase = async (file, filename) => {
  const chunks = [];
  for await (const chunk of file) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  const { error } = await supabase.storage
    .from("herbplants")
    .upload(filename, buffer, {
      contentType: file.hapi.headers["content-type"],
      upsert: true,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("herbplants")
    .getPublicUrl(filename);

  return publicUrlData.publicUrl;
};

module.exports = uploadToSupabase;
