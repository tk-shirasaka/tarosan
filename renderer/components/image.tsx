import React, { ChangeEvent } from "react";

interface Props {
  size: { width: number; height: number; };
  onChange: (bitmap: number[][]) => void;
}

interface States {
}

const positionR: "relative" = "relative";
const positionA: "absolute" = "absolute";
const styles = {
  scope: {
    position: positionR,
  },
  label: {
    position: positionA,
    top: 12,
    right: 12,
  },
  input: {
    display: "none",
  },
}

export class ImageComponent extends React.Component<Props, States> {
  private ctx?: CanvasRenderingContext2D;

  componentDidMount() {
    const ctx = (this.refs.canvas as HTMLCanvasElement).getContext("2d");

    ctx && (this.ctx = ctx);
  }

  private getBitmap(array?: Uint8ClampedArray) {
    const result: number[][] = [];
    const width = this.props.size.width * 4;
    const height = this.props.size.height

    if (!array) return result;

    for (let y = 0; y < height; y++) {
      const line: number[] = [];
      for (let x = 0; x < width; x++) {
        const i = y * width + x * 4;
        const r = array[i + 0];
        const g = array[i + 1];
        const b = array[i + 2];
        line.push(Math.round((r + g + b) / 3));
      }
      result.push(line);
    }

    return result;
  }

  private onChange(e: ChangeEvent) {
    const { width, height } = this.props.size
    const files = (e.target as HTMLInputElement).files

    e.preventDefault();
    e.stopPropagation();
    if (!this.ctx || !files || ["image/jpeg", "image/png"].indexOf(files[0].type) < 0) return;

    const reader = new FileReader;
    const image = new Image;

    reader.onload = e => {
      image.onload = () => {
        this.ctx?.drawImage(image, 0, 0, width, height);
        this.props.onChange(this.getBitmap(this.ctx?.getImageData(0, 0, width, height).data));
      };
      image.src = e.target?.result as string;
    };
    reader.readAsDataURL(files[0]);
  }

  render() {
    return (
      <div style={styles.scope}>
        <label style={styles.label}>
          <i className="material-icons color-green">folder</i>
          <input type="file" accept="image/*" style={styles.input} onChange={this.onChange.bind(this)} />
        </label>
        <canvas {...this.props.size} ref="canvas" />
      </div>
    );
  }
}
