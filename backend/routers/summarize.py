from fastapi import APIRouter, Depends
from middleware.auth_middleware import verify_firebase_token
from services.summarizer import summarization_pipeline
from models.schemas import SummarizeRequest, SummarizeResponse

router = APIRouter()

@router.post('/summarize', response_model=SummarizeResponse)
async def summarize(
    request: SummarizeRequest,
    token_data: dict = Depends(verify_firebase_token)
):
    result = summarization_pipeline.run(request.text)
    return SummarizeResponse(
        summary=result['summary'],
        key_points=result['key_points'],
        action_items=result['action_items'],
        keywords=result['keywords']
    )
