import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [h, setH] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_SERVER_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.text(); // or response.json() if the server returns JSON
        setH(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {h}
    </div>
  );
}

export default App;
