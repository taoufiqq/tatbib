import type { NextApiRequest, NextApiResponse } from "next/types"
import axios from "axios"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Get the API URL from environment variables or use default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://tatbib-api.onrender.com"

    // Extract the endpoint and data from the request
    const { endpoint, data } = req.body

    if (!endpoint) {
      return res.status(400).json({ message: "Endpoint is required" })
    }

    console.log(`Proxying request to: ${apiUrl}${endpoint}`)
    console.log("With data:", data)

    // Make the request to the actual API
    const response = await axios.post(`${apiUrl}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      // Add a timeout to prevent hanging requests
      timeout: 15000,
    })

    // Return the API response to the client
    return res.status(response.status).json(response.data)
  } catch (error) {
    console.error("Proxy error:", error)

    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message = error.response?.data?.message || error.message

      return res.status(status).json({
        message: `API Error: ${message}`,
        details: error.response?.data,
      })
    }

    return res.status(500).json({
      message: "An unexpected error occurred",
      error: (error as Error).message,
    })
  }
}
