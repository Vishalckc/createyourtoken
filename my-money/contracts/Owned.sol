pragma solidity ^0.4.11;

contract Owned {
  address private owner;     //Address of ControllerContract

  function Owned(){
     owner = msg.sender; // just set the ControllerContract
  }

  modifier onlyOwner{
  	require(msg.sender == owner);
  	_;
  }

  function kill() onlyOwner internal{
    suicide(owner);
  }
}
