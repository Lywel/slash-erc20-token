pragma solidity ^0.4.22;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SlashCoin.sol";

contract TestSlashCoin {
  SlashCoin coin = SlashCoin(DeployedAddresses.SlashCoin());

  function testMint() public {
    address me = this;
    uint original_balance = coin.balances(me);
    coin.mint(me, 20);
    Assert.equal(original_balance + 20, coin.balances(me),
          "Main account should have mined 20 SlashCoins");
  }

  function testSend() public {
    address dest = address(1);
    coin.send(dest, 10);
    Assert.equal(coin.balances(dest), 10, "New account should have receive 10 SlashCoin");
  }
}
