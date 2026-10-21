import { pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

// One row per booked appointment time, so two customers can't book the same slot
export const bookedSlots = pgTable(
  "booked_slots",
  {
    id: serial().primaryKey(),
    date: text().notNull(), // YYYY-MM-DD
    time: text().notNull(), // e.g. "1:00 PM"
    bookingId: text("booking_id").notNull(),
    service: text().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("booked_slots_date_time_idx").on(table.date, table.time)],
);
