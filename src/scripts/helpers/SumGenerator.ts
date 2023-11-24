import { Difficulty, Operator } from '../enums';

import { Sum } from '../models';

const AddSubMultipliers = {
  [Difficulty.EASY]: [1,10],
  [Difficulty.MEDIUM]: [5,25],
  [Difficulty.HARD]: [15,50],
  [Difficulty.MASTER]: [35,100],
};

const MultDivValidNumbers = {
  [Difficulty.EASY]: [[1,2,10],[1,2,3,4,5,6,10]],
  [Difficulty.MEDIUM]: [[1,2,3,5,10],[1,2,3,4,5,6,10]],
  [Difficulty.HARD]: [[5,6,7,8,9],[4,5,6,7,8,9]],
  [Difficulty.MASTER]: [[7,8,9,11,12],[6,7,8,9,11,12]],
}

export class SumGenerator {
  static generate(operator: Operator, difficulty: Difficulty): Sum {
    const summands = this.generateSummands(operator, difficulty)
      .sort((a, b) => {
        return operator === Operator.SUBTRACTION || operator === Operator.DIVISION ? b - a : 0;
      });
    
    return {
      summands,
      operator,
      result: summands.reduce((prev, curr, index) => {
        if (index === 0) {
          return curr;
        }
        switch (operator) {
          case Operator.ADDITION:
            return prev + curr;
          case Operator.SUBTRACTION:
            return prev - curr;
          case Operator.MULTIPLICATION:
            return prev * curr;
          case Operator.DIVISION:
            return prev / curr;
        }
      }, 0),
      toString: () => {
        let string = '';
        summands.forEach((summand, index) => {
          string = `${string}${index > 0 ? ' ' + operator + ' ' : ''}${summand}`;
        });
        return string;
      }
    }
  }

  private static generateSummands(operator: Operator, difficulty: Difficulty): number[] {
    const summands = [
      MultDivValidNumbers[difficulty][0][Math.floor(Math.random() * MultDivValidNumbers[difficulty][0].length)],
      MultDivValidNumbers[difficulty][1][Math.floor(Math.random() * MultDivValidNumbers[difficulty][1].length)],
    ];
    switch (operator) {
      case Operator.MULTIPLICATION:
        return summands;
      case Operator.DIVISION:
        return [summands[0] * summands[1], summands[0]];
      default:
        return [
          this.getRandomNumberInRange(AddSubMultipliers[difficulty][0], AddSubMultipliers[difficulty][1]),
          this.getRandomNumberInRange(AddSubMultipliers[difficulty][0], AddSubMultipliers[difficulty][1]),
        ];
    }
  }

  private static getRandomNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
}