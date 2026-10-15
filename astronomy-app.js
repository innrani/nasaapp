#!/usr/bin/env node

/**
 * 🔭 ASTRONOMY ALERTS APP
 * Sistema completo para astrônomos amadores com menu interativo
 */

const path = require('path');
const { spawn } = require('child_process');
const { fetchSolarEvents } = require('./geomagnetic-storm/services/nasa.js');
const { generateAIAnalysis } = require('./geomagnetic-storm/services/ai-analysis.js');
const EventAnalysis = require('./geomagnetic-storm/technical-analysis.js');

console.log('🔭 ASTRONOMY ALERTS - Sistema Completo para Astrônomos');
console.log('='.repeat(70));

class AstronomyTerminalApp {
    constructor() {
        this.events = [];
        this.loadConfiguration();
    }

    loadConfiguration() {
        require('dotenv').config();
        
        const requiredVars = ['NASA_API_KEY', 'WHATSAPP_ACCESS_TOKEN', 'MY_PHONE_NUMBER'];
        const missing = requiredVars.filter(v => !process.env[v]);
        
        if (missing.length > 0) {
            console.log('⚠️  CONFIGURAÇÃO INCOMPLETA:');
            missing.forEach(v => console.log(`❌ ${v} não configurado`));
            console.log('\n📝 Configure o arquivo .env antes de usar o app.');
            console.log('📖 Veja ASTRONOMY-HOBBYISTAS.md para instruções.\n');
        } else {
            console.log('✅ Configuração OK! NASA + WhatsApp + Groq AI prontos.\n');
        }
    }

    async showMainMenu() {
        console.clear();
        console.log('🔭 ASTRONOMIA ESPACIAL - TERMINAL INTERATIVO\n');
        console.log('📡 DADOS NASA EM TEMPO REAL');
        console.log('Digite o número da opção:\n');
        
        console.log('1️⃣  🌞 Atividade Solar Atual');
        console.log('2️⃣  ⚡ Tempestades Geomagnéticas (GST)');
        console.log('3️⃣  🌪️ Ejeções de Massa Coronal (CME)');
        console.log('4️⃣  🔥 Explosões Solares (FLR)');
        console.log('5️⃣  ⚡ Partículas Energéticas (SEP)');
        console.log('6️⃣  🌊 Ventos Solares (HSS)');
        console.log('7️⃣  🤖 Análise Completa com IA');
        console.log('8️⃣  🌈 Previsão de Auroras');
        console.log('9️⃣  📅 Eventos por Período');
        console.log('10 📚 Guia Técnico Completo');
        console.log('11 📱 Enviar por WhatsApp\n');
        
        console.log('📋 VER TODOS OS EVENTOS:');
        console.log('13 📜 TODOS GST Detectados');
        console.log('14 📜 TODOS CME Detectados');
        console.log('15 📜 TODOS FLR Detectados');
        console.log('16 📜 TODOS SEP Detectados');
        console.log('17 📜 TODOS HSS Detectados');
        console.log('18 📜 LISTA COMPLETA (Todos)\n');
        
        console.log('0️⃣  🚪 Sair\n');
        
        this.getUserInput();
    }

    async loadSolarData() {
        if (this.events.length === 0) {
            console.log('📡 Carregando dados solares da NASA...');
            try {
                this.events = await fetchSolarEvents();
                console.log(`✅ ${this.events.length} eventos carregados!\n`);
            } catch (error) {
                console.log('❌ Erro ao carregar dados:', error.message);
                this.events = [];
            }
        }
        return this.events;
    }

