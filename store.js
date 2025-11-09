// Inicializa os ícones Feather.js
feather.replace();

// --- VARIÁVEIS GLOBAIS ---
const productsGrid = document.getElementById('productsGrid');
const categoryTabsContainer = document.getElementById('category-tabs-container');

// A lista de categorias que você forneceu.
const categories = [
    "Todos", "Adesivos Natalinos", "Novidades 2025", "Fitilhos", "Glitter",
    "Modelos Exclusivos", "Adesivos Flores", "Adesivos Variados",
    "Coração Estrela e Lua", "Raminhos e Folhas"
];

// --- FUNÇÕES DE PRODUTO ---

// MUDANÇA: Agora busca da API, não do localStorage
async function getProducts() {
    try {
        // Faz uma chamada de rede para o nosso backend
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Falha ao buscar produtos:", error);
        return []; // Retorna vazio se a API falhar
    }
}

// Helper para criar o card de produto (sem alteração)
function createProductCard(product) {
    const imageUrl = product.image || 'http://static.photos/pink/320x240/default'; 
    
    return `
        <div class="product-card">
            <img src="${imageUrl}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description || product.category}</p>
                <p class="product-price">R$ ${product.price}</p>
                <button class="wipink-button">Comprar Agora</button>
            </div>
        </div>
    `;
}

// Função para renderizar os produtos na página principal (AGORA ASYNC)
async function renderProducts(filterCategory = 'Todos') {
    // 1. Busca os produtos da API
    const products = await getProducts();
    productsGrid.innerHTML = ''; // Limpa o grid

    // 2. Filtrar os produtos
    const filteredProducts = (filterCategory === 'Todos') 
        ? products 
        : products.filter(p => p.category === filterCategory);

    // 3. Renderizar os produtos filtrados
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--wepink-text-light);">
                <p style="font-size: 18px; font-weight: 500;">Nenhum produto encontrado nesta categoria.</p>
            </div>
        `;
        return; 
    }

    filteredProducts.forEach(product => {
        productsGrid.innerHTML += createProductCard(product);
    });
}

// --- FUNÇÕES DE CATEGORIA (NOVO) ---

// Cria as abas de categoria
function renderCategoryTabs() {
    categoryTabsContainer.innerHTML = ''; // Limpa as abas
    
    categories.forEach((category, index) => {
        const tabButton = document.createElement('button');
        tabButton.classList.add('category-tab');
        tabButton.textContent = category;
        tabButton.dataset.category = category; // Armazena a categoria no botão
        
        if (index === 0) {
            tabButton.classList.add('active');
        }
        
        // Adiciona o evento de clique para filtrar
        tabButton.addEventListener('click', () => {
            document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
            tabButton.classList.add('active');
            
            // Renderiza os produtos com o filtro da categoria
            renderProducts(category);
        });
        
        categoryTabsContainer.appendChild(tabButton);
    });
}

// --- ATUALIZAÇÃO EM TEMPO REAL ---
// (Removido o 'storage' listener, pois agora o usuário precisa
// recarregar a página para ver mudanças feitas no admin,
// ou poderíamos implementar uma lógica mais complexa de "polling")
// Por enquanto, a atualização é manual (recarregando a página).

// Inicializa a renderização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    renderCategoryTabs(); // Cria as abas
    renderProducts('Todos'); // Carrega todos os produtos por padrão
});