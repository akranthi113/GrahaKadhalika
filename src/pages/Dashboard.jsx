import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import AddBlog from '../components/AddBlog'
import './Dashboard.css'

function BlogIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M9 12h6M9 16h6M14 3v4h4" />
    </svg>
  )
}

export default function Dashboard() {
  useDocumentMeta({
    title: 'Dashboard - GrahaKadhalika',
    description: 'Manage your blog posts on GrahaKadhalika.',
  })
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [contactRequests, setContactRequests] = useState([])
  const [contactError, setContactError] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteError, setDeleteError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const confirmTimer = useRef(null)

  useEffect(() => {
    return () => clearTimeout(confirmTimer.current)
  }, [])

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUser(user)
        const { data: blogsData } = await supabase
          .from('blogs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        setBlogs(blogsData || [])

        const { data: contactData, error: contactErr } = await supabase
          .from('contact_requests')
          .select('*')
          .order('created_at', { ascending: false })

        if (contactErr) {
          setContactError('Could not load contact requests.')
        } else {
          setContactRequests(contactData || [])
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  function refreshBlogs() {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('blogs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .then(({ data }) => {
            setBlogs(data || [])
          })
      }
    })
  }

  async function handleDeleteBlog(id) {
    setDeleteError('')

    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      clearTimeout(confirmTimer.current)
      confirmTimer.current = setTimeout(() => {
        setConfirmDeleteId((current) => (current === id ? null : current))
      }, 3000)
      return
    }

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      setDeleteError('Failed to delete the blog. Please try again.')
      setConfirmDeleteId(null)
      return
    }

    setBlogs(blogs.filter((blog) => blog.id !== id))
    setConfirmDeleteId(null)
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <span className="spinner" aria-hidden="true" />
          Loading your dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>Your Blogs</h1>
        <AddBlog onBlogAdded={refreshBlogs} />
        {deleteError && (
          <p className="form-message error dashboard-inline-message" role="alert">
            {deleteError}
          </p>
        )}
        {blogs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><BlogIcon /></span>
            <h2>No blogs yet</h2>
            <p>You haven't written any blog posts yet. Write your first post above.</p>
          </div>
        ) : (
          <div className="blogs-list">
            {blogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                <div className="blog-header">
                  <Link to={`/blogs/${blog.id}`} className="blog-title-link">
                    <h3>{blog.title}</h3>
                  </Link>
                  <span className="blog-date">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="blog-preview">{blog.content.slice(0, 200)}...</p>
                <button
                  onClick={() => handleDeleteBlog(blog.id)}
                  className={confirmDeleteId === blog.id ? 'delete-btn confirm' : 'delete-btn'}
                >
                  {confirmDeleteId === blog.id ? 'Confirm Delete?' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}

        <h2 className="dashboard-section-title">Contact Requests</h2>
        {contactError && (
          <p className="form-message error dashboard-inline-message" role="alert">
            {contactError}
          </p>
        )}
        {!contactError && contactRequests.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><BlogIcon /></span>
            <h2>No contact requests yet</h2>
            <p>Contact form submissions will appear here as they come in.</p>
          </div>
        ) : (
          <div className="contact-requests-list">
            {contactRequests.map((request) => (
              <article key={request.id} className="contact-request-card">
                <div className="contact-request-header">
                  <h3>{request.name}</h3>
                  <span className="blog-date">
                    {new Date(request.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="contact-request-meta">
                  <span><strong>Email:</strong> {request.email}</span>
                  <span><strong>DOB:</strong> {request.dob}</span>
                  <span><strong>Time:</strong> {request.tob}</span>
                  <span><strong>Place:</strong> {request.pob}</span>
                </div>
                <p className="contact-request-issue">{request.issue}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
