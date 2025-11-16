export default function Footer() {
  return (
    <footer className="py-10 border-t border-gray-200/70 bg-white/60">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">Built for modern job seekers. Improve your resume with data-driven insights.</p>
        <div className="text-sm text-gray-500">© {new Date().getFullYear()} ATS Analyzer</div>
      </div>
    </footer>
  )
}
