import React from "react";
import { render } from "@testing-library/react-native";
import Input from "../index";

describe("Input", () => {
  it("should be defined", () => {
    expect(Input).toBeDefined();
    expect(typeof Input).toBe("function");
  });

  it("should export a React component", () => {
    expect(Input.name).toBe("Input");
  });

  it("should accept required props", () => {
    expect(() => {
      render(
        <Input
          label="Test Label"
          placeholder="Test Placeholder"
          value="test value"
          onChangeText={jest.fn()}
        />
      );
    }).not.toThrow();
  });

  it("should handle optional props", () => {
    expect(() => {
      render(
        <Input
          label="Test Label"
          placeholder="Test Placeholder"
          value="test value"
          onChangeText={jest.fn()}
          secureTextEntry={true}
          style={{ backgroundColor: "red" }}
        />
      );
    }).not.toThrow();
  });
});
