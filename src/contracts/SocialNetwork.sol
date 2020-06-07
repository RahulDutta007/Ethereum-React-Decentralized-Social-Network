pragma solidity >=0.4.21 <0.6.0;
//Create Posts
//Lists Posts
//Tip Posts
contract SocialNetwork {
	string public name;
	uint public postCount = 0;
	struct Post {
		uint id;
		string content;
		uint tipAmount;
		address payable author;
	}

	mapping(uint => Post) public posts;

	event PostCreated(uint id, string content, uint tipAmount, address payable author);
	event PostTipped(uint id, string content, uint tipAmount, address payable author);
	constructor() public {
		name = "DarkBook by Aeonix";
	}

	function createPost(string memory _content) public {
		require(bytes(_content).length > 0);

		postCount = postCount + 1;
		posts[postCount] = Post(postCount, _content, 0, msg.sender);
		emit PostCreated(postCount, _content, 0, msg.sender);
	}

	function tipPost(uint _id) public payable{
		require(_id > 0 && _id <=postCount);
		//Fetch the post
		Post memory _post = posts[_id]; 
		//Fetch the author
		address payable _author = _post.author;
		//Pay the author
		address(_author).transfer(msg.value);
		//Increment the tip amount
		_post.tipAmount = _post.tipAmount + msg.value;
		//Update the post
		posts[_id] = _post;
		//trigger an event
		emit PostTipped(postCount, _post.content, _post.tipAmount, _author);

	}
}