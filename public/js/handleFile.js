document.addEventListener('DOMContentLoaded', () => {
  const uploadCSVForm = document.getElementById('upload-csv-form');
  const processCSVButton = document.getElementById('process-csv');
  const resultDiv = document.getElementById('result');
  const swal = window.swal;
  let uploadedFileId;

  uploadCSVForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadCSVForm);
    try {
      const response = await fetch('/api/file/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      uploadedFileId = result.savedFile.id;
      console.log(uploadedFileId);
      swal({
        icon: 'success',
        title: 'File uploaded successfully',
        text: 'Click "Save File Contents" to process the data.',
      });
      processCSVButton.style.display = 'block';
    } catch (error) {
      swal({
        icon: 'error',
        title: 'Error saving file',
        text: error.message,
      });
    }
  });

  processCSVButton.addEventListener('click', async () => {
    if (!uploadedFileId) {
      swal({
        icon: 'error',
        text: 'Please upload a CSV file first.',
      });
      return;
    }
    resultDiv.style.display = 'block';
    try {
      const response = await fetch(`/api/file/process/${uploadedFileId}`, {
        method: 'POST',
      });

      const result = await response.json();

      resultDiv.innerHTML = `<div> 
      CSV file processed.
      <span style="color:green">Success: ${result.successCount}</span>,&nbsp;<span style="color:red">Errors: ${result.errors.length}</span>
      </div>
      `;
      if (result.errors.length > 0) {
        resultDiv.innerHTML +=
          '<br>' +
          '<span style="color:red">' +
          result.errors.join('<br>') +
          '</span>';
      }
    } catch (error) {
      swal({
        icon: 'error',
        title: 'Error processing CSV file',
        text: error.message,
      });
    }
  });
});
