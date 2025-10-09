import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      return getPage(req, res, id);
    case 'PUT':
      return updatePage(req, res, id);
    case 'DELETE':
      return deletePage(req, res, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getPage(req, res, id) {
  try {
    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    return res.status(200).json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updatePage(req, res, id) {
  try {
    const { title, slug, content, status, seoTitle, seoDescription, publishedAt } = req.body;

    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        status,
        seoTitle,
        seoDescription,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    return res.status(200).json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deletePage(req, res, id) {
  try {
    await prisma.page.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
