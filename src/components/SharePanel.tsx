import { useState } from "react";

export default function SharePanel({ data }: { data: any }) {
  const images = data?.media || [];

  const hero = images[0];
  const others = images.slice(1);

  const shareUrl = window.location.href;

const caption = `Serving looks ✨
Generated with MagicReel

#fashion #ootd #style #magicreel`;

const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 🔥 Native Share (Mobile Magic)
  const handleNativeShare = async () => {
    if (navigator.share && hero?.url) {
      try {
        await navigator.share({
          title: "MagicReel Lookbook",
          text: caption,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      alert("Sharing not supported on this device");
    }
  };

  // 🔗 Copy Link
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied!");
  };

  // 📲 WhatsApp
  const handleWhatsApp = () => {
    const text = `${caption}\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  // 📸 Instagram Flow
  const handleInstagram = () => {
    navigator.clipboard.writeText(caption);
    alert("Caption copied. Now download & post on Instagram 📸");
    window.open("https://www.instagram.com/");
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 16 }}>✨ Shared Lookbook</h2>

      {/* 🔥 HERO IMAGE */}
      {hero && (
        <div style={{ marginBottom: 20 }}>
          <div
  style={{
    width: "100%",
    maxHeight: "70vh",
    overflow: "hidden",
    borderRadius: 16,
  }}
>
  <img
    src={hero.url}
    alt="hero"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
</div>
        </div>
      )}

      {/* 🔘 ACTION BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <button onClick={handleNativeShare}>🚀 Share</button>
        <button onClick={handleCopy}>🔗 Copy Link</button>
        <button onClick={handleWhatsApp}>📲 WhatsApp</button>
        <button onClick={handleInstagram}>📸 Instagram</button>
        <button onClick={() => window.open(hero?.url)}>⬇ Download</button>
      </div>

      {/* 🖼 GRID */}
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  }}
>
        {others.map((item: any, index: number) => (
          <div
  key={index}
  onClick={() => setSelectedImage(item.url)}
  style={{
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    cursor: "pointer",
  }}
>
  <img
    src={item.url}
    alt={`look-${index}`}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s ease",
    }}
    onMouseOver={(e) =>
      (e.currentTarget.style.transform = "scale(1.05)")
    }
    onMouseOut={(e) =>
      (e.currentTarget.style.transform = "scale(1)")
    }
  />
</div>
        ))}
      </div>
   {selectedImage && (
  <div
    onClick={() => setSelectedImage(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.9)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
    }}
  >
    <img
      src={selectedImage}
      alt="fullscreen"
      style={{
        maxWidth: "90%",
        maxHeight: "90%",
        borderRadius: 12,
      }}
    />
  </div>
)}
   
    </div>
  );
}