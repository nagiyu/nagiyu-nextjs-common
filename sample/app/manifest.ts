import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js Common Sample',
    short_name: 'Next.js Common Sample',
    description: 'Next.js Common Sample Application',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo.png',
        sizes: '400x400',
        type: 'image/png'
      }
    ],
    share_target: {
      action: '/share',
      method: 'GET',
      params: {
        title: 'title',
        text: 'text',
        url: 'url'
      }
    }
  }
}
