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
    const { clientEmail, clientName, quoteId } = await req.json();

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.8; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 600; }
          .header p { margin: 0; font-size: 15px; opacity: 0.95; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 16px; color: #1f2937; margin-bottom: 25px; }
          .message { font-size: 15px; color: #4b5563; line-height: 1.8; margin-bottom: 20px; }
          .highlight-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0; }
          .highlight-box p { margin: 0; color: #92400e; font-size: 15px; line-height: 1.7; }
          .highlight-box strong { color: #78350f; }
          .info-box { background: #f0fdf4; border-radius: 8px; padding: 25px; margin: 25px 0; border-left: 4px solid #16a34a; }
          .info-box p { margin: 0 0 10px 0; color: #166534; font-size: 15px; line-height: 1.7; }
          .info-box p:last-child { margin-bottom: 0; }
          .signature { margin-top: 35px; padding-top: 25px; border-top: 2px solid #e5e7eb; }
          .signature p { margin: 5px 0; color: #4b5563; font-size: 15px; }
          .signature .team { font-weight: 600; color: #1f2937; font-size: 16px; }
          .signature .tagline { font-size: 14px; color: #6b7280; font-style: italic; margin-top: 8px; }
          .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer p { margin: 5px 0; color: #6b7280; font-size: 13px; }
          .footer .company { font-weight: 600; color: #1f2937; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Recebemos o seu pedido</h1>
            <p>Análise técnica em curso</p>
          </div>
          <div class="content">
            <div class="greeting">
              Olá,
            </div>
            
            <div class="message">
              Obrigado pelo seu contacto e pelo envio das informações do seu projeto.
            </div>

            <div class="message">
              Confirmamos que recebemos o seu pedido com sucesso. A nossa equipa técnica já iniciou a análise das informações fornecidas, com o objetivo de preparar uma proposta técnica rigorosa e ajustada às características do seu imóvel.
            </div>

            <div class="message">
              Caso tenha anexado a planta do projeto, esta será integrada na análise para garantir maior precisão no dimensionamento do sistema.
            </div>

            <div class="highlight-box">
              <p><strong>Prazo de resposta:</strong></p>
              <p style="margin-top: 8px;">Receberá a sua proposta técnica em até <strong>48 horas úteis</strong>.</p>
            </div>

            <div class="info-box">
              <p>Se entretanto desejar acrescentar alguma informação relevante ou esclarecer algum ponto, poderá responder diretamente a este email.</p>
            </div>

            <div class="signature">
              <p>Com os melhores cumprimentos,</p>
              <p class="team">Equipa IBERHIT</p>
              <p class="tagline">Soluções técnicas em aquecimento, conforto e eficiência energética</p>
            </div>
          </div>
          <div class="footer">
            <p class="company">IBERHIT</p>
            <p>Quase 50 anos de inovação europeia em aquecimento</p>
            <p style="margin-top: 15px;">© ${new Date().getFullYear()} IBERHIT - Todos os direitos reservados</p>
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
        to: [clientEmail],
        subject: 'Recebemos o seu pedido — análise técnica em curso | IBERHIT',
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