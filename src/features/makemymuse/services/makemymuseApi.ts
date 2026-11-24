import { API_BASE } from "../../../config/api";
const museEnv = import.meta.env as ImportMetaEnv & { VITE_MAKEMYMUSE_API_BASE?: string };
const MAKEMYMUSE_API_BASE = museEnv.VITE_MAKEMYMUSE_API_BASE || API_BASE;

export type MuseGender = "female" | "male" | "androgynous";
export type MuseCandidate = { candidateNumber:number; publicId:string; imageUrl:string; width:number; height:number; sha256:string };
export type SavedMuse = { id:string; name:string; image:string; body:string; created:string; updatedAt:string };
export type MuseRefinement = { eyes?:string; faceShape?:string; hair?:string; lips?:string };

function token() {
  return localStorage.getItem("token") || "";
}
async function request<T>(path:string, init:RequestInit={}):Promise<T> {
  const headers = new Headers(init.headers || {});
  const auth = token();
  if (auth) headers.set("Authorization","Bearer "+auth);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type","application/json");
  const response = await fetch(MAKEMYMUSE_API_BASE+"/api/makemymuse"+path,{...init,headers});
  const payload = await response.json().catch(()=>({message:"Unexpected server response"}));
  if(!response.ok || payload.success===false) throw new Error(payload.message || "MakeMyMuse request failed ("+response.status+")");
  return payload.data as T;
}
export const makemymuseApi = {
  listMuses() {
    return request<{muses:SavedMuse[]}>("/muses");
  },
  deleteMuse(sessionId:string) {
    return request<{deleted:boolean;assetCount:number}>("/sessions/"+encodeURIComponent(sessionId),{method:"DELETE"});
  },
  uploadReference(file:File) {
    const form=new FormData();form.append("reference",file);
    return request<{publicId:string;imageUrl:string;sourceHash:string}>("/reference",{method:"POST",body:form});
  },
  createSession(referencePublicId:string,consent:boolean,sourceHash:string) {
    return request<{sessionId:string}>("/sessions",{method:"POST",body:JSON.stringify({referencePublicId,consent,sourceHash})});
  },
  promptPreview(sessionId:string,brief:{genderPresentation:MuseGender;apparentAge:number;skinDirection:string;transformationDirection?:string}) {
    return request<{promptVersion:string;prompt:string;manifest:Record<string,unknown>}>("/sessions/"+encodeURIComponent(sessionId)+"/prompt-preview",{method:"POST",body:JSON.stringify(brief)});
  },
  generateCandidates(sessionId:string,brief:{genderPresentation:MuseGender;apparentAge:number;skinDirection:string;transformationDirection?:string}) {
    return request<{batchId:string;candidateCount:number;layout:string;collage:{publicId:string;imageUrl:string;width:number;height:number};candidates:MuseCandidate[];promptVersion:string;promptHash:string}>("/sessions/"+encodeURIComponent(sessionId)+"/generate-candidates",{method:"POST",body:JSON.stringify(brief)});
  },
  refinePreview(sessionId:string,candidatePublicId:string,refinement:MuseRefinement) {
    return request<{refinementId:string;previewPublicId:string;previewImageUrl:string;sha256:string}>("/sessions/"+encodeURIComponent(sessionId)+"/refine-preview",{method:"POST",body:JSON.stringify({candidatePublicId,refinement})});
  },
  approveFace(sessionId:string,candidatePublicId:string,refinementId?:string) {
    return request<{approvedImageUrl:string;approvedPublicId:string}>("/sessions/"+encodeURIComponent(sessionId)+"/approve-face",{method:"POST",body:JSON.stringify({candidatePublicId,refinementId})});
  },
  generateFinal(sessionId:string,bodyType:string) {
    return request<{imageUrl:string;publicId:string;bodyType}>("/sessions/"+encodeURIComponent(sessionId)+"/generate-final",{method:"POST",body:JSON.stringify({bodyType})});
  },
  save(sessionId:string,name:string) {
    return request<{sessionId:string;name:string;imageUrl:string;publicId:string}>("/sessions/"+encodeURIComponent(sessionId)+"/save",{method:"POST",body:JSON.stringify({name})});
  },
  history(sessionId:string) {
    return request<{sessionId:string;events:Array<{event_type:string;event_data:any;created_at:string}>}>("/sessions/"+encodeURIComponent(sessionId)+"/history");
  },
  certificate(sessionId:string) {
    return request<{manifest:Record<string,unknown>;manifestHash:string;signature:string|null;publicKeyPem:string|null;keyId:string|null;signatureStatus:string}>("/sessions/"+encodeURIComponent(sessionId)+"/certificate");
  }
};
