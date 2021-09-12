const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["test"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, func) => {
    let validChannels = ["toggleMenu"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
