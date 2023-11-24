import { Animal, Decoration, ZooArea } from '../models';
import { Animals, Decorations, ZooAreas } from '../../data';

class DataService {
  public getAnimals() {
    return new Promise<Animal[]>(res => res(Animals));
  }

  public getDecorations() {
    return new Promise<Decoration[]>(res => res(Decorations));
  }

  public getZooAreas() {
    return new Promise<ZooArea[]>(res => res(ZooAreas));
  }
}

const dataService = new DataService();
export default dataService;