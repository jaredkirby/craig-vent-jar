// /src/app/api/jar/route.ts
import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

export async function GET() {
  try {
    const client = await getRedisClient();

    // Get multiple values in a single operation
    const [amount, history] = await Promise.all([
      client.get("jarAmount"),
      client.lRange("jarHistory", 0, 4), // Get last 5 entries
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
      // Start a transaction
      const multi = client.multi();

      // Increment amount
      multi.incrBy("jarAmount", 1);

      // Add to history
      const newEntry = `${new Date().toLocaleTimeString()}: Added $1 to the jar`;
      multi.lPush("jarHistory", newEntry);
      // Trim history to keep only last 5 entries
      multi.lTrim("jarHistory", 0, 4);

      // Execute transaction
      const results = await multi.exec();

      // Get updated state
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

      // Reset amount
      multi.set("jarAmount", "0");

      // Reset history
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
