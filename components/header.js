/* =======================================
   Arquivo: components/header.js
   Definição do Web Component <custom-header>
   Logo Grande e Centralizada (Não Sticky)
   ======================================= */

class CustomHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="bg-white shadow-lg top-0 z-50 border-b border-light-blush">
        <div class="w-full px-4 py-4 sm:py-6 md:py-8">
          <div class="max-w-7xl mx-auto">
            <!-- Logo Grande e Centralizada -->
            <div class="flex justify-center mb-4 sm:mb-6">
              <a href="/" class="transition-transform hover:scale-105 duration-300">
                <img src="img/logo.png" 
                     onerror="this.onerror=null; this.src='https://placehold.co/300x150/FF69B4/FFFFFF?text=PinkDetalhe';" 
                     alt="Logo PinkDetalhe - Adesivos de Unhas Premium" 
                     class="h-20 sm:h-24 md:h-32 w-auto object-contain drop-shadow-md"> 
              </a>
            </div>

            <!-- Menu de Navegação -->
            <nav class="hidden md:flex items-center justify-center space-x-8">
              <a href="#hero-carousel" class="text-gray-700 hover:text-deep-rose text-base font-medium transition-colors border-b-2 border-transparent hover:border-deep-rose pb-1">Início</a>
              <a href="#galeria" class="text-gray-700 hover:text-deep-rose text-base font-medium transition-colors border-b-2 border-transparent hover:border-deep-rose pb-1">Galeria</a>
              <a href="#oferta" class="text-gray-700 hover:text-deep-rose text-base font-medium transition-colors border-b-2 border-transparent hover:border-deep-rose pb-1">Oferta</a>
              <a href="#oferta" class="text-base font-bold text-white bg-pink-premium hover:bg-deep-rose py-2 px-6 rounded-full shadow-md transition-colors hover:shadow-lg">
                Comprar Agora
              </a>
            </nav>

            <!-- Menu Mobile -->
            <div class="md:hidden flex justify-center">
              <button class="text-gray-700 hover:text-deep-rose" aria-label="Abrir menu" id="mobile-menu-btn">
                <i data-feather="menu" class="w-7 h-7"></i>
              </button>
            </div>

            <!-- Menu Mobile Expandido -->
            <nav id="mobile-menu" class="hidden md:hidden mt-4 space-y-2 text-center">
              <a href="#hero-carousel" class="block text-gray-700 hover:text-deep-rose font-medium py-2 transition-colors">Início</a>
              <a href="#galeria" class="block text-gray-700 hover:text-deep-rose font-medium py-2 transition-colors">Galeria</a>
              <a href="#oferta" class="block text-gray-700 hover:text-deep-rose font-medium py-2 transition-colors">Oferta</a>
              <a href="#oferta" class="block text-white bg-pink-premium hover:bg-deep-rose font-bold py-2 px-6 rounded-full shadow-md transition-colors hover:shadow-lg mx-auto w-fit">
                Comprar Agora
              </a>
            </nav>
          </div>
        </div>
      </header>

      <script>
        // Menu Mobile Toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn) {
          mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
          });

          // Fechar menu ao clicar em um link
          mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
              mobileMenu.classList.add('hidden');
            });
          });
        }
      </script>
    `;

    // Reinicializar Feather Icons após inserir o HTML
    if (typeof feather !== 'undefined') {
      setTimeout(() => feather.replace(), 100);
    }
  }
}

// Define o novo elemento personalizado
customElements.define('custom-header', CustomHeader);