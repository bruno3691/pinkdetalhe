// Importa as ferramentas do Node.js para lidar com arquivos
import fs from 'fs/promises';
import path from 'path';

// Encontra o caminho para o nosso "banco de dados" JSON
// process.cwd() é a pasta raiz do seu projeto na Vercel
const astraDbPath = path.resolve(process.cwd(), 'data', 'products.json');

// Função para ler os produtos do arquivo
async function getProducts() {
    try {
        const data = await fs.readFile(astraDbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Se o arquivo não existir (ex: primeiro uso), retorna um array vazio
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

// Função para salvar os produtos no arquivo
async function saveProducts(products) {
    // JSON.stringify(products, null, 2) formata o JSON de forma legível
    await fs.writeFile(astraDbPath, JSON.stringify(products, null, 2), 'utf8');
}

// Esta é a função principal que a Vercel vai executar
export default async function handler(req, res) {
    // Permite que seu site (Frontend) acesse este backend (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Se a requisição for OPTIONS (o navegador checando permissões), apenas responda OK
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // --- 1. SE O MÉTODO FOR GET (Buscar todos os produtos) ---
        if (req.method === 'GET') {
            const products = await getProducts();
            res.status(200).json(products);
        }
        
        // --- 2. SE O MÉTODO FOR POST (Adicionar novo produto) ---
        else if (req.method === 'POST') {
            const newProduct = req.body;
            const products = await getProducts();
            
            // Cria um ID (baseado no timestamp + um número aleatório)
            newProduct.id = Date.now() + Math.floor(Math.random() * 100);
            
            products.push(newProduct);
            await saveProducts(products);
            res.status(201).json(newProduct); // 201 = "Criado com sucesso"
        }
        
        // --- 3. SE O MÉTODO FOR PUT (Editar um produto) ---
        else if (req.method === 'PUT') {
            const idToEdit = parseInt(req.query.id, 10);
            const updatedProductData = req.body;
            let products = await getProducts();
            
            const productIndex = products.findIndex(p => p.id === idToEdit);
            if (productIndex === -1) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            
            // Atualiza o produto na lista
            products[productIndex] = { ...products[productIndex], ...updatedProductData, id: idToEdit };
            await saveProducts(products);
            res.status(200).json(products[productIndex]);
        }
        
        // --- 4. SE O MÉTODO FOR DELETE (Deletar um produto) ---
        else if (req.method === 'DELETE') {
            const idToDelete = parseInt(req.query.id, 10);
            let products = await getProducts();
            
            const filteredProducts = products.filter(p => p.id !== idToDelete);
            
            if (products.length === filteredProducts.length) {
                return res.status(404).json({ message: 'Produto não encontrado para deletar' });
            }
            
            await saveProducts(filteredProducts);
            res.status(200).json({ message: 'Produto deletado com sucesso' });
        }
        
        // Se for qualquer outro método (ex: PATCH), retorna erro
        else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Método ${req.method} Não Permitido`);
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}