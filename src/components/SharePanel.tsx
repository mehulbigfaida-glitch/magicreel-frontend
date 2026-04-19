import { useState, useEffect } from "react";

export default function SharePanel({ data }: { data: any }) {
  const images = data?.media || [];
  const hero = images[0];
  const others = images.slice(1);

  const shareId = data?.id;
  const backendMetaUrl = `https://magicreel-backend-production.up.railway.app/api/share/meta/${shareId}`;
  

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 🔥 IG COMPOSER STATE
  const [showComposer, setShowComposer] = useState(false);
  const [caption, setCaption] = useState(`Serving looks ✨
Generated with MagicReel

#fashion #ootd #style #magicreel`);

  // ===============================
  // 📲 WHATSAPP (OG ENABLED)
  // ===============================
  const handleWhatsApp = () => {
    const text = `${caption}\n\n👇 View full lookbook\n${backendMetaUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  // ===============================
  // 📸 INSTAGRAM COMPOSER
  // ===============================
  const handleInstagram = () => {
    setShowComposer(true);
  };

  const handlePostNow = () => {
    // ✅ download image
    if (hero?.url) {
      const link = document.createElement("a");
      link.href = hero.url;
      link.download = "magicreel-look.jpg";
      link.click();
    }

    // ✅ copy caption
    navigator.clipboard.writeText(caption);

    // ✅ open instagram
    window.open("https://www.instagram.com/");

    setShowComposer(false);

    alert("✅ Image downloaded & caption copied.\nPaste on Instagram.");
  };

  // ===============================
  // 🔄 NAVIGATION
  // ===============================
  const goNext = () => {
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedImage(images[nextIndex].url);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedImage(images[prevIndex].url);
    }
  };

  // ===============================
  // ⌨️ KEYBOARD
  // ===============================
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setSelectedImage(null);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedImage, currentIndex]);

  // ===============================
  // 📱 SWIPE
  // ===============================
  let touchStartX = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    if (diff < -50) goPrev();
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>✨ Shared Lookbook</h2>

      {/* HERO */}
      {hero && (
        <div style={{ marginBottom: 20 }}>
          <img
            src={hero.url}
            style={{ width: "100%", borderRadius: 16 }}
          />
        </div>
      )}

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={handleWhatsApp}>📲 WhatsApp</button>
        <button onClick={handleInstagram}>📸 Instagram</button>
        <button onClick={() => window.open(hero?.url)}>⬇ Download</button>
      </div>

      {/* GRID */}
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
            onClick={() => {
              setSelectedImage(item.url);
              setCurrentIndex(index + 1);
            }}
            style={{
              borderRadius: 12,
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <img src={item.url} style={{ width: "100%" }} />
          </div>
        ))}
      </div>

      {/* FULLSCREEN */}
      {selectedImage && (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button onClick={goPrev} style={{ position: "absolute", left: 20 }}>
            ←
          </button>

          <img src={selectedImage} style={{ maxWidth: "90%" }} />

          <button onClick={goNext} style={{ position: "absolute", right: 20 }}>
            →
          </button>

          <div
            onClick={() => setSelectedImage(null)}
            style={{ position: "absolute", top: 20, right: 20 }}
          >
            ✕
          </div>
        </div>
      )}

      {/* 🔥 INSTAGRAM COMPOSER */}
      {showComposer && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "#fff",
      zIndex: 1000,
      padding: 20,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
    }}
  >
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h3>📸 Prepare Instagram Post</h3>

      <img
        src={hero?.url}
        style={{
          width: "100%",
          borderRadius: 12,
          marginBottom: 12,
        }}
      />

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={{
          width: "100%",
          height: 120,
          padding: 10,
          borderRadius: 10,
          marginBottom: 12,
        }}
      />

      <button onClick={handlePostNow} style={{ marginRight: 10 }}>
        🚀 Post Now
      </button>

      <button onClick={() => setShowComposer(false)}>Cancel</button>
    </div>
  </div>
)}
    </div>
  );
}