import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { Row, Col } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from 'react-chartjs-2';
import { callCoinMarketApi } from "./service/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

function App() {
  const chartRef = useRef<any>(null);
  const [coinData, setCoinData] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [data, setData] = useState<{ labels: string[]; datasets: any[] }>({ labels: [], datasets: [] });
  const [dates, setDates] = useState<string[]>([]);
  const [options, setOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '',
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: true,
            borderColor: "rgba(54,162,235,0.5)",
            borderWidth: 1,
            backgroundColor: "rgba(54,162,235,0.15)",
          },
          mode: "x" as const,
        },
        pan: {
          enabled: true,
          mode: "x" as const,
        },
        limits: {
          x: { min: 0 },
        },
      },
    },
    scales: {
      x: {
        time: {
          tooltipFormat: 'DD/MM',
        }
      },
    },
  });

  useEffect(() => {
    callCoinMarketApi().then((data) => {
      const getData = getLimitData(data);

      setCoinData(getData.coinValue);
      setMetaData(getData.metaData);
    })
  }, []);

  useEffect(() => {
    handleFormatCoinData();
  }, [coinData, metaData]);

  const handleResetZoom = () => {
    if(chartRef.current){
      chartRef.current.resetZoom(); // Gọi hàm reset zoom của Chart.js
    }
  };

  function handleFormatCoinData() {
    const currentYear = getCurrentYear();
    const formatDate = dates.map(d => dayjs(d).format("DD/MM"));
    const formatData = Object.entries(coinData).filter((d) => {
      const year = d[0].split('-')[0];
      return currentYear === Number(year);
    }).reverse().map(e => ({ date: e[0], value: e[1] }));

    setData({
      labels: formatDate,
      datasets: [
        {
          label: 'High Price',
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          data: formatData.map(d => {
            return {
              x: dayjs(d.date).format("DD/MM"),
              y: Number(d.value['2. high'] || 0)
            }
          }),
          tension: 0.3,
          fill: false,
        },
        {
          label: 'Low Price',
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          data: formatData.map(d => {
            return {
              x: dayjs(d.date).format("DD/MM"),
              y: Number(d.value['3. low'] || 0)
            }
          }),
          tension: 0.3,
          fill: false,
        },
      ]
    })
  }

  function getLimitData(coinData: any) {
    const limit = 20;
    let data = {
      metaData: {},
      coinValue: []
    };
    
    data.metaData = coinData['Meta Data'];

    for(let i = 0; i < limit; i++) {
      data.coinValue = coinData['Time Series FX (Weekly)'];
    }

    setDates(getYearForLabel(data.coinValue));
    return data;
  }

  function getYearForLabel(data: any) {
    const currentYear = getCurrentYear();

    return Object.keys(data).filter(d => {
      const year = d.split('-')[0];
      return currentYear === Number(year);
    }).reverse();
  }

  function getCurrentYear() {
    return new Date().getFullYear();
  }

  return (
    <div style={{ background: "#0d1117", minHeight: "100vh", padding: 20, color: "#fff" }}>
      <Row gutter={16}>
        <Col span={16}>
          <Line ref={chartRef} options={options} data={data}></Line>
        </Col>

        {/* Sentiment */}
        {/* <Col span={8}>
          <Card style={{ background: "#161b22", color: "#fff" }} bordered={false}>
            <h3 style={{ color: "#fff" }}>Sentiment</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: 30 }}>
              {sentimentData.map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: s.value * 3,
                      height: s.value * 3,
                      borderRadius: "50%",
                      background: "rgba(0, 200, 150, 0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {s.value}%
                  </div>
                  <p style={{ marginTop: 10 }}>{s.name}</p>
                </div>
              ))}
            </div>
          </Card>
        </Col> */}
      </Row>
      <div className="mt-2">
        <button
          onClick={handleResetZoom}
          style={{
            marginTop: "10px",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Reset Zoom
        </button>
      </div>
      {/* <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={8}>
          <Card style={{ background: "#161b22", color: "#fff" }} bordered={false}>
            <h3>Activity Frequency</h3>
            <p style={{ fontSize: 12, color: "#8b949e" }}>Mentions & Engagements (demo)</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {[...Array(35)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 20,
                    height: 20,
                    background: i % 6 === 0 ? "#2ea043" : "#21262d",
                    borderRadius: 4,
                  }}
                />
              ))}
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card style={{ background: "#161b22", color: "#fff", display: "flex", alignItems: "center" }} bordered={false}>
            <Avatar src="https://i.pravatar.cc/100" size={64} />
            <div style={{ marginLeft: 16 }}>
              <h3 style={{ margin: 0 }}>DOG DOGGOTOTH...</h3>
              <p style={{ margin: 0, color: "#8b949e" }}>DOG</p>
            </div>
          </Card>
        </Col>
      </Row> */}
    </div>
  );
}

export default App;