    async processCommand(command) {
        await this.loadSolarData();
        
        switch (command) {
            case '1':
                return await this.getCurrentSolarActivity(this.events);
            case '2':
                return await this.analyzeGeomagneticStorms(this.events);
            case '3':
                return await this.analyzeCMEs(this.events);
            case '4':
                return await this.analyzeSolarFlares(this.events);
            case '5':
                return await EventAnalysis.analyzeSEPEvents(this.events);
            case '6':
                return await EventAnalysis.analyzeHSSEvents(this.events);
            case '7':
                return await this.getCompleteAIAnalysis(this.events);
            case '8':
                return await EventAnalysis.getAuroraForecast(this.events);
            case '9':
                return await EventAnalysis.getSeasonalEventInfo();
            case '10':
                return await EventAnalysis.getTechnicalObservationGuide();
            case '11':
                return await this.sendToWhatsApp();
            case '13':
                return await this.listAllGSTEvents(this.events);
            case '14':
                return await this.listAllCMEEvents(this.events);
            case '15':
                return await this.listAllFLREvents(this.events);
            case '16':
                return await this.listAllSEPEvents(this.events);
            case '17':
                return await this.listAllHSSEvents(this.events);
            case '18':
                return await this.listAllEventsComplete(this.events);
            default:
                return "❌ Comando não reconhecido.";
        }
    }

    async getCurrentSolarActivity(events) {
        console.log('🌞 ATIVIDADE SOLAR ATUAL\n');
        console.log('📊 RESUMO GERAL:');
        console.log(`• Total de eventos: ${events.length}`);
        console.log(`• GST (Tempestades): ${events.filter(e => e.type === 'GST').length}`);
        console.log(`• CME (Ejeções): ${events.filter(e => e.type === 'CME').length}`);
        console.log(`• FLR (Explosões): ${events.filter(e => e.type === 'FLR').length}`);
        console.log(`• SEP (Partículas): ${events.filter(e => e.type === 'SEP').length}`);
        console.log(`• HSS (Ventos): ${events.filter(e => e.type === 'HSS').length}\n`);
        
        console.log(`📈 NÍVEL DE ATIVIDADE: ${this.assessOverallActivity(events)}`);
        console.log(`🎯 PRÓXIMAS 24H: ${this.get24hForecast(events)}\n`);
        
        console.log('Digite 2-6 para análise detalhada de cada tipo de evento.');
        return true;
    }

    async analyzeGeomagneticStorms(events) {
        const gstEvents = events.filter(e => e.type === 'GST');
        
        console.log('⚡ TEMPESTADES GEOMAGNÉTICAS (GST)\n');
        
        if (gstEvents.length === 0) {
            console.log('✅ STATUS: Atividade calma');
            console.log('📊 EVENTOS: 0 nos últimos 7 dias\n');
            
            console.log('🔬 O QUE SÃO:');
            console.log('Perturbações no campo magnético terrestre causadas por ventos solares intensos.\n');
            
            console.log('📈 SAZONALIDADE:');
            console.log('• MÁXIMO: Equinócios (Mar/Set) - Campo magnético mais vulnerável');
            console.log('• MÍNIMO: Solstícios (Jun/Dez) - Menor incidência\n');
            
            console.log('⚡ ESCALAS:');
            console.log('• G1 (Kp=5): Fraca - Auroras no norte do Canadá');
            console.log('• G2 (Kp=6): Moderada - Auroras no sul do Canadá');
            console.log('• G3 (Kp=7): Forte - Auroras nos EUA do Norte');
            console.log('• G4 (Kp=8): Severa - Auroras até meio-oeste americano');
            console.log('• G5 (Kp=9): Extrema - Auroras até o sul dos EUA');
            return true;
        }

        console.log(`🚨 EVENTOS ATIVOS: ${gstEvents.length} detectados!\n`);

        gstEvents.slice(0, 5).forEach((event, index) => {
            const kp = this.extractKpIndex(event);
            const startTime = new Date(event.startTime || event.eventTime);
            const duration = this.calculateEventDuration(event);
            
            console.log(`⚡ EVENTO ${index + 1}:`);
            console.log(`📅 Início: ${startTime.toLocaleString('pt-BR')}`);
            console.log(`📊 Índice Kp: ${kp} (${this.getStormLevel(kp)})`);
            console.log(`⏱️ Duração: ${duration}`);
            console.log(`🌍 Chance Aurora Brasil: ${this.getAuroraChance(kp)}%\n`);
        });

        console.log('🔬 ANÁLISE TÉCNICA:');
        console.log('• Distúrbio causado por interação vento solar-magnetosfera');
        console.log('• Intensidade medida pelo índice Kp (0-9)');
        console.log('• Correlação com velocidade do vento solar (>400 km/s)');
        console.log('• Duração típica: 6-72 horas');
        return true;
    }

