const form = document.getElementById("uploadForm");
const resultDisplay = document.getElementById("result");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

function simulateProgress() {
    let progress = 0;

    const interval = setInterval(() => {
        if (progress < 90) {
            progress += Math.random() * 10;
            progressBar.style.width = progress + "%";

            if (progress < 30) progressText.textContent = "Mengupload gambar...";
            else if (progress < 60) progressText.textContent = "Menganalisis citra...";
            else progressText.textContent = "Menghitung ukuran cincin...";
        }
    }, 300);

    return interval;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    progressContainer.classList.remove("hidden");
    progressBar.style.width = "0%";

    const progressInterval = simulateProgress();

    const fileInput = document.getElementById("imageInput");
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    try {
        const res = await fetch("/api/process/", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        clearInterval(progressInterval);
        progressBar.style.width = "100%";
        progressText.textContent = "Selesai";

        if (data.success) {
            const size = data.data.ring_size;
            const diameter = data.data.diameter_mm;

            resultDisplay.innerHTML = `
                <div style="color: #10B981; font-weight: bold; margin-bottom: 8px;">
                    Deteksi Berhasil!
                </div>

                <div>Ukuran Cincin: 
                    <span style="font-weight: bold; font-size: 1.25rem;">
                        ${size}
                    </span>
                </div>

                <div>Diameter Jari: ${diameter} mm</div>

                ${renderWarning(diameter)}
                ${renderRecommendation(size)}
                ${renderTable()}
            `;
        } else {
            resultDisplay.innerHTML = renderError(data.error);
        }
    } catch (err) {
        resultDisplay.innerHTML = renderError(err.message);
    }
});

function classifyError(code) {
    switch(code) {
        case "COIN_NOT_DETECTED":
            return "coin";
        case "FINGER_NOT_DETECTED":
        case "FINGER_WIDTH_NOT_FOUND":
            return "finger";
        default:
            return "unknown";
    }
}

function renderError(errorMsg) {
    const type = classifyError(errorMsg);

    if (type === "coin") {
        return `
        <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div class="font-semibold text-red-700 mb-2">❌ Koin Tidak Terdeteksi</div>
            <ul class="text-sm text-red-600 list-disc ml-5 space-y-1">
                <li>Pastikan koin terlihat jelas di foto</li>
                <li>Gunakan pencahayaan yang cukup</li>
                <li>Jangan gunakan koin yang terlalu kecil / tertutup</li>
            </ul>
        </div>
        `;
    }

    if (type === "finger") {
        return `
        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div class="font-semibold text-yellow-700 mb-2">⚠️ Jari Tidak Terdeteksi</div>
            <ul class="text-sm text-yellow-700 list-disc ml-5 space-y-1">
                <li>Pastikan seluruh jari terlihat</li>
                <li>Gunakan background kontras</li>
                <li>Hindari bayangan berlebih</li>
            </ul>
        </div>
        `;
    }

    return `
    <div class="p-4 bg-gray-100 border rounded-xl text-sm text-gray-700">
        Terjadi kesalahan: ${errorMsg}
    </div>
    `;
}