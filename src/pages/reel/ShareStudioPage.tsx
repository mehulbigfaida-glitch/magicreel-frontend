import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

export default function ShareStudioPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const reelUrl = location.state?.reelUrl;

  const [caption, setCaption] = useState("Slaying this look ✨ #MagicReel");

  const shareUrl = useMemo(() => {
    if (!reelUrl) return "";
    return `${window.location.origin}/reel/view?video=${encodeURIComponent(reelUrl)}&caption=${encodeURIComponent(caption)}`;
  }, [reelUrl, caption]);

  if (!reelUrl) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        No Reel Found
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link Copied");
    } catch {
      alert("Copy failed");
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)}>Back</button>
        <div className="font-semibold">Share Studio</div>
        <button onClick={handleCopy}>Copy Link</button>
      </div>

      {/* Content */}
      <div className="flex flex-1">
        {/* Video */}
        <div className="flex-1 flex items-center justify-center">
          <video
            src={reelUrl}
            controls
            playsInline
            preload="metadata"
            className="max-h-full rounded-xl"
          />
        </div>

        {/* Right Panel */}
        <div className="w-[400px] border-l border-gray-800 p-4 flex flex-col gap-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full h-32 p-2 rounded bg-gray-900"
          />

          <div className="bg-gray-900 p-4 rounded">
            <div className="text-sm mb-2">Mobile Share QR</div>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`}
              alt="QR"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

