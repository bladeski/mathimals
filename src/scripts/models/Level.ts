import { Difficulty } from '../enums';

export class Level {
  completedQuestions = 0;
  difficulty: Difficulty = Difficulty.EASY;
}