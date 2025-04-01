from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import os
import base64
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# Load YOLO model
model_path = os.path.join(os.path.dirname(__file__), "best.pt")
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Error: Model file not found at {model_path}")
model = YOLO(model_path)

# Glasses paths
GLASSES_PATHS = {
    "black-cat-eye": {"Black": "glasses/black_cat_eye.png"},
    "eye-glasses": {"Black": "glasses/silhouette_glasses.png"},
    "round-black": {"Black": "glasses/round_black.png"},
    "heart-sunglasses": {"Pink": "glasses/heart_glasses.png"},
    "aviator-sunglasses": {
        "Blue": "glasses/blue_aviator_sunglasses.png",
        "Green": "glasses/green_sunglasses.png",
        "Red": "glasses/red_sunglasses.png",
    },
    "round-mirrored": {
        "Blue": "glasses/blue_sunglasses.png",
        "Light Blue": "glasses/lightblue_sunglass.png",
        "Pink": "glasses/pink_sunglasses.png",
    },
}

# Global variables for real-time overlay
selected_glasses = None
selected_color = None
is_tryon_active = False

#def adjust_brightness(frame, alpha=1.3, beta=40):
   # """Increase brightness and contrast."""
   # return cv2.convertScaleAbs(frame, alpha=alpha, beta=beta)

def overlay_glasses(frame, left_eye, right_eye, glasses_path=None):
    """Overlay glasses onto detected landmarks."""
    if glasses_path is None or not os.path.exists(glasses_path):
        print(f"Glasses path not found: {glasses_path}")
        return frame

    glasses = cv2.imread(glasses_path, cv2.IMREAD_UNCHANGED)
    if glasses is None:
        print(f"Failed to load glasses image: {glasses_path}")
        return frame

    eye_center_x = (left_eye[0] + right_eye[0]) // 2
    eye_center_y = (left_eye[1] + right_eye[1]) // 2
    eye_distance = np.linalg.norm(np.array(right_eye) - np.array(left_eye))

    if eye_distance <= 0:
        print("Invalid eye distance")
        return frame

    glasses_width = int(eye_distance * 2.5)
    glasses_height = int(glasses.shape[0] * (glasses_width / glasses.shape[1]))
    resized_glasses = cv2.resize(glasses, (glasses_width, glasses_height))

    x_offset = max(0, min(eye_center_x - glasses_width // 2, frame.shape[1] - glasses_width))
    y_offset = max(0, min(eye_center_y - int(glasses_height * 0.5), frame.shape[0] - glasses_height))

    for i in range(glasses_height):
        for j in range(glasses_width):
            if y_offset + i >= frame.shape[0] or x_offset + j >= frame.shape[1]:
                continue
            if resized_glasses.shape[2] == 4:  # Check for alpha channel
                alpha = resized_glasses[i, j, 3] / 255.0
                frame[y_offset + i, x_offset + j] = (
                    resized_glasses[i, j, :3] * alpha +
                    frame[y_offset + i, x_offset + j] * (1 - alpha)
                )

    return frame

def process_frame():
    """Process webcam frames for real-time overlay."""
    global is_tryon_active, selected_glasses, selected_color
    cap = cv2.VideoCapture(0)

    while cap.isOpened() and is_tryon_active:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame")
            break

        frame = cv2.resize(frame, (640, 384))
        #frame = adjust_brightness(frame)

        results = model(frame, conf=0.7)
        detected_eyes = []

        for result in results:
            for box in result.boxes.data:
                x1, y1, x2, y2, conf, cls = box.tolist()
                cls = int(cls)
                center = (int((x1 + x2) / 2), int((y1 + y2) / 2))

                if cls in [0, 1]:  # Class 0 = left eye, Class 1 = right eye
                    detected_eyes.append((center, cls))

        if len(detected_eyes) < 2:
            print("Real-time overlay skipped: Eyes not detected.")
        else:
            detected_eyes.sort(key=lambda x: x[0][0])  # Sort left-to-right
            left_eye, right_eye = detected_eyes[0][0], detected_eyes[1][0]

            if selected_glasses and selected_color:
                glasses_path = GLASSES_PATHS.get(selected_glasses, {}).get(selected_color)
                frame = overlay_glasses(frame, left_eye, right_eye, glasses_path)

        _, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

    cap.release()

@app.route('/video_feed')
def video_feed():
    """Endpoint for real-time video feed."""
    global is_tryon_active
    is_tryon_active = True
    return Response(process_frame(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/change_glasses', methods=['POST'])
def change_glasses():
    """Update selected glasses for real-time overlay."""
    global selected_glasses, selected_color
    data = request.get_json()
    selected_glasses = data.get("glasses")
    selected_color = data.get("color")
    print(f"Glasses changed to: {selected_glasses} ({selected_color})")
    return jsonify({"status": "success"})

@app.route('/process_image', methods=['POST', 'OPTIONS'])
def process_image():
    """Process static image and apply all glasses options."""
    if request.method == 'OPTIONS':  # Handle CORS preflight
        return jsonify({"message": "CORS preflight successful"}), 200

    data = request.get_json()
    if not data or "image" not in data:
        return jsonify({"error": "No image provided"}), 400

    try:
        image_data = data["image"]
        if "," in image_data:
            image_data = image_data.split(",")[1]  # Remove Base64 header

        image_bytes = base64.b64decode(image_data)
        image_np = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Invalid image"}), 400

        results = model(frame, conf=0.7)
        detected_eyes = []

        for result in results:
            for box in result.boxes.data:
                x1, y1, x2, y2, conf, cls = box.tolist()
                cls = int(cls)
                center = (int((x1 + x2) / 2), int((y1 + y2) / 2))
                if cls in [0, 1]:
                    detected_eyes.append((center, cls))

        if len(detected_eyes) < 2:
            return jsonify({"error": "Eyes not detected"}), 400

        detected_eyes.sort(key=lambda x: x[0][0])
        left_eye, right_eye = detected_eyes[0][0], detected_eyes[1][0]

        processed_images = []
        for glasses_id, colors in GLASSES_PATHS.items():
            for color, glasses_path in colors.items():
                temp_frame = frame.copy()
                processed_frame = overlay_glasses(temp_frame, left_eye, right_eye, glasses_path)
                _, buffer = cv2.imencode(".png", processed_frame)
                encoded_img = base64.b64encode(buffer).decode("utf-8")
                processed_images.append({"glasses": f"{glasses_id} ({color})", "image": encoded_img})

        return jsonify({"status": "success", "processed_images": processed_images})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
