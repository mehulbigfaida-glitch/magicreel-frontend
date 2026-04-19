import { useState, useEffect } from "react";

export default function SharePanel({ data }: { data: any }) {
  const images = data?.media || [];

  const hero = images[0];
  const others = images.slice(1);

  const shareUrl = window.location.href;

  const [isMobile, setIsMobile] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ✅ Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const caption = `Serving looks ✨
Generated with MagicReel

#fashion #ootd #style #magicreel`;

  // 🔗 Copy Link
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied!");
  };

  // 📲 WhatsApp (ONLY mobile useful)
  const handleWhatsApp = () => {
    const text = `${caption}\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  // 📸 Instagram
  const handleInstagram = () => {
    navigator.clipboard.writeText(caption);
    alert("Caption copied. Now paste on Instagram 📸");
    window.open("https://www.instagram.com/");
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      
      {/* 🔥 TITLE */}
      <h2 style={{ marginBottom: 16 }}>✨ Shared Lookbook</h2>

      {/* 🔥 HERO */}
      {hero && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              width: "100%",
              maxHeight: "75vh",
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

      {/* 🔥 MOBILE ACTIONS ONLY */}
      {isMobile && (
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button onClick={handleWhatsApp}>📲 WhatsApp</button>
          <button onClick={handleInstagram}>📸 Instagram</button>
          <button onClick={handleCopy}>🔗 Copy Link</button>
          <button onClick={() => window.open(hero?.url)}>⬇ Download</button>
        </div>
      )}

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

      {/* 🔥 FULLSCREEN VIEW */}
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