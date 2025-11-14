const { fetchSolarEvents } = require('./services/nasa.js');
const { generateAIAnalysis } = require('./services/ai-analysis.js');
const { sendAlerts } = require('./services/notificacoes.js');
const axios = require('axios');

// Carregamento do .env
require('dotenv').config({ path: '../.env' });

/**
 * Envia mensagem simples por WhatsApp
 */
async function enviarMensagemWhatsApp(mensagem) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: process.env.MY_PHONE_NUMBER,
                type: "text",
                text: { body: mensagem },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(`✅ Mensagem astronômica enviada por WhatsApp`);
        return response.data;
    } catch (error) {
        console.error(`❌ Erro ao enviar mensagem:`, error.response?.data || error.message);
        throw error;
    }
}

/**
 * 🔭 SISTEMA DE ALERTAS PARA HOBBYISTAS DE ASTRONOMIA
 * Envia informações específicas sobre condições astronômicas
 */

async function gerarAlerteAstronomicoPersonalizado() {
    console.log('🔭 SISTEMA DE ALERTAS ASTRONÔMICOS ATIVADO!');
    console.log('============================================');
    
    try {
        // 1. Buscar eventos solares
        console.log('📡 Buscando atividade solar atual...');
        const eventos = await fetchSolarEvents();
        console.log(`✅ ${eventos.length} eventos solares detectados`);

        // 2. Analisar para contexto astronômico  
        console.log('🤖 Gerando análise específica para astronomia...');
        const analiseIA = await generateAIAnalysis(eventos);

        // 3. Calcular índices importantes
        const indicadores = calcularIndicadoresAstronomicos(eventos);
        
        // 4. Gerar relatório específico
        const relatorioAstronomico = gerarRelatorioHobbyistas(eventos, analiseIA, indicadores);
        
        // 5. Enviar por WhatsApp
        console.log('📱 Enviando alerta astronômico...');
        await enviarMensagemWhatsApp(relatorioAstronomico);
        
        console.log('🎉 Alerta astronômico enviado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao gerar alerta astronômico:', error);
    }
}

/**
 * Calcula índices importantes para hobbyistas
 */
function calcularIndicadoresAstronomicos(eventos) {
    // Tempestades geomagnéticas (GST)
    const tempestades = eventos.filter(e => e.type === 'GST');
    const maxKp = Math.max(...tempestades.map(t => extrairKp(t)), 0);
    
    // Explosões solares (FLR)  
    const explosoes = eventos.filter(e => e.type === 'FLR');
    const classeMaxFlare = explosoes.length > 0 ? extrairClasseFlare(explosoes[0]) : 'A';
    
    // CMEs direcionadas à Terra
    const cmes = eventos.filter(e => e.type === 'CME');
    const cmesPerigoasas = cmes.filter(c => verificarCMEDirecionada(c));
    
    return {
        kpMax: maxKp,
        classeFlare: classeMaxFlare,
        chanceAurora: calcularChanceAurora(maxKp),
        cmesPerigosas: cmesPerigoasas.length,
        risco: determinarRiscoEquipamentos(maxKp, classeMaxFlare)
    };
}

/**
 * Extrai valor Kp de tempestade geomagnética
 */
function extrairKp(tempestade) {
    const texto = JSON.stringify(tempestade).toLowerCase();
    
    // Padrões comuns para Kp
    if (texto.includes('kp9') || texto.includes('g5')) return 9;
    if (texto.includes('kp8') || texto.includes('g4')) return 8;
    if (texto.includes('kp7') || texto.includes('g3')) return 7;
    if (texto.includes('kp6') || texto.includes('g2')) return 6;
    if (texto.includes('kp5') || texto.includes('g1')) return 5;
    
    return 3; // Default moderado
}

/**
 * Extrai classe de explosão solar
 */
function extrairClasseFlare(flare) {
    const texto = JSON.stringify(flare).toLowerCase();
    
    if (texto.includes('x')) return 'X';
    if (texto.includes('m')) return 'M';
    if (texto.includes('c')) return 'C';
    return 'B';
}

/**
 * Verifica se CME está direcionada à Terra
 */
function verificarCMEDirecionada(cme) {
    const texto = JSON.stringify(cme).toLowerCase();
    return texto.includes('earth') || texto.includes('halo') || texto.includes('directed');
}

/**
 * Calcula chance de aurora baseada no Kp
 */
function calcularChanceAurora(kp) {
    const chances = {
        brasil: 0,
        argentina: 0,
        uruguai: 0
    };
    
    if (kp >= 9) {
        chances.brasil = 85;
        chances.argentina = 95; 
        chances.uruguai = 95;
    } else if (kp >= 8) {
        chances.brasil = 65;
        chances.argentina = 85;
        chances.uruguai = 90;
    } else if (kp >= 7) {
        chances.brasil = 35;
        chances.argentina = 70;
        chances.uruguai = 80;
    } else if (kp >= 6) {
        chances.brasil = 15;
        chances.argentina = 45;
        chances.uruguai = 60;
    } else if (kp >= 5) {
        chances.brasil = 5;
        chances.argentina = 25;
        chances.uruguai = 40;
    }
    
    return chances;
}

/**
 * Determina risco para equipamentos astronômicos
 */
