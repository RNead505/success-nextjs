/**
 * Local Content API
 *
 * This replaces lib/wordpress.js for fetching content from the local database
 * instead of WordPress REST API.
 */

import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

/**
 * Get published posts with filters and pagination
 */
export async function getPublishedPosts(options: {
  categorySlug?: string;
  categoryId?: string;
  authorId?: string;
  tag?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'publishedAt' | 'views' | 'createdAt' | 'title';
  search?: string;
} = {}) {
  const {
    categorySlug,
    categoryId,
    authorId,
    tag,
    limit = 10,
    offset = 0,
    orderBy = 'publishedAt',
    search
  } = options;

  const where: Prisma.postsWhereInput = {
    status: 'PUBLISHED',
    publishedAt: { lte: new Date() },
    ...(categoryId && {
      categories: {
        some: { id: categoryId }
      }
    }),
    ...(categorySlug && {
      categories: {
        some: { slug: categorySlug }
      }
    }),
    ...(authorId && { authorId }),
    ...(tag && {
      tags: {
        some: { slug: tag }
      }
    }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const posts = await prisma.posts.findMany({
    where,
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          authorPageSlug: true,
          jobTitle: true
        }
      },
      categories: true,
      tags: true
    },
    orderBy: {
      [orderBy]: orderBy === 'title' ? 'asc' : 'desc'
    },
    take: limit,
    skip: offset
  });

  return posts;
}

/**
 * Get total count of published posts (for pagination)
 */
export async function getPublishedPostsCount(options: {
  categorySlug?: string;
  categoryId?: string;
  authorId?: string;
  tag?: string;
  search?: string;
} = {}) {
  const { categorySlug, categoryId, authorId, tag, search } = options;

  const where: Prisma.postsWhereInput = {
    status: 'PUBLISHED',
    publishedAt: { lte: new Date() },
    ...(categoryId && {
      categories: {
        some: { id: categoryId }
      }
    }),
    ...(categorySlug && {
      categories: {
        some: { slug: categorySlug }
      }
    }),
    ...(authorId && { authorId }),
    ...(tag && {
      tags: {
        some: { slug: tag }
      }
    }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  return await prisma.posts.count({ where });
}

/**
 * Get single post by slug
 */
export async function getPostBySlug(slug: string) {
  const post = await prisma.posts.findUnique({
    where: {
      slug,
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() }
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          authorPageSlug: true,
          jobTitle: true,
          socialTwitter: true,
          socialLinkedin: true,
          socialFacebook: true,
          website: true
        }
      },
      categories: true,
      tags: true
    }
  });

  // Increment view count
  if (post) {
    await prisma.posts.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });
  }

  return post;
}

/**
 * Get post by ID (for admin/preview)
 */
export async function getPostById(id: string) {
  return await prisma.posts.findUnique({
    where: { id },
    include: {
      users: true,
      categories: true,
      tags: true,
      post_revisions: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });
}

/**
 * Get related posts based on categories
 */
export async function getRelatedPosts(
  postId: string,
  categoryIds: string[],
  limit = 3
) {
  if (categoryIds.length === 0) {
    return [];
  }

  return await prisma.posts.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
      id: { not: postId },
      categories: {
        some: {
          id: { in: categoryIds }
        }
      }
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          authorPageSlug: true
        }
      },
      categories: true
    },
    take: limit,
    orderBy: { publishedAt: 'desc' }
  });
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string, includeCount = false) {
  const category = await prisma.categories.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: true
    }
  });

  if (!category) {
    return null;
  }

  // Get post count if needed
  let postCount = 0;
  if (includeCount) {
    postCount = await prisma.posts.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        categories: {
          some: { id: category.id }
        }
      }
    });
  }

  return {
    ...category,
    count: postCount
  };
}

/**
 * Get all categories
 */
export async function getAllCategories(includeCount = false) {
  const categories = await prisma.categories.findMany({
    orderBy: [
      { order: 'asc' },
      { name: 'asc' }
    ],
    include: {
      parent: true
    }
  });

  if (!includeCount) {
    return categories;
  }

  // Add post counts
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category: any) => {
      const count = await prisma.posts.count({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() },
          categories: {
            some: { id: category.id }
          }
        }
      });
      return { ...category, count };
    })
  );

  return categoriesWithCounts;
}

/**
 * Get author/user by slug
 */
