import React from "react";
import { useAvatarStore } from "../../store/avatarStore";
import AvatarCard from "./AvatarCard";

const AvatarGrid: React.FC = () => {
  const avatars = useAvatarStore((s) => s.getAvatars());
  const selectedAvatar = useAvatarStore((s) => s.selectedAvatar);
  const selectAvatar = useAvatarStore((s) => s.selectAvatar);

  return (
    <div className="avatar-grid">
      {avatars.map((avatar) => (
        <AvatarCard
          key={avatar.id}
          avatar={avatar}
          selected={selectedAvatar?.id === avatar.id}
          onSelect={() => {
            if (avatar.previewImage) {
              selectAvatar(avatar);
            }
          }}
        />
      ))}
    </div>
  );
};

export default AvatarGrid;
