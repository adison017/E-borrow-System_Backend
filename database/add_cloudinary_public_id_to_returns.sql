-- Add cloudinary_public_id column to returns table
-- This column will store the Cloudinary public ID for uploaded slip images

ALTER TABLE returns
ADD COLUMN cloudinary_public_id VARCHAR(255) NULL
COMMENT 'Cloudinary public ID for uploaded slip images';

-- Add index for better performance when querying by cloudinary_public_id
CREATE INDEX idx_returns_cloudinary_public_id ON returns(cloudinary_public_id);