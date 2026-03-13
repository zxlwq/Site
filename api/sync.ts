import { Redis } from "@upstash/redis";

// 通用 Upstash Redis 客户端
const redis = Redis.fromEnv();

// 兼容 Vercel / EdgeOne 等 Node 风格 Serverless 平台
export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const data = await redis.get<string>("user_data");
      if (!data) {
        res.status(404).end();
        return;
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(data);
    } catch (err) {
      console.error("Upstash GET error", err);
      res.status(500).json({ error: "Failed to fetch data" });
    }
    return;
  }

  if (req.method === "POST") {
    try {
      const body = req.body ?? {};
      await redis.set("user_data", body, { nx: false });
      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Upstash POST error", err);
      res.status(500).json({ error: "Failed to save data" });
    }
    return;
  }

  res.setHeader("Allow", "GET, POST");
  res.status(405).json({ error: "Method Not Allowed" });
}

