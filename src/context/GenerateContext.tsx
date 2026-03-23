import { createContext, useContext, useState } from "react";

export interface GenerateContextType {
  canGenerate: boolean;
  setCanGenerate: (v: boolean) => void;

  category: string | null;
  setCategory: (v: string) => void;

  avatarGender: "male" | "female" | null;
  setAvatarGender: (v: "male" | "female") => void;

  garmentImageUrl: string | null;
  setGarmentImageUrl: (v: string) => void;

  modelImageUrl: string | null;
  setModelImageUrl: (v: string) => void;

  attributes: any;
  setAttributes: (v: any) => void;
}

const GenerateContext = createContext<GenerateContextType | null>(null);

export function GenerateProvider({ children }: { children: React.ReactNode }) {
  const [canGenerate, setCanGenerate] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [avatarGender, setAvatarGender] = useState<"male" | "female" | null>(null);
  const [garmentImageUrl, setGarmentImageUrl] = useState<string | null>(null);
  const [modelImageUrl, setModelImageUrl] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<any>({});

  return (
    <GenerateContext.Provider
      value={{
        canGenerate,
        setCanGenerate,
        category,
        setCategory,
        avatarGender,
        setAvatarGender,
        garmentImageUrl,
        setGarmentImageUrl,
        modelImageUrl,
        setModelImageUrl,
        attributes,
        setAttributes,
      }}
    >
      {children}
    </GenerateContext.Provider>
  );
}

export function useGenerate() {
  const ctx = useContext(GenerateContext);
  if (!ctx) {
    throw new Error("useGenerate must be used inside GenerateProvider");
  }
  return ctx;
}
