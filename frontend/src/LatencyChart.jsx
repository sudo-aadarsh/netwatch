import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LatencyChart({ routeId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const port = window.location.port === "5173" ? 8001 : window.location.port;
        const host = window.location.hostname;
        const res = await fetch(`http://${host}:${port}/api/history/${routeId}`);
        const data = await res.json();
        if (active) {
          // data.history is ordered DESC, so reverse it for the chart
          setHistory(data.history.reverse());
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchHistory();
    return () => { active = false; };
  }, [routeId]);

  if (loading) return <div style={{ color: "#aaa", fontSize: "0.85rem", marginTop: "1rem" }}>Loading historical data...</div>;
  if (!history || history.length === 0) return <div style={{ color: "#aaa", fontSize: "0.85rem", marginTop: "1rem" }}>No historical data available.</div>;

  const data = {
    labels: history.map((h) => {
      const d = new Date(h.ts * 1000);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }),
    datasets: [
      {
        label: "Latency (ms)",
        data: history.map((h) => h.latency),
        borderColor: "rgba(100, 200, 255, 0.8)",
        backgroundColor: "rgba(100, 200, 255, 0.2)",
        borderWidth: 1.5,
        pointRadius: 1,
        tension: 0.2,
      },
      {
        label: "EWMA Baseline",
        data: history.map((h) => h.ewma),
        borderColor: "rgba(255, 180, 50, 0.8)",
        borderWidth: 1,
        pointRadius: 0,
        borderDash: [5, 5],
        tension: 0.2,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "rgba(255,255,255,0.6)", maxTicksLimit: 8 },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "rgba(255,255,255,0.6)" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "rgba(255,255,255,0.8)", font: { size: 10 } },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      }
    },
  };

  return (
    <div style={{ width: "100%", height: "200px", marginTop: "1rem" }}>
      <Line data={data} options={options} />
    </div>
  );
}
