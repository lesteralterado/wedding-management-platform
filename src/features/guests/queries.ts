import "server-only";
import { getMockGuests, getMockGuestGroups, getMockWedding } from "@/lib/demo/demo-data";

export async function getGuests(search = "", group = "") {
  const guests = getMockGuests();
  return guests.filter((guest) => {
    const matchesSearch = guest.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = group === "all" || guest.groupName === group;
    return matchesSearch && matchesGroup;
  });
}

export async function getGuestGroups() {
  return getMockGuestGroups();
}

export async function getGuestByInviteCode(inviteCode: string) {
  const guests = getMockGuests();
  const guest = guests.find((g) => g.inviteCode === inviteCode);
  if (!guest) return null;
  return {
    ...guest,
    wedding: getMockWedding(),
  };
}