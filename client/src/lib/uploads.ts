import { stackbase } from "@/services/server.entry";

type UploadArgs = {
  file: File;
  category: "publications" | "gallery" | "avatars" | "sponsors" | "events";
  id: string;
  onProgress?: (pct: number) => void;
};

export async function uploadImage({
  file,
  category,
  id,
  onProgress,
}: UploadArgs): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);
  formData.append("id", id);

  try {
    const response = await stackbase.post("/uploads/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          onProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        }
      },
    });

    const result = response.data;
    if (result && result.data && result.data.url) {
      return result.data.url;
    }
    
    throw new Error(result?.message || "Invalid upload response from server");
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || error?.message || "Failed to upload image";
    throw new Error(errorMsg);
  }
}
