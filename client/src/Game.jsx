import { useEffect, useState } from 'react';

const QUESTION_MS = 5_000; // 5-second limit
const STEP_MS     = 50;    // update display every 50 ms

export default function Game() {
  /* ────────── state ────────── */
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx]             = useState(0);
  const [answer, setAnswer]       = useState('');
  const [msLeft, setMsLeft]       = useState(QUESTION_MS);
  const [results, setResults]     = useState([]); // {given, correct}
  const [startedAt, setStartedAt] = useState(null);
  const [finished, setFinished]   = useState(false);

  /* ────────── helpers ────────── */
  const loadQuestions = async () => {
    const qs = await fetch('/api/sums').then(r => r.json());
    setQuestions(qs);
  };

  const startGame = async () => {
    await loadQuestions();
    setIdx(0);
    setAnswer('');
    setResults([]);
    setStartedAt(Date.now());
    setFinished(false);
    setMsLeft(QUESTION_MS);
  };

  const advance = (given) => {
    const correct = questions[idx].answer;
    setResults(prev => [...prev, { given, correct }]);

    if (idx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setIdx(i => i + 1);
      setAnswer('');
      setMsLeft(QUESTION_MS); // will be overwritten by next effect
    }
  };

  /* ────────── TIMER useEffect ──────────
     Runs every time `idx` changes (i.e., each new question)          */
  useEffect(() => {
    if (!questions.length || finished) return;

    const start = Date.now();

    /* display countdown */
    const tick = setInterval(() => {
      const remain = Math.max(QUESTION_MS - (Date.now() - start), 0);
      setMsLeft(remain);
    }, STEP_MS);

    /* hard timeout → auto-advance */
    const to = setTimeout(() => {
      clearInterval(tick);
      advance(null);
    }, QUESTION_MS);

    /* cleanup when question changes or component unmounts */
    return () => {
      clearInterval(tick);
      clearTimeout(to);
    };
  }, [idx, questions.length, finished]);

  /* ────────── derived ────────── */
  const score = results.filter(r => Number(r.given) === r.correct).length;
  const elapsed =
    finished && startedAt ? ((Date.now() - startedAt) / 1000).toFixed(2) : null;

  /* ────────── simple centered layout ────────── */
  const Center = ({ children }) => (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', fontFamily: 'sans-serif', padding: '1rem'
    }}>
      {children}
    </div>
  );

  /* ────────── render branches ────────── */
  if (!questions.length) {
    return (
      <Center>
        <button onClick={startGame}>Start</button>
      </Center>
    );
  }

  if (finished) {
    return (
      <Center>
        <div style={{ textAlign: 'center' }}>
          <h2>Done!</h2>
          <p>⏱️ {elapsed}s total</p>
          <p>✅ {score} / {questions.length}</p>
          <button onClick={startGame}>Play again</button>
        </div>
      </Center>
    );
  }

  const { a, b } = questions[idx];

  return (
    <Center>
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '1.2rem', textAlign: 'center'
      }}>
        {/* countdown */}
        <div style={{ fontSize: '1.8rem' }}>
          ⏳ {(msLeft / 1000).toFixed(2)} s
        </div>

        {/* question */}
        <form
          onSubmit={e => { e.preventDefault(); advance(Number(answer)); }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div style={{ fontSize: '1.4rem' }}>
            {a} + {b} =
            <input
              type="number" value={answer}
              onChange={e => setAnswer(e.target.value)}
              style={{ width: 100 }} autoFocus required
            />
          </div>
          <button type="submit">Next</button>
        </form>

        <div>Question {idx + 1} / {questions.length}</div>
      </div>
    </Center>
  );
}
