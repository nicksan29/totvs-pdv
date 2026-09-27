# 🛒 TOTVS - SmartPOS

O **SmartPOS** é uma solução de Ponto de Venda Frontend ágil, responsiva e moderna construída **100% com Vanilla JavaScript** e **Web Components** nativos, sem a dependência de frameworks externos como React, Vue ou Angular.

## 🚀 Arquitetura e Decisões Técnicas

Para atender padrão do desafio, o projeto foi desenhado sob os seguintes pilares:

1. **Web Components & Shadow DOM**: O ecossistema foi dividido em dois componentes principais (`<product-grid>` e `<cart-summary>`). O *Shadow DOM* foi utilizado para garantir que o CSS de cada componente fosse isolado, evitando vazamento de estilos e colisões de classes CSS.
2. **Event-Driven Architecture (Comunicação)**: A comunicação entre os componentes paralelos foi construída utilizando o envio e a escuta de `CustomEvent` nativos do Javascript através do ecosistema de *Bubbling*, provando o desacoplamento das peças.
3. **Build Tooling moderno (Vite)**: Escolhi o Vite como empacotador de módulos e servidor local visando a melhor Developer Experience e velocidade sem corromper a regra do "Vanilla".
4. **State Management no Componente**: O estado do carrinho e das filtragens vive apenas dentro da memória de cada classe de componente, sendo imutável por fora.
5. **UI/UX Responsiva (Mobile First)**: Além das variáveis CSS inspiradas no Design System da TOTVS, a arquitetura Mobile transforma o Carrinho lateral em um Modal funcional que persiste o estado.

## 🧪 Testes Unitários

Foram implementados testes automatizados focados na regra de negócio do carrinho de compras e cupons fiscais.
Utilizei o **Vitest** rodando no motor **JSDOM**.

Para rodar a suíte de testes:
npm run test
\`\`\`

## 📦 Como rodar o projeto localmente

1. Clone o repositório ou descompacte o arquivo.
2. Certifique-se de ter o Node.js instalado.
3. Instale as dependências:
   npm install
   \`\`\`
4. Rode o servidor de desenvolvimento:
   npm run dev
   \`\`\`
5. Acesse no navegador a rota apontada (geralmente `http://localhost:5173`).

---
*Desafio Técnico desenvolvido com carinho e focado na excelência técnica em JavaScript nativo.*
