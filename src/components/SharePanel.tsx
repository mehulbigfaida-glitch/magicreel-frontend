export default function SharePanel({ data }: { data: any }) {
  const images = data?.media || [];

  const hero = images[0];
  const others = images.slice(1);

  const shareUrl = window.location.href;

  const caption = `Serving looks ✨
Generated with MagicReel

#fashion #ootd #style #magicreel`;

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
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        {others.map((item: any, index: number) => (
          <img
            key={index}
            src={item.url}
            alt={`look-${index}`}
            style={{
              width: "100%",
              borderRadius: 12,
            }}
          />
        ))}
      </div>
    </div>
  );
}