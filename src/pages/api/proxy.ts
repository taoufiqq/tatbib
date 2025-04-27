// pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next/types'
import axios from 'axios'

// Simple function to check API health
async function checkApiHealth(apiUrl: string): Promise<boolean> {
  try {
    // Try a simple GET request to check if the API is up
    // Adjust the endpoint as needed - '/health' is just an example
    await axios.get(`${apiUrl}`, { timeout: 5000 });
    return true;
  } catch (error) {
    console.error("[Proxy] API health check failed:", error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Get the API URL from environment variables or use default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://tatbib-api.onrender.com"
    console.log("[Proxy] Using API URL:", apiUrl);

    // Extract the endpoint and data from the request
    const { endpoint, data } = req.body

    if (!endpoint) {
      return res.status(400).json({ message: "Endpoint is required" })
    }

    // Log the request details for debugging
    console.log(`[Proxy] Request to: ${apiUrl}${endpoint}`)
    console.log(`[Proxy] Request data:`, JSON.stringify(data))

    // Check if API is reachable before proceeding
    const isApiHealthy = await checkApiHealth(apiUrl);
    if (!isApiHealthy) {
      return res.status(503).json({
        success: false,
        message: "API service is currently unavailable. Please try again later."
      });
    }

    // Validate required fields for secretary creation
    if (endpoint === "/medcine/createAccountSecretary") {
      const requiredFields = ["loginMedcine", "fullName", "email", "login", "password"]
      const missingFields = requiredFields.filter((field) => !data[field])

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        })
      }
    }

    // Make the request to the actual API
    console.log(`[Proxy] Starting request to: ${apiUrl}${endpoint}`);
    
    try {
      const response = await axios({
        method: "post",
        url: `${apiUrl}${endpoint}`,
        data: data,
        headers: {
          "Content-Type": "application/json",
          "Origin": process.env.NEXT_PUBLIC_FRONTEND_URL || "https://tatbib-v3.vercel.app",
        },
        // Increase timeout for slow APIs
        timeout: 60000,
        // Add retry logic
        validateStatus: function (status) {
          return status < 500; // Only treat 500+ errors as errors
        }
      })

      // Log the response for debugging
      console.log("[Proxy] Request successful");
      console.log(`[Proxy] Response status: ${response.status}`)
      console.log(`[Proxy] Response data:`, JSON.stringify(response.data))

      // Return the API response to the client
      return res.status(response.status).json(response.data)
    } catch (axiosError) {
      // This will catch network errors, timeouts, etc.
      console.error("[Proxy] Request failed");
      console.error("[Proxy] Axios error:", axiosError);
      
      if (axios.isAxiosError(axiosError)) {
        console.error("[Proxy] Error code:", axiosError.code);
        console.error("[Proxy] Error message:", axiosError.message);
        
        // If we got a response from the server, return it
        if (axiosError.response) {
          return res.status(axiosError.response.status).json(axiosError.response.data)
        }

        // Otherwise return a generic error
        return res.status(500).json({
          success: false,
          message: "Error connecting to API server",
          error: axiosError.message,
          code: axiosError.code,
        })
      }

      throw axiosError // Re-throw for the outer catch
    }
  } catch (error) {
    console.error("[Proxy] Unhandled error:", error)

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred in the proxy",
      error: (error as Error).message,
    })
  }
}