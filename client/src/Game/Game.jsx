import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Typography, Button, Input, Space, Card } from "antd";
import { useUser } from "../User/useUser";
import { logGameStats } from "./logGameStats";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Game.module.css";
const QUESTION_MS = 5000;
const STEP_MS = 50;
const API_URL = import.meta.env.VITE_API_URL;
const { Title, Text } = Typography;

export default function Game({ onGameEnd }) {
  /* ───────────────────────── STATE ───────────────────────── */
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [msLeft, setMsLeft] = useState(QUESTION_MS);
  const [results, setResults] = useState([]);
  const [startedAt, setStartedAt] = useState(null);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(null);
  // ⏳ Countdown overlay
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3); // 3 → 2 → 1 → "Go"

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
    setFinished(false);
    setMsLeft(QUESTION_MS);
    // kick off countdown
    setCountdown(3);
    setShowCountdown(true);
  };

  /* ───────────────────────── COUNTDOWN LOGIC ───────────────────────── */
  useEffect(() => {
    if (!showCountdown) return;

    if (countdown === "Go") {
      const t = setTimeout(() => {
        setShowCountdown(false);
        setStartedAt(Date.now());
      }, 600); // brief flash of "Go"
      return () => clearTimeout(t);
    }

    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }

    // when countdown hits 0 switch to "Go"
    if (countdown === 0) setCountdown("Go");
  }, [showCountdown, countdown]);

  /* ───────────────────────── ADVANCE LOGIC ───────────────────────── */
  const advance = (given) => {
    const correct = questions[idx].answer;
    const newResults = [...results, { given, correct }];

    if (idx + 1 >= questions.length) {
      const finalScore = newResults.filter(
        (r) => Number(r.given) === r.correct
      ).length;
      setResults(newResults);
      const end = Date.now();
      const elapsedTime = ((end - startedAt) / 1000).toFixed(2);
      setElapsed(elapsedTime);
      setFinished(true);

      if (user) {
        logGameStats({
          guestId: user.guestId,
          name: user.name,
          isGuest: user.isGuest,
          score: finalScore,
          total: questions.length,
          time: elapsedTime,
        }).finally(() => {
          if (typeof onGameEnd === "function") onGameEnd();
        });
      }
    } else {
      setResults(newResults);
      setIdx((i) => i + 1);
      setAnswer("");
      setMsLeft(QUESTION_MS);
    }
  };

  /* ───────────────────────── TIMERS ───────────────────────── */
  useEffect(() => {
    if (!questions.length || finished || showCountdown) return;

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
  }, [idx, questions.length, finished, showCountdown]);

  /* ───────────────────────── KEEP FOCUS ───────────────────────── */
  useLayoutEffect(() => {
    if (!finished && !showCountdown) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [idx, finished, showCountdown]);

  /* ───────────────────────── DERIVED VALUES ───────────────────────── */
  const score = results.filter((r) => Number(r.given) === r.correct).length;

  /* ───────────────────────── UI: NOT STARTED ───────────────────────── */
  if (!questions.length && !showCountdown) {
    return (
      <Button type="primary" onClick={startGame}>
        Start
      </Button>
    );
  }

  /* ───────────────────────── UI: COUNTDOWN ───────────────────────── */
  if (showCountdown) {
    return (
      <Card className={styles.card}>
        <Title level={2}>{countdown}</Title>
      </Card>
    );
  }

  /* ───────────────────────── UI: FINISHED ───────────────────────── */
  if (finished) {
    return (
      <Card className={styles.card} bodyStyle={{ padding: "2rem" }}>
        <Title level={3}>Done!</Title>
        <Text>⏱️ {elapsed}s total</Text>
        <br />
        <Text>
          ✅ {score} / {questions.length}
        </Text>
        <br />
        <Button
          type="primary"
          onClick={startGame}
          className={styles.centeredButton}
        >
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
    <Card
      style={{
        textAlign: "center",
        backgroundColor: "#1f1f1f",
        color: "white",
      }}
      bodyStyle={{ padding: "2rem" }}
    >
      <Space direction="vertical" size="large" align="center">
        {/* ──────────── Question & Timer (animated) ──────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
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
              className={`${styles.answerBox} ${styles.noSpin}`}
              ref={inputRef}
              autoFocus
              type="number"
              value={answer}
              onChange={(e) => {
                const val = e.target.value;
                setAnswer(val);
                if (val !== "" && Number(val) === questions[idx].answer) {
                  setTimeout(() => advance(Number(val)), 120);
                }
              }}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </Space>
          <br />
          <Button
            type="primary"
            htmlType="submit"
            className={styles.centeredButton}
          >
            Next
          </Button>
        </form>

        <Text type="secondary">
          Question {idx + 1} / {questions.length}
        </Text>
      </Space>
    </Card>
  );
}