    async analyzeCMEs(events) {
        const cmeEvents = events.filter(e => e.type === 'CME');
        
        console.log('🌪️ EJEÇÕES DE MASSA CORONAL (CME)\n');
        
        if (cmeEvents.length === 0) {
            console.log('✅ STATUS: Nenhuma CME detectada');
            console.log('📊 EVENTOS: 0 nos últimos 7 dias\n');
            
            console.log('🔬 O QUE SÃO:');
            console.log('Enormes bolhas de plasma e campo magnético ejetadas pelo Sol a velocidades de 20-3.200 km/s.\n');
            
            console.log('📈 SAZONALIDADE:');
            console.log('• MÁXIMO SOLAR: 2024-2026 - Até 5 CMEs/dia');
            console.log('• MÍNIMO SOLAR: 2029-2031 - 1 CME a cada poucos dias');
            console.log('• PICOS: Março-Abril e Setembro-Outubro\n');
            
            console.log('⚡ CLASSIFICAÇÃO POR VELOCIDADE:');
            console.log('• LENTA: <500 km/s - Sem impacto na Terra');
            console.log('• MODERADA: 500-1000 km/s - Pode causar auroras fracas');
            console.log('• RÁPIDA: 1000-2000 km/s - Tempestades geomagnéticas');
            console.log('• EXTREMA: >2000 km/s - Eventos G4-G5 garantidos');
            return true;
        }

        console.log(`🚨 EVENTOS DETECTADOS: ${cmeEvents.length}\n`);

        cmeEvents.slice(0, 5).forEach((event, index) => {
            const speed = this.extractCMESpeed(event);
            const direction = this.extractCMEDirection(event);
            const arrivalTime = this.estimateArrivalTime(event, speed);
            
            console.log(`🌪️ CME ${index + 1}:`);
            console.log(`📅 Erupção: ${new Date(event.startTime || event.eventTime).toLocaleString('pt-BR')}`);
            console.log(`⚡ Velocidade: ${speed} km/s (${this.classifyCMESpeed(speed)})`);
            console.log(`🧭 Direção: ${direction}`);
            console.log(`🕐 Chegada estimada: ${arrivalTime}`);
            console.log(`⚠️ Risco para Terra: ${this.assessEarthRisk(direction, speed)}\n`);
        });
        
        return true;
    }

    async analyzeSolarFlares(events) {
        const flareEvents = events.filter(e => e.type === 'FLR');
        
        console.log('🔥 EXPLOSÕES SOLARES (SOLAR FLARES)\n');
        
        if (flareEvents.length === 0) {
            console.log('✅ STATUS: Atividade normal');
            console.log('📊 EVENTOS: 0 nos últimos 7 dias\n');
            
            console.log('🔬 O QUE SÃO:');
            console.log('Liberações súbitas de energia eletromagnética da atmosfera solar, durando minutos a horas.\n');
            
            console.log('📊 CLASSIFICAÇÃO:');
            console.log('• Classe A: <10⁻⁷ W/m² - Eventos de background');
            console.log('• Classe B: 10⁻⁷ a 10⁻⁶ W/m² - Eventos menores');
            console.log('• Classe C: 10⁻⁶ a 10⁻⁵ W/m² - Pequenos, poucos efeitos');
            console.log('• Classe M: 10⁻⁵ a 10⁻⁴ W/m² - Médios, apagões de rádio');
            console.log('• Classe X: >10⁻⁴ W/m² - Extremos, grandes impactos');
            return true;
        }

        console.log(`⚡ EVENTOS DETECTADOS: ${flareEvents.length}\n`);

        flareEvents.slice(0, 5).forEach((event, index) => {
            const flareClass = this.extractFlareClass(event);
            const peakTime = this.extractPeakTime(event);
            const duration = this.calculateFlareDuration(event);
            const sourceRegion = this.extractSourceRegion(event);
            
            console.log(`🔥 FLARE ${index + 1}:`);
            console.log(`📅 Detecção: ${new Date(event.startTime || event.eventTime).toLocaleString('pt-BR')}`);
            console.log(`⚡ Classe: ${flareClass} (${this.classifyFlareIntensity(flareClass)})`);
            console.log(`🕐 Pico: ${peakTime}`);
            console.log(`⏱️ Duração: ${duration}`);
            console.log(`🎯 Região Ativa: ${sourceRegion}`);
            console.log(`📡 Frequência afetada: ${this.getAffectedFrequencies(flareClass)}\n`);
        });
        
        return true;
    }

