// main.js
const audioFile = document.getElementById('audioFile');
const transcribeButton = document.getElementById('transcribeButton');
const transcriptArea = document.getElementById('transcript');

transcribeButton.addEventListener('click', () => {
    const file = audioFile.files[0];

    if (!file) {
        alert('Please select an audio file.');
        return;
    }

    const worker = new Worker('transcriptWorker.js');

    worker.onmessage = (event) => {
        transcriptArea.value = event.data;
    };

    worker.postMessage(file);
});
