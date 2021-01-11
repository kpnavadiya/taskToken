// SPDX-License-Identifier: MIT

pragma solidity >=0.4.21 <0.8.0;


contract TaskToken {
    
    string public constant name = "Task Token";
    string public constant symbol = "TKT";
    uint8 public constant decimals = 8;

    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);
    
    
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    
    uint256 totalSupply_;
    
    using SafeMath for uint256;
    
    
    constructor(uint256 total) {
        totalSupply_ = total;
        balances[msg.sender] = totalSupply_;
    }
    
     // show total supply of token
    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }
    
     // current tokenOwner balances 
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }
    
    // Transfer the token 
    function transfer(address receiver, uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }
    
    // contract owner allowe to other member to transfer token
    function approve(address delegate, uint numTokens) public returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }
    
    // get current approved no. of token by owner
    function allowance(address owner, address delegate) public view returns (uint) {
        return allowed[owner][delegate];
    }
    
    // transfered approved token 
    function transferFrom(address owner, address buyer, uint numTokens) public returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);
        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
    
    // increase no. of token
    function _mint(address owner, uint256 amount) public {
        require(owner != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), owner, amount);

        totalSupply_ = totalSupply_.add(amount);
        balances[owner] = balances[owner].add(amount);
        emit Transfer(address(0), owner, amount);
    }
    // burn token (destory existing token)
    function _burn(address owner, uint256 amount) public {
        require(owner != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(owner, address(0), amount);
          totalSupply_ = totalSupply_.sub(amount);
       // balances[owner] = balances[owner].sub(amount, "ERC20: burn amount exceeds balance");
      
        emit Transfer(owner, address(0), amount);
    }

     function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual { }

}

library SafeMath { 
       // Only needed functions
        
        function sub(uint256 a, uint256 b) internal pure returns (uint256) {
            assert(b <= a);
            return a - b;
        }
        
        function add(uint256 a, uint256 b) internal pure returns (uint256)   {
            uint256 c = a + b;
            assert(c >= a);
            return c;
        }

       
}
