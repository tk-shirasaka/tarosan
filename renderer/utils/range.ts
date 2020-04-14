export interface IRange {
  min: number; max: number;
};

export class Range {
  private range: IRange = { min: 0, max: 1 };

  constructor() {
    const saved = localStorage.getItem('range');

    if (saved) {
      this.range = JSON.parse(saved);
    }
  }

  get() {
    return this.range;
  }

  save(range: IRange) {
    localStorage.setItem('range', JSON.stringify(range));
    this.range = range;
  }
}
