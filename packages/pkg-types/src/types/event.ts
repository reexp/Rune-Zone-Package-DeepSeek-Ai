/**
 * Kontrak event — dipakai oleh `@runezone/rune-events` (event bus),
 * `@runezone/rune-webhooks`, dan integrasi eksternal.
 */
import type { MaybePromise } from "./base";

/** Handler untuk sebuah event. */
export type EventHandler<TData = unknown> = (payload: EventPayload<string, TData>) => MaybePromise<void>;

/** Metadata tambahan yang boleh dibawa sebuah event. */
export interface EventMetadata {
  /** Trace/correlation id untuk observability lintas layanan. */
  readonly traceId?: string;
  /** Actor yang memicu event (user id, service id, dsb.). */
  readonly actorId?: string;
  /** Waktu event dibuat (UnixMillis). */
  readonly createdAt: number;
  /** Key-value tambahan yang bersifat opsional. */
  readonly extra?: Readonly<Record<string, unknown>>;
}

/** Payload event yang melewati event bus. */
export interface EventPayload<TName extends string = string, TData = unknown> {
  readonly id: string;
  readonly name: TName;
  readonly data: TData;
  readonly metadata: EventMetadata;
}

/** Definisi event yang di-register ke event bus. */
export interface EventDefinition<TName extends string = string, TData = unknown> {
  readonly name: TName;
  readonly data: TData;
}
