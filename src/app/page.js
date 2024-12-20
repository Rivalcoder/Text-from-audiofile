// src/app/page.js
"use client";
import { useState } from 'react';
import "./page.css"

export default function Home() {
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState(null);

  const backend = async () => {
    try {
      const file = document.querySelector("input").files[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });


      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status} (Please And Upload the File)`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Transcription failed');
      }

      setTranscription(data.transcription);
      setError(null); 

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message); 
      setTranscription(''); 
    }
  };

  return (
    <div className="container">
      <h1>Audio File...</h1>
      <input type="file" accept="audio/*" />
      <button onClick={backend}>Click for Submit</button>
      {error && <p className="error">{error}</p>}
      <h1>Response Below</h1>
      <p className='Box'>{transcription}</p>
    </div>
  );
}