import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import Typography from '@mui/material/Typography';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Card = ({ backgroundColor, color, title, value }) => (
  <div style={{
    backgroundColor,
    color,
    margin: '10px',
    padding: '20px',
    borderRadius: '8px',
    flex: '1',
    textAlign: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    <h2 style={{
      marginBottom: '10px',
      fontSize: '1.2em',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}>
      {title}
    </h2>
    <p style={{
      fontSize: '1.5em',
      color,
      margin: '0',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}>
      {value}
    </p>
  </div>
);

const Table = ({ title, headers, data }) => (
  <div style={{ margin: '20px 0', textAlign: 'center', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
    <h2 style={{ marginBottom: '10px', backgroundColor: '#f1f3f5', padding: '15px', fontSize: '1.5em', fontWeight: 'bold' }}>{title}</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
          {headers.map((header, index) => (
            <th key={index} style={{ padding: '15px', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={headers.length} style={{ padding: '15px', borderBottom: '1px solid #dee2e6', textAlign: 'center' }}>No data available</td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, cellIndex) => (
                <td key={cellIndex} style={{ padding: '15px', borderBottom: '1px solid #dee2e6', textAlign: 'center' }}>{value}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

function gcd(a, b) {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export default function Dashboard() {
  const [data, setData] = useState({
    totalSubscribers: 0,
    supportersCount: 0,
    dreamersCount: 0,
    ideasPerField: {},
    matchingRate: 0,
    topIdeaThisWeek: [],
    subscribersOverTime: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard/main`, {
          headers: { 'Accept': 'application/json' },
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('Fetched data:', result);
          setData(result);
        } else {
          const textResponse = await response.text();
          throw new Error(`Expected JSON, but received content-type: ${contentType}. Response: ${textResponse}`);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(`Error: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  const supporterCount = data.supportersCount || 0;
  const dreamerCount = data.dreamersCount || 0;

  const ratioGCD = gcd(supporterCount, dreamerCount);
  const supporterRatio = ratioGCD ? supporterCount / ratioGCD : 0;
  const dreamerRatio = ratioGCD ? dreamerCount / ratioGCD : 0;

  const recentData = data.subscribersOverTime.slice(-5);

  const chartData = {
    labels: recentData.map(entry => entry.date),
    datasets: [
      {
        label: 'Total Subscribers',
        data: recentData.map(entry => entry.totalSubscribers),
        type: 'bar',
        backgroundColor: '#007bff',
        yAxisID: 'y1'
      },
      {
        label: 'New Subscribers',
        data: recentData.map(entry => entry.newSubscribers),
        type: 'line',
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        yAxisID: 'y2'
      }
    ]
  };

  const options = {
    scales: {
      y1: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Subscribers'
        }
      },
      y2: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'New Subscribers'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  const supporterToDreamerData = {
    labels: ['Supporters', 'Dreamers'],
    datasets: [{
      data: [supporterCount, dreamerCount],
      backgroundColor: ['#28a745', '#dc3545']
    }]
  };

  const matchingRateData = {
    labels: ['Matching Rate'],
    datasets: [{
      data: [data.matchingRate, 100 - data.matchingRate],
      backgroundColor: ['#007bff', '#e9ecef']
    }]
  };

  const topIdeas = Array.isArray(data.topIdeaThisWeek)
    ? data.topIdeaThisWeek.sort((a, b) => b.views - a.views)
    : [];

  const ideasPerField = data.ideasPerField && typeof data.ideasPerField === 'object' ? 
    Object.entries(data.ideasPerField).map(([field, count]) => ({ name: field, value: count })) : [];

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ mb: 4, color: '#000000', fontWeight: 'bold', fontSize: '2rem' }}
      >
        Dashboard
      </Typography>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ margin: '10px', padding: '20px', borderRadius: '10px', flex: '1', textAlign: 'center', backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h2>Subscribers Over Time</h2>
          <Line data={chartData} options={options} height={200} />
        </div>
        <div style={{ margin: '10px', padding: '20px', borderRadius: '10px', flex: '1', textAlign: 'center', backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h2>Supporter to Dreamer Ratio</h2>
          <Pie data={supporterToDreamerData} height={200} />
          <p>{supporterRatio} : {dreamerRatio}</p>
        </div>
        <div style={{ margin: '10px', padding: '20px', borderRadius: '10px', flex: '1', textAlign: 'center', backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h2>Matching Rate</h2>
          <Pie data={matchingRateData} height={200} />
          <p>{data.matchingRate}%</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Card backgroundColor="#007bff" color="white" title="Total Subscribers" value={data.totalSubscribers} />
        <Card backgroundColor="#dc3545" color="white" title="Supporters Count" value={data.supportersCount} />
        <Card backgroundColor="#ffc107" color="black" title="Dreamers Count" value={data.dreamersCount} />
      </div>
      <Table
        title="Top Ideas This Week"
        headers={['Field', 'Title', 'Views']}
        data={topIdeas.map(idea => ({ Field: idea.field, Title: idea.title, Views: idea.views }))}
      />
      <Table
        title="Ideas Per Field"
        headers={['Field', 'Number of Ideas']}
        data={ideasPerField.map(field => ({ Field: field.name, 'Number of Ideas': field.value }))}
      />
    </div>
  );
}
