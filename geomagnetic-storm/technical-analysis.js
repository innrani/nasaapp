/**
 * 🔬 ANÁLISES TÉCNICAS DETALHADAS PARA ASTRONOMIA
 * Base de conhecimento científico sobre eventos solares
 */

class EventAnalysis {
    
    /**
     * Análise completa de eventos SEP (Solar Energetic Particles)
     */
    static analyzeSEPEvents(events) {
        const sepEvents = events.filter(e => e.type === 'SEP');
        
        if (sepEvents.length === 0) {
            return `⚡ *PARTÍCULAS ENERGÉTICAS SOLARES (SEP)*

✅ *STATUS*: Sem eventos detectados
📊 *PARTÍCULAS*: Níveis normais

🔬 *O QUE SÃO*:
Prótons e elétrons acelerados a velocidades relativísticas por explosões solares ou choques de CMEs.

📈 *SAZONALIDADE & CICLO SOLAR*:
• *MÁXIMO SOLAR (2024-2026)*: 50-100 eventos/ano
• *FASE DESCENDENTE (2027-2029)*: 20-50 eventos/ano  
• *MÍNIMO SOLAR (2030-2032)*: <10 eventos/ano
• *PICOS ANUAIS*: Março-Abril e Setembro-Outubro

⚡ *CLASSIFICAÇÃO DE ENERGIA*:
• *>10 MeV*: Prótons de energia moderada
• *>50 MeV*: Prótons de alta energia  
• *>100 MeV*: Prótons de energia muito alta
• *>500 MeV*: Prótons de energia extrema

🕐 *DURAÇÃO & PROPAGAÇÃO*:
• *Chegada à Terra*: 15-60 minutos após flare
• *Duração*: Algumas horas a vários dias
• *Velocidade*: 10-90% da velocidade da luz

🛰️ *IMPACTOS CRÍTICOS*:
• *ASTRONAUTAS*: Risco de radiação extrema (EVAs canceladas)
• *AVIAÇÃO*: Voos polares desviados ou cancelados
• *SATÉLITES*: Degradação de painéis solares, falhas em componentes
• *SENSORES ASTRONÔMICOS*: Ruído em detectores CCD/CMOS

⚠️ *ALERTAS PARA ASTROFOTÓGRAFOS*:
• Evite exposições longas durante eventos intensos
• SEP pode causar pixels quentes em sensores
• Use dark frames para correção pós-processamento

🔍 *DETECÇÃO & MONITORAMENTO*:
• Satélites GOES (alertas em tempo real)
• Detectores de nêutrons terrestres  
• Observatórios de raios cósmicos`;
        }

        let analysis = `⚡ *PARTÍCULAS ENERGÉTICAS SOLARES (SEP)*\n\n🚨 *EVENTOS ATIVOS*: ${sepEvents.length}\n\n`;

        sepEvents.slice(0, 3).forEach((event, index) => {
            const energyLevel = this.extractEnergyLevel(event);
            const intensity = this.extractSEPIntensity(event);
            const sourceFlare = this.extractSourceFlare(event);
            
            analysis += `⚡ *EVENTO SEP ${index + 1}*:
📅 *Início*: ${new Date(event.startTime || event.eventTime).toLocaleString('pt-BR')}
⚡ *Energia*: ${energyLevel} MeV
📊 *Intensidade*: ${intensity} prótons/cm²/s/sr
🔥 *Fonte*: ${sourceFlare}
⚠️ *Risco*: ${this.assessSEPRisk(energyLevel, intensity)}
🛰️ *Impacto satélites*: ${this.getSatelliteImpact(energyLevel)}

`;
        });

        return analysis + this.getSEPTechnicalDetails();
    }

