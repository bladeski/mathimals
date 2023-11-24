import { BasicType } from '.';

export type Enclosure = BasicType & {
  animalIds: number[];
  maxAnimals: number;
  animals: number;
  cost: number;
};