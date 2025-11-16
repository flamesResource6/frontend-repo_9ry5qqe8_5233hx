import { useState } from 'react'
import { Upload, FileText, Briefcase, Sparkles, Loader2, Link as LinkIcon, Github } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function UploadCard() {
  const [file, setFile] = useState(null)
  const [job, setJob] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }

  const onUpload = async () => {
    if (!file) {
      setError('Please select a resume file (PDF, DOCX, or TXT).')
      return
    }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      if (job.trim()) form.append('job_description', job)
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) {
        const t = await res.json().catch(()=>({detail:'Upload failed'}))
        throw new Error(t.detail || 'Upload failed')
      }
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div
        className="relative rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl p-6 md:p-10 shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)]"
        onDragOver={(e)=>{e.preventDefault(); e.dataTransfer.dropEffect='copy'}}
        onDrop={onDrop}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-fuchsia-500/10 to-rose-500/10 pointer-events-none"/>
        <div className="relative z-10 grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white grid place-items-center">
                <Sparkles className="h-5 w-5"/>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">ATS Resume Analyzer</h2>
            </div>
            <p className="text-gray-600 mb-6">Upload your resume and (optionally) paste a job description. We’ll analyze sections, contact info, readability, and keyword match to generate an ATS-friendly score and suggestions.</p>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-blue-600"/> Supports PDF, DOCX, TXT</div>
              <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-600"/> Optional job description matching</div>
              <div className="flex items-center gap-2"><Upload className="h-4 w-4 text-blue-600"/> Drag & drop or click to select</div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-800">Resume file</span>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 hover:border-blue-400 transition cursor-pointer" onClick={()=>document.getElementById('resume-input').click()}>
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 grid place-items-center">
                  <Upload className="h-5 w-5"/>
                </div>
                <div className="flex-1">
                  <div className="text-gray-900 font-medium">{file ? file.name : 'Choose a file'}</div>
                  <div className="text-xs text-gray-500">Max ~5MB</div>
                </div>
              </div>
              <input id="resume-input" type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e)=> setFile(e.target.files?.[0] || null)} />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-800">Job description (optional)</span>
              <textarea value={job} onChange={(e)=>setJob(e.target.value)} rows={5} placeholder="Paste the job description to check keyword match" className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </label>

            <button onClick={onUpload} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-3 font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60">
              {loading ? (<><Loader2 className="h-5 w-5 animate-spin"/> Analyzing...</>) : (<>Analyze Resume</>)}
            </button>

            {error && <div className="text-sm text-rose-600">{error}</div>}
          </div>
        </div>

        {result && (
          <div className="relative z-10 mt-10 grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Score</h3>
              <div className="flex items-end gap-6">
                <div className="relative">
                  <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-600 to-fuchsia-600 p-1">
                    <div className="h-full w-full rounded-full bg-white grid place-items-center">
                      <div className="text-3xl font-bold text-gray-900">{result.score}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm w-full">
                  {Object.entries(result.breakdown).map(([k,v]) => (
                    <div key={k} className="rounded-lg border border-gray-200 p-3">
                      <div className="text-gray-500 capitalize">{k}</div>
                      <div className="text-gray-900 font-semibold">{v}/20</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">Score combines structure, contact info, readability, ATS-compatibility, filetype, and job keyword match.</div>
            </div>

            <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick facts</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>Words: <span className="font-medium text-gray-900">{result.details.word_count}</span></li>
                <li>Bullets: <span className="font-medium text-gray-900">{result.details.bullets}</span></li>
                <li>Sections found: <span className="font-medium text-gray-900">{Object.entries(result.details.sections_found).filter(([_,v])=>v).length}</span></li>
                <li>Filetype: <span className="font-medium capitalize text-gray-900">{result.filetype}</span></li>
              </ul>
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-800 mb-2">Contact signals</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(result.details.contact).map(([k,v]) => (
                    <div key={k} className={`rounded border p-2 ${v? 'border-green-200 bg-green-50 text-green-700':'border-gray-200 bg-gray-50 text-gray-600'}`}>
                      {k}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-5 rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Suggestions</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {result.suggestions.length ? result.suggestions.map((s,i)=> (
                  <li key={i}>{s}</li>
                )) : <li>Looks great! Minor tweaks only.</li>}
              </ul>
            </div>

            {result.details.job_keywords && (
              <div className="md:col-span-5 rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job keyword coverage</h3>
                <div className="flex flex-wrap gap-2">
                  {result.details.job_keywords.map((k) => {
                    const hit = result.details.job_keywords_matched?.includes(k)
                    return (
                      <span key={k} className={`px-3 py-1 rounded-full text-xs border ${hit? 'border-green-300 bg-green-50 text-green-700':'border-gray-200 bg-gray-50 text-gray-700'}`}>
                        {k}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="relative z-10 mt-8 text-xs text-gray-500 flex items-center gap-3">
          <a href="https://www.linkedin.com" target="_blank" className="inline-flex items-center gap-1 hover:text-gray-700"><LinkIcon className="h-3 w-3"/> LinkedIn</a>
          <a href="https://github.com" target="_blank" className="inline-flex items-center gap-1 hover:text-gray-700"><Github className="h-3 w-3"/> GitHub</a>
        </div>
      </div>
    </div>
  )
}
