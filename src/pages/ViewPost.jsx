import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import { Post } from '../components/Post.jsx'
import { getPostById } from '../api/posts.js'
import { getUserInfo } from '../api/users.js'
import { Helmet } from '@dr.pogodin/react-helmet'

export function ViewPost({ postId }) {
  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })
  const post = postQuery.data

  const userInfoQuery = useQuery({
    queryKey: ['users', post?.author],
    queryFn: () => getUserInfo(post?.author),
    enabled: Boolean(post?.author),
  })
  const userInfo = userInfoQuery.data ?? {}

  function truncate(str, max = 160) {
    if (!str) return str
    return str.length > max ? str.slice(0, max - 3) + '...' : str
  }

  return (
    <div style={{ padding: 8 }}>
      {post && (
        <Helmet>
          <title>{post.title} | Full-Stack React Blog</title>
          <meta name="description" content={truncate(post.contents)} />
          {/* Open Graph */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={post.title} />
          {/* Article-specific OG properties (no 'og:' prefix for these keys) */}
          <meta property="article:published_time" content={post.createdAt} />
          {post.updatedAt && (
            <meta property="article:modified_time" content={post.updatedAt} />
          )}
          {userInfo.username && (
            <meta property="article:author" content={userInfo.username} />
          )}
          {(post.tags ?? []).map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </Helmet>
      )}

      <Header />
      <br />
      <hr />
      <Link to="/">Back to main page</Link>
      <br />
      <hr />
      {post ? <Post {...post} fullPost /> : `Post with id${postId} not found.`}
    </div>
  )
}

ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
}
