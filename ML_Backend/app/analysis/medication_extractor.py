import re
import json
import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key for Groq
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY)

# Choose the Llama model to use
# Groq offers several Llama models, including:
# - llama3-8b-8192
# - llama3-70b-8192
# - llama2-70b-4096
LLAMA_MODEL = os.getenv("LLAMA_MODEL", "llama3-8b-8192")

async def extract_medications_with_llm(ocr_text):
    """
    Use Llama via Groq to extract structured medication information from OCR text
    """
    try:
        # Construct the prompt
        prompt = f"""
        The following text was extracted from a doctor's prescription using OCR:
        
        {ocr_text}
        
        Extract all medications with their dosages, frequency, and duration.
        Format your response as a JSON array of objects with the following structure:
        [
            {{
                "brand_name": "medication name",
                "dosage": "dosage information (e.g., 10mg, 500mg)",
                "frequency": "how often to take (e.g., once daily, twice daily, BID, TID)",
                "duration": "how long to take (e.g., 7 days, 2 weeks)"
            }}
        ]
        
        If information is not available for certain fields, use null.
        Only return the JSON array and nothing else.
        """
        
        # Call the Groq API with the Llama model
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a medical assistant specialized in analyzing prescriptions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,  # Low temperature for more deterministic results
            max_tokens=1000
        )
        
        # Extract the text from the response
        result_text = response.choices[0].message.content.strip()
        
        # Parse the JSON result
        try:
            medicines = json.loads(result_text)
            
            # Validate the structure
            for med in medicines:
                if "brand_name" not in med:
                    med["brand_name"] = "Unknown Medication"
            
            return medicines
            
        except json.JSONDecodeError:
            # If JSON parsing fails, make a best effort to extract structured information
            print("Warning: JSONDecodeError, attempting to parse text manually")
            # Simple fallback mechanism
            medicines = []
            lines = result_text.split('\n')
            current_med = {}
            
            for line in lines:
                if "brand_name" in line.lower() or "medication" in line.lower():
                    if current_med and "brand_name" in current_med:
                        medicines.append(current_med)
                    current_med = {"brand_name": line.split(":")[-1].strip().strip('",')}
                elif "dosage" in line.lower():
                    current_med["dosage"] = line.split(":")[-1].strip().strip('",')
                elif "frequency" in line.lower():
                    current_med["frequency"] = line.split(":")[-1].strip().strip('",')
                elif "duration" in line.lower():
                    current_med["duration"] = line.split(":")[-1].strip().strip('",')
            
            if current_med and "brand_name" in current_med:
                medicines.append(current_med)
            
            return medicines
            
    except Exception as e:
        print(f"Error in medication extraction: {str(e)}")
        return []

def extract_medications_with_regex(ocr_text):
    """
    Use regex patterns to extract medication information
    (Fallback if LLM extraction fails)
    """
    medications = []
    
    # Common medication name patterns
    med_name_pattern = r'([A-Z][a-z]+(?:[ -][A-Z][a-z]+)*)\s+(?:\d+\s*(?:mg|mcg|g|ml))'
    
    # Dosage pattern
    dosage_pattern = r'(\d+\s*(?:mg|mcg|g|ml))'
    
    # Frequency patterns
    frequency_pattern = r'(?:take|given|administered|used)?\s*(?:once|twice|three times|four times|daily|every day|BID|TID|QID|q\d+h)'
    
    # Find potential medications
    for match in re.finditer(med_name_pattern, ocr_text, re.IGNORECASE):
        med_name = match.group(1)
        
        # Find dosage near the medication name
        dosage_match = re.search(dosage_pattern, ocr_text[match.start():match.start()+100])
        dosage = dosage_match.group(1) if dosage_match else None
        
        # Find frequency near the medication name
        freq_match = re.search(frequency_pattern, ocr_text[match.start():match.start()+150], re.IGNORECASE)
        frequency = freq_match.group(0) if freq_match else None
        
        # Add to medications list
        medications.append({
            "brand_name": med_name,
            "dosage": dosage,
            "frequency": frequency,
            "duration": None  # Hard to extract reliably with regex
        })
    
    return medications 