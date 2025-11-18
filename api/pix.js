export default async function handler(req, res) {
    try {
        const token = process.env.TRIBO_TOKEN;
        if (!token) return res.status(500).json({ error: "TRIBO_TOKEN não configurado" });

        const response = await fetch(
            "http://api.tribopay.com.br/api/public/cash/deposits/pix",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(req.body)
            }
        );

        const data = await response.json();
        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
