document.addEventListener('DOMContentLoaded', () => {
  const viewReportForm = document.getElementById('view-report-form');
  const reportResultDiv = document.getElementById('report-result');
  const swal = window.swal;

  viewReportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(viewReportForm);
    const data = Object.fromEntries(formData.entries());

    try {
      let response;
      let result;
      if (!data.month) {
        response = await fetch(`/api/report/aqi?year=${data.year}`, {
          method: 'GET',
        });
        result = await response.json();
        displayReport(result, data.year);
      } else {
        response = await fetch(
          `/api/report/aqi?month=${data.month}&year=${data.year}`,
          {
            method: 'GET',
          },
        );
        result = await response.json();
        displayReport(result, data.year, data.month);
      }

      if (!response.ok) {
        throw new Error(`${result.message} ${response.status}`);
      }
    } catch (error) {
      swal({
        icon: 'error',
        title: 'Error fetching report',
        text: error.message,
      });
      reportResultDiv.textContent = '';
    }
  });

  function displayReport(data, year, month) {
    const averageAQI = data.avg !== undefined ? data.avg.toFixed(2) : 'N/A';
    const maxAQI = data.max !== undefined ? data.max : 'N/A';
    const minAQI = data.min !== undefined ? data.min : 'N/A';

    let measurementsList = '<p>No measurements available for this period.</p>';
    if (Array.isArray(data.list) && data.list.length > 0) {
      measurementsList = `
                <ul>
                    ${data.list.map((m) => `<li>${m.date}: ${m.aqi}</li>`).join('')}
                </ul>
            `;
    }

    reportResultDiv.innerHTML = `
            <h3>Report for ${month ? month : ``} ${year}</h3>
            <p>Average AQI: ${averageAQI}</p>
            <p>Maximum AQI: ${maxAQI}</p>
            <p>Minimum AQI: ${minAQI}</p>
            ${
              month
                ? `<h4>AQI Measurements:</h4>
            ${measurementsList}`
                : ``
            }
        `;
  }
});
