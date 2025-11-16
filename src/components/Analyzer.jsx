import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Loader2, BadgeCheck, AlertTriangle } from 'lucide-react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

export default function Analyzer() {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFile = (e) => {
    setFile(e.target.files?.[0] ?? null)
    setResult(null)
    setError('')
  }

  const onDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }

  const analyze = async () => {
    if (!file) {
      setError('Please upload a PDF, DOCX, or TXT resume.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      if (jobDescription.trim()) form.append('job_description', jobDescription)

      const res = await fetch(`${BACKEND}/api/analyze`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Failed to analyze resume')
      }
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (s) => {
    if (s >= 80) return 'text-green-600'
    if (s >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="relative py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload your resume</h2>
          <p className="mt-2 text-gray-600">Supported: PDF, DOCX, TXT. Add a job description for tailored keyword matching.</p>
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/40 p-6 text-indigo-700"
          >
            <Upload className="h-6 w-6" />
            <p className="mt-2 text-sm">Drag & drop your resume here</p>
            <div className="mt-4">
              <label className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-white font-medium cursor-pointer hover:bg-indigo-700">
                <FileText className="h-4 w-4" />
                <span>Select file</span>
                <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFile} />
              </label>
              {file && (
                <div className="mt-2 text-xs text-indigo-700">{file.name}</div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Job description (optional)</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white/60 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Paste a job description here to tailor keyword matching..."
            />
          </div>

          <div className="mt-6">
            <button
              onClick={analyze}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-white font-semibold hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
              {loading ? 'Analyzing…' : 'Analyze Resume'}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900">Your ATS score</h3>
          {!result && (
            <p className="mt-2 text-gray-600">Your analysis will appear here with a score, issues, and suggestions.</p>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm"
            >
              <div className="flex items-end justify-between">
                <div>
                  <div className={`text-5xl font-black ${scoreColor(result.score)}`}>{result.score}</div>
                  <div className="text-sm text-gray-500">out of 100</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 font-semibold">Summary</div>
                  <div className="text-sm text-gray-600">{result.summary}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="font-semibold text-gray-900">Issues</div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {result.issues.length ? result.issues.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    )) : <li>No major issues detected</li>}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Suggestions</div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {result.suggestions.length ? result.suggestions.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    )) : <li>Looks good! Consider tailoring to each application.</li>}
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="font-semibold text-gray-900">Keywords found</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.keywords_found.map((k, idx) => (
                      <span key={idx} className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs">{k}</span>
                    ))}
                    {!result.keywords_found.length && <span className="text-sm text-gray-600">None detected</span>}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Missing keywords</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.keywords_missing.map((k, idx) => (
                      <span key={idx} className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs">{k}</span>
                    ))}
                    {!result.keywords_missing.length && <span className="text-sm text-gray-600">None</span>}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-sm text-gray-500">Words</div>
                  <div className="font-bold text-gray-900">{result.word_count}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-sm text-gray-500">Est. Pages</div>
                  <div className="font-bold text-gray-900">{result.estimated_pages}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-sm text-gray-500">Readability</div>
                  <div className="font-bold text-gray-900">{result.score >= 70 ? 'Good' : result.score >= 50 ? 'Fair' : 'Needs work'}</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute -z-10 top-20 left-10 h-72 w-72 rounded-full bg-indigo-200 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -z-10 bottom-10 right-10 h-72 w-72 rounded-full bg-fuchsia-200 blur-3xl opacity-40" />
    </div>
  )
}
