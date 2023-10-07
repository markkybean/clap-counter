// Get the elements from the HTML
const startButton = document.getElementById("startButton");
const counter = document.getElementById("counter");

let clapCount = 0;
let isListening = false;

// Function to start listening for claps
function startListening() {
    if (!isListening) {
        isListening = true;
        startButton.textContent = "Stop Listening";

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                const microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);

                analyser.addEventListener("audioprocess", function() {
                    analyser.getByteFrequencyData(dataArray);
                    const clapThreshold = 150;
                    const clapDetected = dataArray.some(value => value > clapThreshold);

                    if (clapDetected) {
                        clapCount++;
                        counter.textContent = clapCount;
                    }
                });
            })
            .catch(function(error) {
                console.error("Error accessing microphone:", error);
            });
    } else {
        isListening = false;
        startButton.textContent = "Start Listening";
        counter.textContent = 0;
        audioContext.close();
    }
}

startButton.addEventListener("click", startListening);
