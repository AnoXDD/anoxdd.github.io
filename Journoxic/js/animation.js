/* A library for animations */

window.log = {
	WELCOME: "Welcome back",
	FILE_NOT_FOUND: "Cannot find the file ",
	FILES_NOT_FOUND: "Cannot find the list of files",
	FILE_NOT_LOADED: "Cannot load the file ",
	DOWNLOAD_PROMPT: ". Please make sure it has been downloaded",
	LOCATION_PIN_FAIL: "Cannot find the current position. Please make sure you have enabled it or the browser does not support geocode",
	LOCATION_NO_RESULTS: "No results found",
	LOCATION_NO_ADDRESS: "Cannot read the address",
	NO_ENTRY_SELECTED: "No entry is selected",
	LOAD_DATA_FAIL: "Cannot load the data",
	NO_CONTENT: ": no new content is specified",
	NO_ARCHIVE: ": no archive data is found",

	ARCHIVE_START: "Loading archive list ...",
	ARCHIVE_TOO_MANY: "Too many archive files. Only the latest 500 files will be displayed",
	ARCHIVE_END: "Archive list loaded",
	ARCHIVE_INVALID_JSON: "This archive is corrupted",
	ARCHIVE_SELECT_ALL: "No archive is selected. All archives will be selected",
	ARCHIVE_NO_SELECTED: "No archive is selected",
	ARCHIVE_REMOVE_START: "Removing selected archive file(s) ...",
	ARCHIVE_REMOVE_END: " archive file(s) removed. To recover the files, visit OneDrive immediately and find them in the trash",
	ARCHIVE_REMOVE_FAIL: "Cannot remove some files. Please try again",

	CONTENTS_NEW: "Found new content with ",
	CONTENTS_NEW_END: " chars",
	CONTENTS_RELOADED: "Data reloaded",
	CONTENTS_DOWNLOAD_START: "Loading archive data ...",
	CONTENTS_DOWNLOAD_TEXT: "Text data loaded",
	CONTENTS_DOWNLOAD_TEXT_FAIL: "Cannot load the text data",
	CONTENTS_DOWNLOAD_MEDIA_START: "Loading media data ...",
	CONTENTS_DOWNLOAD_MEDIA_LOADED: "Loaded ",
	CONTENTS_DOWNLOAD_MEDIA_OF: " of ",
	CONTENTS_DOWNLOAD_MEDIA_FAIL: "Cannot load the media data",
	CONTENTS_DOWNLOAD_MEDIA_END: "Media data loaded",
	CONTENTS_DOWNLOAD_END: "Data download finished",
	CONTENTS_UPLOAD_START: "Start uploading archive data ...",
	CONTENTS_UPLOAD_BACKUP: "Data backup finished",
	CONTENTS_UPLOAD_BACKUP_FAIL: "Cannot backup archive data. Please see if there is any name conflict",
	CONTENTS_UPLOAD_END: "Data upload finished",
	CONTENTS_UPLOAD_FAIL: "Cannot upload data",
	COVER_PHOTO_FOUND: "Found cover photo ",
	COVER_PHOTO_FAIL: "Cannot find matched result for cover photo",
	AUDIO_DOWNLOAD_START: "Loading audio files ...",
	AUDIO_DOWNLOAD_END: "Audio files loaded",
	AUDIO_EXPIRED: "Audio file expires. Please re-download the media",
	EDIT_PANE_QUIT: "Data discarded",
	EDIT_PANE_SAVE_START: "Saving data ...",
	EDIT_PANE_SAVE_PENDING_ATTACHMENTS: "Pending changes saved",
	EDIT_PANE_SAVE_END: "Finished saving data",
	TAG_ADD_HEADER: "Tag \"",
	TAG_ADDED_ALREADY: "\" is already added",
	TAG_ADDED_FAILED: "\" cannot be added as an icon",
	TAG_ADDED_ICON: "\" is added as an icon",
	TAG_ADDED_ICON_ALREADY: "\" is already added as an icon",
	EDIT_PANE_IMAGES_ALREADY_LOADED: "Images have already been loaded",
	EDIT_PANE_IMAGES_FAIL: "Cannot load images",
	EDIT_PANE_IMAGES_START: "Start loading images under data/",
	EDIT_PANE_IMAGES_START_END: " ...",
	EDIT_PANE_IMAGES_END: "Photos loaded",
	EDIT_PANE_IMAGES_FIND_FAIL: " under data/",
	EDIT_PANE_IMAGES_SAVE_START: "Start transferring photos ...",
	EDIT_PANE_IMAGES_OF: " of ",
	EDIT_PANE_IMAGES_TRASNFERRED: " photo transferred",
	EDIT_PANE_FINISHED_TRANSFER: "Finished ",
	EDIT_PANE_FINISHED_TRANSFER_END: " transfer",
	EDIT_PANE_TRANSFERRED_FAILED: "One transfer failed. No transfer was made",
	EDIT_PANE_TOO_MANY_RESULTS: "There seems to be so many items. Not all the items will be displayed",
	EDIT_PANE_WEATHER_START: "Loading weather info ...",
	EDIT_PANE_WEATHER_RESULT: "Weather data loaded. It is ",
	EDIT_PANE_WEATHER_RESULT_END: " degrees. Have a good one",
	EDIT_PANE_WEATHER_END: "Weather data updated",
	EDIT_PANE_WEATHER_END_FAIL: "Cannot find the matched icon info. Is it \"",
	EDIT_PANE_WEATHER_END_FAIL_END: "\" now?",
	EDIT_PANE_PLAYABLE_SEARCH_START: "Loading resource ...",
	EDIT_PANE_PLAYABLE_FILE: " file \"",
	EDIT_PANE_PLAYABLE_FILE_ADDED: "\" added",
	EDIT_PANE_PLAYABLE_FILE_SAVED: "\" transferred",
	EDIT_PANE_PLAYABLE_SEARCH_END: "Resource loaded",
	EDIT_PANE_PLAYABLE_SEARCH_FAILED: "Cannot load the resource",
	EDIT_PANE_PLAYABLE_SAVE_START: "Start transferring ",
	EDIT_PANE_PLAYABLE_SAVE_START_END: "s ...",

	SERVER_RETURNS: ". The server returns error\"",
	SERVER_RETURNS_END: "\"",

	AUTH_REFRESH_ACCESS_START: "Refreshing access token ...",
	AUTH_REFRESH_ACCESS_END: "Access token refreshed",
	AUTH_REFRESH_ACCESS_FAILED: "Cannot refresh access token. Please make sure CORS is enabled",
	AUTH_REFRESH_AUTO_ON: "The access token will now be refreshed every 30 minute",
	AUTH_REFRESH_AUTO_OFF: "The access token will now stop refreshing",
	AUTH_REFRESH_EXPIRED: "Previous session expired"
};

