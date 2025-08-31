import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default async function getUploadImageId(file: File) {
    const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();
    return storageId;
}