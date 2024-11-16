'use client'
import { Copy } from "lucide-react"
import { useState } from "react"

interface CopyButtonProps {
  content: string
}

export default function CopyButton({ content }: CopyButtonProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopySuccess(true)
    } catch (error) {
      console.error("Failed to copy text: ", error)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex"
      // className="rounded-md bg-background px-3 py-1.5 font-semibold text-muted shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2 focus:ring-offset-background"
    >
      <Copy className="h-4 w-4 mr-1" /> {copySuccess ? "Copied!" : "Copy"}
    </button>
  )
}
