describe("EditAccountModal", () => {
  it("should be defined", () => {
    const EditAccountModal = require("../index").default;
    expect(EditAccountModal).toBeDefined();
    expect(typeof EditAccountModal).toBe("function");
  });

  it("should export a React component", () => {
    const EditAccountModal = require("../index").default;
    expect(EditAccountModal.name).toBe("EditAccountModal");
  });

  it("should be a function", () => {
    const EditAccountModal = require("../index").default;
    expect(typeof EditAccountModal).toBe("function");
  });
});
