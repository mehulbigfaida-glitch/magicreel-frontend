import axios from "axios";

export async function exportReel(lookbookId: string) {
  const res = await axios.post(
    `/lookbook/${lookbookId}/export-reel`
  );
  return res.data;
}
