from fastapi import APIRouter, HTTPException
from contracts.schema import Contract, ContractCreate
from datetime import datetime
from config.database import contract_collection

router = APIRouter()

@router.get("/", response_model=list[Contract])
async def get_contracts():
    contracts = []
    async for contract in contract_collection.find():
        contract["_id"] = str(contract["_id"])
        contracts.append(contract)
    return contracts

@router.post("/", response_model=Contract)
async def create_contract(contract: ContractCreate):
    total = contract.quantity * contract.pricePerUnit
    new_contract = {
        "farmerName": contract.farmerName,
        "buyerName": contract.buyerName,
        "cropName": contract.cropName,
        "quantity": contract.quantity,
        "pricePerUnit": contract.pricePerUnit,
        "totalAmount": total,
        "date": datetime.now().isoformat()
    }

    result = await contract_collection.insert_one(new_contract)
    new_contract["_id"] = str(result.inserted_id)
    return new_contract
