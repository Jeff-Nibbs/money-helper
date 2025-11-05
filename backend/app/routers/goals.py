from fastapi import APIRouter

router = APIRouter(prefix="/goals", tags=["goals"])

@router.get("/")
def get_goals():
    """Get all goals for the authenticated user"""
    return {"message": "Goals endpoint - to be implemented"}

