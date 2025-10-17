import { prisma } from '../../../lib/prisma';
import { put } from '@vercel/blob';
import formidable from 'formidable';
import { readFile } from 'fs/promises';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB for PDFs
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);

    const pdfFile = files.pdf?.[0];
    const coverImageFile = files.coverImage?.[0];

    if (!pdfFile) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    const title = fields.title?.[0];
    const publishedText = fields.publishedText?.[0];
    const description = fields.description?.[0] || '';

    if (!title || !publishedText) {
      return res.status(400).json({ message: 'Title and published text are required' });
    }

    // Upload PDF to blob storage
    const pdfBuffer = await readFile(pdfFile.filepath);
    let pdfUrl;
    let coverUrl = null;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const pdfBlob = await put(
        `magazines/${Date.now()}-${pdfFile.originalFilename || pdfFile.newFilename}`,
        pdfBuffer,
        {
          access: 'public',
          contentType: 'application/pdf',
        }
      );
      pdfUrl = pdfBlob.url;

      // Upload cover image if provided
      if (coverImageFile) {
        const coverBuffer = await readFile(coverImageFile.filepath);
        const coverBlob = await put(
          `magazines/covers/${Date.now()}-${coverImageFile.originalFilename || coverImageFile.newFilename}`,
          coverBuffer,
          {
            access: 'public',
            contentType: coverImageFile.mimetype || 'image/jpeg',
          }
        );
        coverUrl = coverBlob.url;
      }
    } else {
      // Development mode - use placeholder URLs
      pdfUrl = `/uploads/magazines/${pdfFile.originalFilename || pdfFile.newFilename}`;
      if (coverImageFile) {
        coverUrl = `/uploads/magazines/covers/${coverImageFile.originalFilename || coverImageFile.newFilename}`;
      }
      console.warn('BLOB_READ_WRITE_TOKEN not configured. Using placeholder URLs for development.');
    }

    // Store magazine metadata in database
    const magazine = await prisma.magazine.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        publishedText,
        description,
        pdfUrl,
        coverImageUrl: coverUrl,
        fileSize: pdfFile.size,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return res.status(201).json({
      message: 'Magazine uploaded successfully',
      magazine,
    });
  } catch (error) {
    console.error('Error uploading magazine:', error);
    return res.status(500).json({
      message: 'Upload failed',
      error: error.message
    });
  }
}
