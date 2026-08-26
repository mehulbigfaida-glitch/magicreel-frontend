import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAIHero.css";
import { API_BASE } from "../../config/api";

import FeatureLockedModal from "../../components/FeatureLockedModal";
import StatusModal from "../../components/StatusModal";
import { UploadCloud } from "lucide-react";
import {
  GARMENTS,
  ETHNIC_SET_SUBTYPES,
  type GarmentCategory,
  type GarmentSubType,
} from "../../magicreel/config/garments";

import {
  CATEGORY_PILLS,
} from "../../magicreel/config/categoryPills";

import {
ShoppingBag,
Share2,
Megaphone,
} from "lucide-react";

import {
MUSE_REGISTRY
}
from "../create-ai/museRegistry";

const getMuseGender = (museId: string): "female" | "male" | null => {
  if (museId.startsWith("FS") || museId.startsWith("FP")) {
    return "female";
  }

  if (museId.startsWith("MS") || museId.startsWith("MP")) {
    return "male";
  }

  return null;
};

export default function CreateAIHero() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 980
  );

  const [selectedCategory, setSelectedCategory] =
    useState<GarmentCategory | "">("");

  const [selectedSubType, setSelectedSubType] =
    useState<GarmentSubType | "">("");

  const [selectedPill, setSelectedPill] =
    useState("");

  const [productImageUrl, setProductImageUrl] =
    useState("");

  const [backImageUrl, setBackImageUrl] =
    useState("");

  const [frontUploading, setFrontUploading] =
    useState(false);

  const [backUploading, setBackUploading] =
    useState(false);

  const [lockedFeature, setLockedFeature] = useState<string | null>(null);

const [statusModal, setStatusModal] = useState({
  open: false,
  type: "info" as "success" | "error" | "warning" | "info",
  title: "",
  description: "",
});

  const [
selectedMuse,
setSelectedMuse
]=useState("");

const [
hoveredMuse,
setHoveredMuse
]=useState("");

const visibleMuses = Object.values(MUSE_REGISTRY).filter((muse) => {
  if (selectedCategory === "Women") {
    return getMuseGender(muse.id) === "female";
  }

  if (selectedCategory === "Men") {
    return getMuseGender(muse.id) === "male";
  }

  return true;
});

useEffect(() => {
  if (!selectedCategory || visibleMuses.length === 0) {
    return;
  }

  const selectedMuseIsVisible = visibleMuses.some(
    (muse) => muse.id === selectedMuse
  );

  if (!selectedMuseIsVisible) {
    setSelectedMuse(visibleMuses[0].id);
  }
}, [selectedCategory, selectedMuse, visibleMuses]);

const pollRef = useRef<number | null>(null);

const [frontRunId,setFrontRunId]=
useState<string|null>(null);

const [backRunId,setBackRunId]=
useState<string|null>(null);

const [
frontHeroImageUrl,
setFrontHeroImageUrl
]=useState<string|null>(null);

const [
backHeroImageUrl,
setBackHeroImageUrl
]=useState<string|null>(null);

const [
heroLoading,
setHeroLoading
]=useState(false);

const [
  heroError,
  setHeroError
]=
useState<string|null>(null);

useEffect(() => {
  if (!frontHeroImageUrl) return;

  heroPreviewRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}, [frontHeroImageUrl]);

const [
  reelLoading,
  setReelLoading
]=
useState(false);

const [
  generationTime,
  setGenerationTime
] = useState(0);

const heroPreviewRef =
  useRef<HTMLDivElement | null>(null);

useEffect(() => {
  if (!heroLoading) {
    return;
  }

  const startTime = performance.now();

  const timer = window.setInterval(() => {
    const elapsed =
      (performance.now() - startTime) / 1000;

    setGenerationTime(elapsed);
  }, 100);

  return () => {
    window.clearInterval(timer);
  };
}, [heroLoading]);

