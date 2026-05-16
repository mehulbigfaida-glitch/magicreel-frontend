import { create } from "zustand";

export interface Muse {
  id: string;

  placeholderImageUrl: string;

  processingImageUrl: string;
}

interface CreateAIStore {
  muses: Muse[];

  selectedMuse: Muse | null;

  heroUrl: string | null;

  isGenerating: boolean;

  setSelectedMuse: (
    muse: Muse
  ) => void;

  setHeroUrl: (
    url: string | null
  ) => void;

  setGenerating: (
    value: boolean
  ) => void;
}

export const useCreateAIStore =
create<CreateAIStore>((set)=>({

muses:[


{
id:"FS1",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778771850/PH_FS1_b4hwcr.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778756480/FS1_uefw8h.png"
},

{
id:"FS2",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778771850/PH_FS2_lrmewt.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778756481/FS2_nopujp.png"
},

{
id:"FS3",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778771846/PH_FS3_ptneis.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778756480/FS3_xu8jyw.png"
},

{
id:"FS6",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778870883/PH_FS6_nx5nht.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778870877/FS6_be42io.png"
},

{
id:"FS9",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778870883/PH_FS9_eqxyzk.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778870878/FS9_qoz1w3.png"
},

{
id:"FP1",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778756482/PH_FP1_dtovcw.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778756480/FP1_zqzl68.png"
},

{
id:"FP2",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778756484/PH_FP2_j6v7eb.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778756480/FP2_ndfuge.png"
},

{
id:"FP3",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778777103/PH_FP3_bwytum.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778756480/FP3_vugx9a.png"
},

{
id:"MP2",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778870882/PH_MP2_nziwge.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778870877/MP2_vz9vev.png"
},

{
id:"MP3",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778870878/PH_MP3_xc72ch.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778870878/MP3_kxs0uc.png"
},

{
id:"MS1",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778773485/PH_MS1_u3bi1r.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778756481/MS1_cpag2h.png"
},

{
id:"MS2",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778756485/PH_MS2_jqp7cw.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778756481/MS2_uhgk6i.png"
},

{
id:"MS3",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778756487/PH_MS3_catwq2.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778756481/MS3_mbva1b.png"
},

{
id:"MS4",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778945419/PH_MS4_gjlcic.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778945392/MS4_n3x1by.png"
},

{
id:"MS5",

placeholderImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto:best,dpr_auto/v1778945418/PH_MS5_l641j9.png",

processingImageUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1778945392/MS5_b8l3ua.png"
}

],

selectedMuse:null,

heroUrl:null,

isGenerating:false,

setSelectedMuse:(muse)=>
set({
selectedMuse:muse
}),

setHeroUrl:(url)=>
set({
heroUrl:url
}),

setGenerating:(value)=>
set({
isGenerating:value
})

}));