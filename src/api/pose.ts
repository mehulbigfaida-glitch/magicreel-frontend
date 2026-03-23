import type { Pose } from "../store/poseStore";

export const fetchPoses = async (): Promise<Pose[]> => {
  return [
    {
      id: "pose_standing",
      name: "Standing",
      previewImage: "/poses/standing.png",
      supportedCategories: ["top", "bottom", "one_piece"],
    },
    {
      id: "pose_walk",
      name: "Walk",
      previewImage: "/poses/walk.png",
      supportedCategories: ["top", "bottom"],
    },
    {
      id: "pose_editorial",
      name: "Editorial",
      previewImage: "/poses/editorial.png",
      supportedCategories: ["top", "one_piece"],
    },
    {
      id: "pose_traditional",
      name: "Traditional",
      previewImage: "/poses/traditional.png",
      supportedCategories: ["one_piece"],
    },
  ];
};
