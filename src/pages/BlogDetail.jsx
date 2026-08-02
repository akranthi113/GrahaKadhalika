import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import './BlogDetail.css'

export default function BlogDetail() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchBlog() {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setError('Could not find that blog post.')
      } else {
        setBlog(data)
      }
      setLoading(false)
    }

    fetchBlog()
  }, [id])

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="loading-state">
          <span className="spinner" aria-hidden="true" />
          Loading post...
        </div>
      </div>
    )
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        <nav className="blog-detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/blogs">← Back to Blogs</Link>
        </nav>
        {error ? (
          <div className="blog-detail-missing">
            <p className="form-message error" role="alert">{error}</p>
            <Link to="/blogs" className="empty-cta">Browse Blogs</Link>
          </div>
        ) : (
          <article className="blog-detail-card">
            <h1>{blog.title}</h1>
            <div className="blog-detail-meta">
              <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              <span aria-hidden="true"> · </span>
              <span>{blog.author_name || 'Anonymous'}</span>
            </div>
            <div className="blog-detail-content">
              {blog.content.split('\n').map((paragraph, i) =>
                paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
              )}
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