const downloadImage = async (
  imageUrl: string,
  filename: string
) => {
  try {

    const response =
      await fetch(imageUrl);

    const blob =
      await response.blob();

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

  } catch (error) {

    console.error(
      "Download failed",
      error
    );

  }
};

  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth < 980);

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  const uploadImage = async (
    file: File
  ) => {
    const {
      uploadToCloudinary,
    } = await import(
      "../../api/cloudinary"
    );

    return uploadToCloudinary(file);
  };

  const handleFrontUpload = async (
  file: File
) => {
  setFrontUploading(true);

  try {
    const url =
      await uploadImage(file);

    setProductImageUrl(url);
  } catch (error) {
    console.error(
      "Front image upload failed:",
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : "Front image upload failed"
    );
  } finally {
    setFrontUploading(false);
  }
};

  const handleBackUpload = async (
  file: File
) => {
  setBackUploading(true);

  try {
    const url =
      await uploadImage(file);

    setBackImageUrl(url);
  } catch (error) {
    console.error(
      "Back image upload failed:",
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : "Back image upload failed"
    );
  } finally {
    setBackUploading(false);
  }
};

const generateHero = async()=>{

if(heroLoading) return;

if(pollRef.current){

clearInterval(
pollRef.current
);

pollRef.current=null;

}

try{

setHeroError(null);

setGenerationTime(0);

setHeroLoading(true);

setFrontHeroImageUrl(
  null
);

setBackHeroImageUrl(
null
);

const token=
localStorage.getItem(
"token"
);

const res=await fetch(

`${API_BASE}/api/p2m/hero/generate-v2`,

{

method:"POST",

headers:{

"Content-Type":
"application/json",

Authorization:
`Bearer ${token}`

},

body:JSON.stringify({

categoryKey:
selectedSubType,

avatarGender:
selectedCategory,

avatarFaceImageUrl:

MUSE_REGISTRY[
selectedMuse
].processingImageUrl,

garmentFrontImageUrl:
productImageUrl,

avatarBackImageUrl:

backImageUrl
?

MUSE_REGISTRY[
selectedMuse
].processingBackImageUrl

:undefined,

garmentBackImageUrl:

backImageUrl ||
undefined,

styling:
selectedPill || null

})

}

);

const data=
await res.json();

if(
  data.error ===
  "Insufficient credits" ||
  data.error ===
  "No credits left"
){

  setHeroLoading(false);

  setLockedFeature(
    "Hero Generation"
  );

  return;
}

if(res.status===403){

  setHeroLoading(false);

  window.location.href=
  "/plans";

  return;
}

if(!res.ok){

throw new Error(
data.error ||
"Hero failed"
);

}

setFrontRunId(
data.frontRunId
);

setBackRunId(
data.backRunId||
null
);

// await fetchMe();

} catch (err: any) {

  setHeroError(
    err.message
  );
}
};

const generate360Reel = async () => {

  if (
  !frontHeroImageUrl ||
  !backHeroImageUrl ||
  reelLoading
) {
  return;
}

  try {

  setReelLoading(true);

  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API_BASE}/api/p2m/reels360/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify({

        heroImageUrl:
          frontHeroImageUrl,

        backHeroImageUrl:
          backHeroImageUrl

      })

    }
  );

  const data =
    await res.json();

  if (!res.ok) {

    throw new Error(
      data.error ||
      "360 Reel failed"
    );

  }

  window.open(
    `/reels360/${data.runId}`,
    "_blank"
  );

} catch (err: any) {

  setStatusModal({
  open: true,
  type: "error",
  title: "360° Reel",
  description:
    err.message ||
    "Failed to generate the 360° Reel."
});

} finally {

  setReelLoading(false);

}

};

  const canGenerate =
!!selectedMuse &&
!!selectedCategory &&
!!selectedSubType &&
!!selectedPill &&
!!productImageUrl &&
!frontUploading &&
!backUploading;

