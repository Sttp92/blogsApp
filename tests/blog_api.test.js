const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('Testing API REST', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier is called id', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.status, 200, 'API response should have status 200')
    assert(Array.isArray(response.body), 'Response body should be an array of blogs')
    const allHaveId = response.body.every((blog, index) => {
      if (!Object.hasOwn(blog, 'id')) {
        throw new Error(`Blog at index ${index} is missing the 'id' property`)
      }
      return true
    })
    assert(allHaveId, 'Not all blogs have an "id" property')
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map(blog => blog.title)
    assert(title.includes('TDD harms architecture'))
  })

  test('a blog added without likes, defaults 0 likes', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('a blog cant be added without title or url', async () => {
    const newBlogWithoutTitle = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0
    }
    const newBlogWithoutUrl = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      likes: 0,
    }

    const response1 = await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .expect(400)

    const response2 = await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(400)

    assert.strictEqual(response1.status, 400)
    assert.strictEqual(response2.status, 400)
  })

  test('a blog is deleted correctly', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogId = getResponse.body[0].id

    const deleteResponse = await api
      .delete(`/api/blogs/${blogId}`)
      .expect(204)

    assert.strictEqual(deleteResponse.status, 204)
  })

  test('a blog is updated correctly', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogId = getResponse.body[0].id

    const newLikes = { likes: 100 }

    const updateResponse = await api
      .put(`/api/blogs/${blogId}`)
      .send(newLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(updateResponse.status, 201)
    assert.strictEqual(updateResponse.body.likes, 100)
  })
})

after(async () => {
  await mongoose.connection.close()
})