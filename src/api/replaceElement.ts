import axios from "axios";

export async function replaceElement(
  lookbookId: string,
  elementType: "bottom" | "accessory" | "jewelry",
  elementImageUrl: string
) {
  const res = await axios.post(
    `/lookbook/${lookbookId}/replace-element`,
    {
      elementType,
      elementImageUrl,
    }
  );

  return res.data;
}
