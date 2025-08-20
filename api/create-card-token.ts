import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SECRET_KEY = process.env.NIVUS_PAY_SECRET_KEY || 'ba4559db-f9e1-49c3-824b-55c0f2f49791';
  const API_BASE_URL = 'https://pay.nivuspay.com.br/api/v1';

  try {
    const response = await axios.post(
      `${API_BASE_URL}/transaction.createCardToken`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': SECRET_KEY,
        },
        timeout: 30000,
      }
    );
    return res.status(200).json(response.data);
  } catch (error: any) {
    return res.status(500).json({
      error: error.response?.data?.message || error.message || 'Erro ao criar token',
    });
  }
}
