import { LocalStorageService } from "../../services/local-storage.service";
import { Termo } from "../dominio/Termo";
import './tela-termo.css';


class TelaTermo{
    buttons:NodeListOf<HTMLButtonElement>;

    pnlConteudo: HTMLDivElement;
    pnlTermo: HTMLDivElement;
    pnlHistorico: HTMLDivElement;
    pnlTeclado: HTMLDivElement;
    notificacao: HTMLDivElement;

    btnExibirHistorico: HTMLButtonElement;
    btnDeletar:HTMLButtonElement;
    btnChutar:HTMLButtonElement;
    btnJogarNovamente:HTMLButtonElement;

    jogo:Termo;
    palavraChutada:string;
    private localStorageService: LocalStorageService;

    chars: string[];
    constructor() {
        this.palavraChutada = '';      
        this.buttons = document.querySelectorAll('.btn') as NodeListOf<HTMLButtonElement>;
        this.notificacao = document.getElementById('divNotificacao') as HTMLDivElement;

        this.pnlHistorico = document.getElementById('pnlHistorico') as HTMLDivElement;
        this.pnlConteudo = document.getElementById('pnlConteudo') as HTMLDivElement;
        this.pnlTermo = document.getElementById('pnlTermo') as HTMLDivElement;
        this.pnlTeclado = document.getElementById('pnlTeclado') as HTMLDivElement;

        this.btnExibirHistorico = document.getElementById('btnExibirHistorico') as HTMLButtonElement;
        this.btnChutar = document.getElementById('btnChutar') as HTMLButtonElement;
        this.btnDeletar = document.getElementById('btnDeletar') as HTMLButtonElement;
        this.btnJogarNovamente = document.getElementById('btnJogarNovamente') as HTMLButtonElement;
        this.localStorageService = new LocalStorageService()
        this.jogo = new Termo(this.localStorageService.carregarDados());
        

        this.RegistrarEventos();
    }

