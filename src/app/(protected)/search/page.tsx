import { SearchClientView } from '@/components/search/SearchClientView'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export const metadata = {
  title: 'Search | StudyHub',
  description: 'Search textbooks, topics, authors, and notes across StudyHub.',
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  return <SearchClientView initialQuery={q || ''} />
}
