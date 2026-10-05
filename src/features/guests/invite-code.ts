import { randomBytes } from "crypto";

// 10 random bytes (80 bits) keeps the link short while making codes impractical to guess.
export function generateInviteCode() {
  return `invite-${randomBytes(10).toString("hex")}`;
}