useEffect(() => {

if (!frontRunId && !backRunId)
return;

let cancelled=false;

let attempts=0;

const MAX=25;

let isPolling=false;

const poll=async()=>{

if(
cancelled ||
isPolling
)return;

isPolling=true;

if(attempts>=MAX){

setHeroError(
"Timeout"
);

setHeroLoading(
false
);

isPolling=false;

return;

}

attempts++;

try{

const token=
localStorage.getItem(
"token"
);

let frontDone=

!frontRunId ||

!!frontHeroImageUrl;

let backDone=

!backRunId ||

!!backHeroImageUrl;


/* FRONT */

if(

!frontDone &&
frontRunId

){

const res=
await fetch(

`${API_BASE}/api/p2m/hero/poll/${frontRunId}`,

{
headers:{

Authorization:
`Bearer ${token}`

}
}

);

if(res.ok){

const d =
await res.json();

console.log(
"HERO POLL RESULT",
d
);

if(
d.status===
"completed"
){

console.log(
"SETTING FRONT HERO",
d.imageUrl?.substring(0,120)
);

setFrontHeroImageUrl(
d.imageUrl
);

frontDone=true;

}

if(

d.status===
"failed"

){

setHeroError(
"Front failed"
);

frontDone=true;

}

}

}


/* BACK */

if(
!backDone &&
backRunId
){

const res=
await fetch(

`${API_BASE}/api/p2m/hero/poll/${backRunId}`,

{
headers:{

Authorization:
`Bearer ${token}`

}
}

);

if(res.ok){

const d=
await res.json();

if(
d.status===
"completed"
){

setBackHeroImageUrl(
d.imageUrl
);

backDone=true;

}

if(
d.status===
"failed"
){

setHeroError(
"Back failed"
);

backDone=true;

}

}

}


if(
frontDone &&
backDone
){

setHeroLoading(
false
);

isPolling=false;

return;

}

}catch(err){

console.warn(
"Polling:",
err
);

}

isPolling=false;

setTimeout(
poll,
4000
);

};

const timer=
setTimeout(
poll,
5000
);

return()=>{

cancelled=true;

clearTimeout(
timer
);

};

},[
frontRunId,
backRunId
]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#111111 0%,#050505 55%)",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: isMobile
  ? "32px 18px 28px"
  : "70px 20px 40px",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing:
                ".35em",
              opacity: .5,
              marginBottom: 16,
            }}
          >
            MAGICREEL
          </div>

          <div
            style={{
              fontSize:
  isMobile
    ? 44
    : 92,

              lineHeight: .95,
              fontWeight: 300
            }}
          >
            Fashion
            <br />
            Intelligence Engine
          </div>
        </div>

        {/* TOP */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              isMobile
                ? "1fr"
                : "1.2fr 1fr",

            gap: 22,

            marginBottom: 22
          }}
        >

          {/* LEFT */}

          <div
style={{
  background:
    "rgba(15,15,15,.96)",

  border:
    "1px solid rgba(255,255,255,.08)",

  borderRadius:30,

  padding:22,

  minHeight:500,

  position:"relative",

  overflow:"visible"
}}
>

            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 22
              }}
            >
  Upload
  <br />
  Garment
</div>

<div className="garment-upload-guide">

   Upload garment images to create realistic AI fashion models.

  <div>✓ PNG or JPEG</div>

  <div>✓ Maximum file size: 10 MB</div>

  <div>✓ Hanger / Mannequin only</div>

  <div>✓ Front + Back recommended</div>

</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 12,
                marginBottom: 14
              }}
            >

              <select
                value={
                  selectedCategory
                }

                onChange={(e) => {

                  const value =
                    e.target
                      .value as GarmentCategory;

                  setSelectedCategory(
                    value
                  );

                  setSelectedSubType(
                    ""
                  );

                  setSelectedPill(
                    ""
                  );

                }}

                style={{
                  height: 46,
                  borderRadius: 12,
                  background:
                    "#111",

                  color:
                    "white"
                }}
              >

                <option value="">
                  Select Gender
                </option>

                {Object.keys(
                  GARMENTS
                ).map(
                  (category) => (

                    <option
                      key={
                        category
                      }

                      value={
                        category
                      }
                    >
                      {category}
                    </option>

                  )
                )}

              </select>


              <select
  value={selectedSubType}
  disabled={!selectedCategory}

  onChange={(e) => {
    const subtype =
      e.target.value as GarmentSubType;

    setSelectedSubType(subtype);

    const pills =
      CATEGORY_PILLS[subtype];

    if (pills?.length) {
      setSelectedPill(pills[0]);
    } else {
      setSelectedPill("");
    }
  }}

  style={{
    height: 46,
    borderRadius: 12,
    background: "#111",
    color: "white",

    opacity:
      selectedCategory ? 1 : 0.45,

    cursor:
      selectedCategory
        ? "pointer"
        : "not-allowed",

    transition: "all .25s ease"
  }}
