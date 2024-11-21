const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, { likes }) => sum + likes, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((prevBlog, currentBlog) => (prevBlog && prevBlog.likes > currentBlog.likes) ? prevBlog : currentBlog, {})
  // eslint-disable-next-line no-unused-vars
  const { __v, _id, url, ...favoriteFiltered } = favorite
  return favoriteFiltered
}

const mostBlogs = (blogs) => {
  if (!blogs.length) return {}
  const authorsFreq = _.countBy(blogs, 'author')
  const [author, blogsQuantity] = _.maxBy(Object.entries(authorsFreq), ([, count]) => count) || []
  return author ? { author, blogs: blogsQuantity } : {}
}

const mostLikes = (blogs) => {
  if (!blogs.length) return {}
  const result = blogs.reduce((acc, { author, likes }) => {
    if (!acc[author]) {
      acc[author] = { author, likes: 0 }
    }
    acc[author].likes += likes
    if (!acc.max || acc[author].likes > acc[acc.max].likes) {
      acc.max = author
    }
    return acc
  }, { max: null })
  return result.max ? { author: result[result.max].author, likes: result[result.max].likes } : {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}