import fetch from 'node-fetch';

export default async function handler(req, res) {
  const token = process.env.TRIBO_TOKEN;
  const response = await fetch("http://api.tribopay.com.br/api/public/cash/deposits/pix", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.status(200).json(data);
}