>
  <option value="">
    Select Garment
  </option>

  {selectedCategory &&
    GARMENTS[selectedCategory]
      .filter(
        (item) =>
          item.key !== "ethnic_set"
      )
      .map((item) => (
        <option
          key={item.key}
          value={item.key}
        >
          {item.label}
        </option>
      ))}

  {selectedCategory === "Women" && (
    <optgroup label="Ethnic Set">
      {ETHNIC_SET_SUBTYPES.map(
        (item) => (
          <option
            key={item.key}
            value={item.key}
          >
            {item.label}
          </option>
        )
      )}
    </optgroup>
  )}
</select>

            </div>

            {selectedSubType && (

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >

                {CATEGORY_PILLS[
                  selectedSubType
                ]?.map(
                  (
                    pill: string
                  ) => (

                    <button
                      key={pill}
                      type="button"

                      onClick={() =>
                        setSelectedPill(
                          pill
                        )
                      }

                      style={{
                        padding:
                          "10px 18px",

                        borderRadius:
                          999,

                        border:
                          selectedPill === pill
                            ? "1px solid rgba(255,255,255,.2)"
                            : "1px solid rgba(255,255,255,.08)",

                        color: "white",

                        background:
                          selectedPill === pill
                            ? "linear-gradient(90deg,#7c3aed,#ec4899)"
                            : "#111",

                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {pill}
                    </button>

                  )
                )}

              </div>

            )}

            {/* uploads */}

            <div
              style={{
                display:"grid",
                gridTemplateColumns:
  isMobile
    ? "1fr"
    : "1fr 1fr",
                gap: isMobile ? 18 : 14,
                marginBottom:16
              }}
            >

              <label
  style={{
    height: 300,
    borderRadius: 20,
    border: "1px dashed rgba(255,255,255,.1)",
    background: "#111",

    cursor:
      selectedSubType
        ? "pointer"
        : "not-allowed",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",

    opacity:
      selectedSubType
        ? 1
        : 0.45,

    pointerEvents:
      selectedSubType
        ? "auto"
        : "none",

    transition:
      "all .25s ease"
  }}
>

                <input
                  hidden
                  type="file"

                  accept="image/*"

                  onChange={(e)=>

                    e.target.files &&

                    handleFrontUpload(
                      e.target.files[0]
                    )
                  }
                />

                {frontUploading ? (

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      color: "#fff",
    }}
  >
    <div className="mr-spinner" />

    <div
      style={{
        fontSize: 18,
        fontWeight: 600,
      }}
    >
      Uploading Front Garment...
    </div>

  </div>

) : productImageUrl ? (

  <img
    src={productImageUrl}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
      padding: "8px",
      background: "#111",
    }}
  />

) : (

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: 12,
    }}
  >
    <UploadCloud
      size={56}
      color="#A855F7"
      strokeWidth={1.8}
    />

    <div
      style={{
        fontSize: 24,
        fontWeight: 700,
        color: "#fff",
      }}
    >
      Upload Front Garment
    </div>

    <div
      style={{
        fontSize: 15,
        color: "#9CA3AF",
      }}
    >
      PNG or JPG
    </div>

    <div
      style={{
        marginTop: 6,
        padding: "8px 18px",
        borderRadius: 999,
        background: "rgba(168,85,247,.15)",
        color: "#C084FC",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      Front View
    </div>
  </div>

)}

              </label>


              <label
  style={{
    height: 300,
    borderRadius: 20,
    border: "1px dashed rgba(255,255,255,.1)",

    background: "#111",

    cursor: selectedSubType
      ? "pointer"
      : "not-allowed",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    overflow: "hidden",

    opacity: selectedSubType
      ? 1
      : 0.45,

    pointerEvents: selectedSubType
      ? "auto"
      : "none",

    transition: "all .25s ease"
  }}
