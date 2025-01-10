import { Difficulty } from '../enums';

export class Level {
  [Difficulty.EASY]: [number, number] = [0, 0];
  [Difficulty.MEDIUM]: [number, number] = [0, 0];
  [Difficulty.HARD]: [number, number] = [0, 0];
  [Difficulty.MASTER]: [number, number] = [0, 0];
}
