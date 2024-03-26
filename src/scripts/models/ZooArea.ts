import { BasicType, Decoration, Enclosure } from '.';

export type ZooArea = BasicType & {
  decorations: Decoration[];
  enclosures: Enclosure[];
}