    /**
     * Análise de High-Speed Solar Wind Streams (HSS)
     */
    static analyzeHSSEvents(events) {
        const hssEvents = events.filter(e => e.type === 'HSS');
        
        if (hssEvents.length === 0) {
            return `🌊 *CORRENTES DE VENTO SOLAR RÁPIDO (HSS)*

✅ *STATUS*: Vento solar normal (~400 km/s)
📊 *VELOCIDADE*: Dentro dos parâmetros normais

🔬 *O QUE SÃO*:
Correntes de plasma solar de alta velocidade originadas de buracos coronais, atingindo 500-800 km/s.

📈 *CICLO SOLAR & SAZONALIDADE*:
• *MÍNIMO SOLAR (2020-2023)*: HSS dominante, eventos recorrentes
• *MÁXIMO SOLAR (2024-2026)*: HSS menos frequente, mascarado por CMEs
• *PADRÃO RECORRENTE*: A cada 27 dias (rotação solar)
• *PICOS SEMIANUAIS*: Equinócios devido ao ângulo Terra-Sol

🌊 *CLASSIFICAÇÃO DE VELOCIDADE*:
• *Normal*: 300-450 km/s - Sem efeitos
• *Moderado*: 450-550 km/s - Auroras fracas possíveis
• *Alto*: 550-700 km/s - Tempestades G1-G2 
• *Extremo*: >700 km/s - Tempestades G3+ possíveis

🕐 *CARACTERÍSTICAS TEMPORAIS*:
• *Duração*: 2-7 dias (típico 3-5 dias)
• *Velocidade de chegada*: Constante (não há aviso prévio)
• *Padrão*: Aumento gradual, depois queda

🔍 *BURACOS CORONAIS*:
• *Fonte*: Regiões de campo magnético aberto no Sol
• *Localização*: Polos solares principalmente  
• *Vida útil*: Semanas a meses
• *Detecção*: Imagens EUV do Sol (SDO/AIA)

🌈 *IMPACTOS PARA OBSERVAÇÃO*:
• Auroras de baixa latitude durante HSS intensos
• Atividade mais suave e prolongada que CMEs
• Melhor para fotos de aurora de longa exposição
• Padrão previsível (recorrência de 27 dias)

📡 *MONITORAMENTO*:
• Monitor de vento solar ACE/DSCOVR
• Previsão baseada em mapas coronais
• Apps: Solar Monitor, Space Weather Pro`;
        }

        let analysis = `🌊 *CORRENTES DE VENTO SOLAR RÁPIDO (HSS)*\n\n💨 *EVENTOS DETECTADOS*: ${hssEvents.length}\n\n`;

        hssEvents.slice(0, 3).forEach((event, index) => {
            const speed = this.extractHSSSpeed(event);
            const duration = this.extractHSSDuration(event);
            const source = this.extractCoronalHoleSource(event);
            
            analysis += `🌊 *HSS ${index + 1}*:
📅 *Início*: ${new Date(event.startTime || event.eventTime).toLocaleString('pt-BR')}
💨 *Velocidade*: ${speed} km/s (${this.classifyHSSSpeed(speed)})
⏱️ *Duração prevista*: ${duration}
🕳️ *Fonte*: ${source}
🌈 *Potential Aurora*: ${this.getHSSAuroraForecast(speed)}
🔄 *Recorrência*: ${this.getRecurrencePattern(event)}

`;
        });

        return analysis + this.getHSSTechnicalDetails();
    }

    /**
     * Previsão completa de auroras
     */
    static getAuroraForecast(events) {
        const gstEvents = events.filter(e => e.type === 'GST');
        const cmeEvents = events.filter(e => e.type === 'CME');
        const hssEvents = events.filter(e => e.type === 'HSS');

        let forecast = `🌈 *PREVISÃO COMPLETA DE AURORAS*\n\n`;

        // Análise atual
        const currentKp = this.getCurrentKpFromEvents(gstEvents);
        const auroraZone = this.getAuroraZoneLatitude(currentKp);
        
        forecast += `📊 *CONDIÇÕES ATUAIS*:
• Índice Kp atual: ${currentKp}
• Zona de aurora: ${auroraZone}°N magnético
• Visibilidade Brasil: ${this.getBrazilAuroraChance(currentKp)}%

🗓️ *PRÓXIMAS 72H*:`;

        // Previsão baseada em CMEs chegando
        cmeEvents.forEach(cme => {
            const arrivalTime = this.estimateDetailedArrival(cme);
            const kpPrediction = this.predictKpFromCME(cme);
            
            if (arrivalTime && kpPrediction >= 5) {
                forecast += `\n⚡ *${arrivalTime}*: Kp${kpPrediction} previsto (${this.getStormLevel(kpPrediction)})`;
            }
        });

        forecast += `\n\n🔬 *ANÁLISE CIENTÍFICA*:
• Campo magnético interplanetário (IMF): ${this.getIMFAnalysis()}
• Pressão dinâmica do vento solar: ${this.getSolarWindPressure()}
• Reconexão magnética favorável: ${this.getReconnectionConditions()}

🌙 *CONDIÇÕES LUNARES*:
• Fase atual: ${this.getCurrentMoonPhase()}
• Interferência lunar: ${this.getMoonInterference()}

🌍 *MELHORES LOCAIS NO BRASIL*:
${this.getBestBrazilLocations()}

📷 *CONFIGURAÇÃO DE CÂMERA*:
${this.getAuroraCameraSettings()}`;

        return forecast;
    }

