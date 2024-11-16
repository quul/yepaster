import Link from 'next/link'
import React from 'react'

export default function Page404() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-700">Sorry, the page you are looking for does not exist.</p>
        <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
          Go back to Home
        </Link>
      </div>
    </div>
  )
}
