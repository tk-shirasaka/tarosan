import React from "react";

import { IColor } from "../utils/colors";

interface Props {
  size: { width: number; height: number; };
  colors: IColor[];
  source: number[][];
  target: number[][];
}

interface States {
}

export class OutputComponent extends React.Component<Props, States> {
  private ctx?: CanvasRenderingContext2D;

  componentDidMount() {
    const ctx = (this.refs.canvas as HTMLCanvasElement).getContext("2d");

    if (ctx) {
      this.ctx = ctx;
      this.drawOutput(ctx);
    }
  }

  private calcColor(base: number, offset: number) {
    return Math.min(255, Math.max(0, base + offset));
  }

  private drawOutput(ctx: CanvasRenderingContext2D) {
    this.props.source.forEach((line, y) => line.forEach((source, x) => {
      const target = this.props.target[y][x];
      const bit = target ? (source / target) * 100 : 0;
      const color = this.props.colors.filter(c => c.from <= bit).pop();

      if (color) {
        const r = this.calcColor(color.r, target);
        const g = this.calcColor(color.g, target);
        const b = this.calcColor(color.b, target);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      } else {
        ctx.fillStyle = "#000000";
      }
      ctx.fillRect(x, y, 1, 1);
    }));
  }

  render() {
    this.ctx && this.drawOutput(this.ctx);
    return (
      <div>
        <canvas {...this.props.size} ref="canvas" />
      </div>
    );
  }
}
