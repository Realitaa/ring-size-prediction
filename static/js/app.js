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
            resultDisplay.innerHTML = `
                <div class="text-red-500 dark:text-red-400 font-bold mb-2">Gagal Menganalisis</div>
                <div class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">${data.error}</div>
            `;
        }
    } catch (err) {
        resultDisplay.innerHTML = `
            <div class="text-red-500 dark:text-red-400 font-bold mb-2">Kesalahan Sistem</div>
            <div class="text-gray-700 dark:text-gray-300">Terjadi masalah jaringan atau server: ${err.message}</div>
        `;
    }
});