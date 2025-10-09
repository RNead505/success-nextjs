import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getPosts(req, res);
    case 'POST':
      return createPost(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getPosts(req, res) {
  try {
    const {
      per_page = 10,
      page = 1,
      status = 'PUBLISHED',
      categories,
      search,
      _embed,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(per_page);
    const take = parseInt(per_page);

    const where = {
      status: status.toUpperCase(),
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categories) {
      where.categories = {
        some: {
          id: { in: categories.split(',') },
        },
      };
    }

    const posts = await prisma.post.findMany({
      where,
      skip,
      take,
      orderBy: { publishedAt: 'desc' },
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

    const total = await prisma.post.count({ where });

    res.setHeader('X-WP-Total', total);
    res.setHeader('X-WP-TotalPages', Math.ceil(total / take));

    // Transform to WordPress-like format
    const transformedPosts = posts.map(post => ({
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
    }));

    return res.status(200).json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function createPost(req, res) {
  try {
    const {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      featuredImageAlt,
      status = 'DRAFT',
      authorId,
      categories = [],
      tags = [],
      seoTitle,
      seoDescription,
    } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        featuredImageAlt,
        status: status.toUpperCase(),
        authorId,
        publishedAt: status.toUpperCase() === 'PUBLISHED' ? new Date() : null,
        seoTitle,
        seoDescription,
        categories: {
          connect: categories.map(id => ({ id })),
        },
        tags: {
          connect: tags.map(id => ({ id })),
        },
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