window.animation = {};

animation.degree = 0;
animation.duration = 250;
animation.indent = 0;

animation.hideIcon = function(selector, callback) {
	$(selector).fadeOut(animation.duration, callback);
};

animation.showIcon = function(selector, callback) {
	$(selector).css({ top: "10px" }).fadeIn(animation.duration, callback);
};

animation.isShown = function(selector) {
	return $(selector).css("top") === "10px" && $(selector).css("display") !== "none";
};
animation.toggleIcon = function(selector, callback) {
	callback = callback || function() {
	};
	if (animation.isShown(selector)) {
		animation.hideIcon(selector, callback);
	} else {
		animation.showIcon(selector, callback);
	}
}; /* Set the name of confirm */
/**
 * Shows the confirm button given the argument for the event on clicking the button
 * @param {String/Number} name - The name of confirm opeartion
 * @param {String} type - The type of confirm (edit, archive, etc.). Default value is "edit"
 */
animation.setConfirm = function(name, type) {
	if (name === edit.confirmName) {
		if (typeof (name) == "number") {
			// Always show
			animation.showIcon("#confirm");
			switch (name) {
				case 2:
					// Place
					animation.toggleIcon("#pin-point");
					break;
			}
		} else {
			// Do not need to follow the steps below, just toggle it
			animation.toggleIcon("#confirm");
		}
		return;
	}
	// Start a new one
	animation.hideIcon(".entry-option", function() {
		var title;
		// Assign the default value
		type = type || "edit";
		// Change how it looks
		if (typeof (name) == "number") {
			$("#confirm").html("&#xf00d");
			title = "Remove this medium";
			switch (name) {
				case 2:
					// Place
					animation.showIcon("#pin-point");
					break;
				case 1:
					// Video
				case 3:
					// Voice
					$("#confirm").html("&#xf0ec");
					title = "Toggle where to save";
					break;
			}
		} else {
			$("#confirm").html("&#xf00c");
		}
		animation.showIcon("#confirm");
		if (name === "delete") {
			title = "Confirm to remove this entry";
		} else if (name === "discard") {
			title = "Discard this entry";
		} else if (name === "add") {
			title = "Overwrite saved data to create a new entry";
		} else if (name === "edit") {
			title = "Overwrite saved data to edit this entry";
		} else if (name === "save") {
			title = "Save entry";
		}
		if (title == undefined) {
			// Not a valid call
			return;
		}
		var onclick = "edit.confirm()";
		if (type === "edit") {
			edit.confirmName = name;
		} else if (type === "archive") {
			onclick = "archive.confirm()";
			archive.confirmName = name;
		}
		$("#confirm").css("title", title).attr("onclick", onclick);
	});
};

/* Return undefined if it is not shown */
animation.blink = function(selector) {
	if (animation.isShown(selector)) {
		var pulse = function() {
			$(selector).fadeOut();
			$(selector).fadeIn();
		};
		var id = setInterval(pulse, 1800);
		console.log("animation.blink()\t" + selector + ": id=" + id);
		return id;
	} else {
		return undefined;
	}
};

