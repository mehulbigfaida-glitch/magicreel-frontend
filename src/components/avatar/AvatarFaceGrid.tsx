import { useEffect, useMemo } from "react";
import { useAvatarStore } from "../../store/avatarStore";
import "./AvatarFaceGrid.css";

export default function AvatarFaceGrid() {
  const gender = useAvatarStore((s) => s.gender);
  const build = useAvatarStore((s) => s.build);
  const selectedAvatar = useAvatarStore((s) => s.selectedAvatar);
  const selectAvatar = useAvatarStore((s) => s.selectAvatar);

  const avatars = useMemo(() => {
    const state = useAvatarStore.getState();
    const list = state.getAvatars?.() ?? [];
    return Array.isArray(list) ? list : [];
  }, [gender, build]);

  useEffect(() => {
    if (avatars.length > 0 && (!selectedAvatar || selectedAvatar.gender !== gender || selectedAvatar.build !== build)) {
      selectAvatar(avatars[0]);
    }
  }, [avatars, gender, build, selectedAvatar, selectAvatar]);

  const SLOTS = 3;

  return (
    <div className="mr-avatar-face-grid">
      {Array.from({ length: SLOTS }).map((_, i) => {
        const avatar = avatars[i];

        if (!avatar) {
          return (
            <div
              key={`placeholder-${i}`}
              className="mr-avatar-face-card placeholder"
            />
          );
        }

        return (
          <div
            key={avatar.id}
            className={`mr-avatar-face-card ${
              selectedAvatar?.id === avatar.id ? "active" : ""
            }`}
            onClick={() => selectAvatar(avatar)}
          >
            <img src={avatar.previewImage} alt="" />
          </div>
        );
      })}
    </div>
  );
}
