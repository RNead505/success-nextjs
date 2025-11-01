/**
 * GraphQL queries for Magazine CPT
 */

export const GET_ALL_MAGAZINE_SLUGS_QUERY = `
  query GetAllMagazineSlugs {
    magazines(first: 1000) {
      nodes {
        slug
      }
    }
  }
`;

export const GET_MAGAZINE_SEO_QUERY = `
  query GetMagazineSEO($slug: ID!) {
    magazine(id: $slug, idType: SLUG) {
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

export const GET_SINGLE_MAGAZINE_QUERY = `
  query GetSingleMagazine($slug: ID!) {
    magazine(id: $slug, idType: SLUG) {
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
      magazineFields {
        issueNumber
        authorName
        publishDate
        coverImage {
          sourceUrl
          altText
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
