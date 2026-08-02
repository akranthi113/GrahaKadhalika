import { useEffect } from 'react'

function setMeta(name, content) {
  if (!content) return
  let tag = document.head.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export function useDocumentMeta({ title, description } = {}) {
  useEffect(() => {
    if (title) {
      document.title = title
    }
    setMeta('description', description)
  }, [title, description])
}