import staticUploadedBooksData from '../../data/uploaded_books.json'

export interface StoredBook {
  id: string
  title: string
  author: string
  subject: string
  level: string
  class_level?: string
  category: string
  language: string
  description: string
  file_format: string
  file_size_bytes: number
  page_count: number
  license: string
  storage_path: string
  file_path?: string
  download_count: number
  rating_avg: number
  tags: string[]
  uploader_id: string | null
  created_at?: string
}

function deduplicateBooks(books: StoredBook[]): StoredBook[] {
  const seenIds = new Set<string>()
  const result: StoredBook[] = []
  for (const b of books) {
    if (b && b.id && !seenIds.has(b.id)) {
      seenIds.add(b.id)
      result.push(b)
    }
  }
  return result
}

const DEFAULT_BOOKS: StoredBook[] = deduplicateBooks(staticUploadedBooksData as StoredBook[])

function getRuntimeFs(): any {
  try {
    if (typeof process !== 'undefined' && (process as any).release?.name === 'node') {
      return (eval)('require')('fs')
    }
  } catch {}
  return null
}

function getRuntimePath(): any {
  try {
    if (typeof process !== 'undefined' && (process as any).release?.name === 'node') {
      return (eval)('require')('path')
    }
  } catch {}
  return null
}

export function getLocalUploadedBooks(): StoredBook[] {
  try {
    const fs = getRuntimeFs()
    const path = getRuntimePath()
    if (fs && path) {
      const dataFile = path.join(process.cwd(), 'data', 'uploaded_books.json')
      if (fs.existsSync(dataFile)) {
        const parsed = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
        return deduplicateBooks(parsed)
      }
    }
  } catch {}
  return DEFAULT_BOOKS
}

export function saveLocalUploadedBook(book: StoredBook): void {
  try {
    const fs = getRuntimeFs()
    const path = getRuntimePath()
    if (fs && path) {
      const dataDir = path.join(process.cwd(), 'data')
      const dataFile = path.join(dataDir, 'uploaded_books.json')
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      const current = getLocalUploadedBooks()
      const exists = current.some(
        (b) => b.id === book.id || b.title.toLowerCase().trim() === book.title.toLowerCase().trim()
      )
      if (!exists) {
        current.unshift(book)
        fs.writeFileSync(dataFile, JSON.stringify(current, null, 2), 'utf8')
      }
    }
  } catch {}
}
