export interface IColor {
  r: number; g: number; b: number; from: number;
};

export class Colors {
  private colors: IColor[] = [
    { r: 58,  g: 0,   b: 93,  from: 130 },
    { r: 85,  g: 0,   b: 150, from: 146.25 },
    { r: 0,   g: 130, b: 140, from: 162.5 },
    { r: 0,   g: 145, b: 98,  from: 178.75 },
    { r: 0,   g: 185, b: 120, from: 195 },
    { r: 0,   g: 203, b: 85,  from: 211.25 },
    { r: 195, g: 203, b: 0,   from: 227.5 },
    { r: 250, g: 0,   b: 25,  from: 243.75 },
  ];

  constructor() {
    const saved = localStorage.getItem('colors');

    if (saved) {
      this.colors = JSON.parse(saved);
    }
  }

  get() {
    return this.colors;
  }

  save(colors: IColor[]) {
    localStorage.setItem('colors', JSON.stringify(colors));
    this.colors = colors;
  }
}