>

                <input
                  hidden
                  type="file"

                  accept="image/*"

                  onChange={(e)=>

                    e.target.files &&

                    handleBackUpload(
                      e.target.files[0]
                    )
                  }
                />

                {backUploading ? (

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      color: "#fff",
    }}
  >
    <div className="mr-spinner" />

    <div
      style={{
        fontSize: 18,
        fontWeight: 600,
      }}
    >
      Uploading Back Garment...
    </div>

    <div
      style={{
        fontSize: 16,
        color: "#9CA3AF",
      }}
    >
      Please wait...
    </div>

  </div>

) : backImageUrl ? (

  <img
    src={backImageUrl}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
      padding: "8px",
      background: "#111",
    }}
  />

) : (

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: 12,
    }}
  >
    <UploadCloud
      size={56}
      color="#A855F7"
      strokeWidth={1.8}
    />

    <div
      style={{
        fontSize: 24,
        fontWeight: 700,
        color: "#fff",
      }}
    >
      Upload Back Garment
    </div>

    <div
      style={{
        fontSize: 15,
        color: "#9CA3AF",
      }}
    >
      PNG or JPG
    </div>

    <div
      style={{
        marginTop: 6,
        padding: "8px 18px",
        borderRadius: 999,
        background: "rgba(168,85,247,.15)",
        color: "#C084FC",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      Back View (Recommended)
    </div>
  </div>

)}

              </label>

            </div>



          </div>


          <div
  style={{
    background:
      "rgba(15,15,15,.96)",

    border:
      "1px solid rgba(255,255,255,.08)",

    borderRadius:30,

    padding:22,

    minHeight:500,

    opacity:
      productImageUrl ? 1 : 0.45,

    pointerEvents:
      productImageUrl ? "auto" : "none",

    transition:
      "all .25s ease"
  }}
>

            <div
              style={{
                fontSize:24,
                fontWeight:600,
                marginBottom:22
              }}
            >
              Select
<br/>
Muse

{!productImageUrl && (

  <div
    style={{
      marginTop:12,
      fontSize:13,
      color:"rgba(255,255,255,.55)",
      fontWeight:400
    }}
  >
    Upload Front Garment first
  </div>

)}
            </div>

{hoveredMuse && (

<div
style={{
position:"absolute",

top:45,
left:"50%",

transform:
"translateX(-50%)",

width:240,

aspectRatio:"4/5",

borderRadius:24,

overflow:"hidden",

background:"#111",

border:
"1px solid rgba(255,255,255,.08)",

boxShadow:
"0 20px 60px rgba(0,0,0,.65)",

zIndex:20,

pointerEvents:"none"
}}
>

<img
src={
MUSE_REGISTRY[
hoveredMuse
]?.placeholderImageUrl
}

style={{
width:"100%",
height:"100%",

objectFit:"none",

objectPosition:"center top",

display:"block",

transform:"scale(1.02)"
}}
/>

</div>

)}

<div
  style={{
    display: "flex",
    gap: 10,
    marginBottom: 18,
    flexWrap: "wrap"
  }}
>
  <button
    type="button"
    style={{
      padding: "8px 18px",
      borderRadius: 999,
      border: "none",
      background: "#a855f7",
      color: "#fff",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
      transition: "all .2s ease"
    }}
  >
    Explore
  </button>

  <button
    type="button"
    onClick={() =>
  setStatusModal({
    open: true,
    type: "info",
    title: "Coming Soon",
    description:
  "Coming Soon!\n\nUpload a passport-style photo and MagicReel will create your personal AI Avatar.\n\nUse it instantly across Hero Images, Lookbooks and AI Fashion Reels."
  })
}
    style={{
      padding: "8px 18px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,.12)",
      background: "rgba(255,255,255,.05)",
      color: "#fff",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
      transition: "all .2s ease"
    }}
  >
    Upload
  </button>
