import Link from 'next/link'
import { BookOpen, Mail, ShieldAlert, MessageSquare, ArrowRight, HelpCircle, FileText } from 'lucide-react'

export const metadata = {
  title: 'Contact & Support | StudyHub Pro',
  description:
    'Get in touch with the StudyHub Pro team for user support, open-source library contributions, DMCA copyright notices, and platform inquiries.',
  openGraph: {
    title: 'Contact & Support | StudyHub Pro',
    description: 'Reach StudyHub support, report content, or inquire about open educational resources.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://silent-dream-b9be.surendrasingh43219.workers.dev/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0c0d14] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#0c0d14]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>Study<span className="text-cyan-400">Hub</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <Link href="/library" className="hover:text-white transition-colors">Public Library</Link>
            <Link href="/guides" className="hover:text-white transition-colors">Study Guides</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-cyan-400 font-semibold">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="py-2 px-3.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="py-2 px-4 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact & Support
          </h1>
          <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Have questions about StudyHub Pro, need assistance with your account, or want to contribute to the open educational library? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#121624] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">General Support</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Questions regarding account authentication, OTP codes, dashboard widgets, or study timers.
            </p>
            <div className="pt-2">
              <span className="text-xs font-mono text-cyan-400">support@studyhub.pro</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121624] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Library Contributions</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inquire about adding open-access textbooks, Creative Commons courseware, or university lecture notes.
            </p>
            <div className="pt-2">
              <span className="text-xs font-mono text-emerald-400">library@studyhub.pro</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121624] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Copyright & DMCA</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit takedown requests or report content that violates intellectual property policies.
            </p>
            <div className="pt-2">
              <span className="text-xs font-mono text-rose-400">dmca@studyhub.pro</span>
            </div>
          </div>
        </div>

        {/* Contact Form Container */}
        <div className="p-8 rounded-3xl bg-[#141724] border border-slate-800 max-w-2xl mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Send Us a Direct Message</h2>
            <p className="text-xs text-slate-400">Our academic team typically responds within 24 business hours.</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priyanshu Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Subject</label>
              <input
                type="text"
                placeholder="What can we help you with?"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Message</label>
              <textarea
                rows={4}
                placeholder="Describe your inquiry in detail..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl text-sm shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Send Message</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-[#090a0f] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <BookOpen className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-200">StudyHub Pro</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/library" className="hover:text-slate-300 transition-colors">Library</Link>
            <Link href="/guides" className="hover:text-slate-300 transition-colors">Guides</Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
