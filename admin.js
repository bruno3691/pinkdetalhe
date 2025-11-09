// Inicializa os ícones Feather
feather.replace();

// --- VARIÁVEIS DO DOM ---
const adminPanel = document.getElementById('adminPanel');
const adminLogin = document.getElementById('adminLogin');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const navLinks = document.querySelectorAll('.nav-link[data-section]');
const contentSections = document.querySelectorAll('.content-section');

// Variáveis do formulário de Produto
const imageUpload = document.getElementById('product-image-upload');
const imagePreview = document.getElementById('image-preview');
const previewText = document.getElementById('preview-text');
const addProductBtn = document.getElementById('add-product-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const productsTableBody = document.getElementById('products-table-body');
const productCategorySelect = document.getElementById('product-category'); // Categoria select

// Variáveis do Dashboard
const productCountEl = document.getElementById('dashboard-product-count');
const activityListEl = document.getElementById('dashboard-activity');

// Variáveis de Configurações
const saveSettingsBtn = document.getElementById('save-settings-btn');
const colorPrimaryInput = document.getElementById('setting-color-primary');
const colorDarkInput = document.getElementById('setting-color-dark');
const colorBgInput = document.getElementById('setting-color-bg');
const colorTextInput = document.getElementById('setting-color-text');
const fontSelect = document.getElementById('setting-font');
const logoUploadInput = document.getElementById('setting-logo-upload'); 
const logoPreview = document.getElementById('logo-preview'); 
const logoSizeSlider = document.getElementById('setting-logo-size'); 
const logoSizeValue = document.getElementById('logo-size-value'); 

// Variáveis de Controle de Estado
let currentEditingId = null; 

// --- CONSTANTES ---
const ADMIN_PASSWORD = 'wepink123'; 
const DEFAULT_IMAGE_URL = "http://static.photos/pink/320x240/default"; 

function loginAdmin(password) {
    return password === ADMIN_PASSWORD;
}

function showPanel() {
    adminLogin.style.display = 'none';
    adminPanel.style.display = 'flex';
    localStorage.setItem('adminLoggedIn', 'true');
    loadProductsToAdminTable(); 
    updateDashboard();
    loadSettingsToForm();
}

function showLogin() {
    adminPanel.style.display = 'none';
    adminLogin.style.display = 'flex';
    localStorage.removeItem('adminLoggedIn');
}

// --- FUNÇÕES DE PRODUTO (API) ---

async function getProductsFromApi() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao buscar produtos:", error);
        return [];
    }
}

// --- FUNÇÕES DE CONFIGURAÇÃO (Mantidas no localStorage) ---
function getSettings() {
    const settingsJSON = localStorage.getItem('wipinkSettings');
    return settingsJSON ? JSON.parse(settingsJSON) : {};
}

function saveSettings(settings) {
    localStorage.setItem('wipinkSettings', JSON.stringify(settings));
    applySettingsToDOM(settings);
}

function loadSettingsToForm() {
    const settings = getSettings();
    colorPrimaryInput.value = settings.primaryColor || '#FF0092';
    colorDarkInput.value = settings.darkColor || '#C90076';
    colorBgInput.value = settings.bgColor || '#FFFFFF';
    colorTextInput.value = settings.textColor || '#222222';
    fontSelect.value = settings.font || 'system';
    const cardStyle = settings.cardStyle || 'shadow';
    document.querySelector(`input[name="cardStyle"][value="${cardStyle}"]`).checked = true;
    if (settings.logoUrl) logoPreview.src = settings.logoUrl;
    else logoPreview.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    const size = settings.logoSize || '40';
    logoSizeSlider.value = size;
    logoSizeValue.textContent = `${size} px`;
}

function applySettingsToDOM(settings) {
     const root = document.documentElement;
     if (settings.primaryColor) root.style.setProperty('--wepink-pink', settings.primaryColor);
     if (settings.darkColor) root.style.setProperty('--wepink-pink-dark', settings.darkColor);
     if (settings.bgColor) root.style.setProperty('--wepink-bg', settings.bgColor);
     if (settings.textColor) root.style.setProperty('--wepink-text', settings.textColor);
     let fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
     if (settings.font === 'roboto') fontFamily = "'Roboto', sans-serif";
     else if (settings.font === 'montserrat') fontFamily = "'Montserrat', sans-serif";
     else if (settings.font === 'opensans') fontFamily = "'Open Sans', sans-serif";
     root.style.setProperty('--wepink-font-family', fontFamily);
}

// --- FUNÇÕES DE ATUALIZAÇÃO (DASHBOARD, TABELA) ---

