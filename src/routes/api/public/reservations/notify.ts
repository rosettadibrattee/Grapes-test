import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const payloadSchema = z.object({ reservation_id: z.string().uuid() });

type Recipient = "store_owner" | "super_admin";

function money(n: number) {
  return `$${n.toFixed(2).replace(/\.00$/, "")}`;
}

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

async function sendSms(to: string, body: string) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const twilioKey = process.env["TWILIO_API_KEY"];
  const from = process.env["TWILIO_FROM_NUMBER"];
  if (!lovableKey || !twilioKey || !from) {
    throw new Error("Twilio is not configured (missing connector key or from-number)");
  }

  const res = await fetch("https://connector-gateway.lovable.dev/twilio/Messages.json", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": twilioKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`Twilio send failed [${res.status}]: ${text}`);
    throw new Error(`Twilio send failed [${res.status}]: ${text}`);
  }
  return (JSON.parse(text) as { sid?: string }).sid ?? null;
}

export const Route = createFileRoute("/api/public/reservations/notify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: config } = await supabaseAdmin.from("app_config").select("key, value");
        const cfg = Object.fromEntries((config ?? []).map((c) => [c.key, c.value]));

        const expected = cfg["notify_secret"];
        const provided = request.headers.get("x-notify-secret");
        if (!expected || provided !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return Response.json({ error: "Invalid payload" }, { status: 400 });
        }

        const { data: row, error } = await supabaseAdmin
          .from("reservations")
          .select(
            "id, code, qty, unit_price, total_price, status, pickup_by, created_at, " +
              "customers(full_name, phone), " +
              "stores(name, neighborhood, address, owner_name, owner_phone), " +
              "wines(name, producer, vintage)",
          )
          .eq("id", parsed.data.reservation_id)
          .maybeSingle();

        if (error || !row) {
          return Response.json({ error: "Reservation not found" }, { status: 404 });
        }

        const reservation = row as unknown as {
          id: string;
          code: string;
          qty: number;
          total_price: number | null;
          pickup_by: string | null;
          created_at: string;
          customers: { full_name: string; phone: string };
          stores: { name: string; neighborhood: string | null; address: string | null; owner_phone: string };
          wines: { name: string; producer: string | null; vintage: string | null };
        };

        const customer = reservation.customers;
        const store = reservation.stores;
        const wine = reservation.wines;


        const bottle = [wine.name, wine.vintage].filter(Boolean).join(" ");
        const total = money(Number(reservation.total_price ?? 0));
        const when = formatWhen(reservation.created_at);
        const dispatchBy = reservation.pickup_by ? formatWhen(reservation.pickup_by) : "today";

        const messages: { recipient: Recipient; to: string; body: string }[] = [
          {
            recipient: "store_owner",
            to: store.owner_phone,
            body:
              `🍇 Grapes reservation #${reservation.code}\n` +
              `${customer.full_name} (${customer.phone}) reserved ${reservation.qty}x ${bottle} — ${total}.\n` +
              `Delivery from ${store.name} by ${dispatchBy}. Please prepare the bottle for the courier.`,
          },
        ];

        const adminPhone = cfg["super_admin_phone"];
        if (adminPhone) {
          messages.push({
            recipient: "super_admin",
            to: adminPhone,
            body:
              `[GRAPES ADMIN] #${reservation.code} · ${when}\n` +
              `${store.name}${store.neighborhood ? ` (${store.neighborhood})` : ""} · ` +
              `${bottle} x${reservation.qty} · ${total}\n` +
              `Customer: ${customer.full_name} ${customer.phone}`,
          });
        }

        const results: { recipient: Recipient; status: string; error?: string }[] = [];

        for (const msg of messages) {
          // Idempotency: unique (reservation_id, recipient, channel) — a duplicate
          // trigger fire will conflict here and skip the send.
          const { error: claimError } = await supabaseAdmin.from("notification_log").insert({
            reservation_id: reservation.id,
            recipient: msg.recipient,
            to_phone: msg.to,
            body: msg.body,
            status: "pending",
          });

          if (claimError) {
            results.push({ recipient: msg.recipient, status: "skipped", error: "already queued" });
            continue;
          }

          try {
            const sid = await sendSms(msg.to, msg.body);
            await supabaseAdmin
              .from("notification_log")
              .update({ status: "sent", provider_sid: sid, sent_at: new Date().toISOString() })
              .eq("reservation_id", reservation.id)
              .eq("recipient", msg.recipient);
            results.push({ recipient: msg.recipient, status: "sent" });
          } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            await supabaseAdmin
              .from("notification_log")
              .update({ status: "failed", error: message })
              .eq("reservation_id", reservation.id)
              .eq("recipient", msg.recipient);
            results.push({ recipient: msg.recipient, status: "failed", error: message });
          }
        }

        return Response.json({ ok: true, reservation: reservation.code, results });
      },
    },
  },
});
