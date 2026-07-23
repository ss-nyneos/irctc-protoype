import { useState, useRef, useEffect, type FormEvent } from 'react'
import {
  X,
  Send,
  Check,
  Search,
  ChevronRight,
  Home as HomeIcon,
  MessageSquare,
  HelpCircle,
  ArrowRight,
} from 'lucide-react'
import { useUI } from '../context/UI.tsx'
import { packages, type Package } from '../data/content.ts'
import dishaIcon from '../assets/graphic/askdisha-2.png'

interface Message {
  id: string
  role: 'ai' | 'user'
  text: string
  packages?: Package[]
}

const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

/* Help Search Topics matching IRCTC Tourism */
const SEARCH_HELP_TOPICS = [
  {
    text: 'How to book tour packages on IRCTC',
    prompt: 'How do I book a tour package on IRCTC?',
  },
  {
    text: 'How to check PNR status & seat availability',
    prompt: 'How do I check PNR status or seat availability?',
  },
  {
    text: 'How to cancel ticket and claim refund',
    prompt: 'What is the ticket cancellation and refund policy?',
  },
  {
    text: 'Vande Bharat & Luxury train booking guide',
    prompt: 'Tell me about Vande Bharat and luxury train bookings',
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
      text: "Namaste! I'm Disha 2.0, your IRCTC travel assistant. Ask me anything about packages, trains, or booking procedures!",
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
          p.tag.toLowerCase().includes(q)
      )

      if (matchedPkgs.length === 0) {
        matchedPkgs = packages.slice(0, 2)
      } else {
        matchedPkgs = matchedPkgs.slice(0, 2)
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `Here are the top IRCTC options for "${queryText}":`,
        packages: matchedPkgs,
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 600)
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputMessage)
  }

  const filteredTopics = SEARCH_HELP_TOPICS.filter((t) =>
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed right-6 bottom-6 z-[250] flex h-[650px] max-h-[92vh] w-[420px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.3)] font-sans text-[#323232] transition-all duration-300">
      {/* Header matching Image 2: Brand text on left, Disha badge icon + close X on right */}
      <div className="flex items-start justify-between bg-white px-7 pt-7 pb-3">
        <div className="flex flex-col">
          <span className="font-extrabold text-[26px] leading-tight tracking-tight text-[#323232]">
            Ask
          </span>
          <span className="font-extrabold text-[26px] leading-tight tracking-tight text-[#323232]">
            Disha 2.0
          </span>
        </div>

        <div className="flex items-center gap-3.5 pt-1">
          {/* Official Disha Icon Badge instead of photos */}
          <div className="relative flex size-11 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm ring-2 ring-gray-100">
            <img src={dishaIcon} alt="Ask Disha 2.0" className="size-full object-cover" />
          </div>

          <button
            onClick={close}
            className="ml-1 rounded-full p-1.5 text-slate-400 hover:bg-gray-100 hover:text-[#323232] transition-colors"
            aria-label="Close widget"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-white">
        {activeTab === 'home' && (
          <div className="flex flex-col space-y-4 px-7 pt-3 pb-5">
            {/* Greeting Header */}
            <div>
              <p className="flex items-center gap-2 text-[17px] font-bold text-[#565C68]">
                Hi traveller <span className="text-xl">👋</span>
              </p>
              <h2 className="mt-1 text-[26px] font-black text-[#323232] tracking-tight leading-tight">
                How can we help?
              </h2>
            </div>

            {/* Card 1: Send us a message */}
            <div
              onClick={() => setActiveTab('messages')}
              className="group cursor-pointer rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[16px] font-extrabold text-[#323232]">
                    Send us a message
                  </div>
                  <div className="mt-1 text-[13.5px] font-medium text-[#565C68]">
                    We typically reply in under a few seconds
                  </div>
                </div>
                <div className="flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <Send className="size-5 fill-[#2475EE] text-[#2475EE]" />
                </div>
              </div>
            </div>

            {/* Card 2: Status: All systems operational */}
            <div className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex size-7 flex-none items-center justify-center rounded-full bg-emerald-500 text-white font-bold">
                  <Check className="size-4 stroke-[3]" />
                </div>
                <div>
                  <div className="text-[15px] font-extrabold text-[#323232]">
                    Status: All systems operational
                  </div>
                  <div className="mt-0.5 text-[13px] font-medium text-[#565C68]">
                    Updated Today · Real-time IRCTC booking active
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Search for help & Topic Links */}
            <div className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              {/* Search Pill (No Focus Ring/Outline) */}
              <div className="flex items-center justify-between rounded-2xl bg-gray-100/90 px-4 py-3 border-none outline-none focus-within:ring-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help"
                  className="w-full bg-transparent text-[14.5px] font-bold text-[#323232] placeholder:text-[#565C68] outline-none focus:outline-none focus:ring-0 focus:border-none border-none"
                />
                <Search className="size-4.5 flex-none text-[#323232]" />
              </div>

              {/* Topic rows with right chevrons > */}
              <div className="divide-y divide-gray-100 pt-1">
                {filteredTopics.map((item) => (
                  <button
                    key={item.text}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="flex w-full items-center justify-between py-3 text-left text-[14px] font-bold text-[#323232] transition-colors hover:text-[#2475EE]"
                  >
                    <span className="line-clamp-1 pr-3">{item.text}</span>
                    <ChevronRight className="size-4 flex-none text-[#565C68]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="flex flex-1 flex-col justify-between p-5 bg-gray-50/50">
            <div className="space-y-3.5 overflow-y-auto">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed font-medium ${m.role === 'user'
                        ? 'bg-[#2475EE] text-white'
                        : 'border border-gray-200 bg-white text-[#323232] shadow-sm'
                        }`}
                    >
                      {m.text}
                    </div>

                    {m.packages && m.packages.length > 0 && (
                      <div className="space-y-2.5 pt-1">
                        {m.packages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
                          >
                            <img
                              src={pkg.img}
                              alt={pkg.place}
                              className="size-16 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-[13px] font-extrabold text-[#323232]">
                                {pkg.title}
                              </div>
                              <div className="text-[11.5px] font-semibold text-[#565C68] mt-0.5">
                                {pkg.nights}N / {pkg.days}D · {inr(pkg.price)}
                              </div>
                            </div>
                            <a
                              href="#packages"
                              onClick={close}
                              className="flex size-8 items-center justify-center rounded-full bg-[#2475EE] text-white transition-transform hover:scale-105"
                            >
                              <ArrowRight className="size-4" />
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
                  <div className="flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <span className="size-2 animate-bounce rounded-full bg-[#2475EE]" />
                    <span className="size-2 animate-bounce rounded-full bg-[#2475EE] [animation-delay:150ms]" />
                    <span className="size-2 animate-bounce rounded-full bg-[#2475EE] [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Block (No outline/ring on focus) */}
            <form onSubmit={handleFormSubmit} className="mt-3 flex items-center gap-2.5">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4.5  py-3 text-[13.5px] text-[#323232] placeholder:text-[#565C68] outline-none ring-0 transition-all duration-300 focus:rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="flex size-10 items-center justify-center rounded-full bg-[#2475EE] text-white disabled:opacity-40"
              >
                <Send className="size-4.5 fill-white text-white" />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-4 px-7 pt-4 pb-5 bg-white">
            <h3 className="text-[16px] font-extrabold text-[#323232]">
              IRCTC Help Articles
            </h3>
            <div className="space-y-3.5">
              {SEARCH_HELP_TOPICS.map((item) => (
                <div
                  key={item.text}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="cursor-pointer rounded-[20px] border border-gray-200 bg-white p-4.5 shadow-sm transition-all hover:border-gray-300"
                >
                  <div className="flex items-center justify-between font-extrabold text-[14.5px] text-[#323232]">
                    <span>{item.text}</span>
                    <ChevronRight className="size-4 text-[#565C68]" />
                  </div>
                  <p className="mt-1.5 text-[12.5px] text-[#565C68] font-medium leading-relaxed">
                    Click to view detailed guidelines and AI assistance for this topic.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Tab Bar */}
      <div className="flex items-center justify-around border-t border-gray-100 bg-white py-3.5 px-7">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1.5 text-[12px] font-extrabold transition-colors ${activeTab === 'home' ? 'text-[#2475EE]' : 'text-[#565C68] hover:text-[#323232]'
            }`}
        >
          <HomeIcon className="size-5.5 stroke-[2.2]" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center gap-1.5 text-[12px] font-extrabold transition-colors ${activeTab === 'messages' ? 'text-[#2475EE]' : 'text-[#565C68] hover:text-[#323232]'
            }`}
        >
          <MessageSquare className="size-5.5 stroke-[2.2]" />
          <span>Messages</span>
        </button>

        <button
          onClick={() => setActiveTab('help')}
          className={`flex flex-col items-center gap-1.5 text-[12px] font-extrabold transition-colors ${activeTab === 'help' ? 'text-[#2475EE]' : 'text-[#565C68] hover:text-[#323232]'
            }`}
        >
          <HelpCircle className="size-5.5 stroke-[2.2]" />
          <span>Help</span>
        </button>
      </div>
    </div>
  )
}
