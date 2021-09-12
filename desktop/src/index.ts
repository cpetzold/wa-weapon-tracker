import * as path from "path";

import { BrowserWindow, app, globalShortcut, ipcMain } from "electron";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  const win = new BrowserWindow({
    title: "WA Weapon Tracker",
    height: 458,
    width: 199,
    resizable: false,
    roundedCorners: false,
    frame: false,
    // alwaysOnTop: true,
    backgroundColor: "#000000",
    webPreferences: {
      preload: path.join(app.getAppPath(), "src/preload.js"),
    },
  });

  win.loadURL("https://weapons.wormsleague.com");
  win.webContents.openDevTools({ mode: "detach" });

  globalShortcut.register("Alt+CommandOrControl+M", () => {
    win.webContents.send("toggleMenu");
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
