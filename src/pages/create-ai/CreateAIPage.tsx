import {
useEffect,
useState,
useRef
} from "react";
import { useCreateAIStore } from "../../store/createAIStore";

export default function CreateAIPage() {
  
  const {

  muses,

  selectedMuse,

  setSelectedMuse,

  isGenerating,

  setGenerating,

  heroUrl,

  setHeroUrl

}=useCreateAIStore()

  const [hoveredMuse,setHoveredMuse]=
useState<string | null>(null);

const [
garmentImageUrl,
setGarmentImageUrl
]=useState<string>("");

const [detectedGarment,setDetectedGarment] =
useState({

  category:"",

  garmentName:"",

  fit:"",

  tuckState:""

});

const fileInputRef=
useRef<HTMLInputElement>(null);

useEffect(()=>{

if(
!selectedMuse &&
muses.length>0
){

setSelectedMuse(
muses[0]
);

}

},[
muses,
selectedMuse,
setSelectedMuse
]);

const handleGenerate =
async()=>{

if(!selectedMuse){

alert(
"Please select a Muse"
);

return;

}

if(!garmentImageUrl){

alert(
"Please upload garment"
);

return;

}

try{

setGenerating(true);

setHeroUrl(null);

console.log(
"[CREATE AI GENERATE]",
{

garment:
garmentImageUrl,

muse:
selectedMuse.id

}
);

const response =
await fetch(

`${import.meta.env.VITE_API_URL}/api/create-ai/generate`,

{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

  garmentImageUrl,

  museId:
    selectedMuse.id,

  // =================================
  // Garment Intelligence V1
  // =================================

  category:
    detectedGarment?.category ?? "",

  garmentName:
  detectedGarment?.garmentName ?? "",

  fit:
    detectedGarment?.fit ?? "",

  tuckState:
    detectedGarment?.tuckState ?? ""

})

}

);

const data =
await response.json();

console.log(
"[CREATE AI RESPONSE]",
data
);

if(
!response.ok
){

throw new Error(

data?.message ||

"Generation failed"

);

}

setHeroUrl(

data?.data?.output ||

null

);

}

catch(error:any){

console.error(
error
);

alert(
"Generation failed"
);

}

finally{

setGenerating(
false
);

}

};

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #111111 0%, #050505 55%)",
        color: "white",
      }}
    >
      {/* PAGE */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "70px 20px 40px",
        }}
      >
        {/* HERO TITLE */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.45)",
              marginBottom: 24,
            }}
          >
            MAGICREEL AI STUDIO
          </div>

          <div
            style={{
              fontSize:
                window.innerWidth < 768
                  ? 62
                  : 92,
              lineHeight: 0.95,
              fontWeight: 300,
              letterSpacing: "-0.05em",
              marginBottom: 30,
            }}
          >
            Fashion
          <br />
           Creation Engine
          </div>

          <div
            style={{
              maxWidth: 760,
              margin: "0 auto",
              color: "rgba(255,255,255,0.58)",
              fontSize: 18,
              lineHeight: 1.8,
            }}
          >
            Generate luxury fashion heroes using
            semantic AI direction, garment
            intelligence, and cinematic fashion
            storytelling systems.
          </div>
        </div>

        {/* TOP GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              window.innerWidth < 980
                ? "1fr"
                : "1fr 1fr",
            gap: 22,
            marginBottom: 24,
          }}
        >
          {/* GARMENT */}
          <div
            style={{
              background: "rgba(15,15,15,0.96)",
              borderRadius: 30,
              border:
                "1px solid rgba(255,255,255,0.08)",
              padding: 24,
              backdropFilter: "blur(20px)",
            }}
          >
            {/* LABEL */}
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.45)",
                marginBottom: 18,
              }}
            >
              GARMENT INPUT
            </div>

            {/* TITLE */}
            <div
              style={{
                fontSize: 42,
                lineHeight: 1.05,
                fontWeight: 300,
                letterSpacing: "-0.04em",
                marginBottom: 18,
              }}
            >
              Upload
              <br />
              Garment
            </div>

            {/* DESC */}
            <div
              style={{
                color: "rgba(255,255,255,0.58)",
                fontSize: 16,
                lineHeight: 1.7,
                marginBottom: 26,
              }}
            >
              Upload a garment image to generate
              cinematic AI-native fashion heroes.
            </div>

            {/* UPLOAD */}

<div
onClick={()=>
fileInputRef.current?.click()
}

style={{

height:300,

borderRadius:26,

background:
"linear-gradient(180deg,#1a1a1a,#101010)",

border:
"1px dashed rgba(255,255,255,0.12)",

display:"flex",

alignItems:"center",

justifyContent:"center",

marginBottom:18,

overflow:"hidden",

cursor:"pointer"

}}
>

