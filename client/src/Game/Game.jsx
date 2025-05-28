import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Typography, Button, Input, Space, Card } from "antd";
import { useUser } from "../User/useUser";
import { logGameStats } from "./logGameStats";
import { motion, AnimatePresence } from "framer-motion";

const QUESTION_MS = 5000;
const STEP_MS = 50;
const API_URL = import.meta.env.VITE_API_URL;
const { Title, Text } = Typography;

export default function Game({ history, setHistory }) {
  /* ───────────────────────── STATE ───────────────────────── */
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [msLeft, setMsLeft] = useState(QUESTION_MS);
  const [results, setResults] = useState([]);
  const [startedAt, setStartedAt] = useState(null);
  const [finished, setFinished] = useState(false);

  const { user } = useUser();
  const inputRef = useRef(null);

  /* ───────────────────────── API / GAME INIT ───────────────────────── */
  const loadQuestions = async () => {
    const qs = await fetch(`${API_URL}/sums`).then((r) => r.json());
    setQuestions(qs);
  };

  const startGame = async () => {
    await loadQuestions();
    setIdx(0);
    setAnswer("");
    setResults([]);
    setStartedAt(Date.now());
    setFinished(false);
    setMsLeft(QUESTION_MS);
  };

  /* ───────────────────────── ADVANCE LOGIC ───────────────────────── */
  const advance = (given) => {
    const correct = questions[idx].answer;
    const newResults = [...results, { given, correct }];

    if (idx + 1 >= questions.length) {
      const finalScore = newResults.filter((r) => Number(r.given) === r.correct).length;
      setResults(newResults);
      setFinished(true);

      const elapsedTime = ((Date.now() - startedAt) / 1000).toFixed(2);

      if (user) {
        logGameStats({
          guestId: user.guestId,
          name: user.name,
          isGuest: user.isGuest,
          score: finalScore,
          total: questions.length,
          time: elapsedTime,
        });
      }

      setHistory((prev) => [
        {
          score: finalScore,
          total: questions.length,
          time: elapsedTime,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } else {
      setResults(newResults);
      setIdx((i) => i + 1);
      setAnswer("");
      setMsLeft(QUESTION_MS);
    }
  };

  /* ───────────────────────── TIMERS ───────────────────────── */
  useEffect(() => {
    if (!questions.length || finished) return;

    const start = Date.now();
    const tick = setInterval(() => {
      const remain = Math.max(QUESTION_MS - (Date.now() - start), 0);
      setMsLeft(remain);
    }, STEP_MS);

    const to = setTimeout(() => {
      clearInterval(tick);
      advance(null);
    }, QUESTION_MS);

    return () => {
      clearInterval(tick);
      clearTimeout(to);
    };
  }, [idx, questions.length, finished]);

  /* ───────────────────────── KEEP FOCUS ───────────────────────── */
  useLayoutEffect(() => {
    if (!finished) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [idx, finished]);

  /* ───────────────────────── DERIVED VALUES ───────────────────────── */
  const score = results.filter((r) => Number(r.given) === r.correct).length;
  const elapsed = finished && startedAt ? ((Date.now() - startedAt) / 1000).toFixed(2) : null;

  /* ───────────────────────── UI: NOT STARTED ───────────────────────── */
  if (!questions.length) {
    return (
      <Button type="primary" onClick={startGame}>
        Start
      </Button>
    );
  }

  /* ───────────────────────── UI: FINISHED ───────────────────────── */
  if (finished) {
    return (
      <Card style={{ textAlign: "center", backgroundColor: "#1f1f1f", color: "white", padding: "1.5rem" }} bodyStyle={{ padding: "2rem" }}>
        <Title level={3}>Done!</Title>
        <Text>⏱️ {elapsed}s total</Text>
        <br />
        <Text>✅ {score} / {questions.length}</Text>
        <br />
        <Button type="primary" onClick={startGame} style={{ marginTop: "1rem" }}>
          Play again
        </Button>
      </Card>
    );
  }

  /* ───────────────────────── UI: ACTIVE GAME ───────────────────────── */
  const { a, b } = questions[idx];
  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <Card style={{ textAlign: "center", backgroundColor: "#1f1f1f", color: "white" }} bodyStyle={{ padding: "2rem" }}>
      <Space direction="vertical" size="large" align="center">
        {/* ──────────── Question & Timer (animated) ──────────── */}
        <AnimatePresence mode="wait">
          <motion.div key={idx} variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
            <Title level={4}>⏳ {(msLeft / 1000).toFixed(2)} s</Title>
            <Text strong style={{ fontSize: "1.4rem" }}>
              {a} + {b} =
            </Text>
          </motion.div>
        </AnimatePresence>

        {/* ──────────── Answer Input (persistent) ──────────── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            advance(Number(answer));
          }}
        >
          <Space>
            <Input
              ref={inputRef}
              autoFocus
              type="number"
              value={answer}
              onChange={(e) => {
                const val = e.target.value;
                setAnswer(val);
                if (val !== "" && Number(val) === questions[idx].answer) {
                  // small delay so the user sees their correct input
                  setTimeout(() => advance(Number(val)), 120);
                }
              }}
              style={{
                width: 100,
                fontSize: "1.2rem",
                backgroundColor: "#2a2a2a",
                color: "white",
                border: "1px solid #555",
                borderRadius: "4px",
              }}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </Space>
          <br />
          <Button type="primary" htmlType="submit" style={{ marginTop: "1rem" }}>
            Next
          </Button>
        </form>

        <Text type="secondary">Question {idx + 1} / {questions.length}</Text>
      </Space>
    </Card>
  );
}
