import ImageKit from "imagekit";

let imagekit: ImageKit | null = null;

const getImageKit = () => {
  if (!imagekit) {
    if (!process.env.IMAGEKIT_PRIVATE_KEY) {
      console.warn("IMAGEKIT_PRIVATE_KEY is missing in environment variables");
    }
    
    imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
    });
  }
  return imagekit;
};

export interface UploadResult {
  fileId: string;
  name: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  fileType: string;
}

export const uploadPDFToImageKit = async (
  file: File,
  folder: string = "resumes",
): Promise<UploadResult> => {
  try {
    const ik = getImageKit();
    if (!ik) {
      throw new Error("ImageKit is not available on the server");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await ik.upload({
      file: buffer,
      fileName: `${Date.now()}-${file.name}`,
      folder,
      useUniqueFileName: true,
      tags: ["resume", "pdf"],
      responseFields: ["thumbnailUrl", "tags"],
    });

    return {
      fileId: result.fileId,
      name: result.name,
      size: result.size,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      fileType: result.fileType,
    };
  } catch (error) {
    console.error("Error uploading to ImageKit:", error);
    throw new Error("Failed to upload file to storage");
  }
};

export const deleteFileFromImageKit = async (fileId: string): Promise<void> => {
  try {
    const ik = getImageKit();
    if (!ik) {
      throw new Error("ImageKit is not available on the server");
    }
    await ik.deleteFile(fileId);
  } catch (error) {
    console.error("Error deleting file from ImageKit:", error);
    throw new Error("Failed to delete file from storage");
  }
};

export const getFileUrl = (fileId: string, transformations?: any): string => {
  const ik = getImageKit();
  if (!ik) {
    return "";
  }
  return ik.url({
    src: fileId,
    transformation: transformations || [
      {
        height: 300,
        width: 300,
      },
    ],
  });
};
