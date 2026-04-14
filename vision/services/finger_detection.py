import cv2
import numpy as np

REAL_COIN_DIAMETER_CM = 2.4  # hardcoded (prototipe)

ring_sizes = {
    4: 14.1, 5: 14.9, 6: 15.7, 7: 16.5,
    8: 17.3, 9: 18.1, 10: 19.0,
    11: 19.8, 12: 20.6, 13: 21.4, 14: 22.2
}

def get_ring_size(diameter_mm):
    closest_size = None
    min_diff = float('inf')

    for size, d in ring_sizes.items():
        diff = abs(diameter_mm - d)
        if diff < min_diff:
            min_diff = diff
            closest_size = size

    return closest_size, ring_sizes[closest_size]


def process_image_opencv(file_bytes):
    # decode image
    img_array = np.frombuffer(file_bytes, np.uint8)
    img_bgr = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    if img_bgr is None:
        raise ValueError("Gambar tidak valid")

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    # ===== DETEKSI KOIN =====
    img_blur = cv2.GaussianBlur(gray, (9, 9), 2)

    circles = cv2.HoughCircles(
        img_blur,
        cv2.HOUGH_GRADIENT,
        dp=1.2,
        minDist=100,
        param1=100,
        param2=30,
        minRadius=20,
        maxRadius=200
    )

    if circles is None:
        raise ValueError("Koin tidak terdeteksi")

    circles = np.uint16(np.around(circles))
    coin_diameter_pixel = 2 * circles[0][0][2]

    # ===== SEGMENTASI TANGAN =====
    _, thresh = cv2.threshold(gray, 125, 255, cv2.THRESH_BINARY)

    kernel = np.ones((7,7), np.uint8)
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    contours, _ = cv2.findContours(
        closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    candidates = [c for c in contours if cv2.contourArea(c) > 2000]

    if not candidates:
        raise ValueError("Tangan tidak terdeteksi")

    largest = max(candidates, key=cv2.contourArea)

    mask = np.zeros_like(gray)
    cv2.drawContours(mask, [largest], -1, 255, -1)

    # ===== SCAN LEBAR JARI =====
    h, w = mask.shape
    widths = []

    for y in range(int(h*0.3), int(h*0.7)):
        row = mask[y]
        white = np.where(row == 255)[0]

        if len(white) < 20:
            continue

        left = white[0]
        region = white[white < (left + 200)]

        if len(region) < 10:
            continue

        width = region[-1] - region[0]

        if 40 < width < 150:
            widths.append(width)

    if not widths:
        raise ValueError("Lebar jari tidak ditemukan")

    finger_width_pixel = int(np.median(widths))

    # ===== KONVERSI =====
    cm_per_pixel = REAL_COIN_DIAMETER_CM / coin_diameter_pixel
    finger_width_cm = finger_width_pixel * cm_per_pixel
    diameter_mm = finger_width_cm * 10

    size, ref = get_ring_size(diameter_mm)

    return {
        "diameter_mm": round(float(diameter_mm), 2),
        "ring_size": size,
        "reference_mm": ref
    }