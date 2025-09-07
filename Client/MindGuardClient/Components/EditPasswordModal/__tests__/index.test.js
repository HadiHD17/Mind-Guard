describe("EditPasswordModal", () => {
  it("should be defined", () => {
    const EditPasswordModal = require("../index").default;
    expect(EditPasswordModal).toBeDefined();
    expect(typeof EditPasswordModal).toBe("function");
  });

  it("should export a React component", () => {
    const EditPasswordModal = require("../index").default;
    expect(EditPasswordModal.name).toBe("EditPasswordModal");
  });

  it("should be a function", () => {
    const EditPasswordModal = require("../index").default;
    expect(typeof EditPasswordModal).toBe("function");
  });
});
