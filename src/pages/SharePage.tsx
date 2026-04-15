import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SharePanel from "../components/SharePanel";

export default function SharePage() {
  const { runId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!runId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`https://magicreel-backend-production.up.railway.app/api/share/${runId}`);
        const json = await res.json();
        setData(json);

// 🔥 DEBUG LINE (ADD THIS)
    console.log("SHARE DATA:", json);

    // 🔥 HANDLE ERROR RESPONSE
    if (json.error) {
      setData(null);
    } else {
      setData(json);
    }

      } catch (err) {
        console.error("Share fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [runId]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 20 }}>Not found</div>;

  return <SharePanel data={data} />;
}