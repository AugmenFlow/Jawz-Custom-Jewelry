import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { bookedSlots } from "../../db/schema.js";

// Must match TIME_SLOTS in the booking form
const TIME_SLOTS = ["10:30 AM", "11:45 AM", "1:00 PM", "2:15 PM", "3:30 PM", "4:45 PM", "6:00 PM", "7:15 PM"];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * GET  /api/slots?date=YYYY-MM-DD  -> { taken: ["1:00 PM", ...] }
 * POST /api/slots { date, time, bookingId, service } -> 201, or 409 if someone already has that time
 */
export default async (req: Request) => {
  if (req.method === "GET") {
    const date = new URL(req.url).searchParams.get("date") || "";
    if (!DATE_PATTERN.test(date)) return Response.json({ error: "Invalid date" }, { status: 400 });
    const rows = await db.select({ time: bookedSlots.time }).from(bookedSlots).where(eq(bookedSlots.date, date));
    return Response.json({ taken: rows.map((r) => r.time) }, { headers: { "Cache-Control": "no-store" } });
  }

  if (req.method === "POST") {
    let body: { date?: string; time?: string; bookingId?: string; service?: string };
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }
    const { date = "", time = "", bookingId = "", service = "" } = body;
    // Allow "today" in any US time zone (the server clock is UTC)
    const today = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    if (!DATE_PATTERN.test(date) || date < today || !TIME_SLOTS.includes(time) || !bookingId) {
      return Response.json({ error: "Invalid booking time" }, { status: 400 });
    }

    const inserted = await db
      .insert(bookedSlots)
      .values({ date, time, bookingId: bookingId.slice(0, 40), service: service.slice(0, 40) })
      .onConflictDoNothing()
      .returning({ id: bookedSlots.id });

    if (inserted.length === 0) return Response.json({ error: "That time was just booked" }, { status: 409 });
    return Response.json({ ok: true }, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/slots",
};
