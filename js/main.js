
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
  cameraVerso = document.querySelector("#camera--verso"),
  galeria = document.querySelector("#galeria")


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
  cameraOutput.classList.add("taken");
};
//carrega imagem de camera quando a janela carregar
window.addEventListener("load", cameraStart, false);

 // Função para converter uma imagem em dados e armazenar no Pridebites IndexedDB
 async function salvarImagemNoIndexedDB(imagem) {
    try {
      // Criar uma instância do Pridebites IndexedDB
      const indexedDB = new PridebitesIndexedDB('sua_base_de_dados', 'sua_loja');

      // Converter a imagem para dados
      const dadosImagem = await converterImagemParaDados(imagem);

      // Armazenar os dados no IndexedDB
      await indexedDB.adicionar('chave_unica', { imagem: dadosImagem });

      console.log('Imagem salva no IndexedDB com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar a imagem no IndexedDB:', error);
    }
  }
