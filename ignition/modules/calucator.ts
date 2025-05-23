import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CalculatorModule = buildModule("CalculatorModule", (m) => {
  const calculator = m.contract("Calculator");

  return { calculator };
});

export default CalculatorModule;
