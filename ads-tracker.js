/**
 * Evolutio - Módulo de Rastreamento do Google Ads & Analytics (ads-tracker.js)
 * 
 * Este arquivo gerencia todas as tags de conversão e eventos do Google Ads.
 * Para configurar, altere os IDs nas constantes abaixo.
 */

// CONFIGURAÇÃO DOS IDS (Substitua pelos IDs reais fornecidos pelo Google Ads)
const GOOGLE_ADS_CONFIG = {
    MEASUREMENT_ID: 'AW-XXXXXXXXXXX', // Seu ID do Google Ads (ex: AW-123456789)
    CONVERSIONS: {
        WHATSAPP_CLICK: 'AW-XXXXXXXXXXX/WhatsAppClickLabel', // ID/Label de conversão para clique no WhatsApp
        FORM_SUBMIT: 'AW-XXXXXXXXXXX/FormSubmitLabel',       // ID/Label de conversão para formulário enviado
        PHONE_CLICK: 'AW-XXXXXXXXXXX/PhoneClickLabel'         // ID/Label de conversão para clique no telefone
    }
};

/**
 * Inicializa a tag global do Google (gtag.js)
 * Adiciona dinamicamente os scripts ao cabeçalho.
 */
function initGoogleAds() {
    // Verifica se os scripts já existem para evitar duplicidade
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
        return;
    }

    // Apenas carrega se o ID de medição for configurado (diferente do placeholder)
    if (GOOGLE_ADS_CONFIG.MEASUREMENT_ID.includes('XXXXX')) {
        console.warn('Google Ads Tracker: Utilizando IDs de demonstração. Substitua os valores em ads-tracker.js quando tiver as tags reais.');
    }

    try {
        // Criar elemento script principal do Google Tag
        const scriptTag = document.createElement('script');
        scriptTag.async = true;
        scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_CONFIG.MEASUREMENT_ID}`;
        document.head.appendChild(scriptTag);

        // Configurar a fila global de comandos do gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            window.dataLayer.push(arguments);
        };
        
        window.gtag('js', new Date());
        window.gtag('config', GOOGLE_ADS_CONFIG.MEASUREMENT_ID);
        
        console.log('Google Ads Tracker: Tag Global (gtag.js) inicializada com sucesso.');
    } catch (e) {
        console.error('Google Ads Tracker: Falha ao inicializar o Google Ads.', e);
    }
}

/**
 * Envia um evento de conversão genérico para o Google Ads
 * @param {string} conversionLabel - O rótulo ou caminho completo de conversão (ex: AW-XXX/Label)
 * @param {object} customParams - Parâmetros extras opcionais
 */
function trackConversion(conversionLabel, customParams = {}) {
    if (typeof window.gtag === 'function') {
        const sendTo = conversionLabel;
        const eventData = {
            'send_to': sendTo,
            ...customParams
        };
        
        window.gtag('event', 'conversion', eventData);
        console.log(`Google Ads Tracker: Conversão enviada para [${sendTo}]`, eventData);
    } else {
        // Se adblocker estiver ativo ou tags não carregadas, faz fallback seguro no console
        console.log(`Google Ads Tracker (Demo/Fallback): Evento de conversão para [${conversionLabel}] simulado com sucesso.`, customParams);
    }
}

/**
 * Rastreia cliques no botão do WhatsApp
 */
function trackWhatsAppConversion(origin = 'Geral') {
    trackConversion(GOOGLE_ADS_CONFIG.CONVERSIONS.WHATSAPP_CLICK, {
        'event_category': 'Engagement',
        'event_label': `WhatsApp - Origem: ${origin}`
    });
}

/**
 * Rastreia envio de formulário de contato/orçamento
 */
function trackFormSubmitConversion(formType = 'Contato B2B') {
    trackConversion(GOOGLE_ADS_CONFIG.CONVERSIONS.FORM_SUBMIT, {
        'event_category': 'Lead',
        'event_label': `Formulário - Tipo: ${formType}`
    });
}

/**
 * Rastreia cliques no link/botão do telefone
 */
function trackPhoneClickConversion() {
    trackConversion(GOOGLE_ADS_CONFIG.CONVERSIONS.PHONE_CLICK, {
        'event_category': 'Contact',
        'event_label': 'Clique no Telefone'
    });
}

// Inicializar automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', initGoogleAds);

// Expõe funções no escopo global para facilitar o uso no app.js e no HTML
window.EvolutioTracker = {
    trackWhatsApp: trackWhatsAppConversion,
    trackFormSubmit: trackFormSubmitConversion,
    trackPhoneClick: trackPhoneClickConversion,
    trackCustom: trackConversion
};
