const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Hacia el autoempleo',
    author: 'Omar de la Fuente',
    url: 'https://www.haciaelautoempleo.com/',
    likes: 22
  },
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb
}