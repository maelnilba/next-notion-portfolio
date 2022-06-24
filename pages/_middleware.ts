import { NextResponse } from 'next/server'
export function middleware() {
  // Store the response so we can modify its headers
  const response = NextResponse.next()

  // Set custom header
  response.headers.set(
    'Cache-Control',
    's-maxage=1, stale-while-revalidate=7200'
  )

  // Return response
  return response
}
