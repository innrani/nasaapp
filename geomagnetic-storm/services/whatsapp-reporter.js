require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const axios = require('axios');
const { generateIntelligentAnalysis, generateSpecificRecommendations } = require('./ai-analysis.js');
const { analyzeTrends, calculateRiskScore, predictSectorImpacts, analyzeTemporalPatterns } = require('./predictive-analysis.js');

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const MY_PHONE_NUMBER = process.env.MY_PHONE_NUMBER;

/**
 * Gera e envia relatório completo semanal via WhatsApp
 * @param {Array} events - Lista de eventos solares da semana
 */
async function sendWeeklyReport(events) {
    console.log('📱 Gerando relatório semanal para WhatsApp...');
    
    try {
        // 1. Cabeçalho do relatório
        await sendMessage(generateReportHeader(events));
        
        // Aguarda um pouco entre mensagens
        await sleep(2000);
        
        // 2. Resumo executivo
        const executiveSummary = generateExecutiveSummary(events);
        await sendMessage(executiveSummary);
        
        await sleep(3000);
        
        // 3. Análise de IA (se disponível)
        const aiAnalysis = await generateIntelligentAnalysis(events);
        if (aiAnalysis.generated) {
            const aiMessage = formatAIAnalysisForWhatsApp(aiAnalysis);
            await sendMessage(aiMessage);
            await sleep(3000);
        }
        
        // 4. Análise preditiva
        const predictiveReport = generatePredictiveReport(events);
        await sendMessage(predictiveReport);
        
        await sleep(3000);
        
        // 5. Impactos por setor
        const sectorReport = await generateSectorReport(events);
        await sendMessage(sectorReport);
        
        await sleep(3000);
        
        // 6. Recomendações
        const recommendations = await generateRecommendationsReport(events);
        await sendMessage(recommendations);
        
        await sleep(2000);
        
        // 7. Eventos detalhados (top 10)
        if (events.length > 0) {
            const detailedEvents = generateDetailedEventsReport(events);
            await sendMessage(detailedEvents);
        }
        
        // 8. Rodapé
        await sleep(2000);
        await sendMessage(generateReportFooter());
        
        console.log('✅ Relatório semanal enviado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao enviar relatório semanal:', error.message);
        
        // Tenta enviar mensagem de erro
        try {
            await sendMessage(`❌ Erro ao gerar relatório automático.\n\nDetalhes: ${error.message}\n\nTentarei novamente em breve.`);
        } catch (sendError) {
            console.error('❌ Erro ao enviar mensagem de erro:', sendError.message);
        }
    }
}

/**
 * Gera cabeçalho do relatório
 */
function generateReportHeader(events) {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    
    return `🌞 RELATÓRIO SEMANAL DE ATIVIDADE SOLAR 🤖

📅 Período: ${weekAgo.toLocaleDateString('pt-BR')} - ${today.toLocaleDateString('pt-BR')}
🔬 Análise com Inteligência Artificial
⏰ Gerado em: ${today.toLocaleString('pt-BR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌍 EVENTOS DETECTADOS: ${events.length}`;
}

/**
 * Gera resumo executivo
 */
function generateExecutiveSummary(events) {
    if (!events || events.length === 0) {
        return `📊 RESUMO EXECUTIVO

✅ Nenhum evento solar significativo foi detectado na última semana.
🌤️ Condições do clima espacial: ESTÁVEIS
⚡ Status geral: NORMAL

A ausência de eventos solares indica um período de baixa atividade solar.`;
    }
    
    const eventsByType = events.reduce((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
    }, {});
    
    const gstCount = eventsByType.GST || 0;
    const cmeCount = eventsByType.CME || 0;
    const flrCount = eventsByType.FLR || 0;
    
    const riskScore = calculateRiskScore(events);
    
    return `📊 RESUMO EXECUTIVO

🔴 Tempestades Geomagnéticas (GST): ${gstCount}
⚡ Ejeções de Massa Coronal (CME): ${cmeCount}
🌞 Explosões Solares (FLR): ${flrCount}
📡 Outros eventos: ${events.length - gstCount - cmeCount - flrCount}

⚡ NÍVEL DE RISCO GERAL: ${riskScore.level.toUpperCase()}
📊 Score de Risco: ${riskScore.score}/100

${getRiskDescription(riskScore.level)}`;
}

