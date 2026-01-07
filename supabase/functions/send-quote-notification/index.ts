import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { quoteData, quoteId } = await req.json();

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
          .header p { margin: 0; font-size: 16px; opacity: 0.95; }
          .content { padding: 40px 30px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: 600; color: #ea580c; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #fed7aa; }
          .field { margin-bottom: 12px; padding: 14px; background: #fafafa; border-radius: 8px; border-left: 3px solid #ea580c; }
          .label { font-weight: 600; color: #374151; margin-bottom: 4px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
          .value { color: #1f2937; font-size: 15px; }
          .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer p { margin: 5px 0; color: #6b7280; font-size: 13px; }
          .quote-id { background: #fef3c7; color: #92400e; padding: 12px 20px; border-radius: 8px; display: inline-block; margin-top: 20px; font-weight: 600; }
          .file-link { display: inline-block; margin-top: 8px; padding: 10px 20px; background: #ea580c; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
          .file-link:hover { background: #c2410c; }
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
                <div class="label">👤 Nome Completo</div>
                <div class="value">${quoteData.nome}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email</div>
                <div class="value">${quoteData.email}</div>
              </div>
              <div class="field">
                <div class="label">📱 Telemóvel</div>
                <div class="value">${quoteData.telemovel}</div>
              </div>
              <div class="field">
                <div class="label">📍 Localização da Obra</div>
                <div class="value">${quoteData.localizacao}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">🏗️ Detalhes do Projeto</div>
              <div class="field">
                <div class="label">Tipo de Projeto</div>
                <div class="value">${quoteData.tipo_obra}</div>
              </div>
              <div class="field">
                <div class="label">Tipo de Imóvel</div>
                <div class="value">${quoteData.tipo_imovel}</div>
              </div>
              <div class="field">
                <div class="label">📏 Área Aproximada</div>
                <div class="value">${quoteData.area} m²</div>
              </div>
              <div class="field">
                <div class="label">🏗️ Tipo de Pavimento Final</div>
                <div class="value">${quoteData.tipo_pavimento}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">🏠 Características do Imóvel</div>
              <div class="field">
                <div class="label">🏢 Último Piso</div>
                <div class="value">${quoteData.piso_localizacao}</div>
              </div>
              <div class="field">
                <div class="label">💧 Zona Húmida</div>
                <div class="value">${quoteData.zona_humida}</div>
              </div>
              <div class="field">
                <div class="label">☀️ Exposição Solar</div>
                <div class="value">${quoteData.exposicao_solar}</div>
              </div>
              <div class="field">
                <div class="label">🪟 Vidros Duplos</div>
                <div class="value">${quoteData.vidros_duplos}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">📐 Planta do Projeto</div>
              <div class="field">
                <div class="label">Possui Planta</div>
                <div class="value">${quoteData.possui_planta}</div>
              </div>
              ${quoteData.planta_url ? `
              <div class="field">
                <div class="label">📎 Arquivo Anexado</div>
                <div class="value">
                  <a href="${quoteData.planta_url}" target="_blank" class="file-link">
                    📥 Descarregar Planta
                  </a>
                </div>
              </div>
              ` : ''}
            </div>

            ${quoteData.observacoes ? `
            <div class="section">
              <div class="section-title">💬 Observações</div>
              <div class="field">
                <div class="value">${quoteData.observacoes}</div>
              </div>
            </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px;">
              <div class="quote-id">ID do Pedido: #${quoteId}</div>
            </div>
          </div>
          <div class="footer">
            <p><strong>IBERHIT - Soluções em Piso Radiante Elétrico</strong></p>
            <p>Este email foi enviado automaticamente pelo sistema de orçamentos</p>
            <p>© ${new Date().getFullYear()} IBERHIT - Todos os direitos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      console.log('RESEND_API_KEY não configurada. Email não enviado.');
      return new Response(
        JSON.stringify({ success: false, message: 'API key não configurada' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'IBERHIT <noreply@iberhit.com>',
        to: ['info@iberhit.com'],
        subject: `🏗️ Novo Pedido de Orçamento - ${quoteData.nome}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
