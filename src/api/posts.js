/* eslint-disable no-undef */
const API_BASE =
  (typeof window === 'undefined'
    ? (process.env.SSR_BACKEND_URL || process.env.VITE_BACKEND_URL)
    : import.meta.env.VITE_BACKEND_URL) ?? import.meta.env.VITE_BACKEND_URL

export const getPosts = async (queryParams = {}) => {
  const qs = new URLSearchParams(queryParams).toString()
  const url = `${API_BASE}/posts${qs ? `?${qs}` : ''}`
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`)
  return res.json()
}

export const createPost = async (token, post) => {
  const url = `${API_BASE}/posts`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(post),
  })
  if (!res.ok) throw new Error(`POST ${url} -> ${res.status}`)
  return res.json()
}

export const getPostById = async (postId) => {
  const url = `${API_BASE}/posts/${encodeURIComponent(postId)}`
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`)
  return res.json()
}