/**
 * Formata análise de IA para WhatsApp
 */
function formatAIAnalysisForWhatsApp(aiAnalysis) {
    const mode = aiAnalysis.mode === 'online' ? 'OpenAI GPT' : 'Algoritmos ML';
    
    return `🤖 ANÁLISE DE INTELIGÊNCIA ARTIFICIAL
Powered by: ${mode}

${aiAnalysis.fullAnalysis}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

/**
 * Gera relatório preditivo
 */
function generatePredictiveReport(events) {
    const trends = analyzeTrends(events);
    const temporal = analyzeTemporalPatterns(events);
    
    return `📈 ANÁLISE PREDITIVA E TENDÊNCIAS

🔄 Tendência: ${trends.trend.toUpperCase()}
🎯 Predição: ${trends.prediction}
📊 Confiança: ${(trends.confidence * 100).toFixed(0)}%
📈 Score de Atividade: ${trends.activityScore}

⏰ Padrão Temporal: ${temporal.pattern.toUpperCase()}
📝 ${temporal.description}
${temporal.averageInterval ? `⏱️ Intervalo Médio: ${temporal.averageInterval}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

/**
 * Gera relatório de impactos por setor
 */
async function generateSectorReport(events) {
    const sectorImpacts = predictSectorImpacts(events);
    
    let report = `🏢 IMPACTOS POR SETOR DA ECONOMIA

`;
    
    const sectorEmojis = {
        telecommunications: '📡',
        powerGrid: '⚡',
        aviation: '✈️',
        satellites: '🛰️',
        gps: '🧭'
    };
    
    const sectorNames = {
        telecommunications: 'Telecomunicações',
        powerGrid: 'Energia Elétrica',
        aviation: 'Aviação Civil',
        satellites: 'Satélites',
        gps: 'GPS/Navegação'
    };
    
    Object.entries(sectorImpacts).forEach(([sector, data]) => {
        const emoji = sectorEmojis[sector] || '🏢';
        const name = sectorNames[sector] || sector;
        const riskColor = data.level === 'alto' ? '🔴' : data.level === 'moderado' ? '🟡' : '🟢';
        
        report += `${emoji} ${name}: ${riskColor} ${data.level.toUpperCase()} (${data.risk}%)\n`;
        
        if (data.details.length > 0) {
            data.details.slice(0, 2).forEach(detail => {
                report += `   • ${detail}\n`;
            });
        }
        report += '\n';
    });
    
    report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    
    return report;
}

/**
 * Gera relatório de recomendações
 */
async function generateRecommendationsReport(events) {
    const recommendations = await generateSpecificRecommendations(events);
    
    let report = `💡 RECOMENDAÇÕES ESPECÍFICAS

`;
    
    if (recommendations.telecommunications.length > 0) {
        report += `📡 TELECOMUNICAÇÕES:\n`;
        recommendations.telecommunications.forEach(rec => {
            report += `• ${rec}\n`;
        });
        report += '\n';
    }
    
    if (recommendations.powerGrid.length > 0) {
        report += `⚡ ENERGIA ELÉTRICA:\n`;
        recommendations.powerGrid.forEach(rec => {
            report += `• ${rec}\n`;
        });
        report += '\n';
    }
    
    if (recommendations.aviation.length > 0) {
        report += `✈️ AVIAÇÃO:\n`;
        recommendations.aviation.forEach(rec => {
            report += `• ${rec}\n`;
        });
        report += '\n';
    }
    
    if (recommendations.satellites.length > 0) {
        report += `🛰️ SATÉLITES:\n`;
        recommendations.satellites.forEach(rec => {
            report += `• ${rec}\n`;
        });
        report += '\n';
    }
    
    if (recommendations.general.length > 0) {
        report += `🌍 GERAL:\n`;
        recommendations.general.forEach(rec => {
            report += `• ${rec}\n`;
        });
        report += '\n';
    }
    
    if (events.length === 0) {
        report += `✅ Nenhuma ação especial necessária no momento.\n`;
        report += `📊 Continue o monitoramento de rotina.\n\n`;
    }
    
    report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    
    return report;
}

/**
 * Gera relatório detalhado dos principais eventos
 */
function generateDetailedEventsReport(events) {
    const topEvents = events
        .sort((a, b) => {
            const severityOrder = { 'crítica': 4, 'alta': 3, 'moderada': 2, 'baixa': 1, 'indefinida': 0 };
            return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
        })
        .slice(0, 10);
    
    let report = `📋 TOP ${Math.min(10, events.length)} EVENTOS MAIS SIGNIFICATIVOS

`;
    
    topEvents.forEach((event, index) => {
        const date = event.date && !isNaN(event.date.getTime()) 
            ? event.date.toLocaleDateString('pt-BR') 
            : "Data desconhecida";
            
        const typeEmoji = {
            'GST': '🌪️',
            'CME': '⚡',
            'FLR': '🌞',
            'SEP': '☢️',
            'HSS': '💨'
        }[event.type] || '🌌';
        
        const severityIcon = {
            'crítica': '🔴',
            'alta': '🟠', 
            'moderada': '🟡',
            'baixa': '🟢',
            'indefinida': '⚪'
        }[event.severity] || '⚪';
        
        report += `${index + 1}. ${typeEmoji} ${event.type} ${severityIcon}\n`;
        report += `📅 ${date}\n`;
        report += `📄 ${event.description.substring(0, 120)}${event.description.length > 120 ? '...' : ''}\n\n`;
    });
    
    if (events.length > 10) {
        report += `... e mais ${events.length - 10} eventos registrados.\n\n`;
    }
    
    report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    
    return report;
}

/**
 * Gera rodapé do relatório
 */
function generateReportFooter() {
    return `🔬 DADOS TÉCNICOS

📡 Fonte: NASA DONKI API
🤖 IA: OpenAI GPT + Algoritmos ML
⏰ Próximo relatório: 7 dias
🌐 Sistema: NASAApp v1.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛡️ Este sistema monitora continuamente a atividade solar e fornece alertas automáticos baseados em análise de inteligência artificial.

📞 Sistema desenvolvido para monitoramento científico.`;
}

/**
 * Função auxiliar para enviar mensagem via WhatsApp
 */
async function sendMessage(message) {
    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !MY_PHONE_NUMBER) {
        console.log('⚠️ WhatsApp não configurado. Exibindo mensagem:');
        console.log('=' .repeat(50));
        console.log(message);
        console.log('=' .repeat(50));
        return;
    }
    
    try {
        await axios.post(
            `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: MY_PHONE_NUMBER,
                type: "text",
                text: { body: message },
            },
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(`✅ Mensagem enviada: ${message.substring(0, 50)}...`);
    } catch (error) {
        console.error(`❌ Erro ao enviar mensagem:`, error.response?.data || error.message);
    }
}

