import { ulid } from "ulid";

export function generateUUID(): string {
  return ulid();
}
