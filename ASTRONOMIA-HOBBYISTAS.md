# 🔭 NASAAPP para HOBBYISTAS DE ASTRONOMIA 

## 🌟 Informações Essenciais para Observadores do Céu

Este sistema monitora atividade solar 24/7 e envia alertas específicos para quem gosta de astronomia!

### 📡 O QUE MONITORAMOS PARA VOCÊ:

#### 🌞 **Tempestades Solares** (GST - Geomagnetic Storms)
- **Para hobbyistas**: Indicam quando haverá **AURORAS BOREAIS**!
- **Níveis importantes**:
  - G1-G2: Auroras fracas (latitude >60°)
  - G3-G4: **AURORAS VISÍVEIS NO BRASIL!** (latitude >40°)
  - G5: Auroras extremas, visíveis até no equador
- **Dica**: Use apps como Aurora Forecast para timing exato

#### ☄️ **Ejeções de Massa Coronal** (CME)
- **Para hobbyistas**: Podem causar auroras 1-3 dias depois
- **Importante**: CMEs direcionadas à Terra = maior chance de show de luzes
- **Velocidade crucial**: >1000 km/s = evento significativo

#### ⭐ **Explosões Solares** (Solar Flares)
- **Classes X**: **CUIDADO!** Podem afetar equipamentos eletrônicos
- **Para fotografia**: Podem causar interferência em câmeras CCD
- **Radioamadores**: Classes M e X afetam comunicações HF

#### 🛰️ **Partículas Energéticas** (SEP)
- **Avisos para astrofotógrafos**: Podem danificar sensores de câmeras
- **Proteção**: Evite exposições longas durante eventos intensos

### 📱 CANAL WHATSAPP PARA HOBBYISTAS

**O que você receberá:**
- 🚨 Alertas de auroras em tempo real
- 📅 Melhores noites para observação
- 🌙 Fase lunar e interferência
- 📊 Índices de atividade solar (Kp, Dst)
- 🎯 Previsões específicas para sua latitude
- 📷 Dicas de astrofotografia baseadas em condições

### 🎯 CONFIGURAÇÃO DO CANAL

Para receber alertas no seu WhatsApp:

1. **Configure o número do canal**:
```env
# Adicione no arquivo .env:
ASTRONOMY_CHANNEL=+0000000000  # Seu número ou grupo
MY_PHONE_NUMBER=+000000000000
```

2. **Execute o bot**:
```bash
npm run astronomy-alerts
```

### 📊 ÍNDICES IMPORTANTES PARA HOBBYISTAS

#### **Índice Kp** (Atividade Geomagnética):
- **Kp 0-2**: Atividade calma (sem auroras)
- **Kp 3-4**: Atividade fraca (auroras no norte da Europa)
- **Kp 5-6**: ⚠️ **ATIVIDADE MODERADA** (auroras no Canadá/Escandinávia)
- **Kp 7-8**: 🔥 **ALTA ATIVIDADE** (auroras visíveis no norte dos EUA)
- **Kp 9**: 💥 **TEMPESTADE SEVERA** (auroras no Brasil!)

#### **Índice Dst** (Intensidade da Tempestade):
- **Dst > -30**: Atividade fraca
- **Dst -30 a -50**: Tempestade fraca
- **Dst -50 a -100**: ⚠️ **TEMPESTADE MODERADA**
- **Dst < -100**: 🔥 **TEMPESTADE INTENSA** (máxima chance de auroras)

### 🌙 CORRELAÇÃO COM ASTRONOMIA

#### **Melhor Lua para Auroras**: 
- **Lua Nova**: Céu mais escuro, auroras mais visíveis
- **Lua Cheia**: Pode ofuscar auroras fracas, mas ilumina paisagem

#### **Melhores Horários**:
- **18h-24h**: Horário preferencial para auroras
- **01h-06h**: Segunda janela de oportunidade

#### **Direção de Observação**:
- **Norte/Nordeste**: Para observadores no hemisfério sul
- **Horizon baixo**: Auroras aparecem como "brilho" no horizonte

### 📷 DICAS DE ASTROFOTOGRAFIA SOLAR

#### **Durante Tempestades Solares**:
- ✅ **FAÇA**: Fotos de auroras, timelapses do céu
- ⚠️ **CUIDADO**: Exposições muito longas podem danificar sensores
- 📱 **Configure**: ISO alto (1600-6400), exposição 10-30s

#### **Durante Calmaria Solar**:
- ✅ **IDEAL**: Deep sky, via láctea, nebulosas
- 📊 **Aproveite**: Menos interferência electromagnética

### 🚨 ALERTAS PERSONALIZADOS

O sistema enviará mensagens como:

```
🌞 ALERTA AURORA! 🌈

⚡ Tempestade G3 em andamento!
📍 Visível até latitude 40°S
🕐 Melhor horário: 20h-02h
🌙 Lua: 15% (ideal!)
📸 Config camera: ISO3200, 15s

🔭 Olhe para o NORTE!
```

### 🎓 APRENDENDO MAIS

#### **Fontes Confiáveis**:
- **Space Weather**: spaceweather.com
- **NOAA**: swpc.noaa.gov  
- **App Aurora**: Aurora Forecast (iOS/Android)
- **BR**: observatorionacional.org.br


### ⚙️ COMANDOS ESPECÍFICOS PARA HOBBYISTAS

```bash
# Alerta de auroras agora
npm run aurora-check

# Previsão para próximos 3 dias  
npm run forecast-3days

# Relatório completo semanal
npm run astronomy-weekly

# Monitor contínuo (recomendado!)
npm run astronomy-monitor
```

### 📱 EXEMPLO DE MENSAGEM AUTOMÁTICA

```
🔭 RELATÓRIO ASTRONÔMICO DIÁRIO

📅 13/Nov/2025 - Quarta-feira
🌙 Lua: Crescente 45% 

☀️ ATIVIDADE SOLAR:
└── 🟡 Moderada (Kp=4)
└── 🔄 Tendência: Estável

🌈 CHANCE DE AURORA:
└── 🇧🇷 Brasil: 15% (Norte/Nordeste)
└── 🇦🇷 Argentina: 35%  
└── 🇺🇾 Uruguai: 45%

📊 CONDIÇÕES DE OBSERVAÇÃO:
└── ✅ Excelente para deep sky
└── ⚠️ Vento solar moderado
└── 📷 Ideal para astrofoto

🎯 DICA DO DIA:
Madrugada ideal para M31 (Galáxia de Andrômeda). Configure ISO 1600, 30s de exposição!
```

---

**🚀 Configure agora e nunca mais perca uma aurora ou condição perfeita de observação!**