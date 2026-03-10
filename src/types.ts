export interface FlashCard {
  question: string;
  choices: string[];
  correctIndex: number;
}

export interface QuizStats {
  correct: number;
  wrong: number;
}
