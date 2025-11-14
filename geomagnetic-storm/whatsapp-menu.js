require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const { fetchSolarEvents } = require('./services/nasa.js');
const { generateAIAnalysis } = require('./services/ai-analysis.js');
const EventAnalysis = require('./technical-analysis.js');

/**
 * 🔭 SISTEMA INTERATIVO WHATSAPP PARA ASTRONOMIA
 * Menu completo com análises técnicas detalhadas
 */

class WhatsAppAstronomyBot {
    constructor() {
        this.WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
        this.WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
        this.MY_PHONE_NUMBER = process.env.MY_PHONE_NUMBER;
        this.userStates = new Map(); // Para controlar estado do usuário
    }

    /**
     * Envia mensagem para WhatsApp
     */
    async sendMessage(message) {
        try {
            const response = await axios.post(
                `https://graph.facebook.com/v18.0/${this.WHATSAPP_PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: this.MY_PHONE_NUMBER,
                    type: "text",
                    text: { body: message },
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.WHATSAPP_ACCESS_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Menu principal do sistema
     */
    async showMainMenu() {
        const menu = `🔭 ASTRONOMIA ESPACIAL - MENU PRINCIPAL

📡 *DADOS NASA EM TEMPO REAL*
Digite o número da opção:

1️⃣ 🌞 Atividade Solar Atual
2️⃣ ⚡ Tempestades Geomagnéticas (GST)
3️⃣ 🌪️ Ejeções de Massa Coronal (CME)
4️⃣ 🔥 Explosões Solares (FLR)
5️⃣ ⚡ Partículas Energéticas (SEP)
6️⃣ 🌊 Ventos Solares (HSS)
7️⃣ 📊 Análise Completa com IA
8️⃣ 🌈 Previsão de Auroras
9️⃣ 📅 Eventos por Período
🔟 🎯 Como Observar Eventos
1️⃣1️⃣ 📚 Guia Técnico Completo
1️⃣2️⃣ ⏰ Configurar Alertas

📋 *VER TODOS OS EVENTOS*:
1️⃣3️⃣ 📜 TODOS GST Detectados
1️⃣4️⃣ 📜 TODOS CME Detectados
1️⃣5️⃣ 📜 TODOS FLR Detectados
1️⃣6️⃣ 📜 TODOS SEP Detectados
1️⃣7️⃣ 📜 TODOS HSS Detectados
1️⃣8️⃣ 📜 LISTA COMPLETA (Todos)

Digite *MENU* a qualquer momento para voltar aqui
Digite *AJUDA* para instruções detalhadas`;

        await this.sendMessage(menu);
    }

    /**
     * Análise técnica de tempestades geomagnéticas
     */
    async analyzeGeomagneticStorms(events) {
        const gstEvents = events.filter(e => e.type === 'GST');
        
        if (gstEvents.length === 0) {
            return `🌞 *TEMPESTADES GEOMAGNÉTICAS (GST)*

✅ *STATUS ATUAL*: Atividade calma
📊 *EVENTOS DETECTADOS*: 0 nos últimos 7 dias

🔬 *O QUE SÃO*:
Perturbações no campo magnético terrestre causadas por ventos solares intensos.

📈 *SAZONALIDADE*:
• *MÁXIMO*: Equinócios (Mar/Set) - Campo magnético mais vulnerável
• *MÍNIMO*: Solstícios (Jun/Dez) - Menor incidência

⚡ *ESCALAS*:
• *G1* (Kp=5): Fraca - Auroras no norte do Canadá
• *G2* (Kp=6): Moderada - Auroras no sul do Canadá
• *G3* (Kp=7): Forte - Auroras nos EUA do Norte
• *G4* (Kp=8): Severa - Auroras até meio-oeste americano
• *G5* (Kp=9): Extrema - Auroras até o sul dos EUA

🔍 *COMO OBSERVAR*:
• *HORÁRIO*: 20h-02h (melhor janela)
• *DIREÇÃO*: Norte (hemisfério sul)
• *EQUIPAMENTO*: Câmera DSLR, ISO 1600-6400
• *EXPOSIÇÃO*: 10-30 segundos

🌍 *IMPACTOS*:
• Sistemas GPS podem ter precisão reduzida
• Comunicações de rádio HF afetadas
• Possíveis problemas em redes elétricas (eventos G4+)`;
        }

        let analysis = `🌞 *TEMPESTADES GEOMAGNÉTICAS (GST)*

🚨 *EVENTOS ATIVOS*: ${gstEvents.length} detectados!

`;

        gstEvents.slice(0, 3).forEach((event, index) => {
            const kp = this.extractKpIndex(event);
            const startTime = new Date(event.startTime || event.eventTime);
            const duration = this.calculateEventDuration(event);
            
            analysis += `⚡ *EVENTO ${index + 1}*:
📅 *Início*: ${startTime.toLocaleString('pt-BR')}
📊 *Índice Kp*: ${kp} (${this.getStormLevel(kp)})
⏱️ *Duração*: ${duration}
🌍 *Chance Aurora Brasil*: ${this.getAuroraChance(kp)}%

`;
        });

        analysis += `🔬 *ANÁLISE TÉCNICA*:
${this.getTechnicalGSTAnalysis(gstEvents)}

🎯 *PARA OBSERVAÇÃO*:
${this.getObservationTips('GST', gstEvents)}`;

        return analysis;
    }

    /**
     * Análise técnica de CMEs
     */
    async analyzeCMEs(events) {
        const cmeEvents = events.filter(e => e.type === 'CME');
        
        if (cmeEvents.length === 0) {
            return `🌪️ *EJEÇÕES DE MASSA CORONAL (CME)*

✅ *STATUS ATUAL*: Nenhuma CME detectada
📊 *EVENTOS*: 0 nos últimos 7 dias

🔬 *O QUE SÃO*:
Enormes bolhas de plasma e campo magnético ejetadas pelo Sol a velocidades de 20-3.200 km/s.

📈 *SAZONALIDADE*:
• *MÁXIMO SOLAR*: 2024-2026 - Até 5 CMEs/dia
• *MÍNIMO SOLAR*: 2029-2031 - 1 CME a cada poucos dias
• *PICOS*: Março-Abril e Setembro-Outubro

⚡ *CLASSIFICAÇÃO POR VELOCIDADE*:
• *LENTA*: <500 km/s - Sem impacto na Terra
• *MODERADA*: 500-1000 km/s - Pode causar auroras fracas
• *RÁPIDA*: 1000-2000 km/s - Tempestades geomagnéticas
• *EXTREMA*: >2000 km/s - Eventos G4-G5 garantidos

🕐 *TEMPO DE CHEGADA*:
• CME lenta: 3-5 dias
• CME rápida: 1-2 dias  
• CME extrema: 8-24 horas

🔍 *OBSERVAÇÃO*:
CMEs não são diretamente visíveis, mas causam:
• Auroras 1-3 dias depois
• Mudanças no vento solar (detectável por satélites)
• Perturbações no campo magnético terrestre`;
        }

        let analysis = `🌪️ *EJEÇÕES DE MASSA CORONAL (CME)*

🚨 *EVENTOS DETECTADOS*: ${cmeEvents.length}

`;

        cmeEvents.slice(0, 3).forEach((event, index) => {
            const speed = this.extractCMESpeed(event);
            const direction = this.extractCMEDirection(event);
            const arrivalTime = this.estimateArrivalTime(event, speed);
            
            analysis += `🌪️ *CME ${index + 1}*:
📅 *Erupção*: ${new Date(event.startTime || event.eventTime).toLocaleString('pt-BR')}
⚡ *Velocidade*: ${speed} km/s (${this.classifyCMESpeed(speed)})
🧭 *Direção*: ${direction}
🕐 *Chegada estimada*: ${arrivalTime}
⚠️ *Risco para Terra*: ${this.assessEarthRisk(direction, speed)}

`;
        });

        analysis += `🔬 *ANÁLISE TÉCNICA*:
${this.getTechnicalCMEAnalysis(cmeEvents)}

🎯 *IMPACTOS ESPERADOS*:
${this.getCMEImpactForecast(cmeEvents)}`;

        return analysis;
    }

    /**
     * Análise de Solar Flares (explosões solares)
     */
    async analyzeSolarFlares(events) {
        const flareEvents = events.filter(e => e.type === 'FLR');
        
        if (flareEvents.length === 0) {
            return `🔥 *EXPLOSÕES SOLARES (SOLAR FLARES)*

✅ *STATUS*: Atividade normal
📊 *EVENTOS*: 0 nos últimos 7 dias

🔬 *O QUE SÃO*:
Liberações súbitas de energia eletromagnética da atmosfera solar, durando minutos a horas.

📊 *CLASSIFICAÇÃO*:
• *Classe A*: <10⁻⁷ W/m² - Eventos de background
• *Classe B*: 10⁻⁷ a 10⁻⁶ W/m² - Eventos menores
• *Classe C*: 10⁻⁶ a 10⁻⁵ W/m² - Pequenos, poucos efeitos
• *Classe M*: 10⁻⁵ a 10⁻⁴ W/m² - Médios, apagões de rádio
• *Classe X*: >10⁻⁴ W/m² - Extremos, grandes impactos

📈 *SAZONALIDADE*:
• *MÁXIMO SOLAR*: 2024-2026 - Centenas de flares M e X por ano
• *MÍNIMO SOLAR*: 2029-2031 - Raros eventos classe M/X
• *CICLO DIÁRIO*: Mais comum entre 12h-18h UTC

⚡ *VELOCIDADE DA LUZ*:
Radiação chega à Terra em 8 minutos!

🔍 *OBSERVAÇÃO SEGURA*:
⚠️ *NUNCA* observe o Sol diretamente!
• Use telescópios solares com filtros adequados
• Monitore através de radiotelescópios
• Acompanhe via satélites (SDO, SOHO)

📡 *EQUIPAMENTOS AFETADOS*:
• Rádios HF (3-30 MHz) - Apagões durante flares M/X
• GPS - Degradação de precisão por horas
• Satélites - Possíveis danos em eventos X extremos`;
        }

        let analysis = `🔥 *EXPLOSÕES SOLARES (SOLAR FLARES)*

⚡ *EVENTOS DETECTADOS*: ${flareEvents.length}

`;

        flareEvents.slice(0, 3).forEach((event, index) => {
            const flareClass = this.extractFlareClass(event);
            const peakTime = this.extractPeakTime(event);
            const duration = this.calculateFlareDuration(event);
            const sourceRegion = this.extractSourceRegion(event);
            
            analysis += `🔥 *FLARE ${index + 1}*:
📅 *Detecção*: ${new Date(event.startTime || event.eventTime).toLocaleString('pt-BR')}
⚡ *Classe*: ${flareClass} (${this.classifyFlareIntensity(flareClass)})
🕐 *Pico*: ${peakTime}
⏱️ *Duração*: ${duration}
🎯 *Região Ativa*: ${sourceRegion}
📡 *Frequência afetada*: ${this.getAffectedFrequencies(flareClass)}

`;
        });

        analysis += `🔬 *ANÁLISE TÉCNICA*:
${this.getTechnicalFlareAnalysis(flareEvents)}

📱 *MONITORAMENTO*:
${this.getFlareMonitoringTips()}`;

        return analysis;
    }

    /**
     * Processamento de comando do usuário
     */
    async processCommand(command) {
        const events = await fetchSolarEvents();
        
        switch (command) {
            case '1':
                return await this.getCurrentSolarActivity(events);
            case '2':
                return await this.analyzeGeomagneticStorms(events);
            case '3':
                return await this.analyzeCMEs(events);
            case '4':
                return await this.analyzeSolarFlares(events);
            case '5':
                return await this.analyzeSEPEvents(events);
            case '6':
                return await this.analyzeHSSEvents(events);
            case '7':
                return await this.getCompleteAIAnalysis(events);
            case '8':
                return await this.getAuroraForecast(events);
            case '9':
                return await this.getEventsByPeriod();
            case '10':
                return await this.getObservationGuide();
            case '11':
                return await this.getTechnicalGuide();
            case '12':
                return await this.configureAlerts();
            case '13':
                return await this.listAllGSTEvents(events);
            case '14':
                return await this.listAllCMEEvents(events);
            case '15':
                return await this.listAllFLREvents(events);
            case '16':
                return await this.listAllSEPEvents(events);
            case '17':
                return await this.listAllHSSEvents(events);
            case '18':
                return await this.listAllEventsComplete(events);
            default:
                return "❌ Comando não reconhecido. Digite *MENU* para ver as opções.";
        }
    }

    // Métodos auxiliares para análise técnica
    extractKpIndex(event) {
        const text = JSON.stringify(event).toLowerCase();
        for (let kp = 9; kp >= 0; kp--) {
            if (text.includes(`kp${kp}`) || text.includes(`kp ${kp}`)) return kp;
        }
        return 4; // Default moderado
    }

    getStormLevel(kp) {
        if (kp >= 9) return "G5 - EXTREMA";
        if (kp >= 8) return "G4 - SEVERA";
        if (kp >= 7) return "G3 - FORTE";
        if (kp >= 6) return "G2 - MODERADA";
        if (kp >= 5) return "G1 - FRACA";
        return "G0 - CALMA";
    }

    getAuroraChance(kp) {
        const chances = { 9: 90, 8: 75, 7: 50, 6: 25, 5: 10 };
        return chances[kp] || 0;
    }

    extractCMESpeed(event) {
        const text = JSON.stringify(event);
        const speedMatch = text.match(/(\d+)\s*km\/s/i);
        return speedMatch ? speedMatch[1] : "Não informada";
    }

    classifyCMESpeed(speed) {
        const s = parseInt(speed);
        if (s > 2000) return "EXTREMA";
        if (s > 1000) return "RÁPIDA";
        if (s > 500) return "MODERADA";
        return "LENTA";
    }

    extractFlareClass(event) {
        const text = JSON.stringify(event);
        const classMatch = text.match(/[ABCMX]\d*\.?\d*/i);
        return classMatch ? classMatch[0].toUpperCase() : "Não classificado";
    }

    classifyFlareIntensity(flareClass) {
        const letter = flareClass.charAt(0);
        switch (letter) {
            case 'X': return "EXTREMA - Grandes impactos";
            case 'M': return "FORTE - Apagões de rádio";
            case 'C': return "MODERADA - Efeitos menores";
            case 'B': return "FRACA - Sem efeitos";
            case 'A': return "MÍNIMA - Background";
            default: return "Não classificada";
        }
    }

    async getCurrentSolarActivity(events) {
        const summary = `🌞 *ATIVIDADE SOLAR ATUAL*

📊 *RESUMO GERAL*:
• Total de eventos: ${events.length}
• GST (Tempestades): ${events.filter(e => e.type === 'GST').length}
• CME (Ejeções): ${events.filter(e => e.type === 'CME').length}
• FLR (Explosões): ${events.filter(e => e.type === 'FLR').length}
• SEP (Partículas): ${events.filter(e => e.type === 'SEP').length}
• HSS (Ventos): ${events.filter(e => e.type === 'HSS').length}

📈 *NÍVEL DE ATIVIDADE*:
${this.assessOverallActivity(events)}

🎯 *PRÓXIMAS 24H*:
${this.get24hForecast(events)}

Digite um número (2-6) para análise detalhada de cada tipo de evento.`;

        return summary;
    }

    assessOverallActivity(events) {
        const score = events.length;
        if (score > 50) return "🔴 MUITO ALTA - Múltiplos eventos simultâneos";
        if (score > 20) return "🟡 ALTA - Atividade intensa";
        if (score > 10) return "🟠 MODERADA - Atividade normal do máximo solar";
        if (score > 0) return "🟢 BAIXA - Atividade típica";
        return "⚪ MÍNIMA - Período calmo";
    }

    get24hForecast(events) {
        const cmeEvents = events.filter(e => e.type === 'CME');
        if (cmeEvents.length > 0) {
            return "⚠️ CMEs detectadas - possível aumento de atividade";
        }
        return "📉 Atividade estável prevista";
    }

    async analyzeSEPEvents(events) {
        return EventAnalysis.analyzeSEPEvents(events);
    }

    async analyzeHSSEvents(events) {
        return EventAnalysis.analyzeHSSEvents(events);
    }

    async getCompleteAIAnalysis(events) {
        console.log('🤖 Gerando análise completa com IA...');
        const aiAnalysis = await generateAIAnalysis(events);
        
        return `🤖 *ANÁLISE COMPLETA DE INTELIGÊNCIA ARTIFICIAL*

${aiAnalysis.fullAnalysis}

📊 *MÉTRICAS TÉCNICAS*:
• Eventos processados: ${aiAnalysis.eventsProcessed}
• Nível de risco: ${aiAnalysis.riskLevel.toUpperCase()}
• Timestamp: ${aiAnalysis.timestamp}
• Modo: ${aiAnalysis.mode}

🔬 *INTERPRETAÇÃO CIENTÍFICA*:
A análise considera correlações entre diferentes tipos de eventos, padrões sazonais e impactos em cascata para fornecer uma visão holística da atividade solar atual.

Digite *7* novamente para análise atualizada.`;
    }

    async getAuroraForecast(events) {
        return EventAnalysis.getAuroraForecast(events);
    }

    async getEventsByPeriod() {
        return EventAnalysis.getSeasonalEventInfo();
    }

    async getObservationGuide() {
        return EventAnalysis.getTechnicalObservationGuide();
    }

    async getTechnicalGuide() {
        return EventAnalysis.getTechnicalObservationGuide();
    }

    async configureAlerts() {
        return `⚠️ *CONFIGURAÇÃO DE ALERTAS*

Para receber alertas automáticos:

1️⃣ *Alertas de Aurora*:
   Digite: AURORA ON
   
2️⃣ *Alertas de Tempestades*:
   Digite: STORM ON
   
3️⃣ *Relatório Diário*:
   Digite: DAILY ON
   
4️⃣ *Desativar Alertas*:
   Digite: ALERTS OFF

📱 Alertas serão enviados automaticamente quando eventos importantes forem detectados!`;
    }

    /**
     * Lista TODOS os eventos GST detectados
     */
    async listAllGSTEvents(events) {
        const gstEvents = events.filter(e => e.type === 'GST');
        
        if (gstEvents.length === 0) {
            return `⚡ *TODOS OS EVENTOS GST*\n\n✅ Nenhuma tempestade geomagnética detectada nos últimos 7 dias.\n\n🔬 *INFORMAÇÃO TÉCNICA*:\nTempestades geomagnéticas são causadas por ventos solares intensos interagindo com a magnetosfera terrestre.`;
        }

        let report = `⚡ *TODOS OS EVENTOS GST DETECTADOS*\n\n📊 *TOTAL*: ${gstEvents.length} tempestades geomagnéticas\n\n`;

        gstEvents.forEach((event, index) => {
            const startTime = new Date(event.startTime || event.eventTime);
            const kp = this.extractKpIndex(event);
            const stormLevel = this.getStormLevel(kp);
            const duration = this.calculateEventDuration(event);
            
            report += `🌪️ *GST ${index + 1}*:\n`;
            report += `📅 *Data/Hora*: ${startTime.toLocaleString('pt-BR')}\n`;
            report += `⚡ *Índice Kp*: ${kp} (${stormLevel})\n`;
            report += `⏱️ *Duração*: ${duration}\n`;
            report += `🌈 *Aurora Brasil*: ${this.getAuroraChance(kp)}%\n`;
            
            // Detalhes técnicos específicos do evento
            if (event.allKpIndex && event.allKpIndex.length > 0) {
                const maxKpFromData = Math.max(...event.allKpIndex.map(kp => kp.kpIndex));
                report += `📈 *Kp Máximo Real*: ${maxKpFromData}\n`;
            }
            
            if (event.linkedEvents && event.linkedEvents.length > 0) {
                report += `🔗 *Eventos Relacionados*: ${event.linkedEvents.length}\n`;
            }
            
            report += `\n`;
        });

        report += `🔬 *ANÁLISE ESTATÍSTICA*:\n`;
        const kpValues = gstEvents.map(e => this.extractKpIndex(e));
        const avgKp = (kpValues.reduce((a, b) => a + b, 0) / kpValues.length).toFixed(1);
        const maxKp = Math.max(...kpValues);
        
        report += `• *Kp Médio*: ${avgKp}\n`;
        report += `• *Kp Máximo*: ${maxKp}\n`;
        report += `• *Intensidade*: ${this.getStormLevel(maxKp)}\n\n`;
        
        report += `📱 Digite *2* para análise técnica detalhada`;
        
        return report;
    }

    /**
     * Lista TODOS os eventos CME detectados
     */
    async listAllCMEEvents(events) {
        const cmeEvents = events.filter(e => e.type === 'CME');
        
        if (cmeEvents.length === 0) {
            return `🌪️ *TODOS OS EVENTOS CME*\n\n✅ Nenhuma ejeção de massa coronal detectada nos últimos 7 dias.\n\n🔬 *INFORMAÇÃO TÉCNICA*:\nCMEs são enormes bolhas de plasma ejetadas pelo Sol que podem causar tempestades geomagnéticas 1-3 dias depois.`;
        }

        let report = `🌪️ *TODOS OS EVENTOS CME DETECTADOS*\n\n📊 *TOTAL*: ${cmeEvents.length} ejeções de massa coronal\n\n`;

        cmeEvents.forEach((event, index) => {
            const startTime = new Date(event.startTime || event.eventTime);
            const speed = this.extractCMESpeed(event);
            const speedClass = this.classifyCMESpeed(speed);
            const direction = this.extractCMEDirection(event);
            const arrivalTime = this.estimateArrivalTime(event, speed);
            
            report += `🌪️ *CME ${index + 1}*:\n`;
            report += `📅 *Erupção*: ${startTime.toLocaleString('pt-BR')}\n`;
            report += `⚡ *Velocidade*: ${speed} km/s (${speedClass})\n`;
            report += `🧭 *Direção*: ${direction}\n`;
            report += `🕐 *Chegada*: ${arrivalTime}\n`;
            report += `⚠️ *Risco Terra*: ${this.assessEarthRisk(direction, speed)}\n`;
            
            // Dados específicos se disponíveis
            if (event.cmeAnalyses && event.cmeAnalyses.length > 0) {
                const analysis = event.cmeAnalyses[0];
                if (analysis.speed) {
                    report += `📐 *Velocidade Medida*: ${analysis.speed} km/s\n`;
                }
                if (analysis.halfAngle) {
                    report += `📏 *Ângulo*: ${analysis.halfAngle}°\n`;
                }
            }
            
            report += `\n`;
        });

        report += `🔬 *ANÁLISE ESTATÍSTICA*:\n`;
        const speeds = cmeEvents.map(e => parseInt(this.extractCMESpeed(e)));
        const avgSpeed = (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(0);
        const maxSpeed = Math.max(...speeds);
        const earthDirected = cmeEvents.filter(e => this.extractCMEDirection(e).includes('Terra')).length;
        
        report += `• *Velocidade Média*: ${avgSpeed} km/s\n`;
        report += `• *Velocidade Máxima*: ${maxSpeed} km/s\n`;
        report += `• *Direcionadas à Terra*: ${earthDirected}\n\n`;
        
        report += `📱 Digite *3* para análise técnica detalhada`;
        
        return report;
    }

    /**
     * Lista TODOS os eventos FLR (Solar Flares) detectados
     */
    async listAllFLREvents(events) {
        const flareEvents = events.filter(e => e.type === 'FLR');
        
        if (flareEvents.length === 0) {
            return `🔥 *TODOS OS EVENTOS FLR*\n\n✅ Nenhuma explosão solar detectada nos últimos 7 dias.\n\n🔬 *INFORMAÇÃO TÉCNICA*:\nExplosões solares liberam energia eletromagnética instantaneamente, chegando à Terra em 8 minutos.`;
        }

        let report = `🔥 *TODAS AS EXPLOSÕES SOLARES DETECTADAS*\n\n📊 *TOTAL*: ${flareEvents.length} explosões solares\n\n`;

        flareEvents.forEach((event, index) => {
            const startTime = new Date(event.startTime || event.eventTime);
            const flareClass = this.extractFlareClass(event);
            const intensity = this.classifyFlareIntensity(flareClass);
            const peakTime = this.extractPeakTime(event);
            const duration = this.calculateFlareDuration(event);
            const sourceRegion = this.extractSourceRegion(event);
            
            report += `🔥 *FLARE ${index + 1}*:\n`;
            report += `📅 *Início*: ${startTime.toLocaleString('pt-BR')}\n`;
            report += `⚡ *Classe*: ${flareClass} (${intensity})\n`;
            report += `🕐 *Pico*: ${peakTime}\n`;
            report += `⏱️ *Duração*: ${duration}\n`;
            report += `🎯 *Região Ativa*: ${sourceRegion}\n`;
            report += `📡 *Impacto Rádio*: ${this.getRadioImpact(flareClass)}\n`;
            
            // Dados específicos se disponíveis
            if (event.peakTime) {
                const peak = new Date(event.peakTime);
                report += `⚡ *Pico Exato*: ${peak.toLocaleTimeString('pt-BR')}\n`;
            }
            
            if (event.classType) {
                report += `🏷️ *Tipo*: ${event.classType}\n`;
            }
            
            report += `\n`;
        });

        report += `🔬 *ANÁLISE ESTATÍSTICA*:\n`;
        const classes = flareEvents.map(e => this.extractFlareClass(e));
        const xFlares = classes.filter(c => c.startsWith('X')).length;
        const mFlares = classes.filter(c => c.startsWith('M')).length;
        const cFlares = classes.filter(c => c.startsWith('C')).length;
        
        report += `• *Classe X (Extremas)*: ${xFlares}\n`;
        report += `• *Classe M (Fortes)*: ${mFlares}\n`;
        report += `• *Classe C (Moderadas)*: ${cFlares}\n`;
        report += `• *Mais Intensa*: ${this.getMostIntenseFlare(classes)}\n\n`;
        
        report += `📱 Digite *4* para análise técnica detalhada`;
        
        return report;
    }

    /**
     * Lista TODOS os eventos SEP detectados
     */
    async listAllSEPEvents(events) {
        const sepEvents = events.filter(e => e.type === 'SEP');
        
        if (sepEvents.length === 0) {
            return `⚡ *TODOS OS EVENTOS SEP*\n\n✅ Nenhum evento de partículas energéticas detectado nos últimos 7 dias.\n\n🔬 *INFORMAÇÃO TÉCNICA*:\nPartículas energéticas solares são prótons e elétrons acelerados por explosões solares que podem danificar equipamentos eletrônicos.`;
        }

        let report = `⚡ *TODOS OS EVENTOS SEP DETECTADOS*\n\n📊 *TOTAL*: ${sepEvents.length} eventos de partículas energéticas\n\n`;

        sepEvents.forEach((event, index) => {
            const startTime = new Date(event.startTime || event.eventTime);
            const energyLevel = this.extractEnergyLevel(event);
            const intensity = this.extractSEPIntensity(event);
            const sourceFlare = this.extractSourceFlare(event);
            const risk = this.assessSEPRisk(energyLevel, intensity);
            
            report += `⚡ *SEP ${index + 1}*:\n`;
            report += `📅 *Início*: ${startTime.toLocaleString('pt-BR')}\n`;
            report += `⚡ *Energia*: ${energyLevel} MeV\n`;
            report += `📊 *Intensidade*: ${intensity} prótons/cm²/s/sr\n`;
            report += `🔥 *Fonte*: ${sourceFlare}\n`;
            report += `⚠️ *Risco*: ${risk}\n`;
            report += `🛰️ *Impacto Satélites*: ${this.getSatelliteImpact(energyLevel)}\n`;
            
            // Dados específicos se disponíveis
            if (event.instruments && event.instruments.length > 0) {
                report += `🔬 *Detector*: ${event.instruments[0].displayName}\n`;
            }
            
            report += `\n`;
        });

        report += `🔬 *ANÁLISE ESTATÍSTICA*:\n`;
        const energies = sepEvents.map(e => parseInt(this.extractEnergyLevel(e) || '0'));
        const avgEnergy = energies.length > 0 ? (energies.reduce((a, b) => a + b, 0) / energies.length).toFixed(0) : '0';
        const maxEnergy = energies.length > 0 ? Math.max(...energies) : 0;
        const highEnergyEvents = energies.filter(e => e > 100).length;
        
        report += `• *Energia Média*: ${avgEnergy} MeV\n`;
        report += `• *Energia Máxima*: ${maxEnergy} MeV\n`;
        report += `• *Eventos >100 MeV*: ${highEnergyEvents}\n\n`;
        
        report += `📱 Digite *5* para análise técnica detalhada`;
        
        return report;
    }

    /**
     * Lista TODOS os eventos HSS detectados  
     */
    async listAllHSSEvents(events) {
        const hssEvents = events.filter(e => e.type === 'HSS');
        
        if (hssEvents.length === 0) {
            return `🌊 *TODOS OS EVENTOS HSS*\n\n✅ Nenhuma corrente de vento solar rápido detectada nos últimos 7 dias.\n\n🔬 *INFORMAÇÃO TÉCNICA*:\nVentos solares rápidos originam-se de buracos coronais e podem causar auroras suaves e prolongadas.`;
        }

        let report = `🌊 *TODAS AS CORRENTES HSS DETECTADAS*\n\n📊 *TOTAL*: ${hssEvents.length} correntes de vento solar rápido\n\n`;

        hssEvents.forEach((event, index) => {
            const startTime = new Date(event.startTime || event.eventTime);
            const speed = this.extractHSSSpeed(event);
            const speedClass = this.classifyHSSSpeed(speed);
            const duration = this.extractHSSDuration(event);
            const source = this.extractCoronalHoleSource(event);
            const auroraForecast = this.getHSSAuroraForecast(speed);
            
            report += `🌊 *HSS ${index + 1}*:\n`;
            report += `📅 *Início*: ${startTime.toLocaleString('pt-BR')}\n`;
            report += `💨 *Velocidade*: ${speed} km/s (${speedClass})\n`;
            report += `⏱️ *Duração*: ${duration}\n`;
            report += `🕳️ *Fonte*: ${source}\n`;
            report += `🌈 *Aurora*: ${auroraForecast}\n`;
            report += `🔄 *Recorrência*: ${this.getRecurrencePattern(event)}\n`;
            
            // Dados específicos se disponíveis
            if (event.instruments && event.instruments.length > 0) {
                report += `🔬 *Monitor*: ${event.instruments[0].displayName}\n`;
            }
            
            report += `\n`;
        });

        report += `🔬 *ANÁLISE ESTATÍSTICA*:\n`;
        const speeds = hssEvents.map(e => parseInt(this.extractHSSSpeed(e)));
        const avgSpeed = (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(0);
        const maxSpeed = Math.max(...speeds);
        const highSpeedEvents = speeds.filter(s => s > 600).length;
        
        report += `• *Velocidade Média*: ${avgSpeed} km/s\n`;
        report += `• *Velocidade Máxima*: ${maxSpeed} km/s\n`;
        report += `• *Eventos >600 km/s*: ${highSpeedEvents}\n\n`;
        
        report += `📱 Digite *6* para análise técnica detalhada`;
        
        return report;
    }

    /**
     * Lista TODOS os eventos de todos os tipos
     */
    async listAllEventsComplete(events) {
        if (events.length === 0) {
            return `📋 *LISTA COMPLETA DE EVENTOS*\n\n✅ Nenhum evento solar detectado nos últimos 7 dias.\n\n🌞 Período de atividade solar calma.`;
        }

        let report = `📋 *LISTA COMPLETA - TODOS OS EVENTOS*\n\n📊 *RESUMO GERAL*:\n`;
        
        const eventTypes = ['GST', 'CME', 'FLR', 'SEP', 'HSS'];
        eventTypes.forEach(type => {
            const count = events.filter(e => e.type === type).length;
            const icon = this.getEventIcon(type);
            report += `• ${icon} *${type}*: ${count} eventos\n`;
        });
        
        report += `\n🕐 *CRONOLOGIA COMPLETA*:\n\n`;
        
        // Ordenar eventos por data
        const sortedEvents = events.sort((a, b) => {
            const dateA = new Date(a.startTime || a.eventTime);
            const dateB = new Date(b.startTime || b.eventTime);
            return dateB - dateA; // Mais recente primeiro
        });

        sortedEvents.forEach((event, index) => {
            const date = new Date(event.startTime || event.eventTime);
            const icon = this.getEventIcon(event.type);
            
            report += `${icon} *${event.type}* - ${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}\n`;
            
            // Detalhes específicos por tipo
            if (event.type === 'GST') {
                const kp = this.extractKpIndex(event);
                report += `   ⚡ Kp: ${kp} (${this.getStormLevel(kp)})\n`;
            } else if (event.type === 'CME') {
                const speed = this.extractCMESpeed(event);
                report += `   💨 ${speed} km/s (${this.classifyCMESpeed(speed)})\n`;
            } else if (event.type === 'FLR') {
                const flareClass = this.extractFlareClass(event);
                report += `   🔥 Classe ${flareClass} (${this.classifyFlareIntensity(flareClass).split(' - ')[0]})\n`;
            } else if (event.type === 'SEP') {
                const energy = this.extractEnergyLevel(event);
                report += `   ⚡ ${energy} MeV\n`;
            } else if (event.type === 'HSS') {
                const speed = this.extractHSSSpeed(event);
                report += `   🌊 ${speed} km/s (${this.classifyHSSSpeed(speed)})\n`;
            }
            
            report += `\n`;
        });

        report += `🔬 *ANÁLISE GLOBAL*:\n`;
        report += `• *Período*: Últimos 7 dias\n`;
        report += `• *Total de eventos*: ${events.length}\n`;
        report += `• *Nível de atividade*: ${this.assessOverallActivity(events)}\n`;
        report += `• *Tendência*: ${this.getActivityTrend(events)}\n\n`;
        
        report += `📱 Digite 1-6 para análises específicas por tipo`;
        
        return report;
    }

    // Métodos auxiliares adicionais
    calculateEventDuration(event) {
        if (event.endTime && event.startTime) {
            const start = new Date(event.startTime);
            const end = new Date(event.endTime);
            const durationHours = Math.abs(end - start) / (1000 * 60 * 60);
            return `${durationHours.toFixed(1)}h`;
        }
        return "Em andamento";
    }

    extractPeakTime(event) {
        if (event.peakTime) {
            return new Date(event.peakTime).toLocaleTimeString('pt-BR');
        }
        return "Não disponível";
    }

    calculateFlareDuration(event) {
        if (event.endTime && event.startTime) {
            const start = new Date(event.startTime);
            const end = new Date(event.endTime);
            const durationMinutes = Math.abs(end - start) / (1000 * 60);
            return `${durationMinutes.toFixed(0)} min`;
        }
        return "Em andamento";
    }

    extractSourceRegion(event) {
        if (event.activeRegionNum) {
            return `AR ${event.activeRegionNum}`;
        }
        return "Não identificada";
    }

    getRadioImpact(flareClass) {
        const letter = flareClass.charAt(0);
        switch (letter) {
            case 'X': return "Apagão HF severo";
            case 'M': return "Apagão HF moderado";
            case 'C': return "Interferência menor";
            default: return "Sem impacto";
        }
    }

    getMostIntenseFlare(classes) {
        const xFlares = classes.filter(c => c.startsWith('X'));
        if (xFlares.length > 0) {
            return xFlares.reduce((max, current) => {
                const maxNum = parseFloat(max.substring(1)) || 0;
                const currentNum = parseFloat(current.substring(1)) || 0;
                return currentNum > maxNum ? current : max;
            });
        }
        const mFlares = classes.filter(c => c.startsWith('M'));
        if (mFlares.length > 0) return mFlares[0];
        return classes[0] || "N/A";
    }

    estimateArrivalTime(event, speed) {
        const s = parseInt(speed) || 500;
        const hours = Math.floor(150000000 / (s * 3.6)); // Aproximação Terra-Sol
        const arrival = new Date(Date.now() + hours * 60 * 60 * 1000);
        return arrival.toLocaleDateString('pt-BR');
    }

    assessEarthRisk(direction, speed) {
        if (direction.includes('Terra')) {
            const s = parseInt(speed);
            if (s > 1500) return "ALTO - G3/G4 provável";
            if (s > 1000) return "MODERADO - G1/G2 possível";
            return "BAIXO - Efeitos menores";
        }
        return "MÍNIMO - Não direcionada";
    }

    getEventIcon(type) {
        const icons = {
            'GST': '⚡',
            'CME': '🌪️',
            'FLR': '🔥',
            'SEP': '⚡',
            'HSS': '🌊'
        };
        return icons[type] || '📡';
    }

    getActivityTrend(events) {
        // Análise simples de tendência baseada na distribuição temporal
        const now = Date.now();
        const last24h = events.filter(e => {
            const eventTime = new Date(e.startTime || e.eventTime);
            return (now - eventTime.getTime()) <= 24 * 60 * 60 * 1000;
        }).length;
        
        const last48h = events.filter(e => {
            const eventTime = new Date(e.startTime || e.eventTime);
            return (now - eventTime.getTime()) <= 48 * 60 * 60 * 1000;
        }).length;
        
        if (last24h > last48h / 2) return "CRESCENTE";
        if (last24h < last48h / 3) return "DECRESCENTE";
        return "ESTÁVEL";
    }

    // Métodos auxiliares adicionais...
    getTechnicalGSTAnalysis(events) {
        return `• Distúrbio causado por interação vento solar-magnetosfera
• Intensidade medida pelo índice Kp (0-9)
• Correlação com velocidade do vento solar (>400 km/s)
• Duração típica: 6-72 horas`;
    }

    getObservationTips(eventType, events) {
        switch(eventType) {
            case 'GST':
                return `• Use apps: Aurora Forecast, SpaceWeatherLive
• Câmera: ISO 1600-6400, 10-30s exposição
• Melhor horário: 20h-02h local
• Direção: Norte (hemisfério sul)`;
            default:
                return "• Consulte guias específicos para cada evento";
        }
    }
}

// Sistema principal
async function startWhatsAppBot() {
    const bot = new WhatsAppAstronomyBot();
    
    console.log('🔭 Bot WhatsApp de Astronomia iniciado!');
    console.log('📱 Enviando menu principal...');
    
    try {
        await bot.showMainMenu();
        console.log('✅ Menu enviado com sucesso!');
        console.log('💬 Aguardando comandos do usuário...');
        
        // Simular alguns comandos para demonstração
        console.log('\n📋 Comandos disponíveis para teste:');
        console.log('node whatsapp-menu.js 1  # Atividade solar atual');
        console.log('node whatsapp-menu.js 2  # Tempestades geomagnéticas');
        console.log('node whatsapp-menu.js 3  # Ejeções de massa coronal');
        
    } catch (error) {
        console.error('❌ Erro:', error);
    }
}

// Processar comando se fornecido
if (process.argv[2]) {
    const bot = new WhatsAppAstronomyBot();
    bot.processCommand(process.argv[2]).then(response => {
        console.log('\n📱 Resposta:');
        console.log(response);
        bot.sendMessage(response);
    });
} else {
    startWhatsAppBot();
}

module.exports = { WhatsAppAstronomyBot };