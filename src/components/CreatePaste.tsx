"use client"
import { PasteType } from "@prisma/client"
import { useRouter } from "next/navigation"
import React, { useMemo, useState } from "react"

const SYNTAX_OPTIONS = [
  { value: "text", label: "Plain Text" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
]

const EXPIRATION_OPTIONS = [
  { value: "never", label: "Never" },
  { value: "10m", label: "10 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" },
]

type Data = {
  key?: string // TODO
  type: PasteType
  mime: "text/plain"
  expireAt?: string
  accessCode?: string
  language: string
  content: string
}

export default function CreatePaste() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")

  const router = useRouter()

  const lineCount = useMemo(() => {
    const len = content.split("\n").length
    if (len === 0) {
      return 1
    } else {
      return len
    }
  }, [content])

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const lineNumbers = e.currentTarget.previousElementSibling as HTMLDivElement
    if (lineNumbers) {
      lineNumbers.scrollTop = e.currentTarget.scrollTop
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    setContent(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrMsg("")
    const formData = new FormData(e.currentTarget)
    // TODO: Temp solution
    const data = {
      // key: "",
      type: PasteType.TEXT,
      mime: "text/plain",
      expireAt: "0",
      language: formData.get("language") as string,
      content: formData.get("content") as string,
    } satisfies Data
    const formDataToSend = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formDataToSend.append(key, value)
      }
    })

    try {
      const resp = await fetch("/a/new", {
        method: "POST",
        body: formDataToSend,
      })
      if (!resp.ok) {
        const result = await resp.json()
        setErrMsg(result.err)
      } else {
        const result = await resp.json()
        router.push(result.path)
      }
    } catch (e) {
      if (e instanceof Error) {
        setErrMsg(e.message)
      } else {
        throw e
      }
      setLoading(false)
    } finally {
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Paste</h1>
      {errMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errMsg}</span>
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute left-0 top-0 h-full w-10 bg-gray-900 text-gray-500 text-sm font-mono flex flex-col items-center py-4 select-none overflow-hidden">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="leading-[1.6rem] h-6">
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            name="content"
            className="w-full h-96 p-4 pl-12 bg-gray-800 text-gray-100 font-mono rounded-lg border border-gray-700 focus:border-transparent leading-6 focus:outline-none"
            placeholder="Paste your code here..."
            onScroll={handleScroll}
            onChange={handleContentChange}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              name="language"
              className="appearance-none w-44 px-4 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              defaultValue="text"
            >
              {SYNTAX_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              name="expiration"
              className="appearance-none w-44 px-4 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              defaultValue="never"
            >
              {EXPIRATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ml-auto ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading...
              </div>
            ) : (
              "Create Paste"
            )}
          </button>
        </div>
      </form>
    </main>
  )
}
