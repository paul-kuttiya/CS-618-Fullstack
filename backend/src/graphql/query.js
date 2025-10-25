import {
  getPostById,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
} from '../services/posts.js'

export const querySchema = `#graphql
input PostsOptions {
  sortBy: String
  sortOrder: String
}

type Query {
  test: String
  posts(options: PostsOptions): [Post!]!
  postsByAuthor(username: String!, options: PostsOptions): [Post!]!
  postsByTag(tag: String!, options: PostsOptions): [Post!]!
  postById(id: ID!): Post
}
`

export const queryResolver = {
  Query: {
    test: () => 'Hello World from GraphQL!',
    posts: async (_parent, { options }) => {
      return await listAllPosts(options)
    },
    postsByAuthor: async (_parent, { username, options }) => {
      return await listPostsByAuthor(username, options)
    },
    postsByTag: async (_parent, { tag, options }) => {
      return await listPostsByTag(tag, options)
    },
    postById: async (_parent, { id }) => {
      return await getPostById(id)
    },
  },
}
