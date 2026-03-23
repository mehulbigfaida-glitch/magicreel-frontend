import { useAvatarStore } from "../../store/avatarStore";

export default function AvatarStep() {
  const selectedAvatar = useAvatarStore(
    (s) => s.selectedAvatar
  );

  return (
    <div className="mr-avatar-page">
      {selectedAvatar ? (
        <img
          src={selectedAvatar.previewImage}
          style={{
            width: "100%",
            borderRadius: 12,
          }}
        />
      ) : (
        <div style={{ color: "#9ca3af", fontSize: 13 }}>
          Select an avatar category
        </div>
      )}
    </div>
  );
}
