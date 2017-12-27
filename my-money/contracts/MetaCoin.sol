
pragma solidity ^0.4.4;

import "./ConvertLib.sol";
import "./SafeMath.sol";
import "./ERC20Basic.sol";
import "./BasicToken.sol";
import "./StandardToken.sol";
//import "./Owned.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin is StandardToken, Ownable  {
  string public constant name = "Badla Token";
  string public constant symbol = "BADX";
  uint8 public constant decimals = 2;
  uint public constant INITIAL_SUPPLY = 10000;

	mapping (address => uint) balances;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	function MetaCoin() {
		balances[tx.origin] = INITIAL_SUPPLY;
	}


	function sendCoin(address receiver, uint amount) public payable returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		Transfer(msg.sender, receiver, amount);
		return true;
	}

	function getBalanceInEth(address addr) public payable returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public constant returns(uint) {
		return balances[addr];
	}

}