/**
 * Função auxiliar para pausar execução
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gera descrição do nível de risco
 */
function getRiskDescription(level) {
    const descriptions = {
        'muito baixo': '🟢 Condições normais do clima espacial. Operações podem continuar sem restrições.',
        'baixo': '🟡 Atividade solar leve. Monitoramento de rotina recomendado.',
        'moderado': '🟠 Atividade solar moderada. Verificar sistemas sensíveis.',
        'alto': '🔴 Atividade solar elevada. Implementar protocolos de precaução.',
        'crítico': '🚨 Atividade solar severa. Ativar protocolos de emergência.'
    };
    return descriptions[level] || '⚪ Nível de risco não determinado.';
}

/**
 * Envia relatório diário resumido
 */
async function sendDailySummary(events) {
    const today = new Date().toLocaleDateString('pt-BR');
    const todayEvents = events.filter(event => {
        const eventDate = event.date.toLocaleDateString('pt-BR');
        return eventDate === today;
    });
    
    const riskScore = calculateRiskScore(todayEvents);
    
    const summary = `🌞 RESUMO DIÁRIO - ${today}

📊 Eventos hoje: ${todayEvents.length}
⚡ Nível de risco: ${riskScore.level.toUpperCase()}
📈 Score: ${riskScore.score}/100

${getRiskDescription(riskScore.level)}

🤖 Relatório automático do NASAApp`;
    
    await sendMessage(summary);
}

module.exports = {
    sendWeeklyReport,
    sendDailySummary,
    sendMessage
};