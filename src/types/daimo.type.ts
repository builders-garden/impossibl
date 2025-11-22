import type {
  PaymentBouncedEvent,
  PaymentCompletedEvent,
  PaymentStartedEvent,
} from "@daimo/pay-common";
import { z } from "zod";

export const paymentStartedEventSchema = z.custom<PaymentStartedEvent>();
export type DaimoPayPaymentStartedEvent = z.infer<
  typeof paymentStartedEventSchema
>;

export const paymentCompletedEventSchema = z.custom<PaymentCompletedEvent>();
export type DaimoPayPaymentCompletedEvent = z.infer<
  typeof paymentCompletedEventSchema
>;

export const paymentBouncedEventSchema = z.custom<PaymentBouncedEvent>();
export type DaimoPayPaymentBouncedEvent = z.infer<
  typeof paymentBouncedEventSchema
>;

export type DaimoPayEvent =
  | DaimoPayPaymentStartedEvent
  | DaimoPayPaymentCompletedEvent
  | DaimoPayPaymentBouncedEvent;
