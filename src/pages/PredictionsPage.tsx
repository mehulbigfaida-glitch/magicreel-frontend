import { useEffect, useState } from "react";

interface Prediction {
id:string;

type:string;

status:string;

mediaUrl?:string;

heroImageUrl?:string;

lookbookImages?:string[];

runId?:string;

createdAt:string;

creditsUsed?:number;
}

export default function PredictionsPage(){

const [data,setData]=
useState<Prediction[]>([]);

const [loading,setLoading]=
useState(true);


const handlePredictionClick=(item:any)=>{

if(
item.type?.toLowerCase()==="lookbook"
){

window.location.href=

`/pack/ecom/output/${
item.runId || item.id
}`;

return;

}

};


async function handleDownload(
  e:any,
  item:any
){

  e.stopPropagation();

  // LOOKBOOK → OPEN PACK
  if(
    item.type?.toLowerCase() === "lookbook"
  ){
    window.location.href =
      `/pack/ecom/output/${
        item.runId || item.id
      }`;

    return;
  }

  const url =
  item.type?.toLowerCase() === "reel"
    ? (item.mediaUrl || item.heroImageUrl)
    : (
        item.heroImageUrl ||
        item.mediaUrl ||
        (item.lookbookImages &&
          item.lookbookImages[0])
      );

  if(!url){
  return;
}

  try{

    const response =
    await fetch(url);

    const blob =
    await response.blob();

    const objectUrl =
    window.URL.createObjectURL(
      blob
    );

    const a =
    document.createElement(
      "a"
    );

    a.href =
    objectUrl;

    a.download =
    `magicreel-${item.type}`;

    document.body.appendChild(
      a
    );

    a.click();

    a.remove();

    window.URL.revokeObjectURL(
      objectUrl
    );

  }catch(err){

    console.error(
      "Download failed",
      err
    );

  }

}

function handlePublish(
  e:any,
  item:any
){

  e.stopPropagation();

  if(
    item.type?.toLowerCase() === "lookbook"
  ){
    return;
  }

  const assetUrl =
    item.type?.toLowerCase() === "reel"
      ? item.mediaUrl
      : (
          item.heroImageUrl ||
          item.mediaUrl
        );

  const heroImageUrl =
    item.heroImageUrl ||
    item.mediaUrl ||
    "";

  if(!assetUrl){
    return;
  }

  const publishUrl =
    `/publish?assetUrl=${encodeURIComponent(
      assetUrl
    )}&assetType=${encodeURIComponent(
      item.type.toLowerCase()
    )}&heroImageUrl=${encodeURIComponent(
      heroImageUrl
    )}`;

  window.open(
    publishUrl,
    "_blank",
    "noopener,noreferrer"
  );

}

useEffect(()=>{

const fetchPredictions=
async()=>{

try{

const token=
localStorage.getItem(
"token"
);

if(!token){

return;

}

const res=
await fetch(

`${import.meta.env.VITE_API_BASE_URL}/api/predictions`,

{

headers:{

Authorization:
`Bearer ${token}`

}

}

);

const json=
await res.json();

if(!res.ok){

console.error(
json
);

return;

}

const predictions:
Prediction[]=
Array.isArray(json)

?json

:json?.data || [];

predictions.sort(

(a,b)=>

new Date(
b.createdAt
).getTime()

-

new Date(
a.createdAt
).getTime()

);

setData(
predictions
);

setLoading(false);

}catch(err){

setLoading(false);

console.error(
err
);

}

};

fetchPredictions();

},[]);

if(loading){

return(

<div
style={{

minHeight:"70vh",

display:"flex",

flexDirection:"column",

alignItems:"center",

justifyContent:"center",

gap:"16px"

}}
>

<h2>

Loading your creations...

</h2>

<p
style={{
opacity:.6
}}
>

Please wait a moment

</p>

</div>

);

}


return(

<div
style={{

padding:"24px",

maxWidth:"1600px",

margin:"0 auto"

}}
>

<h1
style={{

fontSize:"24px",

fontWeight:600,

marginBottom:"20px"

}}
>

Predictions

</h1>


<div
style={{

display:"grid",

gridTemplateColumns:
"repeat(auto-fill,minmax(250px,1fr))",

gap:"20px"

}}
>

{data.map((item)=>{

const originalUrl =
  item.type?.toLowerCase() === "reel"
    ? (item.mediaUrl || item.heroImageUrl)
    : (
        item.heroImageUrl ||
        item.mediaUrl ||
        (item.lookbookImages &&
          item.lookbookImages[0])
      );

const isVideo =
  item.type === "reel" ||
  originalUrl?.toLowerCase().includes(".mp4");

const mediaUrl =
  isVideo
    ? originalUrl
    : originalUrl?.includes("/upload/")
      ? originalUrl.replace(
          "/upload/",
          "/upload/w_250,h_375,c_fill,q_auto:eco,f_auto/"
        )
      : originalUrl;


return(

<div

key={item.id}

onClick={()=>
handlePredictionClick(
item
)
}

style={{

cursor:"pointer",

position:"relative",

borderRadius:"12px",

overflow:"hidden",

boxShadow:
"0 4px 12px rgba(0,0,0,.1)"

}}

>

<div
style={{

aspectRatio:
"3 / 4",

background:"#eee"

}}
>

{mediaUrl?

isVideo?

(

<video

src={mediaUrl}

style={{

width:"100%",

height:"100%",

objectFit:
"contain",

background:
"#f5f5f5"

}}

/>

)

:

(

<img

src={mediaUrl}

style={{

width:"100%",

height:"100%",

objectFit:
"contain",

background:
"#f5f5f5"

}}

/>

)

:

(

<div
style={{

width:"100%",

height:"100%",

display:"flex",

alignItems:
"center",

justifyContent:
"center"

}}
>

No media

</div>

)}

</div>



<div
style={{

position:"absolute",

bottom:0,

left:0,

right:0,

background:
"rgba(0,0,0,.7)",

padding:"8px",

color:"white",

fontSize:"12px"

}}
>

<div
style={{

display:"flex",

justifyContent:
"space-between"

}}
>

<span>

{new Date(
item.createdAt
)
.toLocaleDateString()}

</span>

<span
style={{
color:"#4ade80"
}}
>

● Ready

</span>

</div>


<div
style={{

display:"flex",

justifyContent:
"space-between",

marginTop:"6px",

alignItems:
"center"

}}
>

<span>

{(item.creditsUsed ??

(item as any)
.credits ??

0)}

{" "}

credits

</span>

<div
style={{

display:"flex",

gap:"8px",

alignItems:
"center"

}}
>

<span
style={{
textTransform:
"uppercase"
}}
>

{item.type}

</span>


<button
  onClick={(e)=>
    handleDownload(
      e,
      item
    )
  }
>
  {item.type?.toLowerCase() === "lookbook"
    ? "View Pack"
    : "Download"}
</button>

{item.type?.toLowerCase() !== "lookbook" && (
  <button
    onClick={(e)=>
      handlePublish(
        e,
        item
      )
    }
  >
    Publish
  </button>
)}

</div>

</div>

</div>

</div>

);

})}

</div>

</div>

);

}