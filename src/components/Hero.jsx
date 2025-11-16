import { Sparkles, Stars } from 'lucide-react'

export default function Hero(){
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.25),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(244,63,94,0.2),transparent_35%)]"/>
      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/50 backdrop-blur px-3 py-1 text-xs font-medium text-blue-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5"/> ATS-friendly insights
        </div>
        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600">
          Get your resume ATS-ready
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Upload your resume, paste a job description, and instantly see your score with actionable suggestions to pass automated screenings.
        </p>
      </div>
    </div>
  )
}
