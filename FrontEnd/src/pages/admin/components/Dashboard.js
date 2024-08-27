import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Card = ({ backgroundColor, color, title, value }) => (
  <div style={{ backgroundColor, color, margin: '10px', padding: '20px', borderRadius: '5px', flex: '1', textAlign: 'center' }}>
    <h2>{title}</h2>
    <p>{value}</p>
  </div>
);

const List = ({ title, items }) => (
  <div>
    <h2>{title}</h2>
    {items.length === 0 ? (
      <p>No data available</p>
    ) : (
      <ol>
        {items.map((item, index) => (
          <li key={index}>{item.name}: {item.value}</li>
        ))}
      </ol>
    )}
  </div>
);

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export default function Dashboard() {
  const [data, setData] = useState({
    totalSubscribers: 0,
    newSubscribersLast30Days: 0,
    supportersCount: 0,
    dreamersCount: 0,
    ideasPerField: {},
    matchingRate: 0,
    topIdeaThisWeek: [],
    popularSearchTerms: {},
    subscribersOverTime: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard/main`,{
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
  const supporterRatio = supporterCount / ratioGCD;
  const dreamerRatio = dreamerCount / ratioGCD;

  // Extract the latest 5 subscribersOverTime entries
  const recentData = data.subscribersOverTime.slice(-5);

  // Prepare chart data
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
          drawOnChartArea: false // To prevent grid lines from overlapping
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

  const topIdeas = Array.isArray(data.topIdeaThisWeek) ? data.topIdeaThisWeek : [];
  const popularSearchTerms = data.popularSearchTerms && typeof data.popularSearchTerms === 'object' ? 
    Object.entries(data.popularSearchTerms).map(([term, count]) => ({ name: term, value: count })) : [];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ margin: '10px', padding: '10px', borderRadius: '5px', flex: '1', textAlign: 'center', flexBasis: '30%', height: '300px' }}>
          <h2>Subscribers Over Time</h2>
          <Line data={chartData} options={options} height={200} />
        </div>
        <div style={{ margin: '10px', padding: '10px', borderRadius: '5px', flex: '1', textAlign: 'center', flexBasis: '20%', height: '300px' }}>
          <h2>Supporter to Dreamer Ratio</h2>
          <Pie data={supporterToDreamerData} height={200} />
          <p>{supporterRatio} : {dreamerRatio}</p>
        </div>
        <div style={{ margin: '10px', padding: '10px', borderRadius: '5px', flex: '1', textAlign: 'center', flexBasis: '20%', height: '300px' }}>
          <h2>Matching Rate</h2>
          <Pie data={matchingRateData} height={200} />
          <p>{data.matchingRate.toFixed(2)}%</p>
        </div>
      </div>
      <List title="Top Idea This Week" items={topIdeas.map(idea => ({
        name: idea.title,
        value: `Views: ${idea.views}`
      }))} />
      <List title="Popular Search Terms" items={popularSearchTerms} />
    </div>
  );
}
