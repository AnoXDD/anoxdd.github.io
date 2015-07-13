/* A library for animations */

window.animation = {};

animation.isDebug = true;

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
	FOLDER_CREATED: "Folder for this date created",

	MEDIA_CLEAN_START: "Start returning lost media ...",
	MEDIA_CLEAN_NO_DATA: "No media found. Please press the button on the right to check the resource before returning lost media",
	MEDIA_CLEAN_NO_FILES: "No media found",
	MEDIA_CLEAN_GET_FOLDERS_FAIL: "Cannot get download available folder list",
	MEDIA_CLEAN_FOUND: " lost media found",
	MEDIA_CLEAN_UNDEFINED_FOUND: " undefined media found and cleaned",
	MEDIA_CLEAN_NOT_FOUND: "No lost media found",
	MEDIA_CLEAN_UNDEFINED_NOT_FOUND: "No undefined media found",
	MEDIA_CLEAN_FAIL: " media failed to be moved. Please try again",
	MEDIA_CLEAN_SUCCESS: "All lost media moved to their original folder",
	MEDIA_CLEAN_FINISHED: "Finding lost media finished",

	ARCHIVE_START: "Loading archive list ...",
	ARCHIVE_TOO_MANY: "Too many archive files. Only the latest 500 files will be displayed",
	ARCHIVE_END: "Archive list loaded",
	ARCHIVE_INVALID_JSON: "This archive is corrupted",
	ARCHIVE_SELECT_ALL: "No archive is selected. All archives will be selected",
	ARCHIVE_NO_SELECTED: "No archive is selected",
	ARCHIVE_NO_SELECTED_REMOVE: "No archive is selected to be removed",
	ARCHIVE_NO_PROTECT_CHANGE: "No archive's protection state changed",
	ARCHIVE_REMOVE_START: "Removing selected archive file(s) ...",
	ARCHIVE_REMOVE_END: " archive file(s) removed. To recover the files, visit OneDrive immediately and find them in the trash",
	ARCHIVE_REMOVE_FAIL: "Cannot remove some files. Please try again",
	ARCHIVE_PROTECT_REMOVE: "Removal for protected file \"",
	ARCHIVE_PROTECT_REMOVE_END: "\" skipped",
	ARCHIVE_PROTECT_START: "Toggling archive protection for selected files ...",
	ARCHIVE_PROTECT_CHANGE: "Archive file \"",
	ARCHIVE_PROTECT_CHANGE_PROTECTED: "\" protected",
	ARCHIVE_PROTECT_CHANGE_UNPROTECTED: "\" unprotected",
	ARCHIVE_PROTECT_FAIL: "Cannot toggle archive protection of file \"",
	ARCHIVE_PROTECT_END: "Archive protection toggle finished",

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
	CONTENTS_UPLOAD_REGISTER_FAIL: "Cannot register folder for this year. Please try again later",
	CONTENTS_UPLOAD_END: "Data upload finished for ",
	CONTENTS_UPLOAD_FAIL: "Cannot upload data",
	CONTENTS_UPGRADING: "Upgrading content data to latest version ...",
	COVER_PHOTO_FOUND: "Found cover photo ",
	COVER_PHOTO_FAIL: "Cannot find matched result for cover photo",
	AUDIO_DOWNLOAD_START: "Loading audio files ...",
	AUDIO_DOWNLOAD_END: "Audio files loaded",
	AUDIO_EXPIRED: "Audio file expired. Please re-download the media",
	VIDEO_DOWNLOAD_START: "Loading video files ...",
	VIDEO_DOWNLOAD_END: "Video files loaded",
	VIDEO_EXPIRED: "Video file expired. Please re-download the media",
	MEDIA_ALREADY_DISPLAYED: "Another media is playing. Close that to continue",
	EDIT_PANE_QUIT: "Data discarded",
	EDIT_PANE_SAVE_START: "Saving data ...",
	EDIT_PANE_SAVE_PENDING_ATTACHMENTS: "Pending changes saved",
	EDIT_PANE_SAVE_END: "Finished saving data",
	TAG_ADD_HEADER: "Tag \"",
	TAG_ICON_ADD_HEADER: "Icon \"",
	TAG_ADDED_ALREADY: "\" is already added",
	TAG_ADDED: "\" added",
	TAG_ADDED_FAILED: "\" cannot be added",
	TAG_REMOVED: "\" removed",
	EDIT_PANE_IMAGES_ALREADY_LOADED: "Images have already been loaded",
	EDIT_PANE_IMAGES_FAIL: "Cannot load images",
	EDIT_PANE_IMAGES_START: "Start loading images under data/",
	EDIT_PANE_IMAGES_START_END: " ...",
	EDIT_PANE_IMAGES_END: "Images loaded",
	EDIT_PANE_IMAGES_END_NO_RESULT: "No images found",
	EDIT_PANE_IMAGES_FIND_FAIL: " under data/",
	EDIT_PANE_IMAGES_SAVE_START: "Start transferring images ...",
	EDIT_PANE_IMAGES_OF: " of ",
	EDIT_PANE_IMAGES_TRASNFERRED: " image transferred",
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
	COVERTYPE_AUTO_CHOSEN: "Cover for this entry automatically chosen",
	QUEUE_START: "Loading queue resources ...",
	QUEUE_NO_RESULT: "No applicable queue resources found",
	QUEUE_IMAGES_NOT_LOADED: "Queue images not loaded because local photos were not shown",
	QUEUE_FOUND_TEXT: "Text data found",
	QUEUE_FOUND_IMAGES: " image(s) added",
	QUEUE_FOUND_VIDEOS: " video(s) added",
	QUEUE_FOUND_VOICES: " voice(s) added",
	QUEUE_FAILED: "Cannot find queue resources",
	QUEUE_END: "Queue resources loaded",
	NETWORK_WORKING: "Please wait until all network activities stop",
	OVERWRITE_CACHE_WARNING: "You have saved entry data. Either press confirm to overwrite or read it",
	GET_YEARS_START: "Loading year list ...",
	GET_YEARS_FAIL: "Cannot load year list. Trying again ..",
	GET_YEARS_END: "Year list loaded",
	YEAR_SWITCHED_TO: "Year switched to ",
	DATA_MOVED_TO_OTHER_YEAR: "Some data migrated to year ",
	DATA_MOVED_TO_OTHER_YEAR_END: ". Upload those data or they will be lost",
	CREATED_TIME_CHANGED_TO: "Created time for this entry changed to ",
	START_TIME_CHANGED_TO: "Start time for this entry changed to ",
	END_TIME_CHANGED_TO: "End time for this entry changed to ",
	TIME_NOT_IN_RANGE: "Time does not fit in this year",
	STATS_ENTRY_ALREADY_EXIST: "This entry is already added",
	STATS_ENTRY_EMPTY_STRING: "Invalid entry input",

	SERVER_RETURNS: ". The server returns error \"",
	SERVER_RETURNS_END: "\"",

	AUTH_REFRESH_ACCESS_START: "Refreshing access token ...",
	AUTH_REFRESH_ACCESS_END: "Access token refreshed",
	AUTH_REFRESH_ACCESS_FAILED: "Cannot refresh access token. Please make sure CORS is enabled",
	AUTH_REFRESH_AUTO_ON: "The access token will now be refreshed every 30 minute",
	AUTH_REFRESH_AUTO_OFF: "The access token will now stop refreshing",
	AUTH_REFRESH_EXPIRED: "Previous session expired"
};

