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
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 🔥 Native Share
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

  // 📸 Instagram
  const handleInstagram = () => {
    navigator.clipboard.writeText(caption);
    alert("Caption copied. Now download & post on Instagram 📸");
    window.open("https://www.instagram.com/");
  };

  // 👉 Navigation
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

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 6 }}>✨ Shared Lookbook</h2>
      <p style={{ color: "#777", marginBottom: 20 }}>
        Effortless style powered by MagicReel
      </p>

      {/* HERO */}
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

      {/* ACTIONS */}
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

      {/* FULLSCREEN MODAL */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          {/* LEFT */}
          <button
            onClick={goPrev}
            style={{
              position: "absolute",
              left: 20,
              fontSize: 30,
              color: "#fff",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ←
          </button>

          {/* IMAGE */}
          <img
            src={selectedImage}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 12,
            }}
          />

          {/* RIGHT */}
          <button
            onClick={goNext}
            style={{
              position: "absolute",
              right: 20,
              fontSize: 30,
              color: "#fff",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            →
          </button>

          {/* CLOSE */}
          <div
            onClick={() => setSelectedImage(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              color: "#fff",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ✕
          </div>
        </div>
      )}
    </div>
  );
}