import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);


function App() {
  // const [count, setCount] = useState(0)
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    const { data } = await supabase.from("instruments").select();
    setInstruments(data);
  }

  return (
    <>
      <h1>Civics Practice project</h1>
      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.name}>{instrument.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
