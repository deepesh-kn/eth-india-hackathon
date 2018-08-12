pragma solidity 0.4.24;

import "./ERC20Interface.sol";

contract Executor_1 {

    event ExecutedSigned(bytes32 signHash, uint nonce, bool success);

    mapping(address => uint) nonces;

    mapping(address => bool) public whitelistedAddresses;

    enum OperationType {CALL, DELEGATECALL, CREATE}

    struct SignedMessage {
        address from;
        address to;
        uint256 value;
        bytes dataHash;
        uint256 nonce;
        uint256 gasPrice;
        uint256 gasLimit;
        address gasToken;
        byte callPrefix;
        OperationType operationType;
        byte extraHash;
        bytes messageSignatures;
    }


    function executeSigned(
        address _to,
        address _from,
        uint256 _value,
        bytes _data,
        uint256 _nonce,
        uint256 _gasPrice,
        uint256 _gasLimit,
        address _gasToken,
        OperationType _operationType,
        bytes _extraHash,
        bytes _messageSignatures)
    public
    returns (bool)
    {
        uint256 startGas = gasleft();
        require(startGas >= _gasLimit);
        require(_nonce == nonces[msg.sender]);
        nonces[msg.sender]++;
        // following this approach due to stack too deep error.
        SignedMessage memory signedMessage = getSignedMessageObject(
            _to,
            _from,
            _value,
            _data,
            _nonce,
            _gasPrice,
            _gasLimit,
            _gasToken,
            _operationType,
            _extraHash,
            _messageSignatures);

        require(execute(signedMessage));
        //refund gas used using contract held ERC20 tokens or ETH
        if (_gasPrice > 0) {
            uint256 _amount = 21000 + (startGas - gasleft());
            _amount = _amount * _gasPrice;
            if (_gasToken == address(0)) {
                address(msg.sender).transfer(_amount);
            } else {
                ERC20Interface(_gasToken).transfer(msg.sender, _amount);
            }
        }

        return true;
    }

    function getSignedMessageObject(
        address _to,
        address _from,
        uint256 _value,
        bytes _data,
        uint256 _nonce,
        uint256 _gasPrice,
        uint256 _gasLimit,
        address _gasToken,
        OperationType _operationType,
        bytes _extraHash,
        bytes _messageSignatures)
    internal
    returns (SignedMessage){
        SignedMessage memory signedMessage = SignedMessage({
            from: _from,
            to: _to,
            value: _value,
            dataHash: _data,
            nonce: _nonce,
            gasPrice: _gasPrice,
            gasLimit: _gasLimit,
            gasToken: _gasToken,
            callPrefix: '',
            operationType: _operationType,
            extraHash: '',
            messageSignatures: _messageSignatures
            });
        return signedMessage;
    }


    function getHashedData(SignedMessage memory signedMessage ) internal pure returns (bytes32)
    {
        return keccak256(
            byte(0x19),
            byte(0),
            signedMessage.from,
            signedMessage.to,
            signedMessage.value,
            signedMessage.dataHash,
            signedMessage.nonce,
            signedMessage.gasPrice,
            signedMessage.gasLimit,
            signedMessage.gasToken,
            signedMessage.callPrefix,
            signedMessage.operationType,
            signedMessage.extraHash
        );
    }

    function execute(SignedMessage memory signedMessage ) internal returns (bool){

        bytes32 hash = getSignedHash(signedMessage);
        require(verifySignatures(hash, signedMessage.messageSignatures));

        if(signedMessage.operationType == OperationType.CALL) {
            return signedMessage.to.call.value(signedMessage.value)(signedMessage.dataHash);
        }/* else if(signedMessage.operationType == OperationType.DELEGATECALL) {
            return signedMessage.to.delegatecall.value(signedMessage.value)(signedMessage.dataHash);
        } else if(signedMessage.operationType == OperationType.CREATE) {
            return signedMessage.to.create.value(signedMessage.value)(signedMessage.dataHash);
        }
        */
        else {
            return false;
        }
    }

    function signatureComponents(bytes _messageSignatures, uint256 _position)
        internal
        pure
        returns (uint8 sigV, bytes32 sigR, bytes32 sigS)
    {
        uint position = position + 1;

        // The signature format is a compact form of:
        //   {bytes32 r}{bytes32 s}{uint8 v}
        // Compact means, uint8 is not padded to 32 bytes.
        assembly {
            sigR := mload(add(_messageSignatures, mul(32,position)))
            sigS := mload(add(_messageSignatures, mul(64,position)))
            // Here we are loading the last 32 bytes, including 31 bytes
            // of 's'. There is no 'mload8' to do this.
            //
            // 'byte' is not working due to the Solidity parser, so lets
            // use the second best option, 'and'
            sigV := and(mload(add(_messageSignatures, mul(65,position))), 0xff)
        }

        require(sigV == 27 || sigV == 28);
    }


    function verifySignatures(bytes32 _hash, bytes _messageSignatures) internal view returns (bool) {

        uint256 numberOfSignatures = _messageSignatures.length / 72;

        address signerAddress;
        for (uint256 i = 0; i < numberOfSignatures; i++) {
            signerAddress = recoverAddress(_hash, _messageSignatures, i);
            require(isWhitelisted(signerAddress));
        }

        return true;
    }

    function recoverAddress (
        bytes32 _hash,
        bytes _messageSignatures,
        uint256 _position)
        pure
        public
        returns(address)
    {
        uint8 sigV;
        bytes32 sigR;
        bytes32 sigS;

        (sigV, sigR, sigS) = signatureComponents(_messageSignatures, _position);

        return ecrecover(_hash, sigV, sigR, sigS);
    }

 /*   function gasEstimate(
        address to,
        address from,
        uint256 value,
        bytes data,
        uint256 nonce,
        uint256 gasPrice,
        uint256 gasLimit,
        address gasToken,
        OperationType operationType,
        bytes extraHash,
        bytes messageSignatures)
    public
    pure
    returns ( bool canExecute, uint256 gasCost)
    {
        return (true, true);
    }
*/
    function lastNonce() public returns (uint256 nonce) {
        return 0;
    }

    function lastTimestamp() public returns (uint256 nonce) {
        return 0;
    }

  //  function requiredSignatures(uint256 type) returns (uint256) {
  //      return 0;
  //  }

    function getSignedHash(SignedMessage memory signedMessage ) internal pure returns (bytes32 signHash) {
        signHash = keccak256("\x19Ethereum Signed Message:\n32", getHashedData(signedMessage));
    }

    function addWhiteListAddress(address addr) public returns (bool){
        if (whitelistedAddresses[addr] == false){
            whitelistedAddresses[addr] = true;
            address(addr).transfer(10**18);
            return true;
        }
        return false;
    }

    function getAddress(bytes b) public constant returns (address a) {
        if (b.length < 36) return address(0);
        assembly {
            let mask := 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
            a := and(mask, mload(add(b, 36)))
        // 36 is the offset of the first parameter of the data, if encoded properly.
        // 32 bytes for the length of the bytes array, and 4 bytes for the function signature.
        }
    }

    /*
     * @dev Returns the local nonce of an account.
     * @param add The address to return the nonce for.
     * @return The specific-to-this-contract nonce of the address provided
     */
    function getNonce(address add) public constant returns (uint) {
        return nonces[add];
    }

    function isWhitelisted(address addr) public returns (bool) {
        return whitelistedAddresses[addr];
    }

    /// @notice Any funds sent to this function will be unrecoverable
    /// @dev This function receives funds, there is currently no way to send funds back
    function fund() external payable returns (address sender, uint256 amount){
        return(msg.sender, msg.value);
    }
}
