
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [circuitState, setCircuitState] = useState('CLOSED');
  const [logs, setLogs] = useState([]);

  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [
      {
        label: 'SAP OData Traffic Stream',
        data: [],
        borderColor: '#58a6ff',
        backgroundColor: 'rgba(88, 166, 255, 0.15)',
        tension: 0.3,
        fill: true
      }
    ]
  });

  // React → Global Spring Boot Render Backend
  const sendTraffic = async (isCrash) => {
    try {
      const url =
  `https://sap-api-gateway-backend-1.onrender.com/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder?crash=${isCrash}`;
      const response = await fetch(url);

      const data = await response.json();

      setTotalRequests((prev) => prev + 1);

      setCircuitState(data.circuitState || 'CLOSED');

      const sapPayload = data.sapPayload || {
        vbeln: 'SO-Pending',
        kunnr: 'N/A',
        matnr: 'MAT-Pending',
        netwr: 0,
        waerk: 'INR'
      };

      const newLog = {
        time: new Date().toLocaleTimeString(),
        ip: data.clientIp || '127.0.0.1',
        message: data.message || 'Request Registered',
        status: data.status || response.status,
        vbeln: sapPayload.vbeln || 'SO-Gen',
        matnr: sapPayload.matnr || 'MAT-Gen'
      };

      setLogs((prevLogs) => [newLog, ...prevLogs]);

      setGraphData((prev) => {
        const newLabels = [
          ...prev.labels,
          new Date().toLocaleTimeString().slice(-8)
        ];

        const newData = [
          ...prev.datasets[0].data,
          data.status === 200 ? 1 : 0
        ];

        if (newLabels.length > 7) {
          newLabels.shift();
          newData.shift();
        }

        return {
          labels: newLabels,
          datasets: [
            {
              ...prev.datasets[0],
              data: newData
            }
          ]
        };
      });

    } catch (error) {
      console.error(
        'Error connecting to SAP Spring Boot Gateway:',
        error
      );

      const errorLog = {
        time: new Date().toLocaleTimeString(),
        ip: '127.0.0.1',
        message: 'Backend connection failed',
        status: 0,
        vbeln: 'N/A',
        matnr: 'N/A'
      };

      setLogs((prevLogs) => [errorLog, ...prevLogs]);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#0d1117',
        color: '#c9d1d9',
        minHeight: '100vh',
        padding: '30px',
        fontFamily: 'Segoe UI, Arial, sans-serif'
      }}
    >

      {/* ================= HEADER ================= */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background:
            'linear-gradient(135deg, #172033, #1f2937)',
          padding: '22px 25px',
          borderRadius: '12px',
          border: '1px solid #30363d',
          borderLeft: '5px solid #0070d2',
          marginBottom: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.25)'
        }}
      >
        <div>
          <h2
            style={{
              color: '#ffffff',
              margin: 0,
              fontSize: '24px'
            }}
          >
            🛡️ SAP S/4HANA CLOUD
          </h2>

          <p
            style={{
              margin: '7px 0 0',
              color: '#8b949e',
              fontSize: '14px'
            }}
          >
            Resilient OData Proxy Gateway
          </p>
        </div>

        <span
          style={{
            padding: '10px 18px',
            borderRadius: '25px',
            fontWeight: 'bold',
            backgroundColor:
              circuitState === 'OPEN'
                ? '#4c1515'
                : '#064e3b',
            color:
              circuitState === 'OPEN'
                ? '#f87171'
                : '#34d399',
            border:
              circuitState === 'OPEN'
                ? '1px solid #ef4444'
                : '1px solid #10b981'
          }}
        >
          CIRCUIT: {circuitState}
        </span>
      </div>

      {/* ================= TOP CARDS ================= */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '18px',
          marginBottom: '25px'
        }}
      >

        {/* Total Requests */}

        <div
          style={{
            background: '#161b22',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #30363d'
          }}
        >
          <div style={{ color: '#8b949e' }}>
            TOTAL REQUESTS
          </div>

          <div
            style={{
              fontSize: '30px',
              fontWeight: 'bold',
              color: '#58a6ff',
              marginTop: '8px'
            }}
          >
            {totalRequests}
          </div>
        </div>

        {/* Circuit */}

        <div
          style={{
            background: '#161b22',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #30363d'
          }}
        >
          <div style={{ color: '#8b949e' }}>
            CIRCUIT STATUS
          </div>

          <div
            style={{
              fontSize: '25px',
              fontWeight: 'bold',
              marginTop: '10px',
              color:
                circuitState === 'OPEN'
                  ? '#f87171'
                  : '#34d399'
            }}
          >
            ● {circuitState}
          </div>
        </div>

        {/* Backend */}

        <div
          style={{
            background: '#161b22',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #30363d'
          }}
        >
          <div style={{ color: '#8b949e' }}>
            BACKEND
          </div>

          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginTop: '12px',
              color: '#34d399'
            }}
          >
            ● ONLINE
          </div>

          <div
            style={{
              fontSize: '12px',
              color: '#8b949e',
              marginTop: '5px'
            }}
          >
            sap-api-gateway-backend-1.onrender.com
          </div>
        </div>

      </div>

      {/* ================= CONTROL + CHART ================= */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(300px, 1fr) minmax(300px, 1.5fr)',
          gap: '20px'
        }}
      >

        {/* CONTROL PANEL */}

        <div
          style={{
            background: '#161b22',
            padding: '25px',
            borderRadius: '12px',
            border: '1px solid #30363d',
            boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
          }}
        >
          <h3
            style={{
              color: '#ffffff',
              marginTop: 0
            }}
          >
            ⚙️ SAP ODATA CONTROL
          </h3>

          <p
            style={{
              color: '#8b949e',
              lineHeight: '1.6'
            }}
          >
            Send SAP Sales Order requests through the
            resilient API gateway and test rate limiting
            and circuit breaker behavior.
          </p>

          <div
            style={{
              marginTop: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >

            <button
              onClick={() => sendTraffic(false)}
              style={{
                padding: '14px',
                background:
                  'linear-gradient(135deg, #238636, #2ea043)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              🚀 Send SAP Request
            </button>

            <button
              onClick={() => sendTraffic(true)}
              style={{
                padding: '14px',
                background:
                  'linear-gradient(135deg, #b91c1c, #da3637)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              🚨 Simulate SAP Crash
            </button>

          </div>

          <div
            style={{
              marginTop: '25px',
              padding: '12px',
              background: '#0d1117',
              borderRadius: '8px',
              border: '1px solid #30363d',
              fontSize: '13px',
              color: '#8b949e'
            }}
          >
            API Endpoint
            <br />
            <span
              style={{
                color: '#58a6ff',
                wordBreak: 'break-all'
              }}
            >
              sap-api-gateway-backend-1.onrender.com/sap/opu/odata
            </span>
          </div>
        </div>

        {/* CHART */}

        <div
          style={{
            background: '#161b22',
            padding: '25px',
            borderRadius: '12px',
            border: '1px solid #30363d',
            minHeight: '300px'
          }}
        >
          <h3
            style={{
              color: '#ffffff',
              marginTop: 0
            }}
          >
            📊 ENTERPRISE TRAFFIC HEALTH
          </h3>

          <div
            style={{
              height: '220px'
            }}
          >
            <Line
              data={graphData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: '#c9d1d9'
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#8b949e'
                    },
                    grid: {
                      color: '#30363d'
                    }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: '#8b949e',
                      stepSize: 1
                    },
                    grid: {
                      color: '#30363d'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

      </div>

      {/* ================= TRANSACTION LOG ================= */}

      <div
        style={{
          background: '#161b22',
          padding: '25px',
          borderRadius: '12px',
          border: '1px solid #30363d',
          marginTop: '25px',
          overflowX: 'auto'
        }}
      >
        <h3
          style={{
            color: '#ffffff',
            marginTop: 0
          }}
        >
          🚨 REAL-TIME SAP TRANSACTION TRACKER
        </h3>

        <p
          style={{
            color: '#8b949e',
            fontSize: '14px'
          }}
        >
          Total Packets: {totalRequests}
        </p>

        <table
          style={{
            width: '100%',
            minWidth: '800px',
            borderCollapse: 'collapse',
            marginTop: '15px'
          }}
        >
          <thead>
            <tr
              style={{
                background: '#21262d',
                color: '#c9d1d9',
                textAlign: 'left'
              }}
            >
              <th style={{ padding: '13px' }}>
                Timestamp
              </th>

              <th style={{ padding: '13px' }}>
                Client IP
              </th>

              <th style={{ padding: '13px' }}>
                SAP Doc Num
              </th>

              <th style={{ padding: '13px' }}>
                Material
              </th>

              <th style={{ padding: '13px' }}>
                Gateway Message
              </th>

              <th style={{ padding: '13px' }}>
                HTTP Code
              </th>
            </tr>
          </thead>

          <tbody>

            {logs.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: '30px',
                    textAlign: 'center',
                    color: '#8b949e'
                  }}
                >
                  No SAP transactions yet.
                  <br />
                  Click "Send SAP Request" to begin.
                </td>
              </tr>

            ) : (

              logs.map((log, index) => (

                <tr
                  key={index}
                  style={{
                    borderBottom:
                      '1px solid #30363d',
                    color:
                      log.status === 200
                        ? '#34d399'
                        : log.status === 429
                        ? '#fbbf24'
                        : '#f87171'
                  }}
                >

                  <td style={{ padding: '13px' }}>
                    {log.time}
                  </td>

                  <td style={{ padding: '13px' }}>
                    {log.ip}
                  </td>

                  <td
                    style={{
                      padding: '13px',
                      fontWeight: 'bold'
                    }}
                  >
                    {log.vbeln}
                  </td>

                  <td style={{ padding: '13px' }}>
                    {log.matnr}
                  </td>

                  <td style={{ padding: '13px' }}>
                    {log.message}
                  </td>

                  <td
                    style={{
                      padding: '13px'
                    }}
                  >
                    <strong>
                      {log.status}
                    </strong>
                  </td>

                </tr>

              ))

            )}

          </tbody>
        </table>
      </div>

    </div>
  );
}

