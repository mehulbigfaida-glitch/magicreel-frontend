import { create } from "zustand";

export type GarmentCategory =
  | "top"
  | "bottom"
  | "one-piece"
  | "ethnic";

export type GarmentSubCategory =
  | "shirt"
  | "tshirt"
  | "blouse"
  | null;

export type GarmentStyle =
  | "solid-shirt"
  | "printed-shirt"
  | "striped-shirt"
  | "mandarin-shirt"
  | null;

export type SleeveType =
  | "full"
  | "half"
  | "rolled"
  | null;

export type AvatarType =
  | "female"
  | "male"
  | "female-16"
  | "male-16"
  | null;

interface CreateFlowState {
  category: GarmentCategory | null;
  subCategory: GarmentSubCategory;
  style: GarmentStyle;
  sleeve: SleeveType;
  avatar: AvatarType;

  setCategory: (v: GarmentCategory) => void;
  setSubCategory: (v: GarmentSubCategory) => void;
  setStyle: (v: GarmentStyle) => void;
  setSleeve: (v: SleeveType) => void;
  setAvatar: (v: AvatarType) => void;

  resetGarment: () => void;
}

export const useCreateFlowStore = create<CreateFlowState>((set) => ({
  category: null,
  subCategory: null,
  style: null,
  sleeve: null,
  avatar: null,

  setCategory: (category) =>
    set(() => ({
      category,
      subCategory: null,
      style: null,
      sleeve: null,
    })),

  setSubCategory: (subCategory) =>
    set(() => ({
      subCategory,
      style: null,
      sleeve: null,
    })),

  setStyle: (style) =>
    set(() => ({
      style,
      sleeve: null,
    })),

  setSleeve: (sleeve) =>
    set(() => ({
      sleeve,
    })),

  setAvatar: (avatar) =>
    set(() => ({
      avatar,
    })),

  resetGarment: () =>
    set(() => ({
      category: null,
      subCategory: null,
      style: null,
      sleeve: null,
    })),
}));
