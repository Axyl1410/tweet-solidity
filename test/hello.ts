import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Hello", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployHelloFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Hello = await hre.ethers.getContractFactory("Hello");
    const hello = await Hello.deploy();

    return { hello };
  }

  describe("Deployment", function () {
    it("Should set the correct initial greeting", async function () {
      const { hello } = await loadFixture(deployHelloFixture);

      expect(await hello.greeting()).to.equal("Hello, World!");
    });
  });

  describe("Greeting", function () {
    it("Should return the correct greeting message", async function () {
      const { hello } = await loadFixture(deployHelloFixture);

      const greeting = await hello.greeting();
      expect(greeting).to.equal("Hello, World!");
    });
  });
});
