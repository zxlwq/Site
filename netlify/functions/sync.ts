import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Netlify Functions 入口
export async function handler(event: any) {
  if (event.httpMethod === "GET") {
    try {
      const data = await redis.get<string>("user_data");
      if (!data) {
        return {
          statusCode: 404,
          body: "",
        };
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: typeof data === "string" ? data : JSON.stringify(data),
      };
    } catch (err) {
      console.error("Upstash GET error", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch data" }),
      };
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const body = event.body ? JSON.parse(event.body) : {};
      await redis.set("user_data", body, { nx: false });
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: true }),
      };
    } catch (err) {
      console.error("Upstash POST error", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to save data" }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: { Allow: "GET, POST" },
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
}

