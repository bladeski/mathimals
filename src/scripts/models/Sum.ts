import { Operator } from '../enums';

export type Sum = {
  summands: number[];
  operator: Operator;
  result: number;
  toString: () => string;
}