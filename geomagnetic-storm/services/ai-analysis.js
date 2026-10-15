require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const axios = require('axios');

// Debug: verificar se .env foi carregado
console.log('📁 Carregando .env do caminho:', require('path').join(__dirname, '../../.env'));

// Recarregar .env explicitamente
const path = require('path');
const envPath = path.resolve(__dirname, '../../.env');
require('dotenv').config({ path: envPath });

// Verificação de chave API Groq
const hasGroq = !!process.env.GROQ_API_KEY;

console.log('🔍 Debug - Groq disponível:', hasGroq);
console.log('🔍 Debug - Groq Key:', process.env.GROQ_API_KEY ? 'configurada' : 'não encontrada');

if (!hasGroq) {
    console.log('⚠️ Chave Groq não encontrada. Executando em modo offline.');
    console.log('💡 Para ativar IA gratuita, adicione GROQ_API_KEY ao arquivo .env');
    console.log('🔗 Crie sua chave gratuita em: https://console.groq.com/');
}

// Configuração Groq
const groqConfig = hasGroq ? {
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
} : null;

function buildNoEventsAnalysis() {
    const analysis = `📊 NENHUM EVENTO SOLAR DETECTADO

Não há registros significativos no intervalo consultado.

Possíveis causas:
• não existiram eventos relevantes nesse período;
• a API da NASA retornou resposta vazia;
• o filtro de data não encontrou eventos compatíveis;
• a consulta falhou antes de carregar os dados.

Ação recomendada:
• continuar monitoramento em rotina;
• tentar uma nova consulta em alguns minutos;
• verificar se a API NASA respondeu com dados válidos.`;

    return {
        fullAnalysis: analysis,
        summary: 'Nenhum evento solar significativo detectado no momento.',
        riskLevel: 'baixo',
        recommendations: [
            'Continuar monitoramento de rotina',
            'Repetir a consulta em alguns minutos',
            'Verificar se a API da NASA retornou dados vazios'
        ],
        impactAnalysis: 'Condições espaciais normais no período consultado.',
        eventsProcessed: 0,
        timestamp: new Date().toISOString(),
        generated: true,
        mode: 'no-data'
    };
}

/**
 * Gera análise inteligente de eventos solares usando IA
 * @param {Array} events - Lista de eventos solares detectados
 * @returns {Object} Análise completa com insights e recomendações
 */
async function generateIntelligentAnalysis(events) {
    if (!events || events.length === 0) {
        return buildNoEventsAnalysis();
    }

    try {
        // Tenta usar Groq AI (gratis!!!!)
        if (hasGroq) {
            console.log('🤖 Usando Groq AI (gratuito)...');
            return await generateGroqAnalysis(events);
        }
        
        // Se Groq não disponível, usa análise offline
        console.log('🔧 Usando análise offline...');
        const offlineRiskLevel = determineRiskLevel(events);
        const offlineAnalysis = generateOfflineAnalysis(events, offlineRiskLevel);
        
        return {
            fullAnalysis: offlineAnalysis,
            riskLevel: offlineRiskLevel,
            eventsProcessed: events.length,
            timestamp: new Date().toISOString(),
            generated: true,
            mode: 'offline'
        };

    } catch (error) {
        console.error('❌ Erro ao gerar análise de IA:', error.message);
        return {
            summary: "Erro ao gerar análise automatizada. Verifique os eventos manualmente.",
            riskLevel: "desconhecido",
            error: error.message,
            generated: false
        };
    }
}

/**
 * Gera análise usando Groq AI
 * @param {Array} events - Lista de eventos solares
 * @returns {Object} Análise completa
 */
async function generateGroqAnalysis(events) {
    try {
        const eventData = events.map(event => ({
            type: event.type,
            date: event.eventTime || event.startTime,
            description: event.note || event.catalog || 'Evento solar detectado'
        }));

        const prompt = `
ANÁLISE DE EVENTOS SOLARES - SISTEMA DE MONITORAMENTO NASA

Eventos detectados nos últimos 7 dias:
${JSON.stringify(eventData, null, 2)}

Total de eventos: ${events.length}

Forneça uma análise completa incluindo:
1. Resumo executivo dos eventos
2. Nível de risco (baixo, moderado, alto, crítico)
3. Possíveis impactos em:
   - Sistemas de comunicação e GPS
   - Redes elétricas
   - Operações de satélites
   - Voos comerciais em altas latitudes
4. Recomendações específicas para diferentes setores
5. Previsão de duração dos efeitos

Responda em português brasileiro de forma técnica mas acessível.
`;

        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: "Você é um especialista em clima espacial e eventos solares, com conhecimento profundo sobre os impactos de tempestades geomagnéticas na infraestrutura tecnológica."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.3
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const analysis = response.data.choices[0].message.content;
        const riskLevel = determineRiskLevel(events);

        return {
            fullAnalysis: analysis,
            riskLevel: riskLevel,
            eventsProcessed: events.length,
            timestamp: new Date().toISOString(),
            generated: true,
            mode: 'groq'
        };

    } catch (error) {
        console.error('❌ Erro na análise Groq:', error.message);
        if (error.response) {
            console.error('❌ Status:', error.response.status);
            console.error('❌ Dados:', error.response.data);
        }
        
        // Fallback para análise offline
        const riskLevel = determineRiskLevel(events);
        const offlineAnalysis = generateOfflineAnalysis(events, riskLevel);
        
        return {
            fullAnalysis: offlineAnalysis,
            riskLevel: riskLevel,
            eventsProcessed: events.length,
            timestamp: new Date().toISOString(),
            generated: true,
            mode: 'offline_fallback'
        };
    }
}

