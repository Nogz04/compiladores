# Tradutor de Código Morse (AFD)

Este projeto é uma aplicação web completa que traduz **Código Morse para Texto ASCII** em tempo real, utilizando a rigorosa teoria de **Linguagens Formais e Autômatos**.

## 🧠 Sobre o Projeto (O Diferencial Teórico)

A maioria dos tradutores simples na internet utiliza um dicionário (chave-valor) para procurar o que cada símbolo Morse significa (ex: `dicionario[".-"] = "A"`). 

Este projeto **NÃO** faz isso. Ele modela matematicamente um **Autômato Finito Determinístico (AFD)** na forma de uma Árvore de Transição de Estados (Trie). 
- O **Alfabeto ($\Sigma$)** da máquina é composto por pontos `.` e traços `-`.
- A cada clique (ponto ou traço), a **Função de Transição ($\delta$)** navega o estado interno da aplicação (O cursor) para um novo nó dentro da árvore.
- Ao ler um **Espaço em Branco** (delimitador), o autômato checa se o nó atual é um estado de aceitação. Se for, ele processa a tradução do caractere e retorna a máquina de volta para a raiz ($q_0$).

Isso garante que a tradução seja feita pelo caminho dos estados lidos e não por uma simples consulta em tabela, aplicando na prática os conceitos fundamentais de Ciência da Computação.

## 🚀 Como Executar no Navegador

Como este projeto foi desenvolvido nativamente para a Web (HTML5, CSS3, e JavaScript Vanilla), você **não precisa instalar Node.js, Python, ou qualquer servidor web**. 

Siga estes passos simples para rodar o projeto na sua máquina:

1. **Localize os Arquivos:** Vá até a pasta onde este projeto está salvo: `/home/matheus-nogueira/Documentos/UFN/TradutorCódigoMorse_ASCII`.
2. **Abra o arquivo principal:** Você verá o arquivo `index.html`.
3. **Execute no Navegador:**
   - Dê um **clique duplo** no arquivo `index.html`.
   - **Ou:** Clique com o botão direito sobre o `index.html`, selecione `Abrir Com` e escolha o seu navegador preferido (Google Chrome, Firefox, Safari, Edge, etc).
4. **Pronto!** A página carregará imediatamente e o sistema estará pronto para realizar as traduções.

## 📋 Funcionalidades da Interface

- **Interface Glassmorphism:** Um design premium e moderno.
- **Tradução em Tempo Real:** O Autômato processa a entrada a cada caractere digitado.
- **Feedback Visual da Máquina de Estados (q0):** Um indicador de status no canto direito mostra quando a máquina de estados (AFD) está transitando ($\delta$) ou quando está em repouso ($q_0$).
- **Botão de Teste Rápido (SOS):** Clique no botão "Testar SOS" para ver o tradutor executando sozinho de forma animada.

---
*Projeto desenvolvido visando a máxima aplicação de conceitos teóricos de algoritmos com uma interface gráfica impecável.*
