
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SECRET_KEY = process.env.NIVUS_PAY_SECRET_KEY || 'ba4559db-f9e1-49c3-824b-55c0f2f49791';
  const API_BASE_URL = 'https://pay.nivuspay.com.br/api/v1';

  try {
    // Garante que o body seja objeto
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        console.error('[create-card-token] Body JSON parse error:', e, payload);
        return res.status(400).json({ error: 'Body inválido (não é JSON)' });
      }
    }
    console.log('[create-card-token] Payload recebido:', payload);
    const response = await axios.post(
      `${API_BASE_URL}/transaction.createCardToken`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': SECRET_KEY,
        },
        timeout: 30000,
      }
    );
    console.log('[create-card-token] Resposta Nivus:', response.data);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('[create-card-token] Erro:', error?.response?.data || error);
    return res.status(500).json({
      error: error?.response?.data?.message || error?.message || 'Erro ao criar token',
      nivusError: error?.response?.data || null,
    });
  }
}
