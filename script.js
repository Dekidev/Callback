// Espera o conteúdo do DOM ser totalmente carregado antes de executar o script
// (Não é estritamente necessário com 'defer', mas é uma boa prática)
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos do DOM
    const btnCaixaPostal = document.getElementById('btn-caixa-postal');
    const btnGoogleVoice = document.getElementById('btn-google-voice');
    const btnNaoInteressa = document.getElementById('btn-nao-interessa');
    const btnDataHora = document.getElementById('btn-data-hora');
    const messageDisplay = document.getElementById('message-display');
    // Array com todos os botões para facilitar a remoção de feedback antigo
    const allButtons = [btnCaixaPostal, btnGoogleVoice, btnNaoInteressa, btnDataHora];

    // Função para formatar números com zero à esquerda (ex: 01, 09)
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    // Função para obter a data e hora formatadas
    function getFormattedDateTime() {
        const now = new Date();
        const day = padZero(now.getDate());
        const month = padZero(now.getMonth() + 1); // Meses são baseados em zero (0-11)
        const year = now.getFullYear();
        const hours = padZero(now.getHours());
        const minutes = padZero(now.getMinutes());
        // Retorna a string formatada com um espaço no final
        return `${day}.${month}.${year}>>(${hours}:${minutes}): `;
    }

    // Função para remover a classe de feedback de todos os botões
    function removeFeedbackFromAllButtons() {
        allButtons.forEach(button => {
            if (button) { // Verifica se o botão existe
                 button.classList.remove('btn-copied');
            }
        });
    }

    // Função para copiar texto para a área de transferência e mostrar feedback
    function copyToClipboard(text, buttonElement) {
        // Verifica se a API de Clipboard está disponível
        if (!navigator.clipboard) {
            messageDisplay.textContent = 'API de Clipboard não suportada neste navegador.';
            console.error('Clipboard API not available');
            // Tentar método legado (pode não funcionar em todos os contextos seguros)
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed"; // Previne rolagem
                textArea.style.left = "-9999px"; // Move para fora da tela
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                messageDisplay.textContent = text + ' (Copiado - método legado)';
                // Adicionar feedback visual ao botão (mesmo com método legado)
                removeFeedbackFromAllButtons(); // Remove feedback de outros botões
                buttonElement.classList.add('btn-copied');
                setTimeout(() => {
                    buttonElement.classList.remove('btn-copied');
                }, 2000);
            } catch (err) {
                console.error('Falha ao usar execCommand:', err);
                messageDisplay.textContent = 'Erro ao copiar a mensagem (método legado).';
            }
            return;
        }

        // Usa a API de Clipboard moderna
        navigator.clipboard.writeText(text).then(() => {
            // Sucesso ao copiar
            messageDisplay.textContent = text; // Mostra a mensagem copiada no display

            removeFeedbackFromAllButtons(); // Remove feedback de outros botões
            buttonElement.classList.add('btn-copied'); // Adiciona feedback ao botão clicado

            // Remove o feedback após 2 segundos
            setTimeout(() => {
                buttonElement.classList.remove('btn-copied');
            }, 2000);

        }).catch(err => {
            // Erro ao copiar
            console.error('Erro ao copiar texto com a API de Clipboard: ', err);
            messageDisplay.textContent = 'Erro ao copiar a mensagem.';
        });
    }

    // Adiciona ouvintes de evento para cada botão, verificando se existem primeiro
    if (btnCaixaPostal) {
        btnCaixaPostal.addEventListener('click', () => {
            const dateTime = getFormattedDateTime();
            const message = `${dateTime}Caixa postal`;
            copyToClipboard(message, btnCaixaPostal);
        });
    }

    if (btnGoogleVoice) {
        btnGoogleVoice.addEventListener('click', () => {
            const dateTime = getFormattedDateTime();
            const message = `${dateTime}Google Voice`;
            copyToClipboard(message, btnGoogleVoice);
        });
    }

    if (btnNaoInteressa) {
        btnNaoInteressa.addEventListener('click', () => {
            const dateTime = getFormattedDateTime();
            const message = `${dateTime}Não tem interesse`;
            copyToClipboard(message, btnNaoInteressa);
        });
    }

    if (btnDataHora) {
        btnDataHora.addEventListener('click', () => {
            const dateTime = getFormattedDateTime();
            // A mensagem é apenas a data e hora formatadas
            copyToClipboard(dateTime, btnDataHora);
        });
    }
}); // Fim do DOMContentLoaded
