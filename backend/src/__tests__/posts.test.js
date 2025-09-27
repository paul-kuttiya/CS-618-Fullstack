import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
		createPost,
		listAllPosts,
		listPostsByAuthor,
		listPostsByTag,
		getPostById,
		updatePost,
		deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'
import { createUser } from '../services/users.js'

let testUser = null
let samplePosts = []
let createdSamplePosts = []

beforeAll(async () => {
		testUser = await createUser({ username: 'sample', password: 'user' })
		samplePosts = [
				{ title: 'Learning Redux', author: testUser._id, tags: ['redux'] },
				{ title: 'Learn React Hooks', author: testUser._id, tags: ['react'] },
				{
						title: 'Full-Stack React Projects',
						author: testUser._id,
						tags: ['react', 'nodejs'],
				},
		]
})

beforeEach(async () => {
		await Post.deleteMany({})
		createdSamplePosts = await Post.create(samplePosts)
})

describe('getting a post', () => {
	test('should return the full post', async () => {
		const post = await getPostById(createdSamplePosts[0]._id)
		expect(post).not.toBeNull()
		expect(post._id.toString()).toEqual(createdSamplePosts[0]._id.toString())
		expect(post.title).toEqual(createdSamplePosts[0].title)
	})

	test('should fail if the id does not exist', async () => {
		const post = await getPostById('000000000000000000000000')
		expect(post).toEqual(null)
	})
})

describe('updating posts', () => {
	test('should update the specified property', async () => {
		const original = createdSamplePosts[0]
		await updatePost(testUser._id, original._id, { contents: 'Updated body' })
		const updatedPost = await Post.findById(original._id)
		expect(updatedPost.contents).toEqual('Updated body')
	})

	test('should not update other properties', async () => {
		const original = createdSamplePosts[0]
		await updatePost(testUser._id, original._id, { contents: 'Changed' })
		const updatedPost = await Post.findById(original._id)
		expect(updatedPost.title).toEqual('Learning Redux')
	})

	test('should update the updatedAt timestamp', async () => {
		const original = await Post.findById(createdSamplePosts[0]._id)
		const before = original.updatedAt.getTime()
		await updatePost(testUser._id, original._id, { contents: 'TS bump' })
		const updatedPost = await Post.findById(original._id)
		expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(before)
	})

	test('should fail if the id does not exist', async () => {
		const post = await updatePost(testUser._id, '000000000000000000000000', {
			contents: 'no-op',
		})
		expect(post).toEqual(null)
	})
})

describe('deleting posts', () => {
	test('should remove the post from the database', async () => {
		const id = createdSamplePosts[0]._id
		const result = await deletePost(testUser._id, id)
		expect(result.deletedCount).toEqual(1)
		const deletedPost = await Post.findById(id)
		expect(deletedPost).toEqual(null)
	})

	test('should fail if the id does not exist', async () => {
		const result = await deletePost(testUser._id, '000000000000000000000000')
		expect(result.deletedCount).toEqual(0)
	})
})

describe('listing posts', () => {
	test('should return all posts', async () => {
		const posts = await listAllPosts()
		expect(posts.length).toEqual(createdSamplePosts.length)
	})

	test('should return posts sorted by creation date descending by default', async () => {
		const posts = await listAllPosts()
		const sortedSamplePosts = [...createdSamplePosts].sort(
			(a, b) => b.createdAt - a.createdAt,
		)
		expect(posts.map((p) => p.createdAt.getTime())).toEqual(
			sortedSamplePosts.map((p) => p.createdAt.getTime()),
		)
	})

	test('should take into account provided sorting options', async () => {
		const posts = await listAllPosts({
			sortBy: 'updatedAt',
			sortOrder: 'ascending',
		})
		const sortedSamplePosts = [...createdSamplePosts].sort(
			(a, b) => a.updatedAt - b.updatedAt,
		)
		expect(posts.map((p) => p.updatedAt.getTime())).toEqual(
			sortedSamplePosts.map((p) => p.updatedAt.getTime()),
		)
	})

	test('should be able to filter posts by author', async () => {
		const posts = await listPostsByAuthor('sample')
		expect(posts.length).toBe(3)
	})

	test('should be able to filter posts by tag', async () => {
		const posts = await listPostsByTag('nodejs')
		expect(posts.length).toBe(1)
	})
})

describe('creating posts', () => {
	test('with all parameters should succeed', async () => {
		const createdPost = await createPost(testUser._id, {
			title: 'Hello Mongoose!',
			contents: 'This post is stored in a MongoDB database using Mongoose.',
			tags: ['mongoose', 'mongodb'],
		})
		expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
		const foundPost = await Post.findById(createdPost._id)
		expect(foundPost.title).toEqual('Hello Mongoose!')
		expect(foundPost.contents).toContain('MongoDB')
		expect(foundPost.createdAt).toBeInstanceOf(Date)
		expect(foundPost.updatedAt).toBeInstanceOf(Date)
	})

	test('without title should fail', async () => {
		try {
			await createPost(testUser._id, {
				contents: 'Post with no title',
				tags: ['empty'],
			})
			// If no error was thrown, force a failure
			expect(true).toBe(false)
		} catch (err) {
			expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
			expect(err.message).toContain('`title` is required')
		}
	})

	test('with minimal parameters should succeed', async () => {
		const createdPost = await createPost(testUser._id, { title: 'Only a title' })
		expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
	})
})
