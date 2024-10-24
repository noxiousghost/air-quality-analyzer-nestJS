document.addEventListener('DOMContentLoaded', () => {
  const createRecordForm = document.getElementById('create-record-form');
  const swal = window.swal;

  createRecordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(createRecordForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/report/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result.status);
      swal({
        icon: result.status == 'error' ? 'error' : 'success',
        text: result.message || 'Record created successfully',
      });
    } catch (error) {
      swal({
        icon: 'error',
        title: 'Error creating record',
        text: error.message,
      });
    }
  });
});