<input

ref={fileInputRef}

type="file"

accept="image/*"

style={{
display:"none"
}}

onChange={async(e)=>{

const file=
e.target.files?.[0];

if(!file) return;

try{

const formData=
new FormData();

formData.append(
"file",
file
);

formData.append(
"upload_preset",
"magicreel"
);

const res=
await fetch(

"https://api.cloudinary.com/v1_1/duaqfspwa/image/upload",

{

method:"POST",

body:formData

}

);

const data=
await res.json();

setGarmentImageUrl(
  data.secure_url
);


// TEMP V1 TEST DATA
// replace later with real detector output

if(
  data.secure_url
){

setDetectedGarment({

  category:"",

  garmentName:"",

  fit:"",

  tuckState:""

});

}

}
catch(error){

console.error(
error
);

alert(
"Upload failed"
);

}

}}

/>

{garmentImageUrl ? (

<img
src={
garmentImageUrl
}

style={{

width:"100%",

height:"100%",

objectFit:"contain"

}}
/>

) : (

<div
style={{

textAlign:"center",

color:
"rgba(255,255,255,0.45)"

}}
>

<div
style={{
fontSize:22,
marginBottom:10
}}
>
👕 Upload Garment
</div>

<div
style={{
fontSize:14
}}
>
PNG, JPG, WEBP
</div>

</div>

)}

</div>


{/* CHANGE */}

<button

onClick={()=>
fileInputRef.current?.click()
}

style={{

width:"100%",

height:56,

borderRadius:18,

border:
"1px solid rgba(255,255,255,0.08)",

background:"#111",

color:"white",

cursor:"pointer",

marginBottom:20,

fontSize:15

}}
>

{garmentImageUrl
? "↻ Change Garment"
: "Upload Garment"}

</button>


{/* DETECTED */}

<div
style={{

background:"#101010",

borderRadius:22,

padding:18,

border:
"1px solid rgba(255,255,255,0.06)"

}}
>

<div
style={{

fontSize:12,

letterSpacing:"0.18em",

color:
"rgba(255,255,255,0.45)",

marginBottom:12

}}
>
DETECTED
</div>

<div
style={{

fontSize:22,

fontWeight:500,

marginBottom:16

}}
>
{detectedGarment.garmentName || "No garment detected"}
</div>

<div
style={{

display:"flex",

gap:10,

flexWrap:"wrap"

}}
>

{detectedGarment.garmentName &&

[
  detectedGarment.fit,
  detectedGarment.tuckState
]
.filter(Boolean)
.map((item)=>(

<button

key={item}

style={{

padding:"10px 16px",

borderRadius:999,

background:
"linear-gradient(90deg,#7c3aed,#ec4899)",

border:
"1px solid rgba(255,255,255,0.06)",

color:"white",

fontSize:13,

cursor:"pointer"

}}

>

{item}

</button>

))
}

</div>

</div>
          </div>

          {/* MUSE */}
          <div
            style={{
              background: "rgba(15,15,15,0.96)",
              borderRadius: 30,
              border:
                "1px solid rgba(255,255,255,0.08)",
              padding: 24,
              backdropFilter: "blur(20px)",
            }}
          >
            {/* LABEL */}
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.45)",
                marginBottom: 18,
              }}
            >
              MUSE SELECTION
            </div>

            {/* TITLE */}
            <div
              style={{
                fontSize: 42,
                lineHeight: 1.05,
                fontWeight: 300,
                letterSpacing: "-0.04em",
                marginBottom: 18,
              }}
            >
              Select
              <br />
              Muse
            </div>

            {/* DESC */}
            <div
              style={{
                color: "rgba(255,255,255,0.58)",
                fontSize: 16,
                lineHeight: 1.7,
                marginBottom: 26,
              }}
            >
              Choose a muse identity or upload a
              custom fashion model image.
            </div>

            {/* GRID */}
<div
  style={{
    display: "grid",

    gridTemplateColumns:
      window.innerWidth < 768
        ? "repeat(3,minmax(0,1fr))"
        : "repeat(5,minmax(0,1fr))",

    gap: 12,

    marginBottom: 20,
  }}
