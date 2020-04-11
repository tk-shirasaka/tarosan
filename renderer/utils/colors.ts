export interface IColor {
  r: number; g: number; b: number; from: number;
};

export class Colors {
  private colors: IColor[] = [
    { r: 0,   g: 0,   b: 255, from: 0   },
    { r: 0,   g: 255, b: 0,   from: 20  },
    { r: 255, g: 255, b: 0,   from: 30  },
    { r: 255, g: 0,   b: 0,   from: 40  },
    { r: 255, g: 0,   b: 255, from: 50  },
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
