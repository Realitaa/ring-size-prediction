const ringTable = [
  { us: 4, mm: 14.1, eu: 44 },
  { us: 5, mm: 14.9, eu: 47 },
  { us: 6, mm: 15.7, eu: 49 },
  { us: 7, mm: 16.5, eu: 52 },
  { us: 8, mm: 17.3, eu: 54 },
  { us: 9, mm: 18.1, eu: 57 },
  { us: 10, mm: 19.0, eu: 59 },
  { us: 11, mm: 19.8, eu: 62 },
  { us: 12, mm: 20.6, eu: 64 },
  { us: 13, mm: 21.4, eu: 67 },
  { us: 14, mm: 22.2, eu: 70 }
];

function renderTable() {
    return `
    <div class="mt-4 transition-colors">
      <div class="font-semibold mb-2 text-gray-800 dark:text-gray-200">Tabel Konversi Ukuran</div>
      <table class="w-full text-sm border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden border-separate border-spacing-0">
        <thead>
          <tr class="bg-gray-50 dark:bg-slate-800 transition-colors">
            <th class="p-2 border-b border-r border-gray-200 dark:border-slate-700 text-left">US</th>
            <th class="p-2 border-b border-r border-gray-200 dark:border-slate-700 text-left">Diameter (mm)</th>
            <th class="p-2 border-b border-gray-200 dark:border-slate-700 text-left">EU</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
          ${ringTable.map(r => `
            <tr class="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="p-2 border-r border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300">${r.us}</td>
              <td class="p-2 border-r border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-medium">${r.mm}</td>
              <td class="p-2 text-gray-700 dark:text-gray-300">${r.eu}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    `;
}

function getRecommendations(size) {
  size = parseInt(size);
    return {
        down: size - 1,
        normal: size,
        up: size + 1
    };
}

function renderRecommendation(size) {
    const rec = getRecommendations(size);

    return `
    <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 shadow-sm transition-colors">
      <div class="font-semibold mb-2 text-blue-900 dark:text-blue-300">Rekomendasi Ukuran</div>
      <div class="text-sm text-blue-800 dark:text-blue-200/80 flex justify-between items-center">
        <span>Lebih kecil: <b class="text-blue-900 dark:text-blue-200">${rec.down}</b></span>
        <span class="w-px h-3 bg-blue-200 dark:bg-blue-800"></span>
        <span>Pas: <b class="text-blue-900 dark:text-blue-200 text-lg">${rec.normal}</b></span>
        <span class="w-px h-3 bg-blue-200 dark:bg-blue-800"></span>
        <span>Lebih longgar: <b class="text-blue-900 dark:text-blue-200">${rec.up}</b></span>
      </div>
    </div>
    `;
}

function getWarning(diameter) {
    if (diameter < 13) {
        return "⚠️ Diameter terlalu kecil. Kemungkinan deteksi tidak akurat (jari tidak terdeteksi dengan baik).";
    }
    if (diameter > 23) {
        return "⚠️ Diameter terlalu besar. Pastikan koin terdeteksi dengan benar dan foto tidak terlalu dekat.";
    }
    if (diameter < 14.5 || diameter > 21) {
        return "⚠️ Hasil berada di batas tidak umum. Disarankan mencoba ulang atau gunakan input manual.";
    }
    return null;
}

function renderWarning(diameter) {
    const warning = getWarning(diameter);

    if (!warning) return "";

    return `
    <div class="mt-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-sm text-red-700 dark:text-red-300 shadow-sm flex items-start gap-3 transition-colors">
      <span class="text-lg leading-none">⚠️</span>
      <div class="leading-relaxed">${warning}</div>
    </div>
    `;
}