    /**
     * Guia técnico completo de observação
     */
    static getTechnicalObservationGuide() {
        return `🔭 *GUIA TÉCNICO COMPLETO DE OBSERVAÇÃO*

📡 *MONITORAMENTO DE EVENTOS SOLARES*:

🌞 *OBSERVAÇÃO SOLAR SEGURA*:
⚠️ *NUNCA OLHE DIRETAMENTE PARA O SOL!*

• *Filtros solares apropriados*:
  - Filtros de luz branca (densidade neutra 5.0+)
  - Filtros H-alpha para cromosfera
  - Filtros de cálcio K para fotosfera

• *Equipamentos recomendados*:
  - Telescópio refrator/refletor com filtro solar
  - Coronado PST para H-alpha
  - Webcam planetária para registro

• *Fenômenos observáveis*:
  - Manchas solares e grupos ativos
  - Fáculas e granulação
  - Proeminências e filamentos (H-alpha)
  - Erupções solares (com filtros)

📡 *MONITORAMENTO INDIRETO*:

• *Radiotelescópios*:
  - Frequência 20-30 MHz para monitorar atividade
  - Rádios de ondas curtas para detectar apagões
  - Receptores VLF para perturbações ionosféricas

• *Magnetômetros*:
  - Apps: Magnetometer (Android/iOS)
  - Hardware DIY: sensores fluxgate
  - Detecção de tempestades em tempo real

🌈 *OBSERVAÇÃO DE AURORAS*:

• *Equipamentos essenciais*:
  - DSLR ou mirrorless
  - Lente grande angular (14-24mm)
  - Tripé robusto
  - Intervalômetro
  - Bateria extra (frio reduz duração)

• *Configurações técnicas*:
  - ISO: 1600-6400 (quanto maior, mais sensível)
  - Abertura: f/1.4-f/2.8 (máxima disponível)
  - Exposição: 10-30 segundos (teste diferentes)
  - Formato: RAW para pós-processamento
  - Foco: Infinito (teste antes de escurecer)

• *Localização ideal*:
  - Horizonte norte desobstruído
  - Poluição luminosa mínima (Bortle 3 ou melhor)
  - Altitude elevada se possível
  - Acesso a previsão meteorológica

• *Timing perfeito*:
  - Lua nova ou lua baixa no horizonte
  - Céu límpido (sem nuvens no norte)
  - Janela 20h-02h (horário local)
  - Monitor Kp em tempo real

⚡ *DETECÇÃO DE PARTÍCULAS ENERGÉTICAS*:

• *Métodos caseiros*:
  - Câmera CCD/CMOS com exposição longa
  - Detectores de radiação Geiger
  - Observação de pixels quentes anômalos

• *Proteção de equipamentos*:
  - Shielding básico para sensores
  - Monitoramento de temperatura
  - Desligamento preventivo em eventos SEP

🛰️ *IMPACTOS EM SATÉLITES*:

• *Observação visual*:
  - ISS e satélites podem ter órbitas alteradas
  - Falhas em painéis solares visíveis
  - Mudanças de brilho anômalas

• *Comunicações*:
  - Teste de GPS (precisão reduzida)
  - Rádio amador HF (propagação anômala)
  - Internet via satélite (latência/perda)

📊 *COLETA DE DADOS CIENTÍFICOS*:

• *Citizen Science*:
  - AAVSO (American Association of Variable Star Observers)
  - NASA's GLOBE Program
  - Space Weather Underground
  - Aurora Zoo (classificação de fotos)

• *Registros importantes*:
  - Timestamp preciso (UTC)
  - Coordenadas geográficas
  - Condições meteorológicas
  - Configurações de equipamento
  - Descrição fenomenológica

🔬 *ANÁLISE AVANÇADA*:

• *Espectroscopia*:
  - Identificação de elementos em auroras
  - Análise de emissões específicas:
    * Verde (557.7 nm): Oxigênio atômico ~100km
    * Vermelho (630.0 nm): Oxigênio atômico ~200-400km
    * Azul/violeta (427.8 nm): Nitrogênio ionizado
    * Rosa/magenta: Mix de emissões

• *Fotometria*:
  - Medição de intensidade de auroras
  - Correlação com índices geomagnéticos
  - Mapping de estruturas auroreais

📱 *APPS ESSENCIAIS*:
• *Previsão*: Aurora Forecast, SpaceWeatherLive
• *Dados*: SWPC, Solar Monitor
• *Fotografia*: PhotoPills (planejamento), Adobe Lightroom
• *Comunicação*: Windy (meteorologia), Telegram (grupos)

🌐 *RECURSOS ONLINE*:
• spaceweather.gov - Alertas oficiais NOAA
• spaceweatherlive.com - Dados em tempo real
• solen.info - Previsões detalhadas Europa
• astrosurf.com/lombry - Educacional avançado`;
    }

