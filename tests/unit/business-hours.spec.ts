import { expect, test } from "@playwright/test";
import { describeStatus, getOpenStatus, groupedSchedule, localParts, type HoursConfig } from "@/lib/business-hours";
import { restaurant } from "@/config/restaurant";

const base: HoursConfig = { hours: restaurant.hours, overrides: [] };
// Instants are written in UTC on purpose: the result must not depend on the machine/browser time zone.
const at = (iso: string) => new Date(iso);

test.describe("restaurant-local open/closed status", () => {
  test("Tuesday 11:59 AM PST is closed, opening today at noon", () => {
    const s = getOpenStatus(at("2026-12-01T19:59:00Z"), base); // Tue 11:59 PST
    expect(s.state).toBe("closed");
    expect(s.state === "closed" && s.opensAt?.isToday).toBe(true);
    expect(describeStatus(s)).toBe("Closed · opens today at noon");
  });

  test("Tuesday noon exactly is open until 9 PM", () => {
    const s = getOpenStatus(at("2026-12-01T20:00:00Z"), base);
    expect(s).toMatchObject({ state: "open", closesAt: "21:00", closingSoon: false });
    expect(describeStatus(s)).toBe("Open now · until 9 PM");
  });

  test("8:30 PM is open and flagged closing soon", () => {
    const s = getOpenStatus(at("2026-12-02T04:30:00Z"), base); // Tue 20:30 PST
    expect(s).toMatchObject({ state: "open", closingSoon: true });
  });

  test("9:00 PM boundary is closed; next opening is tomorrow", () => {
    const s = getOpenStatus(at("2026-12-02T05:00:00Z"), base); // Tue 21:00 PST
    expect(s.state).toBe("closed");
    expect(describeStatus(s)).toBe("Closed · opens tomorrow at noon");
  });

  test("just after midnight Wednesday is closed and opens today", () => {
    const s = getOpenStatus(at("2026-12-02T08:05:00Z"), base); // Wed 00:05 PST
    expect(localParts(at("2026-12-02T08:05:00Z")).day).toBe("wed");
    expect(describeStatus(s)).toBe("Closed · opens today at noon");
  });

  test("Saturday night skips Sunday and Monday to Tuesday", () => {
    const s = getOpenStatus(at("2026-12-06T06:00:00Z"), base); // Sat 22:00 PST
    expect(describeStatus(s)).toBe("Closed · opens Tuesday at noon");
  });

  test("Monday is closed all day", () => {
    const s = getOpenStatus(at("2026-12-07T21:00:00Z"), base); // Mon 13:00 PST
    expect(s.state).toBe("closed");
    expect(s.state === "closed" && s.opensAt?.isTomorrow).toBe(true);
  });

  test("daylight saving: same UTC instant is closed in PST week, open in PDT week", () => {
    // 19:30Z = 11:30 PST (before DST, Mar 3) but 12:30 PDT (after DST starts Mar 8, 2026)
    expect(getOpenStatus(at("2026-03-03T19:30:00Z"), base).state).toBe("closed");
    expect(getOpenStatus(at("2026-03-10T19:30:00Z"), base).state).toBe("open");
    // Fall back (Nov 1, 2026): 04:30Z Wed Nov 4 = 20:30 PST → open; Oct 28 04:30Z = 21:30 PDT → closed
    expect(getOpenStatus(at("2026-11-04T04:30:00Z"), base).state).toBe("open");
    expect(getOpenStatus(at("2026-10-28T04:30:00Z"), base).state).toBe("closed");
  });

  test("holiday override closes a normally-open day", () => {
    const cfg: HoursConfig = {
      ...base,
      overrides: [
        { date: "2026-12-24", intervals: [], label: "Closed for Christmas Eve" },
        { date: "2026-12-25", intervals: [], label: "Closed for Christmas" },
      ],
    };
    const s = getOpenStatus(at("2026-12-24T21:00:00Z"), cfg); // Thu 13:00 PST
    expect(s.state).toBe("closed");
    expect(s.note).toBe("Closed for Christmas Eve");
    expect(describeStatus(s)).toBe("Closed · opens Saturday at noon"); // skips the closed Friday too
  });

  test("early-close override", () => {
    const cfg: HoursConfig = { ...base, overrides: [{ date: "2026-12-31", intervals: [{ open: "12:00", close: "17:00" }], label: "New Year's Eve" }] };
    expect(getOpenStatus(at("2026-12-31T23:00:00Z"), cfg)).toMatchObject({ state: "open", closesAt: "17:00" }); // 15:00 PST
    expect(getOpenStatus(at("2027-01-01T02:00:00Z"), cfg).state).toBe("closed"); // 18:00 PST
  });

  test("grouped schedule for display", () => {
    expect(groupedSchedule()).toEqual([
      { label: "Monday", short: "Mon", text: "Closed", closed: true },
      { label: "Tuesday – Saturday", short: "Tue–Sat", text: "Noon – 9 PM", closed: false },
      { label: "Sunday", short: "Sun", text: "Closed", closed: true },
    ]);
  });
});
