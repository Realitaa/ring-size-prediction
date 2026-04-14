const form = document.getElementById("uploadForm");
const resultDisplay = document.getElementById("result");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("imageInput");
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    try {
        const res = await fetch("/api/process/", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            resultDisplay.innerHTML = `
                <div style="color: #10B981; font-weight: bold; margin-bottom: 8px;">Deteksi Berhasil!</div>
                <div>Ukuran Cincin yang Disarankan: <span style="font-weight: bold; font-size: 1.25rem;">${data.data.ring_size}</span></div>
                <div>Diameter Jari Terukur: ${data.data.diameter_mm} mm</div>
                <div>Diameter Referensi Cincin: ${data.data.reference_mm} mm</div>
            `;
        } else {
            resultDisplay.innerHTML = `
                <div style="color: #EF4444; font-weight: bold; margin-bottom: 8px;">Gagal Menganalisis</div>
                <div style="white-space: pre-wrap;">${data.error}</div>
            `;
        }
    } catch (err) {
        resultDisplay.innerHTML = `
            <div style="color: #EF4444; font-weight: bold; margin-bottom: 8px;">Kesalahan Sistem</div>
            <div>Terjadi masalah jaringan atau server: ${err.message}</div>
        `;
    }
});