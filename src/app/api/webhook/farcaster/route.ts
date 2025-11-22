import {
  type ParseWebhookEvent,
  type ParseWebhookEventResult,
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/miniapp-node";
import type { NextRequest } from "next/server";
import {
  deleteUserNotificationDetails,
  setUserNotificationDetails,
} from "@/lib/database/queries/farcaster.query";
import { getOrCreateUserFromFid } from "@/lib/database/queries/user.query";
import { env } from "@/lib/env";
import { sendFarcasterNotification } from "@/utils/farcaster-notification";

export async function POST(request: NextRequest) {
  const requestJson = await request.json();
  console.log("[webhook/farcaster] requestJson", requestJson);

  let data: ParseWebhookEventResult;
  try {
    data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar);
  } catch (e: unknown) {
    const error = e as ParseWebhookEvent.ErrorType;

    switch (error.name) {
      case "VerifyJsonFarcasterSignature.InvalidDataError":
      case "VerifyJsonFarcasterSignature.InvalidEventDataError":
        // The request data is invalid
        return Response.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      case "VerifyJsonFarcasterSignature.InvalidAppKeyError":
        // The app key is invalid
        return Response.json(
          { success: false, error: error.message },
          { status: 401 }
        );
      case "VerifyJsonFarcasterSignature.VerifyAppKeyError":
        // Internal error verifying the app key (caller may want to try again)
        return Response.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      default:
        return Response.json(
          { success: false, error: "Unknown error" },
          { status: 500 }
        );
    }
  }

  console.log("[webhook/farcaster] parsed event data", data);
  const fid = data.fid;
  const appFid = data.appFid;
  const event = data.event;
  await getOrCreateUserFromFid(fid);

  switch (event.event) {
    case "miniapp_added":
      if (event.notificationDetails) {
        await setUserNotificationDetails({
          fid,
          notificationDetails: { ...event.notificationDetails, appFid },
        });
        await sendFarcasterNotification({
          fid,
          title: `Welcome to ${env.NEXT_PUBLIC_APPLICATION_NAME}!`,
          body: "Hello from Builders Garden!",
          notificationDetails: event.notificationDetails,
        });
      } else {
        await deleteUserNotificationDetails({ appFid, fid });
      }

      break;
    case "miniapp_removed": {
      console.log("[webhook/farcaster] miniapp_removed", event);
      await deleteUserNotificationDetails({ appFid, fid });
      break;
    }
    case "notifications_enabled": {
      console.log("[webhook/farcaster] notifications_enabled", event);
      await setUserNotificationDetails({
        fid,
        notificationDetails: { ...event.notificationDetails, appFid },
      });

      await sendFarcasterNotification({
        fid,
        title: "Ding ding dong",
        body: `Thank you for enabling notifications for ${env.NEXT_PUBLIC_APPLICATION_NAME}!`,
        notificationDetails: event.notificationDetails,
      });
      break;
    }
    case "notifications_disabled": {
      console.log("[webhook/farcaster] notifications_disabled", event);
      await deleteUserNotificationDetails({ appFid, fid });
      break;
    }
    default:
      console.log("[webhook/farcaster] unknown event", event);
      return Response.json(
        { success: false, error: "Unknown event" },
        { status: 400 }
      );
  }

  return Response.json({ success: true });
}
