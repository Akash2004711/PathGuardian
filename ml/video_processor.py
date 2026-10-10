import os
import cv2
from typing import List, Dict, Any, Tuple
from ml.detect import PotholeDetector

class VideoProcessor:
    def __init__(self, detector: PotholeDetector = None):
        self.detector = detector or PotholeDetector()

    def process_video(self, video_path: str, frame_sample_rate: int = 15) -> Tuple[List[Dict[str, Any]], str]:
        """
        Processes video frames at specified sampling step.
        Returns: (all_frame_detections, annotated_video_path)
        """
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file {video_path} not found.")

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Could not open video file at {video_path}")

        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        dir_name, base_name = os.path.split(video_path)
        annotated_video_path = os.path.join(dir_name, f"annotated_{base_name}")

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(annotated_video_path, fourcc, fps, (width, height))

        all_detections = []
        frame_idx = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Run inference on sampled frames
            if frame_idx % frame_sample_rate == 0:
                temp_frame_path = os.path.join(dir_name, f"temp_frame_{frame_idx}.jpg")
                cv2.imwrite(temp_frame_path, frame)
                try:
                    dets, _ = self.detector.detect_image(temp_frame_path)
                    for d in dets:
                        d["frame_number"] = frame_idx
                        all_detections.append(d)
                finally:
                    if os.path.exists(temp_frame_path):
                        os.remove(temp_frame_path)

            out.write(frame)
            frame_idx += 1

        cap.release()
        out.release()

        return all_detections, annotated_video_path

if __name__ == "__main__":
    vp = VideoProcessor()
    print("[+] VideoProcessor module initialized.")
