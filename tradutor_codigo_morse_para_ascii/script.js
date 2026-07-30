/**
 * TRADUTOR DE CÓDIGO MORSE - ABORDAGEM DE AUTÔMATOS (AFD)
 * 
 * Este arquivo implementa a lógica do tradutor usando os conceitos de 
 * Linguagens Formais e Autômatos. O processo de tradução é feito
 * através da travessia de uma Máquina de Estados (Trie), dispensando
 * a busca em um dicionário chave-valor na hora da tradução.
 */

// ==========================================
// 1. DEFINIÇÃO DOS ESTADOS (Q)
// ==========================================
// Cada nodo na árvore representa um estado do nosso Autômato Finito Determinístico (AFD).
class State {
    constructor(value = null) {
        this.value = value; // Valor ASCII de aceitação. null se não for um estado de aceitação.
        
        // Transições possíveis a partir deste estado para cada símbolo do alfabeto de entrada (Σ = { '.', '-' })
        this.transitions = {
            '.': null,
            '-': null
        };
    }
}

// Inicializamos o Estado Inicial (q0). É a raiz da nossa árvore (Trie).
const q0 = new State();

// Dicionário usado *APENAS* para construir (popular) o AFD dinamicamente na inicialização.
// ATENÇÃO: A TRADUÇÃO EM SI NÃO USARÁ ESTE DICIONÁRIO.
const morseAlphabet = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
    '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
    ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
    '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
};

// Função para construir o AFD (Popula a Trie)
function buildDFA() {
    for (const [char, morse] of Object.entries(morseAlphabet)) {
        let currentState = q0;
        
        for (let i = 0; i < morse.length; i++) {
            const symbol = morse[i];
            
            // Se a transição para este símbolo ainda não existe, criamos um novo estado
            if (!currentState.transitions[symbol]) {
                currentState.transitions[symbol] = new State();
            }
            
            // Movemos para o próximo estado
            currentState = currentState.transitions[symbol];
        }
        
        // O último estado alcançado na sequência Morse torna-se um estado de aceitação
        // recebendo o caractere ASCII correspondente.
        currentState.value = char;
    }
}

// Inicializa a construção da Máquina de Estados
buildDFA();


// ==========================================
// 2. FUNÇÃO DE TRANSIÇÃO (δ)
// ==========================================
// Mapeia: δ(Estado Atual, Símbolo) -> Próximo Estado
function deltaTransition(currentState, symbol) {
    // Se já estivermos num estado de erro (null), continuamos no erro para o restante desta sequência
    if (currentState === null) {
        return null; // q_erro
    }
    
    // Se o símbolo lido for válido no alfabeto ('.' ou '-'), tentamos transitar
    if (symbol === '.' || symbol === '-') {
        // Se a transição não existir, retornará undefined, que mapeamos para null (q_erro)
        return currentState.transitions[symbol] || null; 
    }
    
    return null; // Símbolo não reconhecido pelo AFD também gera estado de erro
}


// ==========================================
// 3. LÓGICA DE PROCESSAMENTO DO AFD
// ==========================================
function translateMorseToASCII(morseInput) {
    let output = '';
    let currentState = q0; // Inicia sempre no estado inicial (q0)
    let spaceCount = 0;

    for (let i = 0; i < morseInput.length; i++) {
        const symbol = morseInput[i];

        if (symbol === '.' || symbol === '-') {
            // APLICAÇÃO DA FUNÇÃO DE TRANSIÇÃO (δ)
            currentState = deltaTransition(currentState, symbol);
            spaceCount = 0; // Reset na contagem de espaços pois encontramos um novo símbolo
        } 
        else if (symbol === ' ' || symbol === '\n' || symbol === '\t') {
            spaceCount++;
            
            // O espaço atua como delimitador lógico (gatilho de verificação).
            // VERIFICAÇÃO DE ESTADO DE ACEITAÇÃO (F)
            if (currentState !== q0) {
                if (currentState !== null && currentState.value !== null) {
                    output += currentState.value; // Estado de aceitação: Imprime o caractere
                } else {
                    output += '?'; // Estado de erro ou estado sem valor de aceitação
                }
                // Retorna ao estado inicial (Reset lógico para o próximo caractere)
                currentState = q0;
            }

            // Convenção do Morse: 3 espaços consecutivos (ou mais) formam um espaço de texto final
            // O primeiro espaço separou a letra, se chegar a 3, separamos as palavras.
            if (spaceCount === 3) {
                output += ' ';
            }
        } 
        else if (symbol === '/') {
            // A barra (/) também é convencionalmente usada como separador explícito de palavras.
            if (currentState !== q0) {
                if (currentState !== null && currentState.value !== null) {
                    output += currentState.value;
                } else {
                    output += '?';
                }
                currentState = q0;
            }
            output += ' ';
            spaceCount = 0;
        }
        // Quaisquer outros caracteres ignorados...
    }

    // No final da string, se sobrou um estado sendo processado e não terminamos em espaço, processamos agora.
    if (currentState !== q0) {
        if (currentState !== null && currentState.value !== null) {
            output += currentState.value;
        } else {
            output += '?';
        }
    }

    return output;
}


// ==========================================
// 4. INTERAÇÃO COM A INTERFACE (DOM)
// ==========================================
const morseInput = document.getElementById('morse-input');
const asciiOutput = document.getElementById('ascii-output');
const statusIndicator = document.querySelector('.status-indicator');
const statusText = document.getElementById('status-text');
const btnClear = document.getElementById('btn-clear');
const btnDemo = document.getElementById('btn-demo');

function updateUI() {
    // Normalizar a string para caso o usuário misture maiúsculas (embora Morse seja só . e -)
    const text = morseInput.value.trimStart();
    
    if (text === '') {
        asciiOutput.innerHTML = '<span class="placeholder-text">A tradução aparecerá aqui...</span>';
        updateStatus('idle', 'Aguardando entrada (q₀)');
        return;
    }

    // Dispara a lógica baseada no AFD
    const translation = translateMorseToASCII(text);
    asciiOutput.textContent = translation;

    // Feedback visual do Autômato rodando
    const lastChar = text[text.length - 1];
    if (lastChar === '.' || lastChar === '-') {
        updateStatus('active', 'Lendo símbolo, transitando estado (δ)...');
    } else if (lastChar === ' ' || lastChar === '/') {
        updateStatus('idle', 'Verificado. Retornado à origem (q₀)');
    } else {
        updateStatus('error', 'Símbolo ignorado pelo alfabeto Σ');
    }
}

function updateStatus(state, message) {
    statusIndicator.className = 'status-indicator ' + state;
    statusText.textContent = message;
}

// Eventos
morseInput.addEventListener('input', updateUI);

btnClear.addEventListener('click', () => {
    morseInput.value = '';
    updateUI();
    morseInput.focus();
});

// Animação de digitação rápida simulando código SOS ("... --- ...")
btnDemo.addEventListener('click', () => {
    morseInput.value = '';
    const demoText = '... --- ...   -.. . -.-. --- -.. . -..'; // SOS DECODED
    let i = 0;
    
    // Desabilita os botões durante a animação
    btnDemo.disabled = true;
    btnClear.disabled = true;
    morseInput.disabled = true;
    
    const interval = setInterval(() => {
        morseInput.value += demoText[i];
        updateUI();
        i++;
        
        if (i >= demoText.length) {
            clearInterval(interval);
            btnDemo.disabled = false;
            btnClear.disabled = false;
            morseInput.disabled = false;
        }
    }, 100); // 100ms por caractere morse
});
