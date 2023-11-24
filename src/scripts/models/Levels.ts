import { Level } from '.';
import { Operator } from '../enums';

export class Levels {
  [Operator.ADDITION]: Level = new Level();
  [Operator.SUBTRACTION]: Level = new Level();
  [Operator.MULTIPLICATION]: Level = new Level();
  [Operator.DIVISION]: Level = new Level();
}