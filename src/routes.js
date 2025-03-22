const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.post('/create-pix', async (req, res) => {
  const { amount, cpf } = req.body;

  // Montar o payload
  const payload = {
    paymentMethod: 'pix',
    customer: {
      document: {
        type: 'cpf',
        number: cpf || '12345678909',
      },
      name: 'equatorial',
      email: 'teste@teste.com.br',
      phone: '11999999999',
    },
    amount: parseInt(amount) || 137,
    pix: {
      expiresInDays: 1,
    },
    items: [
      {
        title: 'equatorial',
        unitPrice: parseInt(amount) || 137,
        quantity: 1,
        tangible: false,
      },
    ],
    metadata: 'Pagamento Equatorial via PIX',
  };

  // Codificar a chave secreta em Base64 para autenticação Basic
  const authString = `${process.env.INPAGAMENTOS_API_KEY}:x`;
  const authBase64 = Buffer.from(authString).toString('base64');
  const authHeader = `Basic ${authBase64}`;

  try {
    const response = await axios({
      method: 'POST',
      url: process.env.INPAGAMENTOS_API_URL,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authHeader, // Usar Basic Authentication
      },
      data: payload,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao criar transação PIX:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao criar transação PIX', details: error.response?.data });
  }
});

module.exports = router;