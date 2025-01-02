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
