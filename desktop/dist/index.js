"use strict";
exports.__esModule = true;
var path = require("path");
var electron_1 = require("electron");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    electron_1.app.quit();
}
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
        title: "WA Weapon Tracker",
        height: 450,
        width: 199,
        resizable: false,
        roundedCorners: false,
        frame: false,
        // alwaysOnTop: true,
        backgroundColor: "#000",
        webPreferences: {
            preload: path.join(electron_1.app.getAppPath(), "src/preload.js")
        }
    });
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools({ mode: "detach" });
    electron_1.globalShortcut.register("Alt+CommandOrControl+M", function () {
        win.webContents.send("toggleMenu");
    });
};
electron_1.app.on("ready", createWindow);
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
//# sourceMappingURL=index.js.map