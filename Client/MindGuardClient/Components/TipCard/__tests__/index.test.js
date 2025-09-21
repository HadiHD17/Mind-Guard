import React from "react";
import { render } from "@testing-library/react-native";
import TipCard from "../index";

describe("TipCard", () => {
  it("should be defined", () => {
    expect(TipCard).toBeDefined();
    expect(typeof TipCard).toBe("function");
  });

  it("should export a React component", () => {
    expect(TipCard.name).toBe("TipCard");
  });

  it("should accept text prop", () => {
    expect(() => {
      render(<TipCard text="This is a test tip" />);
    }).not.toThrow();
  });

  it("should handle empty text prop", () => {
    expect(() => {
      render(<TipCard text="" />);
    }).not.toThrow();
  });
});
