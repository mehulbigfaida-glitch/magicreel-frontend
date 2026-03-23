import type { Avatar } from "../store/avatarStore";

export const fetchAvatars = async (): Promise<Avatar[]> => {
  return [
    {
      id: "ava_f_01",
      name: "Ava 01",
      gender: "female",
      height: "5'6\"",
      bodyType: "regular",
      previewImage: "/avatars/female_01.png",
      supportedCategories: ["top", "one_piece"],
    },
    {
      id: "ava_f_02",
      name: "Ava 02",
      gender: "female",
      height: "5'8\"",
      bodyType: "slim",
      previewImage: "/avatars/female_02.png",
      supportedCategories: ["top", "bottom", "one_piece"],
    },
    {
      id: "ava_m_01",
      name: "Ava 03",
      gender: "male",
      height: "5'10\"",
      bodyType: "athletic",
      previewImage: "/avatars/male_01.png",
      supportedCategories: ["top", "bottom"],
    },
  ];
};
