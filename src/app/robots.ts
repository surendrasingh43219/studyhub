import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://silent-dream-b9be.surendrasingh43219.workers.dev'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/contact',
          '/library',
          '/library/*',
          '/reader/*',
          '/guides',
          '/guides/*',
          '/terms',
          '/privacy',
          '/signin',
          '/signup',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/profile',
          '/profile/*',
          '/settings',
          '/settings/*',
          '/notes',
          '/notes/*',
          '/tools',
          '/tools/*',
          '/admin',
          '/admin/*',
          '/onboarding',
          '/onboarding/*',
          '/library/upload',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
