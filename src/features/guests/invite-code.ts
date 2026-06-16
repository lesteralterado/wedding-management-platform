import { randomBytes } from "crypto";

export function generateInviteCode() {
  return `invite-${randomBytes(6).toString("hex")}`;
}
