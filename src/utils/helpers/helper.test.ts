import { toDayOfWeek } from "./time";
import { phoneRegExp } from "./regexps";

describe("toDayOfWeek", () => {
  test("should return correct day", () => {
    expect(toDayOfWeek(1)).toBe("Mon");
    expect(toDayOfWeek(2)).toBe("Tues");
    expect(toDayOfWeek(3)).toBe("Wed");
    expect(toDayOfWeek(4)).toBe("Thur");
    expect(toDayOfWeek(5)).toBe("Fri");
    expect(toDayOfWeek(6)).toBe("Sat");
  });
  test("should return Sun if no argument is passed", () => {
    expect(toDayOfWeek()).toBe("Sun");
  });
});


describe("phoneRegExp", () => {

  it("should match when 10 characters number is used", () => {
    const isMatched = phoneRegExp.test("0029789890");
    expect(isMatched).toBe(true);
  });

  it("should match when 11 characters number that starts with `1` is used", () => {
    const isMatched = phoneRegExp.test("10029789890");
    expect(isMatched).toBe(true);
  });

  it("should match  when 11 characters number that starts with `+1` is used", () => {
    const isMatched = phoneRegExp.test("+10029789890");
    expect(isMatched).toBe(true);
  });

  it("should match when numbers are seperated with hyphen at correct interval", () => {
    const isMatched = phoneRegExp.test("+1-002-978-9890");
    expect(isMatched).toBe(true);
  });

  it("should fail to match when hyphens are not at correct interval", () => {
    const isMatched = phoneRegExp.test("+10-02-978-9890") || phoneRegExp.test("+1-0029-78-9890");
    expect(isMatched).toBe(false);
  });

  it("should fail to match when 11 characters number does not start with `1` or `-1`", () => {
    const isMatched = phoneRegExp.test("70029789890");
    expect(isMatched).toBe(false);
  });

  it("should fail to match when number is less than 10 characters", () => {
    const isMatched = phoneRegExp.test("978989099") || phoneRegExp.test("97898");
    expect(isMatched).toBe(false);
  });

});