    RegistrarEventos():void {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.botaoClicado(e))
        })

        this.btnDeletar.addEventListener('click', () => this.Apagar());

        this.btnJogarNovamente.addEventListener('click',() => this.Reiniciar());

        this.btnChutar.addEventListener('click', () => this.Chutar());

        this.btnExibirHistorico.addEventListener('click', () => {this.pnlHistorico.style.display = 'grid';});

        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
      
            if (!this.pnlHistorico.contains(target) && event.target != this.btnExibirHistorico)
              this.pnlHistorico.style.display = 'none';
          });
    } 
   

    botaoClicado(evento : MouseEvent){
        const botaoClicado:HTMLButtonElement = evento.target as HTMLButtonElement;
        const letraClicada: string = botaoClicado.textContent as string;

        const caractereExiste = letraClicada.trim().length > 0;
        let painelAtual:HTMLDivElement = this.EscolherPainelDoJogo();
        
        if (caractereExiste && letraClicada != letraClicada.toUpperCase())
        {
           try{
                for (let index = 0; index < painelAtual.childNodes.length; index++) {
                    if(painelAtual.childNodes[index].nodeName != '#text' && painelAtual.childNodes[index].textContent == '')
                    {
                        painelAtual.childNodes[index].textContent = letraClicada;
                        this.palavraChutada += letraClicada;
                        throw new Error("Break the loop.")   
                    }         
                };
           }catch(error) {

           }
        }; 
    }

    Reiniciar()
    {
        this.limparGrid();
        this.limparTeclado();
        
        this.notificacao.replaceChildren();
        this.btnChutar.disabled = false;

        this.jogo = new Termo(this.localStorageService.carregarDados());
  
    }  
    private limparGrid(): void {
        for(let i = 0; i > this.pnlTermo.children.length; i++){
            let painelAtual: HTMLDivElement = this.pnlTermo.children[i] as HTMLDivElement;
            for (let index = 0; index < painelAtual.childNodes.length; index++) {
                painelAtual.childNodes[index].textContent = '';       
            };
        }
      }
    
      
    private limparTeclado(): void {
        this.ModificarTodosBotoes(false,"rgb(169, 169, 241)");
      }

    Apagar(): void {
        let painelAtual:HTMLDivElement = this.EscolherPainelDoJogo();
        try{
            for (let index = 10; index > -1; index--) 
            {
                if(painelAtual.childNodes[index].nodeName != '#text' && painelAtual.childNodes[index].textContent != ''){
                    this.palavraChutada = this.palavraChutada.slice(1);
                    painelAtual.childNodes[index].textContent = '';    
                    throw new Error("Break the loop.");
                }   
            };
        }catch(error) {

        }
        
    }

    EscolherPainelDoJogo(): HTMLDivElement
    {
        let painel: HTMLDivElement = this.pnlTermo.children[0] as HTMLDivElement;
        if (this.jogo.ObterQuantidadeDeErros() == 0)
        {
            painel = this.pnlTermo.children[0] as HTMLDivElement;
        }
        if (this.jogo.ObterQuantidadeDeErros() == 1)
        {
            painel =   this.pnlTermo.children[1] as HTMLDivElement;
        }
        if (this.jogo.ObterQuantidadeDeErros() == 2)
        {
            painel =  this.pnlTermo.children[2]  as HTMLDivElement;
        }
        if (this.jogo.ObterQuantidadeDeErros() == 3)
        {
            painel =   this.pnlTermo.children[3] as HTMLDivElement;
        }
        if (this.jogo.ObterQuantidadeDeErros() == 4)
        {
            painel =   this.pnlTermo.children[4] as HTMLDivElement;
        }
        return painel;
    }

    Chutar(): void {
        if(this.palavraChutada.length < 5)
            return;
        
        let painelAtual:HTMLDivElement = this.EscolherPainelDoJogo();
        let letrasExistentes:string = this.jogo.RetornarLetrasExistentes(this.palavraChutada);
        let letrasCertas:string = this.jogo.RetornarLetrasCertas(this.palavraChutada);
        let letrasErradas:string = this.jogo.RetornarLetrasErradas(this.palavraChutada);
        this.DesbilitarBotoes(letrasExistentes,letrasCertas,letrasErradas);
        let resultado: boolean = this.jogo.VerificaChute(this.palavraChutada);
        let cores: string[] = this.jogo.ObterCoresDeFedBack();
        this.PintarDivs(cores,painelAtual);

        this.VerificaResultado(resultado);
        this.palavraChutada = '';
    }

    VerificaResultado(resultado: boolean) {
      if(resultado == true){
        const notificacaoVitoria:HTMLHeadElement = document.createElement('h3');
        notificacaoVitoria.textContent = 'Vitoria! Voce Acertou com '+ this.jogo.ObterQuantidadeDeErros() + ' tentativas!';
        this.notificacao.appendChild(notificacaoVitoria);
        this.notificacao.style.color = "green";
        this.notificacao.style.border= "2px solid green";
        this.notificacao.style.borderRadius = "10px";

        this.atualizarHistorico();
      }
      if(resultado == false){
        if(this.jogo.ObterQuantidadeDeErros() == 5){
            const notificacaoDerrota:HTMLHeadElement = document.createElement('h3');
            notificacaoDerrota.textContent = 'Voce Perdeu, Tente Novamente! A Palavra era '+ this.jogo.palavraSecreta;
            this.notificacao.appendChild(notificacaoDerrota);
            this.notificacao.style.color = "Red";
            this.notificacao.style.border= "2px solid red";
            this.notificacao.style.borderRadius = "10px";

            this.atualizarHistorico();
        }
      }
    }

    DesbilitarBotoes(letrasExistentes: string, letrasCertas: string,letrasErradas:string) {
        this.buttons.forEach(btn => {
            if(letrasExistentes.includes(btn.textContent as string)){
                btn.style.backgroundColor = "rgb(212, 164, 6)";
            }
            if(letrasCertas.includes(btn.textContent as string)){
                btn.style.backgroundColor = "rgb(68, 212, 6)";
            }
            if(letrasErradas.includes(btn.textContent as string)){
                btn.style.backgroundColor = "rgb(54, 70, 99)";
                btn.disabled = true;
            }
        });
    }

    ModificarTodosBotoes(desabilitar: boolean = true, cor:string = "rgb(54, 70, 99)") {
        this.buttons.forEach(btn => {
            btn.style.backgroundColor = cor;
            btn.disabled = desabilitar;
        });
    }

    PintarDivs(cores:string[], painelAtual:HTMLDivElement):void 
    {
        let i:number = 0;
        for (let index = 0; index < painelAtual.childNodes.length; index++) 
        {        
            if(painelAtual.childNodes[index].nodeName != '#text')
            {
                let divAtual:HTMLDivElement = painelAtual.childNodes[index] as HTMLDivElement;
                divAtual.style.backgroundColor = cores[i];
                i++;
            };       
        };
        cores = [];
    }
    
    private popularEstatisticas(): void {
        const lblJogos = document.getElementById('lblJogos') as HTMLParagraphElement;
        const lblVitorias = document.getElementById('lblVitorias') as HTMLParagraphElement;
        const lblDerrotas = document.getElementById('lblDerrotas') as HTMLParagraphElement;
        const lblSequencia = document.getElementById('lblSequencia') as HTMLParagraphElement;
    
        lblJogos.textContent = this.jogo.historico.jogos.toString();
        lblVitorias.textContent = this.jogo.historico.vitorias.toString();
        lblDerrotas.textContent = this.jogo.historico.derrotas.toString();
        lblSequencia.textContent = this.jogo.historico.sequencia.toString();
    }
    
    private desenharGridTentativas(): void {
        const elementos =
          Array.from(document.querySelectorAll('.valor-tentativa')) as HTMLParagraphElement[];
        
        const tentativas = this.jogo.historico.tentativas;
    
        for (let i = 0; i < tentativas.length; i++) {
          const label = elementos[i];
          const qtdTentativas = tentativas[i];
    
          label.textContent = qtdTentativas.toString();
    
          let tamanho: number = 0;
    
          if (qtdTentativas > 0 && this.jogo.historico.vitorias > 0)
            tamanho = qtdTentativas / this.jogo.historico.vitorias;
          else
            tamanho = 0.05;
    
          const novoTamanho = tamanho * 100;      
          label.style.width = `${(novoTamanho).toString()}%`;
        }
    }

    private atualizarHistorico(): void {
        this.localStorageService.salvarDados(this.jogo.historico);
        
        this.popularEstatisticas();
        this.desenharGridTentativas();
    }
        
}
window.addEventListener('load', () => new TelaTermo());