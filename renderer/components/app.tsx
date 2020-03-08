import React from "react";

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
  colors: IColor[];
}

export class AppComponent extends React.Component<Props, States> {
  private colors = new Colors;

  constructor(props: Props) {
    super(props);

    this.state = {
      size: { width: 200, height: 200 },
      source: [],
      target: [],
      colors: this.colors.getColors()
    };
  }

  onColorChange(colors: IColor[]) {
    colors.sort((a, b) => Math.max(-1, Math.min(1, a.from - b.from)));
    this.colors.save(colors);
    this.setState({ colors: this.colors.getColors() });
  }

  onSourceChange(source: number[][]) {
    this.setState({ source });
  }

  onTargetChange(target: number[][]) {
    this.setState({ target });
  }

  render() {
    return (
      <>
        <SettingComponent onSubmit={this.onColorChange.bind(this)} />
        <ImageComponent size={this.state.size} onChange={this.onSourceChange.bind(this)} />
        <ImageComponent size={this.state.size} onChange={this.onTargetChange.bind(this)} />
        {(this.state.source.length && this.state.target.length) ? <OutputComponent {...this.state} /> : null}
      </>
    )
  }
}
