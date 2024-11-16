import React from "react"
import hljs from "highlight.js"
import "highlight.js/styles/github.css"
import { Paste } from "@prisma/client"
import { formatDistance } from "date-fns"
import Link from "next/link"
import CopyButton from "./CopyButton"

export default async function DisplayPaste({ paste }: { paste: Paste }) {
  const formattedCreateAt = formatDistance(
    new Date(paste.createAt),
    new Date(),
    {
      addSuffix: true,
    }
  )

  const highlightedContent = hljs.highlightAuto(paste.content, [
    paste.language,
  ]).value
  const lines = highlightedContent.split("\n")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Paste Details
            </h2>
            <p className="text-sm text-gray-600">Created {formattedCreateAt}</p>
          </div>
          <div className="text-sm text-gray-600">
            <span className="mr-2">Language: {paste.language}</span>
            <span>Type: {paste.type}</span>

            <div className="inline-flex items-center rounded-lg border bg-background shadow-sm">
              <Link
                href={`/r/${paste.key}${
                  paste.accessCode ? `?accessCode=${paste.accessCode}` : ""
                }`}
                className="rounded-l-lg border-r px-3 hover:bg-muted"
              >
                Raw
              </Link>
              <div className="border-r px-3 hover:bg-muted">
                <CopyButton content={paste.content} />
              </div>
              {/* <div
                className="rounded-r-lg px-3 hover:bg-muted"
              >
                <CopyButton content={`aaa`} />
              </div> */}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-md overflow-x-auto flex">
            <div className="pr-4 text-gray-400 select-none border-r border-gray-200">
              {lines.map((_, index) => (
                <div key={index} className="text-right pr-2">
                  {index + 1}
                </div>
              ))}
            </div>
            <pre className="flex-1 pl-4">
              <code dangerouslySetInnerHTML={{ __html: highlightedContent }} />
            </pre>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Author: {paste.author}</span>
            <span>
              Expires:{" "}
              {!paste.expireAt.getTime()
                ? new Date(paste.expireAt).toLocaleString()
                : "never"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
