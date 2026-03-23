import { useEffect, useState } from "react";
import { useAvatarStore } from "../../store/avatarStore";
import type { Avatar } from "../../store/avatarStore";
import "./AvatarPickerDrawer.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AvatarPickerDrawer({ open, onClose }: Props) {
  const { getAvatars, selectAvatar } = useAvatarStore();
  const avatars = getAvatars();

  const [tempAvatar, setTempAvatar] = useState<Avatar | null>(
    null
  );

  useEffect(() => {
    if (open) {
      setTempAvatar(null); // reset on open
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="avatar-drawer-overlay">
      <div className="avatar-drawer">
        <div className="avatar-drawer-header">
          <h3>Select Avatar</h3>
        </div>

        <div className="avatar-grid">
          {avatars.map((a) => (
            <button
              key={a.id}
              className={`avatar-card ${
                tempAvatar?.id === a.id ? "selected" : ""
              }`}
              onClick={() => setTempAvatar(a)}
            >
              <img src={a.previewImage} alt={a.id} />
            </button>
          ))}
        </div>

        <div className="avatar-drawer-footer">
          <button
            className="secondary"
            onClick={onClose}
          >
            Change
          </button>

          <button
            className="primary"
            disabled={!tempAvatar}
            onClick={() => {
              if (!tempAvatar) return;
              selectAvatar(tempAvatar);
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
