import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendQuoteToClient, sendTestEmail } from '../services/email.js';
import { getPrivateFileUrl } from '../services/spaces.js';
import path from 'path';

const router = express.Router();

// Todas as rotas admin requerem autenticação
router.use(authenticateToken);

// Listar todos os orçamentos
router.get('/quotes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM quote_requests ORDER BY created_at DESC'
    );

    // compat: devolve quotes + data
    return res.json({
      success: true,
      quotes: result.rows,
      data: result.rows,
    });
  } catch (error) {
    console.error('Erro ao listar orçamentos:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar orçamentos',
    });
  }
});

// Obter orçamento específico
router.get('/quotes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM quote_requests WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orçamento não encontrado',
      });
    }

    // Marcar como visualizado (não precisa bloquear retorno)
    pool.query(
      'UPDATE quote_requests SET visualizado = true, visualizado_em = NOW() WHERE id = $1',
      [id]
    ).catch((e) => console.error('Falha ao marcar visualizado:', e));

    return res.json({
      success: true,
      quote: result.rows[0],
      data: result.rows[0], // compat
    });
  } catch (error) {
    console.error('Erro ao obter orçamento:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter orçamento',
    });
  }
});

// Atualizar status do orçamento
router.patch('/quotes/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Mantém compat com teu front (pendente/em_analise/enviado)
    // e aceita extras se quiseres usar no futuro
    const validStatuses = ['pendente', 'em_analise', 'enviado', 'aprovado', 'rejeitado'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido',
      });
    }

    const result = await pool.query(
      'UPDATE quote_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orçamento não encontrado',
      });
    }

    return res.json({
      success: true,
      quote: result.rows[0],
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao atualizar status',
    });
  }
});

// Enviar orçamento para cliente (NÃO derruba com 500 se email falhar)
router.post('/quotes/:id/send', async (req, res) => {
  const { id } = req.params;
  const valorRaw = req.body?.valor;
  const observacoes = req.body?.observacoes ?? null;

  // validação
  const valor = Number(valorRaw);
  if (!Number.isFinite(valor) || valor <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Valor do orçamento é obrigatório e deve ser > 0',
    });
  }

  try {
    // 1) grava SEM marcar "enviado" ainda
    const result = await pool.query(
      `UPDATE quote_requests
       SET orcamento_valor = $1,
           orcamento_observacoes = $2
       WHERE id = $3
       RETURNING *`,
      [valor, observacoes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orçamento não encontrado',
      });
    }

    const quote = result.rows[0];

    // 2) tenta enviar email
    let emailSent = false;
    let emailError = null;

    try {
      await sendQuoteToClient(quote, valor, observacoes);
      emailSent = true;

      // 3) só marca enviado se email OK
      const updated = await pool.query(
        `UPDATE quote_requests
         SET orcamento_enviado_em = NOW(),
             status = 'enviado'
         WHERE id = $1
         RETURNING *`,
        [id]
      );
      if (updated.rows[0]) {
        quote.status = updated.rows[0].status;
        quote.orcamento_enviado_em = updated.rows[0].orcamento_enviado_em;
      }
    } catch (e) {
      emailError = e?.message || String(e);
      console.error('❌ Falha ao enviar email do orçamento:', e);
      // NÃO retorna 500
    }

    return res.json({
      success: true,
      message: emailSent
        ? 'Orçamento enviado com sucesso'
        : 'Orçamento gravado, mas falhou o envio do email',
      emailSent,
      emailError,
      quote,
      data: quote, // compat
    });
  } catch (error) {
    console.error('Erro ao enviar orçamento (rota /send):', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao enviar orçamento',
    });
  }
});

// Rota de teste de email (pra validar Resend)
router.post('/test-email', async (req, res) => {
  try {
    const to = String(req.body?.to || '').trim();
    const subject = String(req.body?.subject || 'Teste Resend').trim();
    const text = String(req.body?.text || 'Email de teste').trim();

    if (!to) {
      return res.status(400).json({ success: false, error: 'Campo obrigatório: to' });
    }

    const result = await sendTestEmail({ to, subject, text });

    return res.json({ success: true, result });
  } catch (err) {
    console.error('❌ test-email falhou:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Falha ao enviar email',
    });
  }
});

// Gerar URL temporária para download de planta
router.get('/quotes/:id/planta', async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o orçamento para pegar o planta_path
    const result = await pool.query(
      'SELECT planta_path, planta_url FROM quote_requests WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orçamento não encontrado',
      });
    }

    const { planta_path, planta_url } = result.rows[0];

    if (!planta_path) {
      return res.status(404).json({
        success: false,
        error: 'Este orçamento não possui planta anexada',
      });
    }

    // Verifica se está usando Spaces
    const useSpaces = process.env.DO_SPACES_KEY && process.env.DO_SPACES_SECRET;

    if (useSpaces && planta_path.startsWith('admin/')) {
      // Arquivo no Spaces - gera URL assinada (válida por 1 hora)
      try {
        const downloadUrl = await getPrivateFileUrl(planta_path, 3600);

        return res.json({
          success: true,
          downloadUrl,
          expiresIn: 3600,
          storage: 'spaces',
        });
      } catch (error) {
        console.error('Erro ao gerar URL assinada:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro ao gerar URL de download',
        });
      }
    } else {
      // Arquivo local - retorna URL direta
      if (planta_url) {
        return res.json({
          success: true,
          downloadUrl: planta_url,
          expiresIn: null,
          storage: 'local',
        });
      } else {
        // Gera URL local se não tiver
        const baseUrl =
          process.env.API_URL ||
          `${req.protocol}://${req.get('host')}`;
        const downloadUrl = `${baseUrl}/uploads/${planta_path}`;

        return res.json({
          success: true,
          downloadUrl,
          expiresIn: null,
          storage: 'local',
        });
      }
    }
  } catch (error) {
    console.error('Erro ao obter planta:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter planta',
    });
  }
});

// Deletar orçamento
router.delete('/quotes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM quote_requests WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orçamento não encontrado',
      });
    }

    return res.json({
      success: true,
      message: 'Orçamento deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar orçamento:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao deletar orçamento',
    });
  }
});

export default router;
