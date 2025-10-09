import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      return getPost(id, req, res);
    case 'PUT':
      return updatePost(id, req, res);
    case 'DELETE':
      return deletePost(id, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getPost(id, req, res) {
  try {
    const { _embed } = req.query;

    const post = await prisma.post.findUnique({
      where: { id },
      include: _embed === 'true' || _embed === '1' ? {
        author: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
        categories: true,
        tags: true,
      } : undefined,
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Transform to WordPress-like format
    const transformedPost = {
      id: post.id,
      date: post.publishedAt,
      modified: post.updatedAt,
      slug: post.slug,
      status: post.status.toLowerCase(),
      title: {
        rendered: post.title,
      },
      content: {
        rendered: post.content,
      },
      excerpt: {
        rendered: post.excerpt || '',
      },
      featured_media_url: post.featuredImage,
      _embedded: _embed ? {
        author: post.author ? [{
          id: post.author.id,
          name: post.author.name,
          description: post.author.bio || '',
          avatar_urls: {
            96: post.author.avatar || '',
          },
        }] : [],
        'wp:featuredmedia': post.featuredImage ? [{
          source_url: post.featuredImage,
          alt_text: post.featuredImageAlt || '',
        }] : [],
        'wp:term': [
          post.categories || [],
          post.tags || [],
        ],
      } : undefined,
    };

    return res.status(200).json(transformedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updatePost(id, req, res) {
  try {
    const {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      featuredImageAlt,
      status,
      categories,
      tags,
      seoTitle,
      seoDescription,
    } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(content && { content }),
      ...(excerpt !== undefined && { excerpt }),
      ...(featuredImage !== undefined && { featuredImage }),
      ...(featuredImageAlt !== undefined && { featuredImageAlt }),
      ...(status && { status: status.toUpperCase() }),
      ...(seoTitle !== undefined && { seoTitle }),
      ...(seoDescription !== undefined && { seoDescription }),
    };

    if (status && status.toUpperCase() === 'PUBLISHED') {
      updateData.publishedAt = new Date();
    }

    if (categories) {
      updateData.categories = {
        set: categories.map(id => ({ id })),
      };
    }

    if (tags) {
      updateData.tags = {
        set: tags.map(id => ({ id })),
      };
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });

    return res.status(200).json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deletePost(id, res) {
  try {
    await prisma.post.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