    async getCompleteAIAnalysis(events) {
        console.log('🤖 GERANDO ANÁLISE COMPLETA COM IA...\n');

        if (!Array.isArray(events) || events.length === 0) {
            console.log('📊 Nenhum evento foi carregado para análise.');
            console.log('Isso pode acontecer porque não há eventos no período consultado ou porque a API NASA retornou vazio.');
            console.log('👉 Ação recomendada: repetir a consulta em alguns minutos ou verificar o intervalo de datas.\n');
            console.log('🤖 ANÁLISE DE INTELIGÊNCIA ARTIFICIAL\n');
            console.log('📊 NENHUM EVENTO SOLAR DETECTADO');
            console.log('Não há registros significativos no intervalo consultado.');
            return true;
        }
        
        try {
            const aiAnalysis = await generateAIAnalysis(events);
            
            console.log('🤖 ANÁLISE DE INTELIGÊNCIA ARTIFICIAL\n');
            console.log(aiAnalysis.fullAnalysis);
            console.log('\n📊 MÉTRICAS TÉCNICAS:');
            console.log(`• Eventos processados: ${aiAnalysis.eventsProcessed}`);
            console.log(`• Nível de risco: ${aiAnalysis.riskLevel.toUpperCase()}`);
            console.log(`• Timestamp: ${aiAnalysis.timestamp}`);
            console.log(`• Modo: ${aiAnalysis.mode}\n`);
            
            console.log('🔬 INTERPRETAÇÃO CIENTÍFICA:');
            console.log('A análise considera correlações entre diferentes tipos de eventos, padrões sazonais');
            console.log('e impactos em cascata para fornecer uma visão holística da atividade solar atual.');
            
        } catch (error) {
            console.log('❌ Erro na análise de IA:', error.message);
        }
        
        return true;
    }

    async sendToWhatsApp() {
        console.log('📱 ENVIANDO RELATÓRIO PARA WHATSAPP...\n');
        
        const WhatsAppBot = require('./geomagnetic-storm/whatsapp-menu.js').WhatsAppAstronomyBot;
        const bot = new WhatsAppBot();
        
        try {
            const summary = await this.getCurrentSolarActivity(this.events);
            await bot.sendMessage("🔭 Relatório astronômico enviado via terminal!");
            console.log('✅ Relatório enviado com sucesso!');
        } catch (error) {
            console.log('❌ Erro ao enviar:', error.message);
        }
        
        return true;
    }

