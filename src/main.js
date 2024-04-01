//Navigation Bar
const generatorTab = document.querySelector(".nav-gene");
const scannerTab = document.querySelector(".nav-scan");

generatorTab.addEventListener("click", () => {
generatorTab.classList.add("active");
scannerTab.classList.remove("active");

document.querySelector(".scanner").style.display="none";
document.querySelector(".generator").style.display="block";
});

scannerTab.addEventListener("click", () => {
    scannerTab.classList.add("active");
    generatorTab.classList.remove("active");
    
    document.querySelector(".scanner").style.display="block";
    document.querySelector(".generator").style.display="none";
    });

//Generator
const generatorDiv = document.querySelector(".generator");
const generateBtn = generatorDiv.querySelector(".generator-form button");
const qrInput = document.getElementById("inp");
const qrImg = generatorDiv.querySelector(".generator-image img");
const downloadBtn = generatorDiv.querySelector(".generator-btn .btn-link");
const unnecessary1 = generatorDiv.querySelector(".generator-image");
const unnecessary2 = generatorDiv.querySelector(".generator-btn");
const unnecessary3 = generatorDiv.querySelector(".generator-form");
const dropdown = generatorDiv.querySelector(".generator-form #dropdown");


let imgURL='';
let no=0;

generateBtn.addEventListener("click", ()=>generate());

function generate(){
    let qrValue=qrInput.value;
    let size=dropdown.value;
    if(!qrValue.trim()) 
    return; //If value entered as input is whitespace then do nothing.
    unnecessary1.classList.remove("active");
    unnecessary2.classList.remove("active");
    unnecessary3.classList.remove("active");
    generateBtn.innerText="Please Wait . . .";

    imgURL=`https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${qrValue}`;
    qrImg.src=imgURL;
    qrImg.addEventListener("load", () => {
        generatorDiv.classList.add("active");
        generateBtn.innerText= "Generate QR Code";
    })
}

qrInput.addEventListener('input', ()=>{
    generateBtn.click();
})

dropdown.addEventListener("change", ()=>{
    generateBtn.click();
})
  
downloadBtn.addEventListener("click", () => {
    if(!imgURL) return;
    fetchImage(imgURL);
});

function fetchImage(url){
    fetch(url).then(response=>response.blob()).then(file => {
        let tempFile = URL.createObjectURL(file);
        let extension=file.type.split("/")[1];
        download(tempFile, extension);
    })
    .catch(()=>imgURL='');
}

function download(tempFile, extension){
    no=no+1;
    let a=document.createElement('a');
    a.href=tempFile;
    a.download=`image${no}.${extension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

qrInput.addEventListener("input", ()=>{
    if(!qrInput.value.trim()){
        generatorDiv.classList.remove("active");
        unnecessary1.classList.add("active");
        unnecessary2.classList.add("active");
        unnecessary3.classList.add("active");
    }
});

//Scanner
const scannerDiv=document.querySelector(".scanner");
const camera=scannerDiv.querySelector("h1 .fa-camera");
const stopCam=scannerDiv.querySelector("h1 .fa-circle-stop");
const form=scannerDiv.querySelector(".scanner-form");
const fileInput=form.querySelector("input");
const p=form.querySelector("p");
const img=form.querySelector("img");
const video=form.querySelector("#reader");
const content=form.querySelector(".content");
const textarea=scannerDiv.querySelector(".scanner-details textarea");
const copyBtn=scannerDiv.querySelector(".scanner-details .copy");
const closeBtn=scannerDiv.querySelector(".scanner-details .close");
const icon=form.querySelector(".fa-cloud-arrow-up");

icon.addEventListener("click", ()=>fileInput.click());

fileInput.addEventListener("change", e=>{
    let file=e.target.files[0];
    if(!file) return;
    fetchRequest(file);
});

function fetchRequest(file){
    let formData=new FormData();
    formData.append("file", file);
    p.innerText="Scanning . . .";
    fetch(`http://api.qrserver.com/v1/read-qr-code/`, {
        method: "POST", body: formData
    }).then(res=> res.json()).then(result=>{
        let text = result[0].symbol[0].data;
        if(!text) return p.innerText="Couldn't Scan QR Code";
       scannerDiv.classList.add("active1");
       form.classList.add("active-img");
       img.src = URL.createObjectURL(file);
       textarea.textContent=text;
       camera.classList.add("inactive");
    });
}

//Camera
camera.addEventListener("click", ()=>{
    var cameraId;
    const config = { fps: 20, qrbox: { width: 200, height: 200 } };
    camera.style.display="none";
    p.innerText="Scanning . . .";

    //Checking the availability of cameras
    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
          cameraId = devices[0].id;
        }
      }).catch(err => {
        alert("Cant get cameras");
      });

    // Declaring the scanner block.
    const html5QrCode = new Html5Qrcode("reader");

    // In case if the user stops camera while scanning.
        stopCam.addEventListener("click",()=>{
            html5QrCode.stop().then((ignore) => {}).catch((err) => {});
            p.innerText="Upload QR Code";
            scannerDiv.classList.remove("active1");
            scannerDiv.classList.remove("active");
            form.classList.remove("active-video");
            camera.classList.remove("inactive");
            stopCam.style.display="none";
            camera.style.display="inline-block";
            textarea.classList.remove("hide");
            copyBtn.classList.remove("hide");
            closeBtn.classList.remove("hide");
            form.classList.remove("scanning");
        });

    // If the QR is scanned successfully.
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        textarea.classList.remove("hide");
        copyBtn.classList.remove("hide");
        closeBtn.classList.remove("hide");
        textarea.textContent=decodedText;
        p.innerText="Scanned";
        form.classList.remove("active-video");
        stopCam.style.display="none";
        camera.style.display="inline-block";
        form.classList.remove("scanning");
        html5QrCode.stop().then((ignore) => {}).catch((err) => {});
};
    
    // Starting the camera.
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      }
      if (isMobileDevice()) {
        html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
      } else {
        html5QrCode.start({ deviceId: { exact: cameraId} }, config, qrCodeSuccessCallback);
      }

    form.classList.add("active-video");
    form.classList.add("scanning");
    scannerDiv.classList.add("active");
    stopCam.style.display="inline-block";
    textarea.classList.add("hide");
    copyBtn.classList.add("hide");
    closeBtn.classList.add("hide");
    
    function error(err){}
});

// Copy Button
copyBtn.addEventListener("click", ()=>{
    let text=textarea.textContent;
    navigator.clipboard.writeText(text);
})

// Close Button
function stopScan(){
    textarea.classList.remove("hide");
    p.innerText="Upload QR Code";
    scannerDiv.classList.remove("active1");
    scannerDiv.classList.remove("active");
    form.classList.remove("active-img");
    form.classList.remove("active-video");
    camera.classList.remove("inactive");
    stopCam.style.display="none";
    camera.style.display="inline-block";
    form.classList.remove("scanning");
}

closeBtn.addEventListener("click", ()=> stopScan());