function determinarRiscoEquipamentos(kp, classeFlare) {
    let risco = 'BAIXO';
    
    if (kp >= 8 || classeFlare === 'X') {
        risco = 'ALTO';
    } else if (kp >= 6 || classeFlare === 'M') {
        risco = 'MODERADO';
    }
    
    return risco;
}

/**
 * Gera relatório específico para hobbyistas
 */
function gerarRelatorioHobbyistas(eventos, analise, indicadores) {
    const agora = new Date();
    const dataHora = agora.toLocaleString('pt-BR');
    const dataAtual = agora.toLocaleDateString('pt-BR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
    
    // Calcular fase da lua aproximada (simplificada)
    const diasDesdeNovaLua = agora.getDate() % 29;
    const fraseLua = getFraseLua(diasDesdeNovaLua);
    
    let relatorio = `🔭 ALERTA ASTRONÔMICO AUTOMÁTICO\n\n`;
    relatorio += `📅 ${dataAtual}\n`;
    relatorio += `⏰ Atualizado: ${dataHora}\n`;
    relatorio += `🌙 ${fraseLua}\n\n`;
    
    // Status da atividade solar
    relatorio += `☀️ ATIVIDADE SOLAR:\n`;
    relatorio += `└── 📊 Eventos detectados: ${eventos.length}\n`;
    relatorio += `└── ⚡ Nível Kp máximo: ${indicadores.kpMax}\n`;
    relatorio += `└── 🔥 Maior flare: Classe ${indicadores.classeFlare}\n`;
    relatorio += `└── 🌪️ CMEs perigosas: ${indicadores.cmesPerigosas}\n\n`;
    
    // Chance de auroras
    relatorio += `🌈 CHANCE DE AURORA:\n`;
    relatorio += `└── 🇧🇷 Brasil: ${indicadores.chanceAurora.brasil}%\n`;
    relatorio += `└── 🇦🇷 Argentina: ${indicadores.chanceAurora.argentina}%\n`; 
    relatorio += `└── 🇺🇾 Uruguai: ${indicadores.chanceAurora.uruguai}%\n\n`;
    
    // Alerta para equipamentos
    if (indicadores.risco !== 'BAIXO') {
        relatorio += `⚠️ CUIDADO COM EQUIPAMENTOS!\n`;
        relatorio += `└── 🎥 Risco para sensores: ${indicadores.risco}\n`;
        if (indicadores.risco === 'ALTO') {
            relatorio += `└── 🚨 Evite exposições longas!\n`;
            relatorio += `└── 📱 Desligue equipamentos sensíveis\n`;
        }
        relatorio += `\n`;
    }
    
    // Condições de observação  
    relatorio += `📊 CONDIÇÕES DE OBSERVAÇÃO:\n`;
    if (indicadores.kpMax <= 4) {
        relatorio += `└── ✅ Excelente para deep sky\n`;
        relatorio += `└── 📷 Ideal para astrofotografia\n`;
    } else {
        relatorio += `└── ⚠️ Possível interferência magnética\n`;
        relatorio += `└── 🔍 Foque em observação de auroras\n`;
    }
    
    // Dica específica do dia
    relatorio += `\n🎯 DICA DE HOJE:\n`;
    relatorio += getDicaAstronomica(indicadores, diasDesdeNovaLua);
    
    // Previsão
    relatorio += `\n📈 PREVISÃO 24H:\n`;
    relatorio += `└── ${analise.riskLevel === 'crítico' ? '🔥' : '🟡'} Atividade ${analise.riskLevel}\n`;
    relatorio += `└── 🕐 Melhor janela: 20h-02h\n`;
    relatorio += `└── 📍 Direção: Norte/Nordeste\n\n`;
    
    relatorio += `📡 Fonte: NASA DONKI + IA Groq\n`;
    relatorio += `🤖 Sistema automático 24/7`;
    
    return relatorio;
}

/**
 * Calcula fase da lua simplificada
 */
function getFraseLua(dias) {
    if (dias <= 2) return '🌑 Nova (0% - céu escuro!)';
    if (dias <= 7) return '🌒 Crescente (25%)';
    if (dias <= 14) return '🌕 Cheia (100% - muita luz)';
    if (dias <= 21) return '🌖 Minguante (75%)';
    return '🌘 Minguante (25%)';
}

/**
 * Gera dica específica baseada nas condições
 */
function getDicaAstronomica(indicadores, diasLua) {
    if (indicadores.chanceAurora.brasil > 50) {
        return '🌈 CONFIGURAÇÃO AURORA: ISO 3200, 15-20s, f/2.8. Olhe para o NORTE!';
    }
    
    if (indicadores.kpMax <= 3 && diasLua <= 7) {
        return '🌌 NOITE PERFEITA! Lua fraca + atividade calma = ideal para Via Láctea!';
    }
    
    if (indicadores.classeFlare === 'X') {
        return '⚡ FLARE CLASSE X! Pode afetar equipamentos. Teste comunicações de backup.';
    }
    
    return '⭐ Condições normais. Bom momento para observação geral e fotografia lunar.';
}

// Executar se chamado diretamente
if (require.main === module) {
    gerarAlerteAstronomicoPersonalizado()
        .then(() => {
            console.log('🎉 Alerta astronômico concluído!');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Erro:', error);
            process.exit(1);
        });
}

module.exports = {
    gerarAlerteAstronomicoPersonalizado,
    calcularIndicadoresAstronomicos
};