    // Implementação de todos os métodos de listagem (similar ao whatsapp-menu)
    async listAllGSTEvents(events) {
        const gstEvents = events.filter(e => e.type === 'GST');
        
        console.log('⚡ TODOS OS EVENTOS GST DETECTADOS\n');
        console.log(`📊 TOTAL: ${gstEvents.length} tempestades geomagnéticas\n`);

        if (gstEvents.length === 0) {
            console.log('✅ Nenhuma tempestade geomagnética detectada nos últimos 7 dias.');
            return true;
        }

        gstEvents.forEach((event, index) => {
            const startTime = new Date(event.startTime || event.eventTime);
            const kp = this.extractKpIndex(event);
            const stormLevel = this.getStormLevel(kp);
            const duration = this.calculateEventDuration(event);
            
            console.log(`🌪️ GST ${index + 1}:`);
            console.log(`📅 Data/Hora: ${startTime.toLocaleString('pt-BR')}`);
            console.log(`⚡ Índice Kp: ${kp} (${stormLevel})`);
            console.log(`⏱️ Duração: ${duration}`);
            console.log(`🌈 Aurora Brasil: ${this.getAuroraChance(kp)}%\n`);
        });

        console.log('🔬 ANÁLISE ESTATÍSTICA:');
        const kpValues = gstEvents.map(e => this.extractKpIndex(e));
        const avgKp = (kpValues.reduce((a, b) => a + b, 0) / kpValues.length).toFixed(1);
        const maxKp = Math.max(...kpValues);
        
        console.log(`• Kp Médio: ${avgKp}`);
        console.log(`• Kp Máximo: ${maxKp}`);
        console.log(`• Intensidade: ${this.getStormLevel(maxKp)}`);
        
        return true;
    }

    async listAllCMEEvents(events) {
        const cmeEvents = events.filter(e => e.type === 'CME');
        
        console.log('🌪️ TODOS OS EVENTOS CME DETECTADOS\n');
        console.log(`📊 TOTAL: ${cmeEvents.length} ejeções de massa coronal\n`);

        if (cmeEvents.length === 0) {
            console.log('✅ Nenhuma ejeção de massa coronal detectada nos últimos 7 dias.');
            return true;
        }

        cmeEvents.forEach((event, index) => {
            const startTime = new Date(event.startTime || event.eventTime);
            const speed = this.extractCMESpeed(event);
            const speedClass = this.classifyCMESpeed(speed);
            const direction = this.extractCMEDirection(event);
            const arrivalTime = this.estimateArrivalTime(event, speed);
            
            console.log(`🌪️ CME ${index + 1}:`);
            console.log(`📅 Erupção: ${startTime.toLocaleString('pt-BR')}`);
            console.log(`⚡ Velocidade: ${speed} km/s (${speedClass})`);
            console.log(`🧭 Direção: ${direction}`);
            console.log(`🕐 Chegada: ${arrivalTime}`);
            console.log(`⚠️ Risco Terra: ${this.assessEarthRisk(direction, speed)}\n`);
        });

        return true;
    }

    async listAllFLREvents(events) {
        const flareEvents = events.filter(e => e.type === 'FLR');
        
        console.log('🔥 TODAS AS EXPLOSÕES SOLARES DETECTADAS\n');
        console.log(`📊 TOTAL: ${flareEvents.length} explosões solares\n`);

        if (flareEvents.length === 0) {
            console.log('✅ Nenhuma explosão solar detectada nos últimos 7 dias.');
            return true;
        }

        flareEvents.forEach((event, index) => {
            const startTime = new Date(event.startTime || event.eventTime);
            const flareClass = this.extractFlareClass(event);
            const intensity = this.classifyFlareIntensity(flareClass);
            const peakTime = this.extractPeakTime(event);
            const duration = this.calculateFlareDuration(event);
            
            console.log(`🔥 FLARE ${index + 1}:`);
            console.log(`📅 Início: ${startTime.toLocaleString('pt-BR')}`);
            console.log(`⚡ Classe: ${flareClass} (${intensity})`);
            console.log(`🕐 Pico: ${peakTime}`);
            console.log(`⏱️ Duração: ${duration}\n`);
        });

        return true;
    }

    async listAllSEPEvents(events) {
        return await EventAnalysis.analyzeSEPEvents(events);
    }

