import { useState } from 'react';
import axios from 'axios';
import styles from './App.module.css';

function App() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/review', { code });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setResult({ error: 'Something went wrong!' });
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI Code Reviewer</h1>
      <textarea
        rows={10}
        style={{ width: '100%' }}
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br />
      <button className={styles.button} onClick={handleReview} disabled={loading}>
        {loading ? 'Reviewing...' : 'Review Code'}
      </button>

      {result && (
        <div>
          {result.aiReview?.bugs && (
            <div className={styles.card}>
              <div className={styles.cardTitle}>Bugs</div>
              <ul className={styles.cardList}>
                {result.aiReview.bugs.length === 0 ? (
                  <li className={styles.subCard}>No bugs found 🎉</li>
                ) : (
                  result.aiReview.bugs.map((bug: any, idx: number) => (
                    <li key={idx} className={styles.subCard}>
                      {typeof bug === 'string'
                        ? bug
                        : Object.keys(bug).map((key) => (
                            <div key={key}><strong>{key}:</strong> {String(bug[key])}</div>
                          ))}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {result.aiReview?.suggestions && (
            <div className={styles.card}>
              <div className={styles.cardTitle}>Suggestions</div>
              <ul className={styles.cardList}>
                {result.aiReview.suggestions.length === 0 ? (
                  <li className={styles.subCard}>No suggestions needed!</li>
                ) : (
                  result.aiReview.suggestions.map((sugg: any, idx: number) => (
                    <li key={idx} className={styles.subCard}>
                      {typeof sugg === 'string'
                        ? sugg
                        : Object.keys(sugg).map((key) => (
                            <div key={key}><strong>{key}:</strong> {String(sugg[key])}</div>
                          ))}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {typeof result.aiReview?.risk_score !== 'undefined' && (
            <div className={styles.card}>
              <div className={styles.cardTitle}>Risk Score</div>
              <span className={styles.riskScore}>{result.aiReview.risk_score} / 10</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
