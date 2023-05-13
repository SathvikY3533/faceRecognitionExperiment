// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false};
// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

const redSpan = document.getElementById("red");
const greenSpan = document.getElementById("green");
const blueSpan = document.getElementById("blue");

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time*1000));
}
// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });
}

function captureFrame() {
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    analyzeFrame(cameraSensor);
    setTimeout(3000);
    requestAnimationFrame(captureFrame);
}

function analyzeFrame(frame) {
    // Access the pixel data of the captured frame
    var imageData = frame.getContext("2d").getImageData(0, 0, frame.width, frame.height);
    var pixels = imageData.data;

    // Perform your analysis on the pixel data
    // Example: Count the number of red pixels in the frame
    var redPixels = 0;
    var bluePixels = 0;
    var greenPixels = 0;
    for (var i = 0; i < pixels.length; i += 4) {
        var red = pixels[i];
        var green = pixels[i + 1];
        var blue = pixels[i + 2];
        
        if (red > green && red > blue) {
            redPixels++;
        } else if(red < green && green > blue) {
            greenPixels++;
        } else if(blue > green && red < blue) {
            bluePixels++;
        }
    }
    redSpan.innerHTML = "Red pixels:  " + redPixels;
    greenSpan.innerHTML = "Green pixels:  " + greenPixels;
    blueSpan.innerHTML = "Blue pixels:  " + bluePixels;

    // Output the analysis result
}

cameraView.addEventListener("loadedmetadata", function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    captureFrame();
});

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);

