// main.js
class AudioProcessor {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.worker = new Worker('transcriptWorker.js');
    this.setupWorkerHandlers();
  }

  setupWorkerHandlers() {
    this.worker.onmessage = (e) => {
      if (e.data.type === 'transcriptProgress') {
        this.updateTranscriptUI(e.data.transcript);
      }
    };
  }

  async processAudioFile(audioFile) {
    try {
      // Start audio playback
      const audioBuffer = await this.loadAudioFile(audioFile);
      const playbackPromise = this.playAudio(audioBuffer);

      // Start transcript processing in parallel
      const arrayBuffer = await audioFile.arrayBuffer();
      this.worker.postMessage({
        type: 'processTranscript',
        audioData: arrayBuffer
      });

      // Wait for both operations to complete
      await playbackPromise;
      console.log('Audio playback completed');
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  }

  async loadAudioFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  playAudio(audioBuffer) {
    return new Promise((resolve) => {
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.onended = resolve;
      source.start(0);
    });
  }

  updateTranscriptUI(transcript) {
    const transcriptElement = document.getElementById('transcript');
    if (transcriptElement) {
      transcriptElement.textContent = transcript;
    }
  }
}
