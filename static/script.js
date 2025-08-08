let dropArea = document.getElementById('drop-area');
let fileInput = document.getElementById('fileElem');
let previewContainer = document.getElementById('preview-container');

// Click to upload
dropArea.addEventListener('click', () => fileInput.click());

// Update preview when files are selected
fileInput.addEventListener('change', updatePreview);

// Drag & Drop handling
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.style.background = "#e8f0fe";
});

dropArea.addEventListener('dragleave', () => {
    dropArea.style.background = "white";
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.style.background = "white";
    fileInput.files = e.dataTransfer.files;
    updatePreview();
});

// Preview thumbnails + file count
function updatePreview() {
    previewContainer.innerHTML = "";
    let files = fileInput.files;

    if (files.length > 0) {
        dropArea.querySelector("p").textContent = `${files.length} file(s) selected`;
    } else {
        dropArea.querySelector("p").textContent = "📂 Drag & Drop images here or click to select";
    }

    for (let file of files) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let div = document.createElement("div");
            div.classList.add("preview");
            div.innerHTML = `<img src="${e.target.result}" alt="preview">`;
            previewContainer.appendChild(div);
        }
        reader.readAsDataURL(file);
    }
}

// Handle prediction
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let formData = new FormData(this);
    let loading = document.getElementById('loading');
    let resultsDiv = document.getElementById('results');

    loading.classList.remove('hidden');
    resultsDiv.innerHTML = '';

    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        loading.classList.add('hidden');
        resultsDiv.innerHTML = '';

        data.forEach(item => {
            if (item.error) {
                resultsDiv.innerHTML += `<p style="color:red;">${item.filename}: ${item.error}</p>`;
            } else {
                resultsDiv.innerHTML += `
                    <div class="result">
                        <img src="data:image/jpeg;base64,${item.image}" alt="${item.filename}">
                        <h4>${item.class}</h4>
                        <p>Confidence: ${item.confidence}</p>
                    </div>
                `;
            }
        });
    })
    .catch(err => {
        loading.classList.add('hidden');
        console.error('Error:', err);
    });
});
