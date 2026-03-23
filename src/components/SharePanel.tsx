import React from "react";

type Props = {
  videoUrl: string;
  onDownload?: () => void;
  downloadLabel?: string;
};

const SharePanel: React.FC<Props> = ({
  videoUrl,
  onDownload,
  downloadLabel,
}) => {
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }

    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "magicreel.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const disabledBtn =
    "w-full py-3 rounded-xl border text-sm opacity-50 cursor-not-allowed";

  const activeBtn =
    "w-full py-3 rounded-xl bg-black text-white text-sm hover:opacity-90";

  return (
    <div className="mt-6 p-4 border rounded-2xl bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        ✨ Share Your Content
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Instagram */}
        <button className={disabledBtn} disabled>
          Instagram 🔜
        </button>

        {/* WhatsApp */}
        <button className={disabledBtn} disabled>
          WhatsApp 🔜
        </button>

        {/* Copy Link */}
        <button className={disabledBtn} disabled>
          Copy Link 🔜
        </button>

        {/* Download / Export */}
        <button onClick={handleDownload} className={activeBtn}>
          {downloadLabel || "Download"}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        More sharing options coming soon 🚀
      </p>
    </div>
  );
};

export default SharePanel;