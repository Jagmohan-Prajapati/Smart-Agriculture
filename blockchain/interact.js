
const { ethers } = require("ethers")
const contractData = require("../app/blockchain/contractABI.json")

// Contract status enum mapping
const StatusEnum = {
  0: "Pending",
  1: "Active",
  2: "Completed",
  3: "Cancelled",
}

/**
 * Get a contract instance with a signer
 * @param {ethers.providers.Web3Provider} provider - Ethereum provider
 * @returns {ethers.Contract} - Contract instance
 */
function getContract(provider) {
  const signer = provider.getSigner()
  return new ethers.Contract(contractData.address, contractData.abi, signer)
}

/**
 * Create a new smart contract
 * @param {Object} contractDetails - Contract details
 * @param {string} contractDetails.farmer - Farmer's Ethereum address
 * @param {string} contractDetails.cropName - Name of the crop
 * @param {number} contractDetails.quantity - Quantity in kg
 * @param {number} contractDetails.pricePerKg - Price per kg in wei
 * @param {ethers.providers.Web3Provider} provider - Ethereum provider
 * @returns {Promise<Object>} - Transaction receipt
 */
async function createContract(contractDetails, provider) {
  try {
    const contract = getContract(provider)

    // Convert quantity and price to BigNumber
    const quantity = ethers.BigNumber.from(contractDetails.quantity)
    const pricePerKg = ethers.BigNumber.from(contractDetails.pricePerKg)

    // Create the contract
    const tx = await contract.createContract(contractDetails.farmer, contractDetails.cropName, quantity, pricePerKg)

    // Wait for transaction to be mined
    const receipt = await tx.wait()

    // Get the contract ID from the event
    const event = receipt.events.find((event) => event.event === "ContractCreated")
    const contractId = event.args.contractId.toString()

    return {
      success: true,
      contractId,
      transactionHash: receipt.transactionHash,
    }
  } catch (error) {
    console.error("Error creating contract:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Activate a contract (farmer only)
 * @param {string} contractId - Contract ID
 * @param {ethers.providers.Web3Provider} provider - Ethereum provider
 * @returns {Promise<Object>} - Transaction receipt
 */
async function activateContract(contractId, provider) {
  try {
    const contract = getContract(provider)

    // Activate the contract
    const tx = await contract.activateContract(contractId)

    // Wait for transaction to be mined
    const receipt = await tx.wait()

    return {
      success: true,
      transactionHash: receipt.transactionHash,
    }
  } catch (error) {
    console.error("Error activating contract:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Complete a contract and make payment (buyer only)
 * @param {string} contractId - Contract ID
 * @param {ethers.providers.Web3Provider} provider - Ethereum provider
 * @returns {Promise<Object>} - Transaction receipt
 */
async function completeContract(contractId, provider) {
  try {
    const contract = getContract(provider)

    // Get contract details to determine payment amount
    const details = await contract.getContract(contractId)
    const totalAmount = details.totalAmount

    // Complete the contract with payment
    const tx = await contract.completeContract(contractId, {
      value: totalAmount,
    })

    // Wait for transaction to be mined
    const receipt = await tx.wait()

    return {
      success: true,
      transactionHash: receipt.transactionHash,
    }
  } catch (error) {
    console.error("Error completing contract:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Cancel a contract
 * @param {string} contractId - Contract ID
 * @param {ethers.providers.Web3Provider} provider - Ethereum provider
 * @returns {Promise<Object>} - Transaction receipt
 */
async function cancelContract(contractId, provider) {
  try {
    const contract = getContract(provider)

    // Cancel the contract
    const tx = await contract.cancelContract(contractId)

    // Wait for transaction to be mined
    const receipt = await tx.wait()

    return {
      success: true,
      transactionHash: receipt.transactionHash,
    }
  } catch (error) {
    console.error("Error cancelling contract:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Get contract details
 * @param {string} contractId - Contract ID
 * @param {ethers.providers.Web3Provider} provider - Ethereum provider
 * @returns {Promise<Object>} - Contract details
 */
async function getContractDetails(contractId, provider) {
  try {
    const contract = getContract(provider)

    // Get contract details
    const details = await contract.getContract(contractId)

    return {
      id: details.id.toString(),
      farmer: details.farmer,
      buyer: details.buyer,
      cropName: details.cropName,
      quantity: details.quantity.toString(),
      pricePerKg: details.pricePerKg.toString(),
      totalAmount: details.totalAmount.toString(),
      status: StatusEnum[details.status],
      createdAt: new Date(details.createdAt.toNumber() * 1000),
      completedAt: details.completedAt.toNumber() > 0 ? new Date(details.completedAt.toNumber() * 1000) : null,
    }
  } catch (error) {
    console.error("Error getting contract details:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Get all contracts for a farmer
 * @param {string} farmerAddress - Farmer's Ethereum address
 * @param {ethers.providers.Web3Provider} provider - Ethereum provider
 * @returns {Promise<Array>} - Array of contract details
 */
async function getFarmerContracts(farmerAddress, provider) {
  try {
    const contract = getContract(provider)

    // Get contract IDs for the farmer
    const contractIds = await contract.getFarmerContracts(farmerAddress)

    // Get details for each contract
    const contractsDetails = await Promise.all(contractIds.map((id) => getContractDetails(id, provider)))

    return contractsDetails
  } catch (error) {
    console.error("Error getting farmer contracts:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Get all contracts for a buyer
 * @param {string} buyerAddress - Buyer's Ethereum address
 * @param {ethers.providers.Web3Provider} provider - Ethereum provider
 * @returns {Promise<Array>} - Array of contract details
 */
async function getBuyerContracts(buyerAddress, provider) {
  try {
    const contract = getContract(provider)

    // Get contract IDs for the buyer
    const contractIds = await contract.getBuyerContracts(buyerAddress)

    // Get details for each contract
    const contractsDetails = await Promise.all(contractIds.map((id) => getContractDetails(id, provider)))

    return contractsDetails
  } catch (error) {
    console.error("Error getting buyer contracts:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Format contract data for frontend display
 * @param {Array} contracts - Array of contract details
 * @returns {Array} - Formatted contracts for display
 */
function formatContractsForDisplay(contracts) {
  return contracts.map((contract) => ({
    id: contract.id,
    farmer: contract.farmer,
    buyer: contract.buyer,
    crop: contract.cropName,
    amount: ethers.utils.formatEther(contract.totalAmount) + " ETH",
    status: contract.status.toLowerCase(),
    date: contract.createdAt.toLocaleDateString(),
  }))
}

module.exports = {
  createContract,
  activateContract,
  completeContract,
  cancelContract,
  getContractDetails,
  getFarmerContracts,
  getBuyerContracts,
  formatContractsForDisplay,
}

