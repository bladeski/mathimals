import { Difficulty, Operator } from '../enums';

const AddSubMultipliers = {
  [Difficulty.EASY]: [1, 10],
  [Difficulty.MEDIUM]: [5, 25],
  [Difficulty.HARD]: [15, 50],
  [Difficulty.MASTER]: [35, 100],
};

const MultDivValidNumbers = {
  [Difficulty.EASY]: [
    [1, 2, 10],
    [1, 2, 3, 4, 5, 6, 10],
  ],
  [Difficulty.MEDIUM]: [
    [3, 4, 5, 10],
    [3, 4, 5, 6, 10],
  ],
  [Difficulty.HARD]: [
    [5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9],
  ],
  [Difficulty.MASTER]: [
    [7, 8, 9, 11, 12],
    [6, 7, 8, 9, 11, 12],
  ],
};

export class Sum {
  static generate(operator: Operator, difficulty: Difficulty): Sum {
    const isPositiveSum =
      operator === Operator.ADDITION || operator === Operator.MULTIPLICATION;
    const summands = this.generateSummands(operator, difficulty).sort(
      (a, b) => {
        return !isPositiveSum ? b - a : 0;
      },
    );
    const result = summands.reduce((prev, curr, index) => {
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
    }, 0);
    const answers: number[] = [result];
    const variation = 3 + difficulty;
    const min = isPositiveSum
      ? Math.max(...summands)
      : Math.max(0, result - variation);
    const max = isPositiveSum ? result + variation : Math.min(...summands);

    const debug = {
      answers,
      variation,
      min,
      max,
      options: [] as number[],
    };

    for (let i = 0; i < 2 + difficulty; i++) {
      let answer = this.getRandomNumberInRange(min, max);
      let count = 0;

      while (answers.some((a) => a === answer) && count < 100) {
        debug.options.push(answer);
        answer = this.getRandomNumberInRange(min, max);
        count++;
        if (count === 100) {
          console.table(debug);
        }
      }

      answers.push(answer);
      answers.sort(() => this.getRandomNumberInRange(-10, 10));
    }

    return {
      difficulty,
      summands,
      operator,
      result,
      answers: Array.from(new Set(answers)),
    };
  }

  private static generateSummands(
    operator: Operator,
    difficulty: Difficulty,
  ): number[] {
    const summands = [
      MultDivValidNumbers[difficulty][0][
        Math.floor(Math.random() * MultDivValidNumbers[difficulty][0].length)
      ],
      MultDivValidNumbers[difficulty][1][
        Math.floor(Math.random() * MultDivValidNumbers[difficulty][1].length)
      ],
    ];
    switch (operator) {
      case Operator.MULTIPLICATION:
        return summands;
      case Operator.DIVISION:
        return [summands[0] * summands[1], summands[0]];
      default:
        return [
          this.getRandomNumberInRange(
            AddSubMultipliers[difficulty][0],
            AddSubMultipliers[difficulty][1],
          ),
          this.getRandomNumberInRange(
            AddSubMultipliers[difficulty][0],
            AddSubMultipliers[difficulty][1],
          ),
        ];
    }
  }

  private static getRandomNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  answers: number[];
  difficulty: Difficulty;
  operator: Operator;
  result: number;
  summands: number[];

  constructor(
    operator: Operator = Operator.ADDITION,
    difficulty: Difficulty = Difficulty.EASY,
  ) {
    this.operator = operator;
    this.difficulty = difficulty;
    const sum = Sum.generate(operator, difficulty);
    this.answers = sum.answers;
    this.result = sum.result;
    this.summands = sum.summands;
  }

  toString() {
    let string = '';
    this.summands.forEach((summand, index) => {
      string = `${string}${
        index > 0 ? ' ' + this.operator + ' ' : ''
      }${summand}`;
    });
    return string;
  }
}
