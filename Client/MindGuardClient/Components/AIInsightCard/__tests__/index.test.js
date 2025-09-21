import React from "react";
import { render } from "@testing-library/react-native";
import AIInsightCard from "../index";

describe("AIInsightCard", () => {
  it("should be defined", () => {
    expect(AIInsightCard).toBeDefined();
    expect(typeof AIInsightCard).toBe("function");
  });

  it("should export a React component", () => {
    expect(AIInsightCard.name).toBe("AIInsightCard");
  });

  it("should accept title and subtitle props", () => {
    expect(() => {
      render(<AIInsightCard title="Test Title" subtitle="Test Subtitle" />);
    }).not.toThrow();
  });
});
