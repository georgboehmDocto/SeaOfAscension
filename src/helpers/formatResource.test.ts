import { describe, it, expect } from "vitest";
import { formatResource } from "./formatResource";

describe("formatResource", () => {
  it("floors the resource value before formatting", () => {
    expect(formatResource(123.9)).toBe("123");
    expect(formatResource(0.99)).toBe("0");
  });

  it("formats values below 1000 as plain integers", () => {
    expect(formatResource(0)).toBe("0");
    expect(formatResource(1)).toBe("1");
    expect(formatResource(999)).toBe("999");
    expect(formatResource(999.9)).toBe("999");
  });

  it("formats values above 1000 using 'k'", () => {
    expect(formatResource(1_000)).toBe("1k");
    expect(formatResource(1_500)).toBe("1.5k");
    expect(formatResource(12_345)).toBe("12.345k");
  });

  it("formats values above 1,000,000 using 'mil'", () => {
    expect(formatResource(1_000_000)).toBe("1mil");
    expect(formatResource(1_500_000)).toBe("1.5mil");
    expect(formatResource(12_345_678)).toBe("12.345678mil");
  });

  it("does not round up when crossing thresholds", () => {
    expect(formatResource(999.999)).toBe("999");
    expect(formatResource(999_999.999)).toBe("999.999k");
  });
});
