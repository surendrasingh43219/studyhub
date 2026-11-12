export interface TaskItem {
  id: string
  user_id: string
  title: string
  description?: string
  category: string
  priority: 'high' | 'medium' | 'low'
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
  is_completed: boolean
  start_date?: string | null
  due_date?: string | null
  estimated_minutes?: number
  actual_minutes?: number
  created_at: string
}

export interface ExamItem {
  id: string
  user_id: string
  name?: string
  title: string
  subject?: string
  exam_date: string
  target_score?: string
  syllabus_progress?: number
  color?: string
  notes?: string
  is_completed?: boolean
  created_at: string
}

export interface GoalItem {
  id: string
  user_id: string
  title: string
  category: string
  progress: number
  target_date?: string
  notes?: string
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
  is_completed: boolean
  created_at: string
}

export interface EnglishLogItem {
  id: string
  user_id: string
  practice_date: string
  activity_type: string
  duration_minutes: number
  notes: string
  created_at: string
}

export interface VocabularyItem {
  id: string
  user_id: string
  word: string
  part_of_speech: string
  definition: string
  example_sentence: string
  mastery_level: 'learning' | 'mastered'
  created_at: string
}

export const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 'task-ia-exam-prep',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'IA Exam Preparation & Unit Revision',
    description: 'Complete Unit 1 & Unit 2 core concepts, solve previous IA sample questions, and prepare short revision sheets.',
    category: 'College',
    priority: 'high',
    status: 'in_progress',
    is_completed: false,
    due_date: '2026-11-18',
    estimated_minutes: 90,
    actual_minutes: 45,
    created_at: '2026-11-12T06:00:00Z',
  },
  {
    id: 'task-sem-exam-plan',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Semester Final Exam — Syllabus & Previous Year Papers (This Month)',
    description: 'Revise complete semester syllabus, compile 3 years university question papers, and take full-length mock tests before the end of this month.',
    category: 'College',
    priority: 'high',
    status: 'in_progress',
    is_completed: false,
    due_date: '2026-11-28',
    estimated_minutes: 180,
    actual_minutes: 60,
    created_at: '2026-11-12T06:10:00Z',
  },
  {
    id: 'task-english-speaking',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Daily English Speaking & Pronunciation Practice (30 Mins)',
    description: 'Practice aloud speaking, 15 minutes conversational prompt on semester goals, and learn 5 advanced academic words.',
    category: 'English Practice',
    priority: 'medium',
    status: 'in_progress',
    is_completed: false,
    due_date: '2026-11-12',
    estimated_minutes: 30,
    actual_minutes: 15,
    created_at: '2026-11-12T06:15:00Z',
  },
  {
    id: 'task-ia-formula-sheet',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Review IA Exam Formulas & Summary Cheat Sheet',
    description: 'Double check all formulas, key derivations, and definitions for quick recall during the internal assessment test.',
    category: 'Study',
    priority: 'high',
    status: 'not_started',
    is_completed: false,
    due_date: '2026-11-16',
    estimated_minutes: 45,
    actual_minutes: 0,
    created_at: '2026-11-12T06:20:00Z',
  },
  {
    id: 'task-sem-schedule-done',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Semester Exam Timetable & Weekly Study Planner Setup',
    description: 'Organized all exam dates, break slots, and subject revision blocks for this month.',
    category: 'College',
    priority: 'medium',
    status: 'completed',
    is_completed: true,
    due_date: '2026-11-12',
    estimated_minutes: 30,
    actual_minutes: 30,
    created_at: '2026-11-12T05:00:00Z',
  },
  {
    id: 'task-english-listening',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'English Listening & Shadowing (TED Talk / Podcast)',
    description: 'Listen to a 15-minute educational podcast in English and shadow the speaker for natural accent and pacing.',
    category: 'English Practice',
    priority: 'low',
    status: 'not_started',
    is_completed: false,
    due_date: '2026-11-14',
    estimated_minutes: 20,
    actual_minutes: 0,
    created_at: '2026-11-12T06:25:00Z',
  },
]

