pragma solidity ^0.4.21;

contract SlashCoin {
  mapping (address => uint) public balances;
  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  function mint(address receiver, uint amount) public {
    //require (msg.sender == owner);
    balances[receiver] += amount;
  }

  function send(address receiver) payable {
    //require (balances[msg.sender] >= amount);
    require (tx.gasprice == 0);
    receiver.call.value(msg.value)();
    //balances[msg.sender] -= amount;
    //balances[receiver] += amount;
  }
}
