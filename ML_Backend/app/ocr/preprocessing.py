import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

def preprocess_prescription(image):
    """
    Create multiple enhanced versions of the prescription image
    to maximize OCR accuracy
    """
    # Ensure we have a PIL Image
    if not isinstance(image, Image.Image):
        if isinstance(image, np.ndarray):
            image = Image.fromarray(image)
        else:
            raise TypeError("Image must be PIL Image or numpy array")
    
    # Store different versions of the image
    versions = {"original": image}
    
    # Convert PIL to OpenCV format for advanced processing
    img_cv = np.array(image)
    if len(img_cv.shape) == 3:
        img_cv = cv2.cvtColor(img_cv, cv2.COLOR_RGB2BGR)
    
    # 1. Basic grayscale conversion
    if len(img_cv.shape) == 3:
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    else:
        gray = img_cv
    versions["grayscale"] = Image.fromarray(gray)
    
    # 2. Contrast enhancement
    enhanced_cv = cv2.convertScaleAbs(gray, alpha=1.5, beta=0)
    versions["contrast"] = Image.fromarray(enhanced_cv)
    
    # 3. Adaptive thresholding (helps with varying lighting)
    try:
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 21, 10
        )
        versions["threshold"] = Image.fromarray(thresh)
    except Exception as e:
        print(f"Thresholding error: {e}")
    
    # 4. Noise removal
    try:
        denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
        versions["denoised"] = Image.fromarray(denoised)
    except Exception as e:
        print(f"Denoising error: {e}")
    
    # 5. Edge enhancement (helps with handwriting)
    try:
        edges = cv2.Canny(gray, 50, 150)
        edge_enhanced = cv2.addWeighted(gray, 0.8, edges, 0.2, 0)
        versions["edge_enhanced"] = Image.fromarray(edge_enhanced)
    except Exception as e:
        print(f"Edge enhancement error: {e}")
    
    # 6. Sharpening via PIL (different approach)
    try:
        pil_gray = versions["grayscale"]
        enhancer = ImageEnhance.Sharpness(pil_gray)
        sharpened = enhancer.enhance(2.0)
        versions["sharpened"] = sharpened
    except Exception as e:
        print(f"Sharpening error: {e}")
    
    # Return all versions for OCR to try
    return versions 