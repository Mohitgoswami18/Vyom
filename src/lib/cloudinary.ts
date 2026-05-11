import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadOptions {
  folder: "resumes" | "profile-pictures";
  resourceType: "raw" | "image";
  publicId?: string;
}

/**
 * Upload a file buffer to Cloudinary.
 * Returns the uploaded file's secure URL and public ID.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: UploadOptions,
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `vyom/${options.folder}`,
        resource_type: options.resourceType,
        public_id: options.publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Upload failed — no result"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    stream.end(buffer);
  });
}

export default cloudinary;
