import { openDB } from "idb";

let db;
async function criarDB(){
    try {
        db = await openDB('banco', 2, {
            upgrade(db, oldVersion, newVersion, transaction){
                switch  (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('Dados', {
                            keyPath: 'nome'  //* A propriedade nome será o campo chave *//

                        });
                    //* Criando um indice id na store, deve estar contido no objeto do banco. *//
                        store.createIndex('id', 'id');
                        console.log("banco de dados criado!");
                }
            }
        });
        console.log("Banco de dados aberto!");
    }catch (e) {
        console.log('Erro ao criar/abrir banco: ' + e.message);
    }
}

window.addEventListener('DOMContentLoaded', async event =>{
    criarDB();
       //* document.getElementById("input");*//
    document.getElementById('btnCadastro').addEventListener('click', adicionarDados);
    document.getElementById('btnCarregar').addEventListener('click', buscarTodasAnotacoes);
    document.getElementById("btnBuscar").addEventListener("click", buscarNome);

});

async function buscarTodasAnotacoes(){
    if(db == undefined){
        console.log("O banco de dados está fechado.");
    }
    const tx = await db.transaction('Dados', 'readonly');
    const store = await tx.objectStore('Dados');
    const anotacoes = await store.getAll();
    if(anotacoes){
        const divLista = anotacoes.map(Dados => {
            return `<div class="item">
                    <h1>Cliente</h1>
                    <p>${Dados.nome}</p>
                    <p>${Dados.email} </p>
                    <p>${Dados.tel}</p>
                    <p>${Dados.time}</p>
                    <p>${Dados.foto_usuario}</p>
                   </div>`
        });
        listagem(divLista.join(' '));
    } 
}

async function adicionarDados() {
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let tel = document.getElementById("tel").value;
    let time = document.getElementById("time").value;
    let foto_usuario = document.getElementById("foto_usuario").value;
    const tx = await db.transaction('Dados', 'readwrite')
    const store = tx.objectStore('Dados');
    try {
        await store.add({ nome: nome, email: email, tel: tel, time: time, foto_usuario:foto_usuario });
        await tx.done;
        limparCampos();
        console.log('Registro adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar registro:', error);
        tx.abort();
    }
}


function limparCampos() {
    document.getElementById("nome").value = '';
    document.getElementById("email").value = '';
    document.getElementById("tel").value = '';
    document.getElementById("time").value = '';
    document.getElementById("foto_usuario").value = '';
    document.getElementById('buscar').value = '';
}

function listagem(text){
    document.getElementById('resultados').innerHTML = text;
}

async function buscarNome() {
    const buscarT = document.getElementById("buscarN").value;
    if (!buscarT) {
        console.log('Insira um nome');
        return;
    }

    if (db == undefined) {
        console.log("O banco de dados está fechado.");
    }
    const tx = await db.transaction('Dados', 'readonly');
    const store = await tx.objectStore('Dados');
    try {
        const Dados = await store.get(buscarT);
        if (Dados) {
            const divDados = `
                <div class="item">
                    <h1>Cliente</h1>
                    <p>${Dados.titulo}</p>
                    <p>${Dados.data} </p>
                    <p>${Dados.categoria}</p>
                    <p>${Dados.descricao}</p>
                </div>`;
            listagem(divDados);
        } else {
            console.log(`Cliente com nome "${buscarN}" não encontrada🤔`);
        }
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
    }
}