async function updateDashboard() {
    const products = await getProductsFromApi();
    productCountEl.textContent = products.length;

    if (products.length > 0) {
        activityListEl.innerHTML = '';
        products.slice(-3).reverse().forEach(product => {
            activityListEl.innerHTML += `<li style="border-bottom: 1px solid var(--wepink-border); padding: 8px 0; font-size: 14px;">Produto: ${product.name}</li>`;
        });
    } else {
        activityListEl.innerHTML = `<li style="border-bottom: 1px solid var(--wepink-border); padding: 8px 0; font-size: 14px; color: var(--wepink-text-light);">Nenhuma atividade recente.</li>`;
    }
}

async function loadProductsToAdminTable() {
    productsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--wepink-text-light); padding: 20px;">Carregando produtos...</td></tr>';
    
    const products = await getProductsFromApi();
    
    productsTableBody.innerHTML = ''; 
    
    if (products.length === 0) {
        productsTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--wepink-text-light); padding: 20px;">Nenhum produto cadastrado.</td></tr>`;
        return;
    }

    products.forEach(product => {
        const newRow = productsTableBody.insertRow();
        newRow.setAttribute('data-id', product.id); 
        
        newRow.innerHTML = `
            <td style="padding: 10px; border: 1px solid var(--wepink-border);">${product.name}</td>
            <td style="padding: 10px; border: 1px solid var(--wepink-border);">R$ ${product.price}</td>
            <td style="padding: 10px; border: 1px solid var(--wepink-border);">${product.category}</td>
            <td style="padding: 10px; text-align: center; border: 1px solid var(--wepink-border);">
                <button class="wepink-btn edit-btn" data-id="${product.id}" style="padding: 5px 10px; font-size: 12px; margin: 0 5px; background-color: #6c757d;">
                    <i data-feather="edit-2" style="width: 14px; height: 14px; margin-right: 3px;"></i> Editar
                </button>
                <button class="wepink-btn delete-btn" data-id="${product.id}" style="padding: 5px 10px; font-size: 12px; margin: 0; background-color: #dc3545;">
                    <i data-feather="trash-2" style="width: 14px; height: 14px; margin-right: 3px;"></i> Deletar
                </button>
            </td>
        `;
    });
    
    feather.replace(); 

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', handleEditProduct);
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteProduct);
    });
}

// --- FUNÇÕES CRUD (AGORA 100% LIVRES DE BASE64 PARA UPLOAD) ---

async function handleDeleteProduct(e) {
    const idToDelete = parseInt(e.currentTarget.dataset.id, 10); 
    if (!confirm('Tem certeza que deseja deletar este produto?')) {
        return;
    }

    try {
        const response = await fetch(`/api/products?id=${idToDelete}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Falha ao deletar produto.');
        }
        
        loadProductsToAdminTable(); 
        updateDashboard(); 
        
        if (currentEditingId === idToDelete) {
             resetForm();
        }
        alert('Produto deletado com sucesso!');
        
    } catch (error) {
        alert(`Erro ao deletar: ${error.message}`);
    }
}

async function handleEditProduct(e) {
    const idToEdit = parseInt(e.currentTarget.dataset.id, 10); 
    const products = await getProductsFromApi();
    const product = products.find(p => p.id === idToEdit); 

    if (!product) {
        alert('Erro: Produto não encontrado!'); 
        resetForm(); 
        return;
    }

    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    productCategorySelect.value = product.category; 
    document.getElementById('product-description').value = product.description;
    
    // Mostra o URL da imagem, pois não conseguimos fazer upload seguro de arquivos
    imagePreview.src = product.image; 
    previewText.textContent = `Imagem: URL (Upload de arquivo local desativado)`;
    
    addProductBtn.innerHTML = '<i data-feather="refresh-cw" style="width: 18px; height: 18px; margin-right: 5px;"></i> Salvar Edição';
    addProductBtn.style.backgroundColor = 'var(--wepink-pink-dark)'; 
    cancelEditBtn.style.display = 'inline-flex';
    
    currentEditingId = idToEdit;
    feather.replace(); 
    
    document.querySelector('.nav-link[data-section="products"]').click();
    document.querySelector('.content-section#products').style.display = 'block'; 
}

async function saveOrUpdateProduct() {
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const category = productCategorySelect.value;
    const description = document.getElementById('product-description').value;
    // Ignoramos imageFile para novos produtos, pois sabemos que falhará na Vercel
    // const imageFile = imageUpload.files[0];

    if (!name || !price) {
        alert('Por favor, preencha o Nome e o Preço!');
        return;
    }
    
    addProductBtn.disabled = true;
    addProductBtn.innerHTML = '<i data-feather="loader" class="feather-spin"></i> Salvando...';
    feather.replace();

    let finalImageUrl = DEFAULT_IMAGE_URL;

    // Se for edição, tentamos manter o URL de imagem atual.
    if (currentEditingId !== null) {
        const products = await getProductsFromApi();
        const product = products.find(p => p.id === currentEditingId);
        if (product) {
            finalImageUrl = product.image;
        }
    }

    try {
        let response;
        const productData = {
            name: name,
            price: price,
            category: category,
            description: description,
            image: finalImageUrl // Sempre envia o URL leve ou o URL anterior
        };
        
        if (currentEditingId !== null) {
            // --- EDIÇÃO (PUT) ---
            response = await fetch(`/api/products?id=${currentEditingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (!response.ok) throw new Error('Falha ao atualizar produto.');
            alert(`Produto "${name}" editado com sucesso!`);
            
        } else {
            // --- NOVA ADIÇÃO (POST) ---
            response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (!response.ok) throw new Error('Falha ao criar produto.');
            alert(`Produto "${name}" adicionado com sucesso!`);
        }
        
        loadProductsToAdminTable(); 
        updateDashboard(); 
        resetForm();

    } catch (error) {
        alert(`Erro ao salvar: ${error.message}.`);
        resetForm();
    }
}

// Função para limpar o formulário e resetar o botão "Adicionar"
function resetForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-description').value = '';
    productCategorySelect.value = 'Adesivos Natalinos'; 
    imageUpload.value = ''; 
    
    imagePreview.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    previewText.textContent = "Pré-visualização da imagem (máx. 150px)";
    
    addProductBtn.innerHTML = '<i data-feather="save" style="width: 18px; height: 18px; margin-right: 5px;"></i> Adicionar Produto';
    addProductBtn.style.backgroundColor = 'var(--wepink-pink)';
    addProductBtn.disabled = false;
    cancelEditBtn.style.display = 'none'; 
    
    currentEditingId = null; 
    feather.replace();
}

