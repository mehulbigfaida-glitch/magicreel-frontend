import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL;

export default function EcomOutputPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [poses, setPoses] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${API_BASE}/api/p2m/lookbook/${id}`
        );

        const data = await res.json();

        console.log("LOOKBOOK:", data);

        setPoses(data.poses || []);

      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    load();

  }, [id]);

  const heroImages = useMemo(
    () =>
      poses.filter(
        (p) =>
          p.poseId === "hero" ||
          p.poseId === "back"
      ),
    [poses]
  );

  const lookbookImages = useMemo(
    () =>
      poses.filter(
        (p) =>
          p.poseId !== "hero" &&
          p.poseId !== "back"
      ),
    [poses]
  );

  if (loading) {
    return (
      <div
        className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      "
      >
        Loading Lookbook...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header spacing */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Title */}

        <div className="text-center mb-12">

          <div
            className="
            text-xs
            tracking-[6px]
            text-violet-400
            mb-4
          "
          >
            MAGICREEL AI STUDIO
          </div>

          <h1
            className="
            text-5xl
            font-bold
            mb-3
          "
          >
            PURE STUDIO PACK
          </h1>

          <p className="text-white/60">
            {lookbookImages.length} Images Generated
          </p>

          {/* Actions */}

          <div className="flex justify-center gap-4 mt-8 flex-wrap">

            <button
              className="
              px-8
              py-4
              rounded-2xl
              border
              border-white/10
              bg-zinc-950
            "
            >
              Export ZIP
            </button>

            <button
              className="
              px-8
              py-4
              rounded-2xl
              border
              border-white/10
              bg-zinc-950
            "
            >
              Share Link
            </button>

            {heroImages.length === 2 && (
              <button
                className="
                px-8
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-500
              "
              >
                Generate 360° Reel
              </button>
            )}

          </div>

        </div>

        {/* Generated Looks */}

        <section className="mb-16">

          <h2
            className="
            text-2xl
            font-semibold
            mb-6
          "
          >
            Generated Looks
          </h2>

          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
          >

            {lookbookImages.map((p) => (

              <div
                key={p.poseId}
                className="
                rounded-[24px]
                overflow-hidden
                bg-zinc-900
                relative
                group
              "
              >

                <img
                  src={p.imageUrl}
                  className="
                  w-full
                  aspect-[2/3]
                  object-cover
                "
                />

                <div
                  className="
                  absolute
                  inset-0
                  bg-black/40
                  opacity-0
                  group-hover:opacity-100
                  transition
                  flex
                  items-end
                  justify-center
                  pb-6
                "
                >

                  <button
                    className="
                    bg-white
                    text-black
                    rounded-xl
                    px-5
                    py-2
                  "
                  >
                    Download
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* Hero Assets */}

        {heroImages.length > 0 && (

          <section>

            <h2
              className="
              text-2xl
              font-semibold
              mb-6
            "
            >
              Hero Assets
            </h2>

            <div
              className={`
              grid
              gap-6
              ${
                heroImages.length === 1
                  ? "grid-cols-1 max-w-xl mx-auto"
                  : "grid-cols-1 md:grid-cols-2"
              }
            `}
            >

              {heroImages.map((hero) => (

                <div
                  key={hero.poseId}
                  className="
                  rounded-[24px]
                  overflow-hidden
                  bg-zinc-900
                "
                >

                  <img
                    src={hero.imageUrl}
                    className="
                    w-full
                    aspect-[2/3]
                    object-cover
                  "
                  />

                  <div className="p-4 flex justify-center">

                    <button
                      className="
                      px-5
                      py-2
                      rounded-xl
                      bg-zinc-800
                    "
                    >
                      Download
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}

      </div>

    </div>
  );
}