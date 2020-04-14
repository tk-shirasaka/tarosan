import React from "react";

import { IRange, Range } from "../utils/range";
import { IColor, Colors } from "../utils/colors";

interface Props {
  onSubmit: (range: IRange, colors: IColor[]) => void;
}

interface States {
  selected: number;
  range: IRange;
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
  range: {
    padding: 5,
    margin: 5,
    paddingLeft: 15,
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

    this.state = {
      selected: -2,
      range: (new Range).get(),
      colors: (new Colors).get(),
    };
  }

  private onChangeRange(key: "min" | "max", value: string) {
    this.state.range[key] = +value;
    this.setState({ range: this.state.range })
  }

  private onChangeColor(key: "r" | "g" | "b", value: string) {
    this.state.colors[this.state.selected][key] = +value;
    this.setState({ colors: this.state.colors })
  }

  private onDelete(i: number) {
    this.state.colors.splice(i, 1);
    this.props.onSubmit(this.state.range, this.state.colors);
  }

  private onSubmit() {
    this.setState({ selected: -2 });
    this.props.onSubmit(this.state.range, this.state.colors);
  }

  private onSelect(i: number) {
    this.setState({ selected: i });
  }

  private addColor() {
    const selected = this.state.colors.length;
    const colors = [...this.state.colors, { r: 0, g: 0, b: 0, from: 0 }];
    this.setState({ colors, selected });
  }

  private renderRangePanel() {
    return <div style={styles.panel} onClick={() => this.onSelect(-1)}>{ this.state.range.min } ～ { this.state.range.max }</div>;
  }

  private renderRangeForm() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label style={styles.form}>
          <div style={styles.label}>Min</div>
          <input style={styles.input} type="number" value={this.state.range.min} onChange={e => this.onChangeRange("min", e.target.value)} />
        </label>
        <label style={styles.form}>
          <div style={styles.label}>Max</div>
          <input style={styles.input} type="number" value={this.state.range.max} onChange={e => this.onChangeRange("max", e.target.value)} />
        </label>
        <i className="material-icons color-green" onClick={this.onSubmit.bind(this)}>check</i>
      </form>
    );
  }

  private renderRange() {
    return (
      <div className="float" style={styles.range}>
        {this.state.selected === -1 ? this.renderRangeForm() : this.renderRangePanel()}
      </div>
    )
  }

  private renderPalettePanel(i: number) {
    return <div style={styles.panel} onClick={() => this.onSelect(i)}>{ i + 1 }</div>;
  }

  private renderPaletteForm(i: number, color: IColor) {
    const limit = Math.min(255, 510 - color.r - color.g - color.b);
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label style={styles.form}>
          <div style={styles.label}>Red</div>
          <input style={styles.input} type="range" max={Math.min(255, limit + color.r)} value={color.r} onChange={e => this.onChangeColor("r", e.target.value)} />
        </label>
        <label style={styles.form}>
          <div style={styles.label}>Green</div>
          <input style={styles.input} type="range" max={Math.min(255, limit + color.g)} value={color.g} onChange={e => this.onChangeColor("g", e.target.value)} />
        </label>
        <label style={styles.form}>
          <div style={styles.label}>Blue</div>
          <input style={styles.input} type="range" max={Math.min(255, limit + color.b)} value={color.b} onChange={e => this.onChangeColor("b", e.target.value)} />
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
        {this.state.selected === i ? this.renderPaletteForm(i, color) : this.renderPalettePanel(i)}
      </div>
    )
  }

  render() {
    return (
      <div style={styles.scope}>
        <h2 style={styles.title}>たろうさん（α版）</h2>
        {this.renderRange()}
        {this.state.colors.map(this.renderPalette.bind(this))}
        <i className="material-icons color-green" onClick={() => this.addColor()}>add</i>
      </div>
    );
  }
}
