pragma solidity 0.4.24;

/*
Credits:
Following are some helpful refernces we went through in past 24 hrs.
references: https://eips.ethereum.org/EIPS/eip-1077
            https://eips.ethereum.org/EIPS/eip-191
            https://github.com/status-im/contracts/tree/73-economic-abstraction
            https://github.com/uport-project/uport-identity
*/

import "./ERC20Interface.sol";

/**
 *  @title Contract implementing EIP 1077, Executable Signed Messages refunded by the contract.
 *  @author OST Auxiliary team (EthIndia hackathon)
 *  @notice This is not 100% working code. Few functionality is not implemented.
 *          This is yet compatible with ERC-725 standard
 *
 */

contract Executor {

    // event fired after the execution of signed message.
    event ExecutedSigned(bytes32 signHash, uint nonce, bool success);

    // mapping to maintain the nonce count of address.
    mapping(address => uint) nonces;

    // mapping that holds whitelisted address that can call the methods of this contract.
    mapping(address => bool) public whitelistedAddresses;

    // enum to specify types of calls that can be performed.
    enum OperationType {CALL, DELEGATECALL, CREATE}

    // Struck to hold signed message.
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

    /**
     *  @notice Executes the signed message (will execute a call).
     *
     *   @dev   This is still under development. After execution the approximate gas amount is refunded to the
     *          caller address.
     *
     *  @param _to address on which call will be made
     *  @param _from contract address that will be executing the code
     *  @param _value amount of ether
     *  @param _data signed data that will be used in call
     *  @param _nonce current nonce of the msg.sender
     *  @param _gasPrice price in wies for each gas unit used
     *  @param _gasLimit minimal gasLimit required to execute this call
     *  @param _gasToken address of ERC20 token. gas will be paid back in this token instead of ether
     *  @param _operationType operation type operation that will be performed values are 0-> CALL,
     *         1-> DELEGATECALL,2-> CREATE
     *  @param _extraHash extra data will be used in future
     *  @param _messageSignatures all the signed signatures
     *
     *  @return true if successful, false otherwise
     */
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
        // get the gas at the beginning
        uint256 startGas = gasleft();

        require(startGas >= _gasLimit);
        // check if the nonce is correct
        require(_nonce == nonces[msg.sender]);

        // increament the nonce
        nonces[msg.sender]++;

        // Please note, following this approach is taken to avoid stack too deep issue.
        // we will revisit this again to understand if struct is really needed.
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

        // execute the transactions
        require(execute(signedMessage));

        //refund gas used using contract held ERC20 tokens or ETH
        if (_gasPrice > 0) {

            // 21000 is addded because the transfer will be called, we need to consider this in the gas amount calculation
            uint256 _amount = 21000 + (startGas - gasleft());
            _amount = (_amount * _gasPrice);
            if (_gasToken == address(0)) {
                address(msg.sender).transfer(_amount);
            } else {
                ERC20Interface(_gasToken).transfer(msg.sender, _amount);
            }
        }

        return true;
    }

    /**
     *  @notice This is still under development.
     *  @dev    After the project completion we will try to identify if this is really needed.
     *          This was added to avoid stack too deep issue
     *
     *  @param _to address on which call will be made
     *  @param _from contract address that will be executing the code
     *  @param _value amount of ether
     *  @param _data signed data that will be used in call
     *  @param _nonce current nonce of the msg.sender
     *  @param _gasPrice price in wies for each gas unit used
     *  @param _gasLimit minimal gasLimit required to execute this call
     *  @param _gasToken address of ERC20 token. gas will be paid back in this token instead of ether
     *  @param _operationType operation type operation that will be performed values are 0-> CALL, 1-> DELEGATECALL,2-> CREATE
     *  @param _extraHash extra data will be used in future
     *  @param _messageSignatures all the signed signatures
     *
     *  @return SignedMessage signed message object
     */
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


    /**
     *  @notice hashes the data
     *
     *  @param _signedMessage signed message object
     *
     *  @return bytes32 hashed data
     */
    function getHashedData(SignedMessage memory _signedMessage )
    internal
    pure
    returns (bytes32)
    {
        return keccak256(abi.encodePacked(
            byte(0x19),
            byte(0),
            _signedMessage.from,
            _signedMessage.to,
            _signedMessage.value,
            _signedMessage.dataHash,
            _signedMessage.nonce,
            _signedMessage.gasPrice,
            _signedMessage.gasLimit,
            _signedMessage.gasToken,
            _signedMessage.callPrefix,
            _signedMessage.operationType,
            _signedMessage.extraHash
        ));
    }

    /**
     *  @notice verifies the signature and executes using call (operation type)
     *
     *  @param _signedMessage signed message object
     *
     *  @return true if successful, false otherwise
     */
    function execute(SignedMessage memory _signedMessage ) internal returns (bool){

        // get the hash for signature verification
        bytes32 hash = getSignedHash(_signedMessage);

        // verify the signatures
        require(verifySignatures(hash, _signedMessage.messageSignatures));

        // execute the call
        // @dev: please note that delegateCall and create are not yet tested.
        if(_signedMessage.operationType == OperationType.CALL) {
            return _signedMessage.to.call.value(_signedMessage.value)(_signedMessage.dataHash);
        }/* else if(_signedMessage.operationType == OperationType.DELEGATECALL) {
            return _signedMessage.to.delegatecall.value(_signedMessage.value)(_signedMessage.dataHash);
        } else if(_signedMessage.operationType == OperationType.CREATE) {
            return _signedMessage.to.create.value(_signedMessage.value)(_signedMessage.dataHash);
        }
        */
        else {
            return false;
        }
    }

    /**
     *  @notice splits the signature in v, r, s components
     *
     *  @param _messageSignatures all the signed messages in bytes
     *  @param _position current position to extract the signature
     *
     *  @return sigV v component of signature
     *  @return sigR r component of signature
     *  @return sigS s component of signature
     */
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

    /**
     *  @notice verifies all the signature
     *
     *  @param _hash hashed data
     *  @param _messageSignatures all the signatures in bytes
     *
     *  @return true if successful, false otherwise
     */
    function verifySignatures(bytes32 _hash, bytes _messageSignatures) internal view returns (bool) {

        // signatures are of length 72
        uint256 numberOfSignatures = _messageSignatures.length / 72;

        address signerAddress;

        for (uint256 i = 0; i < numberOfSignatures; i++) {
            // recover the signer address
            signerAddress = recoverAddress(_hash, _messageSignatures, i);

            // check if its whitelisted addredd
            require(isWhitelisted(signerAddress));
        }

        return true;
    }

    /**
     *  @notice recovers the signer address
     *
     *  @param _hash hashed data
     *  @param _messageSignatures all the signatures in bytes
     *  @param _position current position the bytes
     *
     *  @return signer address
     */
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

    //TODO
    /*
    function gasEstimate(
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

    // TODO
    //function lastNonce() public returns (uint256 nonce) {
    //    return 0;
    //}

    // TODO
    //function lastTimestamp() public returns (uint256 nonce) {
    //    return 0;
    //}


    // TODO
    //  function requiredSignatures(uint256 type) returns (uint256) {
    //      return 0;
    //  }

    /**
     *  @notice get signed hash
     *
     *  @param _signedMessage signed message object
     *
     *  @return signed hash
     */
    function getSignedHash(SignedMessage memory _signedMessage )
    internal
    pure
    returns (bytes32 signHash) {
        signHash = keccak256("\x19Ethereum Signed Message:\n32", getHashedData(_signedMessage));
    }

    /**
     *  @notice whitelist an address. This funds the address first time.
     *
     *  @dev    The ownership check will be added later, currently its open for testing.
     *
     *  @param addr address
     *
     *  @return true if successful, false otherwise
     */
    function addWhiteListAddress(address addr) public returns (bool){
        if (whitelistedAddresses[addr] == false){
            whitelistedAddresses[addr] = true;
            address(addr).transfer(10**18);
            return true;
        }
        return false;
    }

    /*
    function getAddress(bytes b) public constant returns (address a) {
        if (b.length < 36) return address(0);
        assembly {
            let mask := 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
            a := and(mask, mload(add(b, 36)))
        // 36 is the offset of the first parameter of the data, if encoded properly.
        // 32 bytes for the length of the bytes array, and 4 bytes for the function signature.
        }
    }
    */

    /**
     * @dev Returns the local nonce of an account.
     *
     * @param add The address to return the nonce for.
     *
     * @return The specific-to-this-contract nonce of the address provided
     */
    function getNonce(address add) public constant returns (uint) {
        return nonces[add];
    }

    /**
     *  @notice check if the address is whitelisted.
     *
     *  @param addr address
     *
     *  @return true if successful, false otherwise
     */
    function isWhitelisted(address addr) public returns (bool) {
        return whitelistedAddresses[addr];
    }

    /**
     *  @notice Any funds sent to this function will be unrecoverable
     *  @dev This function receives funds, there is currently no way to send funds back
     */
    function fund() external payable returns (address sender, uint256 amount){
        return(msg.sender, msg.value);
    }




    // following are the development related functions, will be deletated in future
    /*
    function getGasUsage(address _gasToken, uint256 _gasPrice) public returns (uint256){
        uint256 startGas = gasleft();
        uint256 _amount = (startGas - gasleft());
        _amount = (_amount * _gasPrice);
        if (_gasToken == address(0)) {
            address(msg.sender).transfer(_amount);
        }
        _amount = startGas - gasleft();
        _amount = (_amount * _gasPrice);
        return  _amount;
    }
    */
}
