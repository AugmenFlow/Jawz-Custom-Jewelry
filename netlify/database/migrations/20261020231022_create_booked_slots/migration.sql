CREATE TABLE "booked_slots" (
	"id" serial PRIMARY KEY,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"booking_id" text NOT NULL,
	"service" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "booked_slots_date_time_idx" ON "booked_slots" ("date","time");