/**
 * Determina o nível de risco baseado nos tipos e severidade dos eventos
 * @param {Array} events - Lista de eventos solares
 * @returns {string} Nível de risco
 */
function determineRiskLevel(events) {
    const hasHighSeverityGST = events.some(event => 
        event.type === 'GST' && event.severity === 'alta'
    );
    
    const hasModerateSeverityGST = events.some(event => 
        event.type === 'GST' && event.severity === 'moderada'
    );

    const hasMultipleEvents = events.length > 3;
    const hasCME = events.some(event => event.type === 'CME');

    if (hasHighSeverityGST) return 'crítico';
    if (hasModerateSeverityGST && (hasMultipleEvents || hasCME)) return 'alto';
    if (hasModerateSeverityGST || hasMultipleEvents) return 'moderado';
    return 'baixo';
}

/**
 * Gera recomendações específicas baseadas no tipo de evento
 * @param {Array} events - Lista de eventos solares
 * @returns {Object} Recomendações categorizadas
 */
async function generateSpecificRecommendations(events) {
    const recommendations = {
        telecommunications: [],
        powerGrid: [],
        aviation: [],
        satellites: [],
        general: []
    };

    const hasGST = events.some(event => event.type === 'GST');
    const hasCME = events.some(event => event.type === 'CME');
    const hasFLR = events.some(event => event.type === 'FLR');

    if (hasGST) {
        recommendations.telecommunications.push("Monitorar sistemas GPS e comunicações por rádio");
        recommendations.powerGrid.push("Verificar estabilidade da rede elétrica em altas latitudes");
        recommendations.general.push("Possível visualização de auroras em latitudes mais baixas");
    }

    if (hasCME) {
        recommendations.satellites.push("Colocar satélites em modo de proteção se necessário");
        recommendations.aviation.push("Considerar rotas alternativas para voos polares");
    }

    if (hasFLR) {
        recommendations.telecommunications.push("Possível interferência em comunicações de rádio HF");
    }

    return recommendations;
}

/**
 * Classifica eventos usando regras de IA mais sofisticadas
 * @param {Object} rawEvent - Evento bruto da NASA
 * @param {string} eventType - Tipo do evento (GST, CME, etc.)
 * @returns {Object} Evento classificado com IA
 */
function enhancedEventClassification(rawEvent, eventType) {
    const enhanced = {
        ...rawEvent,
        aiEnhanced: true,
        confidence: 0.8 // Confiança da classificação
    };

    // Classificação melhorada para tempestades geomagnéticas
    if (eventType === 'GST' && rawEvent.allKpIndex) {
        const maxKp = Math.max(...rawEvent.allKpIndex.map(kp => kp.kpIndex));
        
        if (maxKp >= 8) {
            enhanced.severity = 'crítica';
            enhanced.confidence = 0.95;
        } else if (maxKp >= 6) {
            enhanced.severity = 'alta';
            enhanced.confidence = 0.9;
        } else if (maxKp >= 4) {
            enhanced.severity = 'moderada';
            enhanced.confidence = 0.85;
        } else {
            enhanced.severity = 'baixa';
            enhanced.confidence = 0.8;
        }

        enhanced.predictedDuration = maxKp >= 6 ? '12-48 horas' : '6-12 horas';
    }

    return enhanced;
}

/**
 * Gera análise offline baseada em regras quando OpenAI não está disponível
 * @param {Array} events - Lista de eventos solares
 * @param {string} riskLevel - Nível de risco calculado
 * @returns {string} Análise textual
 */