animation.finished = function(selector) {
	if (animation.isShown(selector)) {
		/* Keep a record of original text */
		var text = $(selector).html();
		$(selector).fadeOut(300, function() {
			$(this).html("&#xf00c").css({
				background: "#fff",
				"font-size": "inherit"
			});
		}).fadeIn(300).delay(500).fadeOut(300, function() {
			$(this).html(text).css({
				background: "",
				"font-size": ""
			});
		}).fadeIn(300);
	}
};

animation.warning = function(selector) {
	if (animation.isShown(selector)) {
		/* Keep a record of original text */
		var text = $(selector).html();
		$(selector).fadeOut(300, function() {
			$(this).html("&#xf071").css({
				background: "#fff"
			});
		}).fadeIn(300).delay(500).fadeOut(300, function() {
			$(this).html(text).css({
				background: ""
			});
		}).fadeIn(300);
	}
};

animation.deny = function(selector) {
	if (animation.isShown(selector)) {
		/* Keep a record of original text */
		var text = $(selector).html();
		$(selector).fadeOut(300, function() {
			$(this).html("&#xE10A").css({
				color: "#000",
				background: "#fff"
			});
		}).fadeIn(300).delay(500).fadeOut(300, function() {
			$(this).html(text).css({
				background: "",
				color: ""
			});
		}).fadeIn(300);
	}
};

animation.invalid = function(selector) {
	$(selector).effect("highlight", {
		color: "#8d8d8d"
	});
};

/**
 * Logs something on the menu to let the user know
 * @param {String} message - The message to be logged
 * @param {Number} indent - The indent parameter. 1 for indenting by one (effective after). -1 for dedenting by one (effective immediately)
 * @param {Number} type - The type of message. 0 for normal. 1 for error. 2 for warning.
 */
animation.log = function(message, indent, type) {
	var id = new Date().getTime(),
		htmlContent,
		tabClass = "";
	// Process indentation
	if (indent === 1) {
		tabClass = "start ";
	} else if (indent === -1) {
		if (--animation.indent < 0) {
			animation.indent = 0;
		}
		tabClass = "end ";
	}
	if (animation.indent > 0) {
		tabClass += "indent-" + animation.indent;
	}
	// Present it to the website
	type = type || 0;
	switch (type) {
		case 0:
			htmlContent = "<p class=\"" + tabClass + "\" id=" + id + ">" + message + "</p>";
			break;
		case 1:
			htmlContent = "<p class=\"" + tabClass + " error\" id=" + id + ">" + message + "</p>";
			break;
		case 2:
			htmlContent = "<p class=\"" +
				tabClass + " warning\" id=" + id + ">" + message + "</p>";
			break;
		default:
			htmlContent = "<p class=\"" + tabClass + "\" id=" + id + ">" + message + "</p>";
	}
	$(htmlContent).appendTo("#feedback").fadeTo(400, 1).click(function() {
		$(this).slideUp(200, function() {
			$(this).remove();
		});
	}).hover(function() {
		$(this).fadeTo(400, 1);
	});
	switch (type) {
		case 1:
			message = "[ERR] " + message;
			break;
		case 2:
			message = "[!!!] " + message;
			// Deliberately miss the break token
		default:
			setTimeout(function() {
				$("p#" + id).fadeTo(400, .5);
			}, 2000);
			// Auto remove itself
			var click = function() {
				if ($("p#" + id).css("opacity") != 1) {
					$("p#" + id).trigger("click");
				} else {
					setTimeout(click, 5000);
				}
			};
			setTimeout(click, 5000);
			break;
	}
	console.log("From user log: \t" + new Date() + ": " + message);
	if (indent === 1) {
		++animation.indent;
	}
	////$("#feedback").html(message).css("opacity", "1");
	////setTimeout(function() {
	////	$("#feedback").css("opacity", ".01");
	////}, 2000);
};
/**
 * Calls an error message and display it on the screen
 * @param {String} message - The message to be logged
 * @param {Number} indent - The indent parameter. 1 for indenting by one (effective immediately). -1 for dedenting by one (effective after)
 */
animation.error = function(message, indent) {
	animation.log(message, indent, 1);
}
/**
 * Calls a warning message and display it on the screen
 * @param {String} message - The message to be logged
 * @param {Number} indent - The indent parameter. 1 for indenting by one (effective immediately). -1 for dedenting by one (effective after)
 */
animation.warning = function(message, indent) {
	animation.log(message, indent, 2);
}

function headerShowMenu(name) {
	animation.hideIcon(".actions a");
	setTimeout(function() {
		if (name === "edit") {
			name = ".entry-edit";
		} else if (name === "add") {
			name = ".entry-add";
		} else if (name === "comm") {
			name = ".entry-comm";
		} else if (name === "archive") {
			name = ".entry-archive";
		} else {
			// name == undefined or other situations
			name = ".entry-menu";
		}
		// Disable going back for edit-pane
		if (name !== ".entry-add" && name !== ".entry-menu") {
			animation.showIcon("#show-menu");
		}
		if (name === ".entry-edit" && localStorage["_cache"] == 1) {
			animation.showIcon("#reread");
		}
		animation.showIcon(name);
	}, animation.duration + 50);
};

