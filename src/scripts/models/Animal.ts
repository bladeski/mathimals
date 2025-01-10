import { BasicType } from '.';
import { EndangeredStatus } from '../enums';

export type Animal = BasicType & {
  cost: number;
  happiness: number;
  facts: string[];
  endangeredStatus: EndangeredStatus;
};
