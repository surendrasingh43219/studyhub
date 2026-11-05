import fs from 'fs'
import path from 'path'

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

const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'uploaded_books.json')

function ensureDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

export function getLocalUploadedBooks(): StoredBook[] {
  try {
    ensureDir()
    if (!fs.existsSync(dataFile)) {
      // Initialize with The Personal MBA as requested by the user
      const initial: StoredBook[] = [
        {
          id: '6a748b50-22b7-4bde-af5c-f4ff8d13be29',
          title: 'The Personal MBA',
          author: 'Josh Kaufman',
          subject: 'Other',
          level: 'All Levels',
          class_level: 'All Levels',
          category: 'Business & Management',
          language: 'English',
          description: 'Master the Art of Business — A world-class business education in a single volume covering value creation, marketing, sales, value delivery, finance, and the human mind.',
          file_format: 'pdf',
          file_size_bytes: 15400000,
          page_count: 448,
          license: 'Author Permission',
          storage_path: 'uploads/personal_mba.pdf',
          file_path: 'uploads/personal_mba.pdf',
          download_count: 0,
          rating_avg: 4.9,
          tags: ['business', 'management', 'mba', 'leadership'],
          uploader_id: null,
          created_at: new Date().toISOString(),
        },
      ]
      fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2), 'utf8')
      return initial
    }
    const raw = fs.readFileSync(dataFile, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error reading local books:', err)
    return []
  }
}

export function saveLocalUploadedBook(book: StoredBook): void {
  try {
    ensureDir()
    const current = getLocalUploadedBooks()
    // Check if duplicate title
    const exists = current.some(
      (b) => b.title.toLowerCase().trim() === book.title.toLowerCase().trim()
    )
    if (!exists) {
      current.unshift(book)
      fs.writeFileSync(dataFile, JSON.stringify(current, null, 2), 'utf8')
    }
  } catch (err) {
    console.error('Error saving local book:', err)
  }
}
