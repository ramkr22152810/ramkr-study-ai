// assets/js/dashboard.js

// TODO: put your real CSV URL here
const CSV_URL = "https://example.com/company_intel_latest.csv";

function renderCharts(data) {
  const companies = data.map((row) => row.company_name || row.Company);
  const employees = data.map((row) =>
    Number(row.total_employees || row.TotalEmployees || 0)
  );
  const attrition = data.map((row) =>
    Number(row.attrition_rate || row.AttritionRate || 0)
  );

  const employeesCtx = document
    .getElementById("employeesChart")
    .getContext("2d");
  const attritionCtx = document
    .getElementById("attritionChart")
    .getContext("2d");

  new Chart(employeesCtx, {
    type: "bar",
    data: {
      labels: companies,
      datasets: [
        {
          label: "Total Employees",
          data: employees,
          backgroundColor: "#38bdf8",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
    },
  });

  new Chart(attritionCtx, {
    type: "bar",
    data: {
      labels: companies,
      datasets: [
        {
          label: "Attrition Rate (%)",
          data: attrition,
          backgroundColor: "#f97316",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          ticks: {
            callback: (v) => v + "%",
          },
        },
      },
    },
  });
}

function renderTable(data) {
  const table = document.getElementById("dataTable");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  if (!data || data.length === 0) return;

  const columns = Object.keys(data[0]);

  thead.innerHTML =
    "<tr>" + columns.map((c) => `<th>${c}</th>`).join("") + "</tr>";

  tbody.innerHTML = data
    .map(
      (row) =>
        "<tr>" +
        columns.map((c) => `<td>${row[c] ?? ""}</td>`).join("") +
        "</tr>"
    )
    .join("");
}

function loadCsv() {
  Papa.parse(CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const data = results.data;
      renderCharts(data);
      renderTable(data);
    },
    error: function (err) {
      console.error("CSV load error:", err);
      alert("Failed to load CSV. Check CSV_URL in dashboard.js.");
    },
  });
}

document.addEventListener("DOMContentLoaded", loadCsv);
