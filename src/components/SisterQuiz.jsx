import { useEffect, useState } from 'react';
import { Heart, RotateCcw } from 'lucide-react';
import { quizQuestions } from '../data/quizQuestions.js';

const STORAGE_KEY = 'laxmi-bhaidooj-quiz-v3';
export default function SisterQuiz({ t }) {
  const [answers, setAnswers] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved)
        ? saved.filter((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 2).slice(0, quizQuestions.length)
        : [];
    } catch {
      return [];
    }
  });
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); }, [answers]);
  const current = answers.length;
  const pick = (choice) => setAnswers((previous) => [...previous, choice]);
  const restart = () => setAnswers([]);
  const score = answers.filter((answer) => answer === 2).length;
  const questions = t('questions');
  const result = score >= 7 ? t('resultHigh') : score >= 4 ? t('resultMid') : t('resultLow');

  return (
    <div className="quiz-card">
      <div className="quiz-progress"><span style={{ width: `${(current / quizQuestions.length) * 100}%` }} /></div>
      {current < quizQuestions.length ? <>
        <div className="quiz-meta"><span>{t('questionCount', current + 1, quizQuestions.length)}</span><span>{t('answeredCount', current)}</span></div>
        <h3 className="quiz-question">{questions[current]?.[0] || quizQuestions[current].question}</h3>
        <div className="quiz-options">
          {quizQuestions[current].choices.map((choice, index) => <button type="button" key={choice} onClick={() => pick(index)} className="quiz-option"><span>{['A', 'B', 'C'][index]}</span>{questions[current]?.[1]?.[index] || choice}<Heart size={16} /></button>)}
        </div>
      </> : current === quizQuestions.length ? <div className="quiz-result">
        <span className="result-emoji">{score >= 7 ? '🏆' : '💗'}</span><span className="eyebrow">{t('teamAnswers', score, quizQuestions.length)}</span>
        <h3>{t('quizComplete')}</h3><p>{result}</p>
        <button type="button" className="button button-light" onClick={restart}><RotateCcw size={16} /> {t('playAgain')}</button>
      </div> : null}
      {current === quizQuestions.length && <span className="quiz-finish-note">{t('quizSaved')}</span>}
    </div>
  );
}
