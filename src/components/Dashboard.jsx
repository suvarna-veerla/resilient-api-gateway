import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [circuitState, setCircuitState] = useState("CLOSED");
  const [logs, setLogs] = useState([]);
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [{
      label: 'SAP OData Traffic Stream (Req/Sec)',
      data: [],
      borderColor: '#58a6ff',
      backgroundColor: 'rgba(88, 166, 255, 0.1)',
      tension: 0.3
    }]
  });
const sendTraffic = async (isCrash) => {
    try {
      // Connecting perfectly to global live cloud railway backend
      const response = await fetch(`https://railway.app{isCrash}`);
      const data = await response.json();

      setTotalRequests(prev => prev + 1);
      setCircuitState(data.circuitState);


      // 1. స్ప్రింగ్ బూట్ నుండి వచ్చే SAP డేటాను సురక్షితంగా రీడ్ చేయడం (డూప్లికేషన్ లేకుండా క్లీన్ చేసాం)
      const sapPayload = data.sapPayload || { vbeln: "SO-Pending", kunnr: "N/A", matnr: "MAT-Pending", netwr: 0, waerk: "INR" };

      // 2. ఒకవేళ పొరపాటున డేటా రాకపోయినా క్రాష్ అవ్వకుండా ఉండే సేఫ్ లాగ్ ఆబ్జెక్ట్
      const newLog = {
        time: new Date().toLocaleTimeString(),
        ip: data.clientIp || "127.0.0.1",
        message: data.message || "Request Registered",
        status: data.status || 200,
        vbeln: sapPayload.vbeln || "SO-Gen",
        matnr: sapPayload.matnr || "MAT-Gen"
      };
      
      setLogs(prevLogs => [newLog, ...prevLogs]);

      // 3. గ్రాఫ్ క్రాష్ కాకుండా 100% సేఫ్ ఆబ్జెక్ట్ స్ట్రక్చర్ అప్‌డేట్
      setGraphData(prev => {
        const newLabels = [...prev.labels, new Date().toLocaleTimeString().slice(-8)];
        const newData = [...prev.datasets[0].data, data.status === 200 ? 1 : 0]; 
        if (newLabels.length > 7) { newLabels.shift(); newData.shift(); }
        return {
          labels: newLabels,
          datasets: [{
            ...prev.datasets[0],
            data: newData
          }]
        };
      });

    } catch (error) {
      console.error("Error connecting to SAP Spring Boot Gateway:", error);
    }
  };

  return (
    <div style={{ backgroundColor: '#0d1117', color: '#c9d1d9', minHeight: '100vh', padding: '30px', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* Dynamic SAP Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1f2937', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #0070d2', marginBottom: '20px' }}>
        {/*<h2>🛡️ SAP S/4HANA CLOUD: RESILIENT ODATA PROXY GATEWAY</h2>*/}
        <h2 style={{ color: '#ffffff', margin: 0 }}>🛡️ SAP S/4HANA CLOUD: RESILIENT ODATA PROXY GATEWAY</h2>
        <span style={{ padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', backgroundColor: circuitState === 'OPEN' ? '#991b1b' : '#065f46', color: circuitState === 'OPEN' ? '#f87171' : '#34d399' }}>
          COMMIT: CIRCUIT STATE: {circuitState}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Simulation Control Panel */}
        <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px', border: '1px solid #30363d' }}>
          <h3>⚙️ SAP ODATA SIMULATION CONTROL</h3>
          <p style={{ color: '#8b949e' }}>Trigger real-time SAP Sales Order synchronization payloads to test Gateway throttle capabilities:</p>
          <div style={{ marginTop: '35px' }}>
            <button onClick={() => sendTraffic(false)} style={{ padding: '12px 24px', backgroundColor: '#238636', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginRight: '15px' }}>Send SAP Request ✅</button>
            <button onClick={() => sendTraffic(true)} style={{ padding: '12px 24px', backgroundColor: '#da3637', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Simulate SAP Crash 🚨</button>
          </div>
        </div>

        {/* Live Chart */}
        <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px', border: '1px solid #30363d' }}>
          <h3>📊 ENTERPRISE TRAFFIC HEALTH (CHART.JS)</h3>
          <div style={{ height: '180px' }}>
            <Line data={graphData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Real-Time Enterprise Log Table */}
      <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px', border: '1px solid #30363d', marginTop: '20px' }}>
        <h3>🚨 REAL-TIME SAP TRANSACTION TRACKER (Total Packets: {totalRequests})</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ background: '#21262d', color: '#c9d1d9', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Timestamp</th>
              <th style={{ padding: '12px' }}>Client IP</th>
              <th style={{ padding: '12px' }}>SAP Doc Num (VBELN)</th>
              <th style={{ padding: '12px' }}>SAP Material (MATNR)</th>
              <th style={{ padding: '12px' }}>Gateway Status Message</th>
              <th style={{ padding: '12px' }}>HTTP Code</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #30363d', color: log.status === 200 ? '#34d399' : (log.status === 429 ? '#fbbf24' : '#f87171') }}>
                <td style={{ padding: '12px' }}>{log.time}</td>
                <td style={{ padding: '12px' }}>{log.ip}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{log.vbeln}</td>
                <td style={{ padding: '12px' }}>{log.matnr}</td>
                <td style={{ padding: '12px' }}>{log.message}</td>
                <td style={{ padding: '12px' }}><strong>{log.status}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
