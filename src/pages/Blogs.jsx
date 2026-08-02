import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import './Blogs.css'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchBlogs() {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError('Could not load blog posts. Please try again later.')
      } else {
        setBlogs(data || [])
      }
      setLoading(false)
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <div className="blogs-page">
        <div className="loading-state">
          <span className="spinner" aria-hidden="true" />
          Loading blogs...
        </div>
      </div>
    )
  }

  return (
    <div className="blogs-page">
      <div className="blogs-container">
        <h1>Astrology Blogs</h1>
        {error ? (
          <p className="no-blogs form-message error" role="alert">{error}</p>
        ) : blogs.length === 0 ? (
          <p className="no-blogs">No blogs yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="blogs-list">
            {blogs.map((blog) => (
              <article key={blog.id} className="blog-card">
                <Link to={`/blogs/${blog.id}`} className="blog-title-link">
                  <h2>{blog.title}</h2>
                </Link>
                <div className="blog-meta">
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{blog.author_name || 'Anonymous'}</span>
                </div>
                <p className="blog-preview">{blog.content}</p>
                <Link to={`/blogs/${blog.id}`} className="read-more-btn">
                  Read Full Post
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
