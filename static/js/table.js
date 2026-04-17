const ringTable = [
  { us: 4, mm: 14.9, eu: 47 },
  { us: 5, mm: 15.7, eu: 49 },
  { us: 6, mm: 16.5, eu: 52 },
  { us: 7, mm: 17.3, eu: 54 },
  { us: 8, mm: 18.2, eu: 57 },
  { us: 9, mm: 19.0, eu: 60 },
  { us: 10, mm: 19.8, eu: 62 },
  { us: 11, mm: 20.7, eu: 65 },
  { us: 12, mm: 21.5, eu: 68 },
  { us: 13, mm: 22.3, eu: 70 },
  { us: 14, mm: 23.1, eu: 73 }
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

function renderRecommendation(size, diameter) {
    const rec = getRecommendations(size);
    const floatDiameter = parseFloat(diameter);
    
    // Scale based on the full ringTable range
    const minMm = ringTable[0].mm; // 14.1
    const maxMm = ringTable[ringTable.length - 1].mm; // 22.2
    
    // Use slightly wider bounds for better padding
    const chartMin = 14; 
    const chartMax = 23;
    const range = chartMax - chartMin;
    const percentage = ((floatDiameter - chartMin) / range) * 100;

    return `
    <div class="mt-4 p-5 bg-[#ddeff3] dark:bg-[#ddeff3]/10 rounded-2xl border border-[#ddeff3] dark:border-[#ddeff3]/20 shadow-sm transition-colors overflow-hidden">
      
      <!-- Comparison Chart -->
      <div class="mb-8 pt-2">
        <div class="flex justify-between text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 mb-2.5 px-0.5 uppercase tracking-tighter">
          <span>14mm</span>
          <span>16mm</span>
          <span>18mm</span>
          <span>20mm</span>
          <span>22mm</span>
          <span>24mm</span>
        </div>
        
        <div class="relative h-2 bg-blue-100/30 dark:bg-slate-800 rounded-full border border-blue-200/50 dark:border-blue-800/50 transition-colors">
          <!-- Reference Marks (Full Range) -->
          <div class="absolute inset-x-0 inset-y-0 flex justify-between px-[1px]">
            ${[14, 16, 18, 20, 22, 24].map(() => `<div class="w-px bg-blue-200 dark:bg-blue-800/50 h-full"></div>`).join("")}
          </div>
          
          <!-- User Marker -->
          <div class="absolute top-0 bottom-0 -translate-x-1/2 transition-all duration-700 ease-out" style="left: ${percentage}%">
            <!-- Vertical Indicator Line -->
            <div class="h-full w-0.5 bg-blue-600 dark:bg-blue-400 mx-auto"></div>
            
            <!-- Tooltip/Arrow -->
            <div class="absolute top-full left-1/2 -translate-x-1/2 pt-1 flex flex-col items-center">
              <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-blue-600 dark:border-b-blue-400"></div>
              <div class="mt-0.5 px-2 py-0.5 bg-blue-600 dark:bg-blue-500 text-white text-[10px] font-bold rounded-full shadow-lg whitespace-nowrap">
                Ukuran kamu: ${floatDiameter.toFixed(1)} mm
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="font-semibold mb-3 text-blue-900 dark:text-blue-300 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        Rekomendasi Ukuran
      </div>
      
      <div class="text-sm text-blue-800 dark:text-blue-200/80 flex justify-between items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-3 rounded-xl border border-blue-100/50 dark:border-blue-900/30">
        <div class="flex flex-col items-center flex-1">
          <span class="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">Lebih kecil</span>
          <b class="text-blue-900 dark:text-blue-200 text-base">${rec.down}</b>
        </div>
        <div class="w-px h-8 bg-blue-200/50 dark:bg-blue-800/50"></div>
        <div class="flex flex-col items-center flex-1">
          <span class="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">Pas (Rekomendasi)</span>
          <b class="text-blue-600 dark:text-blue-400 text-2xl leading-none">${rec.normal}</b>
        </div>
        <div class="w-px h-8 bg-blue-200/50 dark:bg-blue-800/50"></div>
        <div class="flex flex-col items-center flex-1">
          <span class="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">Lebih longgar</span>
          <b class="text-blue-900 dark:text-blue-200 text-base">${rec.up}</b>
        </div>
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
      <div class="leading-relaxed">${warning}</div>
    </div>
    `;
}