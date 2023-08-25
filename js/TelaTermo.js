import { Termo } from "./Termo.js";
class TelaTermo {
    constructor() {
        this.palavraChutada = '';
        this.buttons = document.querySelectorAll('.btn');
        this.notificacao = document.getElementById('divNotificacao');
        this.pnlConteudo = document.getElementById('pnlConteudo');
        this.pnlTermo = document.getElementById('pnlTermo');
        this.pnlTeclado = document.getElementById('pnlTeclado');
        this.btnChutar = document.getElementById('btnChutar');
        this.btnDeletar = document.getElementById('btnDeletar');
        this.btnJogarNovamente = document.getElementById('btnJogarNovamente');
        this.jogo = new Termo();
        this.RegistrarEventos();
    }
    RegistrarEventos() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.botaoClicado(e));
        });
        this.btnDeletar.addEventListener('click', () => this.Apagar());
        this.btnJogarNovamente.addEventListener('click', () => this.Reiniciar());
        this.btnChutar.addEventListener('click', () => this.Chutar());
    }
    botaoClicado(evento) {
        const botaoClicado = evento.target;
        const letraClicada = botaoClicado.textContent;
        const caractereExiste = letraClicada.trim().length > 0;
        let painelAtual = this.EscolherPainelDoJogo();
        if (caractereExiste && letraClicada != letraClicada.toUpperCase()) {
            try {
                for (let index = 0; index < painelAtual.childNodes.length; index++) {
                    if (painelAtual.childNodes[index].nodeName != '#text' && painelAtual.childNodes[index].textContent == '') {
                        painelAtual.childNodes[index].textContent = letraClicada;
                        this.palavraChutada += letraClicada;
                        throw new Error("Break the loop.");
                    }
                }
                ;
            }
            catch (error) {
            }
        }
        ;
    }
    Reiniciar() {
        location.reload();
    }
    Apagar() {
        let painelAtual = this.EscolherPainelDoJogo();
        try {
            for (let index = 10; index > -1; index--) {
                if (painelAtual.childNodes[index].nodeName != '#text' && painelAtual.childNodes[index].textContent != '') {
                    this.palavraChutada = this.palavraChutada.slice(1);
                    painelAtual.childNodes[index].textContent = '';
                    throw new Error("Break the loop.");
                }
            }
            ;
        }
        catch (error) {
        }
    }
    EscolherPainelDoJogo() {
        let painel = this.pnlTermo.children[0];
        if (this.jogo.ObterQuantidadeDeErros() == 0) {
            painel = this.pnlTermo.children[0];
        }
        if (this.jogo.ObterQuantidadeDeErros() == 1) {
            painel = this.pnlTermo.children[1];
        }
        if (this.jogo.ObterQuantidadeDeErros() == 2) {
            painel = this.pnlTermo.children[2];
        }
        if (this.jogo.ObterQuantidadeDeErros() == 3) {
            painel = this.pnlTermo.children[3];
        }
        if (this.jogo.ObterQuantidadeDeErros() == 4) {
            painel = this.pnlTermo.children[4];
        }
        return painel;
    }
    Chutar() {
        if (this.palavraChutada.length < 5)
            return;
        let painelAtual = this.EscolherPainelDoJogo();
        let letrasExistentes = this.jogo.RetornarLetrasExistentes(this.palavraChutada);
        let letrasCertas = this.jogo.RetornarLetrasCertas(this.palavraChutada);
        let letrasErradas = this.jogo.RetornarLetrasErradas(this.palavraChutada);
        this.DesbilitarBotoes(letrasExistentes, letrasCertas, letrasErradas);
        let resultado = this.jogo.VerificaChute(this.palavraChutada);
        let cores = this.jogo.ObterCoresDeFedBack();
        this.PintarDivs(cores, painelAtual);
        this.VerificaResultado(resultado);
        this.palavraChutada = '';
    }
    VerificaResultado(resultado) {
        if (resultado == true) {
            const notificacaoVitoria = document.createElement('h3');
            notificacaoVitoria.textContent = 'Vitoria! Voce Acertou com ' + this.jogo.ObterQuantidadeDeErros() + ' tentativas!';
            this.notificacao.appendChild(notificacaoVitoria);
            this.notificacao.style.color = "green";
            this.notificacao.style.border = "2px solid green";
            this.notificacao.style.borderRadius = "10px";
        }
        if (resultado == false) {
            if (this.jogo.ObterQuantidadeDeErros() == 5) {
                const notificacaoDerrota = document.createElement('h3');
                notificacaoDerrota.textContent = 'Voce Perdeu, Tente Novamente! A Palavra era ' + this.jogo.palavraSecreta;
                this.notificacao.appendChild(notificacaoDerrota);
                this.notificacao.style.color = "Red";
                this.notificacao.style.border = "2px solid red";
                this.notificacao.style.borderRadius = "10px";
            }
        }
    }
    DesbilitarBotoes(letrasExistentes, letrasCertas, letrasErradas) {
        this.buttons.forEach(btn => {
            if (letrasExistentes.includes(btn.textContent)) {
                btn.style.backgroundColor = "rgb(212, 164, 6)";
            }
            if (letrasCertas.includes(btn.textContent)) {
                btn.style.backgroundColor = "rgb(68, 212, 6)";
            }
            if (letrasErradas.includes(btn.textContent)) {
                btn.style.backgroundColor = "rgb(54, 70, 99)";
                btn.disabled = true;
            }
        });
    }
    DesbilitarTodosBotoes() {
        this.buttons.forEach(btn => {
            btn.style.backgroundColor = "rgb(54, 70, 99)";
            btn.disabled = true;
        });
    }
    PintarDivs(cores, painelAtual) {
        let i = 0;
        for (let index = 0; index < painelAtual.childNodes.length; index++) {
            if (painelAtual.childNodes[index].nodeName != '#text') {
                let divAtual = painelAtual.childNodes[index];
                divAtual.style.backgroundColor = cores[i];
                i++;
            }
            ;
        }
        ;
        cores = [];
    }
}
window.addEventListener('load', () => new TelaTermo());
//# sourceMappingURL=TelaTermo.js.map