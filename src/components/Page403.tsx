import React from 'react'

type Page403Props = {
  message: string
}

export default function Page403({ message }: Page403Props) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  )
}
