import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendQuoteNotification(quote) {
  if (!RESEND_API_KEY) {
    console.log('⚠️ RESEND_API_KEY não configurada');
    return;
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 650px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 30px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: 600; color: #ea580c; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #fed7aa; }
        .field { margin-bottom: 12px; padding: 14px; background: #fafafa; border-radius: 8px; border-left: 3px solid #ea580c; }
        .label { font-weight: 600; color: #374151; margin-bottom: 4px; font-size: 13px; }
        .value { color: #1f2937; font-size: 15px; }
        .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏗️ Novo Pedido de Orçamento</h1>
          <p>Recebeu um novo pedido através do website IBERHIT</p>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">📋 Dados do Cliente</div>
            <div class="field">
              <div class="label">Nome</div>
              <div class="value">${quote.nome}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value">${quote.email}</div>
            </div>
            <div class="field">
              <div class="label">Telemóvel</div>
              <div class="value">${quote.telemovel}</div>
            </div>
            <div class="field">
              <div class="label">Localização</div>
              <div class="value">${quote.localizacao}</div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">🏗️ Detalhes do Projeto</div>
            <div class="field">
              <div class="label">Tipo de Imóvel</div>
              <div class="value">${quote.tipo_imovel}</div>
            </div>
            <div class="field">
              <div class="label">Área</div>
              <div class="value">${quote.area} m²</div>
            </div>
            <div class="field">
              <div class="label">Tipo de Pavimento</div>
              <div class="value">${quote.tipo_pavimento}</div>
            </div>
          </div>
          ${quote.planta_url ? `
          <div class="section">
            <div class="section-title">📎 Planta</div>
            <div class="field">
              <a href="${quote.planta_url}" target="_blank" style="color: #ea580c;">Descarregar Planta</a>
            </div>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p><strong>IBERHIT - Soluções em Piso Radiante Elétrico</strong></p>
          <p>ID: ${quote.id}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'IBERHIT <noreply@iberhit.com>',
        to: ['info@iberhit.com'],
        subject: `🏗️ Novo Pedido de Orçamento - ${quote.nome}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar email');
    }

    console.log('✅ Email de notificação enviado');
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    throw new Error('Erro ao enviar email de notificação');
  }
}

export async function sendQuoteToClient(quote, valor, observacoes) {
  if (!RESEND_API_KEY) {
    console.log('⚠️ RESEND_API_KEY não configurada');
    return;
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; }
        .value-box { background: #f97316; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .value-amount { font-size: 36px; font-weight: bold; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Orçamento Iberhit</h1>
          <p style="margin: 10px 0 0 0;">Piso Radiante Elétrico</p>
        </div>
        <div class="content">
          <p>Exmo(a). Sr(a). <strong>${quote.nome}</strong>,</p>
          <p>É com muito gosto que apresentamos o orçamento solicitado.</p>
          <div class="value-box">
            <div style="font-size: 14px; margin-bottom: 10px;">Valor do Orçamento</div>
            <div class="value-amount">€${parseFloat(valor).toFixed(2)}</div>
            <div style="font-size: 12px; margin-top: 10px;">IVA incluído</div>
          </div>
          ${observacoes ? `
            <div style="margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
              <h4 style="margin-top: 0;">Observações</h4>
              <p style="white-space: pre-wrap;">${observacoes}</p>
            </div>
          ` : ''}
          <p style="margin-top: 30px;">Para aceitar este orçamento ou esclarecer dúvidas, contacte-nos:</p>
          <p style="text-align: center;">
            <a href="mailto:info@iberhit.com" style="display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Responder ao Orçamento</a>
          </p>
        </div>
        <div class="footer">
          <p><strong>Iberhit - Aquecimento Elétrico</strong></p>
          <p>Email: info@iberhit.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Iberhit <noreply@iberhit.com>',
        to: [quote.email],
        subject: `Orçamento Iberhit - Ref. ${quote.id.substring(0, 8).toUpperCase()}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar email');
    }

    console.log('✅ Orçamento enviado para cliente');
  } catch (error) {
    console.error('❌ Erro ao enviar orçamento:', error);
    throw error;
  }
}