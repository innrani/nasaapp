/**
 * Serviço de análise preditiva para eventos solares
 * Usa algoritmos simples de ML para prever tendências
 */

/**
 * Análise de tendências simples baseada em histórico
 * @param {Array} events - Lista de eventos solares recentes
 * @returns {Object} Predições e tendências
 */
function analyzeTrends(events) {
    if (!events || events.length === 0) {
        return {
            trend: 'estável',
            prediction: 'Baixa probabilidade de eventos significativos',
            confidence: 0.5
        };
    }

    // Análise simples de frequência
    const eventsByType = events.reduce((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
    }, {});

    const totalEvents = events.length;
    const gstEvents = eventsByType.GST || 0;
    const cmeEvents = eventsByType.CME || 0;
    const flrEvents = eventsByType.FLR || 0;

    // Calcula score de atividade solar
    const activityScore = (gstEvents * 3 + cmeEvents * 2 + flrEvents * 1.5) / totalEvents;

    let trend, prediction, confidence;

    if (activityScore > 2.5) {
        trend = 'crescente';
        prediction = 'Alta probabilidade de eventos solares intensos nas próximas 24-48h';
        confidence = 0.8;
    } else if (activityScore > 1.5) {
        trend = 'moderada';
        prediction = 'Atividade solar moderada esperada';
        confidence = 0.7;
    } else {
        trend = 'decrescente';
        prediction = 'Tendência de redução da atividade solar';
        confidence = 0.6;
    }

    return {
        trend,
        prediction,
        confidence,
        activityScore: activityScore.toFixed(2),
        eventDistribution: eventsByType
    };
}

/**
 * Sistema de scoring de risco baseado em múltiplos fatores
 * @param {Array} events - Lista de eventos solares
 * @returns {Object} Score de risco e detalhes
 */
function calculateRiskScore(events) {
    if (!events || events.length === 0) {
        return { score: 0, level: 'muito baixo', factors: [] };
    }

    let riskScore = 0;
    const factors = [];

    // Fator 1: Presença de tempestades geomagnéticas
    const gstEvents = events.filter(e => e.type === 'GST');
    if (gstEvents.length > 0) {
        const highSeverityGst = gstEvents.filter(e => e.severity === 'alta').length;
        const score = highSeverityGst * 30 + (gstEvents.length - highSeverityGst) * 15;
        riskScore += score;
        factors.push(`Tempestades Geomagnéticas (+${score})`);
    }

    // Fator 2: Ejeções de massa coronal
    const cmeEvents = events.filter(e => e.type === 'CME').length;
    if (cmeEvents > 0) {
        const score = cmeEvents * 20;
        riskScore += score;
        factors.push(`Ejeções de Massa Coronal (+${score})`);
    }

    // Fator 3: Explosões solares
    const flrEvents = events.filter(e => e.type === 'FLR').length;
    if (flrEvents > 0) {
        const score = flrEvents * 10;
        riskScore += score;
        factors.push(`Explosões Solares (+${score})`);
    }

    // Fator 4: Frequência de eventos (últimas horas)
    const recentEvents = events.filter(e => {
        const eventTime = new Date(e.date);
        const now = new Date();
        const hoursDiff = (now - eventTime) / (1000 * 60 * 60);
        return hoursDiff <= 6; // Últimas 6 horas
    });

    if (recentEvents.length > 2) {
        const score = (recentEvents.length - 2) * 5;
        riskScore += score;
        factors.push(`Alta Frequência Recente (+${score})`);
    }

    // Determina nível de risco
    let level;
    if (riskScore >= 80) level = 'crítico';
    else if (riskScore >= 60) level = 'alto';
    else if (riskScore >= 40) level = 'moderado';
    else if (riskScore >= 20) level = 'baixo';
    else level = 'muito baixo';

    return {
        score: riskScore,
        level,
        factors,
        maxPossibleScore: 100
    };
}

/**
 * Predições específicas por setor baseadas em ML simples
 * @param {Array} events - Lista de eventos solares
 * @returns {Object} Impactos previstos por setor
 */
function predictSectorImpacts(events) {
    const impacts = {
        telecommunications: { risk: 0, details: [] },
        powerGrid: { risk: 0, details: [] },
        aviation: { risk: 0, details: [] },
        satellites: { risk: 0, details: [] },
        gps: { risk: 0, details: [] }
    };

    if (!events || events.length === 0) return impacts;

    events.forEach(event => {
        switch (event.type) {
            case 'GST':
                if (event.severity === 'alta') {
                    impacts.telecommunications.risk += 40;
                    impacts.powerGrid.risk += 35;
                    impacts.gps.risk += 45;
                    impacts.telecommunications.details.push('Interferência severa em HF/VHF');
                    impacts.powerGrid.details.push('Possíveis flutuações de tensão');
                    impacts.gps.details.push('Degradação significativa de precisão');
                } else {
                    impacts.telecommunications.risk += 20;
                    impacts.powerGrid.risk += 15;
                    impacts.gps.risk += 25;
                }
                break;
            
            case 'CME':
                impacts.satellites.risk += 30;
                impacts.aviation.risk += 25;
                impacts.satellites.details.push('Possível necessidade de modo seguro');
                impacts.aviation.details.push('Considerar rotas alternativas polares');
                break;
            
            case 'FLR':
                impacts.telecommunications.risk += 25;
                impacts.gps.risk += 20;
                impacts.telecommunications.details.push('Blackout de rádio HF possível');
                break;
        }
    });

    // Normaliza os riscos (0-100)
    Object.keys(impacts).forEach(sector => {
        impacts[sector].risk = Math.min(impacts[sector].risk, 100);
        impacts[sector].level = impacts[sector].risk >= 70 ? 'alto' : 
                               impacts[sector].risk >= 40 ? 'moderado' : 
                               impacts[sector].risk >= 20 ? 'baixo' : 'muito baixo';
    });

    return impacts;
}

/**
 * Análise temporal de eventos para detectar padrões
 * @param {Array} events - Lista de eventos solares
 * @returns {Object} Análise de padrões temporais
 */
function analyzeTemporalPatterns(events) {
    if (!events || events.length === 0) {
        return { pattern: 'insuficiente', description: 'Dados insuficientes para análise' };
    }

    const eventTimes = events.map(e => new Date(e.date)).sort((a, b) => a - b);
    const intervals = [];

    for (let i = 1; i < eventTimes.length; i++) {
        const interval = (eventTimes[i] - eventTimes[i-1]) / (1000 * 60 * 60); // em horas
        intervals.push(interval);
    }

    if (intervals.length === 0) {
        return { pattern: 'evento único', description: 'Apenas um evento detectado' };
    }

    const avgInterval = intervals.reduce((sum, int) => sum + int, 0) / intervals.length;
    
    let pattern, description;
    
    if (avgInterval < 6) {
        pattern = 'rajada';
        description = 'Eventos em rajada - múltiplos eventos em curto período';
    } else if (avgInterval < 24) {
        pattern = 'frequente';
        description = 'Atividade solar frequente nas últimas horas';
    } else {
        pattern = 'esporádico';
        description = 'Eventos esporádicos com intervalos normais';
    }

    return {
        pattern,
        description,
        averageInterval: avgInterval.toFixed(1) + ' horas',
        totalEvents: events.length,
        timeSpan: ((eventTimes[eventTimes.length - 1] - eventTimes[0]) / (1000 * 60 * 60)).toFixed(1) + ' horas'
    };
}

module.exports = {
    analyzeTrends,
    calculateRiskScore,
    predictSectorImpacts,
    analyzeTemporalPatterns
};