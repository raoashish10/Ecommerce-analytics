// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Make a request to the Go API
    const response = await fetch('http://localhost:8080/api/track', {
      method: req.method, // Forward the method (GET, POST, etc.)
      headers: {
        'Content-Type': 'application/json',
        // Forward any other headers if necessary
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined, // Forward the body for non-GET requests
    });

    // Forward the response from the Go API
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error calling Go API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
