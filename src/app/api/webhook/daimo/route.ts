import type { NextRequest } from "next/server";
import {
  getTournamentById,
  updateTournament,
} from "@/lib/database/queries/tournament.query";
import { env } from "@/lib/env";
import {
  type DaimoPayEvent,
  paymentBouncedEventSchema,
  paymentCompletedEventSchema,
  paymentStartedEventSchema,
} from "@/types/daimo.type";

export function GET(_request: NextRequest) {
  // Handle health checks or other GET requests
  return Response.json({ status: "ok" });
}

export async function POST(request: NextRequest) {
  console.log("[WEBHOOK] Daimo webhook received");
  console.log("[WEBHOOK] Request method:", request.method);
  console.log(
    "[WEBHOOK] Request headers:",
    Object.fromEntries(request.headers.entries())
  );

  let body: DaimoPayEvent;
  try {
    const bodyText = await request.text();
    console.log("[WEBHOOK] Raw body text:", bodyText);

    if (!bodyText || bodyText.trim() === "") {
      console.log("[WEBHOOK] Empty body received, returning error");
      return Response.json(
        { success: false, error: "Empty body" },
        { status: 400 }
      );
    }

    body = JSON.parse(bodyText);
    console.log("[WEBHOOK] Successfully parsed body:", body);
  } catch (error) {
    console.error("[WEBHOOK] Failed to parse JSON body:", error);
    return Response.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const idempotencyKey = request.headers.get("Idempotency-Key");
  const authToken = request.headers.get("Authorization");
  console.log("[WEBHOOK] webhook body:", body);
  console.log("[WEBHOOK] webhook body type:", body?.type);
  console.log("[WEBHOOK] idempotency key:", idempotencyKey);
  console.log("[WEBHOOK] auth token present:", !!authToken);
  console.log(
    "[WEBHOOK] expected auth token:",
    `Basic ${env.DAIMO_PAY_WEBHOOK_SECRET}`
  );

  // check if auth token is valid
  if (
    !(idempotencyKey && authToken) ||
    authToken !== `Basic ${env.DAIMO_PAY_WEBHOOK_SECRET}`
  ) {
    console.log(
      "[WEBHOOK] Invalid auth - idempotencyKey:",
      !!idempotencyKey,
      "authToken:",
      !!authToken,
      "tokenMatch:",
      authToken === `Basic ${env.DAIMO_PAY_WEBHOOK_SECRET}`
    );
    return Response.json(
      { success: false, error: "Invalid request" },
      { status: 401 }
    );
  }

  // parse body
  let data: DaimoPayEvent;
  switch (body.type) {
    case "payment_started": {
      const paymentStartedEvent = paymentStartedEventSchema.safeParse(body);
      if (!paymentStartedEvent.success) {
        return Response.json(
          { success: false, error: paymentStartedEvent.error },
          { status: 400 }
        );
      }
      data = paymentStartedEvent.data;
      break;
    }
    case "payment_completed": {
      const paymentCompletedEvent = paymentCompletedEventSchema.safeParse(body);
      if (!paymentCompletedEvent.success) {
        return Response.json(
          { success: false, error: paymentCompletedEvent.error },
          { status: 400 }
        );
      }
      data = paymentCompletedEvent.data;
      break;
    }
    case "payment_bounced": {
      const paymentBouncedEvent = paymentBouncedEventSchema.safeParse(body);
      if (!paymentBouncedEvent.success) {
        return Response.json(
          { success: false, error: paymentBouncedEvent.error },
          { status: 400 }
        );
      }
      data = paymentBouncedEvent.data;
      break;
    }
    default:
      return Response.json(
        { success: false, error: "Invalid event type" },
        { status: 400 }
      );
  }

  // get user id from metadata
  const userId = data.payment.metadata?.userId;
  if (!userId) {
    return Response.json(
      {
        success: false,
        error: "No userId found in metadata",
      },
      { status: 401 }
    );
  }

  // early return daimo request to return a 200 response asap
  Response.json({ status: 200 });

  switch (data.type) {
    case "payment_completed": {
      console.log("daimo webhook payment_completed", data.payment);
      console.log("payment metadata type:", data.payment.metadata?.type);
      console.log("payment txHash:", data.txHash);
      console.log("user id:", userId);

      const type = data.payment.metadata?.type;
      const tournamentId = data.payment.metadata?.tournamentId;
      const amount = data.payment.metadata?.amount;
      const callData = data.payment.destination?.callData;

      // Detect transaction type by calldata if metadata type might be incorrect
      // This handles cases where resetPayment doesn't preserve metadata correctly
      console.log(
        `[WEBHOOK] Transaction analysis - metadata type: ${type}, callData: ${callData}`
      );

      // Handle contract integration for friend games
      if (type === "daily_deposit") {
        try {
          if (!tournamentId) {
            console.error("No tournament id found");
            return;
          }
          const tournament = await getTournamentById(tournamentId);
          if (!tournament) {
            console.error("Tournament not found");
            return;
          }

          // update tournament prize pool
          await updateTournament(tournamentId, {
            prizePool: tournament.prizePool + Number(amount),
          });
        } catch (error) {
          console.error(
            "[WEBHOOK] Failed to update tournament prize pool:",
            error
          );
        }
      }

      break;
    }
    case "payment_bounced": {
      console.error("daimo webhook payment_bounced, saving to db", data);
      break;
    }
    case "payment_started": {
      console.log("daimo webhook payment_started, saving to db", data);
      break;
    }
    default:
      return Response.json(
        { success: false, error: "Invalid event type" },
        { status: 400 }
      );
  }

  return Response.json({ success: true });
}
