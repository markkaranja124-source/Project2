import type { ChapterQuiz } from '../types/book';

export const DUNE_CHAPTER_QUIZZES: ChapterQuiz[] = [
  {
    chapterNumber: 1,
    chapterTitle: 'The Test of the Gom Jabbar',
    summaryText: 'Reverend Mother Gaius Helen Mohiam tests young Paul Atreides using the lethal Gom Jabbar needle and nerve-induction pain box to determine if he is truly human.',
    questions: [
      {
        id: 'dune-1-q1',
        questionText: 'What is the primary purpose of the Gom Jabbar test administered to Paul?',
        options: [
          'To test his physical swordsmanship',
          'To see if his mind can control his instinctual reflex to pull away from pain',
          'To measure his knowledge of the spice Melange',
          'To determine if he can see future visions'
        ],
        correctOptionIndex: 1,
        explanation: 'The Bene Gesserit test tests human self-control over animal instinct. An animal will gnaw off its leg to escape a trap; a human remains in the trap to kill the trapper.',
        keyConcept: 'Self-Control vs Animal Instinct'
      },
      {
        id: 'dune-1-q2',
        questionText: 'What famous Bene Gesserit litany does Paul recite to remain calm during the pain test?',
        options: [
          'The Litany of Courage',
          'The Litany Against Fear',
          'The Chant of the Desert Sand',
          'The Oath of House Atreides'
        ],
        correctOptionIndex: 1,
        explanation: '"I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration."',
        keyConcept: 'Emotional Mastery Under Pressure'
      }
    ]
  },
  {
    chapterNumber: 2,
    chapterTitle: 'Arrakis & The Spice Melange',
    summaryText: 'House Atreides prepares to take control of Arrakis from their ancient rivals, House Harkonnen.',
    questions: [
      {
        id: 'dune-2-q1',
        questionText: 'Why is Melange (Spice) the most valuable substance in the universe?',
        options: [
          'It is used as weapons propellant',
          'It extends human life and enables Spacing Guild Navigators to calculate safe interstellar travel',
          'It turns sand into pure gold',
          'It cures all diseases instantly'
        ],
        correctOptionIndex: 1,
        explanation: 'Spice grants prescience required for Guild Navigators to fold space without crashing into stars.',
        keyConcept: 'Economic & Interstellar Dependency'
      }
    ]
  }
];

export const ATOMIC_HABITS_CHAPTER_QUIZZES: ChapterQuiz[] = [
  {
    chapterNumber: 1,
    chapterTitle: 'The Surprising Power of Atomic Habits',
    summaryText: 'Small 1% daily improvements compound into massive results over time.',
    questions: [
      {
        id: 'ah-1-q1',
        questionText: 'If you get 1% better each day for one year, how much better will you end up?',
        options: [
          '3.65 times better',
          '37 times better',
          '10 times better',
          '100 times better'
        ],
        correctOptionIndex: 1,
        explanation: '1.01 raised to 365 equals 37.78. Small compounding habits yield exponential results over 365 days.',
        keyConcept: 'Exponential Compounding'
      },
      {
        id: 'ah-1-q2',
        questionText: 'Why does James Clear emphasize systems over goals?',
        options: [
          'Goals don\'t matter at all',
          'Winners and losers have the same goals; systems are what produce actual progress',
          'Goals are too easy to achieve',
          'Systems are faster than setting goals'
        ],
        correctOptionIndex: 1,
        explanation: 'Goal setting only changes your outcome momentarily; fixing your system fixes the process at the root level.',
        keyConcept: 'Systems vs Outcomes'
      }
    ]
  },
  {
    chapterNumber: 2,
    chapterTitle: 'How Your Habits Shape Your Identity',
    summaryText: 'True behavior change is identity-change: focusing on who you wish to become.',
    questions: [
      {
        id: 'ah-2-q1',
        questionText: 'What is the most effective layer of behavior change according to James Clear?',
        options: [
          'Outcome-based change',
          'Process-based change',
          'Identity-based change',
          'Reward-based change'
        ],
        correctOptionIndex: 2,
        explanation: 'The goal is not to read a book, the goal is to become a reader. Identity drives long-term adherence.',
        keyConcept: 'Identity-Driven Change'
      }
    ]
  }
];

export const DEEP_WORK_CHAPTER_QUIZZES: ChapterQuiz[] = [
  {
    chapterNumber: 1,
    chapterTitle: 'Deep Work is Valuable',
    summaryText: 'The ability to perform deep work is becoming increasingly rare at the exact same time it is becoming increasingly valuable in our economy.',
    questions: [
      {
        id: 'dw-1-q1',
        questionText: 'What are the two core abilities required to thrive in the new modern economy?',
        options: [
          'Typing fast and multitasking',
          'Mastering hard things quickly & producing at an elite level in quality and speed',
          'Working 80 hours a week and networking',
          'Having a large social media following'
        ],
        correctOptionIndex: 1,
        explanation: 'High-value creative output requires focused concentration without distraction.',
        keyConcept: 'Cognitive Depth & Mastery'
      }
    ]
  }
];
