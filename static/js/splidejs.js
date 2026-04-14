document.addEventListener('DOMContentLoaded', function () {
  const splide = new Splide('#hero-slider', {
    type   : 'loop',
    drag   : 'free',
    focus  : 'center',
    perPage: 1,
    arrows : false,
    pagination: true,
    autoScroll: {
      speed: 1,
    },
  });
  splide.mount(window.splide.Extensions);
            
  const imageInput = document.getElementById('imageInput');
  const submitBtn = document.getElementById('submitBtn');
  const fileNameDisplay = document.getElementById('file-name');
  const resultDisplay = document.getElementById('result');
            
  imageInput.addEventListener('change', function(e) {
    if (this.files && this.files.length > 0) {
      submitBtn.classList.remove('hidden');
      fileNameDisplay.textContent = 'File terpilih: ' + this.files[0].name;
      resultDisplay.classList.add('hidden'); // hide previous results
    } else {
      submitBtn.classList.add('hidden');
      fileNameDisplay.textContent = '';
    }
  });

  const uploadForm = document.getElementById('uploadForm');
  if(uploadForm) {
    uploadForm.addEventListener('submit', function() {
      resultDisplay.classList.remove('hidden');
      resultDisplay.textContent = "Sedang memproses..."; // Optional loading text
    });
  }
            
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        if (resultDisplay.textContent.trim().length > 0) {
          resultDisplay.classList.remove('hidden');
        }
      }
    });
  });
  observer.observe(resultDisplay, { characterData: true, childList: true, subtree: true });
});