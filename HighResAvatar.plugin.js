/**
 * @name HighResAvatar
 * @description Makes the quality of avatars much higher. (Mainly thought to be used on popouts and profiles)
 * @version 3.0.0
 * @author Board
 * @authorId 285475344817848320
 * @website https://github.com/BoardTM/plugins
 * @source https://raw.githubusercontent.com/BoardTM/plugins/main/HighResAvatar.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const config = {
    main: "index.js",
    id: "",
    name: "HighResAvatar",
    author: "Board",
    authorId: "285475344817848320",
    authorLink: "",
    version: "3.0.0",
    description: "Makes the quality of avatars much higher. (Mainly thought to be used on popouts and profiles)",
    website: "https://github.com/BoardTM/plugins",
    source: "https://raw.githubusercontent.com/BoardTM/plugins/main/HighResAvatar.plugin.js",
    patreon: "",
    donate: "",
    invite: "",
    changelog: [
        {
            title: "3.0.0",
            items: [
                "Updated to work after the discord update"
            ]
        }
    ],
    defaultConfig: []
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Library) => {

    const {Logger, WebpackModules, Patcher} = Library;
    
    return class extends Plugin {

        onStart() {
            const module = WebpackModules.getByProps("getApplicationIconURL");
            Patcher.before(module, "getUserAvatarURL", (thisObject, args) => {
                if (args[2] === 80) {
                    args[2] = 300;
                }
            });
            Logger.info("Plugin enabled!");
        }

        onStop() {
            Patcher.unpatchAll();
            Logger.info("Plugin disabled!");
        }
    };

};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/