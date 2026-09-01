import os
import torch
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load models at startup
    print('Initializing Firebase Admin...')
    import firebase_admin_init  # triggers firebase init

    print('Loading OCR Pipeline (TrOCR + EasyOCR)...')
    from services.ml_pipeline import pipeline
    pipeline.load()

    print('Loading Flan-T5-Base summarizer...')
    from services.summarizer import summarization_pipeline
    summarization_pipeline.load_models()

    cuda_info = f"CUDA available: {torch.cuda.is_available()}"
    if torch.cuda.is_available():
        cuda_info += f" | GPU: {torch.cuda.get_device_name(0)}"
    print(f'Device info: {cuda_info}')
    print('All models loaded. Server ready! (v2.0.0)')
    yield
    print('Shutting down...')

app = FastAPI(
    title='DocuVision AI',
    description='Advanced Handwriting OCR + AI Summarization API',
    version='2.0.0',
    lifespan=lifespan
)

allowed_origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]
env_origins = os.getenv('ALLOWED_ORIGINS')
if env_origins:
    allowed_origins.extend([o.strip() for o in env_origins.split(',') if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(allowed_origins)),
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
    expose_headers=['Content-Disposition', 'content-disposition'],
)

from routers import transcribe, summarize, documents
app.include_router(transcribe.router, prefix='/api', tags=['Transcription'])
app.include_router(summarize.router, prefix='/api', tags=['Summarization'])
app.include_router(documents.router, prefix='/api', tags=['Documents'])


@app.get('/', include_in_schema=False)
async def root():
    return RedirectResponse(url='/docs')


@app.get('/api/health')
async def health():
    from services.ml_pipeline import pipeline
    cuda_available = torch.cuda.is_available()
    return {
        'status': 'ok',
        'version': '2.0.0',
        'model_loaded': pipeline._loaded,
        'device': str(pipeline.device) if pipeline._loaded else 'not_loaded',
        'cuda_available': cuda_available,
        'gpu_name': torch.cuda.get_device_name(0) if cuda_available else None,
        'trocr_model': os.getenv('TROCR_MODEL', 'microsoft/trocr-base-handwritten'),
        'beam_size': int(os.getenv('TROCR_BEAM_SIZE', '4')),
    }
