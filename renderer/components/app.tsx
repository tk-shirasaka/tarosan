import React from "react";

import { IRange, Range } from "../utils/range";
import { IColor, Colors } from "../utils/colors";

import { SettingComponent } from "./setting";
import { ImageComponent } from "./image";
import { OutputComponent } from "./output";

interface Props {
}

interface States {
  size: { width: number; height: number; }
  source: number[][];
  target: number[][];
  range: IRange;
  colors: IColor[];
}

export class AppComponent extends React.Component<Props, States> {
  private range = new Range;
  private colors = new Colors;

  constructor(props: Props) {
    super(props);

    this.state = {
      size: { width: 0, height: 0 },
      source: [],
      target: [],
      range: this.range.get(),
      colors: this.colors.get(),
    };
  }

  onSubmit(range: IRange, colors: IColor[]) {
    const scale = (range.max - range.min) / colors.length;

    this.range.save(range);
    this.colors.save(colors.map((color, i) => {
      color.from = range.min + scale * i;
      return color;
    }));
    this.setState({ range, colors });
  }

  onImageChange(width: number, height: number, source: number[][], target: number[][]) {
    const size = { width, height };
    const check = (key: "width" | "height") => (this.state.size[key] === 0 || this.state.size[key] === size[key]);

    if (check("width") && check("height")) {
      this.setState({ size, source, target });
    } else {
      window.alert('画像のサイズが一致しません');
    }
  }
  onSourceChange(width: number, height: number, source: number[][]) {
    this.onImageChange(width, height, source, this.state.target);
  }

  onTargetChange(width: number, height: number, target: number[][]) {
    this.onImageChange(width, height, this.state.source, target);
  }

  render() {
    return (
      <>
        <SettingComponent onSubmit={this.onSubmit.bind(this)} />
        <div>
          <ImageComponent size={this.state.size} bitmap={this.state.source} title="分子画像" onChange={this.onSourceChange.bind(this)} />
          <ImageComponent size={this.state.size} bitmap={this.state.target} title="分母画像" onChange={this.onTargetChange.bind(this)} />
        </div>
        {(this.state.source.length && this.state.target.length) ? <OutputComponent {...this.state} /> : null}
      </>
    )
  }
}