animation.degree = 0;
animation.duration = 300;
animation.indent = 0;

animation.showIcon = function(selector, callback) {
	$(selector).fadeIn(animation.duration, callback).css({
		top: "10px",
		display: "inline-block"
	});
};
animation.hideIcon = function(selector, callback) {
	var length = $(selector).length - 1;
	$(selector).each(function(index) {
		// Test for the index of executed fadeout to avoid calling callback multiple time
		if (index !== length) {
			// Just fadeout, don't call callback
			$(this).fadeOut(animation.duration);
		} else {
			$(this).fadeOut(animation.duration, callback);
		}
	});
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
};

/**
 * Hides all the icon menus
 */
animation.hideAllMenus = function() {
	$(".actions > div").each(function() {
		// Iterate to remove class "fadein-inline"
		$(this).removeClass("fadein-inline");
	});
}
/**
 * Hides all the hidden icons that are not displayed by default
 * @returns {} 
 */
animation.hideHiddenIcons = function() {
	$(".actions .hidden-icon").each(function() {
		$(this).addClass("hidden");
	});
}

/**
 * Shows the root menu given the name. To get the list of the possible names, check the class name under <.actions> in index.html.
 * This function will add the menu display on the screen. To show only this list, use animation.showMenuOnly
 * @param {string} name - The name of the menu
 * @see animation.showMenuOnly
 */
animation.showMenu = function(name) {
	name = "#action-" + name;
	if ($(name).length === 0) {
		// Invaild name
		name = "#action-menu";
	}
	$(name).addClass("fadein-inline");
}
/**
 * Shows the root menu given the name. To get the list of the possible names, check the class name under <.actions> in index.html.
 * This function will hide all the other menus else. To add a new menu list, use animation.showMenu
 * @param {String} name - The name of the menu
 * @see animation.showMenu
 */
