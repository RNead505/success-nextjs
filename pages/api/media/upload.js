import { prisma } from '../../../lib/prisma';
import { put } from '@vercel/blob';
import formidable from 'formidable';
import { readFile } from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse the multipart form data
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB max file size
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);

    // Get the uploaded file
    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the file
    const fileBuffer = await readFile(file.filepath);

    // Upload to Vercel Blob
    let blobUrl;

    // Check if BLOB_READ_WRITE_TOKEN is available (for production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(file.originalFilename || file.newFilename, fileBuffer, {
        access: 'public',
        contentType: file.mimetype,
      });
      blobUrl = blob.url;
    } else {
      // For local development, we'll use a placeholder URL
      // In a real production setup, you'd configure a different storage solution for dev
      blobUrl = `/uploads/${file.originalFilename || file.newFilename}`;

      // You could save to local filesystem here for development
      // For now, we'll just use the placeholder URL
      console.warn('BLOB_READ_WRITE_TOKEN not configured. Using placeholder URL for development.');
    }

    // Get image dimensions if it's an image
    let width, height;
    if (file.mimetype?.startsWith('image/')) {
      // You could use a library like 'sharp' or 'image-size' here
      // For now, we'll leave dimensions empty
      width = null;
      height = null;
    }

    // Create media record in database
    const media = await prisma.media.create({
      data: {
        filename: file.originalFilename || file.newFilename,
        url: blobUrl,
        mimeType: file.mimetype || 'application/octet-stream',
        size: file.size,
        width,
        height,
        alt: fields.alt?.[0] || '',
        uploadedBy: 'admin', // You'd get this from the session
        createdAt: new Date(),
      },
    });

    return res.status(201).json(media);
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({
      message: 'Upload failed',
      error: error.message
    });
  }
}
