# 🔭 NASA DONKI Astronomy Bot

**Sistema completo de monitoramento e análise de eventos astronômicos em tempo real integrado com WhatsApp**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![NASA API](https://img.shields.io/badge/NASA-DONKI%20API-blue.svg)](https://api.nasa.gov/)
[![WhatsApp Business](https://img.shields.io/badge/WhatsApp-Business%20API-brightgreen.svg)](https://business.whatsapp.com/)
[![Groq AI](https://img.shields.io/badge/AI-Groq%20Llama-orange.svg)](https://groq.com/)

## 📖 Sobre o Projeto

O **NASA DONKI Astronomy Bot** é um sistema avançado de monitoramento espacial que oferece análises técnicas detalhadas de eventos astronômicos para entusiastas da astronomia. Utilizando dados oficiais da NASA DONKI (Database Of Notifications, Knowledge, Information), o bot fornece informações científicas precisas através de uma interface intuitiva no WhatsApp.

### 🎯 Objetivo

Democratizar o acesso a informações astronômicas complexas, tornando dados científicos da NASA acessíveis para amadores em astronomia através de análises detalhadas e orientações práticas de observação.
(E também aumentar minha experiência através do meu hiperfoco em astronomia. =)

## ✨ Funcionalidades Principais

### 📡 **Monitoramento em Tempo Real**
- **GST** - Tempestades Geomagnéticas
- **CME** - Ejeções de Massa Coronal  
- **FLR** - Explosões Solares (Solar Flares)
- **SEP** - Partículas Energéticas Solares
- **HSS** - Fluxos de Vento Solar de Alta Velocidade

### 🤖 **Análise Inteligente**
- Análise completa com IA (Groq Llama 3.1)
- Classificação automática de intensidade
- Previsões de atividade para próximas 24h
- Correlações entre diferentes tipos de eventos

### 📱 **Interface WhatsApp**
- Menu interativo com 18 opções
- Comandos intuitivos (1-18)
- Visualização completa de todos os eventos
- Sistema de help integrado (*AJUDA*, *MENU*)

### 🔬 **Recursos Técnicos**
- **Análise Sazonal**: Padrões de atividade por época do ano
- **Guias de Observação**: Instruções técnicas para observação
- **Alertas Personalizados**: Configuração de monitoramento
- **Correlações Científicas**: Análise de impactos geofísicos

## 📋 Menu Completo

### **Análises Básicas (1-12)**
1. 🌞 Atividade Solar Atual
2. ⚡ Tempestades Geomagnéticas (GST)
3. 🌪️ Ejeções de Massa Coronal (CME)
4. 🔥 Explosões Solares (FLR)
5. ⚡ Partículas Energéticas (SEP)
6. 🌊 Ventos Solares (HSS)
7. 📊 Análise Completa com IA
8. 🌈 Previsão de Auroras
9. 📅 Eventos por Período
10. 🎯 Como Observar Eventos
11. 📚 Guia Técnico Completo
12. ⏰ Configurar Alertas

### **Visualização Completa (13-18)**
13. 📜 TODOS GST Detectados
14. 📜 TODOS CME Detectados
15. 📜 TODOS FLR Detectados
16. 📜 TODOS SEP Detectados
17. 📜 TODOS HSS Detectados
18. 📜 LISTA COMPLETA (Todos os Eventos)

## 🛠️ Tecnologias Utilizadas

### **APIs e Serviços**
- **NASA DONKI API** - Dados oficiais de eventos espaciais
- **WhatsApp Business API** - Interface de comunicação
- **Groq AI API** - Análise inteligente com Llama 3.1

### **Tecnologias Backend**
- **Node.js** - Runtime JavaScript
- **Axios** - Cliente HTTP para APIs
- **Dotenv** - Gerenciamento de variáveis de ambiente

### **Arquitetura**
```
nasaapp/
├── index.js                    # Aplicação principal
├── package.json               # Dependências
├── geomagnetic-storm/         # Módulo principal do bot
│   ├── whatsapp-menu.js       # Bot WhatsApp com menu completo
│   ├── astronomy-app.js       # Versão terminal
│   ├── technical-analysis.js   # Análises técnicas avançadas
│   ├── services/
│   │   ├── nasa.js            # Cliente NASA DONKI API
│   │   ├── ai-analysis.js     # Integração Groq AI
│   │   └── notificacoes.js    # Sistema de notificações
│   └── utils/
│       └── scheduler.js       # Agendamento de tarefas
└── README.md                  # Documentação
```

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- Conta WhatsApp Business
- Chaves de API (NASA, WhatsApp, Groq)

### **1. Clone o repositório**
```bash
git clone https://github.com/innrani/nasaapp.git
cd nasaapp
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz:
```env
# NASA API
NASA_API_KEY=sua_chave_nasa

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=seu_token_whatsapp
WHATSAPP_PHONE_NUMBER_ID=seu_phone_id
MY_PHONE_NUMBER=+5511999999999

# Groq AI
GROQ_API_KEY=sua_chave_groq
AI_TEMPERATURE=0.3
```

### **4. Execute o bot**
```bash
# WhatsApp Bot
cd geomagnetic-storm
node whatsapp-menu.js

# Versão Terminal
node astronomy-app.js

# Teste específico (ex: atividade solar)
node whatsapp-menu.js 1
```

## 📊 Exemplos de Uso

### **Análise de Atividade Solar**
```
🌞 ATIVIDADE SOLAR ATUAL

📊 RESUMO GERAL:
• Total de eventos: 54
• GST (Tempestades): 3
• CME (Ejeções): 27
• FLR (Explosões): 8
• SEP (Partículas): 16

📈 NÍVEL DE ATIVIDADE:
🔴 MUITO ALTA - Múltiplos eventos simultâneos

🎯 PRÓXIMAS 24H:
⚠️ CMEs detectadas - possível aumento de atividade
```

### **Análise Técnica com IA**
```
🤖 ANÁLISE DETALHADA COM IA

🔬 CORRELAÇÕES IDENTIFICADAS:
• CME de 2025-11-13 pode gerar tempestade G2-G3
• Partículas SEP elevadas indicam atividade contínua
• Janela de observação ideal: 14-16 Nov

📡 RECOMENDAÇÕES TÉCNICAS:
• Monitorar índices Kp > 5
• Preparar equipamentos para fotografia de aurora
• Observação recomendada após 22h (horário local)
```

## 🔍 APIs Utilizadas

### **NASA DONKI (Database Of Notifications, Knowledge, Information)**
- **Endpoint Base**: `https://api.nasa.gov/DONKI/`
- **Tipos de Dados**: GST, CME, FLR, SEP, HSS
- **Formato**: JSON com dados científicos detalhados
- **Documentação**: [NASA API Docs](https://api.nasa.gov/)

### **WhatsApp Business API**
- **Endpoint**: `https://graph.facebook.com/v18.0/`
- **Funcionalidades**: Envio de mensagens, menu interativo
- **Formato**: JSON com suporte a texto formatado

### **Groq AI API**
- **Modelo**: Llama 3.1 8B Instant
- **Função**: Análise científica e correlações
- **Parâmetros**: Temperature 0.3 para precisão científica

## 🌟 Características Técnicas

### **Análise Científica Avançada**
- **Classificação de Intensidade**: Escala automática baseada em dados NASA
- **Correlações Temporais**: Identificação de padrões entre eventos
- **Previsões**: Análise preditiva para próximas 24-48h
- **Impactos Geofísicos**: Avaliação de efeitos na magnetosfera

### **Interface Otimizada**
- **Respostas Rápidas**: Cache inteligente de dados
- **Formatação Científica**: Apresentação clara de dados técnicos
- **Navegação Intuitiva**: Menu numerado e comandos de texto
- **Suporte Multiplataforma**: WhatsApp e terminal

## 📱 Comandos WhatsApp

### **Navegação**
- `*MENU*` - Volta ao menu principal
- `*AJUDA*` - Instruções detalhadas
- `1-18` - Acessa funcionalidades específicas

### **Comandos de Terminal**
```bash
node whatsapp-menu.js 1    # Atividade solar
node whatsapp-menu.js 7    # Análise com IA
node whatsapp-menu.js 13   # Todos os eventos GST
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Áreas para Contribuição**
- 🔭 Novos tipos de análise astronômica
- 📊 Visualizações de dados aprimoradas
- 🤖 Algoritmos de IA mais avançados
- 🌍 Internacionalização (i18n)
- 📱 Interface web complementar

<div align="center">

**🔭 Feito com ❤️ para a comunidade astronômica**

*"O cosmos está dentro de nós. Somos feitos de material estelar."* - Carl Sagan

</div>


```

## 🌈 Exemplo de Alerta de Aurora

```
🔭 ALERTA ASTRONÔMICO AUTOMÁTICO

📅 Quarta-feira, 13 de novembro de 2025
⏰ Atualizado: 14:30
🌙 Crescente 45%

☀️ ATIVIDADE SOLAR:
└── 📊 Eventos detectados: 57
└── ⚡ Nível Kp máximo: 7
└── 🔥 Maior flare: Classe X
└── 🌪️ CMEs perigosas: 3

🌈 CHANCE DE AURORA:
└── 🇧🇷 Brasil: 35%
└── 🇦🇷 Argentina: 70%
└── 🇺🇾 Uruguai: 80%

⚠️ CUIDADO COM EQUIPAMENTOS!
└── 🎥 Risco para sensores: ALTO
└── 🚨 Evite exposições longas!

🎯 DICA DE HOJE:
🌈 CONFIGURAÇÃO AURORA: ISO 3200, 15-20s, f/2.8. 
Olhe para o NORTE!
```

## 📊 Entendendo os Índices

### Índice Kp (Atividade Geomagnética)
- **Kp 0-2**: 😴 Calmo (sem auroras)
- **Kp 3-4**: 🟡 Fraco (norte da Europa)
- **Kp 5-6**: 🟠 Moderado (Canadá)
- **Kp 7-8**: 🔴 Alto (norte dos EUA)
- **Kp 9**: 💥 **EXTREMO (Brasil!)**

### Classes de Explosões Solares
- **Classe A/B**: 😌 Insignificante
- **Classe C**: 🟡 Fraco
- **Classe M**: 🟠 Moderado (cuidado!)
- **Classe X**: 🔴 **FORTE (risco equipamentos)**

## 📷 Dicas de Astrofotografia

### Para Auroras:
- **ISO**: 1600-6400
- **Abertura**: f/2.8 ou menor
- **Exposição**: 10-30 segundos
- **Direção**: Norte/Nordeste
- **Melhor lua**: Nova ou crescente fina

### Condições Ideais:
- **Kp baixo**: Perfeito para deep sky
- **Tempestade solar**: Foque em auroras
- **Lua nova**: Via láctea e nebulosas
- **Lua cheia**: Paisagens iluminadas


