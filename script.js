document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');

  sections.forEach(section => {
    const images = section.querySelectorAll('.Imagens');
    const verMaisButton = document.getElementById('ver-mais');

    let active = false;
    let initialX;
    let offsetX = 0;
    let userHasChangedOffset = false;

    images.forEach(img => {
      img.addEventListener('mousedown', dragStart);
      img.addEventListener('touchstart', dragStart);

      function dragStart(e) {
        active = true;
        initialX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX - offsetX;
      }

      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag);

      function drag(e) {
        if (!active) return;
        e.preventDefault();
        offsetX = e.type === 'mousemove' ? e.clientX - initialX : e.touches[0].clientX - initialX;

        // restrict movement to horizontal axis
        offsetX = Math.max(-93, Math.min(offsetX, 0)); // 468 - 375 = 93

        img.style.transform = `translateX(${offsetX}px)`;
      }

      document.addEventListener('mouseup', dragEnd);
      document.addEventListener('touchend', dragEnd);

      function dragEnd(e) {
        if (!active) return;
        e.preventDefault();
        active = false;
        userHasChangedOffset = true; // set flag to true when user drags
        checkButtonState();
      }

      // Assuming anchor is the parent element of img
      const anchor = img.parentElement;

      anchor.addEventListener('click', (e) => {
        if (!active) {
          // allow default behavior (navigate to new HTML page)
          return;
        }
        e.preventDefault();
      });
    });

    function verMais() {
      console.log('Ver mais button clicked!');
      images.forEach(img => {
        const currentTransform = img.style.transform;
        let currentOffsetX = 0;
        if (currentTransform) {
          const match = currentTransform.match(/translateX\((\-?\d+)px\)/);
          if (match) {
            currentOffsetX = parseInt(match[1], 10);
          }
        }
        console.log(`Current offset X: ${currentOffsetX}`);
        img.style.transform = `translateX(${currentOffsetX - 93}px)`;
        console.log(`New offset X: ${currentOffsetX - 93}`);
      });

      userHasChangedOffset = true; // set flag to true when verMais is clicked
      checkButtonState(); // check button state after verMais action
    }

    function checkButtonState() {
      const imagesOffsets = Array.from(images).map(img => {
        const currentTransform = img.style.transform;
        let currentOffsetX = 0;
        if (currentTransform) {
          const match = currentTransform.match(/translateX\((\-?\d+)px\)/);
          if (match) {
            currentOffsetX = parseInt(match[1], 10);
          }
        }
        return currentOffsetX;
      });

      // Define a margem de erro permitida para 1 pixel
      const marginOfError = 1;

      // Verifica se todos os offsets são exatamente 0 dentro da margem de erro
      const allOffsetsZero = imagesOffsets.every(offset => Math.abs(offset) <= marginOfError);

      if (allOffsetsZero && userHasChangedOffset) {
        verMaisButton.disabled = false;
      } else {
        verMaisButton.disabled = true;
      }
    }

    verMaisButton.addEventListener('click', (e) => {
      e.preventDefault();
      verMais();
    });

    checkButtonState(); // call the function to check the button state initially
  });
});
