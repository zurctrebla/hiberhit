import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  try {
    const { quoteId, valor, observacoes } = await req.json();

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: quote, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (error || !quote) {
      throw new Error('Orçamento não encontrado');
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
          .details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Orçamento Iberhit</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Piso Radiante Elétrico</p>
          </div>
          
          <div class="content">
            <p>Exmo(a). Sr(a). <strong>${quote.nome}</strong>,</p>
            
            <p>É com muito gosto que apresentamos o orçamento solicitado para o seu projeto de piso radiante elétrico.</p>
            
            <div class="value-box">
              <div style="font-size: 14px; margin-bottom: 10px;">Valor do Orçamento</div>
              <div class="value-amount">€${valor.toFixed(2)}</div>
              <div style="font-size: 12px; margin-top: 10px; opacity: 0.9;">IVA incluído</div>
            </div>
            
            <div class="details">
              <h3 style="margin-top: 0; color: #f97316;">Detalhes do Projeto</h3>
              <p><strong>Tipo de Projeto:</strong> ${quote.tipo_projeto}</p>
              <p><strong>Área a Aquecer:</strong> ${quote.area_aquecer} m²</p>
              ${observacoes ? `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                  <h4 style="margin-top: 0; color: #333;">Observações e Condições</h4>
                  <p style="white-space: pre-wrap;">${observacoes}</p>
                </div>
              ` : ''}
            </div>
            
            <p>Este orçamento inclui:</p>
            <ul style="color: #555;">
              <li>Sistema de piso radiante elétrico com tecnologia europeia</li>
              <li>Instalação profissional completa</li>
              <li>Garantia do fabricante</li>
              <li>Acompanhamento técnico</li>
            </ul>
            
            <p style="margin-top: 30px;">Para aceitar este orçamento ou esclarecer qualquer dúvida, por favor contacte-nos:</p>
            
            <div style="text-align: center;">
              <a href="mailto:info@iberhit.com" class="button">Responder ao Orçamento</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              <strong>Validade:</strong> Este orçamento é válido por 30 dias a partir da data de emissão.
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 10px 0;"><strong>Iberhit - Aquecimento Elétrico</strong></p>
            <p style="margin: 0;">Email: info@iberhit.com | Telefone: +351 XXX XXX XXX</p>
            <p style="margin: 10px 0 0 0;">Quase 50 anos de inovação europeia em aquecimento</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Iberhit <noreply@iberhit.com>',
        to: [quote.email],
        subject: `Orçamento Iberhit - Ref. ${quoteId.substring(0, 8).toUpperCase()}`,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(`Erro ao enviar email: ${errorText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Erro:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
