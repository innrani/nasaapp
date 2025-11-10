# NASAApp

Uma aplicação para explorar imagens e dados públicos da NASA. Este README fornece instruções rápidas para instalar, configurar e executar o projeto localmente, além de informações sobre como contribuir.

## Recursos

- Visualizar imagens e metadados públicos da NASA
- Buscar por data, missão ou palavra-chave
- Exibição responsiva para dispositivos móveis e desktop

> Observação: Este README é um ponto de partida genérico. Ajuste as instruções abaixo conforme a stack e os scripts reais do seu projeto.

## Pré-requisitos

- Git
- Node.js v16+ (ou versão necessária pelo projeto)
- npm ou yarn

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/innrani/nasaapp.git
cd nasaapp
```

2. Instale as dependências:

```bash
npm install
# ou
# yarn install
```

3. Crie um arquivo de ambiente (.env) se necessário e adicione variáveis de configuração. Por exemplo:

```env
# Chave de API pública da NASA (ex: https://api.nasa.gov)
NASA_API_KEY=DEMO_KEY
```

Substitua DEMO_KEY pela sua chave real se aplicável.

## Executando localmente

Rode o servidor de desenvolvimento (ajuste conforme os scripts do seu projeto):

```bash
npm run dev
# ou
# npm start
```

Abra http://localhost:3000 (ou a porta configurada) no seu navegador.

## Build para produção

```bash
npm run build
npm run start
```

## Testes

Se existirem testes, execute:

```bash
npm test
```

## Estrutura sugerida do repositório

- src/ - código-fonte
- public/ - ativos públicos (imagens, ícones)
- .env - variáveis de ambiente (não comitar com chaves sensíveis)

Ajuste conforme a estrutura real do projeto.

## Contribuindo

1. Fork este repositório
2. Crie uma branch: `git checkout -b feature/minha-melhora`
3. Commit suas alterações: `git commit -m "feat: descrição da mudança"`
4. Envie para a branch remota: `git push origin feature/minha-melhora`
5. Abra um Pull Request

Por favor, descreva claramente as alterações e o motivo.

## Reportar problemas

Abra uma issue com título claro e passos para reproduzir. Inclua logs e capturas de tela quando aplicável.

## Licença

Se desejar, adicione uma licença (ex: MIT). Atualmente, nenhum arquivo de licença está incluído neste repositório por padrão.

## Créditos

- NASA APIs — https://api.nasa.gov
- Desenvolvedor: @innrani

---

Se quiser, posso ajustar este README para corresponder exatamente à stack do projeto (por exemplo: React, Next.js, Flutter), adicionar badges, ou incluir instruções de CI/CD. Me diga como você prefere que eu personalize.