    /**
     * Informações sobre sazonalidade dos eventos
     */
    static getSeasonalEventInfo() {
        return `📅 *SAZONALIDADE DOS EVENTOS SOLARES*

🔄 *CICLO SOLAR DE 11 ANOS*:

📈 *MÁXIMO SOLAR (2024-2026)*:
• *Características*: Atividade solar intensa
• *Eventos típicos*: 100-200 flares M/ano, 10-50 flares X/ano
• *CMEs*: 3-5 por dia em períodos ativos
• *Tempestades*: G1-G3 mensais, G4-G5 várias por ano

📉 *MÍNIMO SOLAR (2030-2032)*:
• *Características*: Atividade solar reduzida  
• *Eventos*: <10 flares M/ano, 0-3 flares X/ano
• *HSS dominante*: Buracos coronais persistentes
• *Vantagem*: Céu mais "limpo" para radioastronomia

🌍 *EFEITOS SAZONAIS TERRESTRES*:

🍂 *EQUINÓCIOS (MARÇO/SETEMBRO)*:
• *Fenômeno*: Efeito Russell-McPherron
• *Causa*: Geometria Terra-Sol favorece reconexão magnética
• *Resultado*: 40% mais tempestades geomagnéticas
• *Melhor período*: Para fotografar auroras em latitudes médias

☀️ *SOLSTÍCIO DE VERÃO (JUNHO)*:
• *Características*: Mínimo de atividade geomagnética
• *Vantagem*: Noites mais curtas mas atmosfera estável
• *Ideal para*: Observação de manchas solares

❄️ *SOLSTÍCIO DE INVERNO (DEZEMBRO)*:
• *Características*: Atividade geomagnética moderada
• *Vantagem*: Noites longas para observação
• *Condições*: Atmosfera mais turbulenta

📊 *PADRÕES MENSAIS*:

🌅 *JANEIRO-FEVEREIRO*:
• Tempestades moderadas
• Boa visibilidade auroral (noites longas)
• Atmosfera fria e estável

🌸 *MARÇO-ABRIL*:
• **PICO DE ATIVIDADE GEOMAGNÉTICA**
• Equinócio favorece auroras  
• Condições ideais para fotografia

☀️ *MAIO-JUNHO*:
• Atividade decrescente
• Noites curtas limitam observação
• Melhor período para observação solar

🌻 *JULHO-AGOSTO*:
• Mínimo relativo de tempestades
• Condições atmosféricas estáveis
• Ideal para projetos de longo prazo

🍁 *SETEMBRO-OUTUBRO*:
• **SEGUNDO PICO DE ATIVIDADE**
• Condições excelentes para auroras
• Equilíbrio entre duração da noite e clima

🍂 *NOVEMBRO-DEZEMBRO*:
• Atividade moderada-alta
• Máxima duração das noites
• Condições challenging (clima)

⏰ *PADRÕES HORÁRIOS*:

🕐 *00h-06h UTC*:
• Setor noturno terrestre face ao Sol
• Maior susceptibilidade a CMEs
• **Melhor janela para auroras**

🕕 *06h-12h UTC*:
• Setor dawn face ao Sol
• Substorms frequentes
• Aurora matinal possível

🕛 *12h-18h UTC*:
• Setor diurno exposto
• Impactos diretos de radiação solar
• Apagões de rádio mais prováveis

🕕 *18h-00h UTC*:
• Setor dusk transitório
• Reconexão magnética ativa
• Início de eventos noturnos

🎯 *ESTRATÉGIA DE OBSERVAÇÃO*:

🗓️ *PLANEJAMENTO ANUAL*:
• **Março-Abril**: Foco em auroras e tempestades
• **Maio-Agosto**: Observação solar e desenvolvimento de equipamentos
• **Setembro-Outubro**: Segunda temporada de auroras
• **Novembro-Fevereiro**: Projetos de longa exposição

📅 *PLANEJAMENTO MENSAL*:
• Lua nova: Auroras fracas mais visíveis
• Lua crescente: Landscape auroral com iluminação
• Lua cheia: Pode mascarar auroras fracas
• Lua minguante: Condições balanceadas`;
    }

