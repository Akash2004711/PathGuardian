import gpxpy
import gpxpy.gpx
import pandas as pd
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

class GPSMatcher:
    @staticmethod
    def parse_gpx(file_path: str) -> List[Dict[str, Any]]:
        """
        Parses a GPX file into a list of GPS sample dicts.
        """
        samples = []
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as gpx_file:
            gpx = gpxpy.parse(gpx_file)
            for track in gpx.tracks:
                for segment in track.segments:
                    for point in segment.points:
                        samples.append({
                            "latitude": point.latitude,
                            "longitude": point.longitude,
                            "altitude": point.elevation,
                            "speed_kmh": (point.speed * 3.6) if point.speed else None,
                            "timestamp": point.time if point.time else datetime.now(timezone.utc)
                        })
        return samples

    @staticmethod
    def parse_csv(file_path: str) -> List[Dict[str, Any]]:
        """
        Parses a CSV file with lat, lon, timestamp columns.
        """
        df = pd.read_csv(file_path)
        samples = []
        for _, row in df.iterrows():
            samples.append({
                "latitude": float(row.get("latitude", row.get("lat", 0.0))),
                "longitude": float(row.get("longitude", row.get("lng", row.get("lon", 0.0)))),
                "altitude": float(row.get("altitude", 0.0)) if "altitude" in row else None,
                "speed_kmh": float(row.get("speed_kmh", row.get("speed", 0.0))) if "speed" in row or "speed_kmh" in row else None,
                "timestamp": datetime.now(timezone.utc)
            })
        return samples

    @staticmethod
    def match_detection_to_gpx(detection_timestamp: datetime, gps_samples: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """
        Finds the closest GPS sample to a given detection timestamp using nearest neighbor matching.
        """
        if not gps_samples:
            return None

        # Sort samples by timestamp
        sorted_samples = sorted(gps_samples, key=lambda s: s["timestamp"])
        best_sample = min(sorted_samples, key=lambda s: abs((s["timestamp"] - detection_timestamp).total_seconds()))
        return best_sample

if __name__ == "__main__":
    print("[+] GPSMatcher module initialized.")
