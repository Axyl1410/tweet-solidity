import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Twitter", function () {
  async function deployTwitterFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    const Twitter = await hre.ethers.getContractFactory("Twitter");
    const twitter = await Twitter.deploy();
    return { twitter, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { twitter, owner } = await loadFixture(deployTwitterFixture);
      expect(await twitter.owner()).to.equal(owner.address);
    });
  });

  describe("Tweet creation", function () {
    it("Should create a tweet and emit event", async function () {
      const { twitter, user1 } = await loadFixture(deployTwitterFixture);
      const content = "Hello, Twitter!";
      await expect(twitter.connect(user1).createTweet(content))
        .to.emit(twitter, "TweetCreated")
        .withArgs(
          0,
          user1.address,
          content,
          await hre.ethers.provider.getBlockNumber() /* timestamp will be anyValue */
        );
      const tweet = await twitter.connect(user1).getTweet(0);
      expect(tweet.content).to.equal(content);
      expect(tweet.author).to.equal(user1.address);
      expect(tweet.likes).to.equal(0);
    });

    it("Should not allow empty tweet", async function () {
      const { twitter, user1 } = await loadFixture(deployTwitterFixture);
      await expect(twitter.connect(user1).createTweet("")).to.be.revertedWith(
        "Tweet content cannot be empty"
      );
    });

    it("Should not allow tweet over 280 chars", async function () {
      const { twitter, user1 } = await loadFixture(deployTwitterFixture);
      const longTweet = "a".repeat(281);
      await expect(
        twitter.connect(user1).createTweet(longTweet)
      ).to.be.revertedWith("Tweet content exceeds 280 characters");
    });
  });

  describe("Tweet retrieval", function () {
    it("Should get all tweets for a user", async function () {
      const { twitter, user1 } = await loadFixture(deployTwitterFixture);
      await twitter.connect(user1).createTweet("First tweet");
      await twitter.connect(user1).createTweet("Second tweet");
      const tweets = await twitter.connect(user1).getAllTweets(user1.address);
      expect(tweets.length).to.equal(2);
      expect(tweets[0].content).to.equal("First tweet");
      expect(tweets[1].content).to.equal("Second tweet");
    });

    it("Should revert if tweet does not exist", async function () {
      const { twitter, user1 } = await loadFixture(deployTwitterFixture);
      await expect(twitter.connect(user1).getTweet(0)).to.be.revertedWith(
        "No tweets found for this user"
      );
    });
  });

  describe("Likes", function () {
    it("Should like and unlike a tweet", async function () {
      const { twitter, user1, user2 } = await loadFixture(deployTwitterFixture);
      await twitter.connect(user1).createTweet("Like me!");
      await expect(twitter.connect(user2).likeTweet(user1.address, 0))
        .to.emit(twitter, "TweetLiked")
        .withArgs(user2.address, user1.address, 0, 1);
      let tweet = await twitter.connect(user1).getTweet(0);
      expect(tweet.likes).to.equal(1);

      await expect(twitter.connect(user2).unlikeTweet(user1.address, 0))
        .to.emit(twitter, "TweetUnliked")
        .withArgs(user2.address, user1.address, 0, 0);
      tweet = await twitter.connect(user1).getTweet(0);
      expect(tweet.likes).to.equal(0);
    });

    it("Should not unlike if likes is zero", async function () {
      const { twitter, user1, user2 } = await loadFixture(deployTwitterFixture);
      await twitter.connect(user1).createTweet("No likes yet");
      await expect(
        twitter.connect(user2).unlikeTweet(user1.address, 0)
      ).to.be.revertedWith("No likes to remove");
    });

    it("Should revert if liking non-existent tweet", async function () {
      const { twitter, user1, user2 } = await loadFixture(deployTwitterFixture);
      await expect(
        twitter.connect(user2).likeTweet(user1.address, 0)
      ).to.be.revertedWith("Tweet does not exist");
    });
  });
});
