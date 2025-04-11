// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AgricultureContract
 * @dev Smart contract for agricultural supply chain
 */
contract AgricultureContract {
    // Enum for contract status
    enum Status { Pending, Active, Completed, Cancelled }
    
    // Struct for crop details
    struct Crop {
        string name;
        uint256 quantity; // in kg
        uint256 pricePerKg; // in wei
    }
    
    // Struct for contract details
    struct Contract {
        uint256 id;
        address farmer;
        address buyer;
        Crop crop;
        uint256 totalAmount; // total price in wei
        Status status;
        uint256 createdAt;
        uint256 completedAt;
    }
    
    // Contract counter
    uint256 private contractCounter;
    
    // Mapping from contract ID to Contract
    mapping(uint256 => Contract) public contracts;
    
    // Mapping from address to contract IDs
    mapping(address => uint256[]) public farmerContracts;
    mapping(address => uint256[]) public buyerContracts;
    
    // Events
    event ContractCreated(uint256 indexed contractId, address indexed farmer, address indexed buyer, string cropName, uint256 totalAmount);
    event ContractStatusChanged(uint256 indexed contractId, Status status);
    event PaymentReleased(uint256 indexed contractId, address to, uint256 amount);
    
    /**
     * @dev Create a new contract
     * @param _farmer Address of the farmer
     * @param _cropName Name of the crop
     * @param _quantity Quantity of the crop in kg
     * @param _pricePerKg Price per kg in wei
     */
    function createContract(
        address _farmer,
        string memory _cropName,
        uint256 _quantity,
        uint256 _pricePerKg
    ) external {
        require(_farmer != address(0), "Invalid farmer address");
        require(_quantity > 0, "Quantity must be greater than 0");
        require(_pricePerKg > 0, "Price must be greater than 0");
        
        uint256 totalAmount = _quantity * _pricePerKg;
        
        contractCounter++;
        uint256 contractId = contractCounter;
        
        // Create new contract
        contracts[contractId] = Contract({
            id: contractId,
            farmer: _farmer,
            buyer: msg.sender,
            crop: Crop({
                name: _cropName,
                quantity: _quantity,
                pricePerKg: _pricePerKg
            }),
            totalAmount: totalAmount,
            status: Status.Pending,
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        // Add contract to farmer and buyer mappings
        farmerContracts[_farmer].push(contractId);
        buyerContracts[msg.sender].push(contractId);
        
        emit ContractCreated(contractId, _farmer, msg.sender, _cropName, totalAmount);
    }
    
    /**
     * @dev Activate a contract (change status from Pending to Active)
     * @param _contractId ID of the contract
     */
    function activateContract(uint256 _contractId) external {
        Contract storage contract_ = contracts[_contractId];
        
        require(contract_.id != 0, "Contract does not exist");
        require(contract_.farmer == msg.sender, "Only farmer can activate contract");
        require(contract_.status == Status.Pending, "Contract must be pending");
        
        contract_.status = Status.Active;
        
        emit ContractStatusChanged(_contractId, Status.Active);
    }
    
    /**
     * @dev Complete a contract and release payment
     * @param _contractId ID of the contract
     */
    function completeContract(uint256 _contractId) external payable {
        Contract storage contract_ = contracts[_contractId];
        
        require(contract_.id != 0, "Contract does not exist");
        require(contract_.buyer == msg.sender, "Only buyer can complete contract");
        require(contract_.status == Status.Active, "Contract must be active");
        require(msg.value >= contract_.totalAmount, "Insufficient payment");
        
        contract_.status = Status.Completed;
        contract_.completedAt = block.timestamp;
        
        // Transfer payment to farmer
        payable(contract_.farmer).transfer(contract_.totalAmount);
        
        // Refund excess payment if any
        if (msg.value > contract_.totalAmount) {
            payable(msg.sender).transfer(msg.value - contract_.totalAmount);
        }
        
        emit ContractStatusChanged(_contractId, Status.Completed);
        emit PaymentReleased(_contractId, contract_.farmer, contract_.totalAmount);
    }
    
    /**
     * @dev Cancel a contract
     * @param _contractId ID of the contract
     */
    function cancelContract(uint256 _contractId) external {
        Contract storage contract_ = contracts[_contractId];
        
        require(contract_.id != 0, "Contract does not exist");
        require(contract_.farmer == msg.sender || contract_.buyer == msg.sender, "Only farmer or buyer can cancel");
        require(contract_.status == Status.Pending || contract_.status == Status.Active, "Cannot cancel completed contract");
        
        contract_.status = Status.Cancelled;
        
        emit ContractStatusChanged(_contractId, Status.Cancelled);
    }
    
    /**
     * @dev Get contract details
     * @param _contractId ID of the contract
     * @return Contract details
     */
    function getContract(uint256 _contractId) external view returns (
        uint256 id,
        address farmer,
        address buyer,
        string memory cropName,
        uint256 quantity,
        uint256 pricePerKg,
        uint256 totalAmount,
        Status status,
        uint256 createdAt,
        uint256 completedAt
    ) {
        Contract storage contract_ = contracts[_contractId];
        require(contract_.id != 0, "Contract does not exist");
        
        return (
            contract_.id,
            contract_.farmer,
            contract_.buyer,
            contract_.crop.name,
            contract_.crop.quantity,
            contract_.crop.pricePerKg,
            contract_.totalAmount,
            contract_.status,
            contract_.createdAt,
            contract_.completedAt
        );
    }
    
    /**
     * @dev Get all contracts for a farmer
     * @param _farmer Address of the farmer
     * @return Array of contract IDs
     */
    function getFarmerContracts(address _farmer) external view returns (uint256[] memory) {
        return farmerContracts[_farmer];
    }
    
    /**
     * @dev Get all contracts for a buyer
     * @param _buyer Address of the buyer
     * @return Array of contract IDs
     */
    function getBuyerContracts(address _buyer) external view returns (uint256[] memory) {
        return buyerContracts[_buyer];
    }
}

