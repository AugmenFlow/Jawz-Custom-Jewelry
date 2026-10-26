import type { FormSubmittedEvent } from "@netlify/functions";

// Reply-to address on customer emails, same inbox as STUDIO_EMAIL in the booking form
const STUDIO_EMAIL = "jawzjewelry@gmail.com";
const DEFAULT_FROM = "Jawz Jewelry <bookings@jawzjewelry.com>";

const SERVICE_NAMES: Record<string, string> = {
  "in-person": "In-Person Studio Fitting",
  "mail-order": "Mail-Order Mold Kit",
  jewelry: "Custom Jewelry & Watch Consultation",
  adjustment: "Adjustment / Repair",
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Booking details worth showing the customer, in the order they appear in the email. */
function detailRows(d: Record<string, string>): [string, string][] {
  const rows: [string, string | undefined][] = [
    ["Reference", d["booking-id"]],
    ["Name", d.name],
    ["Requested Date", d.date],
    ["Requested Time", d.time],
    ["Service", SERVICE_NAMES[d.service] || d.service],
    ["Consultation", d.consultation],
    ["Pieces", d.pieces],
    ["Stone", d.stone],
    ["Size", d.size],
    ["Budget", d.budget],
    ["Top Teeth", d["top-teeth"]],
    ["Bottom Teeth", d["bottom-teeth"]],
    ["Metal / Material", d.material],
    ["Cuts", d.cuts],
    ["Setting Style", d["setting-style"]],
    ["Your Design", d.design],
    ["Design Link", d["design-link"]],
    ["Notes", d.notes],
    ["Estimated Price", d.estimate],
    ["Promo Code", d["promo-code"]],
    ["Phone", d.phone],
    ["Instagram", d.instagram],
    ["Preferred Contact", d["contact-method"]],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]?.trim()));
}

const PENDING_LINES = [
  "Your requested appointment has been received.",
  "Your appointment is currently pending. A deposit is required before your appointment is confirmed.",
  "Jawz Jewelry will send you separate deposit/payment instructions.",
  "Your appointment is not officially confirmed until your deposit has been received.",
];

/** Emails the customer an "Appointment Request Received" summary when a booking form submission comes in. */
export default {
  async formSubmitted(event: FormSubmittedEvent) {
    const d = event.data || {};
    // Only the booking form carries a booking id
    if (!d["booking-id"]) return;

    const to = (d.email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return;

    const apiKey = Netlify.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.log("RESEND_API_KEY is not set; skipping customer request email");
      return;
    }

    const rows = detailRows(d);
    const firstName = (d.name || "").trim().split(/\s+/)[0] || "there";

    const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#111">
  <h1 style="font-size:22px;margin:0 0 4px">Appointment Request Received</h1>
  <p style="display:inline-block;margin:0 0 16px;padding:2px 8px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;background:#fff4d6;color:#8a5a00;border:1px solid #f0c36d;border-radius:3px">Pending Deposit</p>
  <p>Hi ${escapeHtml(firstName)},</p>
  ${PENDING_LINES.map((line) => `<p style="margin:0 0 10px">${escapeHtml(line)}</p>`).join("\n  ")}
  <h2 style="font-size:16px;margin:24px 0 8px">Your Request</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;color:#666;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;white-space:pre-line">${escapeHtml(value)}</td></tr>`
      )
      .join("\n    ")}
  </table>
  <p style="margin-top:24px">Questions? Text or call (469) 751-1734, or reply to this email.</p>
  <p style="color:#666;font-size:12px">Jawz Jewelry · 1201 N Watson Rd, Arlington, TX 76006 · Strictly by appointment only</p>
</div>`;

    const text = [
      "Appointment Request Received (Pending Deposit)",
      "",
      `Hi ${firstName},`,
      "",
      ...PENDING_LINES,
      "",
      "Your Request:",
      ...rows.map(([label, value]) => `${label}: ${value}`),
      "",
      "Questions? Text or call (469) 751-1734, or reply to this email.",
      "Jawz Jewelry - 1201 N Watson Rd, Arlington, TX 76006",
    ].join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: Netlify.env.get("RESEND_FROM_EMAIL") || DEFAULT_FROM,
        to: [to],
        reply_to: STUDIO_EMAIL,
        subject: `Appointment Request Received - Pending Deposit (${d["booking-id"]})`,
        html,
        text,
      }),
    });
    if (!res.ok) console.error(`Customer request email failed: ${res.status} ${await res.text()}`);
  },
};
