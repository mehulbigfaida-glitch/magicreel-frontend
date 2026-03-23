import axios from "axios";

export async function sealLookbook(lookbookId: string) {
  const res = await axios.post(
    `/lookbook/${lookbookId}/seal`
  );
  return res.data;
}
