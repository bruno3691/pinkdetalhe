import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
    // Permite CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // A Vercel coloca os arquivos da pasta 'public' na raiz do servidor
    // O caminho 'físico' no servidor é 'process.cwd()' (raiz do projeto) + 'public/img'
    const imageDirectory = path.resolve(process.cwd(), 'public', 'img');

    try {
        // 1. Lê todos os arquivos no diretório
        const filenames = await fs.readdir(imageDirectory);
        
        // 2. Filtra para incluir APENAS .png (e outros formatos de imagem se quiser)
        const imageFiles = filenames.filter(name => 
            name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')
        );

        // 3. Retorna a lista de nomes de arquivos
        res.status(200).json(imageFiles);

    } catch (error) {
        console.error("Erro ao ler a pasta /public/img:", error);
        // Se a pasta não existir ou der erro, retorna array vazio
        res.status(500).json({ message: "Erro ao ler a biblioteca de mídia.", error: error.message });
    }
}