</div>

            <div
              style={{
                display:"grid",

                gridTemplateColumns:
                  isMobile
                  ? "repeat(3,1fr)"
                  : "repeat(5,1fr)",

                gap:12
              }}
            >

              {visibleMuses.map((muse) => (

<div
key={muse.id}

onClick={()=>
setSelectedMuse(
muse.id
)
}

onMouseEnter={()=>
setHoveredMuse(
muse.id
)
}

onMouseLeave={()=>
setHoveredMuse("")
}


style={{

width:88,

height:132,

flexShrink:0,

borderRadius:18,

overflow:"hidden",

cursor:"pointer",

background:"#111",

border:
selectedMuse===muse.id
? "2px solid #a855f7"
: "1px solid rgba(255,255,255,.08)",

boxShadow:
selectedMuse===muse.id
? "0 0 30px rgba(168,85,247,.4)"
: "none",

transform:
selectedMuse===muse.id
? "scale(1.04)"
: "scale(1)",

transition:"all .25s ease"

}}
>
<img
src={muse.placeholderImageUrl}
alt={muse.id}

style={{
width:"100%",
height:"100%",

objectFit:"cover",

objectPosition:"center top",

display:"block"
}}
/>
{selectedMuse === muse.id && (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: "7px 6px",
      background: "#a855f7",
      color: "#fff",
      fontSize: 10,
      fontWeight: 700,
      lineHeight: 1,
      textAlign: "center",
      zIndex: 2,
      boxShadow: "0 -4px 12px rgba(0,0,0,.25)"
    }}
  >
    ✓ Selected
  </div>
)}
</div>

))}

            </div>

          </div>

        </div>


                <div

          onClick={
            canGenerate && !heroLoading
              ? generateHero
              : undefined
          }

          style={{
            height: 60,

            background:

              canGenerate
                ? "linear-gradient(90deg,#7c3aed,#ec4899)"
                : "#111",

            borderRadius: 20,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",

            cursor:
              canGenerate && !heroLoading
                ? "pointer"
                : "not-allowed",

            opacity:
              heroLoading
                ? 0.6
                : 1,

            pointerEvents:
              heroLoading
                ? "none"
                : "auto",
          }}
        >

          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {
              heroLoading
                ? `Generating... ${generationTime.toFixed(2)} sec`
                : "Generate Hero"
            }
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              fontWeight: 500,
              opacity: 0.78,
            }}
          >
            1 ⚡ · ~2–3 min
          </div>

        </div>


{heroError && (

<div
style={{
marginTop:14,
color:"#ef4444",
fontSize:14
}}
>
{heroError}
</div>

)}

<div
style={{
marginTop:24,
display:"grid",
gridTemplateColumns:
  isMobile
    ? "1fr"
    : "repeat(auto-fit,minmax(420px,1fr))",
gap: isMobile ? 18 : 20
}}
>

{/* FRONT HERO */}

<div
ref={heroPreviewRef}
className={
heroLoading
? "hero-preview-card"
: ""
}
style={{
borderRadius:28,
overflow:"hidden",
border:
"1px solid rgba(255,255,255,.08)",
background:
"linear-gradient(180deg,#111,#1a1a1a)",
minHeight:560,
scrollMarginTop:100
}}
>


