import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🚀 Iniciando envio para Holded CRM...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get Holded API Key from secrets
    const { data: secretData, error: secretError } = await supabaseClient
      .from('secrets')
      .select('value')
      .eq('key', 'HOLDED_API_KEY')
      .single();

    if (secretError || !secretData) {
      console.error('❌ Erro ao obter API Key:', secretError);
      throw new Error('Holded API Key not configured');
    }

    const HOLDED_API_KEY = secretData.value;
    console.log('✅ API Key obtida com sucesso');

    const { quoteData } = await req.json();
    console.log('📋 Dados recebidos:', JSON.stringify(quoteData, null, 2));

    // 1. Create or get contact in Holded
    console.log('👤 Procurando contacto no Holded...');
    
    const contactPayload = {
      name: quoteData.name,
      email: quoteData.email,
      mobile: quoteData.phone || '',
      type: 'client',
      tags: ['Website Lead', 'Orçamento']
    };

    let contactId = null;

    // Try to find existing contact by email
    try {
      const searchResponse = await fetch(
        `https://api.holded.com/api/contacts?email=${encodeURIComponent(quoteData.email)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Key': HOLDED_API_KEY
          }
        }
      );

      console.log('🔍 Status da pesquisa de contacto:', searchResponse.status);

      if (searchResponse.ok) {
        const existingContacts = await searchResponse.json();
        console.log('📊 Contactos encontrados:', existingContacts.length);
        
        if (existingContacts && existingContacts.length > 0) {
          contactId = existingContacts[0].id;
          console.log('✅ Contacto existente encontrado:', contactId);
        }
      }
    } catch (searchError) {
      console.error('⚠️ Erro ao pesquisar contacto:', searchError);
    }

    // Create contact if doesn't exist
    if (!contactId) {
      console.log('➕ Criando novo contacto...');
      
      try {
        const createContactResponse = await fetch('https://api.holded.com/api/contacts', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': HOLDED_API_KEY
          },
          body: JSON.stringify(contactPayload)
        });

        console.log('📝 Status da criação de contacto:', createContactResponse.status);
        const responseText = await createContactResponse.text();
        console.log('📄 Resposta da criação:', responseText);

        if (createContactResponse.ok) {
          const newContact = JSON.parse(responseText);
          contactId = newContact.id;
          console.log('✅ Novo contacto criado:', contactId);
        } else {
          console.error('❌ Erro ao criar contacto:', responseText);
        }
      } catch (createError) {
        console.error('❌ Erro ao criar contacto:', createError);
      }
    }

    // 2. Create deal/opportunity in CRM
    console.log('💼 Criando oportunidade no CRM...');
    
    const dealDescription = `
📋 NOVO PEDIDO DE ORÇAMENTO

👤 Cliente: ${quoteData.name}
📧 Email: ${quoteData.email}
📱 Telefone: ${quoteData.phone || 'Não fornecido'}

🏗️ DETALHES DO PROJETO:
• Tipo de Projeto: ${quoteData.projectType}
• Tipo de Imóvel: ${quoteData.propertyType || 'Não especificado'}
• Área: ${quoteData.area || 'Não especificada'}
• Localização: ${quoteData.location || 'Não especificada'}
• Tipo de Pavimento: ${quoteData.floorType || 'Não especificado'}

📍 CARACTERÍSTICAS:
• Piso: ${quoteData.details?.pisoLocalizacao || 'N/A'}
• Zona Húmida: ${quoteData.details?.zonaHumida || 'N/A'}
• Exposição Solar: ${quoteData.details?.exposicaoSolar || 'N/A'}
• Vidros Duplos: ${quoteData.details?.vidrosDuplos || 'N/A'}
• Possui Planta: ${quoteData.details?.possuiPlanta || 'N/A'}

💬 Observações:
${quoteData.message || 'Sem observações adicionais'}

📎 Planta: ${quoteData.blueprintUrl || 'Não enviada'}

📅 Data do pedido: ${new Date().toLocaleString('pt-PT')}
    `.trim();

    const dealPayload = {
      name: `Orçamento - ${quoteData.projectType} - ${quoteData.name}`,
      contactId: contactId,
      status: 'open',
      stage: 'lead',
      value: 0,
      currency: 'EUR',
      description: dealDescription,
      tags: ['Website', 'Orçamento', quoteData.projectType]
    };

    console.log('📦 Payload da oportunidade:', JSON.stringify(dealPayload, null, 2));

    let dealResult = null;
    try {
      const createDealResponse = await fetch('https://api.holded.com/api/crm/deals', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Key': HOLDED_API_KEY
        },
        body: JSON.stringify(dealPayload)
      });

      console.log('💼 Status da criação de oportunidade:', createDealResponse.status);
      const dealResponseText = await createDealResponse.text();
      console.log('📄 Resposta da oportunidade:', dealResponseText);

      if (createDealResponse.ok) {
        dealResult = JSON.parse(dealResponseText);
        console.log('✅ Oportunidade criada com sucesso:', dealResult.id);
      } else {
        console.error('❌ Erro ao criar oportunidade:', dealResponseText);
      }
    } catch (dealError) {
      console.error('❌ Erro ao criar oportunidade:', dealError);
    }

    console.log('🎉 Processo concluído!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        contactId,
        dealId: dealResult?.id,
        message: 'Pedido enviado para Holded CRM com sucesso!',
        logs: {
          contactCreated: !!contactId,
          dealCreated: !!dealResult
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ ERRO GERAL:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});