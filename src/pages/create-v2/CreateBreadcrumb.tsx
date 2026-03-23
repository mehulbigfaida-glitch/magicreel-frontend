import "./CreateBreadcrumb.css";
import type {
  GarmentCategory,
  GarmentSubType,
} from "../../magicreel/config/garments";
import type { AvatarType } from "../StudioSidebar";

type Props = {
  category: GarmentCategory | null;
  subType: GarmentSubType | null;
  pill: string | null;
  avatarCategory: AvatarType | null;
  selectedAvatar: { id: string; image: string } | null;
  onAvatarClick: () => void;
};

export default function CreateBreadcrumb({
  category,
  subType,
  pill,
  avatarCategory,
  selectedAvatar,
  onAvatarClick,
}: Props) {
  return (
    <div className="mr-breadcrumb">
      <div className="mr-breadcrumb-left">
        {category && <span>{category}</span>}
        {subType && (
          <>
            <span className="mr-breadcrumb-sep">/</span>
            <span>{subType}</span>
          </>
        )}
        {pill && (
          <>
            <span className="mr-breadcrumb-sep">/</span>
            <span>{pill}</span>
          </>
        )}
      </div>

      <button
        className="mr-avatar-chip"
        onClick={onAvatarClick}
      >
        {selectedAvatar?.image && (
          <div className="mr-avatar-hover">
            <img
              src={selectedAvatar.image}
              className="mr-avatar-thumb"
              alt="avatar"
            />

            <div className="mr-avatar-preview">
              <img
                src={selectedAvatar.image}
                alt="avatar preview"
              />
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
