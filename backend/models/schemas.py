from pydantic import BaseModel
from typing import Optional, List, Any

class TranscribeResponse(BaseModel):
    transcribed_text: str
    original_raw_text: str
    summary: Optional[str] = None
    key_points: List[str] = []
    action_items: List[str] = []
    keywords: List[str] = []
    content_type: str = "general"
    tone: str = "neutral"
    has_dates: bool = False
    has_action_items: bool = False
    word_count: int = 0
    reading_time_sec: int = 0
    transcription_confidence: float = 0.0
    confidence_label: str = "Low — review recommended"
    total_processing_time_ms: int = 0
    processed_at: str = ""

class SummarizeRequest(BaseModel):
    text: str

class SummarizeResponse(BaseModel):
    summary: Optional[str] = None
    key_points: List[str] = []
    action_items: List[str] = []
    keywords: List[str] = []

class DocumentSaveRequest(BaseModel):
    """Flexible model — accepts any fields from the transcription result."""
    name: Optional[str] = None
    date: Optional[str] = None
    status: Optional[str] = "Completed"
    transcribed_text: Optional[str] = None
    original_raw_text: Optional[str] = None
    summary: Optional[str] = None
    key_points: List[str] = []
    action_items: List[str] = []
    keywords: List[str] = []
    content_type: Optional[str] = "general"
    tone: Optional[str] = "neutral"
    has_dates: Optional[bool] = False
    has_action_items: Optional[bool] = False
    word_count: Optional[int] = 0
    reading_time_sec: Optional[int] = 0
    transcription_confidence: Optional[float] = 0.0
    confidence_label: Optional[str] = ""
    total_processing_time_ms: Optional[int] = 0
    processed_at: Optional[str] = ""

    class Config:
        extra = "allow"   # accept any extra fields from frontend

class DocumentResponse(BaseModel):
    id: str
    name: Optional[str] = None
    date: Optional[str] = None
    status: Optional[str] = None
    transcribed_text: Optional[str] = None
    createdAt: Optional[float] = None
    updatedAt: Optional[float] = None
    userId: Optional[str] = None

    class Config:
        extra = "allow"
