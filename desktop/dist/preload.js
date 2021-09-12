var _a = require("electron"), ipcRenderer = _a.ipcRenderer, contextBridge = _a.contextBridge;
contextBridge.exposeInMainWorld("api", {
    send: function (channel, data) {
        // whitelist channels
        var validChannels = ["test"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    on: function (channel, func) {
        var validChannels = ["toggleMenu"];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return func.apply(void 0, args);
            });
        }
    }
});
//# sourceMappingURL=preload.js.map