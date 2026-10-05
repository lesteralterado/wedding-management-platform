export function inviteUrl(inviteCode: string) {
  return `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/invite/${inviteCode}`;
}
