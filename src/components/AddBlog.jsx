import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import './AddBlog.css'

const SOFT_WORD_LIMIT = 1000

export default function AddBlog({ onBlogAdded }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const overLimit = wordCount > SOFT_WORD_LIMIT

  function authorNameFor(user) {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to add a blog' })
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('blogs')
      .insert([{ title, content, user_id: user.id, author_name: authorNameFor(user) }])

    if (error) {
      setMessage({ type: 'error', text: 'Failed to add blog: ' + error.message })
    } else {
      setMessage({ type: 'success', text: 'Blog added successfully!' })
      setTitle('')
      setContent('')
      if (onBlogAdded) onBlogAdded()
    }

    setLoading(false)
  }

  if (!user) {
    return (
      <div className="add-blog-card">
        <h3>Add Blog</h3>
        <p className="form-message info">Please log in to add a blog post.</p>
      </div>
    )
  }

  return (
    <div className="add-blog-card">
      <h3>Add Blog</h3>
      <form onSubmit={handleSubmit} className="add-blog-form">
        <div className="add-blog-field">
          <label htmlFor="blog-title">Title</label>
          <input
            type="text"
            id="blog-title"
            name="title"
            placeholder="A catchy title for your post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="add-blog-field">
          <label htmlFor="blog-content">Content</label>
          <textarea
            id="blog-content"
            name="content"
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
          />
          <p className={`word-count${overLimit ? ' over-limit' : ''}`} id="blog-word-count">
            {wordCount} words — aim for around {SOFT_WORD_LIMIT.toLocaleString()} words.
          </p>
        </div>
        <button type="submit" className="primary" disabled={loading || overLimit}>
          {loading ? 'Publishing...' : 'Publish Blog'}
        </button>
        {message.text && (
          <p className={`form-message ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  )
}
