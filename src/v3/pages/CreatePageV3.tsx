import { useState } from "react";
import { runHeroJob } from "../jobs/hero.job";
import "./CreatePageV3.css";

type ResultType = {
  frontImage?: string;
};

type Avatar = {
  id: string;
  name: string;
  image: string;
};

const AVATARS: Avatar[] = [
  {
    id: "riya",
    name: "Riya",
    image:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1768406616/Riya_face_t0d7fo.png",
  },
  {
    id: "aananya",
    name: "Aananya",
    image:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1768406616/Riya_face_t0d7fo.png",
  },
];

const CATEGORIES = [
  { key: "WOMEN_TOP", label: "Top" },
  { key: "WOMEN_ONE_PIECE", label: "One Piece" },
  { key: "WOMEN_SAREE", label: "Saree" },
];

export default function CreatePageV3() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] =
    useState<Avatar | null>(null);
  const [category, setCategory] =
    useState<string>("WOMEN_TOP");
  const [selectedPill, setSelectedPill] =
    useState<string | null>(null);
  const [result, setResult] = useState<ResultType | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { uploadToCloudinary } = await import(
      "../../api/cloudinary"
    );
    const uploadedUrl = await uploadToCloudinary(file);
    setImage(uploadedUrl);
  };

  const handleGenerate = async () => {
  if (!image || !selectedAvatar) return;

  try {
    setLoading(true);

    const job = await runHeroJob({
      categoryKey: category,
      avatarGender: "female",
      avatarFaceImageUrl: selectedAvatar.image,
      garmentFrontImageUrl: image,
      styling: selectedPill || null,
    });

    // ✅ NEW RESPONSE SHAPE
    if (job?.front?.imageUrl) {
      setResult({
        frontImage: job.front.imageUrl,
      });
    }
  } catch (err) {
    console.error("Hero generation failed:", err);
  } finally {
    setLoading(false);
  }
};

  const getPills = () => {
    if (category === "WOMEN_TOP")
      return ["UNTUCKED", "TUCKED"];

    return ["SLEEVELESS", "SLEEVED"];
  };

  return (
    <div className="v3-container">
      {/* LEFT PANEL */}
      <div className="v3-sidebar">
        <h3>Create</h3>

        {/* CATEGORY */}
        <div className="v3-section">
          <p>Category</p>
          <div className="v3-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setCategory(cat.key);
                  setSelectedPill(null);
                }}
                className={
                  category === cat.key ? "active" : ""
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* AVATAR */}
        <div className="v3-section">
          <p>Avatar</p>
          <div className="v3-row">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAvatar(a)}
                className={
                  selectedAvatar?.id === a.id
                    ? "active"
                    : ""
                }
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>

        {/* PILLS */}
        <div className="v3-section">
          <p>Style</p>
          <div className="v3-row">
            {getPills().map((pill) => (
              <button
                key={pill}
                onClick={() => setSelectedPill(pill)}
                className={
                  selectedPill === pill ? "active" : ""
                }
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* UPLOAD */}
        <div className="v3-section">
          <input type="file" onChange={handleFile} />
        </div>

        {/* GENERATE */}
        <button
          className="v3-generate"
          onClick={handleGenerate}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="v3-canvas">
        {result?.frontImage ? (
          <img src={result.frontImage} />
        ) : (
          <div className="v3-placeholder">
            Preview will appear here
          </div>
        )}
      </div>
    </div>
  );
}