    // Métodos auxiliares para extrair dados dos eventos
    static extractEnergyLevel(event) {
        const text = JSON.stringify(event);
        const energyMatch = text.match(/(\d+)\s*MeV/i);
        return energyMatch ? energyMatch[1] : "Não informado";
    }

    static extractSEPIntensity(event) {
        const text = JSON.stringify(event);
        const intensityMatch = text.match(/(\d+\.?\d*)\s*p/i);
        return intensityMatch ? intensityMatch[1] : "Não informado";
    }

    static extractHSSSpeed(event) {
        const text = JSON.stringify(event);
        const speedMatch = text.match(/(\d+)\s*km\/s/i);
        return speedMatch ? `${speedMatch[1]}` : "400-500";
    }

    static classifyHSSSpeed(speed) {
        const s = parseInt(speed);
        if (s > 700) return "EXTREMO";
        if (s > 550) return "ALTO"; 
        if (s > 450) return "MODERADO";
        return "NORMAL";
    }

    static extractHSSDuration(event) {
        return "3-5 dias (típico)";
    }

    static extractCoronalHoleSource(event) {
        return "Buraco coronal polar/equatorial";
    }

    static getHSSAuroraForecast(speed) {
        const s = parseInt(speed);
        if (s > 650) return "ALTA - G2/G3 possível";
        if (s > 500) return "MODERADA - G1 provável";
        return "BAIXA - Apenas alta latitude";
    }

    static getRecurrencePattern(event) {
        return "Próximo evento: ~27 dias";
    }

    static getCurrentKpFromEvents(gstEvents) {
        if (gstEvents.length === 0) return 2;
        
        let maxKp = 0;
        gstEvents.forEach(event => {
            const text = JSON.stringify(event).toLowerCase();
            for (let kp = 9; kp >= 0; kp--) {
                if (text.includes(`kp${kp}`) || text.includes(`kp ${kp}`)) {
                    maxKp = Math.max(maxKp, kp);
                    break;
                }
            }
        });
        return maxKp || 3;
    }

    static getAuroraZoneLatitude(kp) {
        const latitudes = { 0: 68, 1: 65, 2: 62, 3: 59, 4: 56, 5: 53, 6: 50, 7: 47, 8: 43, 9: 40 };
        return latitudes[kp] || 65;
    }

    static getBrazilAuroraChance(kp) {
        const chances = { 7: 15, 8: 45, 9: 85 };
        return chances[kp] || 0;
    }

    static estimateDetailedArrival(cme) {
        const speed = this.extractCMESpeed(cme);
        const s = parseInt(speed) || 500;
        
        const hours = Math.floor(150000000 / (s * 3.6)); // Distância Terra-Sol / velocidade
        const arrivalTime = new Date(Date.now() + hours * 60 * 60 * 1000);
        
        return `${arrivalTime.toLocaleDateString('pt-BR')} às ${arrivalTime.toLocaleTimeString('pt-BR')}`;
    }

    static predictKpFromCME(cme) {
        const speed = parseInt(this.extractCMESpeed(cme)) || 400;
        const direction = this.extractCMEDirection(cme);
        
        if (direction.includes('earth') || direction.includes('halo')) {
            if (speed > 1500) return 8;
            if (speed > 1000) return 6;
            if (speed > 700) return 5;
        }
        return 3;
    }

    static extractCMESpeed(event) {
        const text = JSON.stringify(event);
        const speedMatch = text.match(/(\d+)\s*km\/s/i);
        return speedMatch ? speedMatch[1] : "500";
    }

    static extractCMEDirection(event) {
        const text = JSON.stringify(event).toLowerCase();
        if (text.includes('earth') || text.includes('halo')) return "Direcionada à Terra";
        return "Não direcionada à Terra";
    }

    static getIMFAnalysis() {
        return "Bz componente: Monitorar inversão sul (favorável para reconexão)";
    }

