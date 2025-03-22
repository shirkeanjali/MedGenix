# Prescription Analyzer API

A robust API for extracting and analyzing medication information from prescription images. This system uses advanced OCR (Optical Character Recognition) and LLM (Large Language Model) technologies to convert handwritten or typed prescriptions into structured data.

## Features

- **Prescription OCR**: Extract text from prescription images using multiple OCR methods
- **Medication Extraction**: Identify medications, dosages, frequency, and duration instructions
- **Fallback Mechanisms**: Multi-layered OCR approach with automatic fallbacks
- **RESTful API**: Simple HTTP interface for easy integration

## Technology Stack

- **FastAPI**: High-performance web framework for building APIs
- **Llama Vision Models**: Primary OCR method using LLM vision capabilities
- **OpenAI GPT-4 Vision**: Secondary OCR fallback
- **EasyOCR**: Tertiary OCR fallback for basic text extraction
- **Groq**: LLM provider for medication extraction and analysis
- **Docker**: Containerization for easy deployment

## Getting Started

### Prerequisites

- Python 3.9+
- Docker (optional)

### Environment Variables

Create a `.env` file with the following API keys and settings:

```
TOGETHER_API_KEY=your_together_api_key
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
LLAMA_MODEL=meta-llama/Llama-3-70b-vision-instruct
OCR_METHOD=llama
FALLBACK_ENABLED=true
PORT=8000
```

### Installation

#### Using Docker

```bash
docker build -t prescription-analyzer .
docker run -p 8000:8000 --env-file .env prescription-analyzer
```

#### Manual Setup

```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## API Usage

### Process a Prescription

```bash
curl -X POST "http://localhost:8000/process-prescription/" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@prescription.jpg"
```

### Response Format

```json
{
  "original_text": "Extracted text from the prescription",
  "medicines": [
    {
      "brand_name": "Medicine Name",
      "dosage": "10mg",
      "frequency": "twice daily",
      "duration": "7 days"
    }
  ]
}
```

## Project Structure

- `/app`: Main application code
  - `/ocr`: OCR implementation with preprocessing and fallbacks
  - `/analysis`: Medication extraction using LLMs

## License

[MIT License](LICENSE)
