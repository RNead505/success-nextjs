import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { uploadAndOptimizeImage, validateImageFile } from '../../../lib/media';
import formidable from 'formidable';
import fs from 'fs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Disable Next.js body parser to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(session.user.role)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Parse form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      }
    );

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 🔒 SECURITY: Validate file type and size
    const validation = validateImageFile({
      name: uploadedFile.originalFilename || 'upload.jpg',
      type: uploadedFile.mimetype || '',
      size: uploadedFile.size,
    }, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    });

    if (!validation.valid) {
      fs.unlinkSync(uploadedFile.filepath); // Clean up temp file
      return res.status(400).json({ error: validation.error });
    }

    // Read file buffer
    const fileBuffer = fs.readFileSync(uploadedFile.filepath);

    // Upload and optimize
    const optimized = await uploadAndOptimizeImage(
      fileBuffer,
      uploadedFile.originalFilename || 'upload.jpg',
      {
        generateVariants: true,
        maxWidth: 2000,
        quality: 80,
      }
    );

    // Save to database
    const media = await prisma.media.create({
      data: {
        id: randomUUID(),
        filename: uploadedFile.originalFilename || 'upload.jpg',
        url: optimized.original,
        mimeType: uploadedFile.mimetype || 'image/jpeg',
        size: uploadedFile.size,
        width: optimized.variants[0]?.width || 0,
        height: optimized.variants[0]?.height || 0,
        alt: (Array.isArray(fields.alt) ? fields.alt[0] : fields.alt) || '',
        caption: (Array.isArray(fields.caption) ? fields.caption[0] : fields.caption) || null,
        uploadedBy: session.user.id,
      },
    });

    // Log activity
    await prisma.activity_logs.create({
      data: {
        id: randomUUID(),
        userId: session.user.id,
        action: 'UPLOAD',
        entity: 'media',
        entityId: media.id,
        details: JSON.stringify({
          filename: media.filename,
          size: media.size,
          variants: optimized.variants.length,
        }),
      },
    });

    // Clean up temp file
    fs.unlinkSync(uploadedFile.filepath);

    return res.status(201).json({
      success: true,
      media: {
        id: media.id,
        url: media.url,
        filename: media.filename,
        variants: optimized.variants,
        width: media.width,
        height: media.height,
      },
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    return res.status(500).json({
      error: 'Failed to upload media',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
