// Importa as ferramentas do Node.js para lidar com arquivos
import fs from 'fs/promises';
import path from 'path';

// Encontra o caminho para o nosso "banco de dados" JSON
const dbPath = path.resolve(process.cwd(), 'data', 'products.json');

// Função para ler os produtos do arquivo
async function getProducts() {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') { // Se o arquivo não existir
            return [];
        }
        throw error;
    }
}

// Função para salvar os produtos no arquivo
async function saveProducts(products) {
    const dir = path.dirname(dbPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(products, null, 2), 'utf8');
}

// Esta é a função principal que a Vercel vai executar
export default async function handler(req, res) {
    // Permite que seu site (Frontend) acesse este backend (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // --- 1. GET (Buscar todos os produtos) ---
        if (req.method === 'GET') {
            const products = await getProducts();
            res.status(200).json(products);
        }
        
        // --- 2. POST (Adicionar novo produto) ---
        else if (req.method === 'POST') {
            // AGORA SÓ RECEBEMOS TEXTO (LEVE)
            const newProduct = req.body;
            const products = await getProducts();
            
            newProduct.id = Date.now() + Math.floor(Math.random() * 100);
            
            products.push(newProduct);
            await saveProducts(products);
            res.status(201).json(newProduct); // 201 = Criado
        }
        
        // --- 3. PUT (Editar um produto) ---
        else if (req.method === 'PUT') {
            const idToEdit = parseInt(req.query.id, 10);
            const updatedProductData = req.body; // Só texto (leve)
            let products = await getProducts();
            
            const productIndex = products.findIndex(p => p.id === idToEdit);
            if (productIndex === -1) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            
            products[productIndex] = { ...products[productIndex], ...updatedProductData, id: idToEdit };
            await saveProducts(products);
            res.status(200).json(products[productIndex]);
        }
        
        // --- 4. DELETE (Deletar um produto) ---
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
        
        else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Método ${req.method} Não Permitido`);
        }
        
    } catch (error) {
        console.error("ERRO CRÍTICO NO BACKEND:", error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}