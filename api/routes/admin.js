import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendQuoteToClient } from '../services/email.js';

const router = express.Router();

// Todas as rotas admin requerem autenticação
router.use(authenticateToken);

// Listar todos os orçamentos
router.get('/quotes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM quote_requests ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao listar orçamentos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar orçamentos'
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
        error: 'Orçamento não encontrado'
      });
    }

    // Marcar como visualizado
    await pool.query(
      'UPDATE quote_requests SET visualizado = true, visualizado_em = NOW() WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao obter orçamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter orçamento'
    });
  }
});

// Enviar orçamento para cliente
router.post('/quotes/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, observacoes } = req.body;

    if (!valor) {
      return res.status(400).json({
        success: false,
        error: 'Valor do orçamento é obrigatório'
      });
    }

    // Atualizar orçamento
    const result = await pool.query(
      `UPDATE quote_requests 
       SET orcamento_valor = $1, 
           orcamento_observacoes = $2, 
           orcamento_enviado_em = NOW(),
           status = 'orcamento_enviado'
       WHERE id = $3
       RETURNING *`,
      [valor, observacoes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orçamento não encontrado'
      });
    }

    const quote = result.rows[0];

    // Enviar email para cliente
    await sendQuoteToClient(quote, valor, observacoes);

    res.json({
      success: true,
      message: 'Orçamento enviado com sucesso',
      data: quote
    });
  } catch (error) {
    console.error('Erro ao enviar orçamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao enviar orçamento'
    });
  }
});

// Atualizar status do orçamento
router.patch('/quotes/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pendente', 'em_analise', 'orcamento_enviado', 'aprovado', 'rejeitado'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido'
      });
    }

    const result = await pool.query(
      'UPDATE quote_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orçamento não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar status'
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
        error: 'Orçamento não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Orçamento deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar orçamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar orçamento'
    });
  }
});

export default router;