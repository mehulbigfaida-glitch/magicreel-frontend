import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAIHero.css";
import { API_BASE } from "../../config/api";
import { useAuthStore } from "../../store/authStore";

import {
  GARMENTS,
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

const [
selectedMuse,
setSelectedMuse
]=useState("");

const [
hoveredMuse,
setHoveredMuse
]=useState("");

const pollRef = useRef<number | null>(null);

const fetchMe =
useAuthStore(
(s)=>s.fetchMe
);

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
]=useState<string|null>(null);



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
    } catch {
      alert(
        "Front image upload failed"
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
    } catch {
      alert(
        "Back image upload failed"
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

if(res.status===403){

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

await fetchMe();

}catch(err:any){

setHeroError(
err.message
);

setHeroLoading(false);

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
          padding:
            "70px 20px 40px",
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
            MAGICREEL AI STUDIO
          </div>

          <div
            style={{
              fontSize:
                isMobile
                  ? 58
                  : 92,

              lineHeight: .95,
              fontWeight: 300
            }}
          >
            Fashion
            <br />
            Creation Engine
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
  value={
    selectedSubType
  }

  disabled={false}

                onChange={(e) => {

                  const subtype =
                    e.target
                      .value as GarmentSubType;

                  setSelectedSubType(
                    subtype
                  );

                  const pills =
                    CATEGORY_PILLS[
                    subtype
                    ];

                  if (
                    pills?.length
                  ) {

                    setSelectedPill(
                      pills[0]
                    );

                  }

                }}

                style={{
                  height:46,
                  borderRadius:12,
                  background:"#111",
                  color:"white"
                }}
              >

                <option value="">
                  Select Garment
                </option>

                {selectedCategory &&
                  GARMENTS[
                    selectedCategory
                  ].map(
                    (
                      item
                    ) => (

                      <option
                        key={
                          item.key
                        }

                        value={
                          item.key
                        }
                      >
                        {
                          item.label
                        }
                      </option>

                    )
                  )}

              </select>

            </div>


            {/* uploads */}

            <div
              style={{
                display:"grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap:14,
                marginBottom:16
              }}
            >

              <label
                style={{
                  height:300,
                  borderRadius:20,
                  border:
                    "1px dashed rgba(255,255,255,.1)",

                  background:"#111",

                  cursor:"pointer",

                  display:"flex",

                  justifyContent:"center",

                  alignItems:"center",

                  overflow:"hidden"
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

                {productImageUrl ?

                <img
                  src={
                    productImageUrl
                  }

                  style={{
  width:"100%",
  height:"100%",
  objectFit:"contain",
  padding:"8px",
  background:"#111"
}}
                />

                :

                <div>
                  Upload Front
                </div>

                }

              </label>


              <label
                style={{
                  height:300,
                  borderRadius:20,
                  border:
                    "1px dashed rgba(255,255,255,.1)",

                  background:"#111",

                  cursor:"pointer",

                  display:"flex",

                  justifyContent:"center",

                  alignItems:"center",

                  overflow:"hidden"
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

                {backImageUrl ?

                <img
                  src={
                    backImageUrl
                  }

                  style={{
  width:"100%",
  height:"100%",
  objectFit:"contain",
  padding:"8px",
  background:"#111"
}}
                />

                :

                <div>
                  Upload Back
                </div>

                }

              </label>

            </div>


            {selectedSubType && (

              <div
                style={{
                  display:"flex",
                  gap:10,
                  flexWrap:"wrap"
                }}
              >

                {CATEGORY_PILLS[
                  selectedSubType
                ]?.map(
                  (
                    pill:string
                  )=>(

                    <button
                      key={pill}

                      onClick={()=>
                        setSelectedPill(
                          pill
                        )
                      }

                      style={{
                        padding:
                          "10px 18px",

                        borderRadius:
                          999,

                        border:"none",

                        color:"white",

                        background:

                        selectedPill===pill

                        ? "linear-gradient(90deg,#7c3aed,#ec4899)"

                        :"#111"
                      }}
                    >
                      {pill}
                    </button>

                  )
                )}

              </div>

            )}

          </div>


          <div
  style={{
    background:
      "rgba(15,15,15,.96)",

    border:
      "1px solid rgba(255,255,255,.08)",

    borderRadius:30,

    padding:22,

    minHeight:500
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
                display:"grid",

                gridTemplateColumns:
                  isMobile
                  ? "repeat(3,1fr)"
                  : "repeat(5,1fr)",

                gap:12
              }}
            >

              {Object.values(
MUSE_REGISTRY
).map((muse)=>(

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

</div>

))}

            </div>

          </div>

        </div>


        <div

onClick={
canGenerate
? generateHero
: undefined
}

style={{
height:60,

background:

canGenerate
? "linear-gradient(90deg,#7c3aed,#ec4899)"
: "#111",

borderRadius:20,

display:"flex",

alignItems:"center",

justifyContent:"center",

cursor:

canGenerate
? "pointer"
: "not-allowed",

opacity:
heroLoading
? .7
:1
}}
>

{
heroLoading
? "Generating..."
: "Generate Hero"
}

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
"repeat(auto-fit,minmax(420px,1fr))",
gap:20
}}
>

{/* FRONT HERO */}

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

<div style={{padding:14}}>
✨ Front Hero
</div>

{frontHeroImageUrl ? (

<>

<img
src={frontHeroImageUrl ?? undefined}
style={{
width:"100%",
display:"block"
}}
/>

<div className="hero-action-bar">

<button
className="hero-action-btn"
onClick={() =>
window.open(
frontHeroImageUrl ?? undefined,
"_blank"
)
}
>
Download Hero
</button>

<button
className="hero-action-btn primary"
>
Publish Hero
</button>

</div>

</>

) : (

<div
style={{
height:490
}}
/>

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

<div style={{padding:14}}>
✨ Back Hero
</div>

{backHeroImageUrl ? (

<>

<img
src={backHeroImageUrl ?? undefined}
style={{
width:"100%",
display:"block"
}}
/>

<div className="hero-action-bar">

<button
className="hero-action-btn"
onClick={() =>
window.open(
backHeroImageUrl ?? undefined,
"_blank"
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
height:490
}}
/>

)}

</div>

</div>

{/* 360° REEL */}

<div className="reel-section">

  <div className="reel-left">

    <div className="reel-icon">
      🎬
    </div>

    <div className="reel-info">

      <div className="reel-title">
        360° Reel
      </div>

      <div className="reel-subtitle">
        Uses Front Hero + Back Hero
      </div>

      <div className="reel-meta">

        <span>⏱ 5 Seconds</span>

        <span>⚡ 3 Credits</span>

      </div>

    </div>

  </div>

  <div className="reel-right">

    {!backHeroImageUrl && (

      <div className="reel-warning">

        For best results, generate a Back Hero first.

        <div className="reel-warning-small">
          You can still continue with Front Hero only.
        </div>

      </div>

    )}

    <div className="reel-actions">

      <button
        className="reel-primary-btn"
        disabled={!frontHeroImageUrl}
      >
        Generate Reel
      </button>

      {!backHeroImageUrl && (

        <button
          className="reel-secondary-btn"
          disabled={!frontHeroImageUrl}
        >
          Continue With Front Hero Only
        </button>

      )}

    </div>

  </div>

</div>

{/* CONTINUE WITH AI */}

<div className="ai-destination-title">

✨ Create Content From Your Hero

</div>


<div className="ai-pack-grid">

{/* E-COM */}

<div className="ai-pack-card">

<div className="ai-pack-icon purple">
<ShoppingBag size={26}/>
</div>

<div className="ai-pack-title">
E-COM Lookbook
</div>

<div className="ai-pack-sub">
Generate marketplace-ready product photos,
6 different model poses with clean backgrounds
for Amazon, Shopify and online stores.
</div>

<button
className="ai-pack-btn"
disabled={!frontHeroImageUrl}
onClick={() => {

console.log("NAVIGATE TO ECOM", {
  selectedCategory,
  selectedSubType
});

navigate("/pack/ecom", {

state: {

heroImageUrl:
frontHeroImageUrl,

backHeroImageUrl:
backHeroImageUrl,

gender:
selectedCategory,

category:
selectedSubType

}

});

}}
>
Generate Pack
</button>

</div>



{/* SOCIAL */}

<div className="ai-pack-card">

<div className="ai-pack-icon pink">
<Share2 size={26}/>
</div>

<div className="ai-pack-title">
Social Pack
</div>

<div className="ai-pack-sub">
Create engaging social media creatives,
stories and promotional content designed
to boost reach and engagement.
</div>

<button
className="ai-pack-btn"
disabled={!frontHeroImageUrl}
>
Generate Pack
</button>

</div>



{/* CAMPAIGN */}

<div className="ai-pack-card">

<div className="ai-pack-icon orange">
<Megaphone size={26}/>
</div>

<div className="ai-pack-title">
Editorial Campaign
</div>

<div className="ai-pack-sub">
Transform your garment into premium
fashion campaigns with magazine-style
editorial storytelling and luxury visuals.
</div>

<button
className="ai-pack-btn"
disabled={!frontHeroImageUrl}
>
Generate Pack
</button>

</div>

</div>


</div>

</div>

);
}
{/* temp restore marker */}