import { Blog } from './pages/Blog.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { useLoaderData } from 'react-router-dom'
import { getPosts } from './api/posts.js'
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'
import { getUserInfo } from './api/users.js'
import { ViewPost } from './pages/ViewPost.jsx'
import { getPostById } from './api/posts.js'
export const routes = [
  {
    path: '/',
    loader: async () => {
      const queryClient = new QueryClient()
      const author = ''
      const sortBy = 'createdAt'
      const sortOrder = 'descending'
      const posts = await getPosts({ author, sortBy, sortOrder })
      await queryClient.prefetchQuery({
        queryKey: ['posts', { author, sortBy, sortOrder }],
        queryFn: () => posts,
      })
      // Normalize author IDs and remove falsy values (avoid requests to `/users/undefined`)
      const uniqueAuthors = Array.from(
        new Set(
          posts
            .map((post) => {
              if (!post || !post.author) return null
              // author may be an object (populated) or a raw id/string
              if (typeof post.author === 'object') {
                return post.author._id ?? (post.author.toString ? post.author.toString() : null)
              }
              return post.author
            })
            .filter(Boolean),
        ),
      )

      for (const userId of uniqueAuthors) {
        await queryClient.prefetchQuery({
          queryKey: ['users', userId],
          queryFn: () => getUserInfo(userId),
        })
      }
      return dehydrate(queryClient)
    },
    Component() {
      const dehydratedState = useLoaderData()
      return (
        <HydrationBoundary state={dehydratedState}>
          <Blog />
        </HydrationBoundary>
      )
    },
  },
  {
    path: '/posts/:postId',
    loader: async ({ params }) => {
      const queryClient = new QueryClient()
      const postId = params.postId
      await queryClient.prefetchQuery({
        queryKey: ['post', postId],
        queryFn: () => getPostById(postId),
      })
      return dehydrate(queryClient)
    },
    Component({ params }) {
      const dehydratedState = useLoaderData()
      return (
        <HydrationBoundary state={dehydratedState}>
          <ViewPost postId={params.postId} />
        </HydrationBoundary>
      )
    },
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]
