import { app, BrowserWindow } from "electron";

class Tarosan {
  static win?: BrowserWindow;

  constructor() {
    app.on("ready", this.onReady.bind(this));
    app.on("activate", this.onActivate.bind(this));
    app.on("window-all-closed", this.onWindowAllClosed.bind(this));
  }

  private onReady() {
    this.create();
  }

  private onActivate() {
    this.create();
  }

  private onWindowAllClosed() {
    if (process.platform !== "darwin") app.quit();
  }

  private create() {
    if (Tarosan.win) return;

    // Menu.setApplicationMenu(null);

    Tarosan.win = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
      },
    });

    Tarosan.win.loadURL(`file://${__dirname}/../index.html`);
    Tarosan.win.on("closed", () => delete(Tarosan.win));

    Tarosan.win.webContents.openDevTools();
  }
}

new Tarosan
