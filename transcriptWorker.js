// transcriptWorker.js
// Speech recognition setup
self.onmessage = async function(e) {
	if (e.data.type === 'processTranscript') {
		const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onresult = (event) => {
			let transcript = '';
			for (let i = 0; i < event.results.length; i++) {
				transcript += event.results[i][0].transcript + ' ';
			}
			transcriptionDiv.textContent = transcript;
			self.postMessage({
				type: 'transcriptProgress',
				transcript: transcript
			});
		};

		recognition.onerror = (event) => {
			showStatus('Error during transcription: ' + event.error, 'error');
			startButton.disabled = false;
		};

		recognition.onend = () => {
			startButton.disabled = false;
			showStatus('Transcription completed.', 'success');
		};

