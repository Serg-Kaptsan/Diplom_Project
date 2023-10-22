

// Додаємо функцію для перетворення коми на крапку в інпутах, кі мають містити числівники
    const numberInputs = document.querySelectorAll('input[type="number"]');

    numberInputs.forEach(function(input) {
        input.addEventListener('input', function () {
            this.value = this.value.replace(',', '.');
        });
    });

// Передаємо фото-файл на сервер:
    
    function uploadFile() {

        const fileInput = document.getElementById('image');
        if (fileInput.files.length === 0) {
            alert('Please select a file to upload.');
            return;
        }
    
        const imageFile = new FormData();
        imageFile.append('image', fileInput.files[0]);

        const accessToken = localStorage.getItem('token');
    
        const requestOptions = {
            method: 'POST',
            body: imageFile,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        };
    
        fetch('http://localhost:8081/upload', requestOptions)
            .then(response => {
                if (!response.ok) {
                    alert('An error occurred while uploading the file to the server.');
                    return;
                }
                alert('The file was successfully uploaded to the server.');
                fileInput.value = '';             
                return response.json();
            })

            .then(data => {
                // Опрацьовуємо відповідь від сервера (за бажанням)
                console.log('Upload successful:', data);
            })
            .catch(error => {
                console.error('An error has occurred:', error);
            });

    }
    
    const uploadButton = document.querySelector('.upload');
    uploadButton.addEventListener('click', function(event) {
        event.preventDefault();
    });

