const form = document.getElementById("uploadForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("imageInput");
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    const res = await fetch("/api/process/", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    document.getElementById("result").textContent =
        JSON.stringify(data, null, 2);
});