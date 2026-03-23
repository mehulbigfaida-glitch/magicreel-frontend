import type { Avatar } from "../../store/avatarStore";
import "./AvatarCard.css";

interface Props {
  avatar: Avatar;
  selected: boolean;
  onSelect: () => void;
}

export default function AvatarCard({
  avatar,
  selected,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      className={`mr-avatar-card ${selected ? "active" : ""}`}
      onClick={onSelect}
    >
      {avatar.previewImage ? (
        <img
          src={avatar.previewImage}
          alt="Avatar preview"
          className="mr-avatar-image"
        />
      ) : (
        <div className="mr-avatar-coming-soon">
          Coming soon
        </div>
      )}
    </button>
  );
}
