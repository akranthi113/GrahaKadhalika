import { useEffect, useRef, useState } from 'react'

export function usePWAInstall() {
  const deferredPromptRef = useRef(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault()
      deferredPromptRef.current = e
      setIsInstallable(true)
    }

    function handleAppInstalled() {
      deferredPromptRef.current = null
      setIsInstallable(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  function install() {
    const deferredPrompt = deferredPromptRef.current
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA install accepted')
      }
      deferredPromptRef.current = null
      setIsInstallable(false)
    })
  }

  return { isInstallable, install }
}
