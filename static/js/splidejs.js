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
      
      // Toggle to image preview
      const reader = new FileReader();
      reader.onload = function(evt) {
          document.getElementById('image-preview').src = evt.target.result;
          document.getElementById('hero-slider').classList.add('hidden');
          document.getElementById('image-preview-container').classList.remove('hidden');
      }
      reader.readAsDataURL(this.files[0]);
    } else {
      submitBtn.classList.add('hidden');
      fileNameDisplay.textContent = '';
      
      // Revert back to carousel
      document.getElementById('hero-slider').classList.remove('hidden');
      document.getElementById('image-preview-container').classList.add('hidden');
    }
  });

  const uploadForm = document.getElementById('uploadForm');
  if(uploadForm) {
    uploadForm.addEventListener('submit', function() {
      resultDisplay.classList.remove('hidden');
      resultDisplay.innerHTML = "<em>Sedang memproses analitik citra...</em>";
    });
  }
            
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        if (resultDisplay.innerHTML.trim().length > 0) {
          resultDisplay.classList.remove('hidden');
        }
      }
    });
  });
  observer.observe(resultDisplay, { characterData: true, childList: true, subtree: true });
});