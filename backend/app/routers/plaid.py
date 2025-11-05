from fastapi import APIRouter

router = APIRouter(prefix="/plaid", tags=["plaid"])

@router.get("/")
def get_plaid_info():
    """Plaid integration endpoints"""
    return {"message": "Plaid endpoint - to be implemented"}

