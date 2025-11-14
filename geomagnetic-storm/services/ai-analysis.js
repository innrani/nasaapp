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

// Configuração Groq (IA Gratuita)
const groqConfig = hasGroq ? {
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
} : null;

/**
 * Gera análise inteligente de eventos solares usando IA
 * @param {Array} events - Lista de eventos solares detectados
 * @returns {Object} Análise completa com insights e recomendações
 */
async function generateIntelligentAnalysis(events) {
    if (!events || events.length === 0) {
        return {
            summary: "Nenhum evento solar significativo detectado no momento.",
            riskLevel: "baixo",
            recommendations: ["Continuar monitoramento de rotina"],
            impactAnalysis: "Condições espaciais normais"
        };
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
    
    let analysis = `📊 ANÁLISE AUTOMATIZADA DE EVENTOS SOLARES\n\n`;
    analysis += `🔍 RESUMO EXECUTIVO:\n`;
    analysis += `Detectados ${events.length} eventos solares significativos. `;
    
    if (hasGST) {
        const gstEvents = events.filter(e => e.type === 'GST');
        const severeGst = gstEvents.filter(e => e.severity === 'alta').length;
        if (severeGst > 0) {
            analysis += `Identificadas ${severeGst} tempestade(s) geomagnética(s) severa(s), `;
        }
        analysis += `que podem impactar sistemas de GPS e comunicações. `;
    }
    
    if (hasCME) {
        analysis += `Ejeções de massa coronal detectadas, indicando possíveis distúrbios na magnetosfera terrestre. `;
    }
    
    if (hasFLR) {
        analysis += `Explosões solares registradas, podendo causar blackouts de rádio. `;
    }
    
    analysis += `\n\n⚡ NÍVEL DE RISCO: ${riskLevel.toUpperCase()}\n\n`;
    
    analysis += `🎯 IMPACTOS ESPERADOS:\n`;
    
    if (riskLevel === 'crítico' || riskLevel === 'alto') {
        analysis += `• Sistemas de comunicação: Alta probabilidade de interferências\n`;
        analysis += `• GPS e navegação: Possível degradação significativa de precisão\n`;
        analysis += `• Rede elétrica: Risco de flutuações em altas latitudes\n`;
        analysis += `• Operações de satélites: Recomenda-se modo de proteção\n`;
    } else if (riskLevel === 'moderado') {
        analysis += `• Sistemas de comunicação: Interferências menores possíveis\n`;
        analysis += `• GPS e navegação: Pequena degradação de precisão\n`;
        analysis += `• Aviação: Monitorar rotas polares\n`;
    } else {
        analysis += `• Impactos mínimos esperados na infraestrutura\n`;
        analysis += `• Possível visualização de auroras em altas latitudes\n`;
    }
    
    analysis += `\n🔮 RECOMENDAÇÕES:\n`;
    analysis += `• Continuar monitoramento ativo dos eventos\n`;
    analysis += `• Verificar sistemas críticos de comunicação\n`;
    
    if (hasGST) {
        analysis += `• Operadores de rede elétrica devem estar em alerta\n`;
    }
    
    if (hasCME) {
        analysis += `• Considerar proteção de satélites sensíveis\n`;
    }
    
    analysis += `\n⏰ DURAÇÃO ESTIMADA:\n`;
    analysis += `Baseado no tipo e intensidade dos eventos, os efeitos podem persistir por 6-48 horas.\n`;
    
    analysis += `\n📝 NOTA: Esta análise foi gerada automaticamente usando algoritmos baseados em regras. `;
    analysis += `Para análises mais detalhadas, configure a integração com OpenAI GPT.`;
    
    return analysis;
}

module.exports = {
    generateIntelligentAnalysis,
    generateSpecificRecommendations,
    enhancedEventClassification,
    determineRiskLevel
};