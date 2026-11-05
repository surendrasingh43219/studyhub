'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  UploadCloud,
  FileText,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react'

const LICENSES = [
  { id: 'cc-by-4.0', name: 'Creative Commons Attribution (CC BY 4.0)' },
  { id: 'cc-by-sa-4.0', name: 'Creative Commons Attribution-ShareAlike (CC BY-SA 4.0)' },
  { id: 'public-domain', name: 'Public Domain / CC0 (No Rights Reserved)' },
  { id: 'open-source', name: 'Open Source Book (MIT / Apache / GNU FDL)' },
  { id: 'author-permission', name: 'Author Explicit Permission (Written Consent)' },
]

const SUBJECTS = [
  'Science',
  'Maths',
  'Programming',
  'History',
  'Competitive Exams',
  'Languages',
  'Novels',
  'Other',
]

export default function BookUploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [fileHash, setFileHash] = useState<string>('')
  const [fileError, setFileError] = useState<string>('')
  const [hashing, setHashing] = useState(false)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [subject, setSubject] = useState('Programming')
  const [level, setLevel] = useState('Undergraduate / Advanced')
  const [language, setLanguage] = useState('English')
  const [description, setDescription] = useState('')
  const [license, setLicense] = useState('cc-by-4.0')
  const [tags, setTags] = useState('')
  const [certifiedRights, setCertifiedRights] = useState(false)

  const [pageCount, setPageCount] = useState<number>(100)
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Compute SHA-256 client-side to prevent duplicate storage uploads
  const computeFileHash = async (selectedFile: File) => {
    setHashing(true)
    try {
      const buffer = await selectedFile.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
      setFileHash(hashHex)
    } catch {
      setFileHash('fallback-' + Date.now())
    } finally {
      setHashing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('')
    const selected = e.target.files?.[0]
    if (!selected) return

    // 1. Check size (max 100 MB)
    if (selected.size > 100 * 1024 * 1024) {
      setFileError('File exceeds maximum allowed limit of 100 MB.')
      setFile(null)
      return
    }

    // 2. Check MIME / Extension
    const validExtensions = ['.pdf', '.epub']
    const hasValidExt = validExtensions.some((ext) => selected.name.toLowerCase().endsWith(ext))
    if (!hasValidExt) {
      setFileError('Only PDF and EPUB files are supported.')
      setFile(null)
      return
    }

    setFile(selected)
    if (!title) {
      // Auto-populate title from clean filename
      const cleanName = selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      setTitle(cleanName)
    }
    const pageMatch = selected.name.match(/(\d{2,4})\s*pages?/i)
    if (pageMatch) {
      setPageCount(parseInt(pageMatch[1], 10))
    }
    computeFileHash(selected)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setErrorMsg('Please select a PDF or EPUB document.')
      return
    }
    if (!certifiedRights) {
      setErrorMsg('You must certify that you have the right to share this open-licensed work.')
      return
    }

    setLoading(true)
    setErrorMsg('')
    setUploadStatus('Uploading file & registering in library...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('author', author)
      formData.append('subject', subject)
      formData.append('level', level)
      formData.append('language', language)
      formData.append('description', description)
      formData.append('license', license)
      formData.append('fileFormat', file.name.endsWith('.epub') ? 'epub' : 'pdf')
      formData.append('fileSizeBytes', String(file.size))
      formData.append('fileHash', fileHash)
      formData.append('tags', tags)
      formData.append('pageCount', String(pageCount))

      const res = await fetch('/api/books', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Upload failed')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/library')
      }, 1200)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading book')
    } finally {
      setLoading(false)
      setUploadStatus('')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Library
      </Link>

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <UploadCloud className="w-7 h-7 text-cyan-400" /> Upload Open-Source Book
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Share textbooks, manuals, or research publications licensed under open-access terms.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Document successfully submitted to the open repository! Redirecting to library...</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* File Dropzone */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            File (PDF or EPUB, Max 100 MB) <span className="text-cyan-400">*</span>
          </label>
          <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40 relative">
            <input
              type="file"
              accept=".pdf,.epub"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <FileText className="w-6 h-6" />
              </div>
              {file ? (
                <div>
                  <p className="text-sm font-bold text-white">{file.name}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                    {hashing && ' • Computing SHA-256...'}
                    {fileHash && ` • Hash: ${fileHash.slice(0, 8)}...`}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Drag and drop your file here, or <span className="text-cyan-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Supports PDF & EPUB formats up to 100 MB</p>
                </div>
              )}
            </div>
          </div>
          {fileError && <p className="text-rose-400 text-xs mt-1.5">{fileError}</p>}
        </div>

        {/* Title & Author */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Book Title <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Structure and Interpretation of Computer Programs"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Author(s) <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Harold Abelson, Gerald Jay Sussman"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Category Hierarchy: Subject & Level */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Subject <span className="text-cyan-400">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Class / Target Level
            </label>
            <input
              type="text"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="e.g. Undergraduate, High School, Contest"
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Pages</label>
            <input
              type="number"
              min={1}
              max={5000}
              value={pageCount}
              onChange={(e) => setPageCount(parseInt(e.target.value, 10) || 1)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Required Open-Source License */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Open-Source License <span className="text-cyan-400">*</span>
          </label>
          <select
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-emerald-400 font-medium focus:outline-none focus:border-cyan-500"
          >
            {LICENSES.map((l) => (
              <option key={l.id} value={l.name}>
                {l.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-1">
            Only books with permissive, open-access, or public domain licenses are permitted on StudyHub.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Description / Abstract
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly summarize topics covered in this text..."
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. computer science, algorithms, math, scheme"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Mandatory Copyright Certification Checkbox */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={certifiedRights}
              onChange={(e) => setCertifiedRights(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-900"
            />
            <span className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">I confirm I have the right to share this file:</strong> I certify that this work is licensed under a compatible open-source license, exists in the Public Domain, or I have express permission from the copyright owner. I understand infringing uploads are subject to immediate DMCA takedown and account termination.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/library"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || !certifiedRights || !file}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {loading ? (uploadStatus || 'Validating & Uploading...') : 'Publish to Library'}
          </button>
        </div>
      </form>
    </div>
  )
}
