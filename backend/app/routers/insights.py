from fastapi import APIRouter

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/")
def get_insights():
    """Get financial insights for the authenticated user"""
    return {"message": "Insights endpoint - to be implemented"}

