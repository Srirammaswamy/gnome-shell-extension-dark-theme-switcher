const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;
const Lang = imports.lang;

const Extension = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Extension.imports.convenience;
const Gettext = imports.gettext.domain('toggledarktheme');
const _ = Gettext.gettext;



let gsettings, settings;

function init() {
	//Convenience.initTranslations();

	gsettings = Convenience.getSettings();;

	settings = {
		"gtk-theme": {
			type: "s",
			label: _("Select GTK theme")
		},
		"gtk-theme-dark": {
			type: "s",
			label: _("Select Dark GTK theme")
		},
		"icon-theme": {
			type: "s",
			label: _("Select Icon theme")
		},
		"icon-theme-dark": {
			type: "s",
			label: _("Select Dark Icon theme")
		},
		"shell-theme": {
			type: "s",
			label: _("Select Shell theme")
		},
		"shell-theme-dark": {
			type: "s",
			label: _("Select Dark Shell theme")
		}

	};
}

function buildPrefsWidget(){

    let frame = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        border_width: 10
    });
    let vbox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        margin: 20,
        margin_top: 10
    });

    let hbox;
    for (setting in settings){
        hbox = buildHbox(settings, setting);
        vbox.add(hbox);
    }

    frame.add(vbox);
    frame.show_all();

    return frame;

}

function buildHbox(settings, setting){
    let hbox;

    if (settings[setting].type == "i")
        hbox = createIntSetting(settings, setting);
    if (settings[setting].type == "b")
        hbox = createBoolSetting(settings, setting);
    if (settings[setting].type == "s")
        hbox = createStringSetting(settings, setting);

    return hbox;
}

/** Adapted from https://developer.gnome.org/gnome-devel-demos/stable/combobox.js.html.en#combobox
 * @author Eemil Lagerspetz
 */
function createStringSetting(settings, setting){

    let settingsV = settings[setting];
    let settingsId = setting;

    let hbox = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        margin_top: 5
    });

    let setting_label = new Gtk.Label({
        label: settingsV.label,
        xalign: 0,
        hexpand: true,
        margin_right: 20
    });

    // This is to add the 'combo' filtering options
    gtk_store = new Gtk.ListStore();
    gtk_store.set_column_types([GObject.TYPE_STRING, GObject.TYPE_STRING]);
    gtk_store.set(gtk_store.append(), [0], ['Ctrl']);
    gtk_store.set(gtk_store.append(), [0], ['Super']);
    gtk_store.set(gtk_store.append(), [0], [_('Ctrl or Super')]);

    combo = new Gtk.ComboBox({
        model: store
    });
    renderer = new Gtk.CellRendererText();
    combo.pack_start(renderer, false);
    combo.add_attribute(renderer, "text", 0);
    combo.set_active(0);
    let previousValue = gsettings.get_string(settingsId);
    if (previousValue === 'Super')
        combo.set_active(1);
    if (previousValue === 'Ctrl or Super')
        combo.set_active(2);

    combo.connect('changed', (widget) => {
        let model, active, type, text, filter;

        model = widget.get_model();
        active = widget.get_active_iter()[1];

        type = model.get_value(active, 0);
        gsettings.set_string(settingsId, type);
    });


    // Create the combobox
    /*    this.tile_key_setting = new Gtk.ComboBoxText();

        let options = ["Ctrl", "Super", "Ctrl or Super"];
                    
        for (let i = 0; i < options.length; i++ ) {
            this.tile_key_setting.append_text(options[i]);
        }
        
        this.tile_key_setting.set_active(0);*/

    if (settingsV.help){
        setting_label.set_tooltip_text(settingsV.help)
        this.tile_key_setting.set_tooltip_text(settingsV.help)
    }

    hbox.pack_start(setting_label, true, true, 0);
    hbox.add(combo);

    return hbox;
}
