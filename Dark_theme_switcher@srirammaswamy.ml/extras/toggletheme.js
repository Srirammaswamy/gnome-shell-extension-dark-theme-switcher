const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

const DESKTOP_SCHEMA_KEY = 'org.gnome.desktop.interface';
const SHELL_SCHEMA_KEY = 'org.gnome.shell.extensions.user-theme';
const THEME_KEY = 'gtk-theme';
const SHELL_KEY = 'name';
const ICON_KEY  = 'icon-theme';
const LIGHT_THEME = 'McOS-CTLina';
const DARK_THEME =  'Mc-OS-CTLina-Dark';
const LIGHT_ICON = 'Os-Catalina-icons';
const DARK_ICON = 'Os-Catalina-Night';
const LIGHT_SHELL = 'McOS-CTLina';
const DARK_SHELL = 'Mc-OS-CTLina-Dark';
const LIGHT_TEXT = '🌞️ Light mode enabled :)';
const DARK_TEXT = '🌜️ Dark mode enabled ;)';

let desktop_settings;
let shell_settings;
let textValue;

var processRunner = {
    _spawn_async: function(cmd, e) {
        try {
            GLib.spawn_command_line_async(cmd);//, e);
        } catch ( e ) {
            throw e;
        }
    },
        //Make GLib.spawn_command_line_sync prettier
    _spawn_sync: function (cmd, e) {
        try {
            GLib.spawn_command_line_sync(cmd); //, null, null, null, e );
        } catch ( e ) {
            throw e;
        }
    },
    notify_light: function() {
        this._spawn_async("notify-send \"Theme changed\" \"🌞️ Light mode enabled :)\"", null);
    },
    notify_dark: function() {
        this._spawn_async("notify-send \"Theme changed\" \"🌜️ Dark mode enabled :)\"", null);
    }
};

function _showText() {
    log(textValue);
    if(textValue === LIGHT_TEXT)
        processRunner.notify_light();
    else
        processRunner.notify_dark();

}

function setLightTheme() {
    desktop_settings.set_string(THEME_KEY, LIGHT_THEME);
    desktop_settings.set_string(ICON_KEY, LIGHT_ICON);
    shell_settings.set_string(SHELL_KEY, LIGHT_SHELL);
    textValue = LIGHT_TEXT;
    _showText();
}

function setDarkTheme() {
    desktop_settings.set_string(THEME_KEY, DARK_THEME);
    desktop_settings.set_string(ICON_KEY, DARK_ICON);
    shell_settings.set_string(SHELL_KEY, DARK_SHELL);
    textValue = DARK_TEXT;
    _showText();    
}

function getCurrentTheme() {
    let theme = desktop_settings.get_string(THEME_KEY);
    let icon  = desktop_settings.get_string(ICON_KEY);
    let shell = shell_settings.get_string(SHELL_KEY);
    log(shell);
    if(ARGV === "gnome") {
        if(theme === LIGHT_THEME && icon === LIGHT_ICON && shell === LIGHT_SHELL)
            return "light";
        if(theme === DARK_THEME  && icon === DARK_ICON  && shell === DARK_SHELL )
            return "dark";
    }
    else {
        if(theme === LIGHT_THEME && icon === LIGHT_ICON)
            return "light";
        if(theme === DARK_THEME  && icon === DARK_ICON )
            return "dark";        
    }
    setLightTheme();
    return "light";  
}

function toggleTheme() {
    getCurrentTheme() === "light"
      ? setDarkTheme()
      : setLightTheme();
}

desktop_settings = new Gio.Settings({ schema: DESKTOP_SCHEMA_KEY });
shell_settings   = new Gio.Settings({ schema: SHELL_SCHEMA_KEY });

toggleTheme();
