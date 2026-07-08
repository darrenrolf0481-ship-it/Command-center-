import { NextRequest, NextResponse } from "next/server";
import WebSocket from "ws";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // In a real environment, this would establish a WebSocket connection to lab brain at :8785
    // and wait for the response. Because Next.js serverless functions aren't ideal for long-lived WS connections,
    // we use a Promise to wait for the WS response.
    const responseText = await new Promise<string>((resolve, reject) => {
      try {
        const ws = new WebSocket("ws://localhost:8785");
        
        ws.on("open", () => {
          ws.send(JSON.stringify(body));
        });
        
        ws.on("message", (data) => {
          try {
            const parsed = JSON.parse(data.toString());
            if (parsed.response) {
              resolve(parsed.response);
              ws.close();
            }
          } catch (e) {
            resolve(data.toString()); // Fallback to raw data
            ws.close();
          }
        });
        
        ws.on("error", (error) => {
          console.error("WebSocket error:", error);
          // Fallback mechanism if WebSocket server is not running
          resolve("Connection to Lab Brain WebSocket at :8785 failed. Simulating response for now: Received your query.");
          ws.close();
        });

        // Timeout after 30 seconds
        setTimeout(() => {
          resolve("Lab Brain connection timed out.");
          if (ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        }, 30000);
      } catch (error) {
        console.error("Error creating WebSocket:", error);
        resolve("Could not connect to Lab Brain.");
      }
    });

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("Lab Brain Query Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to query lab brain" },
      { status: 500 }
    );
  }
}