export const DEFAULT_EXAMS: ExamItem[] = [
  {
    id: 'exam-ia-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Internal Assessment (IA) Exam',
    title: 'Internal Assessment (IA) Exam',
    subject: 'Core Subjects',
    exam_date: '2026-11-18',
    target_score: '90%',
    syllabus_progress: 70,
    color: 'amber',
    notes: 'Units 1 and 2 coverage. Focus on short answer questions and numerical problems.',
    is_completed: false,
    created_at: '2026-11-12T06:00:00Z',
  },
  {
    id: 'exam-sem-final',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Semester Final Examination (Nov 2026)',
    title: 'Semester Final Examination (Nov 2026)',
    subject: 'Semester End Examination',
    exam_date: '2026-11-28',
    target_score: '85%',
    syllabus_progress: 50,
    color: 'rose',
    notes: 'Major university semester exams this month. Complete all unit revisions and mock sets.',
    is_completed: false,
    created_at: '2026-11-12T06:00:00Z',
  },
  {
    id: 'exam-english-speaking',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'English Communication & Viva Assessment',
    title: 'English Communication & Viva Assessment',
    subject: 'English Fluency & Viva',
    exam_date: '2026-11-24',
    target_score: '8.0 Band / A Grade',
    syllabus_progress: 60,
    color: 'cyan',
    notes: 'Spoken interview, presentation topic, and oral comprehension examination.',
    is_completed: false,
    created_at: '2026-11-12T06:00:00Z',
  },
]

export const DEFAULT_GOALS: GoalItem[] = [
  {
    id: 'goal-sem-exams',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Ace Semester Exams with Top CGPA & High IA Marks',
    category: 'College',
    progress: 65,
    target_date: '2026-11-30',
    notes: 'Complete syllabus revision, solve last 3 years question papers, and top the internal assessments.',
    status: 'in_progress',
    is_completed: false,
    created_at: '2026-11-12T06:00:00Z',
  },
  {
    id: 'goal-english-fluency',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Master Fluent English Speaking & Professional Communication',
    category: 'English Practice',
    progress: 45,
    target_date: '2026-12-31',
    notes: 'Practice speaking 30 mins every day, learn 100 new academic words, and prepare confident viva presentations.',
    status: 'in_progress',
    is_completed: false,
    created_at: '2026-11-12T06:00:00Z',
  },
  {
    id: 'goal-daily-study',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Maintain 3+ Hours Daily Deep Study & Pomodoro Consistency',
    category: 'Study',
    progress: 75,
    target_date: '2026-11-30',
    notes: 'Track focus hours daily with the Pomodoro timer without distractions.',
    status: 'in_progress',
    is_completed: false,
    created_at: '2026-11-12T06:00:00Z',
  },
]

export const DEFAULT_ENGLISH_LOGS: EnglishLogItem[] = [
  {
    id: 'eng-log-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    practice_date: '2026-11-12',
    activity_type: 'Spoken English & Fluency',
    duration_minutes: 25,
    notes: 'Practiced speaking about semester examination roadmap and IA syllabus review.',
    created_at: '2026-11-12T06:15:00Z',
  },
  {
    id: 'eng-log-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    practice_date: '2026-11-11',
    activity_type: 'Listening & Shadowing',
    duration_minutes: 20,
    notes: 'Shadowed academic speaking audio to improve natural rhythm and clarity.',
    created_at: '2026-11-11T14:00:00Z',
  },
]

export const DEFAULT_VOCABULARY: VocabularyItem[] = [
  {
    id: 'vocab-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    word: 'Meticulous',
    part_of_speech: 'adjective',
    definition: 'Showing great attention to detail; very careful and precise.',
    example_sentence: 'She was meticulous in preparing her semester exam notes.',
    mastery_level: 'mastered',
    created_at: '2026-11-12T06:00:00Z',
  },
  {
    id: 'vocab-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    word: 'Articulate',
    part_of_speech: 'verb / adjective',
    definition: 'Expressing ideas clearly and fluently in speech.',
    example_sentence: 'Daily speaking practice helped him articulate his answers during the exam viva.',
    mastery_level: 'learning',
    created_at: '2026-11-12T06:00:00Z',
  },
  {
    id: 'vocab-3',
    user_id: '00000000-0000-0000-0000-000000000001',
    word: 'Perseverance',
    part_of_speech: 'noun',
    definition: 'Persistence in doing something despite difficulty or delay in achieving success.',
    example_sentence: 'With perseverance and regular study, any competitive or semester exam can be mastered.',
    mastery_level: 'mastered',
    created_at: '2026-11-12T06:00:00Z',
  },
  {
    id: 'vocab-4',
    user_id: '00000000-0000-0000-0000-000000000001',
    word: 'Comprehensive',
    part_of_speech: 'adjective',
    definition: 'Complete and including everything that is necessary.',
    example_sentence: 'We created a comprehensive revision timetable for the upcoming IA tests.',
    mastery_level: 'learning',
    created_at: '2026-11-12T06:00:00Z',
  },
]
