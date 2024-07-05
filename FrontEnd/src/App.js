import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Dreamer from './pages/Dreamer';
import Supporter from './pages/Supporter';
import Idea from './pages/Idea';
import Ai from './component/idea/Ai';
import Bigdata from './component/idea/Bigdata';
import Finance from './component/idea/Finance';
import Healthcare from './component/idea/HealthCare';
import Games from './component/idea/Game';

import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/dreamer" element={<Dreamer />} />
          <Route path="/supporter" element={<Supporter />} />
          <Route path="/idea" element={<Idea />} />
          <Route path="/idea/ai" element={<Ai/>}/>
          <Route path="/idea/bigdata" element={<Bigdata/>}/>
          <Route path="/idea/finance" element={<Finance/>}/>
          <Route path="/idea/games" element={<Games/>}/>
          <Route path="/idea/healthcare" element={<Healthcare/>}/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;