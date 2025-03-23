# MedGenix 🚀💊

MedGenix is an AI-powered Prescription Scanner & Generic Medicine Recommender. This platform helps users scan prescriptions using OCR (Optical Character Recognition) and provides cost-effective generic alternatives to prescribed medicines. 🏥📸

## Features ✨
- 📷 **Prescription Scanning**: Upload prescriptions, and MedGenix extracts medicine details using OCR.
- 💰 **Generic Alternatives**: Find affordable generic substitutes for branded medicines.
- 📊 **Price Comparison**: Compare prices of medicines across different pharmacy sources.
- 🌎 **Multi-Language Support**: Ensuring accessibility for a diverse user base.
- ⚡ **Fast & Accurate**: AI-driven processing for quick and precise results.

## Tech Stack 🛠️
- **Frontend**: React, Tailwind CSS, HTML, JavaScript ⚛️🎨
- **Backend**: Node.js, Express.js 🖥️
- **Database**: MongoDB 🍃
- **Cloud Storage**: Cloudinary ☁️
- **OCR & AI**: AI-powered text extraction 🤖

## API Usage 🌐

### 📜 Process a Prescription
Send the uploaded prescription image (stored on Cloudinary) to the OCR API for text extraction.

```bash
curl -X POST "https://medgenix-production.up.railway.app/api/process-prescription/" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@prescription.jpg"
```

#### Response Format
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

### 🔄 Get Generic Alternatives
Fetch cost-effective generic medicine alternatives.

```bash
curl -X POST "https://medgenix-production.up.railway.app/api/process-prescription/" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "brand_name": "Lipitor",
      "dosage": "20mg",
      "frequency": "once daily",
      "duration": "30 days"
    }
  ]'
```

#### Response Format
```json
[
  {
    "brand_name": "Lipitor",
    "brand_details": {
      "brand_name": "Lipitor",
      "generic_name": null,
      "dosage": "20mg",
      "frequency": "once daily",
      "duration": "30 days"
    },
    "generic_alternatives": [
      {
        "generic_name": "Atorvastatin",
        "equivalent_dosage": "20mg",
        "price_comparison": "80-85% cheaper than brand name",
        "differences": "Bioequivalent to brand name with same efficacy"
      }
    ],
    "source": "rxnorm"
  }
]
```

## Installation & Setup ⚙️
1. Clone the repository 📦
   ```bash
   git clone https://github.com/your-username/MedGenix.git
   cd MedGenix
   ```
2. Install dependencies 📥
   ```bash
   npm install
   ```
3. Set up environment variables ⚡
   ```
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_SECRET=your_secret
   API_BASE_URL=https://medgenix-production.up.railway.app
   ```
4. Start the server 🚀
   ```bash
   npm start
   ```

## Contributing 🤝
We welcome contributions! If you’d like to improve MedGenix, feel free to fork the repo, create a new branch, and submit a pull request. 🚀

## License 📜
This project is licensed under the MIT License.

## Contact 📩
For queries or collaborations, reach out at **your-email@example.com** or visit our GitHub repository. 💡
