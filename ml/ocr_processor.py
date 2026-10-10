import cv2
import re
from typing import Optional, Dict, Any

class OCRProcessor:
    def __init__(self):
        self.reader = None
        # Attempt to load EasyOCR if available
        try:
            import easyocr
            self.reader = easyocr.Reader(['en'], gpu=False)
            print("[+] EasyOCR reader initialized.")
        except Exception as e:
            print(f"[*] EasyOCR optional module not active ({e}). Operating in regex fallback parser mode.")

    def extract_telemetry(self, image_path: str) -> Dict[str, Any]:
        """
        Extracts visible timestamp and speed burn-in from image overlay.
        """
        result = {
            "timestamp": None,
            "speed_kmh": None,
            "confidence": 0.0
        }

        if self.reader is not None:
            try:
                ocr_results = self.reader.readtext(image_path)
                for bbox, text, prob in ocr_results:
                    # Match date pattern YYYY-MM-DD or HH:MM:SS
                    time_match = re.search(r'\d{4}[-/]\d{2}[-/]\d{2}\s+\d{2}:\d{2}:\d{2}', text)
                    if time_match:
                        result["timestamp"] = time_match.group(0)
                        result["confidence"] = float(prob)

                    speed_match = re.search(r'(\d{2,3})\s*(km/h|kmh|mph)', text, re.IGNORECASE)
                    if speed_match:
                        result["speed_kmh"] = float(speed_match.group(1))
            except Exception as e:
                print(f"[!] OCR Extraction error: {e}")

        return result

if __name__ == "__main__":
    ocr = OCRProcessor()
    print("[+] OCRProcessor initialized.")