// --- EVENT LISTENERS GERAIS ---
document.addEventListener('DOMContentLoaded', function() {
    
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showPanel();
    } else {
        showLogin();
    }
    
    loginButton.addEventListener('click', function() {
        const password = document.getElementById('adminPassword').value;
        if (loginAdmin(password)) {
            showPanel();
        } else {
            alert('Senha incorreta!');
            document.getElementById('adminPassword').value = ''; 
        }
    });
    
    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        showLogin();
        resetForm(); 
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.style.display = 'none');
            
            this.classList.add('active');
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
            
            if (targetId === 'products') {
                resetForm();
            }
            if (targetId === 'dashboard') {
                updateDashboard();
            }
            if (targetId === 'settings') {
                loadSettingsToForm();
            }
        });
    });
    
    document.querySelector('.nav-link[data-section="dashboard"]').click();
    
    // --- LÓGICA DE PRODUTO ---
    if (imageUpload) {
        // A pré-visualização continua funcionando localmente, mas a imagem não é enviada
        imageUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    previewText.textContent = file.name;
                };
                reader.readAsDataURL(file);
            } else {
                if (currentEditingId === null) {
                     imagePreview.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                     previewText.textContent = "Pré-visualização da imagem (máx. 150px)";
                }
            }
        });
    }

    if (addProductBtn) {
        addProductBtn.addEventListener('click', saveOrUpdateProduct);
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', resetForm);
    }
    
    // --- LÓGICA DE CONFIGURAÇÕES (ATUALIZADA) ---
    if (logoUploadInput) {
        logoUploadInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    logoPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (logoSizeSlider) {
        logoSizeSlider.addEventListener('input', function() {
            const size = this.value;
            logoSizeValue.textContent = `${size} px`;
            logoPreview.style.height = `${size}px`;
        });
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            
            const settings = {
                primaryColor: colorPrimaryInput.value,
                darkColor: colorDarkInput.value,
                bgColor: colorBgInput.value,
                textColor: colorTextInput.value,
                font: fontSelect.value,
                cardStyle: document.querySelector('input[name="cardStyle"]:checked').value,
                logoUrl: getSettings().logoUrl, 
                logoSize: logoSizeSlider.value 
            };
            
            const logoFile = logoUploadInput.files[0];

            if (logoFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    settings.logoUrl = e.target.result;
                    saveSettings(settings);
                    logoUploadInput.value = '';
                    alert('Aparência e nova logo salvas! O site e o painel foram atualizados.');
                };
                reader.readAsDataURL(logoFile);
            } else {
                saveSettings(settings);
                alert('Aparência salva! O site e o painel foram atualizados.');
            }
        });
    }
});

// Adiciona classe de 'girar' para o ícone de 'loader'
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .feather-spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(styleSheet);
