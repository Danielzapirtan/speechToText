// transcriptWorker.js
// Direct audio file processing approach
let mediaRecorder;
let audioContext;
let recognition;

self.onmessage = async function(e) {
    switch(e.data.command) {
        case 'start':
            await initializeAudio();
            break;
        case 'processFile':
            await processAudioFile(e.data.file);
            break;
        case 'stop':
            stopProcessing();
            break;
    }
};

async function initializeAudio() {
    try {
        // Initialize Web Speech API
        recognition = new (self.SpeechRecognition || self.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
            self.postMessage({
                type: 'transcript',
                data: transcript
            });
        };

        recognition.onerror = (event) => {
            self.postMessage({
                type: 'error',
                data: `Speech recognition error: ${event.error}`
            });
        };

        // Initialize Audio Context
        audioContext = new (self.AudioContext || self.webkitAudioContext)();
        
        self.postMessage({
            type: 'status',
            data: 'Audio system initialized'
        });
    } catch (error) {
        self.postMessage({
            type: 'error',
            data: `Initialization error: ${error.message}`
        });
    }
}

async function processAudioFile(file) {
    try {
        // Direct file processing approach
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Create source and connect to audio context
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        
        // Create analyzer for audio processing
        const analyzer = audioContext.createAnalyser();
        source.connect(analyzer);
        analyzer.connect(audioContext.destination);
        
        // Start playback and recognition
        source.start(0);
        recognition.start();
        
        source.onended = () => {
            recognition.stop();
            self.postMessage({
                type: 'status',
                data: 'Processing completed'
            });
        };
    } catch (error) {
        self.postMessage({
            type: 'error',
            data: `Processing error: ${error.message}`
        });
    }
}

function stopProcessing() {
    if (recognition) {
        recognition.stop();
    }
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
    if (audioContext) {
        audioContext.close();
    }
}

// Alternative approach using analog loopback (not recommended but included for reference)
async function setupAnalogLoopback() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        recognition.start();
        
        mediaRecorder.ondataavailable = async (event) => {
            const audioBlob = new Blob([event.data], { type: 'audio/webm' });
            // Process the recorded audio chunk
            await processAudioChunk(audioBlob);
        };
        
        mediaRecorder.start(1000); // Capture in 1-second chunks
    } catch (error) {
        self.postMessage({
            type: 'error',
            data: `Loopback setup error: ${error.message}`
        });
    }
}