import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Send all the event data to the Go API (it now handles all fields)
    const response = await fetch("http://localhost:8080/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    // Get the response data
    const data = await response.json()
    
    // If the response is not ok, return the error message
    if (!response.ok) {
      console.error("Go API Error:", data)
      return NextResponse.json(data, { status: response.status })
    }

    // Forward the successful response from the Go API
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error calling Go API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Forward GET requests to the Go API
    const response = await fetch("http://localhost:8080/api/track", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error calling Go API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
