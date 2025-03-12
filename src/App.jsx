import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export default function DictionaryApp() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDefinition = async () => {
    if (!word) return;
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
      
      if (response.ok) {
        setResult(data[0]);
      } else {
        setError("Word not found");
      }
    } catch (err) {
      setError("Failed to fetch definition");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dictionary App</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Enter a word" 
          value={word} 
          onChange={(e) => setWord(e.target.value)} 
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <button 
          onClick={fetchDefinition} 
          disabled={loading}
          style={{ padding: '10px 15px', border: 'none', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Search"}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{result.word}</h2>
          <p style={{ color: 'gray', fontStyle: 'italic' }}>{result.phonetics[0]?.text || ""}</p>
          <ul style={{ marginTop: '10px', padding: '0', listStyleType: 'none' }}>
            {result.meanings.map((meaning, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>{meaning.partOfSpeech}:</span>
                <p>{meaning.definitions[0]?.definition}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}