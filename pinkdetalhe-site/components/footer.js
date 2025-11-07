/* =======================================
   Arquivo: components/footer.js
   Definição do Web Component <custom-footer>
   ======================================= */

class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="bg-deep-rose text-white py-12">
        <div class="container mx-auto px-4 max-w-7xl">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/20 pb-8 mb-8">
            
            <div>
              <img src="img/logo.png" alt="Logo PinkDetalhe" class="h-12 w-auto mb-3 opacity-90 filter brightness-200">
              <p class="text-sm text-white/80">
                Adesivos de unha premium com durabilidade profissional.
                Elegância e praticidade em suas mãos.
              </p>
            </div>
            
            <div>
              <h4 class="font-bold text-lg mb-4">Navegação</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="text-white/80 hover:text-pink-premium transition-colors">Nossa Coleção</a></li>
                <li><a href="#oferta" class="text-white/80 hover:text-pink-premium transition-colors">Ofertas Especiais</a></li>
                <li><a href="#beneficios" class="text-white/80 hover:text-pink-premium transition-colors">Por que escolher PinkDetalhe?</a></li>
                <li><a href="#faq" class="text-white/80 hover:text-pink-premium transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 class="font-bold text-lg mb-4">Ajuda & Suporte</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="text-white/80 hover:text-pink-premium transition-colors">Rastrear Pedido</a></li>
                <li><a href="#" class="text-white/80 hover:text-pink-premium transition-colors">Política de Devolução</a></li>
                <li><a href="#" class="text-white/80 hover:text-pink-premium transition-colors">Termos de Serviço</a></li>
                <li><a href="#" class="text-white/80 hover:text-pink-premium transition-colors">Entre em Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 class="font-bold text-lg mb-4">Conecte-se</h4>
              <p class="text-sm text-white/80 mb-4">Siga-nos nas redes sociais para novidades e inspirações de nail art.</p>
              <div class="flex space-x-4">
                  <a href="#" class="text-white hover:text-pink-premium transition-colors" aria-label="Instagram"><i data-feather="instagram" class="w-6 h-6"></i></a>
                  <a href="#" class="text-white hover:text-pink-premium transition-colors" aria-label="Facebook"><i data-feather="facebook" class="w-6 h-6"></i></a>
                  <a href="#" class="text-white hover:text-pink-premium transition-colors" aria-label="Pinterest"><i data-feather="send" class="w-6 h-6"></i></a>
              </div>
            </div>

          </div>

          <div class="text-center">
            <p class="text-sm text-white/60">&copy; ${new Date().getFullYear()} PinkDetalhe. Todos os direitos reservados. | CNPJ: 00.000.000/0001-00</p>
          </div>
        </div>
      </footer>
    `;
  }
}

// Define o novo elemento personalizado
customElements.define('custom-footer', CustomFooter);