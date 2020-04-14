import React, { MouseEvent } from "react";

import { IRange } from "../utils/range";
import { IColor } from "../utils/colors";

interface Props {
  size: { width: number; height: number; };
  range: IRange;
  colors: IColor[];
  source: number[][];
  target: number[][];
}

interface States {
  isgray: boolean;
  selected: { x: number; y: number; };
}

const styles = {
  canvas: {
    cursor: "pointer",
  }
}
export class OutputComponent extends React.Component<Props, States> {
  private ctx?: CanvasRenderingContext2D;

  constructor(props: Props) {
    super(props);

    this.state = { isgray: false, selected: { x: -1, y: -1 } };
  }

  componentDidMount() {
    const ctx = (this.refs.canvas as HTMLCanvasElement).getContext("2d");

    if (ctx) {
      this.ctx = ctx;
      this.drawOutput(ctx);
    } }

  private toggleGray() {
    this.setState({ isgray: !this.state.isgray });
  }

  private selectBit(e: MouseEvent) {
    this.setState({ selected: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY } });
  }

  private calcColor(limit: number, offset: number) {
    return Math.min(limit, Math.max(0, offset));
  }

  private drawOutput(ctx: CanvasRenderingContext2D) {
    this.props.source.forEach((line, y) => line.forEach((source, x) => {
      const target = this.props.target[y][x];
      const bit = target ? source / target : 0;
      const color = this.props.range.min <= bit && bit <= this.props.range.max && this.props.colors.filter(c => c.from <= bit).pop();

      if (this.state.isgray) {
        const r = this.calcColor(255, bit);
        const g = this.calcColor(255, bit);
        const b = this.calcColor(255, bit);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      } else if (color) {
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

  private renderSelected() {
    const { x, y } = this.state.selected;
    return x < 0
      ? (
        <div>
          <div>座標（x, y）：-</div>
          <div>色（分子 / 分母 = 出力）：-</div>
        </div>
      ) : (
        <div>
          <div>座標（x, y）：{ x }, { y }</div>
          <div>色（分子 / 分母 = 出力）：{ this.props.source[y][x] } / { this.props.target[y][x] } = { this.props.source[y][x] / this.props.target[y][x] }</div>
        </div>
      );
  }

  render() {
    this.ctx && this.drawOutput(this.ctx);
    return (
      <div>
        <label>
          白黒で出力<input type="checkbox" onChange={this.toggleGray.bind(this)} checked={this.state.isgray} />
        </label>
        { this.renderSelected() }
        <canvas {...this.props.size} style={styles.canvas} onClick={this.selectBit.bind(this)} ref="canvas" />
      </div>
    );
  }
}
