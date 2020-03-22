import React, { ChangeEvent } from "react";
import { decode } from "tiff";

interface Props {
  size: { width: number; height: number; };
  bitmap: number[][];
  title: string;
  onChange: (width: number, height: number, bitmap: number[][]) => void;
}

interface States {
}

const positionR: "relative" = "relative";
const positionA: "absolute" = "absolute";
const textAlign: "center" = "center";
const styles = {
  scope: {
    position: positionR,
  },
  label: {
    position: positionA,
    top: 12,
    right: 12,
    zIndex: 1,
  },
  input: {
    display: "none",
  },
  canvas: {
    width: 200,
    height: 200,
  },
  blank: {
    position: positionA,
    width: 200,
    height: 200,
    margin: 8,
    lineHeight: "200px",
    textAlign,
    color: "#9f9ea8",
  },
}

export class ImageComponent extends React.Component<Props, States> {
  private ctx?: CanvasRenderingContext2D;

  componentDidMount() {
    const ctx = (this.refs.canvas as HTMLCanvasElement).getContext("2d");

    ctx && (this.ctx = ctx);
  }

  componentDidUpdate() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    this.props.bitmap.forEach((line, y) => line.forEach((bit, x) => {
      ctx.fillStyle = `rgb(${bit}, ${bit}, ${bit})`;
      ctx.fillRect(x, y, 1, 1);
    }));
  }

  private getBitmap(width: number, height: number, array: Uint8Array | Uint16Array | Float32Array) {
    const result: number[][] = [];
    const raito = array instanceof Uint16Array ? 256 : 1;
    const scale = array.length / width / height;

    for (let y = 0; y < height; y++) {
      const line: number[] = [];
      for (let x = 0; x < width; x++) {
        let color = 0, i = 0;
        for (; i < Math.min(3, scale); i++) {
          color += array[i + (y * width + x) * scale] / raito;
        }
        line.push(Math.round(color / i));
      }
      result.push(line);
    }

    return result;
  }

  private onChange(e: ChangeEvent) {
    const files = (e.target as HTMLInputElement).files

    e.preventDefault();
    e.stopPropagation();
    if (!files) return;

    const reader = new FileReader;

    reader.onload = e => {
      if (!e.target) return;
      const image = decode(e.target.result as ArrayBuffer).pop();

      if (!image) return;
      const { width, height } = image;
      this.props.onChange(width, height, this.getBitmap(width, height, image.data));
    };
    reader.readAsArrayBuffer(files[0]);
  }

  render() {
    return (
      <div style={styles.scope}>
        <label style={styles.label}>
          <i className="material-icons color-green">folder</i>
          <input type="file" accept="image/tiff" style={styles.input} onChange={this.onChange.bind(this)} />
        </label>
        <div style={styles.blank}>{ this.props.title }</div>
        <canvas {...this.props.size} style={styles.canvas} ref="canvas" />
      </div>
    );
  }
}