>
            
              {muses.map((muse) => {

const isSelected =
selectedMuse?.id===muse.id;

const isHovered =
hoveredMuse===muse.id;

return (

<div
key={muse.id}

onClick={()=>
setSelectedMuse(muse)
}

onMouseEnter={()=>
setHoveredMuse(
muse.id
)
}

onMouseLeave={()=>
setHoveredMuse(null)
}

style={{
position:"relative",
cursor:"pointer"
}}
>

<div
style={{

aspectRatio:"3/4",

height:150,

borderRadius:18,

overflow:"hidden",

transform:
isSelected
? "scale(1.05)"
: "scale(1)",

transition:
"all .25s ease",

border:
isSelected
? "2px solid #a855f7"
: "1px solid rgba(255,255,255,.08)",

boxShadow:
isSelected
? "0 0 24px rgba(168,85,247,.35)"
: "none"

}}
>

<img
src={
muse.placeholderImageUrl
}

alt={muse.id}

style={{
width:"100%",
height:"100%",

objectFit:"contain",

objectPosition:"center top",

display:"block",

imageRendering:"-webkit-optimize-contrast",

transform:"translateZ(0)",

backfaceVisibility:"hidden",

willChange:"transform"
}}
/>

</div>

{isHovered && (

<div
style={{

position:"absolute",

left:"50%",

bottom:"112%",

transform:"translateX(-50%)",

width:180,

aspectRatio:"3/4",

padding:6,

borderRadius:22,

overflow:"hidden",

background:
"rgba(255,255,255,.94)",

border:
"1px solid rgba(255,255,255,.06)",

boxShadow:
"0 18px 50px rgba(0,0,0,.55)",

zIndex:999

}}
>

<img
src={
muse.placeholderImageUrl
}

style={{

width:"100%",

height:"100%",

objectFit:"contain",

borderRadius:18,

display:"block",

imageRendering:
"-webkit-optimize-contrast",

transform:
"translateZ(0)",

backfaceVisibility:
"hidden"

}}
/>

</div>

)}

</div>

);

})}
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 14,
              }}
            >
              <button
                style={{
                  height: 56,
                  borderRadius: 18,
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  background: "#111",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                ✨ Explore Muse
              </button>

              <button
                style={{
                  height: 56,
                  borderRadius: 18,
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  background: "#111",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                ⬆ Upload Muse
              </button>
            </div>
          </div>
        </div>

        {/* HERO BAR */}
        <div
          style={{
            background: "rgba(15,15,15,0.96)",
            borderRadius: 28,
            border:
              "1px solid rgba(255,255,255,0.08)",
            padding: 22,
            marginBottom: 26,
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexDirection:
                window.innerWidth < 980
                  ? "column"
                  : "row",
            }}
          >
{/* GENERATE HERO BAR */}

<div
style={{

width:"100%",

marginTop:24,

borderRadius:28,

padding:"32px 40px",

background:"#070707",

border:"1px solid rgba(255,255,255,.08)",

display:"flex",

alignItems:"center",

justifyContent:"space-between",

gap:30

}}
>

<div>

<div
style={{

fontSize:14,
fontWeight:700,

letterSpacing:3,

opacity:.55,

marginBottom:12

}}
>
GENERATE HERO
</div>

<div
style={{

fontSize:16,

opacity:.8

}}
>
Estimated generation time: 2–3 min
</div>

</div>

<button
onClick={handleGenerate}

disabled={isGenerating}

style={{

padding:"20px 52px",

borderRadius:999,

border:"none",

background:
"linear-gradient(90deg,#7c3aed,#ec4899)",

color:"#fff",

fontWeight:700,

cursor:"pointer"

}}
>

{isGenerating
? "GENERATING..."
: "GENERATE"}

</button>

</div>

</div>
</div>

{/* GENERATED HERO */}

{heroUrl && (

<div
style={{

marginTop:40,

display:"flex",

justifyContent:"center"

}}
>

<img
src={heroUrl}

alt="Hero"

style={{

width:"100%",

maxWidth:720,

borderRadius:24,

display:"block",

objectFit:"contain",

boxShadow:
"0 20px 80px rgba(0,0,0,.35)"

}}
/>

</div>

)}
          
          
        {/* ACTIONS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              window.innerWidth < 980
                ? "1fr"
                : "repeat(4,minmax(0,1fr))",
            gap: 20,
          }}
        >
          {[
            {
              title: "E-COM Pack",
              icon: "🛍",
            },
            {
              title: "Social Pack",
              icon: "📱",
            },
            {
              title: "Campaign",
              icon: "✨",
            },
            {
              title: "Reel",
              icon: "🎬",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background:
                  "rgba(15,15,15,0.96)",
                borderRadius: 28,
                border:
                  "1px solid rgba(255,255,255,0.08)",
                padding: 24,
                backdropFilter: "blur(20px)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  background:
                    "linear-gradient(135deg,#7c3aed,#ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  marginBottom: 20,
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  marginBottom: 12,
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  color:
                    "rgba(255,255,255,0.58)",
                  fontSize: 15,
                  lineHeight: 1.7,
                }}
              >
                Expand your hero into premium
                fashion content.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}