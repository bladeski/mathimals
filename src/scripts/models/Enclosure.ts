import { BasicType } from '.';

export type Enclosure = BasicType & {
  animals: {
    id: number;
    count: number;
    maxCount: number;
  }[];
  cost: number;
  unlocked: boolean;
};