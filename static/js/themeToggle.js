const toggle = document.getElementById("themeToggle");

if (toggle) {
    // Sync initial icon state with current theme
    const isDark = document.documentElement.classList.contains("dark");
    toggle.textContent = isDark ? "☀️" : "🌙";

    toggle.addEventListener("click", () => {
        const currentlyDark = document.documentElement.classList.toggle("dark");
        
        if (currentlyDark) {
            toggle.textContent = "☀️";
            localStorage.setItem("theme", "dark");
        } else {
            toggle.textContent = "🌙";
            localStorage.setItem("theme", "light");
        }
    });
}