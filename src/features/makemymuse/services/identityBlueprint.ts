import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export type BlueprintPoint = { x: number; y: number; z: number };
export type IdentityBlueprintResult = {
  landmarks: BlueprintPoint[];
  faceCount: number;
  confidenceNote: string;
  anchors: {
    leftEyeCenter: BlueprintPoint;
    rightEyeCenter: BlueprintPoint;
    noseTip: BlueprintPoint;
    mouthCenter: BlueprintPoint;
    chin: BlueprintPoint;
  };
};

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

async function getLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm"
      );
      return FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "CPU",
        },
        runningMode: "IMAGE",
        numFaces: 2,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrices: false,
      });
    })();
  }
  return landmarkerPromise;
}

function average(points: BlueprintPoint[]) {
  if (!points.length) return { x: 0, y: 0, z: 0 };
  return points.reduce((sum, point) => ({ x: sum.x + point.x / points.length, y: sum.y + point.y / points.length, z: sum.z + point.z / points.length }), { x: 0, y: 0, z: 0 });
}

export async function mapIdentityBlueprint(image: HTMLImageElement): Promise<IdentityBlueprintResult> {
  const landmarker = await getLandmarker();
  const result = landmarker.detect(image);
  if (!result.faceLandmarks?.length) throw new Error("No face detected. Please upload a clear, front-facing photo with the face visible.");
  if (result.faceLandmarks.length > 1) throw new Error("More than one face detected. Please use a photo containing only one person.");
  const landmarks = result.faceLandmarks[0].map(p => ({ x: p.x, y: p.y, z: p.z }));
  const leftEyeCenter = average([landmarks[33], landmarks[133], landmarks[159], landmarks[145]]);
  const rightEyeCenter = average([landmarks[362], landmarks[263], landmarks[386], landmarks[374]]);
  const noseTip = landmarks[1];
  const mouthCenter = average([landmarks[13], landmarks[14]]);
  const chin = landmarks[152];
  return {
    landmarks,
    faceCount: result.faceLandmarks.length,
    confidenceNote: "Face geometry mapped locally in this browser using MediaPipe Face Landmarker (CPU). This is landmark geometry—not biometric identification or proof of uniqueness.",
    anchors: { leftEyeCenter, rightEyeCenter, noseTip, mouthCenter, chin },
  };
}
