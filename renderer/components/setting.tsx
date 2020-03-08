import React from "react";

import { IColor, Colors } from "../utils/colors";

interface Props {
  onSubmit: (colors: IColor[]) => void;
}

interface States {
  selected: number;
  colors: IColor[];
}

const textAlign: "center" = "center";
const styles = {
  scope: {
    width: 250,
    background: "#373846",
  },
  title: {
    color: "#fff",
    textAlign,
  },
  palette: {
    padding: 5,
    margin: 5,
    borderLeftWidth: 10,
  },
  panel: {
    cursor: "pointer",
  },
  form: {
    display: "block",
  },
  label: {
    display: "inline-block",
    width: 80,
  },
  input: {
    display: "inline-block",
    width: 120,
  },
};

export class SettingComponent extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);

    this.state = { selected: -1, colors: (new Colors).getColors() };
  }

  private onChange(key: "r" | "g" | "b" | "from", value: string) {
    this.state.colors[this.state.selected][key] = +value;
    this.setState({ colors: this.state.colors })
  }

  private onDelete(i: number) {
    this.state.colors.splice(i, 1);
    this.props.onSubmit(this.state.colors);
  }

  private onSubmit() {
    this.setState({ selected: -1 });
    this.props.onSubmit(this.state.colors);
  }

  private onSelect(i: number) {
    this.setState({ selected: i });
  }

  private addColor() {
    const selected = this.state.colors.length;
    const colors = [...this.state.colors, { r: 0, g: 0, b: 0, from: 0 }];
    this.setState({ colors, selected });
  }

  private renderPalettePanel(i: number, color: IColor) {
    return (
      <div style={styles.panel} onClick={() => this.onSelect(i)}>
        {color.from}% ~
      </div>
    );
  }

  private renderPaletteForm(i: number, color: IColor) {
    const limit = Math.min(255, 510 - color.r - color.g - color.b);
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label style={styles.form}>
          <div style={styles.label}>Red</div>
          <input style={styles.input} type="range" max={Math.min(255, limit + color.r)} value={color.r} onChange={e => this.onChange("r", e.target.value)} />
        </label>
        <label style={styles.form}>
          <div style={styles.label}>Green</div>
          <input style={styles.input} type="range" max={Math.min(255, limit + color.g)} value={color.g} onChange={e => this.onChange("g", e.target.value)} />
        </label>
        <label style={styles.form}>
          <div style={styles.label}>Blue</div>
          <input style={styles.input} type="range" max={Math.min(255, limit + color.b)} value={color.b} onChange={e => this.onChange("b", e.target.value)} />
        </label>
        <label style={styles.form}>
          <div style={styles.label}>Min (%)</div>
          <input style={styles.input} value={color.from} onChange={e => this.onChange("from", e.target.value)} />
        </label>
        <i className="material-icons color-green" onClick={this.onSubmit.bind(this)}>check</i>
        <i className="material-icons color-red" onClick={() => this.onDelete(i)}>delete</i>
      </form>
    );
  }

  private renderPalette(color: IColor, i: number) {
    const style = {
      ...styles.palette,
      borderColor: `rgb(${color.r}, ${color.g}, ${color.b})`
    };

    return (
      <div key={i} className="float" style={style}>
        {this.state.selected === i ? this.renderPaletteForm(i, color) : this.renderPalettePanel(i, color)}
      </div>
    )
  }

  render() {
    return (
      <div style={styles.scope}>
        <h2 style={styles.title}>たろうさん（α版）</h2>
        {this.state.colors.map(this.renderPalette.bind(this))}
        <i className="material-icons color-green" onClick={() => this.addColor()}>add</i>
      </div>
    );
  }
}
