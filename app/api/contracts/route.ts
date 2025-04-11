import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:8000/contracts/'

// GET contracts
export async function GET() {
  const res = await fetch(BACKEND_URL)
  const data = await res.json()
  return NextResponse.json(data)
}

// POST a new contract
export async function POST(req: NextRequest) {
  const body = await req.json()

  const res = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const data = await res.json()
  return NextResponse.json(data)
}
