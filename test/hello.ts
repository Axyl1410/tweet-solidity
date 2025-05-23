import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Hello", function () {
  async function deployHelloFixture() {
    const Hello = await hre.ethers.getContractFactory("Hello");
    const hello = await Hello.deploy();

    return { hello };
  }

  describe("Greeting", function () {
    it("Should return the correct greeting message", async function () {
      const { hello } = await loadFixture(deployHelloFixture);

      const greeting = await hello.getGreeting();
      expect(greeting).to.equal("Hello, World!");
    });
  });

  describe("Set Greeting", function () {
    it("Should set the greeting message correctly", async function () {
      const { hello } = await loadFixture(deployHelloFixture);

      const newGreeting = "Hello, Hardhat!";
      await hello.setGreeting(newGreeting);

      const greeting = await hello.getGreeting();
      expect(greeting).to.equal(newGreeting);
    });
  });
});
