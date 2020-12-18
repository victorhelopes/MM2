export const barOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#ABFAA9"],
    grid: {
      show: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "100px",
      },
    },
    dataLabels: {
      enabled: true,
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          colors: "#495057",
          fontSize: "12px",
        }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: [
      {
        labels: {
            maxWidth: 200,
            style: {
                colors: "#495057",
                fontSize: "12px",
            },
            formatter: function (value) {
                return parseFloat(value).toFixed(2);
            }
        },
      },
    ],
  };