import { BasicType, Decoration, Enclosure } from '.';

export type ZooArea = BasicType & {
  animals: number[];
  decorations: Decoration[];
  enclosures: Enclosure[];
}