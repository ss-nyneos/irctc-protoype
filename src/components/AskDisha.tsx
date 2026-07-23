import { useState, useRef, useEffect, type FormEvent } from 'react'
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  Search,
  ChevronRight,
  Home as HomeIcon,
  MessageSquare,
  HelpCircle,
  Train,
  Compass,
  Mountain,
  FileText,
  ArrowRight,
  RotateCcw,
} from 'lucide-react'
import { useUI } from '../context/UI.tsx'
import { packages, type Package } from '../data/content.ts'

interface Message {
  id: string
  role: 'ai' | 'user'
  text: string
  packages?: Package[]
}

const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

/* Quick Topics for Home Tab */
const QUICK_TOPICS = [
  {
    Icon: Mountain,
    text: 'Cool hill station getaway under ₹30,000',
    prompt: 'Show me hill station and mountain packages under ₹30,000',
  },
  {
    Icon: Train,
    text: 'Book Vande Bharat & Luxury Trains',
    prompt: 'What luxury trains and Vande Bharat tours are available?',
  },
  {
    Icon: Compass,
    text: 'Pilgrimage Circuits & Darshan Packages',
    prompt: 'Show me sacred pilgrimage circuits like Char Dham and Jyotirlinga',
  },
  {
    Icon: FileText,
    text: 'PNR, Seat Availability & Refund Guidelines',
    prompt: 'How do I check PNR status or request a ticket refund?',
  },
]

/* FAQ Help Topics */
const HELP_TOPICS = [
  {
    question: 'How do I book a tour package on IRCTC Tourism?',
    answer:
      'Select any package from the Trending or Destinations section, pick your preferred departure date, number of travellers, and click "Book Now". You can log in with your IRCTC credentials to complete the booking.',
  },
  {
    question: 'What is the cancellation and refund policy?',
    answer:
      'Cancellations made 15+ days prior to departure receive a 90% refund. Cancellations within 7-14 days receive a 50% refund. Cancellations under 4 days are non-refundable as per rail charter rules.',
  },
  {
    question: 'Is Senior Citizen discount available on luxury trains?',
    answer:
      'Senior Citizen concessions apply to select domestic rail packages. Enable "Senior Citizen Mode" in our Accessibility menu to highlight senior-friendly itineraries.',
  },
  {
    question: 'What is included in Bharat Gaurav tourist trains?',
    answer:
      'Bharat Gaurav packages include 3AC/2AC train travel, off-board hotel accommodation, pure veg meals, sightseeing transfers in AC buses, and dedicated tour escorts.',
  },
]

