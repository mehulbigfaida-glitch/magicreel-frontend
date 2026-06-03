import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ecomStudio.css";
import { API_BASE } from "../../config/api";
import { LOOKBOOK_STYLES } from "./lookbook/lookbookStyles";

// import {
// MALE_POSES,
// FEMALE_POSES
// } from "./lookbook/lookbookPoses";

export default function EcomStudioPage(){

const location=useLocation();

const navigate=useNavigate();

const fileFrontRef=
useRef<HTMLInputElement|null>(null);

const fileBackRef=
useRef<HTMLInputElement|null>(null);

const params=
new URLSearchParams(
location.search
);

const incomingFront=
location.state?.heroImageUrl||
params.get("hero")||
"";

const incomingBack=
location.state?.backHeroImageUrl||
params.get("back")||
"";

const incomingGender =
location.state?.gender || "";

const incomingCategory =
location.state?.category || "";

const[
frontHero,
setFrontHero
]=useState(
incomingFront
);

const[
backHero,
setBackHero
]=useState(
incomingBack
);

const[
selectedStyle,
setSelectedStyle
]=useState(
"studio"
);

const[
loading,
setLoading
]=useState(false);

const fromHero=
useMemo(
()=>!!incomingFront,
[incomingFront]
);

const uploadImage=(
e:any,
setter:any
)=>{
const file=
e.target.files?.[0];

if(!file)return;

const reader=
new FileReader();

reader.onload=()=>{
setter(
reader.result
);
};

reader.readAsDataURL(file);
};

async function handleGenerate(){

if(!frontHero){
alert(
"Front Hero required"
);
return;
}

try{

setLoading(true);

const token=
localStorage.getItem(
"token"
);

const res=
await fetch(
`${API_BASE}/api/p2m/lookbook-v1/generate`,
{
method:"POST",

headers:{
"Content-Type":
"application/json",

Authorization:
`Bearer ${token}`
},

body:
JSON.stringify({

heroImageUrl:
frontHero,

backHeroImageUrl:
backHero || undefined,

lookbookStyle:
selectedStyle,

gender:
incomingGender,

category:
incomingCategory

})
}
);

const data=
await res.json();

navigate(
`/pack/ecom/output/${data.runId}`
);

}
catch{

alert(
"Generation failed"
);

}

setLoading(false);

}

return (

<div className="ecom-page">

<div className="ecom-container">

<div className="mini-top">
✦ MAGICREEL AI STUDIO ✦
</div>

<h1>
Lookbook Studio
</h1>

<p className="subtitle">
Create premium fashion lookbooks with AI poses and curated luxury styling.
</p>

<div className="hero-grid">

{/* FRONT */}

<div className="hero-card">

<div className="card-title">
1. FRONT HERO IMAGE
</div>

{fromHero && (
<div className="linked-badge">
✓ Linked from Hero
</div>
)}

<div
className="preview-large"
onClick={() => fileFrontRef.current?.click()}
>

{frontHero ? (

<img src={frontHero} alt="" />

) : (

<div className="upload-center">

<div className="upload-circle">
↑
</div>

<div>
Upload front hero image
</div>

<div className="upload-text">
Required
</div>

</div>

)}

</div>

<button
onClick={() =>
fileFrontRef.current?.click()
}
>
{frontHero
? "Change Image"
: "Upload Image"}
</button>

<input
hidden
ref={fileFrontRef}
type="file"
onChange={(e)=>
uploadImage(
e,
setFrontHero
)}
/>

</div>


<div className="hero-card">

<div className="card-title">
2. BACK HERO IMAGE (OPTIONAL)
</div>

<div
className="preview-large"
onClick={() =>
fileBackRef.current?.click()
}
>

{backHero ? (

<img src={backHero} alt="" />

) : (

<div className="upload-center">

<div className="upload-circle">
↑
</div>

<div>
Upload back image
</div>

<div className="upload-text">
Recommended
</div>

</div>

)}

</div>

<button
onClick={() =>
fileBackRef.current?.click()
}
>
{backHero
? "Change Image"
: "Upload Image"}
</button>

<input
hidden
ref={fileBackRef}
type="file"
onChange={(e)=>
uploadImage(
e,
setBackHero
)}
/>

</div>

</div>


<div className="section-title">
3. CHOOSE LOOKBOOK STYLE
</div>

<div className="world-grid">

{LOOKBOOK_STYLES.map((style)=>(

<div
key={style.id}
className={`world-card ${
selectedStyle===style.id
? "selected"
: ""
}`}
onClick={() =>
setSelectedStyle(style.id)
}
>

<img
src={style.image}
alt=""
/>

<div className="world-content">

<h3>
{style.title}
</h3>

<p>
{style.prompt}
</p>

</div>

</div>

))}

</div>

<div className="benefits">

<div>
6 Premium Lookbook Poses
</div>

<div>
Luxury E-Com Styling
</div>

<div>
Consistent Identity
</div>

<div>
Ready For Shopify & Marketplace
</div>

</div>

<button
className="generate-btn"
disabled={loading}
onClick={handleGenerate}
>

{loading
? "Generating..."
: "Generate Lookbook Pack (2 Credits)"}

</button>

</div>

</div>

);
}