// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

contract Twitter {
    uint16 constant MAX_TWEET_LENGTH = 280;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct Tweet {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
    }

    event TweetCreated(
        uint256 id,
        address author,
        string content,
        uint256 timestamp
    );
    event TweetLiked(address liker, address author, uint256 id, uint256 likes);
    event TweetUnliked(
        address unliker,
        address author,
        uint256 id,
        uint256 likes
    );

    mapping(address => Tweet[]) public tweets;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this");
        _;
    }

    function createTweet(string memory _content) public {
        require(bytes(_content).length > 0, "Tweet content cannot be empty");
        require(
            bytes(_content).length <= MAX_TWEET_LENGTH,
            string(
                abi.encodePacked(
                    "Tweet content exceeds ",
                    MAX_TWEET_LENGTH,
                    " characters"
                )
            )
        );

        Tweet memory newTweet = Tweet({
            id: tweets[msg.sender].length,
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            likes: 0
        });

        tweets[msg.sender].push(newTweet);
        emit TweetCreated(
            newTweet.id,
            newTweet.author,
            newTweet.content,
            newTweet.timestamp
        );
    }

    function getTweet(uint256 _index) public view returns (Tweet memory) {
        require(_index < tweets[msg.sender].length, "Tweet does not exist");
        require(tweets[msg.sender].length > 0, "No tweets found for this user");

        return tweets[msg.sender][_index];
    }

    function getAllTweets() public view returns (Tweet[] memory) {
        return tweets[msg.sender];
    }

    function likeTweet(address _author, uint256 _id) external {
        require(tweets[_author][_id].id == _id, "Tweet does not exist");

        tweets[_author][_id].likes++;
        emit TweetLiked(msg.sender, _author, _id, tweets[_author][_id].likes);
    }

    function unlikeTweet(address _author, uint256 _id) external {
        require(tweets[_author][_id].id == _id, "Tweet does not exist");
        require(tweets[_author][_id].likes > 0, "No likes to remove");

        tweets[_author][_id].likes--;
        emit TweetUnliked(msg.sender, _author, _id, tweets[_author][_id].likes);
    }
}