export default function AskDisha() {
  const { close } = useUI()
  const [activeTab, setActiveTab] = useState<'home' | 'messages' | 'help'>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: 'Namaste! I am Disha 2.0, your IRCTC AI travel assistant. Tell me what kind of journey you are dreaming of!',
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: queryText,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputMessage('')
    setIsTyping(true)
    setActiveTab('messages')

    setTimeout(() => {
      const q = queryText.toLowerCase()
      let matchedPkgs = packages.filter(
        (p) =>
          p.place.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q) ||
          (q.includes('hill') && ['Hill Escape', 'High Altitude'].includes(p.tag)) ||
          (q.includes('beach') && ['Beaches', 'Islands'].includes(p.tag)) ||
          (q.includes('pilgrim') && ['Pilgrimage', 'Heritage'].includes(p.tag))
      )

      if (matchedPkgs.length === 0) {
        matchedPkgs = packages.slice(0, 2)
      } else {
        matchedPkgs = matchedPkgs.slice(0, 2)
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `Here are the top IRCTC journeys matching "${queryText}":`,
        packages: matchedPkgs,
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 700)
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputMessage)
  }

  const filteredTopics = QUICK_TOPICS.filter((t) =>
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed right-4 bottom-4 z-[250] flex h-[580px] max-h-[88vh] w-[calc(100vw-32px)] sm:w-[390px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-blue/10 text-blue dark:bg-blue/20 dark:text-blue-400">
            <Sparkles className="size-5" />
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div>
            <div className="text-[15px] font-bold text-slate-900 dark:text-white">
              Ask Disha 2.0
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              IRCTC AI Travel Partner
            </div>
          </div>
        </div>
        <button
          onClick={close}
          className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Close Ask Disha"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Content Body based on activeTab */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
        {activeTab === 'home' && (
          <div className="space-y-4 p-4">
            <div className="pt-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Namaste! 👋
              </h2>
              <h3 className="mt-0.5 text-lg font-bold text-slate-700 dark:text-slate-300">
                How can Disha help you today?
              </h3>
            </div>

            {/* Action Card: Send Us a Message */}
            <div
              onClick={() => setActiveTab('messages')}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/80"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-bold text-slate-900 dark:text-white">
                    Send us a message
                  </div>
                  <div className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
                    Typically replies in under a few seconds
                  </div>
                </div>
                <div className="flex size-9 items-center justify-center rounded-full bg-blue text-white transition-transform group-hover:scale-105">
                  <Send className="size-4" />
                </div>
              </div>
            </div>

            {/* Status Banner */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="text-[13px] font-bold text-slate-900 dark:text-white">
                    Status: All Systems Operational
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                    Real-time train schedules & AI tour finder active
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Search & Assistance Topics */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help, destinations..."
                  className="w-full rounded-xl bg-slate-100 py-2 pl-9 pr-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue/40 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1 pt-1">
                {filteredTopics.map((item) => (
                  <button
                    key={item.text}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="flex w-full items-center justify-between rounded-xl p-2.5 text-left text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50"
                  >
                    <span className="flex items-center gap-2.5">
                      <item.Icon className="size-4 flex-shrink-0 text-blue" />
                      <span className="line-clamp-1">{item.text}</span>
                    </span>
                    <ChevronRight className="size-4 flex-shrink-0 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="flex flex-1 flex-col justify-between p-4">
            <div className="space-y-3 overflow-y-auto">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-blue text-white'
                          : 'border border-slate-200 bg-white text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {m.text}
                    </div>

                    {m.packages && m.packages.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {m.packages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-800"
                          >
                            <img
                              src={pkg.img}
                              alt={pkg.place}
                              className="size-14 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-[12px] font-bold text-slate-900 dark:text-white">
                                {pkg.title}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {pkg.nights}N / {pkg.days}D · {inr(pkg.price)}
                              </div>
                            </div>
                            <a
                              href="#packages"
                              onClick={close}
                              className="flex size-7 items-center justify-center rounded-full bg-blue text-white transition-transform hover:scale-105"
                            >
                              <ArrowRight className="size-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                    <span className="size-2 animate-bounce rounded-full bg-blue" />
                    <span className="size-2 animate-bounce rounded-full bg-blue [animation-delay:150ms]" />
                    <span className="size-2 animate-bounce rounded-full bg-blue [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleFormSubmit} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about tours, trains, prices..."
                className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] text-slate-900 focus:border-blue focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="flex size-9 items-center justify-center rounded-full bg-blue text-white disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-3 p-4">
            <div className="text-[14px] font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </div>
            <div className="space-y-2.5">
              {HELP_TOPICS.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-800/80"
                >
                  <div className="text-[13px] font-bold text-slate-900 dark:text-white">
                    {item.question}
                  </div>
                  <div className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Tab Bar (Matches Image 2) */}
      <div className="flex items-center justify-around border-t border-slate-100 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 rounded-xl px-5 py-1.5 text-[11px] font-bold transition-colors ${
            activeTab === 'home'
              ? 'bg-blue/10 text-blue dark:bg-blue/20 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <HomeIcon className="size-4.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center gap-1 rounded-xl px-5 py-1.5 text-[11px] font-bold transition-colors ${
            activeTab === 'messages'
              ? 'bg-blue/10 text-blue dark:bg-blue/20 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="size-4.5" />
          <span>Messages</span>
        </button>

        <button
          onClick={() => setActiveTab('help')}
          className={`flex flex-col items-center gap-1 rounded-xl px-5 py-1.5 text-[11px] font-bold transition-colors ${
            activeTab === 'help'
              ? 'bg-blue/10 text-blue dark:bg-blue/20 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="size-4.5" />
          <span>Help</span>
        </button>
      </div>
    </div>
  )
}
