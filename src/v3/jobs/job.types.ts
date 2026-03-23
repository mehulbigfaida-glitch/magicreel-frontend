export type JobStatus =
  | "idle"
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type JobType =
  | "hero"
  | "reel"
  | "lookbook";

export type Job<TOutput = any> = {
  id: string;
  type: JobType;
  status: JobStatus;
  output?: TOutput;
  error?: string;
  createdAt: number;
};