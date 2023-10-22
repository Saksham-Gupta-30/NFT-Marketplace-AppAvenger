// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 < 0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint public tokenCount;
    struct Token {
        string name;
        string description;
        string image;
        uint price;
    }
    mapping(uint => Token) public tokens;
    constructor() ERC721("AppAvenger NFT", "AppAvenger"){}
    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount ++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return(tokenCount);
    }
    function createToken(string memory _name, string memory _description, string memory _image, uint _price) external {
        tokens[tokenCount] = Token(_name, _description, _image, _price);
    }
    function getToken(uint _tokenId) public view returns(Token memory) {
        return tokens[_tokenId];
    }
}