import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Calucator", function () {
  async function deployCalculatorFixture() {
    const Calucator = await hre.ethers.getContractFactory("Calucator");
    const calculator = await Calucator.deploy();

    return { calculator };
  }

  describe("Deployment", function () {
    it("Should initialize result to 0", async function () {
      const { calculator } = await loadFixture(deployCalculatorFixture);

      expect(await calculator.get()).to.equal(0n);
    });
  });

  describe("Addition", function () {
    it("Should add numbers correctly", async function () {
      const { calculator } = await loadFixture(deployCalculatorFixture);

      await calculator.add(5);
      expect(await calculator.get()).to.equal(5n);

      await calculator.add(10);
      expect(await calculator.get()).to.equal(15n);
    });
  });

  describe("Subtraction", function () {
    it("Should subtract numbers correctly", async function () {
      const { calculator } = await loadFixture(deployCalculatorFixture);

      await calculator.add(20); // Start with 20
      await calculator.sub(5);
      expect(await calculator.get()).to.equal(15n);

      await calculator.sub(10);
      expect(await calculator.get()).to.equal(5n);
    });
  });

  describe("Multiplication", function () {
    it("Should multiply numbers correctly", async function () {
      const { calculator } = await loadFixture(deployCalculatorFixture);

      await calculator.add(5); // Start with 5
      await calculator.mul(3);
      expect(await calculator.get()).to.equal(15n);

      await calculator.mul(2);
      expect(await calculator.get()).to.equal(30n);
    });

    it("Should handle multiplication by zero", async function () {
      const { calculator } = await loadFixture(deployCalculatorFixture);

      await calculator.add(10);
      await calculator.mul(0);
      expect(await calculator.get()).to.equal(0n);
    });
  });

  describe("Reset", function () {
    it("Should reset the result to 0", async function () {
      const { calculator } = await loadFixture(deployCalculatorFixture);

      await calculator.add(10);
      expect(await calculator.get()).to.equal(10n);

      await calculator.reset();
      expect(await calculator.get()).to.equal(0n);
    });
  });

  describe("Complex operations", function () {
    it("Should handle multiple operations correctly", async function () {
      const { calculator } = await loadFixture(deployCalculatorFixture);

      await calculator.add(10); // result = 10
      await calculator.mul(2); // result = 20
      await calculator.sub(5); // result = 15

      expect(await calculator.get()).to.equal(15n);
    });
  });
});
