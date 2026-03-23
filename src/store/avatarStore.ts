import { create } from "zustand";

export type AvatarGender = "male" | "female" | "kids";
export type AvatarBuild = "regular" | "plus";

export interface Avatar {
  id: string;
  gender: AvatarGender;
  build: AvatarBuild;
  previewImage: string;
  modelImage: string;       // front face
  backModelImage: string;   // back face
}

export type AvatarCategory =
  | "female"
  | "female_plus"
  | "male"
  | "male_plus"
  | "kids";

interface AvatarState {
  gender: AvatarGender;
  build: AvatarBuild;
  selectedAvatar?: Avatar;

  setCategory: (category: AvatarCategory) => void;
  selectAvatar: (a: Avatar) => void;
  getAvatars: () => Avatar[];
}

/* =========================
   AVATAR DATA
========================= */

const AVATARS: Avatar[] = [
  /* ---------- FEMALE REGULAR ---------- */

  {
    id: "female_riya",
    gender: "female",
    build: "regular",
    previewImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1768820805/Riya_Placeholder_jwpyu3.png",
    modelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1768406616/Riya_face_t0d7fo.png",
    backModelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1768406616/Riya_face_t0d7fo.png", // replace later if back exists
  },
  {
    id: "female_shanaya",
    gender: "female",
    build: "regular",
    previewImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245614/Shanaya_face_placeholder_s8ulmz.png",
    modelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245612/Shanaya_face_zmcu8k.png",
    backModelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245612/Shanaya_back_face_npsr0b.png",
  },
  {
    id: "female_sharon",
    gender: "female",
    build: "regular",
    previewImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245621/Sharon_face_placeholder_frxcvq.png",
    modelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245619/Sharon_face_rdxlou.png",
    backModelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245615/Sharon_back_face_syvsm8.png",
  },

  /* ---------- FEMALE PLUS ---------- */

  {
    id: "female_plus_tanvi",
    gender: "female",
    build: "plus",
    previewImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1768821608/Tanvi_plus_placeholder_z5uhay.png",
    modelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1768821822/Tanvi_plus_face_cg1urs.png",
    backModelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771230801/Tanvi_plus_back_paryyg.png",
  },
  {
    id: "female_plus_dolly",
    gender: "female",
    build: "plus",
    previewImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245472/Dolly_plus_placeholder_mmy7p3.png",
    modelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245471/Dolly_plus_face_ebdhul.png",
    backModelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245609/Dolly_plus_back_hkhbr0.png",
  },

  /* ---------- MALE REGULAR ---------- */

  {
    id: "male_rahul",
    gender: "male",
    build: "regular",
    previewImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1768820608/Rahul_placeholder_drgqjf.png",
    modelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1768820475/Rahul_face_bcibue.png",
    backModelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771216710/Rahul_bsck_face_gkgbbn.png",
  },
  {
    id: "male_vijay",
    gender: "male",
    build: "regular",
    previewImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771258180/Vijay_face_placeholder_xafqyc.png",
    modelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771258177/Vijay_face_ffivjk.png",
    backModelImage:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1771258176/Vijay_back_face_agqjk2.png",
  },
];

/* ========================= */

export const useAvatarStore = create<AvatarState>((set, get) => ({
  gender: "female",
  build: "regular",
  selectedAvatar: undefined,

  setCategory: (category) => {
    let nextGender: AvatarGender = "female";
    let nextBuild: AvatarBuild = "regular";

    switch (category) {
      case "male":
        nextGender = "male";
        break;
      case "male_plus":
        nextGender = "male";
        nextBuild = "plus";
        break;
      case "female_plus":
        nextGender = "female";
        nextBuild = "plus";
        break;
      case "kids":
        nextGender = "kids";
        break;
    }

    set({
      gender: nextGender,
      build: nextBuild,
      selectedAvatar: undefined,
    });
  },

  selectAvatar: (avatar) =>
    set({
      selectedAvatar: avatar,
    }),

  getAvatars: () => {
    const { gender, build } = get();
    return AVATARS.filter(
      (a) => a.gender === gender && a.build === build
    );
  },
}));
