pragma solidity 0.4.24;

contract Executor {

    event ExecutedSigned(bytes32 signHash, uint nonce, bool success);

    mapping(address => uint) nonce;

    mapping(address => bool) public whitelistedWorkers;

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

    function getHashedData(
        address from,
        address to,
        uint256 value,
        bytes dataHash,
        uint256 nonce,
        uint256 gasPrice,
        uint256 gasLimit,
        address gasToken,
        byte callPrefix,
        OperationType operationType,
        bytes extraHash)
    public
    pure
    returns (bytes32)
    {
        return keccak256(
            byte(0x19),
            byte(0),
            from,
            to,
            value,
            dataHash,
            nonce,
            gasPrice,
            gasLimit,
            gasToken,
            callPrefix,
            operationType,
            extraHash
        );
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
        SignedMessage storage signedMessage = SignedMessage({
            from: _from,
            to: _to,
            value: _value,
            dataHash: _dataHash,
            nonce: _nonce,
            gasPrice: _gasPrice,
            gasLimit: _gasLimit,
            gasToken: _gasToken,
            callPrefix: _callPrefix,
            operationType: _operationType,
            extraHash: _extraHash,
            messageSignatures: _messageSignatures
        });

        return true;
    }


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

    function lastNonce() public returns (uint256 nonce) {
        return 0;
    }

    function lastTimestamp() public returns (uint256 nonce) {
        return 0;
    }

    function requiredSignatures(uint256 type) returns (uint256) {
        return 0;
    }



function getSignatureComponent() internal pure return(uint8 v, bytes32 r, bytes32 s) {
    return (0,0,0);
}

function executeTx(
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        address destination,
        bytes data,
        address worker
    ) public {

        require(worker != address(0));
        require(isWhitelisted(worker));


        address claimedSender = getAddress(data);
        // use EIP 191
        // 0x19 :: version :: relay :: whitelistOwner :: nonce :: destination :: data
        bytes32 h = keccak256(byte(0x19), byte(0), this, worker, nonce[claimedSender], destination, data);
        address addressFromSig = ecrecover(h, sigV, sigR, sigS);

        require(claimedSender == addressFromSig);

        nonce[claimedSender]++; //if we are going to do tx, update nonce

        require(destination.call(data));
    }


    function getHash(
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        address destination,
        bytes data)
    public
    //returns (address claimedSender, bytes32 h, address addressFromSig){
    //returns (byte, byte, address, address, uint8, address, bytes){
    returns (address, bytes){
    //returns (bool){

        address claimedSender = getAddress(data);
        // use EIP 191
        // 0x19 :: version :: relay :: whitelistOwner :: nonce :: destination :: data
        bytes32 h = keccak256(byte(0x19), byte(0), this, msg.sender, 0, destination, data);
        address addressFromSig = ecrecover(h, sigV, sigR, sigS);

     //  return (claimedSender, h, addressFromSig);

        return (destination, data);
    }

//'0x19', '0x00','0xa5b1299240e26977ebc2a320975669fb86d0989e', '0x79376dc1925ba1e0276473244802287394216a39', 0,'0x6133633165346562666466373836386636363438', '0x'


    function addWhiteListWorker(address worker) public returns (bool){
        whitelistedWorkers[worker] = true;
        return true;
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
        return nonce[add];
    }

    function isWhitelisted(address worker) public returns (bool) {
        return whitelistedWorkers[worker];
    }

}
