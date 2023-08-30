import { historicoUsuario } from "../views/dominio/historico-usuario";

export class LocalStorageService{
    salvarDados(dados: historicoUsuario):void{
        const jsonString = JSON.stringify(dados);
        localStorage.setItem('termo-ts:hsitorico@1.0.0',jsonString);
    }
    carregarDados():historicoUsuario{
        const dadosJson = localStorage.getItem('termo-ts:hsitorico@1.0.0');

        if(dadosJson){
            return JSON.parse(dadosJson) as historicoUsuario;
        }
        return new historicoUsuario();
    }
}