export async function getAuthorBySlug(slug: string) {
  // Try to find by authorPageSlug first, then by email-based slug
  let author = await prisma.users.findFirst({
    where: { authorPageSlug: slug },
    include: {
      posts: {
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() }
        },
        include: {
          categories: true
        },
        orderBy: { publishedAt: 'desc' },
        take: 50
      }
    }
  });

  // Fallback: try to match email username
  if (!author) {
    author = await prisma.users.findFirst({
      where: {
        email: {
          startsWith: slug,
          mode: 'insensitive'
        }
      },
      include: {
        posts: {
          where: {
            status: 'PUBLISHED',
            publishedAt: { lte: new Date() }
          },
          include: {
            categories: true
          },
          orderBy: { publishedAt: 'desc' },
          take: 50
        }
      }
    });
  }

  return author;
}

/**
 * Get all authors who have published posts
 */
export async function getAllAuthors() {
  return await prisma.users.findMany({
    where: {
      posts: {
        some: {
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() }
        }
      }
    },
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: 'PUBLISHED',
              publishedAt: { lte: new Date() }
            }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  });
}

/**
 * Get page by slug
 */
export async function getPageBySlug(slug: string) {
  return await prisma.pages.findUnique({
    where: {
      slug,
      status: 'PUBLISHED'
    }
  });
}

/**
 * Get all published pages
 */
export async function getAllPages() {
  return await prisma.pages.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { order: 'asc' }
  });
}

/**
 * Get all magazines
 */
export async function getAllMagazines(limit?: number) {
  return await prisma.magazines.findMany({
    orderBy: { createdAt: 'desc' },
    ...(limit && { take: limit })
  });
}

/**
 * Get magazine by slug
 */
export async function getMagazineBySlug(slug: string) {
  return await prisma.magazines.findUnique({
    where: { slug }
  });
}

/**
 * Get latest magazine
 */
export async function getLatestMagazine() {
  return await prisma.magazines.findFirst({
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Get all press releases
 */
export async function getAllPressReleases(limit = 50) {
  return await prisma.press_releases.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() }
    },
    orderBy: { publishedAt: 'desc' },
    take: limit
  });
}

/**
 * Get press release by slug
 */
export async function getPressReleaseBySlug(slug: string) {
  return await prisma.press_releases.findUnique({
    where: {
      slug,
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() }
    }
  });
}

/**
 * Get all tags
 */
export async function getAllTags() {
  return await prisma.tags.findMany({
    orderBy: { name: 'asc' }
  });
}

/**
 * Get tag by slug with posts
 */
export async function getTagBySlug(slug: string, limit = 20) {
  const tag = await prisma.tags.findUnique({
    where: { slug },
    include: {
      posts: {
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() }
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              authorPageSlug: true
            }
          },
          categories: true
        },
        orderBy: { publishedAt: 'desc' },
        take: limit
      }
    }
  });

  return tag;
}

/**
 * Search content across posts, pages, and press releases
 */
export async function searchContent(query: string, limit = 20) {
  const [posts, pages, pressReleases] = await Promise.all([
    prisma.posts.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        users: {
          select: { id: true, name: true, authorPageSlug: true }
        },
        categories: true
      },
      take: limit,
      orderBy: { publishedAt: 'desc' }
    }),
    prisma.pages.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5
    }),
    prisma.press_releases.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5
    })
  ]);

  return {
    posts,
    pages,
    pressReleases,
    total: posts.length + pages.length + pressReleases.length
  };
}

/**
 * Get trending/popular posts by view count
 */
export async function getTrendingPosts(limit = 10, days = 30) {
  // For now, just get by view count
  // In the future, could factor in recent views from page_views table
  return await prisma.posts.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: {
        lte: new Date(),
        // Only posts from last X days
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          authorPageSlug: true
        }
      },
      categories: true
    },
    orderBy: { views: 'desc' },
    take: limit
  });
}

/**
 * Get posts for sitemap
 */
export async function getAllPostsForSitemap() {
  return await prisma.posts.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() }
    },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true
    },
    orderBy: { publishedAt: 'desc' }
  });
}

/**
 * Get categories for sitemap
 */
export async function getAllCategoriesForSitemap() {
  return await prisma.categories.findMany({
    select: {
      slug: true,
      updatedAt: true
    },
    orderBy: { name: 'asc' }
  });
}
