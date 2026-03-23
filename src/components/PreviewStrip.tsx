interface PreviewStripProps {
  avatar?: boolean;
  avatarLabel?: string | null;
}

export default function PreviewStrip({
  avatar,
  avatarLabel,
}: PreviewStripProps) {
  return (
    <div className="mr-preview-strip">
      {avatar && avatarLabel && <span>{avatarLabel}</span>}
    </div>
  );
}
