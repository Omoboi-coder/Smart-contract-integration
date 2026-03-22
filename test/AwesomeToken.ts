import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("AwesomeToken", function () {
  async function deployTokenFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const AwesomeToken = await ethers.getContractFactory("AwesomeToken");
    const token = await AwesomeToken.deploy(owner.address);
    return { token, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { token, owner } = await deployTokenFixture();
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should have the correct MAX_SUPPLY", async function () {
      const { token } = await deployTokenFixture();
      const MAX_SUPPLY = ethers.parseEther("10000000");
      expect(await token.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
    });
  });

  describe("requestToken", function () {
    it("Should allow a user to request tokens", async function () {
      const { token, otherAccount } = await deployTokenFixture();
      const FAUCET_AMOUNT = ethers.parseEther("100");
      
      await expect(token.connect(otherAccount).requestToken())
        .to.emit(token, "TokensRequested")
        .withArgs(otherAccount.address, FAUCET_AMOUNT);

      expect(await token.balanceOf(otherAccount.address)).to.equal(FAUCET_AMOUNT);
    });

    it("Should fail if requested twice within 24 hours", async function () {
      const { token, otherAccount } = await deployTokenFixture();
      await token.connect(otherAccount).requestToken();
      
      await expect(token.connect(otherAccount).requestToken())
        .to.be.revertedWith("Cooldown period not yet passed");
    });

    it("Should allow requesting again after 24 hours", async function () {
      const { token, otherAccount } = await deployTokenFixture();
      await token.connect(otherAccount).requestToken();

      // Advance time by 24 hours + 1 second
      await time.increase(24 * 60 * 60 + 1);

      await expect(token.connect(otherAccount).requestToken())
        .to.emit(token, "TokensRequested");
    });
    
    it("Should return correct time until next request", async function () {
      const { token, otherAccount } = await deployTokenFixture();
      await token.connect(otherAccount).requestToken();
      
      const timeLeft = await token.timeUntilNextRequest(otherAccount.address);
      expect(timeLeft).to.be.closeTo(24 * 60 * 60, 5); // Allow small buffer
    });
  });

  describe("mint", function () {
    it("Should allow owner to mint", async function () {
      const { token, owner, otherAccount } = await deployTokenFixture();
      const amount = ethers.parseEther("1000");
      
      await token.mint(otherAccount.address, amount);
      expect(await token.balanceOf(otherAccount.address)).to.equal(amount);
    });

    it("Should fail if non-owner tries to mint", async function () {
      const { token, otherAccount } = await deployTokenFixture();
      const amount = ethers.parseEther("1000");
      
      await expect(token.connect(otherAccount).mint(otherAccount.address, amount))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("Should fail if minting exceeds MAX_SUPPLY", async function () {
      const { token, owner } = await deployTokenFixture();
      const MAX_SUPPLY = await token.MAX_SUPPLY();
      
      await expect(token.mint(owner.address, MAX_SUPPLY + 1n))
        .to.be.revertedWith("Exceeds MAX_SUPPLY");
    });
  });
});
