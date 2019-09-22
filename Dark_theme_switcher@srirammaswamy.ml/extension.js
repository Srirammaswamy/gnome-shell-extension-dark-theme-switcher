
const St = imports.gi.St;
const Gio = immports.gi.Gio;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

const DESKTOP_SCHEMA_KEY = 'org.gnome.desktop.interface';
const SHELL_SCHEMA_KEY = 'org.gnome.shell.extensions.user-theme';
const THEME_KEY = 'gtk-theme';
const SHELL_KEY = 'name';
const ICON_KEY = 'icon-theme';
const LIGHT_THEME = 'McOS-CTLina';
const DARK_THEME =  'Mc-OS-CTLina-Dark';
const LIGHT_ICON = 'Os-Catalina-icons';
const DARK_ICON = 'Os-Catalina-Night';
const LIGHT_SHELL = 'McOS-CTLina';
const DARK_SHELL = 'Mc-OS-CTLina-Dark';

let text, button;
let desktop_settings, shell_settings;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello() {
    if (!text) {
        text = new St.Label({ style_class: 'display-label', text: "Light mode enabled" });
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
                      monitor.y + Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 2,
                       transition: 'easeOutQuad',
                       onComplete: _hideHello });
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    let icon = new St.Icon({ icon_name: 'weather-clear-night-symbolic',
                             style_class: 'system-status-icon' });

    button.set_child(icon);
    button.connect('button-press-event', _showHello);
    desktop_settings = new Gio.Settings({ schema: DESKTOP_SCHEMA_KEY });
    shell_settings   = new Gio.Settings({ schema: SHELL_SCHEMA_KEY });
    setLightTheme();
}

function setLightTheme() {
    desktop_settings.set_string(THEME_KEY, LIGHT_THEME);
    desktop_settings.set_string(ICON_KEY, LIGHT_ICON);
    shell_settings.set_string(SHELL_KEY, LIGHT_SHELL);
}

function setDarkTheme() {
    desktop_settings.set_string(THEME_KEY, DARK_THEME);
    desktop_settings.set_string(ICON_KEY, DARK_ICON);
    shell_settings.set_string(SHELL_KEY, DARK_SHELL);    
}

function getCurrentTheme() {
    let theme = desktop_settings.get_string(THEME_KEY);
    let icon  = desktop_settings.get_string(ICON_KEY);
    let shell = shell_settings.get_string(SHELL_KEY);

    if(theme === LIGHT_THEME && icon === LIGHT_ICON && shell === LIGHT_SHELL)
        return "light";
    if(theme === DARK_THEME  && icon === DARK_ICON  && shell === DARK_SHELL )
        return "dark";
    setLightTheme();
    return "light";  
}

function toggleTheme() {
    getCurrentTheme() === "light"
      ? setDarkTheme();
      : setLightTheme();
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
