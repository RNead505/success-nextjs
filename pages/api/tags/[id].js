import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      return getTag(req, res, id);
    case 'PUT':
      return updateTag(req, res, id);
    case 'DELETE':
      return deleteTag(req, res, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getTag(req, res, id) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    return res.status(200).json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateTag(req, res, id) {
  try {
    const { name, slug } = req.body;

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });

    return res.status(200).json(tag);
  } catch (error) {
    console.error('Error updating tag:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteTag(req, res, id) {
  try {
    await prisma.tag.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
