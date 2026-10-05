import { describe, expect, it } from "vitest";
import { getPermissions, hasPermission, isWeddingRole } from "./permissions";

describe("hasPermission", () => {
  it("lets owners and co-organizers manage everything on their wedding", () => {
    for (const role of ["OWNER", "CO_ORGANIZER"] as const) {
      expect(hasPermission("CUSTOMER", role, "wedding:write")).toBe(true);
      expect(hasPermission("CUSTOMER", role, "guests:write")).toBe(true);
      expect(hasPermission("CUSTOMER", role, "invitations:write")).toBe(true);
    }
  });

  it("keeps planners away from wedding settings and invitations", () => {
    expect(hasPermission("CUSTOMER", "PLANNER", "guests:write")).toBe(true);
    expect(hasPermission("CUSTOMER", "PLANNER", "wedding:write")).toBe(false);
    expect(hasPermission("CUSTOMER", "PLANNER", "invitations:write")).toBe(false);
  });

  it("gives receptionists read-only guest access plus check-in", () => {
    expect(hasPermission("STAFF", "RECEPTIONIST", "checkin:read")).toBe(true);
    expect(hasPermission("STAFF", "RECEPTIONIST", "guests:read")).toBe(true);
    expect(hasPermission("STAFF", "RECEPTIONIST", "guests:write")).toBe(false);
  });

  it("limits photographers to the gallery", () => {
    expect(getPermissions("STAFF", "PHOTOGRAPHER")).toEqual(["gallery:read"]);
  });

  it("denies everything without a wedding role", () => {
    expect(getPermissions("CUSTOMER", null)).toEqual([]);
  });

  it("lets platform admins do anything", () => {
    expect(hasPermission("SUPER_ADMIN", null, "platform:write")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", null, "guests:write")).toBe(true);
  });
});

describe("isWeddingRole", () => {
  it("accepts wedding roles only", () => {
    expect(isWeddingRole("RECEPTIONIST")).toBe(true);
    expect(isWeddingRole("SUPER_ADMIN")).toBe(false);
    expect(isWeddingRole(null)).toBe(false);
  });
});