function generateOfflineAnalysis(events, riskLevel) {
    const eventTypes = events.map(e => e.type);
    const hasGST = eventTypes.includes('GST');
    const hasCME = eventTypes.includes('CME');
    const hasFLR = eventTypes.includes('FLR');
    const hasSEP = eventTypes.includes('SEP');
    const hasHSS = eventTypes.includes('HSS');

    const countsByType = {
        GST: events.filter(e => e.type === 'GST').length,
        CME: events.filter(e => e.type === 'CME').length,
        FLR: events.filter(e => e.type === 'FLR').length,
        SEP: events.filter(e => e.type === 'SEP').length,
        HSS: events.filter(e => e.type === 'HSS').length
    };

    let analysis = `📊 ANÁLISE AUTOMATIZADA DE EVENTOS SOLARES\n\n`;
    analysis += `🔍 RESUMO EXECUTIVO:\n`;
    analysis += `Foram detectados ${events.length} eventos solares no período analisado, distribuídos em ${countsByType.GST || 0} GST, ${countsByType.CME || 0} CME, ${countsByType.FLR || 0} FLR, ${countsByType.SEP || 0} SEP e ${countsByType.HSS || 0} HSS. `;

    if (hasGST) {
        const gstEvents = events.filter(e => e.type === 'GST');
        const severeGst = gstEvents.filter(e => e.severity === 'alta' || e.severity === 'crítica' || e.severity === 'crítica').length;
        if (severeGst > 0) {
            analysis += `Houve ${severeGst} tempestade(s) geomagnética(s) de severidade elevada, `;
        }
        analysis += `o que pode afetar GPS, navegação e comunicações de rádio. `;
    }

    if (hasCME) {
        analysis += `As ejeções de massa coronal indicam possível interação com a magnetosfera terrestre e aumento de perturbações espaciais. `;
    }

    if (hasFLR) {
        analysis += `Explosões solares foram registradas, com potencial para interferência em frequências de rádio e emissões ionosféricas. `;
    }

    if (hasSEP) {
        analysis += `Partículas energéticas foram observadas, sugerindo risco para satélites e sistemas sensíveis em órbita. `;
    }

    if (hasHSS) {
        analysis += `Ventos solares rápidos também foram identificados, contribuindo para a dinâmica da atividade geomagnética. `;
    }

    if (!hasGST && !hasCME && !hasFLR && !hasSEP && !hasHSS) {
        analysis += `Apesar do período observado, não houve padrão de eventos relevantes para indicar distúrbios espaciais intensos. `;
    }

    analysis += `\n\n⚡ NÍVEL DE RISCO: ${riskLevel.toUpperCase()}\n\n`;

    analysis += `🎯 IMPACTOS ESPERADOS:\n`;

    if (riskLevel === 'crítico' || riskLevel === 'alto') {
        analysis += `• Sistemas de comunicação: alta probabilidade de interferência\n`;
        analysis += `• GPS e navegação: degradação relevante em posicionamento e sincronização\n`;
        analysis += `• Rede elétrica: risco de flutuações e sobretensão em altas latitudes\n`;
        analysis += `• Operações de satélites: necessidade de proteção e monitoramento especial\n`;
    } else if (riskLevel === 'moderado') {
        analysis += `• Sistemas de comunicação: efeitos moderados e variáveis\n`;
        analysis += `• GPS e navegação: pequena perda de precisão eventual\n`;
        analysis += `• Aviação: atenção em rotas polares e regiões de alta latitude\n`;
    } else {
        analysis += `• Impactos mínimos esperados na infraestrutura tecnológica\n`;
        analysis += `• Possível visibilidade de auroras em regiões de alta latitude\n`;
    }

    analysis += `\n🔮 RECOMENDAÇÕES:\n`;
    analysis += `• Continuar monitoramento ativo dos eventos espaciais\n`;
    analysis += `• Verificar sistemas críticos de comunicação e navegação\n`;
    analysis += `• Manter atenção a satélites, redes elétricas e voos em regiões polares\n`;

    if (hasGST) {
        analysis += `• Operadores de rede elétrica devem estar em alerta durante a janela geomagnética\n`;
    }

    if (hasCME) {
        analysis += `• Considerar proteção de satélites sensíveis e protocolos de contingência\n`;
    }

    if (hasFLR || hasSEP) {
        analysis += `• Monitorar possíveis interações de rádio e levantamentos de partículas energéticas\n`;
    }

    analysis += `\n⏰ DURAÇÃO ESTIMADA:\n`;
    analysis += `Baseado no tipo e na intensidade dos eventos, os efeitos podem persistir por 6 a 48 horas.\n`;

    analysis += `\n🧭 CONCLUSÃO:\n`;
    analysis += `A atividade solar neste período mostrou um conjunto de fenômenos que, em conjunto, podem influenciar a ionosfera, as comunicações, a navegação e a operação de infraestrutura crítica. A avaliação geral indica que a resposta do sistema depende da intensidade e do acoplamento entre os diferentes tipos de evento.`;

    analysis += `\n\n📝 NOTA: Esta análise foi gerada automaticamente usando algoritmos baseados em regras e consolidando os principais tipos de eventos observados pela NASA.`;

    return analysis;
}

module.exports = {
    generateAIAnalysis: generateIntelligentAnalysis,
    generateIntelligentAnalysis,
    buildNoEventsAnalysis,
    generateSpecificRecommendations,
    enhancedEventClassification,
    determineRiskLevel
};