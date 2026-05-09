import { v2 as cloudinary } from "cloudinary";
import { ErrorResponse } from "../utils/response.utils";
import { ImageType } from "../types/types";
import { ENV } from "./env";

/**
 * Uploads a base64 image to Cloudinary.
 * Configures the SDK internally to prevent credential loss.
 */
export const uploadOnCloudinary = async (image: string, folder: string): Promise<ImageType> => {
  if (!ENV.cloudinaryApiKey || !ENV.cloudinaryApiSecret || !ENV.cloudinaryName) {
    throw new Error("Cloudinary credentials are missing in ENV object.");
  }

  // Force configuration right before upload
  cloudinary.config({
    cloud_name: ENV.cloudinaryName,
    api_key: ENV.cloudinaryApiKey,
    api_secret: ENV.cloudinaryApiSecret,
    secure: true,
  });

  try {
    // Standard upload handles base64 strings with or without data-uri prefix
    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${image}`, {
      folder: `${ENV.cloudinaryFolder}/${folder}`,
      resource_type: "auto",
    });

    if (!result?.secure_url || !result.public_id) {
      throw new Error("Failed to retrieve public_id or URL from Cloudinary response");
    }

    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  } catch (error: any) {
    console.error("Cloudinary Upload Internal Error:", error);
    throw new ErrorResponse(
      `Cloudinary Upload Failed: ${error.message}`,
      500,
      "CLOUDINARY_UPLOAD_ERROR"
    );
  }
};

export const deleteOnCloudinary = async (publicId: string | undefined | null) => {
  if (!publicId) return;
  
  // Ensure config for delete as well
  cloudinary.config({
    cloud_name: ENV.cloudinaryName,
    api_key: ENV.cloudinaryApiKey,
    api_secret: ENV.cloudinaryApiSecret,
    secure: true,
  });

  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result !== "ok") {
    throw new ErrorResponse(
      "Failed to delete image from Cloudinary",
      500,
      "FAILED_TO_DELETE_IMAGE",
    );
  }
  return result;
};
