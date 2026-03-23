import { supabase } from "../lib/supabase";

export async function uploadImage(file: File): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("uploads")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    throw new Error("Supabase upload failed");
  }

  const { data } = supabase.storage
    .from("uploads")
    .getPublicUrl(fileName);

  if (!data?.publicUrl) {
    throw new Error("Failed to get public image URL");
  }

  return data.publicUrl;
}