{frontHeroImageUrl ? (

<>

<img
  src={frontHeroImageUrl ?? undefined}
  className="hero-generated-image"
/>

<div className="hero-action-bar">

<button
className="hero-action-btn"
onClick={() =>
frontHeroImageUrl &&
downloadImage(
  frontHeroImageUrl,
  "magicreel-front-hero.jpg"
)
}
>
Download Hero
</button>

<button
  className="hero-action-btn primary"
  disabled={!frontHeroImageUrl}
  onClick={() => {

    if (!frontHeroImageUrl) return;

    console.log("NAVIGATE TO ECOM", {
      selectedCategory,
      selectedSubType
    });

    const url =
      `/pack/ecom?` +
      `hero=${encodeURIComponent(frontHeroImageUrl ?? "")}` +
      `&back=${encodeURIComponent(backHeroImageUrl ?? "")}` +
      `&gender=${encodeURIComponent(selectedCategory)}` +
      `&category=${encodeURIComponent(selectedSubType)}`;

    console.log(
      "OPENING NEW TAB",
      url
    );

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  }}
>
  Generate Lookbook
</button>

</div>

</>

) : (

<div
  style={{
    height: 490,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    textAlign: "center",
  }}
>
  <div
    style={{
      fontSize: 54,
      marginBottom: 24,
      animation: heroLoading ? "pulse 1.8s ease-in-out infinite" : "none",
    }}
  >
    ✨
  </div>

  <div
    style={{
      fontSize: 28,
      fontWeight: 700,
      marginBottom: 18,
    }}
  >
    {heroLoading
      ? "Creating your AI Hero..."
      : "Your Front Hero will appear here"}
  </div>

  {!heroLoading && (
  <div
    style={{
      maxWidth: 340,
      fontSize: 15,
      lineHeight: 1.8,
      color: "rgba(255,255,255,.65)",
    }}
  >
    Generate a professional Hero image to preview your garment on your selected Muse.
  </div>
)}
</div>

)}

</div>


{/* BACK HERO */}

<div
className={
heroLoading
? "hero-preview-card"
: ""
}
style={{
borderRadius:28,
overflow:"hidden",
border:
"1px solid rgba(255,255,255,.08)",
background:
"linear-gradient(180deg,#111,#1a1a1a)",
minHeight:560
}}
>



{backHeroImageUrl ? (

<>

<img
  src={backHeroImageUrl ?? undefined}
  className="hero-generated-image"
/>

<div className="hero-action-bar">

<button
className="hero-action-btn"
onClick={() =>
backHeroImageUrl &&
downloadImage(
  backHeroImageUrl,
  "magicreel-back-hero.jpg"
)
}
>
Download Back Hero
</button>

</div>

</>

) : (

<div
  style={{
    height: 490,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    textAlign: "center",
  }}
>
  <div
    style={{
      fontSize: 54,
      marginBottom: 24,
      animation: heroLoading ? "pulse 1.8s ease-in-out infinite" : "none",
    }}
  >
    ✨
  </div>

  <div
    style={{
      fontSize: 28,
      fontWeight: 700,
      marginBottom: 18,
    }}
  >
    {heroLoading
      ? "Creating your AI Hero..."
      : "Your Back Hero will appear here"}
  </div>

  <div
    style={{
      maxWidth: 340,
      fontSize: 15,
      lineHeight: 1.8,
      color: "rgba(255,255,255,.65)",
    }}
  >
    {heroLoading
      ? "Our AI is generating a professional fashion image using your garment and selected Muse.\n\nThis usually takes around 50 seconds.\n\nPlease keep this page open while we complete your Hero."
      : "Generate a professional Hero image to preview your garment on your selected Muse."}
  </div>
</div>

)}

</div>

</div>





<FeatureLockedModal
  open={lockedFeature !== null}
  title={
    lockedFeature === "Hero Generation"
      ? "Insufficient Credit"
      : "Upgrade Required"
  }
  description={
    lockedFeature === "Hero Generation"
      ? "You don't have enough credits to generate this Hero. Upgrade your plan or add credits to continue."
      : "This feature is available on higher plans. Upgrade your subscription to unlock premium AI content packs."
  }
  featureName={
    lockedFeature === "Hero Generation"
      ? undefined
      : lockedFeature ?? undefined
  }
  primaryLabel={
    lockedFeature === "Hero Generation"
      ? "Upgrade / Add Credit"
      : "Upgrade Plan"
  }
  onClose={() => setLockedFeature(null)}
/>
</div>

<StatusModal
  open={statusModal.open}
  type={statusModal.type}
  title={statusModal.title}
  description={statusModal.description}
  onClose={() =>
    setStatusModal((prev) => ({
      ...prev,
      open: false,
    }))
  }
/>

</div>

);
}
