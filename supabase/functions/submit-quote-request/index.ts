import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🚀 Iniciando processamento do pedido de orçamento...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const supabaseClient = createClient(supabaseUrl!, supabaseServiceKey!);
    console.log('✅ Cliente Supabase criado');

    console.log('📥 Processando FormData...');
    const formData = await req.formData();
    
    // Extrair dados do formulário
    const quoteData = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string,
      telemovel: formData.get('telemovel') as string,
      localizacao: formData.get('localizacao') as string,
      tipo_imovel: formData.get('tipoImovel') as string,
      ultimo_piso: formData.get('ultimoPiso') as string,
      exposicao_solar: formData.get('exposicaoSolar') as string,
      nivel_isolamento: formData.get('nivelIsolamento') as string,
      zona_fria: formData.get('zonaFria') as string,
      sinais_humidade: formData.get('sinaisHumidade') as string,
      area: formData.get('area') as string,
      tipo_pavimento: formData.get('tipoPavimento') as string,
      possui_planta: formData.get('possuiPlanta') as string,
      observacoes: formData.get('observacoes') as string || null,
      // Campos antigos com valores padrão para compatibilidade
      tipo_obra: 'Não especificado',
      piso_localizacao: formData.get('ultimoPiso') as string || 'Não especificado',
      zona_humida: formData.get('sinaisHumidade') as string || 'Não especificado',
      vidros_duplos: 'Não especificado',
    };

    console.log('📝 Dados extraídos:', {
      nome: quoteData.nome,
      email: quoteData.email,
      possui_planta: quoteData.possui_planta
    });

    let plantaUrl = null;
    let plantaPath = null;

    // Upload da planta se existir
    const plantaFile = formData.get('planta') as File;
    if (plantaFile && plantaFile.size > 0) {
      console.log('📎 Arquivo detectado:', {
        nome: plantaFile.name,
        tamanho: plantaFile.size,
        tipo: plantaFile.type
      });
      
      const fileExt = plantaFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      console.log('📤 Upload para bucket quote-files...');

      const arrayBuffer = await plantaFile.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('quote-files')
        .upload(filePath, fileBuffer, {
          contentType: plantaFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('❌ Erro no upload:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }
      
      console.log('✅ Upload concluído');
      plantaPath = filePath;
      
      const { data: urlData } = supabaseClient.storage
        .from('quote-files')
        .getPublicUrl(filePath);
      
      plantaUrl = urlData.publicUrl;
      console.log('🔗 URL público gerado');
    } else {
      console.log('ℹ️ Nenhum arquivo anexado');
    }

    // Inserir na base de dados
    console.log('💾 Inserindo na tabela quote_requests...');
    const dataToInsert = { 
      ...quoteData, 
      planta_url: plantaUrl,
      planta_path: plantaPath 
    };
    
    const { data, error } = await supabaseClient
      .from('quote_requests')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao inserir:', error);
      throw new Error(`Erro na base de dados: ${error.message}`);
    }

    console.log('✅ Dados inseridos com sucesso! ID:', data.id);

    // Enviar notificação por email para a empresa
    console.log('📧 Enviando notificação para a empresa...');
    try {
      await fetch(`${supabaseUrl}/functions/v1/send-quote-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteData: { ...quoteData, planta_url: plantaUrl },
          quoteId: data.id
        })
      });
      console.log('✅ Notificação enviada para a empresa');
    } catch (emailError) {
      console.error('⚠️ Erro ao enviar notificação:', emailError);
    }

    // Enviar email de confirmação para o cliente
    console.log('📧 Enviando confirmação para o cliente...');
    try {
      await fetch(`${supabaseUrl}/functions/v1/send-client-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientEmail: quoteData.email,
          clientName: quoteData.nome,
          quoteId: data.id
        })
      });
      console.log('✅ Confirmação enviada para o cliente');
    } catch (emailError) {
      console.error('⚠️ Erro ao enviar confirmação:', emailError);
    }

    console.log('🎉 Processamento concluído!');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Pedido de orçamento recebido com sucesso!',
        data: {
          id: data.id,
          nome: data.nome,
          email: data.email,
          planta_url: plantaUrl
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ ERRO:', error);
    console.error('Detalhes:', error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro ao processar pedido',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});