    async listAllHSSEvents(events) {
        return await EventAnalysis.analyzeHSSEvents(events);
    }

    async listAllEventsComplete(events) {
        console.log('📋 LISTA COMPLETA - TODOS OS EVENTOS\n');
        
        if (events.length === 0) {
            console.log('✅ Nenhum evento solar detectado nos últimos 7 dias.');
            console.log('🌞 Período de atividade solar calma.');
            return true;
        }

        console.log('📊 RESUMO GERAL:');
        const eventTypes = ['GST', 'CME', 'FLR', 'SEP', 'HSS'];
        eventTypes.forEach(type => {
            const count = events.filter(e => e.type === type).length;
            const icon = this.getEventIcon(type);
            console.log(`• ${icon} ${type}: ${count} eventos`);
        });
        
        console.log('\n🕐 CRONOLOGIA COMPLETA:\n');
        
        // Ordenar eventos por data
        const sortedEvents = events.sort((a, b) => {
            const dateA = new Date(a.startTime || a.eventTime);
            const dateB = new Date(b.startTime || b.eventTime);
            return dateB - dateA; // Mais recente primeiro
        });

        sortedEvents.slice(0, 20).forEach((event, index) => { // Limitar para não sobrecarregar terminal
            const date = new Date(event.startTime || event.eventTime);
            const icon = this.getEventIcon(event.type);
            
            console.log(`${icon} ${event.type} - ${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`);
            
            // Detalhes específicos por tipo
            if (event.type === 'GST') {
                const kp = this.extractKpIndex(event);
                console.log(`   ⚡ Kp: ${kp} (${this.getStormLevel(kp)})`);
            } else if (event.type === 'CME') {
                const speed = this.extractCMESpeed(event);
                console.log(`   💨 ${speed} km/s (${this.classifyCMESpeed(speed)})`);
            } else if (event.type === 'FLR') {
                const flareClass = this.extractFlareClass(event);
                console.log(`   🔥 Classe ${flareClass}`);
            }
            console.log('');
        });

        console.log('🔬 ANÁLISE GLOBAL:');
        console.log(`• Período: Últimos 7 dias`);
        console.log(`• Total de eventos: ${events.length}`);
        console.log(`• Nível de atividade: ${this.assessOverallActivity(events)}`);
        console.log(`• Tendência: ${this.getActivityTrend(events)}`);
        
        return true;
    }

    getUserInput() {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('\nEscolha uma opção: ', async (answer) => {
            const command = answer.trim();
            
            if (command === '0') {
                console.log('👋 Até logo! Bons céus escuros!');
                rl.close();
                process.exit(0);
                return;
            }
            
            try {
                await this.processCommand(command);
            } catch (error) {
                console.log('❌ Erro:', error.message);
            }
            
            console.log('\n' + '='.repeat(70));
            rl.close();
            setTimeout(() => this.showMainMenu(), 1000);
        });
    }

    // Métodos auxiliares (copiados do whatsapp-menu.js)
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

    extractCMEDirection(event) {
        const text = JSON.stringify(event).toLowerCase();
        if (text.includes('earth') || text.includes('halo')) return "Direcionada à Terra";
        return "Não direcionada à Terra";
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

    getAffectedFrequencies(flareClass) {
        const letter = flareClass.charAt(0);
        switch (letter) {
            case 'X': return "HF (3-30 MHz) - Apagão severo";
            case 'M': return "HF (3-30 MHz) - Apagão moderado";
            case 'C': return "HF alta - Interferência menor";
            default: return "Sem impacto significativo";
        }
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
}

// Inicializar aplicação
const app = new AstronomyTerminalApp();

// Mostrar banner inicial
console.log('🌌 Monitoramento completo de atividade solar para observação astronômica');
console.log('🤖 Powered by NASA DONKI + Groq AI + Análises Técnicas Detalhadas');
console.log('📱 Alertas via WhatsApp + Terminal Interativo\n');

// Iniciar menu principal
app.showMainMenu();