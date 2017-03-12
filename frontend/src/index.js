var AES = require("crypto-js/aes");

document.querySelector('.upload-btn').addEventListener('click', function (){

    document.querySelector('#upload-input').click();
    document.querySelector('.progress-bar').textContent = '0%';
    document.querySelector('.progress-bar').style.width = '0%';

});

document.querySelector('#upload-input').addEventListener('change', function(){

  var files = this.files;

  if (files.length > 0){

    // create a FormData object which will be sent as the data payload in the
    // AJAX request

    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      var reader = new FileReader();

      reader.onload = function (e) {

        console.log(file)
        var encrypted = AES.encrypt(e.target.result, "password");
        var encryptedFile = new File([encrypted], file.name + '.encrypted', {type: "text/plain", lastModified: new Date()});

        // add the files to formData object for the data payload
        formData.append('uploads[]', encryptedFile, encryptedFile.name);

        var request = new XMLHttpRequest();
        request.open('POST', '/upload', true);

            request.upload.addEventListener('progress', function(evt) {

              if (evt.lengthComputable) {
                // calculate the percentage of upload completed
                var percentComplete = evt.loaded / evt.total;
                percentComplete = parseInt(percentComplete * 100);

                // update the Bootstrap progress bar with the new percentage
                console.log(percentComplete);
                document.querySelector('.progress-bar').textContent = percentComplete + '%';
                document.querySelector('.progress-bar').style.width = percentComplete + '%';

                // once the upload reaches 100%, set the progress bar text to done
                if (percentComplete === 100) {
                  document.querySelector('.progress-bar').innerHTML = 'Done';
                }

              }

            }, false);


        request.onload = function() {
          if (this.status >= 200 && this.status < 400) {
            // Success!
            console.log('upload successful!\n' + this.response);
          } else {
            console.log('upload failed - ' + this.status + '\n' + this.response);
          }
        };

        request.onerror = function() {
            console.log('upload failed ' + this);
        };

        request.send(formData);

      }

      reader.readAsDataURL(file);

    }

  }
});