animation.showMenuOnly = function(name) {
	// Just hide the direct children that are not entry-option
	animation.hideAllMenus();
	animation.showMenu(name);
};
/**
 * Hides this menu
 * @param {string} name - The name of the menu to be hidden
 */
animation.hideMenu = function(name) {
	$(".actions > #" + name).removeClass("fadein-inline");
	animation.hideHiddenIcons();
}
/**
 * Shows or hides the icons that ask the user to read or abandon cached data according to if there is any cached data
 */
animation.testCacheIcons = function() {
	if (localStorage["_cache"] == 1) {
		// There is cache
		$("#reread").removeClass("hidden");
		$(".li-add-entry-sub").each(function() {
			$(this).addClass("has-sub");
		});
	} else {
		$("#reread").addClass("hidden");
		$(".li-add-entry-sub").each(function() {
			$(this).removeClass("has-sub");
		});
	}
}
/**
 * Tests the selected selector has any shown subs (i.e. not(.hidden)) and then add/remove has-sub on its parent `li`
 * @param {string} selector - The seletor to be tested
 */
animation.testSub = function(selector) {
	var hasChild = false;
	$(selector).siblings("ul").children("li").children("a").each(function() {
		if (!$(this).hasClass("hidden")) {
			// This is not hidden
			hasChild = true;
			return;
		}
	});
	// Add/remove `has-sub` according to `hasChild`
	if (hasChild) {
		$(selector).parent().addClass("has-sub");
	} else {
		$(selector).parent().removeClass("has-sub");
	}
}
/**
 * Tests the validity on UI for buttons with year switch, including adding/removing prev/next year button according to the position of `app.year` in `app.years`.
 */
animation.testYearButton = function() {
	var index = app.years.indexOf(app.year);
	if (index === -1) {
		// Invalid year
		app.yearUpdateTry(new Date().getFullYear());
		return;
	} else if (index === 0) {
		// The earliest year
		$("#prev-year").addClass("hidden");
		$("#next-year").removeClass("hidden");
	} else if (index === app.years.length - 1) {
		// "This" year
		$("#next-year").addClass("hidden");
		$("#prev-year").removeClass("hidden");
	} else {
		// Any situation else
		$("#next-year, #prev-year").removeClass("hidden");
	}
	animation.testSub("#this-year");
}

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
			$(this).html("&#xf05e").css({
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
 * Set the dim and auto-removal time at the first two lines of the function
 * @param {String} message - The message to be logged
 * @param {Number} indent - The indent parameter. 1 for indenting by one (effective after). -1 for dedenting by one (effective immediately)
 * @param {Number} type - The type of message. 0 for normal. 1 for error. 2 for warning.
 */
animation.log = function(message, indent, type) {
	/* The time of milliseconds since the emergence before the log square is dimmed */
	var dimTime = 10000,
	/** 
	 * The time of milliseconds since the emergence before the log square is removed
	 * To make sure the log square is removed, set the value larger than `dimTime` 
	 */
		removeTime = 15000;
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
	$(htmlContent).appendTo("#feedback").fadeTo(400, 1).mousedown(function() {
		$(this).slideUp(200, function() {
			$(this).remove();
		});
	}).hover(function() {
		$(this).fadeTo(400, 1);
	}).on("contextmenu", function() {
		// Right click to dismiss all
		$("#feedback p").each(function() {
			$(this).slideUp(200, function() {
				$(this).remove();
			});
		});
		return false;
	});
	switch (type) {
		case 1:
			message = "[ERR] " + message;
			break;
		case 2:
			message = "[!!!] " + message;
			// Deliberately miss the break token
		default:
			// Auto dim itself
			setTimeout(function() {
				$("p#" + id).fadeTo(400, .5);
			}, dimTime);
			// Auto remove itself
			setTimeout(function() {
				if ($("p#" + id).css("opacity") != 1) {
					$("p#" + id).trigger("mousedown");
				}
			}, removeTime);
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
 * @param {String} error - The error message
 * @param {Number} indent - The indent parameter. 1 for indenting by one (effective immediately). -1 for dedenting by one (effective after)
 */
animation.error = function(message, error, indent) {
	animation.log(message + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, indent, 1);
}
/**
 * Calls a warning message and display it on the screen
 * @param {String} message - The message to be logged
 * @param {String} error - The error message
 * @param {Number} indent - The indent parameter. 1 for indenting by one (effective immediately). -1 for dedenting by one (effective after)
 */
animation.warn = function(message,error, indent) {
	animation.log(message + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, indent, 2);
}
/**
 * Logs a debug message on the screen
 * Toggles the debug option by setting the variable at the beginning of this file
 * @param {String} message - The message to be logged
 */
animation.debug = function(message) {
	if (animation.isDebug) {
		animation.log("[DEBUG] " + message);
	}
}


