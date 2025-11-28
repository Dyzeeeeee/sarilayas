import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBranding } from './useBranding'

export function useSEO() {
  const route = useRoute()
  const { branding } = useBranding()

  function updateMetaTags(meta = {}) {
    if (typeof document === 'undefined') return

    const {
      title,
      description,
      image,
      url,
      type = 'website',
      keywords,
    } = meta

    const siteName = branding.value?.siteName || 'Sarilaya'
    const fullTitle = title ? `${title} • ${siteName}` : siteName
    const defaultDescription = description || `Welcome to ${siteName} - Discover our latest news, projects, and community initiatives.`
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const fullUrl = url ? `${siteUrl}${url}` : `${siteUrl}${route.path}`
    const defaultImage = image || `${siteUrl}/MainSarilayaLogo.png`

    // Update title
    document.title = fullTitle

    // Remove existing meta tags
    const existingTags = document.querySelectorAll('meta[data-seo]')
    existingTags.forEach(tag => tag.remove())

    // Helper to create or update meta tag
    const setMetaTag = (name, content, property = false) => {
      if (!content) return
      
      const selector = property 
        ? `meta[property="${name}"]` 
        : `meta[name="${name}"]`
      
      let tag = document.querySelector(selector)
      if (!tag) {
        tag = document.createElement('meta')
        if (property) {
          tag.setAttribute('property', name)
        } else {
          tag.setAttribute('name', name)
        }
        tag.setAttribute('data-seo', 'true')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    // Basic meta tags
    setMetaTag('description', defaultDescription)
    setMetaTag('keywords', keywords)
    setMetaTag('author', siteName)
    setMetaTag('robots', 'index, follow')

    // Open Graph tags
    setMetaTag('og:title', fullTitle, true)
    setMetaTag('og:description', defaultDescription, true)
    setMetaTag('og:image', defaultImage, true)
    setMetaTag('og:url', fullUrl, true)
    setMetaTag('og:type', type, true)
    setMetaTag('og:site_name', siteName, true)

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:title', fullTitle)
    setMetaTag('twitter:description', defaultDescription)
    setMetaTag('twitter:image', defaultImage)

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      canonical.setAttribute('data-seo', 'true')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', fullUrl)
  }

  function addStructuredData(data) {
    if (typeof document === 'undefined') return

    // Remove existing structured data
    const existing = document.querySelectorAll('script[type="application/ld+json"][data-seo]')
    existing.forEach(script => script.remove())

    if (!data) return

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo', 'true')
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }

  return {
    updateMetaTags,
    addStructuredData,
  }
}

