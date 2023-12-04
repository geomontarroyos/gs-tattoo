
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


//Converta a imagem
function convertImageToBase64(imageUrl, callback) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataURL = canvas.toDataURL('image/png');
      callback(dataURL);
  };
  img.src = imageUrl;
}


//armazenando
function storeImageInDB(imageUrl) {
  convertImageToBase64(imageUrl, function(base64Image) {
      var request = indexedDB.open('BancoDeDados', 1);

      request.onsuccess = function(event) {
          var db = event.target.result;
          var transaction = db.transaction(['Imagens'], 'readwrite');
          var objectStore = transaction.objectStore('Imagens');

          var imageData = {
              data: base64Image,
              timestamp: new Date().getTime()
          };

          var requestAdd = objectStore.add(imageData);

          requestAdd.onsuccess = function(event) {
              console.log('Imagem armazenada com sucesso no IndexedDB.');
          };

          requestAdd.onerror = function(event) {
              console.error('Erro ao armazenar a imagem no IndexedDB.');
          };
      };
  });
}
