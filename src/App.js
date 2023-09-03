import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
function App() {
  const [h,seth] = useState()
  useEffect(async()=>{
    await fetch(process.env.SERVER_URL).then((res)=>{
      seth(res)
    }).catch(err =>{
      console.log(err)
    })
  })
  return (
    <div>
      {h}
    </div>
  );
}

export default App;
