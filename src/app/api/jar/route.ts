// /src/app/api/jar/route.ts
import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

export async function GET() {
  try {
    const client = await getRedisClient();
    const [amount, history] = await Promise.all([
      client.get("jarAmount"),
      client.lRange("jarHistory", 0, 4),
    ]);

    return NextResponse.json({
      amount: parseInt(amount ?? "0", 10),
      history: history ?? [],
    });
  } catch (error) {
    console.error("Failed to get jar state:", error);
    return NextResponse.json(
      { error: "Failed to get jar state" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await getRedisClient();
    const { action } = await request.json();

    if (action === "add") {
      const multi = client.multi();
      multi.incrBy("jarAmount", 1);

      const newEntry = `${new Date().toLocaleTimeString()}: Added $1 to the jar`;
      multi.lPush("jarHistory", newEntry);
      multi.lTrim("jarHistory", 0, 4);

      await multi.exec();

      const [newAmount, history] = await Promise.all([
        client.get("jarAmount"),
        client.lRange("jarHistory", 0, 4),
      ]);

      return NextResponse.json({
        amount: parseInt(newAmount ?? "0", 10),
        history: history ?? [],
      });
    }

    if (action === "reset") {
      const multi = client.multi();
      multi.set("jarAmount", "0");

      const resetEntry = `${new Date().toLocaleTimeString()}: Jar was reset to $0`;
      multi.del("jarHistory");
      multi.lPush("jarHistory", resetEntry);

      await multi.exec();

      return NextResponse.json({
        amount: 0,
        history: [resetEntry],
      });
    }
  } catch (error) {
    console.error("Failed to update jar:", error);
    return NextResponse.json(
      { error: "Failed to update jar" },
      { status: 500 }
    );
  }
}