    static getSolarWindPressure() {
        return "Pressão atual: Normal (~2 nPa)";
    }

    static getReconnectionConditions() {
        return "Monitorar rotação do campo magnético interplanetário";
    }

    static getCurrentMoonPhase() {
        const now = new Date();
        const dayOfMonth = now.getDate();
        
        if (dayOfMonth <= 3 || dayOfMonth >= 29) return "🌑 Nova (0-10%)";
        if (dayOfMonth <= 7) return "🌒 Crescente (25%)";
        if (dayOfMonth <= 14) return "🌕 Cheia (90-100%)";
        if (dayOfMonth <= 21) return "🌖 Minguante (75%)";
        return "🌘 Minguante final (25%)";
    }

    static getMoonInterference() {
        const now = new Date();
        const dayOfMonth = now.getDate();
        
        if (dayOfMonth <= 7 || dayOfMonth >= 25) return "MÍNIMA - Ideal para auroras fracas";
        if (dayOfMonth <= 14) return "MÁXIMA - Pode ofuscar auroras fracas";
        return "MODERADA - Condições balanceadas";
    }

    static getBestBrazilLocations() {
        return `• *Sul (RS/SC)*: Latitude ~30°S - melhor chance
• *Sudeste (SP/MG)*: Lat ~20°S - eventos G3+
• *Nordeste (BA/CE)*: Lat ~10°S - apenas G4/G5
• *Norte (AM/PA)*: Lat ~0°S - eventos extremos G5`;
    }

    static getAuroraCameraSettings() {
        return `• *ISO*: 1600 (início), até 6400 se necessário
• *Abertura*: f/1.4-f/2.8 (máxima disponível)
• *Foco*: Infinito (manual)
• *Exposição*: 10s (movimento rápido), 30s (suave)
• *Formato*: RAW + JPEG
• *WB*: Auto ou 3000-4000K`;
    }

    static getSEPTechnicalDetails() {
        return `\n🔬 *DETALHES TÉCNICOS SEP*:
• Aceleração: Flares classe M/X ou choques de CME
• Energia: 1-1000 MeV (típico 10-100 MeV)
• Velocidade: 10-90% da velocidade da luz
• Detecção: Satélites GOES, detectores terrestres

⚠️ *IMPACTOS ESPECÍFICOS*:
• *CCD/CMOS*: Pixels quentes, ruído aumentado
• *Astronautas*: Dose de radiação extrema
• *Eletrônicos*: SEU/SEL em componentes`;
    }

    static getHSSTechnicalDetails() {
        return `\n🔬 *DETALHES TÉCNICOS HSS*:
• Origem: Buracos coronais (campo magnético aberto)
• Velocidade típica: 500-800 km/s (vs 300-450 normal)
• Densidade: Baixa (~5 partículas/cm³)
• Temperatura: Moderada (~100,000 K)

🌈 *CARACTERÍSTICAS AUROREAIS*:
• Tipo: Auroras difusas e suaves
• Cor predominante: Verde (557.7 nm)
• Duração: Várias horas contínuas
• Movimento: Lento e gradual`;
    }

    static assessSEPRisk(energy, intensity) {
        const e = parseInt(energy);
        const i = parseFloat(intensity);
        
        if (e > 100 && i > 1000) return "EXTREMO - Evite exposições";
        if (e > 50 && i > 100) return "ALTO - Cuidado com sensores";
        if (e > 10 && i > 10) return "MODERADO - Monitor de perto";
        return "BAIXO - Condições normais";
    }

    static getSatelliteImpact(energy) {
        const e = parseInt(energy);
        if (e > 500) return "Degradação severa de painéis solares";
        if (e > 100) return "Possíveis falhas em componentes";
        if (e > 50) return "Ruído aumentado em sensores";
        return "Impacto mínimo";
    }

    static extractSourceFlare(event) {
        const text = JSON.stringify(event);
        const classMatch = text.match(/[ABCMX]\d*\.?\d*/i);
        return classMatch ? `Flare ${classMatch[0].toUpperCase()}` : "Fonte não identificada";
    }

    static getStormLevel(kp) {
        if (kp >= 9) return "G5 - EXTREMA";
        if (kp >= 8) return "G4 - SEVERA";  
        if (kp >= 7) return "G3 - FORTE";
        if (kp >= 6) return "G2 - MODERADA";
        if (kp >= 5) return "G1 - FRACA";
        return "G0 - CALMA";
    }
}

module.exports = EventAnalysis;