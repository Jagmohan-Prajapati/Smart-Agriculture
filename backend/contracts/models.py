from pymongo.collection import Collection
from config.database import contract_collection
from typing import Dict, List

# Access the contracts collection
def insert_contract(contract_data: Dict) -> str:
    result = contract_collection.insert_one(contract_data)
    return str(result.inserted_id)

def get_all_contracts() -> List[Dict]:
    contracts = list(contract_collection.find())
    for contract in contracts:
        contract["_id"] = str(contract["_id"])
    return contracts