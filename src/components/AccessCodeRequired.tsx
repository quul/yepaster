'use client'
// prompt(gpt-4o-mini): Create a AccessCodeRequired page using tailwind and nextjs, give user the hint and place a input bar to let user to input accessCode, after user submit it, refresh the page and let the accessCode as searchParam to current page, let the page be a server component
import React, { useState } from 'react'

export default function AccessCodeRequired() {
  const [accessCode, setAccessCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const queryString = new URLSearchParams({ accessCode }).toString()
    window.location.search = queryString
    // TODO: Will this actually works?
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Access Code Required</h1>
        <p className="text-gray-700 mb-4">Please enter your access code to proceed:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="border border-gray-300 p-2 rounded mb-4 w-full"
            placeholder="Enter access code"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

