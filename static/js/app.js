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
        <div class="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl transition-colors">
            <div class="font-semibold text-red-700 dark:text-red-400 mb-2">❌ Koin Tidak Terdeteksi</div>
            <ul class="text-sm text-red-600 dark:text-red-300 list-disc ml-5 space-y-1">
                <li>Pastikan koin terlihat jelas di foto</li>
                <li>Gunakan pencahayaan yang cukup</li>
                <li>Jangan gunakan koin yang terlalu kecil / tertutup</li>
            </ul>
        </div>
        `;
    }

    if (type === "finger") {
        return `
        <div class="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl transition-colors">
            <div class="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">⚠️ Jari Tidak Terdeteksi</div>
            <ul class="text-sm text-yellow-700 dark:text-yellow-300 list-disc ml-5 space-y-1">
                <li>Pastikan seluruh jari terlihat</li>
                <li>Gunakan background kontras</li>
                <li>Hindari bayangan berlebih</li>
            </ul>
        </div>
        `;
    }

    return `
    <div class="p-4 bg-gray-100 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 transition-colors">
        Terjadi kesalahan: ${errorMsg}
    </div>
    `;
}

const ringSizes = {
  4: 14.1, 5: 14.9, 6: 15.7, 7: 16.5,
  8: 17.3, 9: 18.1, 10: 19.0,
  11: 19.8, 12: 20.6, 13: 21.4, 14: 22.2
};

function getRingSizeManual(diameter) {
    let closest = null;
    let minDiff = Infinity;

    for (let size in ringSizes) {
        const diff = Math.abs(diameter - ringSizes[size]);
        if (diff < minDiff) {
            minDiff = diff;
            closest = size;
        }
    }

    return {
        size: closest,
        reference: ringSizes[closest]
    };
}

const aiBtn = document.getElementById("aiModeBtn");
const manualBtn = document.getElementById("manualModeBtn");

const uploadForm = document.getElementById("uploadForm");
const manualContainer = document.getElementById("manualContainer");

function setMode(mode) {
    const activeClass = "px-4 py-2 bg-gray-900 dark:bg-pink-600 text-white rounded-lg transition-colors shadow-sm";
    const inactiveClass = "px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-slate-600";

    resultDisplay.innerHTML = "";
    resultDisplay.classList.add("hidden");

    if (mode === "ai") {
        uploadForm.classList.remove("hidden");
        manualContainer.classList.add("hidden");
        
        aiBtn.className = activeClass;
        manualBtn.className = inactiveClass;
    } else {
        uploadForm.classList.add("hidden");
        manualContainer.classList.remove("hidden");
        
        manualBtn.className = activeClass;
        aiBtn.className = inactiveClass;
    }
}

aiBtn.addEventListener("click", () => setMode("ai"));
manualBtn.addEventListener("click", () => setMode("manual"));

document.getElementById("manualSubmit").addEventListener("click", () => {
    const input = document.getElementById("manualDiameter").value;
    const diameter = parseFloat(input);

    if (!diameter || diameter <= 0) {
        resultDisplay.classList.remove("hidden");
        resultDisplay.innerHTML = `
            <div class="text-red-500 dark:text-red-400">Masukkan diameter yang valid</div>
        `;
        return;
    }

    const result = getRingSizeManual(diameter);

    resultDisplay.classList.remove("hidden");
    resultDisplay.innerHTML = `
        <div class="text-emerald-600 dark:text-emerald-400 font-bold mb-2">
            Hasil Manual
        </div>

        <div class="text-gray-900 dark:text-white">Ukuran Cincin: 
            <span class="text-xl font-bold">${result.size}</span>
        </div>

        <div class="text-gray-600 dark:text-gray-400 mt-1">Diameter Input: ${diameter} mm</div>

        ${renderWarning(diameter)}
        ${renderRecommendation(result.size)}
        ${renderTable()}
    `;
});