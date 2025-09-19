describe("ProfileCard", () => {
  it("should be defined", () => {
    const ProfileCard = require("../index").default;
    expect(ProfileCard).toBeDefined();
    expect(typeof ProfileCard).toBe("function");
  });

  it("should export a React component", () => {
    const ProfileCard = require("../index").default;
    expect(ProfileCard.name).toBe("ProfileCard");
  });

  it("should be a function", () => {
    const ProfileCard = require("../index").default;
    expect(typeof ProfileCard).toBe("function");
  });
});
