import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SharePanel from "../components/SharePanel";

export default function SharePage() {
  const { shareId } = useParams<{ shareId: string }>();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shareId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://magicreel-backend-production.up.railway.app/api/share/${shareId}`
        );

        const json = await res.json();

        console.log("✅ SHARE DATA:", json);

        // handle error response safely
        if (!res.ok || json.error) {
          console.error("❌ Share API error:", json);
          setData(null);
        } else {
          setData(json);
        }
      } catch (err) {
        console.error("❌ Share fetch failed:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shareId]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h3>✨ Loading shared lookbook...</h3>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (!data) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h3>❌ Lookbook not found</h3>
      </div>
    );
  }

  /* ---------------- SUCCESS ---------------- */
  return <SharePanel data={data} />;
}