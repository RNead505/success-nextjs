# GraphQL Queries Library

This directory contains WPGraphQL queries for fetching content from WordPress.

## Query Structure

Each CPT (Custom Post Type) should have its own query file following this pattern:

### Example: `/lib/queries/posts.js`

```javascript
export const GET_ALL_POST_SLUGS_QUERY = `
  query GetAllPostSlugs {
    posts(first: 10000) {
      nodes {
        slug
      }
    }
  }
`;

export const GET_POST_SEO_QUERY = `
  query GetPostSEO($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      seo {
        title
        metaDesc
        opengraphImage {
          sourceUrl
        }
      }
    }
  }
`;

export const GET_SINGLE_POST_QUERY = `
  query GetSinglePost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      slug
      date
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      author {
        node {
          name
          description
          avatar {
            url
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

export const GET_ALL_POSTS_QUERY = `
  query GetAllPosts($first: Int = 10, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;
```

## Common Query Patterns

### Pagination

```javascript
export const GET_POSTS_WITH_PAGINATION = `
  query GetPostsWithPagination($first: Int = 10, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        # ... your fields
      }
    }
  }
`;
```

### Filtering by Category

```javascript
export const GET_POSTS_BY_CATEGORY = `
  query GetPostsByCategory($categoryId: Int!, $first: Int = 10) {
    posts(where: { categoryId: $categoryId }, first: $first) {
      nodes {
        # ... your fields
      }
    }
  }
`;
```

### Filtering by Custom Taxonomy

```javascript
export const GET_POSTS_BY_CUSTOM_TAX = `
  query GetPostsByCustomTax($taxName: String!, $termSlug: String!) {
    posts(where: { taxQuery: { taxonomy: $taxName, terms: [$termSlug], field: SLUG } }) {
      nodes {
        # ... your fields
      }
    }
  }
`;
```

### Search Query

```javascript
export const SEARCH_POSTS = `
  query SearchPosts($search: String!, $first: Int = 10) {
    posts(where: { search: $search }, first: $first) {
      nodes {
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;
```

## ACF Field Examples

### Simple ACF Fields

```graphql
postFields {
  fieldName
  anotherField
  numericField
}
```

### ACF Image Field

```graphql
postFields {
  heroImage {
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
}
```

### ACF Repeater Field

```graphql
postFields {
  galleryImages {
    image {
      sourceUrl
      altText
    }
    caption
  }
}
```

### ACF Relationship Field

```graphql
postFields {
  relatedPosts {
    ... on Post {
      title
      slug
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
}
```

### ACF Flexible Content

```graphql
postFields {
  flexibleContent {
    __typename
    ... on Post_Postfields_FlexibleContent_TextBlock {
      heading
      content
    }
    ... on Post_Postfields_FlexibleContent_ImageBlock {
      image {
        sourceUrl
        altText
      }
      caption
    }
  }
}
```

## Yoast SEO Fields

If you're using Yoast SEO plugin:

```graphql
seo {
  title
  metaDesc
  metaKeywords
  canonical
  opengraphTitle
  opengraphDescription
  opengraphImage {
    sourceUrl
  }
  twitterTitle
  twitterDescription
  twitterImage {
    sourceUrl
  }
  breadcrumbs {
    text
    url
  }
}
```

## Common WordPress Fields

### Post/Page Core Fields

```graphql
{
  id
  databaseId
  title
  slug
  date
  modified
  content
  excerpt
  status
  commentStatus
  featuredImage {
    node {
      sourceUrl
      altText
      mediaDetails {
        width
        height
        sizes {
          sourceUrl
          width
          height
        }
      }
    }
  }
  author {
    node {
      id
      name
      slug
      description
      email
      avatar {
        url
      }
    }
  }
  categories {
    nodes {
      id
      name
      slug
      description
      count
    }
  }
  tags {
    nodes {
      id
      name
      slug
    }
  }
}
```

## Testing Queries

You can test your queries in the GraphiQL IDE:
`https://your-site.wpengine.com/graphql`

## Custom Post Types

To find your CPT names, run this query:

```graphql
query GetContentTypes {
  contentTypes {
    nodes {
      name
      label
      graphqlSingleName
      graphqlPluralName
    }
  }
}
```

Then use the `graphqlSingleName` and `graphqlPluralName` in your queries:

```graphql
query GetMagazines {
  magazines(first: 10) {  # graphqlPluralName
    nodes {
      # fields
    }
  }
}

query GetSingleMagazine($slug: ID!) {
  magazine(id: $slug, idType: SLUG) {  # graphqlSingleName
    # fields
  }
}
```

## Performance Tips

1. **Only request fields you need** - Don't fetch unnecessary data
2. **Use pagination** - Don't fetch thousands of posts at once
3. **Use fragments** for repeated field groups
4. **Enable query batching** if making multiple requests

Example with fragments:

```graphql
fragment PostFields on Post {
  title
  slug
  date
  excerpt
  featuredImage {
    node {
      sourceUrl
    }
  }
}

query GetPosts {
  posts(first: 10) {
    nodes {
      ...PostFields
    }
  }
}
```
