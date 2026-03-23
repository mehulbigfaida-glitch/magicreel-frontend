export type AvatarPresetStatus = "live" | "coming_soon";

export interface AvatarPreset {
  id: string;
  status: AvatarPresetStatus;
  modelImage?: string;
  placeholderImage?: string;
}

export const AVATAR_PRESET_CONFIG: Record<
  "male" | "female" | "plus" | "kids",
  AvatarPreset[]
> = {
  male: [
    {
      id: "male_01",
      status: "live",
      modelImage:
        "https://res.cloudinary.com/duaqfspwa/image/upload/v1768820475/Rahul_face_bcibue.png",
      placeholderImage:
        "https://res.cloudinary.com/duaqfspwa/image/upload/v1768820608/Rahul_placeholder_drgqjf.png",
    },
    {
      id: "male_02",
      status: "coming_soon",
    },
    {
      id: "male_03",
      status: "coming_soon",
    },
  ],

  female: [
    {
      id: "female_01",
      status: "live",
      modelImage:
        "https://res.cloudinary.com/duaqfspwa/image/upload/v1768406616/Riya_face_t0d7fo.png",
      placeholderImage:
        "https://res.cloudinary.com/duaqfspwa/image/upload/v1768820805/Riya_Placeholder_jwpyu3.png",
    },
    {
      id: "female_02",
      status: "coming_soon",
    },
    {
      id: "female_03",
      status: "coming_soon",
    },
  ],

  plus: [
    {
      id: "plus_01",
      status: "live",
      modelImage:
        "https://res.cloudinary.com/duaqfspwa/image/upload/v1768821822/Tanvi_plus_face_cg1urs.png",
      placeholderImage:
        "https://res.cloudinary.com/duaqfspwa/image/upload/v1768821608/Tanvi_plus_placeholder_z5uhay.png",
    },
    {
      id: "plus_02",
      status: "coming_soon",
    },
    {
      id: "plus_03",
      status: "coming_soon",
    },
  ],

  kids: [
    { id: "kids_01", status: "coming_soon" },
    { id: "kids_02", status: "coming_soon" },
    { id: "kids_03", status: "coming_soon" },
  ],
};
