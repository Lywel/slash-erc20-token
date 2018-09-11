pragma solidity ^0.4.21;

contract SlashCoin {
  mapping (address => uint) public balances;
  address public owner;

  function SlashCoin() public {
    owner = msg.sender;
  }

  function mint(address receiver, uint amount) public {
    require (msg.sender == owner);
    balances[receiver] += amount;
  }

  function send(address receiver, uint amount) public {
    require (balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    balances[receiver] += amount;
  }
