
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async() => {
    try {
    let reg;
    reg = await navigator.serviceWorker.register('./sw.js', {type: "module"});
    console.log('Service worker registrada! 😎', reg);
    }catch (err) {
    console.log('😢 Service worker registro falhou:', err);
    }
    });
}
    
//configurando as constraintes do video stream
var constraints = { video: {facingMode: "user"}, audio: false };
//capturando os elementos em tela

const cameraView = document.querySelector("#camera--view"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraTrigger = document.querySelector("#camera--trigger"),
  cameraSensor = document.querySelector("#camera--sensor"),
  cameraVerso = document.querySelector("#camera--verso")


//Estabelecendo o acesso a camera e inicializando a visualização
function cameraStart(){
  navigator.mediaDevices
   .getUserMedia(constraints)
   .then(function (stream){
    let track = stream.getTracks[0];
    cameraView.srcObject = stream;
 })
  .catch(function (error){
    console.error("Ocorreu um Erro.", error);
 });
}
//função para tirar foto
cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  adicionarDados(cameraOutput.src);
  cameraOutput.classList.add("taken");
};

//carrega imagem de camera quando a janela carregar
window.addEventListener("load", cameraStart, false);


import { openDB } from "idb";

let db;
async function criarDB(){
    try {
        db = await openDB('banco', 2, {
            upgrade(db, oldVersion, newVersion, transaction){
                switch  (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('dado', {
                            keyPath: 'nome'  //* A propriedade nome será o campo chave *//

                        });
                    //* Criando um indice id na store, deve estar contido no objeto do banco. *//
                        store.createIndex('id', 'id');
                        console.log("Banco de dados criado!");
                }
            }
        });
        console.log("banco de dados aberto!");
    }catch (e) {
        console.log('Erro ao criar/abrir banco: ' + e.message);
    }
}

window.addEventListener('DOMContentLoaded', async event =>{
    criarDB();
       //* document.getElementById("input");*//
    document.getElementById('btnCadastro').addEventListener('click', adicionarDados);
    document.getElementById('btnCarregar').addEventListener('click', buscarTodosDados);
    document.getElementById("btnBuscar").addEventListener("click", buscarNome);

});

async function buscarTodosDados(){
    if(db == undefined){
        console.log("O banco de dados está fechado.");
    }
    const tx = await db.transaction('dado', 'readonly');
    const store = await tx.objectStore('dado');
    const dados = await store.getAll();
    if(dados){
        const divLista = dados.map(dado => {
            return `<div class="item">
                    <h3>Cliente</h3>
                    <p>${dado.nome}</p>
                    <p>${dado.email} </p>
                    <p>${dado.tel}</p>
                    <p>${dado.time}</p>
                    <img src="${dado.foto_usuario}" alt="socorro"/>
                    <img src="${dado.fototirada}" alt="socorro"/>
                   </div>`
        });
        listagem(divLista.join(' '));
    } 
}

async function adicionarDados(fototirada) {
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let tel = document.getElementById("tel").value;
    let time = document.getElementById("time").value;
    let foto_usuario = document.getElementById("foto_usuario").value;
    const tx = await db.transaction('dado', 'readwrite')
    const store = tx.objectStore('dado');
    try {
        await store.add({ nome: nome, email: email, tel: tel, time: time, foto_usuario:foto_usuario, fototirada:fototirada});
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
}

function listagem(text){
    document.getElementById('resultados').innerHTML = text;
}

async function buscarNome() {
    const buscarN = document.getElementById("buscarN").value;
    if (!buscarN) {
        console.log('Insira um nome');
        return;
    }

    if (db == undefined) {
        console.log("O banco de dados está fechado.");
    }
    const tx = await db.transaction('dado', 'readonly');
    const store = await tx.objectStore('dado');
    try {
        const dado = await store.get(buscarN);
        if (dado) {
            const divDado = `
                <div class="item">
                    <h3>Cliente</h3>
                    <p>${dado.nome}</p>
                    <p>${dado.email} </p>
                    <p>${dado.tel}</p>
                    <p>${dado.time}</p>
                    <img src="${dado.foto_usuario}" alt="socorro"/>
                    <img src="${dado.fototirada}" alt="socorro"/>
                </div>`;
            listagem(divDado);
        } else {
            console.log(`Cliente com nome "${buscarN}" não encontrada🤔`);
        }
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
    }
}


