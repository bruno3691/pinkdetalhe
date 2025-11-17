import fetch from 'node-fetch';

export default async function handler(req, res) {
  const token = process.env.TRIBO_TOKEN;
  const { id } = req.query;

  const response = await fetch(`http://api.tribopay.com.br/api/public/cash/deposits/${id}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await response.json();
  res.status(200).json(data);
}
