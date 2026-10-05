import { describe, expect, it } from "vitest";
import { resolveGuestCount } from "./rules";

describe("resolveGuestCount", () => {
  it("accepts attending guests within their seats", () => {
    expect(resolveGuestCount("GOING", 2, 2)).toEqual({ ok: true, guestCount: 2 });
  });

  it("rejects attending with nobody coming", () => {
    expect(resolveGuestCount("GOING", 0, 2).ok).toBe(false);
  });

  it("rejects more people than the invitation allows", () => {
    expect(resolveGuestCount("GOING", 3, 2)).toEqual({ ok: false, message: "Your invitation has 2 seats." });
    expect(resolveGuestCount("PENDING", 2, 1)).toEqual({ ok: false, message: "Your invitation has 1 seat." });
  });

  it("frees every seat when declining, whatever count was sent", () => {
    expect(resolveGuestCount("DECLINED", 2, 2)).toEqual({ ok: true, guestCount: 0 });
    expect(resolveGuestCount("DECLINED", Number.NaN, 2)).toEqual({ ok: true, guestCount: 0 });
  });

  it("allows an undecided guest to hold zero seats", () => {
    expect(resolveGuestCount("PENDING", 0, 2)).toEqual({ ok: true, guestCount: 0 });
  });
});
