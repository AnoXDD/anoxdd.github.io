//region animation.js

/* A library for animations */

window.animation = {};

animation.isDebug = true;

window.log = {
    FILE_NOT_FOUND     : "Cannot find the file ",
    FILES_NOT_FOUND    : "Cannot find the list of files",
    FILE_NOT_LOADED    : "Cannot load the file ",
    DOWNLOAD_PROMPT    : ". Please make sure it has been downloaded",
    LOCATION_PIN_FAIL  : "Cannot find the current location. Please make sure you have enabled it or the browser does not support geocode",
    LOCATION_NO_RESULTS: "No results found",
    LOCATION_NO_ADDRESS: "Cannot read the address",
    NO_ENTRY_SELECTED  : "No entry is selected",
    LOAD_DATA_FAIL     : "Cannot load the data",
    NO_CONTENT         : ": no new content is specified",
    NO_ARCHIVE         : ": no archive data is found",
    FOLDER_CREATED     : "Folder for this date created",

    MEDIA_CLEAN_START              : "Start returning lost media ...",
    MEDIA_CLEAN_NO_DATA            : "No media found. Please press the button on the right to check the resource before returning lost media",
    MEDIA_CLEAN_NO_FILES           : "No media found",
    MEDIA_CLEAN_GET_FOLDERS_FAIL   : "Cannot get download available folder list",
    MEDIA_CLEAN_FOUND              : " lost media found",
    MEDIA_CLEAN_UNDEFINED_FOUND    : " undefined media found and cleaned",
    MEDIA_CLEAN_NOT_FOUND          : "No lost media found",
    MEDIA_CLEAN_UNDEFINED_NOT_FOUND: "No undefined media found",
    MEDIA_CLEAN_FAIL               : " media failed to be moved. Please try again",
    MEDIA_CLEAN_SUCCESS            : "All lost media moved to their original folder",

    ARCHIVE_START                     : "Loading archive list ...",
    ARCHIVE_TOO_MANY                  : "Too many archive files. Only the latest 500 files will be displayed",
    ARCHIVE_END                       : "Archive list loaded",
    ARCHIVE_INVALID_JSON              : "This archive is corrupted",
    ARCHIVE_SELECT_ALL                : "No archive is selected. All archives will be selected",
    ARCHIVE_NO_SELECTED               : "No archive is selected",
    ARCHIVE_NO_SELECTED_REMOVE        : "No archive is selected to be removed",
    ARCHIVE_NO_PROTECT_CHANGE         : "No archive's protection state changed",
    ARCHIVE_REMOVE_START              : "Removing selected archive file(s) ...",
    ARCHIVE_REMOVE_END                : " archive file(s) removed. To recover the files, visit OneDrive immediately and find them in the trash",
    ARCHIVE_REMOVE_FAIL               : "Cannot remove some files. Please try again",
    ARCHIVE_PROTECT_REMOVE            : "Removal for protected file \"",
    ARCHIVE_PROTECT_REMOVE_END        : "\" skipped",
    ARCHIVE_PROTECT_START             : "Toggling archive protection for selected files ...",
    ARCHIVE_PROTECT_CHANGE            : "Archive file \"",
    ARCHIVE_PROTECT_CHANGE_PROTECTED  : "\" protected",
    ARCHIVE_PROTECT_CHANGE_UNPROTECTED: "\" unprotected",
    ARCHIVE_PROTECT_FAIL              : "Cannot toggle archive protection of file \"",
    ARCHIVE_PROTECT_END               : "Archive protection toggle finished",

    CONTENTS_NEW                      : "Found new content with ",
    CONTENTS_NEW_END                  : " chars",
    CONTENTS_RELOADED                 : "Data reloaded",
    CONTENTS_DOWNLOAD_START           : "Loading archive data ...",
    CONTENTS_DOWNLOAD_TEXT            : "Text data loaded",
    CONTENTS_DOWNLOAD_TEXT_FAIL       : "Cannot load the text data",
    CONTENTS_DOWNLOAD_MEDIA_START     : "Loading media data ...",
    CONTENTS_DOWNLOAD_MEDIA_LOADED    : "Loaded ",
    CONTENTS_DOWNLOAD_MEDIA_OF        : " of ",
    CONTENTS_DOWNLOAD_MEDIA_FAIL      : "Cannot load the media data",
    CONTENTS_DOWNLOAD_MEDIA_END       : "Media data loaded",
    CONTENTS_DOWNLOAD_END             : "Data download finished",
    CONTENTS_UPLOAD_START             : "Start uploading archive data ...",
    CONTENTS_BACKUP_START             : "Start creating backups ...",
    CONTENTS_UPLOAD_BACKUP            : "Data backup finished",
    CONTENTS_UPLOAD_BACKUP_FAIL       : "Cannot backup archive data. Please see if there is any name conflict",
    CONTENTS_UPLOAD_REGISTER_FAIL     : "Cannot register folder for this year. Please try again later",
    CONTENTS_UPLOAD_END               : "Data upload finished for ",
    CONTENTS_UPLOAD_FAIL              : "Cannot upload data",
    CONTENTS_UPGRADING                : "Upgrading content data to latest version ...",
    COVER_PHOTO_FOUND                 : "Found cover photo ",
    COVER_PHOTO_FAIL                  : "Cannot find matched result for cover photo",
    AUDIO_DOWNLOAD_START              : "Loading audio files ...",
    AUDIO_DOWNLOAD_END                : "Audio files loaded",
    AUDIO_EXPIRED                     : "Audio file expired. Please re-download the media",
    VIDEO_DOWNLOAD_START              : "Loading video files ...",
    VIDEO_DOWNLOAD_END                : "Video files loaded",
    VIDEO_EXPIRED                     : "Video file expired. Please re-download the media",
    MEDIA_ALREADY_DISPLAYED           : "Another media is playing. Close that to continue",
    EDIT_PANE_QUIT                    : "Data discarded",
    EDIT_PANE_SAVE_START              : "Saving data ...",
    EDIT_PANE_SAVE_PENDING_ATTACHMENTS: "Pending changes saved",
    EDIT_PANE_SAVE_END                : "Finished saving data",
    TAG_ADD_HEADER                    : "Tag \"",
    TAG_ICON_ADD_HEADER               : "Icon \"",
    TAG_ADDED_ALREADY                 : "\" is already added",
    TAG_ADDED                         : "\" added",
    TAG_ADDED_FAILED                  : "\" cannot be added",
    TAG_REMOVED                       : "\" removed",
    EDIT_PANE_NOT_SWITCHABLE          : "Save or quit editing this entry to switch to another panel",
    EDIT_PANE_IMAGES_ALREADY_LOADED   : "Images have already been loaded",
    EDIT_PANE_IMAGES_FAIL             : "Cannot load images",
    EDIT_PANE_IMAGES_START            : "Start loading images under data/",
    EDIT_PANE_IMAGES_START_END        : " ...",
    EDIT_PANE_IMAGES_END              : "Images loaded",
    EDIT_PANE_IMAGES_END_NO_RESULT    : "No attached images found",
    EDIT_PANE_IMAGES_FIND_FAIL        : " under data/",
    EDIT_PANE_IMAGES_SAVE_START       : "Start transferring images ...",
    EDIT_PANE_IMAGES_OF               : " of ",
    EDIT_PANE_IMAGES_TRASNFERRED      : " image transferred",
    EDIT_PANE_FINISHED_TRANSFER       : "Finished ",
    EDIT_PANE_FINISHED_TRANSFER_END   : " transfer",
    EDIT_PANE_TRANSFERRED_FAILED      : "One transfer failed. No transfer was made",
    EDIT_PANE_TOO_MANY_RESULTS        : "There seems to be so many items. Not all the items will be displayed",
    EDIT_PANE_WEATHER_START           : "Loading weather info ...",
    EDIT_PANE_WEATHER_RESULT          : "Weather data loaded. It is ",
    EDIT_PANE_WEATHER_RESULT_END      : " degrees. Have a good one",
    EDIT_PANE_WEATHER_END             : "Weather data updated",
    EDIT_PANE_WEATHER_END_FAIL        : "Cannot find the matched icon info. Is it \"",
    EDIT_PANE_WEATHER_END_FAIL_END    : "\" now?",
    EDIT_PANE_PLAYABLE_SEARCH_START   : "Loading resource ...",
    EDIT_PANE_PLAYABLE_FILE           : " file \"",
    EDIT_PANE_PLAYABLE_FILE_ADDED     : "\" added",
    EDIT_PANE_PLAYABLE_FILE_SAVED     : "\" transferred",
    EDIT_PANE_PLAYABLE_SEARCH_END     : "Resource loaded",
    EDIT_PANE_PLAYABLE_SEARCH_FAILED  : "Cannot load the resource",
    EDIT_PANE_PLAYABLE_SAVE_START     : "Start transferring ",
    EDIT_PANE_PLAYABLE_SAVE_START_END : "s ...",
    COVERTYPE_AUTO_CHOSEN             : "Cover for this entry automatically chosen",
    QUEUE_START                       : "Loading queue resources ...",
    QUEUE_NO_RESULT                   : "No applicable queue resources found",
    QUEUE_IMAGES_NOT_LOADED           : "Queue images not loaded because local photos were not shown",
    QUEUE_FOUND_TEXT                  : "Text data found",
    QUEUE_FOUND_IMAGES                : " image(s) added",
    QUEUE_FOUND_VIDEOS                : " video(s) added",
    QUEUE_FOUND_VOICES                : " voice(s) added",
    QUEUE_FAILED                      : "Cannot find queue resources",
    QUEUE_END                         : "Queue resources loaded",
    NETWORK_WORKING                   : "Please wait until all network activities stop",
    OVERWRITE_CACHE_WARNING           : "You have saved entry data. Either press confirm to overwrite or read it",
    GET_YEARS_START                   : "Loading year list ...",
    GET_YEARS_FAIL                    : "Cannot load year list. Trying again ..",
    GET_YEARS_END                     : "Year list loaded",
    YEAR_SWITCHED_TO                  : "Year switched to ",
    DATA_MOVED_TO_OTHER_YEAR          : "Some data migrated to year ",
    DATA_MOVED_TO_OTHER_YEAR_END      : ". Upload those data or they will be lost",
    CREATED_TIME_CHANGED_TO           : "Created time for this entry changed to ",
    START_TIME_CHANGED_TO             : "Start time for this entry changed to ",
    END_TIME_CHANGED_TO               : "End time for this entry changed to ",
    TIME_NOT_IN_RANGE                 : "Time does not fit in this year",
    TIME_INVALID                      : "Invalid time format",
    STATS_ENTRY_ALREADY_EXIST         : "This entry is already added",
    STATS_ENTRY_EMPTY_STRING          : "Invalid entry input",

    SERVER_RETURNS    : " [Error ",
    SERVER_RETURNS_END: "]",

    AUTH_REFRESH_ACCESS_START : "Refreshing access token ...",
    AUTH_REFRESH_ACCESS_END   : "Access token refreshed",
    AUTH_REFRESH_ACCESS_FAILED: "Cannot refresh access token. Please make sure CORS is enabled",
    AUTH_REFRESH_AUTO_ON      : "The access token will now be refreshed every 30 minute",
    AUTH_REFRESH_AUTO_OFF     : "The access token will now stop refreshing",
    AUTH_REFRESH_EXPIRED      : "Previous session expired",

    BULB_STILL_BUSY          : "Still processing the bulbs",
    BULB_NO_CONTENT_AVAILABLE: "No bulbs available",
    BULB_FETCH_START         : "Loading bulbs ...",
    BULB_FETCH_END           : "Bulbs loaded. Failed: ",
    BULB_FETCH_CONTENT_START : "Fetching bulb contents ...",
    BULB_PROCESSED_LEFT      : " bulbs processed. Left: ",
    BULB_REMOVE_MERGED_START : "Cleaning data on OneDrive ...",
    BULB_FETCH_FINAL_END     : "Done integrating bulbs",
};

animation.degree = 0;
animation.duration = 300;
animation.indent = 0;

animation.showIcon = function(selector, callback) {
    $(selector).fadeIn(animation.duration, callback).css({
        top    : "10px",
        display: "inline-block"
    });
};
animation.hideIcon = function(selector, callback) {
    var length = $(selector).length - 1;
    $(selector).each(function(index) {
        // Test for the index of executed fadeout to avoid calling callback
        // multiple time
        if (index !== length) {
            // Just fadeout, don't call callback
            $(this).fadeOut(animation.duration);
        } else {
            $(this).fadeOut(animation.duration, callback);
        }
    });
};
animation.isShown = function(selector) {
    return $(selector).css("top") === "10px" && $(selector)
            .css("display") !== "none";
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
 * Hides this menu
 * @param {string} name - The name of the menu to be hidden
 */
animation.hideMenu = function(name) {
    $("#action-" + name).removeClass("fadein-inline");
    animation.hideHiddenIcons();
}
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
 * Shows the root menu given the name. To get the list of the possible names,
 * check the class name under <.actions> in index.html. This function will add
 * the menu display on the screen. To show only this list, use
 * animation.showMenuOnly
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
 * Shows the root menu given the name. To get the list of the possible names,
 * check the class name under <.actions> in index.html. This function will hide
 * all the other menus else. To add a new menu list, use `animation.showMenu`.
 * To show the main menu, `name` == "menu" returns true
 * @param {String} name - The name of the menu
 * @see animation.showMenu
 */
animation.showMenuOnly = function(name) {
    // Just hide the direct children that are not entry-option
    animation.hideAllMenus();
    animation.showMenu(name);
};
/**
 * Shows or hides the icons that ask the user to read or abandon cached data
 * according to if there is any cached data
 */
animation.testCacheIcons = function() {
    if (localStorage["_cache"]) {
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
 * Tests the selected selector has any shown subs (i.e. not(.hidden)) and then
 * add/remove has-sub on its parent `li`
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
 * Tests the validity on UI for buttons with year switch, including
 * adding/removing prev/next year button according to the position of
 * `app.year` in `app.years`.
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

/**
 * Tests the sub-ility of all the menus that should have been tested
 */
animation.testAllSubs = function() {
    animation.testCacheIcons();
    animation.testSub("#add");
    animation.testSub("#action-stats");
    animation.testYearButton();
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
                background : "#fff",
                "font-size": "inherit"
            });
        }).fadeIn(300).delay(500).fadeOut(300, function() {
            $(this).html(text).css({
                background : "",
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
                color     : "#000",
                background: "#fff"
            });
        }).fadeIn(300).delay(500).fadeOut(300, function() {
            $(this).html(text).css({
                background: "",
                color     : ""
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
 * @param {Number} indent - The indent parameter. 1 for indenting by one
 *     (effective after). -1 for dedenting by one (effective immediately)
 * @param {Number} type - The type of message. 0 for normal. 1 for error. 2 for
 *     warning.
 */
animation.log = function(message, indent, type) {
    /* The time of milliseconds since the emergence before the log square is dimmed */
    var dimTime = 10000,
        /**
         * The time of milliseconds since the emergence before the log square
         * is removed To make sure the log square is removed, set the value
         * larger than `dimTime` Also, this has to be updated with .css file.
         * Look up for @keyframes fadein-feedback
         */
        removeTime = 10000;
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
    var parent = "#feedback";
    switch (type) {
        case 0:
            htmlContent = "<p class=\"" + tabClass + "\" id=" + id + ">" + message + "</p>";
            break;
        case 1:
            // Clear the data there first
            htmlContent = "<p class=\"" + tabClass + " error\" id=" + id + ">" + message + "</p>";
            break;
        case 2:
            htmlContent = "<p class=\"" + tabClass + " warning\" id=" + id + ">" + message + "</p>";
            break;
        default:
            htmlContent = "<p class=\"" + tabClass + "\" id=" + id + ">" + message + "</p>";
    }

    // Clear any existing bubbles
    $(parent).empty();

    $(htmlContent).prependTo(parent).on("contextmenu", function() {
        // Right click to dismiss all
        $(parent).fadeOut(200, function() {
            $(this).empty();
            $(this).fadeIn(0);
        });
        return false;
    }).mousedown(function() {
        // One click to dismiss all
        $(this).fadeOut(200, function() {
            $(this).remove();
        });
    });
    switch (type) {
        case 1:
            message = "[ERR] " + message;
            break;
        case 2:
            message = "[!!!] " + message;
            break;
    }
    // Auto remove itself
    setTimeout(function() {
        $("#" + id).trigger("mousedown");
    }, removeTime);
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
 * @param {Number} indent - The indent parameter. 1 for indenting by one
 *     (effective immediately). -1 for dedenting by one (effective after)
 */
animation.error = function(message, error, indent) {
    if (error != undefined) {
        // Sometimes the error can be empty, but still it is an error
        if (error === "") {
            error = "unknown";
        }
        animation.log(message + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END,
            indent,
            1);
    } else {
        animation.log(message, indent, 1);
    }
}
/**
 * Calls a warning message and display it on the screen
 * @param {String} message - The message to be logged
 * @param {String} error - The error message
 * @param {Number} indent - The indent parameter. 1 for indenting by one
 *     (effective immediately). -1 for dedenting by one (effective after)
 */
animation.warn = function(message, error, indent) {
    if (error != undefined) {
        animation.log(message + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END,
            indent,
            2);
    } else {
        animation.log(message, indent, 2);
    }
}
/**
 * Logs a debug message on the screen
 * Toggles the debug option by setting the variable at the beginning of this
 * file
 * @param {String} message - The message to be logged
 */
animation.debug = function(message, indent) {
    if (animation.isDebug) {
        animation.log("[DEBUG] " + message, indent);
    } else {
        // Just process the indentation
        animation.indent += indent;
    }
}
/**
 * Switches from this panel to another panel, given the name
 * @param {string} name - The name of the panel to be switched to
 */
animation.switch = function(name) {
    // Test if edit pane is displayed
    if (edit.isEditPaneDisplayed) {
        animation.error(log.EDIT_PANE_NOT_SWITCHABLE);
        // Content currently being displayed, abort
        return;
    }
    // Gets the panel that is currently displayed
    var current;
    $("#drawer li").each(function(parameters) {
        if ($(this).hasClass("display")) {
            // This content is currently displayed
            current = $(this).attr("id");
            $(this).removeClass("display");
        }
    });
    // Directly stop processing if this panel has already been displayed
    if (current.indexOf(name) !== -1) {
        // This panel is currently displayed
        return;
    }
    if (current === "drawer-archive") {
        archive.quit();
    } else if (current === "drawer-stats") {
        stats.quit();
    }
    // Go to the menu
    if (name === "archive") {
        archive.init();
    } else if (name === "stats") {
        stats.init();
    }
    // Add display
    $("#drawer-" + name).addClass("display");
}


//endregion

/*****************************************************************************
 *
 *
 *
 *
 *                                  animation.js
 *
 *
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 *
 *
 *
 *                                  edit.js
 *
 *
 *
 *
 *****************************************************************************/

//region edit.js

/* The script for editing anything */

window.edit = {};
/* The index of the entry being edited. Set to -1 to save a new entry */
edit.time = 0;
edit.intervalId = -1;
edit.confirmVal = "";
edit.currentEditing = -1;

edit.photos = [];
edit.voices = [];
edit.videos = [];

edit.mediaIndex = {};
edit.isEditing = -1;
/** If /data has this folder */
edit.isFolder = false;
/** The name of the folder mentioned above */
edit.folderDate = "";
edit.isEditPaneDisplayed = false;

/** The list to auto-correct the tag, in the format of [wrong tag]: [correct tag] */
edit.autoCorrectTags = {
    "thought": "thoughts",
    "mc"     : "minecraft",
    "pool"   : "snooker"
};
edit.removalList = {};

edit.localChange = [];

edit.mediaList = ["images", "music", "book", "movie", "video", "voice", "weblink", "place"];

edit.isProcessing = false;

/******************************************************************
 ********************** INIT & QUIT *******************************
 ******************************************************************/

/**
 * Initializes the edit pane
 * localStorage["created"] will be used to track the entry being edited
 * @param {boolean} overwrite - Determines whether or not to create a new entry
 *     (overwrite previously stored info)
 * @param {number} index - The index of the archive data (optional)
 */
edit.init = function(overwrite, index) {
    /* Iterator */
    var i;
    // Sometimes the user just presses the edit button without quitting the
    // audioPlayer elsewhere
    app.audioPlayer.quit();
    app.videoPlayer.quit();
    // Disable fixed height
    app.videoPlayer.height = "-webkit-calc(100% - 32px)";
    ////console.log("edit.init(" + overwrite + ", " + index + ")");
    edit.editView = _.template($("#edit-view").html());
    var data;

    // Test if there are cached data
    if (localStorage["_cache"]) {
        // There is cache
        if (overwrite === true) {
            edit.cleanEditCache();
            if (index != undefined && index !== -1) {
                // This entry modifies an existing entry
                data = journal.archive.data[app.year][index];
                if (data["time"]) {
                    if (data["time"]["created"]) {
                        localStorage["created"] = data["time"]["created"];
                    }
                    if (data["time"]["start"]) {
                        localStorage["start"] = data["time"]["start"];
                    }
                }
            }
        } else if (overwrite === false) {
            // Read from available caches
            if (localStorage["created"]) {
                index = edit.find(localStorage["created"]);
                if (index !== -1) {
                    data = journal.archive.data[app.year][index];
                }
            } else {
                // Nothing found, start a new one
                // Placeholder
                ;
            }
        } else if (overwrite == undefined) {
            // Do not overwrite or overwrite is undefined
            animation.warn(log.OVERWRITE_CACHE_WARNING);
            animation.testAllSubs();
            return;
        }
    } else {
        if (index != undefined) {
            data = journal.archive.data[app.year][index];
        }
    }
    // If still no available data to be stored, create a new one
    data = edit.data = data || edit.newContent();
    if (localStorage["start"] || localStorage["created"]) {
        localStorage["start"] = localStorage["start"] || localStorage["created"];
    }

    // Now you have caches anyway
    localStorage["_cache"] = 1;
    edit.mediaIndex = {
        place  : -1,
        music  : -1,
        book   : -1,
        movie  : -1,
        weblink: -1,
        video  : -1,
        voice  : -1
    };
    edit.isEditing = -1;
    edit.isFolder = false;
    edit.folderDate = "";
    // Add to cache, all the cache processing starts here
    data = edit.importCache(data);
    // Process edit.voices and edit.videos
    edit.photos = [];
    edit.videos = [];
    edit.voices = [];
    var processGroup = ["video", "voice"];
    for (var h = 0; h !== processGroup.length; ++h) {
        var dataGroup;
        if (processGroup[h] === "video") {
            dataGroup = edit.videos;
        } else if (processGroup[h] === "voice") {
            dataGroup = edit.voices;
        } else {
            break;
        }
        if (data[processGroup[h]]) {
            for (i = 0; i !== data[processGroup[h]].length; ++i) {
                var name = data[processGroup[h]][i]["fileName"];
                if (journal.archive.map[name]) {
                    dataGroup.push({
                        name    : name,
                        title   : data[processGroup[h]][i]["title"],
                        size    : journal.archive.map[name]["size"],
                        id      : journal.archive.map[name]["id"],
                        resource: true,
                        change  : false
                    });
                }
            }
        }
    }
    console.log(Object.keys(data));
    var editPane = $(edit.editView(data));

    // Content processing
    $("#search-new, #search-result").fadeOut();
    // Initialize the contents
    $("#contents").fadeOut(400, function() {
        /* Iterator */
        var i;
        // Initialize the pane, this line must be the first one!
        $("#edit-pane").html(editPane).fadeIn();
        edit.isEditPaneDisplayed = true;
        // Hide photo preview panal
        $("#photo-preview").hide();
        // Enter to finish entry header
        $("#entry-header").bind("keyup", "return", function() {
                edit.saveTitle();
                // Jump to the body
                $("#entry-body").focus();
            })
            // Ctrl+enter to disable header date check
            .bind("keyup", "ctrl+return", function() {
                // Do so to avoid adding time header
                edit.saveTitle();
                edit.notAddHeader = true;
                // Jump to the body
                $("#entry-body").focus();
            })
            .blur(function() {
                // This header has lost its focus. Test if needed to add a date
                // header
                if (edit.notAddHeader) {
                    // Do not add a header, but set it back to false
                    edit.notAddHeader = false;
                } else {
                    // Yes, then test its date string validity
                    var dateStr = $(this).val().substring(0, 6),
                        date;
                    if (!isNaN(parseInt(dateStr))) {
                        var dateNum = edit.convertTime(dateStr);
                        // Re-evaluate the month, day and the year to make sure
                        // it IS a true date
                        date = new Date(dateNum);
                        var isMonthMatch = date.getMonth() + 1 == dateStr.substring(
                                0,
                                2),
                            isDayMatch = date.getDate() == dateStr.substring(2,
                                    4),
                        // Has to match both original year in title and
                        // `app.year`
                            isYearMatch = date.getFullYear() % 100 == dateStr.substring(
                                    4,
                                    6) || date.getFullYear() === app.year;
                        if (isMonthMatch && isDayMatch && isYearMatch) {
                            // Everything matches, good work user
                            return;
                        }
                    }
                    // If this function has not been returned, then the header
                    // does not have a valid date header
                    date = new Date().getTime();
                    date = new Date(date - 14400000);
                    $(this)
                        .val(edit.format(date.getMonth() + 1) + edit.format(date.getDate()) + edit.format(
                                date.getFullYear() % 100) + " " + $(this)
                                .val());
                }
            });
        // Enter to add tag
        $("#entry-tag").keyup(function(n) {
            if (n.keyCode === 13) {
                edit.addTag();
                // Clean the entry
                $("#entry-tag").val("");
            }
        });
        // Click to remove tags
        $("#attach-area .texttags .other p").click(function() {
            edit.removeTag($(this).text().substring(1));
        });
        // Hover to show the time of created, started and ended
        $("#entry-time-wrap").mouseover(function() {
            var created = parseInt(localStorage["created"]) || data["time"]["created"],
                start = parseInt(localStorage["start"]) || data["time"]["start"],
                end = parseInt(localStorage["end"]) || data["time"]["end"],
                convertTime = function(date) {
                    date = new Date(date);
                    if (!isNaN(date.getTime())) {
                        return edit.format(date.getMonth() + 1) + edit.format(
                                date.getDate()) + edit.format(date.getFullYear() % 100) + " " + edit.format(
                                date.getHours()) + edit.format(date.getMinutes());
                    } else {
                        return "-";
                    }
                };
            $("#entry-time-created").html(convertTime(created));
            $("#entry-time-start").html(convertTime(start));
            $("#entry-time-end").html(convertTime(end));
        });
        // Update cover photo for music, book and movie
        var elem = ["music", "book", "movie"];
        for (i = 0; i !== elem.length; ++i) {
            var medium = elem[i];
            for (var j = 0; j !== $("#attach-area ." + medium).length; ++j) {
                var selectorHeader = edit.getSelectorHeader(medium, j),
                    term = $(selectorHeader + ".title").val() + "%20" + $(
                            selectorHeader + ".desc").val();
                getCoverPhoto(selectorHeader, term, false, medium);
            }
        }
        if (localStorage["title"]) {
            $("#entry-header").val(localStorage["title"]);
        }
        if (localStorage["body"]) {
            $("#entry-body").text(localStorage["body"]);
        }
        // Covertype processing
        if (localStorage["coverType"]) {
            var cover = -1;
            switch (parseInt(localStorage["coverType"])) {
                case 128:
                    ++cover;
                case 16:
                    ++cover;
                case 32:
                    ++cover;
                case 4:
                    ++cover;
                case 8:
                    ++cover;
                case 64:
                    ++cover;
                case 2:
                    ++cover;
                case 1:
                    ++cover;
                default:
                // Invalid cover type, just do nothing
            }
            edit.coverSet(cover);
        }
        // Tag processing
        var tagsHtml = app.tag().getIconsInHtml(),
            tagsName = app.tag().getIconsInName(),
        /* The array of html names for highlighted icons */
            iconTags = app.tag().separate(localStorage["tags"]).iconTags;
        for (i = 0; i !== tagsHtml.length; ++i) {
            var parent = "#attach-area .icontags";
            if (tagsHtml[i].charAt(0) === "w") {
                parent += " .weather";
            } else if (tagsHtml[i].charAt(0) === "e") {
                parent += " .emotion";
            } else {
                parent += " .unselected";
            }
            // Processed existed tags
            $(parent).append(
                "<span class='icons " + tagsHtml[i] +
                "' title=" + tagsName[i].capitalize() +
                " onclick=edit.toggleTag('" + tagsName[i] +
                "',true)></span>");
        }
        // In this loop, show some icons (so some icons can disappear)
        for (i = 0; i !== tagsHtml.length; ++i) {
            if (iconTags.indexOf(tagsHtml[i]) !== -1) {
                edit.toggleIcon(tagsName[i]);
            }
        }
        // Bind hotkeys to add tags
        // If you want to use more than one modifier (e.g. alt+ctrl+z) you
        // should define them by an alphabetical order e.g. alt+ctrl+shift
        $("#entry-body").bind("keyup", "return", function() {
                // Add tab(s) if the previous line has any
                var start = $(this).get(0).selectionStart,
                    end = $(this).get(0).selectionEnd,
                    body = $(this).val(),
                    lastReturn = body.lastIndexOf("\n", start - 2),
                    lastTab = body.lastIndexOf("\t", start - 2);
                if (lastReturn < lastTab) {
                    // There is last tab
                    var newBody;
                    if (lastTab === start - 2) {
                        // The user enters "return" after an empty line
                        // prepended with tab(s), assumed to dismiss the tab(s)
                        newBody = body.substring(0, lastReturn + 1);
                        start = lastReturn;
                    } else {
                        newBody = body.substring(0, start);
                        // Get the number of valid consecutive tabs and append
                        // them
                        for (i = lastReturn + 1;
                             i !== lastTab + 1 && body[i] === "\t";
                             ++i) {
                            newBody += "\t";
                        }
                    }
                    newBody += body.substring(end);
                    $(this).val(newBody);
                    // Put caret at right position again
                    $(this).get(0).selectionStart = $(this)
                        .get(0).selectionEnd = start + 1;
                }
                edit.processBody();
            })
            .bind("keyup", "space", function() {
                edit.refreshSummary();
            })
            .bind("keydown", "tab", function(e) {
                e.preventDefault();
                var start = $(this).get(0).selectionStart,
                    end = $(this).get(0).selectionEnd;

                // Set textarea value to text before caret + tab + text after
                // caret
                $(this)
                    .val($(this).val().substring(0, start) + "\t" + $(this)
                            .val()
                            .substring(end));

                // Put caret at right position again
                $(this).get(0).selectionStart = $(this)
                    .get(0).selectionEnd = start + 1;
            })
            .bind("keyup", "ctrl+shift+f", function() {
                edit.toggleTag("friendship");
            })
            .bind("keyup", "alt+ctrl+r", function() {
                edit.toggleTag("relationship");
            })
            .bind("keyup", "alt+ctrl+i", function() {
                edit.toggleTag("ingress");
            })
            .bind("keyup", "alt+ctrl+t", function() {
                edit.toggleTag("thoughts");
            })
            .bind("keyup", "alt+ctrl+j", function() {
                edit.toggleTag("journal");
            })
            .bind("keyup", "alt+ctrl+m", function() {
                edit.toggleTag("minecraft");
            });
        // Let the tags to scroll horizontally
        $("#edit-pane #attach-area .icontags .other, #edit-pane #attach-area .texttags .other, #edit-pane #attach-area .images")
            .mousewheel(function(event, delta) {
                // Only scroll horizontally
                this.scrollLeft -= (delta * 50);
                event.preventDefault();
            });
        // Right click to select videos and voices
        edit.playableSetToggle();
        edit.refreshSummary();
    });
    animation.showMenuOnly("add");
    edit.intervalId = setInterval(edit.refreshTime, 1000);
};
edit.quit = function(selector, save) {
    if (network.isAjaxActive) {
        // Do not quit if network is still working
        animation.warning(log.NETWORK_WORKING);
        return;
    }
    clearInterval(edit.intervalId);
    edit.time = 0;
    edit.mediaIndex = {};
    edit.localChange = [];
    if (save) {
        // Save to local contents
        edit.save(selector);
    } else {
        animation.debug(log.EDIT_PANE_QUIT);
    }
    edit.photos = [];
    edit.removalList = {};
    // Set everything to initial state
    edit.cleanupMediaEdit();
    // Content processing
    $("#search-new, #search-result").fadeIn();
    $("#edit-pane").fadeOut(400, function() {
        edit.isEditPaneDisplayed = false;
        // Remove the edit pane
        $("#edit-pane").html("");
        $("#contents").fadeIn();
        // Reload
        app.refresh();
        animation.showMenuOnly("edit");
    });
    // Clean cache anyway
    edit.cleanEditCache();
    // Test if there is any cache
    animation.testCacheIcons();
    // Reset videoplayer's heiht
    app.videoPlayer.height = undefined;
    delete localStorage["_cache"];
};
/**
 * Saves cache for edit-pane to journal.archive.data
 * @param {string} selector - The selector to show the finished animation
 */
edit.save = function() {
    if (network.isAjaxActive) {
        // Do not save if network is still working
        animation.warn(log.NETWORK_WORKING);
        return;
    }
    var id;
    animation.log(log.EDIT_PANE_SAVE_START, 1);
    network.init(3);
    if (animation.isShown("#action-remove-confirm")) {
        // Confirm button will be pressed automatically if shown
        animation.debug(log.EDIT_PANE_SAVE_PENDING_ATTACHMENTS);
        edit.confirm();
    }
    edit.processRemovalList();
    // Save photos, voices and videos
    edit.photoSave(function() {
        network.init();
        edit.playableSave(1, function() {
            network.init();
            edit.playableSave(3, function() {
                network.init();
                clearInterval(id);
                var index = edit.find(localStorage["created"]);
                edit.saveTitle();
                edit.processBody();
                edit.exportCache(index);
                edit.sortArchive();
                edit.removeDuplicate();
                journal.archive.data[app.year] = edit.minData();
                edit.saveDataCache();
                $("#add-save-local").html("&#xf0c7").attr({
                    onclick: "edit.save()",
                    href   : "#"
                });
                // Show finish animation
                animation.finished("#add-save-local");
                animation.log(log.EDIT_PANE_SAVE_END, -1);
                network.destroy();
                // Upload the file to OneDrive
                uploadSingleFile();
            });
        });
    });
};
/**
 * Processes removal list to do the final cleanup of contents
 */
edit.processRemovalList = function() {
    for (var key = 0; key < edit.removalList.length; ++key) {
        if (localStorage[key]) {
            var data = JSON.parse(localStorage[key]);
            for (var i = 0; i < edit.removalList[key].length; ++i) {
                data.splice(edit.removalList[key][i], 1);
            }
            localStorage[key] = JSON.stringify(data);
        }
    }
};

/******************************************************************
 **************************** CACHE *******************************
 ******************************************************************/

/**
 * Syncs between the local and caches. Local cache will overwrite data if there
 * is
 * @param {object} data - The data clip of entry to be processed
 */
edit.importCache = function(data) {
    // Title
    if (localStorage["title"]) {
        data["title"] = localStorage["title"];
    } else if (data["title"]) {
        localStorage["title"] = data["title"];
    }
    // Body
    if (localStorage["body"]) {
        if (!data["text"]) {
            data["text"] = {};
        }
        data["text"]["body"] = localStorage["body"];
    } else {
        if (data["text"]) {
            if (data["text"]["body"]) {
                localStorage["body"] = data["text"]["body"];
            }
        }
    }
    // created is not modifiable from user-side
    localStorage["created"] = data["time"]["created"];
    // tags
    if (localStorage["tags"]) {
        data["tags"] = localStorage["tags"];
    } else {
        localStorage["tags"] = data["tags"] ? data["tags"] : "";
    }
    // photos, video, place, music, book, movie
    var elem = edit.mediaList;
    for (var i = 0; i !== elem.length; ++i) {
        var medium = elem[i];
        if (localStorage[medium]) {
            data[medium] = JSON.parse(localStorage[medium]);
        } else {
            localStorage[medium] = data[medium] ? JSON.stringify(data[medium]) : "[]";
        }
    }
    // Cover
    localStorage["coverType"] = data["coverType"] || 0;
    // Return value
    return data;
};

edit.exportCache = function(index) {
    var data = journal.archive.data[app.year][index] || {};

    // Process body from cache
    data = edit.exportCacheBody(data);

    // Force the program to reload it
    data["processed"] = 0;
    // Title
    data["title"] = localStorage["title"] || "Untitled";
    data["tags"] = localStorage["tags"] || "";

    data["coverType"] = parseInt(localStorage["coverType"]);
    if (data["coverType"] <= 0) {
        data["coverType"] = edit.coverAuto();
    }
    if (!data["attachments"]) {
        data["attachments"] = 0;
    }
    var media,
        elem = edit.mediaList,
        attach = 0;
    for (var i = 0; i < elem.length; ++i) {
        media = localStorage[elem[i]] ? JSON.parse(localStorage[elem[i]]) : [];
        for (var j = 0; j < media.length; ++j) {
            if (!media[j] || media[j]["title"] == "") {
                // null or undefined or empty title, remove this
                media.splice(j--, 1);
            }
        }
        data[elem[i]] = media.length == 0 ? undefined : media;
        if (media.length == 0) {
            // Empty content
            data[elem[i]] = undefined;
        } else {
            // Change the attachment
            attach = attach | Math.pow(2, i);
            data[elem[i]] = media;
        }
    }
    data["attachments"] = attach;

    if (index < 0) {
        // Create a new entry
        journal.archive.data[app.year].push(data);
    } else {
        // Modify the new one
        journal.archive.data[app.year][index] = data;
        app.currentDisplayed = -1;
    }
};
/**
 * Reads the cache and process metadata about the text body
 * @param {object} data - The data clip of entry to be processed
 * @returns {object} data - Processed data
 */
edit.exportCacheBody = function(data) {
    if (!data["time"]) {
        data["time"] = {};
    }
    data["time"]["created"] = parseInt(localStorage["created"]);
    // Get the result from user-defined data
    var timeGroup = ["cretaed", "start", "end"];
    for (var i = 0; i !== timeGroup.length; ++i) {
        if (localStorage[timeGroup[i]] === "undefined") {
            delete localStorage[timeGroup[i]];
        }
    }
    if (edit.data && localStorage) {
        data["time"]["created"] = parseInt(localStorage["created"]) || data["time"]["created"];
        data["time"]["start"] = parseInt(localStorage["start"]) || data["time"]["start"];
        data["time"]["end"] = parseInt(localStorage["end"]) || data["time"]["end"];
    }
    // Test if begin and end time is overwritten
    if (!data["text"]) {
        data["text"] = {};
    }
    var body = localStorage["body"];
    // Sometimes the body can be empty
    body = body || "";
    // Remove last several returns at the end
    while (body[body.length - 1] === "\n") {
        body = body.substr(0, body.length - 1);
    }
    data["text"]["body"] = body;
    data["text"]["chars"] = body.length;
    data["text"]["lines"] = body.split(/\r*\n/).length;
    data["text"]["ext"] = body.substring(0, 50);
    return data;
};
edit.cleanEditCache = function() {
    delete localStorage["_cache"];
    var deleteList = ["title", "body", "created", "currentEditing", "tags", "place", "music", "movie", "book", "images", "weblink", "video", "voice", "start", "end"];
    for (var i = 0; i !== deleteList.length; ++i) {
        delete localStorage[deleteList[i]];
    }
    edit.photos = [];
    edit.voices = [];
    edit.videos = [];
};

/**
 * Saves only the data in journal.archive.data of this year to cache
 */
edit.saveDataCache = function() {
    if (app.year === new Date().getFullYear()) {
        // Only cache the data of this year
        localStorage["archive"] = JSON.stringify(journal.archive.data[app.year]);
        localStorage["lastUpdated"] = new Date().getTime();
    }
};

/**
 * Cleans the cache for journal.archive.data
 */
edit.removeDataCache = function() {
    delete localStorage["archive"];
};
/**
 * Tries to read journal.archive.data from cache and then copy it to
 * journal.archive.data
 */
edit.tryReadCache = function() {
    if (localStorage["archive"]) {
        // Seems that there is available data
        journal.archive.data[new Date().getFullYear()] = JSON.parse(localStorage["archive"]);
        app.refresh();
    }
};

/******************************************************************
 **************************** DATA ********************************
 ******************************************************************/

/**
 * Returns the index of data with a time specifed
 * @param {string/number} created - The created time of entry to be searched
 * @returns {number} - The index of data, -1 if not found
 */
edit.find = function(created) {
    for (var key = 0, len = journal.archive.data[app.year].length;
         key != len;
         ++key) {
        if (journal.archive.data[app.year][key]) {
            if (journal.archive.data[app.year][key]["time"]) {
                if (journal.archive.data[app.year][key]["time"]["created"] == created) {
                    return key;
                }
            }
        }
    }
    // Nothing found
    return -1;
};
/**
 * Returns an empty content object array entry
 */
edit.newContent = function() {
    var dict = {};
    // Set created time
    dict["time"] = {};
    dict["time"]["created"] = new Date().getTime();
    dict["tags"] = "";
    // photos, video, place, music, book, movie
    var elem = ["images", "video", "voice", "place", "music", "book", "movie", "weblink", "iconTags", "textTags"];
    for (var i = 0; i !== elem.length; ++i) {
        dict[elem[i]] = undefined;
    }
    return dict;
};
/**
 * Minimizes the data, remove unnecessary tags
 */
edit.minData = function() {
    var tmp = journal.archive.data[app.year].filter(function(key) {
        return key != undefined;
    });
    for (var key = 0, len = tmp.length; key !== len; ++key) {
        // !!! Please keep the items to be removed sorted !!! //
        delete tmp[key]["attached"];
        delete tmp[key]["contents"];
        delete tmp[key]["chars"];
        delete tmp[key]["datetime"];
        delete tmp[key]["endtime"];
        delete tmp[key]["ext"];
        delete tmp[key]["index"];
        delete tmp[key]["iconTags"];
        delete tmp[key]["isBulb"];
        delete tmp[key]["lines"];
        delete tmp[key]["month"];
        delete tmp[key]["processed"];
        delete tmp[key]["summary"];
        delete tmp[key]["textTags"];
        delete tmp[key]["type"];
        // Remove undefined object
        var i;
        for (i = 0; i < tmp[key].length; ++i) {
            if (tmp[key][i] == undefined || tmp[key][i] == "undefined") {
                // Splice this key and also decrement i
                tmp[key].splice(i--, 1);
            }
        }
        // Remove thumb data
        var groups = ["movie", "music"];
        for (i = 0; i !== groups.length; ++i) {
            if (tmp[key][groups[i]]) {
                var keys = Object.keys(tmp[key][groups[i]]);
                for (var j = 0; j !== keys.length; ++j) {
                    delete tmp[key][groups[i]][keys[j]]["thumb"];
                }
            }
        }
        // Replace "\r\n" with "\n"
        tmp[key]["text"]["body"] = tmp[key]["text"]["body"].replace(/\r\n/g,
            "\n");
    }

    return tmp;
};
/**
 * Sorts journal.archive.data
 */
edit.sortArchive = function() {
    journal.archive.data[app.year].sort(function(a, b) {
        // From the latest to oldest
        var timeDiff = b["time"]["created"] - a["time"]["created"];

        return timeDiff ? timeDiff : !!(b["contentType"]) - !!(a["contentType"]);
    });
};
/**
 * Removes the duplicate entries under `journal.archive.data`. By duplicate, it
 * means two entries, being sorted, have the same created time (and that's it).
 * This function assumes that `journal.archive.data` is sorted
 */
edit.removeDuplicate = function() {
    for (var i = 0;
         i < Object.keys(journal.archive.data[app.year]).length - 1;
         ++i) {

        var thisEntry = journal.archive.data[app.year][i];
        var nextEntry = journal.archive.data[app.year][i + 1];
        if (thisEntry["time"]["created"] === nextEntry["time"]["created"] && thisEntry.contentType === nextEntry.contentType) {
            // Same contents, remove this one
            app.yearChange[app.year] = true;
            journal.archive.data[app.year].splice(i--, 1);
        }
    }
};
/******************************************************************
 ************************ CONTENT CONTROL *************************
 ******************************************************************/

/************************** REDO **********************************/

/* NOT USABLE */
edit.undo = function() {
    ////	if (edit.localChange.length == 0) {
    ////		// No changes to undo
    ////		animation.deny("#add-undo");
    ////	} else {
    ////		// Trace back
    ////		var changes = edit.localChange.pop();
    ////		// This is considered to be of object type
    ////		for (key in changes) {
    ////			var change = changes[key];
    ////			if (change == "place") {
    ////				var dict = JSON.parse(changes[key][change]),
    ////					html = "";
    ////				for (key2 in dict) {

    ////				}
    ////			}
    ////		}
    ////	}
};
/* NOT USABLE */
edit.change = function(key, value) {
    ////	var dict = {};
    ////	if (localStorage[key])
    ////		// Archive this value
    ////		dict[key] = value;
    ////	else
    ////		dict[key] = undefined;
    ////	edit.localChange.push(dict);
    ////	localStorage[key] = value;

};

/************************** EDITING *******************************/

/**
 * Removes an entry from view-list
 */
edit.removeEntry = function() {
    // Test if there are any deletable data
    if (app.currentDisplayed == -1) {
        animation.error(log.NO_ENTRY_SELECTED);
        animation.deny("#delete");
        return;
    }
    // The data have been changed
    app.yearChange[app.year] = true;
    $("#year-change").addClass("change");
    // Change the data displayed
    --app.displayedNum;
    var data = journal.archive.data[app.year][app.currentDisplayed];
    app.displayedChars -= data["text"]["chars"] || 0;
    app.displayedLines -= data["text"]["lines"] || 0;
    app.displayedTime -= (data["time"]["end"] - data["time"]["start"]) / 60000;
    // Remove from the map
    delete journal.archive.data[app.year][app.currentDisplayed];
    // Clear from the list
    var $entry = $("#list ul li:nth-child(" + (app.currentDisplayed + 1) + ")");
    if ($entry.next().length === 0 || $entry.next()
            .has("p.separator").length !== 0) {
        // Reaches EOF or the beginning of next month (separator)
        $entry.fadeOut(500, function() {
            $(this).empty();
        });
    } else {
        // Pretend there is a separator
        $entry.children("a").fadeOut(500, function() {
            $(this).remove();
        });
    }
    app.detail.prototype.hideDetail();
    $(".loadmore").trigger("click");
    // Save to cache
    edit.saveDataCache();
    animation.showMenuOnly("edit");
};
/**
 * Adds a medium to the edit pane, given the typeNum
 * @param {Number} typeNum - The number of the type of media, or can be a
 *     helper value to video and voice
 * @param {Object} arg - The extra arg to be provided by other helper call to
 *     this function. When typeNum == -3 this has to include "url", "fileName",
 *     "id" and "title" key
 */
edit.addMedia = function(typeNum, arg) {
    var selectorHeader = "#attach-area ." + edit.mediaName(Math.abs(typeNum)),
        length = $(selectorHeader).length,
        htmlContent;
    switch (typeNum) {
        case 0:
            // Images
            edit.photo();
            // Do not execute the codes after switch block
            return;
        case 1:
            // Video
            edit.videoSearch();
            break;
        case -1:
            // Helper for video
            htmlContent = "<div class=\"video data change\"><a class='" + arg["fileName"] + "' onclick=\"edit.video(" + length + ",'" + arg["url"] + "')\" title=\"View\"><div class=\"thumb\"><span></span></div><input disabled class=\"title\" value=\"" + arg["title"] + "\" /></a></div>";
            break;
        case 2:
            // Place
            htmlContent = "<div class=\"place\"><a title=\"Edit\" onclick=\"edit.location(" + length + ")\" href=\"#\"><div class=\"thumb\"></div><input disabled title=\"Place\" class=\"title place-search\" autocomplete=\"off\"/><input disabled title=\"Latitude\" class=\"desc latitude\" autocomplete=\"off\" /><p>,</p><input disabled title=\"Longitude\" class=\"desc longitude\" autocomplete=\"off\" /></a></div>";
            break;
        case 3:
            // Voice
            edit.voiceSearch();
            break;
        case -3:
            // Helper for voice
            htmlContent = "<div class=\"voice data change\"><a class='" + arg["fileName"] + "' onclick=\"edit.voice(" + length + ",'" + arg["url"] + "')\" title=\"View\"><div class=\"thumb\"><span></span></div><input disabled class=\"title\" value=\"" + arg["title"] + "\" /></a></div>";
            break;
        case 4:
            // Music
            htmlContent = "<div class=\"music\"><a title=\"Edit\" onclick=\"edit.music(" + length + ")\" href=\"#\"><img class=\"thumb\"><span></span><input disabled class=\"title\" placeholder=\"Track name\" autocomplete=\"off\" /><input disabled class=\"desc\" placeholder=\"Artist\" autocomplete=\"off\" /></a></div>";
            break;
        case 5:
            // Movie
            htmlContent = "<div class=\"movie\"><a title=\"Edit\" onclick=\"edit.movie(" + length + ")\" href=\"#\"><img class=\"thumb\"><span></span><input disabled class=\"title\" placeholder=\"Movie title\" autocomplete=\"off\" onclick=\"this.select()\" /><input disabled class=\"desc\" placeholder=\"Director\" autocomplete=\"off\" onclick=\"this.select()\" /></a></div>";
            break;
        case 6:
            // Book
            htmlContent = "<div class=\"book\"><a title=\"Edit\" onclick=\"edit.book(" + length + ")\" href=\"#\"><img class=\"thumb\"><span></span><input disabled class=\"title\" placeholder=\"Book title\" autocomplete=\"off\" onclick=\"this.select()\" /><input disabled class=\"desc\" placeholder=\"Author\" autocomplete=\"off\" onclick=\"this.select()\" /></a></div>";
            break;
        case 7:
            // Weblink
            htmlContent = "<div class=\"weblink\"><a title=\"Edit\" onclick=\"edit.weblink(" + length + ")\" href=\"#\"><div class=\"thumb\"><span></span></div><input disabled class=\"title\" placeholder=\"Title\" /><input disabled class=\"desc\" placeholder=\"http://\" /></a></div>";
            break;
        default:
            return;
    }
    if (length > 0) {
        // Elements already exist
        $(htmlContent)
            .insertAfter($(selectorHeader + ":eq(" + (length - 1) + ")"));
    } else {
        // Have to create a new one
        $(htmlContent).appendTo("#attach-area");
    }
    if (typeNum > 0) {
        // Normal call instead of helper call
        $(selectorHeader + ":eq(" + length + ") a").trigger("click");
    }
};
edit.removeMedia = function(typeNum) {
    var type = edit.mediaName(typeNum);
    edit.coverTest(type);
    // Move voice and video data to data folder
    switch (typeNum) {
        case 1:
        // Video
        // Placeholder, do nothing now
        case 3:
            // Voice
            // Placeholder, do nothing now
            break;
        default:
            // In other cases, this step will be taken care of in their
            // individual functions because it is not sure that if the transfer
            // will be successful from the server side
            edit.addToRemovalList(type);
    }
    edit.cleanupMediaEdit();
};
/**
 * Adds media from /queue to help the user to accelerate to select the media
 * @see edit.playableSearch() - This function is based on the algorithms in
 *     edit.playableSearch(). Should any bugs are found, check to see if that
 *     function has the same bugs
 */
edit.addMediaFromQueue = function() {
    // Add throttle
    $("#return-lost-media").removeAttr("onclick");
    animation.log(log.QUEUE_START, 1);
    network.init(1);
    edit.photo(true, function() {
        network.next();
        getTokenCallback(function(token) {
            var url = "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/queue:/children?select=id,name,size,@content.downloadUrl&access_token=" + token;
            $.ajax({
                    type: "GET",
                    url : url
                })
                .done(function(data, status, xhr) {
                    /* Iterator */
                    var i = 0;
                    var itemList = data["value"],
                        addedVoice = 0,
                        addedVideo = 0;
                    // Iterate to find all the results on the server
                    for (var key = 0, len = itemList.length;
                         key !== len;
                         ++key) {
                        var id = itemList[key]["id"],
                            size = itemList[key]["size"],
                            name = itemList[key]["name"],
                            contentUrl = itemList[key]["@content.downloadUrl"],
                            suffix = name.substring(name.length - 4)
                                .toLowerCase(),
                            elementData = {
                                id      : id,
                                name    : name,
                                title   : name.substring(0, name.length - 4),
                                url     : contentUrl,
                                size    : size,
                                resource: false,
                                change  : true
                            },
                            newContent = true;
                        // Test supported file types, if file is not supported
                        // then restart the loop
                        if (suffix === ".mp4") {
                            // Video
                            // Test if this medium is duplicate
                            for (i = 0; i !== edit.videos.length; ++i) {
                                if (edit.videos[i]["size"] === size) {
                                    newContent = false;
                                    break;
                                }
                            }
                            if (!newContent) {
                                continue;
                            }
                            ++addedVideo;
                            edit.videos.push(elementData);
                            // Add to the edit pane
                            edit.addMedia(-1, {
                                fileName: name,
                                url     : contentUrl,
                                title   : name.substring(0, name.length - 4)
                            });
                        } else if (suffix === ".mp3" || suffix === ".wav") {
                            // Voice
                            // Test if this medium is duplicate
                            for (i = 0; i !== edit.voices.length; ++i) {
                                if (edit.voices[i]["size"] === size) {
                                    newContent = false;
                                    break;
                                }
                            }
                            if (!newContent) {
                                continue;
                            }
                            ++addedVoice;
                            edit.voices.push(elementData);
                            // Add to the edit pane
                            edit.addMedia(-3, {
                                fileName: name,
                                url     : contentUrl,
                                title   : name.substring(0, name.length - 4)
                            });
                        }
                    }
                    // Right click to select
                    edit.playableSetToggle();
                    if (addedVideo > 0) {
                        animation.debug(addedVideo + log.QUEUE_FOUND_VIDEOS);
                    }
                    if (addedVoice > 0) {
                        animation.debug(addedVoice + log.QUEUE_FOUND_VOICES);
                    }
                })
                .fail(function(xhr, status, error) {
                    animation.error(log.QUEUE_FAILED, error);
                })
                .always(function() {
                    // Add it back
                    $("#return-lost-media")
                        .attr("onclick", "app.cleanResource()");
                    animation.log(log.QUEUE_END, -1);
                });
        });
    });
};
/**
 * Adds media element to pending removal list and make this element fade out
 * from the view. The list will not be removed until edit.quit() is called
 * @param {string} name - The string of the type of media
 * @param {number} index (Optional) - The index of the type of media to be
 *     added to the list
 */
edit.addToRemovalList = function(name, index) {
    if (!edit.removalList[name]) {
        edit.removalList[name] = [];
    }
    if (index == undefined) {
        index = edit.mediaIndex[name];
    }
    var selectorHeader = edit.getSelectorHeader(name, index);
    // Fadeout the element
    $(selectorHeader).fadeOut();
    if (edit.removalList[name].indexOf(index) !== -1) {
        // Only add when this element does not exist
        edit.removalList[name].push(index);
    }
};
/**
 * Gets the name of media by num value
 * @param {number} typeNum - The value of this media
 * @returns {string} - The string name of the media. Empty if not applicable
 */
edit.mediaName = function(typeNum) {
    switch (typeNum) {
        case 0:
            return "photo";
        case 1:
            return "video";
        case 2:
            return "place";
        case 3:
            return "voice";
        case 4:
            return "music";
        case 5:
            return "movie";
        case 6:
            return "book";
        case 7:
            return "weblink";
        default:
            return "";
    }
};
/**
 * Gets the num value of media by name
 * @param {string} type - The name of this media
 * @returns {number} - The num value of the media. -1 if not applicable
 */
edit.mediaValue = function(type) {
    if (type === "photo") {
        return 0;
    }
    if (type === "video") {
        return 1;
    }
    if (type === "place") {
        return 2;
    }
    if (type === "voice") {
        return 3;
    }
    if (type === "music") {
        return 4;
    }
    if (type === "movie") {
        return 5;
    }
    if (type === "book") {
        return 6;
    }
    if (type === "weblink") {
        return 7;
    }
    // Not applicable
    return -1;
};
/**
 * Sets the medium to be removed and show the remove-confirm button
 * @param {number} typeVal - The type numerical value of the type
 */
edit.setRemove = function(typeVal) {
    edit.confirmVal = typeVal;
    if (typeVal === 2) {
        $("#pin-point").removeClass("hidden");
    }
    $("#action-remove-confirm").removeClass("hidden");
};
/**
 * Cleans up all the media edit data to get ready for next editing
 */
edit.cleanupMediaEdit = function() {
    $("#edit-pane").off("keyup");
    switch (edit.isEditing) {
        case 1:
            edit.videoHide();
            break;
        case 2:
            edit.locationHide();
            break;
        case 3:
            edit.voiceHide();
            break;
        case 4:
            edit.musicHide();
            break;
        case 5:
            edit.movieHide();
            break;
        case 6:
            edit.bookHide();
            break;
        case 7:
            edit.weblinkHide();
    }
};
/**
 * Returns a header of the selector given the type of media and optional index
 * @param {string} type - The string of media type
 * @param {number} index (Optional) - The index of the media. If not specified,
 *     value will be retrieved from edit.mediaIndex
 * @returns {string} - The selector header
 */
edit.getSelectorHeader = function(type, index) {
    if (index == undefined) {
        return "#attach-area ." + type + ":eq(" + edit.mediaIndex[type] + ") ";
    }
    return "#attach-area ." + type + ":eq(" + index + ") ";
};

/************************** ANIMATION *****************************/

edit.toggleLight = function() {
    $("#text-area").toggleClass("dark");
};
edit.fullScreen = function() {
    // Clean all the data to hide map selector and photo viewer
    edit.cleanupMediaEdit();
    // Disable auto-height
    $(window).off("resize");
    $("#app").css("height", "");
    // Change the icon
    animation.showMenuOnly("fullscreen");
    $("body").addClass("fullscreen");
    // Request the browser to toggle fullscreen
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
};
edit.windowMode = function() {
    // Exit dark mode
    $("#text-area").removeClass("dark");
    // Change the icon
    animation.showMenuOnly("add");
    // Resize
    $("body").removeClass("fullscreen");
    // Re-enable auto-height
    app.layout();
    // Request the browser to exit fullscreen
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};

/************************** TITLE & HEADER *********************************/

/**
 * Stores the value in the title textbox into cache
 * @returns {}
 */
edit.saveTitle = function() {
    localStorage["title"] = $("#entry-header").val();
};
edit.refreshSummary = function() {
    var text = $("#entry-body").val(),
        len = text.length;
    $("#entry-char").text(len);
    $("#entry-line").text(text.split(/\r*\n/).length);
};
edit.refreshTime = function() {
    ++edit.time;
    var date = new Date();
    var timeString = edit.format(date.getMonth() + 1) + edit.format(date.getDate()) + edit.format(
            date.getFullYear() % 100) + " " + edit.format(date.getHours()) + edit.format(
            date.getMinutes());
    $("#entry-time").text(timeString);
    $("#entry-elapsed")
        .text(parseInt(edit.time / 60) + ":" + edit.format(edit.time % 60));
};
/**
 * Returns a formatted string of a number. Equivalent to String.format("%2d",
 * n)
 * @param {number} n - The digit number to be formatted
 * @returns {string} - The string to make the number at started with an 0 if
 *     length is 1
 */
edit.format = function(n) {
    return n < 10 ? "0" + n : "" + n;
};
/**
 * Converts my format of time to the milliseconds since epoch
 * @param {string} time - My time string
 * @returns {number} - The time since epoch
 */
edit.convertTime = function(time) {
    var month = parseInt(time.substring(0, 2)),
        day = parseInt(time.substring(2, 4)),
        year = parseInt(time.substring(4, 6)),
        hour = 0,
        minute = 0;
    if (time.length > 6) {
        hour = parseInt(time.substring(7, 9));
        minute = parseInt(time.substring(9, 11));
    }
    var date = new Date(2000 + year, month - 1, day, hour, minute);
    return date.getTime();
};
/**
 * Returns my version of data with priority of
 * 1) Title content
 * 2) Created time
 * 3) Time of calling this function
 * This function will also make sure that this folder is created under /data to
 * avoid 404 error while attempting to move media to this folder
 * @param {function} callback - Callback function, with a parameter of the
 *     dateStr returned (e.g. function(dateStr))
 * @returns {string} - My format of the time
 */
edit.getDate = function(callback) {
    var dateStr;
    // Get date from title, ignore what title looks like
    if (localStorage["title"]) {
        // Sometimes for some reason the first character is an "empty" char
        dateStr = parseInt(localStorage["title"]);
        if (!isNaN(dateStr)) {
            dateStr = dateStr.toString();
            if (dateStr.length === 5) {
                dateStr = "0" + dateStr;
            }
            if (dateStr.length !== 6) {
                // Incorrect format
                dateStr = "";
            }
        }
    }
    if (!dateStr) {
        var date;
        if (localStorage["created"]) {
            // Date will be based on created
            date = new Date(parseInt(localStorage["created"]));
        } else {
            // Date will be based on now
            date = new Date().getTime();
            date = new Date(date - 14400000);
        }
        dateStr = "" + edit.format(date.getMonth() + 1) + edit.format(date.getDate()) + edit.format(
                date.getFullYear() % 100);
    }
    // Test server folder validity
    if (dateStr != edit.folderDate) {
        // Try to create the folder
        createDateFolder(dateStr, callback);
    } else {
        callback(dateStr);
    }
    return dateStr;
};
/**
 * Returns my format of time
 * @param {Number} timeNum - The seconds from epoch
 * @returns {String} - The formatted string
 */
edit.getMyTime = function(timeNum) {
    var date = new Date(timeNum);
    if (isNaN(date.getTime())) {
        return timeNum;
    }
    return "" + edit.format(date.getMonth() + 1) + edit.format(date.getDate()) + edit.format(
            date.getFullYear() % 100) + " " + edit.format(date.getHours()) + edit.format(
            date.getMinutes());
};

/************************** BODY **************************/

/**
 * Processes the body to
 * 1) Do some command line work
 * 2) Save the after-processed text to the cache
 */
edit.processBody = function() {
    // Command line work
    var lines = $("#entry-body").val().split(/\r*\n/);
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i],
            flag = false,
            convertedTime;
        if (line.substring(0, 7) === "Begin @") {
            convertedTime = edit.convertTime(line.substring(8));
            if (convertedTime && new Date(convertedTime).getFullYear() === app.year) {
                // Year in range, overwrite start time
                localStorage["start"] = convertedTime;
                animation.log(log.START_TIME_CHANGED_TO + app.list.prototype.date(
                        convertedTime));
            } else {
                // Invalid date
                animation.error(log.TIME_NOT_IN_RANGE);
            }
            flag = true;
        } else if (line.substring(0, 5) === "End @") {
            // Overwrite end time
            convertedTime = edit.convertTime(line.substring(6));
            if (convertedTime) {
                localStorage["end"] = convertedTime;
                animation.log(log.END_TIME_CHANGED_TO + app.list.prototype.date(
                        convertedTime));
            } else {
                // Invalid date
                animation.error(log.TIME_INVALID);
            }
            flag = true;
        } else if (line.substring(0, 9) === "Created @") {
            convertedTime = edit.convertTime(line.substring(10));
            if (new Date(convertedTime).getFullYear() === app.year) {
                // Year in range, overwrite created time
                localStorage["created"] = convertedTime;
                animation.log(log.CREATED_TIME_CHANGED_TO + app.list.prototype.date(
                        convertedTime));
            } else {
                // Invalid date
                animation.error(log.TIME_NOT_IN_RANGE);
            }
            flag = true;
        } else if (line.length > 2 && line.charAt(0) === "#") {
            // Add a tag
            edit.addTag(line.substring(1).toLowerCase());
            flag = true;
        }
        if (flag) {
            // Remove the current line
            lines.splice(i--, 1);
        }
    }
    var newBody = lines.join("\r\n");
    $("#entry-body").val(newBody);
    // Cache the data
    localStorage["body"] = newBody;
};
/************************** TAG *********************************/

/**
 * Adds a tag given a tag value or fetch it from entry tag, providing optional
 * tag value, toggle or force to set true, and the source of this operation
 * @param {string} tag (Optional) - The value of the tag to be added
 * @param {boolean} mute - Whether log "xxx is added" or not
 */
edit.addTag = function(tag, mute) {
    // Find replacable tags
    tag = edit.autoCorrectTags[tag] || tag;
    // If a tag is not specified, it will get the value from the input box
    // where user puts a new tag value
    tag = tag || $("#entry-tag").val().toLowerCase().replace(/\|/g, "");
    // Remove the spaces in `tag`
    tag = tag.replace(/ /g, "");
    // Test for duplicate
    if (localStorage["tags"].split("|").indexOf(tag) !== -1) {
        // The entry is already added
        // This tag has already been added
        animation.warn(log.TAG_ADD_HEADER + tag + log.TAG_ADDED_ALREADY);
        $("#entry-tag").effect("highlight", {color: "#000"}, 400);
    } else {
        var found = false,
            added = false;
        // Try to convert to iconTag
        $("#attach-area .icontags span").each(function() {
            if ($(this).attr("title").toLowerCase() === tag) {
                // Found
                found = true;
                var parent = $(this).parent().attr("class");
                if (parent === "weather" || parent === "emotion") {
                    // Only one weather and emotion is allowed
                    if ($(this).hasClass("hidden")) {
                        // Hidden div, means another weather/emotion has
                        // already been added
                        animation.warn(log.TAG_ICON_ADD_HEADER + tag + log.TAG_ADDED_FAILED);
                        // Give effect if the tag is from user input
                        if ($("#entry-tag").val() !== "") {
                            $("#entry-tag")
                                .effect("highlight", {color: "#000"}, 400);
                        }
                        return;
                    }
                }
                // Test if this icon has already been added
                if (!$(this).hasClass("highlight")) {
                    if (!mute) {
                        animation.log(log.TAG_ICON_ADD_HEADER + tag + log.TAG_ADDED);
                    }
                    edit.toggleIcon(tag);
                    added = true;
                } else {
                    animation.warn(log.TAG_ICON_ADD_HEADER + tag + log.TAG_ADDED_ALREADY);
                    // Give effect if the tag is from user input
                    if ($("#entry-tag").val() !== "") {
                        $("#entry-tag")
                            .effect("highlight", {color: "#000"}, 400);
                    }
                    // Saved
                }
            }
        });
        if (!found) {
            // Keep searching for texttags
            $("#entry-tag").effect("highlight", {color: "#dadada"}, 400);
            // Marked for a new entry
            var func = "onclick=edit.removeTag('" + tag + "')";
            $("#attach-area .texttags .other")
                .append("<p title='Click to remove' " + func + ">#" + tag + "</p>");
            added = true;
        }
        // Test if this tag has been successfully added
        if (added) {
            // Add to the cache
            if (localStorage["tags"]) {
                // Concatenate to the previous tag
                localStorage["tags"] += "|" + tag;
            } else {
                // Start a new tagt
                localStorage["tags"] = tag;
            }
        }
    }
};
/**
 * Removes a tag from current tag and also gives visual feedback to the user
 * If no tag is found, nothing will show up
 * @param {string} tagName - The name of the tag to be removed
 * @param {boolean} mute - Whether log "xxx is added" or not
 */
edit.removeTag = function(tag, mute) {
    var tagArray = localStorage["tags"].split("|");
    for (var i = 0; i !== tagArray.length; ++i) {
        if (tagArray[i] === tag) {
            // Matched
            // Try to remove from the text tag panel
            var removed = false;
            $("#attach-area .texttags p").each(function() {
                if ($(this).text() === "#" + tag) {
                    $(this).animate({width: "0"}, function() {
                        $(this).remove();
                        removed = true;
                    });
                }
            });
            if (!removed) {
                var found = false;
                // Keep searching in icontags
                $("#attach-area .icontags .highlight").each(function() {
                    if (!found) {
                        if ($(this).attr("title").toLowerCase() === tag) {
                            if (!mute) {
                                animation.log(log.TAG_ICON_ADD_HEADER + tag + log.TAG_REMOVED);
                            }
                            edit.toggleIcon(tag);
                            found = true;
                        }
                    }
                });
            }
            // Remove this tag from cache
            tagArray.splice(i, 1);
            localStorage["tags"] = tagArray.join("|");
            return;
        }
    }
};
/**
 * Toggles the tag by adding/removing it from cache
 * @param {string} tag - The name of the tag to be toggled
 * @param {boolean} mute - Whether log "xxx is added" or not
 */
edit.toggleTag = function(tag, mute) {
    if (localStorage["tags"].split("|").indexOf(tag) !== -1) {
        // Already added
        edit.removeTag(tag, mute);
    } else {
        // Add this tag
        edit.addTag(tag, mute);
    }
};
/**
 * Toggles the icon on the website.
 * This function will only give visual feedback
 * @param {string} tag - The name of the tag to be toggled
 */
edit.toggleIcon = function(tag) {
    var htmlName = app.tag().getHtmlByName(tag),
        selector = "#attach-area .icontags span." + htmlName,
        parent = $(selector).parent().attr("class");
    if ($(selector).toggleClass("highlight").hasClass("highlight")) {
        if (parent === "weather" || parent === "emotion") {
            // Now highlighted
            $("#attach-area .icontags ." + parent + " span:not(." + htmlName + ")")
                .addClass("hidden");
        } else {
            $("#attach-area .icontags .selected")
                .append($(selector).addClass("highlight").clone());
        }
    } else {
        if (parent === "weather" || parent === "emotion") {
            // Dimmed
            $("#attach-area .icontags ." + parent + " span")
                .removeClass("hidden");
        } else {
            setTimeout(function() {
                $("#attach-area .icontags .selected ." + htmlName).remove();
            }, 400);
        }
    }
};
/************************** COVER **************************/

/**
 * Sets the cover type of current entry and animates on the edit pane.
 * This function will not test if this type is attached in this entry.
 * Only if the cover is set to be photo, it will appear on the entry. Otherwise
 * a dummy image will be shown
 * @param {Number|String} type - My value of type classification. -1 for no
 *     cover
 * @param {boolean} isToggle - Whether covertype will toggle to 0 if `type` is
 *     the same as current type
 * @return {number} the number of cover type
 */
edit.coverSet = function(type, isToggle) {
    var coverType,
        typeNum = type;
    if (typeof (type) == "string") {
        typeNum = edit.mediaValue(type);
    }
    switch (typeNum) {
        case 0:
            coverType = 1;
            break;
        case 1:
            coverType = 2;
            break;
        case 2:
            coverType = 64;
            break;
        case 3:
            coverType = 8;
            break;
        case 4:
            coverType = 4;
            break;
        case 5:
            coverType = 32;
            break;
        case 6:
            coverType = 16;
            break;
        case 7:
            coverType = 128;
            break;
        default:
            coverType = 0;
    }
    // Animation and assignment
    // Show all the type selectors
    $(".types p").removeClass("hidden selected");
    if (isToggle && localStorage["coverType"] == coverType) {
        localStorage["coverType"] = coverType = -1;
    } else {
        localStorage["coverType"] = coverType;
        var name = edit.mediaName(typeNum);
        $(".types p:not(#" + edit.mediaName(typeNum) + "-cover)")
            .addClass("hidden");
        if (name) {
            $(".types #" + edit.mediaName(typeNum) + "-cover")
                .addClass("selected");
        } else {
            // Do not display cover
            $(".types #no-cover").addClass("selected");
        }
    }
    return coverType;
};
/**
 * Automatically selects a type from given typeList. If no typeList is
 * specified, this function will assign coverType based on all the valid
 * attachments in this entry. See the first line of the code for the priority
 * of all the attachments
 * @param {Object} typeList - A list of attachments to be selected from
 * @return {Number} the chosen cover
 */
edit.coverAuto = function(typeList) {
    var priority = edit.mediaList;
    typeList = typeList || edit.coverRefresh();
    for (var i = 0; i !== priority.length; ++i) {
        if (typeList.indexOf(priority[i]) !== -1) {
            // Return to stop this function
            return edit.coverSet(priority[i]);
        }
    }
    // No cover at all
    edit.coverSet(-1);
    animation.log(log.COVERTYPE_AUTO_CHOSEN);
};
/**
 * Refreshes the covertype area to returns the avaiable cover type of current
 * entry
 * @returns {Object} - A list of all the available attachments
 */
edit.coverRefresh = function() {
    var elem = edit.mediaList,
        ret = [];
    for (var i = 0; i !== elem.length; ++i) {
        // Test if this element is in cache
        if (elem[i] in localStorage) {
            // Test if the element in cache is valid
            if (localStorage[elem[i]].length !== 0) {
                // Test if it is not empty
                try {
                    if (Object.keys(JSON.parse(localStorage[elem[i]])).length !== 0) {
                        // Alright, this is a solid attachment
                        ret.push(elem[i]);
                    }
                } catch (e) {
                    // Do nothing
                }
            }
        }
    }
    return ret;
};
/**
 * Test if current entry has any attachments of the type specifed by cover
 * type. If not, deselect the covertype in edit pane
 * @param {string} type - The name of the type
 */
edit.coverTest = function(type) {
    var has = false;
    // Test if all the attachments is displayed
    $("#attach-area ." + type).each(function() {
        if ($(this).css("display") !== "none") {
            // The entry still has this attachment
            has = true;
        }
    });
    if (!has) {
        // Imitate a click on that icon
        $("#attach-area .types #" + type + "-cover").trigger("click");
    }
};
/************************** PHOTO 0 ************************/

/**
 * Adds the photo on the edit-pane and extend the photo area
 * @param {boolean} isQueue (Optional) - whether the source of the photos is
 *     /queue
 * @param {function} callback - The callback function after the images are
 *     loaded
 */
edit.photo = function(isQueue, callback) {
    // Fix callback if not defined
    if (typeof callback != "function") {
        callback = function() {
        };
    }
    if (edit.photos.length !== 0 && !isQueue) {
        // Return if edit.photo is already displayed
        animation.error(log.EDIT_PANE_IMAGES_ALREADY_LOADED);
        return;
    }
    // Test if this entry really doesn't have any images at all
    var images = JSON.parse(localStorage["images"]);
    if (images.length) {
        if (Object.keys(journal.archive.map).length === 0) {
            // No media in the map, ask for downloading the images
            animation.error(log.EDIT_PANE_IMAGES_FAIL + log.DOWNLOAD_PROMPT);
            animation.deny("#add-photo");
            return;
        }
    }
    // If queue photos want to be displayed before this panel is initialized,
    // initialize photo panel first
    var addQueue = false;
    if ($("#attach-area .images").css("height") !== "100px" && isQueue) {
        // Change the parameter to pretend to add local images first
        addQueue = true;
        isQueue = false;
    }
    // Extend the image area and add sortable functionality and hover
    $("#attach-area .images").css({height: "100px"}).hover(function() {
        // Mouseover
        // Clean up the data
        edit.cleanupMediaEdit();
        $("#photo-preview").css("opacity", "initial").show({
            effect  : "fade",
            duration: 200
        });
    }, function() {
        // Mouseout
        $("#photo-preview").hide({
            effect  : "fade",
            duration: 200
        });
    }).sortable({
        containment: "#attach-area .images",
        cursor     : "crosshair",
        revert     : true
    }).disableSelection();
    // Prepartion before doing server work
    var processFunc = function(dateStr) {
        getTokenCallback(function(token) {
            var url;
            if (isQueue) {
                url = "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/queue:/children?select=id,name,size,@content.downloadUrl&access_token=" + token;
            } else {
                url = getDataUrlHeader() + "/" + dateStr + ":/children?select=id,name,size,@content.downloadUrl&access_token=" + token;
            }
            $.ajax({
                type: "GET",
                url : url
            }).done(function(data) {
                    if (data["@odata.nextLink"] && !isQueue) {
                        animation.warn(log.EDIT_PANE_TOO_MANY_RESULTS);
                    }
                    var itemList = data["value"],
                        added = 0;
                    for (var key = 0, len = itemList.length; key !== len; ++key) {
                        var size = itemList[key]["size"],
                            id = itemList[key]["id"],
                            name = itemList[key]["name"],
                            suffix = name.substring(name.length - 4).toLowerCase(),
                            found = false;
                        if (suffix !== ".jpg" && suffix !== ".png") {
                            // Only support these two types
                            continue;
                        }
                        // Use size to filter out duplicate photos
                        for (var i = 0, tmp = edit.photos; i !== tmp.length; ++i) {
                            if (tmp[i]["size"] == size) {
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                            // Abandon this image
                            continue;
                        } else {
                            var photoData = {
                                name    : name,
                                id      : id,
                                url     : itemList[key]["@content.downloadUrl"],
                                size    : size,
                                resource: false,
                                change  : false
                            };
                            ++added;
                            edit.photos.push(photoData);
                        }
                    }
                    // Add to images div, for those newly added only
                    var i;
                    if (isQueue) {
                        // Those already added should not be counted toward
                        i = edit.photos.length - added;
                    } else {
                        i = 0;
                    }
                    for (; i !== edit.photos.length; ++i) {
                        var htmlContent;
                        if (isQueue) {
                            // The images cannot be in the resource folder
                            htmlContent = "<div class=\"queue\">";
                        } else {
                            if (edit.photos[i]["resource"]) {
                                // The image should be highlighted if it is
                                // already at resource folder
                                htmlContent = "<div class=\"resource\">";
                            } else {
                                htmlContent = "<div class=\"data\">";
                            }
                        }
                        htmlContent += "<span></span><img src=\"" + edit.photos[i]["url"] + "\"/></div>";
                        $("#attach-area .images").append(htmlContent);
                    }
                    // Stop throttle
                    $("#add-photo").html("&#xf03e").attr({
                        onclick: "edit.addMedia(0)",
                        href   : "#"
                    }).fadeIn();
                    // Clicking on img functionality
                    $("#attach-area .images div").each(function() {
                        // Re-apply
                        $(this).off("contextmenu");
                        $(this).on("contextmenu", function() {
                            // Right click to select the images
                            $(this).toggleClass("change");
                            // Return false to disable other functionalities
                            return false;
                        });
                    });
                    $("#attach-area .images img").each(function() {
                        $(this).unbind("mouseenter mouseleave").hover(function() {
                            // Mouseover
                            $("#photo-preview img")
                                .animate({opacity: 1}, 200)
                                .attr("src", $(this).attr("src"));
                        }, function() {
                            // Mouseout
                            $("#photo-preview img").animate({opacity: 0}, 0);
                        });
                    });
                    if (isQueue) {
                        animation.debug(added + log.QUEUE_FOUND_IMAGES);
                    } else {
                        edit.setRemove(0);
                        // Test if any result was found
                        if (edit.photos.length === 0) {
                            animation.log(log.EDIT_PANE_IMAGES_END_NO_RESULT, -1);
                        } else {
                            animation.log(log.EDIT_PANE_IMAGES_END, -1);
                        }
                        animation.finished("#add-photo");
                    }
                })
                .fail(function(xhr, status, error) {
                    if (!isQueue) {
                        $("#add-photo").html("&#xf03e").attr({
                            onclick: "edit.addMedia(0)",
                            href   : "#"
                        });
                        // Test if error is not found
                        if (error === "Not Found" && !addQueue) {
                            // If the error is not found and the user just
                            // wants to add the photo from this folder, then
                            // report error
                            animation.error(log.EDIT_PANE_IMAGES_FAIL + log.EDIT_PANE_IMAGES_FIND_FAIL + dateStr,
                                error,
                                -1);
                            animation.deny("#add-photo");
                        } else {
                            // Still have to care about indentation of log
                            --animation.indent;
                        }
                    }
                })
                .always(function() {
                    // Test if queue photo is to be added
                    if (addQueue) {
                        edit.photo(true, callback);
                    } else {
                        // Finished everything, just call callback
                        callback();
                        network.destroy();
                    }
                });
        });
    };
    if (!isQueue) {
        // Add throttle
        $("#add-photo").removeAttr("onclick").removeAttr("href");
        // Empty edit.photos only if the photos are not added from queue
        edit.photos = [];
        // Iterate to add all photos of this dataclip to edit.photos
        for (var i = 0; i < images.length; ++i) {
            var name = images[i]["fileName"];
            if (journal.archive.map[name]) {
                var image = {
                    name    : name,
                    id      : journal.archive.map[name]["id"],
                    size    : journal.archive.map[name]["size"],
                    url     : journal.archive.map[name]["url"],
                    resource: true,
                    /* Whether this image is moved to the other location,
                     * i.e. if it is deleted or added
                     */
                    change  : false
                };
                edit.photos.push(image);
            } else {
                // File not found, remove this file
                images.splice(i--, 1);
                localStorage["images"] = JSON.stringify(images);
            }
        }
        edit.getDate(function(dateStr) {
            // Get resource photos from user content folder
            animation.log(log.EDIT_PANE_IMAGES_START + dateStr + log.EDIT_PANE_IMAGES_START_END,
                1);
            // Get correct date folder
            processFunc(dateStr);
        });
    } else {
        // Remove all the queue images
        $("#attach-area .images .queue").each(function() {
            // Remove this image from edit.photos
            for (var i = 0; i !== edit.photos.length; ++i) {
                var url = $(this).children("img").attr("src");
                if (edit.photos[i]["url"] === url) {
                    // Matched
                    edit.photos.splice(i, 1);
                    break;
                }
            }
            $(this).remove();
        });
        processFunc();
    }
};
/**
 * Saves the photo to OneDrive
 * IMPORATNT: This function is to be called only at edit.save() because this
 * function will contact OneDrive server to move files, which will cause async
 * between client and the server
 * @param {function} callback - The callback function to be called after all
 *     the changes have been made
 */
edit.photoSave = function(callback) {
    if (edit.photos.length == 0) {
        // Nothing to process
        callback();
        return;
    } else {
        // Get the photos whose locations to be changed
        var photoQueue = [],
        /* New images attached to this entry */
            newImagesData = [];
        edit.getDate(function(timeHeader) {
            // Change the `change` of edit.photos according to html contents
            $("#attach-area .images div").each(function() {
                for (var i = 0; i !== edit.photos.length; ++i) {
                    if ($(this)
                            .children("img")
                            .attr("src") === edit.photos[i]["url"]) {
                        // Matched, update from the html elements
                        edit.photos[i]["change"] = $(this).hasClass("change");
                        break;
                    }
                }
            });
            // Get the correct header for the photo
            for (var i = 0; i !== edit.photos.length; ++i) {
                var name = edit.photos[i]["name"],
                    id = edit.photos[i]["id"],
                    resource = edit.photos[i]["resource"];
                if (edit.photos[i]["change"]) {
                    // Reset properties in edit.photos first
                    edit.photos[i]["change"] = false;
                    photoQueue.push({
                        name    : name,
                        id      : id,
                        // New location
                        resource: !resource
                    });
                }
            }

            // Start to change location
            var resourceDir = "/drive/root:/Apps/Journal/resource/" + app.year,
                contentDir = "/drive/root:/Apps/Journal/data/" + app.year + "/" + timeHeader,
                processingPhoto = 0;
            if (photoQueue.length !== 0) {
                // Process the photos
                getTokenCallback(function(token) {
                    animation.log(log.EDIT_PANE_IMAGES_SAVE_START, 1);
                    for (var i = 0; i !== photoQueue.length; ++i) {
                        var requestJson,
                            newName,
                            name = photoQueue[i]["name"],
                            id = photoQueue[i]["id"],
                            isToResource = photoQueue[i]["resource"],
                            url = "https://api.onedrive.com/v1.0/drive/items/" + id + "?select=id,name,size,@content.downloadUrl&access_token=" + token;
                        if (isToResource) {
                            // Would like to be added to entry, originally at
                            // data folder
                            newName = timeHeader + (new Date().getTime() + i) + name.substring(
                                    name.length - 4);
                            requestJson = {
                                // New name of the file
                                name           : newName,
                                parentReference: {
                                    path: resourceDir
                                }
                            };
                        } else {
                            // Would like to be added to data, i.e. remove from
                            // resource folder
                            newName = name;
                            requestJson = {
                                parentReference: {
                                    path: contentDir
                                }
                            };
                        }
                        $.ajax({
                                type       : "PATCH",
                                url        : url,
                                contentType: "application/json",
                                data       : JSON.stringify(requestJson)
                            })
                            .done(function(data, status, xhr) {
                                var id = data["id"],
                                    name = data["name"];
                                for (var j = 0; j !== edit.photos.length; ++j) {
                                    if (edit.photos[j]["id"] == id) {
                                        edit.photos[j]["success"] = true;
                                        edit.photos[j]["name"] = name;
                                        // Add the url of this new image to map
                                        journal.archive.map[data["name"]] = {
                                            url : data["@content.downloadUrl"],
                                            size: data["size"],
                                            id  : data["id"]
                                        };
                                    }
                                }
                                animation.debug((++processingPhoto) + log.EDIT_PANE_IMAGES_OF + photoQueue.length + log.EDIT_PANE_IMAGES_TRASNFERRED);
                            })
                            .fail(function(xhr, status, error) {
                                ++processingPhoto;
                                animation.error(log.EDIT_PANE_TRANSFERRED_FAILED + log.SERVER_RETURNS
                                    + error + log.SERVER_RETURNS_END);
                                animation.warning("#add-photo");
                                // Revert the transfer process
                            })
                            .always(function(data, status, xhr) {
                                /* Iterator */
                                var j;
                                // Test if it is elligible for calling
                                // callback()
                                if (processingPhoto === photoQueue.length) {
                                    // Process all the html elements
                                    // Find the correct img to add or remove
                                    // highlight class on it
                                    $("#attach-area .images div")
                                        .each(function() {
                                            $(this).removeClass("change");
                                            // Try to match images with
                                            // edit.photos
                                            for (j = 0;
                                                 j !== edit.photos.length;
                                                 ++j) {
                                                if ($(this)
                                                        .children("img")
                                                        .attr("src") === edit.photos[j]["url"]) {
                                                    if (edit.photos[j]["success"]) {
                                                        if (edit.photos[j]["resource"]) {
                                                            // Originally at
                                                            // /resource
                                                            $(this)
                                                                .addClass("data")
                                                                .removeClass(
                                                                    "resource");
                                                            // Remove from the
                                                            // map
                                                            delete journal.archive.map[edit.photos[j]["name"]];
                                                        } else {
                                                            // Originally at
                                                            // /data
                                                            $(this)
                                                                .addClass(
                                                                    "resource")
                                                                .removeClass(
                                                                    "queue data");
                                                        }
                                                        edit.photos[j]["resource"] = !edit.photos[j]["resource"];
                                                    }
                                                    break;
                                                }
                                            }
                                        });
                                    // Reset all the data
                                    for (j = 0; j !== edit.photos.length; ++j) {
                                        edit.photos[j]["change"] = false;
                                        edit.photos[j]["success"] = false;
                                    }
                                    // Process edit.photos and match the
                                    // sequence in the div
                                    $("#attach-area .images img")
                                        .each(function() {
                                            for (j = 0;
                                                 j !== edit.photos.length;
                                                 ++j) {
                                                if (edit.photos[j]["url"] === $(
                                                        this).attr("src")) {
                                                    if (edit.photos[j]["resource"]) {
                                                        newImagesData.push({
                                                            fileName: edit.photos[j]["name"]
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                    localStorage["images"] = JSON.stringify(
                                        newImagesData);
                                    animation.log(log.EDIT_PANE_FINISHED_TRANSFER + edit.mediaName(
                                            0) + log.EDIT_PANE_FINISHED_TRANSFER_END,
                                        -1);
                                    callback();
                                }
                            });
                    }
                });
            } else {
                // Sort the images again
                $("#attach-area .images img").each(function() {
                    for (j = 0; j !== edit.photos.length; ++j) {
                        if (edit.photos[j]["url"] === $(this).attr("src")) {
                            if (edit.photos[j]["resource"]) {
                                newImagesData.push({
                                    fileName: edit.photos[j]["name"]
                                });
                            }
                        }
                    }
                });
                localStorage["images"] = JSON.stringify(newImagesData);
                // Call callback
                callback();
            }
        });
    }
};
edit.photoHide = function() {
    // Just hide everything, no further moves to be made
    $("#attach-area .images").animate({height: "0"}).fadeOut().html("");
};

/************************** VIDEO 1 ************************/

/**
 * Edit a video element given the index and an optional parameter of the link
 * of the resource
 * @param {number} index (Optional) - The index of video in all the voices. If
 *     none specified, it will add to the end of the current video list
 * @param {string} link (Optional) - The url to the address of the link, for
 *     newly created element
 */
edit.video = function(index, link) {
    if (index == edit.mediaIndex["video"] || index == undefined) {
        return;
    }
    edit.cleanupMediaEdit();
    edit.mediaIndex["video"] = index;
    var selectorHeader = edit.getSelectorHeader("video");
    edit.setRemove(1);
    edit.func = $(selectorHeader + "a").attr("onclick");
    $(selectorHeader + "a").removeAttr("onclick");
    $(selectorHeader + "input").prop("disabled", false);
    // Press esc to save
    $("#edit-pane").keyup(function(n) {
        if (n.keyCode === 27) {
            edit.videoHide();
        }
    });
    edit.isEditing = 1;
    // Attach to the video element
    var source;
    if (link) {
        source = link;
        $("#text-area #video-preview").fadeIn();
        app.videoPlayer("#text-area #video-preview", source);
    } else {
        // Find it from this dataClip
        var fileName = $(selectorHeader + "a").attr("class");
        if (journal.archive.map[fileName]) {
            source = journal.archive.map[fileName]["url"];
            if (source == undefined) {
                animation.error(log.FILE_NOT_FOUND + $(selectorHeader + ".title")
                        .val());
                return;
            }
            $("#text-area #video-preview").fadeIn();
            app.videoPlayer("#text-area #video-preview", source);
        } else {
            animation.error(log.FILE_NOT_LOADED + $(selectorHeader + ".title") + log.DOWNLOAD_PROMPT);
        }
    }
    edit.setRemove(1);
};
edit.videoHide = function() {
    if (edit.mediaIndex["video"] < 0) {
        // Invalid call
        return;
    }
    $("#text-area #video-preview").fadeOut();
    app.videoPlayer.quit();
    var selectorHeader = edit.getSelectorHeader("video");
    // Disable input boxes
    $(selectorHeader + "input").prop("disabled", true).off("keyup");
    // Recover onclick event
    if (edit.func) {
        // Use edit.func
        $(selectorHeader + "a").attr("onclick", edit.func);
        edit.func = undefined;
    } else {
        $(selectorHeader + "a")
            .attr("onclick", "edit.video(" + edit.mediaIndex["video"] + ")");
    }
    // Save data
    edit.videoSave(edit.mediaIndex["video"]);
    $("#edit-pane").off("keyup");
    // Hide all the option button
    animation.hideHiddenIcons();
    edit.mediaIndex["video"] = -1;
    edit.isEditing = -1;
};
edit.videoSave = function(index) {
    var data = localStorage["video"],
        selectorHeader = edit.getSelectorHeader("video", index),
        title = $(selectorHeader + ".title").val();
    data = data ? JSON.parse(data) : [];
    var newElem = {
        title   : title,
        fileName: $(selectorHeader + "a").attr("class")
    };
    data[index] = newElem;
    localStorage["video"] = JSON.stringify(data);
};
/**
 * Search for all the voices from the data folder and add it to the edit.voice
 */
edit.videoSearch = function() {
    edit.playableSearch(1);
};

/************************** LOCATION 2 ************************/

/**
 * Toggles location panel getter using Google Map
 * @param {number} index - The index of location element
 */
edit.location = function(index) {
    if (index == edit.mediaIndex["place"] || index == undefined) {
        return;
    }
    edit.cleanupMediaEdit();
    // Just start a new one
    edit.setRemove(2);
    // Update media index
    edit.mediaIndex["place"] = index;
    // Spread map-selector
    $("#map-holder").fadeIn();
    // Show pin icon
    $("#pin-point").removeClass("hidden");
    var selectorHeader = edit.getSelectorHeader("place", index);
    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = parseFloat($(selectorHeader + ".latitude")
                    .val()) || position.coords.latitude,
                longitude = parseFloat($(selectorHeader + ".longitude")
                        .val()) || position.coords.longitude;
            pos = new google.maps.LatLng(latitude, longitude);
            mapOptions = {
                zoom  : 15,
                center: pos
            };
            map = new google.maps.Map(document.getElementById("map-selector"), mapOptions);
            searchBox = new google.maps.places.Autocomplete(document.getElementsByClassName(
                "place-search")[edit.mediaIndex["place"]], {types: ["geocode"]});
            markers = [];

            google.maps.event.clearListeners(searchBox, "place_changed");
            google.maps.event.addListener(searchBox,
                "place_changed",
                function() {
                    var place = searchBox.getPlace(),
                        bounds = new google.maps.LatLngBounds();
                    if (!place) {
                        // Invalid input
                        animation.invalid(selectorHeader + ".place-search");
                    } else {
                        if (markers[0]) {
                            markers[0].setMap(null);
                            markers = [];
                        }
                        marker = new google.maps.Marker({
                            map     : map,
                            title   : place.name,
                            position: place.geometry.location
                        });
                        marker.setMap(map);
                        markers.push(marker);
                        map.setZoom(16);
                        map.setCenter(place.geometry.location);
                        $(selectorHeader + ".latitude")
                            .val(place.geometry.location.lat());
                        $(selectorHeader + ".longitude")
                            .val(place.geometry.location.lng());
                    }
                });

            // Bias the SearchBox results towards places that are within the
            // bounds of the current map's viewport.
            google.maps.event.addListener(map, "bounds_changed", function() {
                var bounds = map.getBounds();
                searchBox.setBounds(bounds);
            });

            // Press enter to search
            $("#attach-area .place .desc").keyup(function(n) {
                if (n.keyCode == 13) {
                    var latitude = parseFloat($(selectorHeader + ".latitude")
                        .val()),
                        longitude = parseFloat($(selectorHeader + ".longitude")
                            .val());
                    if (isNaN(latitude)) {
                        animation.invalid(selectorHeader + ".latitude");
                        return;
                    }
                    if (isNaN(longitude)) {
                        animation.invalid(selectorHeader + ".longitude");
                        return;
                    }
                    pos = new google.maps.LatLng(latitude, longitude);
                    edit.locationGeocode(pos);
                }
            });
        }, function() {
            animation.error(log.LOCATION_PIN_FAIL);
        });
    } else {
        // Browser doesn't support Geolocation
        animation.error(log.LOCATION_PIN_FAIL);
    }
    edit.isEditing = 2;

    // Enable input boxes
    $(selectorHeader + "input").prop("disabled", false);
    // Avoid accidentally click
    $(selectorHeader + "a").removeAttr("onclick");
    // Press esc to save
    $("#edit-pane").keyup(function(n) {
        if (n.keyCode === 27) {
            edit.locationHide();
        }
    });
};
/**
 * Hides the map selector and saves the data
 */
edit.locationHide = function() {
    if (edit.mediaIndex["place"] < 0) {
        // Invalid call
        return;
    }
    var selectorHeader = edit.getSelectorHeader("place");
    // Disable input boxes
    $(selectorHeader + "input").prop("disabled", true);
    // Recover onclick event
    $(selectorHeader + "a")
        .attr("onclick", "edit.location(" + edit.mediaIndex["place"] + ")");
    // Save data by default
    edit.locationSave(edit.mediaIndex["place"]);
    // Remove the contents
    $("#map-holder").fadeOut().html("<div id=\"map-selector\"></div>");
    $("#pin-point").addClass("hidden");
    $("#edit-pane").off("keyup");
    // Hide all the options button
    animation.hideHiddenIcons();
    edit.mediaIndex["place"] = -1;
    edit.isEditing = "";
};
/**
 * Saves the location and collapses the panal
 * @param {number} index - The index of the location element
 */
edit.locationSave = function(index) {
    var data = localStorage["place"],
        selectorHeader = edit.getSelectorHeader("place", index),
        latitude = parseFloat($(selectorHeader + ".latitude").val()),
        longitude = parseFloat($(selectorHeader + ".longitude").val()),
        newElem = {};
    if (!data) {
        data = [];
    } else {
        data = JSON.parse(data);
    }
    newElem["title"] = $(selectorHeader + ".title").val();
    // Test if both latitude and longitude are valid
    if (!isNaN(latitude) && !isNaN(longitude)) {
        newElem["latitude"] = latitude;
        newElem["longitude"] = longitude;
    }
    // Update the data
    data[index] = newElem;
    localStorage["place"] = JSON.stringify(data);
};
edit.locationPin = function() {
    // Show the location menu
    var selectorHeader = edit.getSelectorHeader("place");
    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude,
                longitude = position.coords.longitude,
                pos = new google.maps.LatLng(latitude, longitude);
            // Set on the input box
            $(selectorHeader + ".latitude").val(latitude);
            $(selectorHeader + ".longitude").val(longitude);
            edit.locationGeocode(pos);
            edit.locationWeather(pos);
        }, function() {
            animation.error(log.LOCATION_PIN_FAIL);
        });
    } else {
        // Browser doesn't support Geolocation
        animation.error(log.LOCATION_PIN_FAIL);
    }
};
/**
 * Reverses geocoding to get the address of this position add shows it on place
 * element on the website
 * @param {object} pos - The position object indicating the position to be
 *     reverse geocoded
 */
edit.locationGeocode = function(pos) {
    var mapOptions = {
            zoom  : 16,
            center: pos
        },
        map = new google.maps.Map(document.getElementById("map-selector"), mapOptions),
        marker = new google.maps.Marker({
            map     : map,
            position: pos
        }),
        selectorHeader = edit.getSelectorHeader("place");
    // Set on the map
    map.setCenter(pos);
    // Reverse geocoding to get current address
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': pos}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                $(selectorHeader + ".title").val(results[0].formatted_address);
            } else {
                animation.error(log.LOCATION_NO_RESULTS);
            }
        } else {
            animation.error(log.LOCATION_NO_ADDRESS + log.SERVER_RETURNS + status + log.SERVER_RETURNS_END);
        }
    });
};
/**
 * Finds the weather info based on the position passed in. This function will
 * only work if the weather icon in the edit-pane is not assigned to any value
 * @param {object} pos - The position object indicating the position to find
 *     the weather
 */
edit.locationWeather = function(pos) {
    // Test if the weather info already exists
    var flag = false;
    $("#attach-area .icontags .weather p").each(function() {
        if ($(this).hasClass("highlight")) {
            flag = true;
        }
    });
    if (flag) {
        // Weather info exists
        return;
    } else {
        animation.debug(log.EDIT_PANE_WEATHER_START, 1);
    }

    var apiKey = "6f1ee423e253fba5e40e3276ff3e6d33",
        url = "https://api.forecast.io/forecast/" + apiKey + "/" + pos.lat() + "," + pos.lng() + "," + parseInt(
                new Date().getTime() / 1000) + "?units=si";
    $.ajax({
        type    : "GET",
        url     : url,
        dataType: "jsonp"
    }).done(function(data, staus, xhr) {
        var weather = data["currently"],
            icon = weather["icon"];
        animation.log(log.EDIT_PANE_WEATHER_RESULT + weather["temperature"] + log.EDIT_PANE_WEATHER_RESULT_END);
        // Test for different icon value
        // clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy,
        // partly-cloudy-day, or partly-cloudy-night.
        var selector;
        if (icon === "clear-day" || icon === "clear-night") {
            selector = "w01";
        } else if (icon === "cloudy" || icon === "partly-cloudy-day" || icon === "partly-cloudy-night") {
            selector = "w02";
        } else if (icon === "rain") {
            selector = "w03";
        } else if (icon === "snow" || icon === "sleet") {
            selector = "w04";
        } else if (icon === "wind") {
            selector = "w06";
        }
        if (selector) {
            // Available
            animation.log(log.EDIT_PANE_WEATHER_END, -1);
            $("#attach-area .icontags ." + selector).trigger("click");
        } else {
            // Weather info not applicable
            animation.log(log.EDIT_PANE_WEATHER_END_FAIL + data["summary"] + log.EDIT_PANE_WEATHER_END_FAIL_END,
                -1);
        }
    });
};

/************************** VOICE 3 ************************/

/**
 * Edit a voice element given the index and an optional parameter of the link
 * of the resource
 * @param {number} index (Optional) - The index of voice in all the voices. If
 *     none specified, it will add to the end of the current voice list
 * @param {string} link (Optional) - The url to the address of the link, for
 *     newly created element
 */
edit.voice = function(index, link) {
    if (index == edit.mediaIndex["voice"] || index == undefined) {
        return;
    }
    edit.cleanupMediaEdit();
    edit.mediaIndex["voice"] = index;
    var selectorHeader = edit.getSelectorHeader("voice");
    edit.func = $(selectorHeader + "a").attr("onclick");
    $(selectorHeader + "a").removeAttr("onclick");
    $(selectorHeader + "input").prop("disabled", false);
    // Press esc to save
    $("#edit-pane").keyup(function(n) {
        if (n.keyCode === 27) {
            edit.voiceHide();
        }
    });
    edit.isEditing = 3;
    // Attach to the voice element
    var source;
    // Set the source address
    if (link) {
        source = link;
        app.audioPlayer(selectorHeader + "a", source);
    } else {
        // Find it from this dataclip
        var fileName = $(selectorHeader + "a").attr("class");
        if (journal.archive.map[fileName]) {
            source = journal.archive.map[fileName]["url"];
            if (source == undefined) {
                animation.error(log.FILE_NOT_FOUND + $(selectorHeader + ".title")
                        .val());
                return;
            }
            app.audioPlayer(selectorHeader + "a", source);
        } else {
            animation.error(log.FILE_NOT_LOADED + $(selectorHeader + ".title") + log.DOWNLOAD_PROMPT);
        }
    }
    edit.setRemove(3);
};
edit.voiceHide = function() {
    if (edit.mediaIndex["voice"] < 0) {
        // Invalid call
        return;
    }
    app.videoPlayer.quit();
    var selectorHeader = edit.getSelectorHeader("voice");
    // Disable input boxes
    $(selectorHeader + "input").prop("disabled", true).off("keyup");
    // Recover onclick event
    if (edit.func) {
        // Use edit.func
        $(selectorHeader + "a").attr("onclick", edit.func);
        edit.func = undefined;
    } else {
        $(selectorHeader + "a")
            .attr("onclick", "edit.voice(" + edit.mediaIndex["voice"] + ")");
    }
    // Save data
    edit.voiceSave(edit.mediaIndex["voice"]);
    $("#edit-pane").off("keyup");
    // Hide all the option button
    animation.hideHiddenIcons();
    edit.mediaIndex["voice"] = -1;
    edit.isEditing = -1;
};
edit.voiceSave = function(index) {
    var data = localStorage["voice"],
        selectorHeader = edit.getSelectorHeader("voice", index),
        title = $(selectorHeader + ".title").val();
    data = data ? JSON.parse(data) : [];
    var newElem = {
        title   : title,
        fileName: $(selectorHeader + "a").attr("class")
    };
    data[index] = newElem;
    localStorage["voice"] = JSON.stringify(data);
};
/**
 * Search for all the voices from the data folder and add it to the edit.voice
 */
edit.voiceSearch = function() {
    edit.playableSearch(3);
};
/**
 * Use the microphone to record a new voice
 */
edit.voiceNew = function() {

};

/************************** MUSIC 4 **************************/

edit.music = function(index) {
    edit.itunes(index, 4);
};
edit.musicHide = function() {
    edit.itunesHide(4);
};
edit.musicSave = function(index) {
    edit.itunesSave(index, 4);
};

/************************** MOVIE 5 *************************/

edit.movie = function(index) {
    edit.itunes(index, 5);
};
edit.movieHide = function() {
    edit.itunesHide(5);
};
edit.movieSave = function(index) {
    edit.itunesSave(index, 5);
};

/************************** BOOK 6 **************************/

edit.book = function(index) {
    edit.itunes(index, 6);
};
edit.bookHide = function() {
    edit.itunesHide(6);
};
edit.bookSave = function(index) {
    edit.itunesHide(index, 6);
};

/************************** WEBLINK 7 **************************/

edit.weblink = function(index) {
    if (index == edit.mediaIndex["weblink"] || index == undefined) {
        return;
    }
    edit.cleanupMediaEdit();
    edit.mediaIndex["weblink"] = index;
    var selectorHeader = edit.getSelectorHeader("weblink");
    edit.setRemove(7);
    $(selectorHeader + "a").removeAttr("onclick");
    $(selectorHeader + "input").prop("disabled", false);
    // Press esc to save
    $("#edit-pane").keyup(function(n) {
        if (n.keyCode == 27) {
            edit.weblinkHide(7);
        }
    });
    edit.isEditing = 7;
};
edit.weblinkHide = function() {
    if (edit.mediaIndex["weblink"] < 0) {
        // Invalid call
        return;
    }
    var selectorHeader = edit.getSelectorHeader("weblink");
    // Disable input boxes
    $(selectorHeader + "input").prop("disabled", true).off("keyup");
    // Recover onclick event
    $(selectorHeader + "a")
        .attr("onclick", "edit.weblink(" + edit.mediaIndex["weblink"] + ")");
    // Save data
    edit.weblinkSave(edit.mediaIndex["weblink"], 7);
    $("#edit-pane").off("keyup");
    // Hide all the option button
    animation.hideHiddenIcons();
    edit.mediaIndex["weblink"] = -1;
    edit.isEditing = -1;
};
edit.weblinkSave = function(index) {
    var data = localStorage["weblink"],
        selectorHeader = edit.getSelectorHeader("weblink", index),
        title = $(selectorHeader + ".title").val(),
        url = $(selectorHeader + ".desc").val();
    data = data ? JSON.parse(data) : [];
    var newElem = {
        title: title,
        url  : url
    };
    data[index] = newElem;
    localStorage["weblink"] = JSON.stringify(data);
};

/************* GENERIC FOR MUSIC MOVIE & BOOK ***************/

edit.itunes = function(index, typeNum) {
    var type = edit.mediaName(typeNum);
    if (index == edit.mediaIndex[type] || index == undefined) {
        return;
    }
    edit.cleanupMediaEdit();
    edit.mediaIndex[type] = index;
    var selectorHeader = edit.getSelectorHeader(type);
    edit.setRemove(typeNum);
    $(selectorHeader + "a").removeAttr("onclick");
    $(selectorHeader + "input").prop("disabled", false).keyup(function(n) {
        // Press enter to search
        if (n.keyCode == 13) {
            var term = $(selectorHeader + ".title").val() + "%20" + $(
                    selectorHeader + ".desc").val();
            getCoverPhoto(selectorHeader, term, true, typeNum);
        }
    });
    // Press esc to save
    $("#edit-pane").keyup(function(n) {
        if (n.keyCode == 27) {
            edit.itunesHide(typeNum);
        }
    });
    edit.isEditing = typeNum;
};
edit.itunesHide = function(typeNum) {
    var type = edit.mediaName(typeNum);
    if (edit.mediaIndex[type] < 0) {
        // Invalid call
        return;
    }
    var selectorHeader = edit.getSelectorHeader(type);
    // Disable input boxes
    $(selectorHeader + "input").prop("disabled", true).off("keyup");
    // Recover onclick event
    $(selectorHeader + "a")
        .attr("onclick", "edit." + type + "(" + edit.mediaIndex[type] + ")");
    // Save data
    edit.itunesSave(edit.mediaIndex[type], typeNum);
    $("#edit-pane").off("keyup");
    // Hide all the option button
    animation.hideHiddenIcons();
    edit.mediaIndex[type] = -1;
    edit.isEditing = -1;
};
edit.itunesSave = function(index, typeNum) {
    var type = edit.mediaName(typeNum),
        data = localStorage[type],
        selectorHeader = edit.getSelectorHeader(type, index),
        title = $(selectorHeader + ".title").val(),
        author = $(selectorHeader + ".desc").val();
    data = data ? JSON.parse(data) : [];
    var newElem = {
        title : title,
        author: author
    };
    data[index] = newElem;
    localStorage[type] = JSON.stringify(data);
};

/************* GENERIC FOR VOICE & VIDEO ***************/

/**
 * Adds a playable item from the data folder to the edit view (video and audio)
 * This function will simply fetch the data and will not make any difference on
 * OneDrive server
 * @param {Number} typeNum - The type number of the content to be added. 1:
 *     video. 3: voice.
 * @see edit.queue() - This function also uses part of this function. If any
 *     change is made, make sure that function is corresponding change is made
 *     as well
 */
edit.playableSearch = function(typeNum) {
    getTokenCallback(function(token) {
        edit.getDate(function(dateStr) {
            var url = getDataUrlHeader() + "/" + dateStr + ":/children?select=id,name,size,@content.downloadUrl&access_token=" + token;
            animation.log(log.EDIT_PANE_PLAYABLE_SEARCH_START, 1);
            $.ajax({
                    type: "GET",
                    url : url
                })
                .done(function(data, status, xhr) {
                    if (data["@odata.nextLink"]) {
                        // More content available!
                        // Do nothing right now
                        animation.warn(log.EDIT_PANE_TOO_MANY_RESULTS);
                    }
                    var itemList = data["value"],
                        dataGroup;
                    // Set reference to the group
                    switch (typeNum) {
                        case 1:
                            // Video
                            dataGroup = edit.videos;
                            break;
                        case 3:
                            // Voice
                            dataGroup = edit.voices;
                            break;
                        default:
                            // Incorrect use of this method, abort
                            console.log("edit.playableSearch()\tInvalid call");
                            return;
                    }
                    // Iterate to find all the results on the server
                    for (var key = 0, len = itemList.length;
                         key !== len;
                         ++key) {
                        var id = itemList[key]["id"],
                            size = itemList[key]["size"],
                            name = itemList[key]["name"],
                            contentUrl = itemList[key]["@content.downloadUrl"],
                            suffix = name.substring(name.length - 4)
                                .toLowerCase(),
                            elementData = {
                                id      : id,
                                name    : name,
                                title   : name.substring(0, name.length - 4),
                                url     : contentUrl,
                                size    : size,
                                resource: false,
                                change  : true
                            };
                        // Test supported file types, if file is not supported
                        // then restart the loop
                        switch (typeNum) {
                            case 1:
                                // Video
                                if (suffix !== ".mp4") {
                                    continue;
                                }
                                break;
                            case 3:
                                // Voice
                                if (suffix !== ".mp3" && suffix !== ".wav") {
                                    continue;
                                }
                                break;
                        }
                        // Test if this file already exists
                        var newContent = true;
                        for (var i = 0; i !== dataGroup.length; ++i) {
                            if (dataGroup[i]["size"] === size) {
                                // Same file
                                newContent = false;
                                break;
                            }
                        }
                        if (!newContent) {
                            // Not a new content, restart the loop
                            continue;
                        }
                        dataGroup.push(elementData);
                        animation.log(edit.mediaName(typeNum)
                                .capitalize() + log.EDIT_PANE_PLAYABLE_FILE + name + log.EDIT_PANE_PLAYABLE_FILE_ADDED);
                        // Add to the edit pane
                        switch (typeNum) {
                            case 1:
                                // Video
                                // Helper call to edit.media
                                edit.addMedia(-1, {
                                    fileName: name,
                                    url     : contentUrl,
                                    title   : name.substring(0, name.length - 4)
                                });
                                break;
                            case 3:
                                // Voice
                                // Helper call to edit.media
                                edit.addMedia(-3, {
                                    fileName: name,
                                    url     : contentUrl,
                                    title   : name.substring(0, name.length - 4)
                                });
                                break;
                        }
                    }
                    // Right click to select
                    edit.playableSetToggle();
                    animation.log(log.EDIT_PANE_PLAYABLE_SEARCH_END, -1);
                })
                .fail(function(xhr, status, error) {
                    animation.error(log.EDIT_PANE_PLAYABLE_SEARCH_FAILED,
                        error,
                        -1);
                    switch (typeNum) {
                        case 1:
                            // Video
                            animation.warning("#add-video");
                            break;
                        case 3:
                            // Voice
                            animation.warning("#add-voice");
                            break;
                    }
                });
        });
    });
};
/**
 * Sets all video and voice attachments so that their classes will be toggled
 * "change" upon right clicking
 */
edit.playableSetToggle = function() {
    $("#edit-pane .video, #edit-pane .voice").each(function() {
        // Reset the right click bindings
        $(this).off("contextmenu");
        $(this).on("contextmenu", function() {
            // Right click to select the media
            $(this).toggleClass("change");
            // Return false to disable other functionalities
            return false;
        });
    });
};
/**
 * Saves all the playable items. Forward animation.log is required.
 * This function will contact OneDrive server and will upload the data as soon
 * as saving is complete
 * @param {Number} typeNum - The type number of the content to be saved. 1:
 *     video. 3: voice.
 * @param {Function} callback - The callback function to be called after all
 *     the processing is done
 */
edit.playableSave = function(typeNum, callback) {
    edit.getDate(function(dateStr) {
        var resourceDir = "/drive/root:/Apps/Journal/resource/" + app.year,
            contentDir = "/drive/root:/Apps/Journal/data/" + app.year + "/" + dateStr,
            dataGroup,
            localData,
            pending = 0;
        // Transferring all the data
        switch (typeNum) {
            case 1:
                // Video
                dataGroup = edit.videos;
                localData = JSON.parse(localStorage["video"]);
                break;
            case 3:
                dataGroup = edit.voices;
                localData = JSON.parse(localStorage["voice"]);
                break;
            default:
                return;
        }
        // Collect data from HTML element
        $("#attach-area ." + edit.mediaName(typeNum)).each(function() {
            for (var i = 0; i !== dataGroup.length; ++i) {
                if ($(this).children("a").hasClass(dataGroup[i]["name"])) {
                    var match = (dataGroup[i]["resource"] && $(this)
                            .hasClass("resource")) || (!dataGroup[i]["resource"] && $(
                            this).hasClass("data"));
                    // Avoid cross-folder confusion to the files with the same
                    // name
                    if (match) {
                        // Update location setup
                        dataGroup[i]["change"] = $(this).hasClass("change");
                        break;
                    }
                }
            }
        });
        // Sync from localStorage to dataGroup
        for (var i = 0; i !== localData.length; ++i) {
            for (var j = 0; j !== dataGroup.length; ++j) {
                if (localData[i] && localData[i]["fileName"] === dataGroup[j]["name"]) {
                    // Matched
                    dataGroup[j]["title"] = localData[i]["title"];
                    break;
                }
            }
        }
        // Get pending total
        for (var i = 0; i !== dataGroup.length; ++i) {
            if (dataGroup[i]["change"]) {
                ++pending;
            }
        }
        if (pending === 0) {
            // Nothing to be transferred
            // Clean all the data if the user asked for it but did nothing to it
            // Process HTML element
            $("#attach-area ." + edit.mediaName(typeNum)).each(function() {
                if ($(this).hasClass("data")) {
                    // Moved to data
                    $(this).addClass("ignore").empty().fadeOut();
                }
            });
            callback();
        } else {
            getTokenCallback(function(token) {
                animation.log(log.EDIT_PANE_PLAYABLE_SAVE_START + edit.mediaName(
                        typeNum) + log.EDIT_PANE_PLAYABLE_SAVE_START_END, 1);
                for (var i = 0; i !== dataGroup.length; ++i) {
                    if (dataGroup[i]["change"]) {
                        // This element wants to change its location
                        var name = dataGroup[i]["name"],
                            title = dataGroup[i]["title"],
                            id = dataGroup[i]["id"],
                            newName = dateStr + (new Date().getTime() + i) + name.substring(
                                    name.length - 4),
                            path;
                        dataGroup[i]["success"] = false;
                        if (dataGroup[i]["resource"]) {
                            // Wants to be removed, search for the title in the
                            // cache
                            for (var j = 0; j !== localData.length; ++j) {
                                if (localData[j]["fileName"] === name) {
                                    // Find the corresponding name
                                    newName = title + name.substring(name.length - 4);
                                    break;
                                }
                            }
                            path = contentDir;
                        } else {
                            // Wants to be added to the entry
                            path = resourceDir;
                        }
                        var requestJson = {
                            name           : newName,
                            parentReference: {
                                path: path
                            }
                        };
                        // Use id to navigate to the file to avoid coding
                        // problem for utf-8 characters
                        var url;
                        if (id) {
                            url = "https://api.onedrive.com/v1.0/drive/items/" + id + "?select=id,name,size,@content.downloadUrl&access_token=" + token;
                        } else {
                            path = path === resourceDir ? contentDir : resourceDir;
                            url = "https://api.onedrive.com/v1.0" + path + "/" + encodeURI(
                                    name) + "?select=name,size,@content.downloadUrl&access_token=" + token;
                        }
                        $.ajax({
                                type       : "PATCH",
                                url        : url,
                                contentType: "application/json",
                                data       : JSON.stringify(requestJson)
                            })
                            .done(function(data) {
                                --pending;
                                var title = "";
                                for (var j = 0; j !== dataGroup.length; ++j) {
                                    if (dataGroup[j]["id"] === data["id"]) {
                                        // ID matched
                                        title = dataGroup[j]["title"];
                                        dataGroup[j]["success"] = true;
                                        // "resource" is to be changed later
                                        //// dataGroup[j]["resource"] =
                                        // !dataGroup[j]["resource"]; Update
                                        // map
                                        delete journal.archive.map[dataGroup[j]["name"]];
                                        if (!dataGroup[j]["resource"]) {
                                            // If the source is from data, new
                                            // name must be added
                                            var newName = data["name"];
                                            dataGroup[j]["newName"] = newName;
                                            journal.archive.map[newName] = {
                                                id  : data["id"],
                                                size: data["size"],
                                                url : data["@content.downloadUrl"]
                                            };
                                        }
                                        break;
                                    }
                                }
                                animation.log(edit.mediaName(typeNum)
                                        .capitalize() + log.EDIT_PANE_PLAYABLE_FILE + title + log.EDIT_PANE_PLAYABLE_FILE_SAVED);
                            })
                            .fail(function(xhr, status, error) {
                                --pending;
                                animation.warn(log.EDIT_PANE_TRANSFERRED_FAILED,
                                    error,
                                    false);
                                animation.warning("#add-" + edit.mediaName(
                                        typeNum));
                            })
                            .always(function() {
                                if (pending <= 0) {
                                    // Finished all the processing
                                    // Process HTML element
                                    $("#attach-area ." + edit.mediaName(typeNum))
                                        .each(function() {
                                            $(this).removeClass("change");
                                            for (var j = 0;
                                                 j !== dataGroup.length;
                                                 ++j) {
                                                if (!$(this)
                                                        .hasClass("ignore")) {
                                                    if ($(this)
                                                            .children("a")
                                                            .hasClass(dataGroup[j]["name"])) {
                                                        var match = (dataGroup[j]["resource"] && $(
                                                                this)
                                                                .hasClass(
                                                                    "resource")) || (!dataGroup[j]["resource"] && $(
                                                                this)
                                                                .hasClass("data"));
                                                        // Avoid cross-folder
                                                        // confusion to the
                                                        // files with the same
                                                        // name
                                                        if (match) {
                                                            if (dataGroup[j]["success"]) {
                                                                dataGroup[j]["success"] = false;
                                                                dataGroup[j]["resource"] = !dataGroup[j]["resource"];
                                                                // Transfer
                                                                // succeeds,
                                                                // update the
                                                                // class
                                                                if ($(this)
                                                                        .hasClass(
                                                                            "resource")) {
                                                                    $(this)
                                                                        .removeClass(
                                                                            "resource")
                                                                        .addClass(
                                                                            "data");
                                                                } else if ($(
                                                                        this)
                                                                        .hasClass(
                                                                            "data")) {
                                                                    $(this)
                                                                        .removeClass(
                                                                            "data")
                                                                        .addClass(
                                                                            "resource");
                                                                }
                                                                // Also update
                                                                // <a> if a new
                                                                // name is
                                                                // available
                                                                if (dataGroup[j]["newName"]) {
                                                                    dataGroup[j]["name"] = dataGroup[j]["newName"];
                                                                    $(this)
                                                                        .children(
                                                                            "a")
                                                                        .attr(
                                                                            "class",
                                                                            dataGroup[j]["newName"]);
                                                                    // Remove
                                                                    // this
                                                                    delete dataGroup[j]["newName"];
                                                                }
                                                            }
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            if ($(this).hasClass("data")) {
                                                // Moved to data
                                                $(this)
                                                    .addClass("ignore")
                                                    .empty()
                                                    .fadeOut();
                                            }
                                        });
                                    // Process JS data
                                    var cacheData = [];
                                    for (var j = 0;
                                         j !== dataGroup.length;
                                         ++j) {
                                        dataGroup[j]["change"] = false;
                                        if (dataGroup[j]["resource"]) {
                                            // Update local cache
                                            cacheData.push({
                                                fileName: dataGroup[j]["newName"] || dataGroup[j]["name"],
                                                title   : dataGroup[j]["title"]
                                            });
                                        } else {
                                            // Remove unnecessary data member
                                            dataGroup.splice(j, 1);
                                            --j;
                                        }
                                    }
                                    localStorage[edit.mediaName(typeNum)] = JSON.stringify(
                                        cacheData);
                                    animation.log(log.EDIT_PANE_FINISHED_TRANSFER + edit.mediaName(
                                            typeNum) + log.EDIT_PANE_FINISHED_TRANSFER_END,
                                        -1);
                                    callback();
                                }
                            });
                    }
                }
            });
        }
    });
};

/******************************************************************
 ************************ OTHERS **********************************
 ******************************************************************/

/**
 * Capitalizes the first chatacter of a string
 * @returns {String} - The capitalized string
 */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

//endregion

/*****************************************************************************
 *
 *
 *
 *
 *                                  edit.js
 *
 *
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 *
 *
 *
 *                                  app.js
 *
 *
 *
 *
 *****************************************************************************/

//region app.js

window.journal = {};

//(function(window, $) {
journal.archive = {};
journal.archive.data = {};
/** The number of the total media */
journal.archive.media = 0;
/** The map to map the source name to the weblink. Format: {name: {id: xxx, url: xxx, size: xxx}} */
journal.archive.map = {};

window.app = function() {

    //region Private variables

    //endregion

    //region Private functions

    //region Initialilzing data
    var _initializePreloadedTags = function() {
        app.preloadedTags.push("%photo",
            "%video",
            "%music",
            "%voice",
            "%book",
            "%movie",
            "%place",
            "%weblink");
        var tagsArray = app.tag().getIconsInName();
        for (var key = 0; key != tagsArray.length; ++key) {
            app.preloadedTags.push("#" + tagsArray[key]);
        }
    }
    var _initializeQueryTextbox = function(thisApp) {
        var $query = $("#query");
        $query.keyup(function(n) {
                if (n.keyCode == 13) {
                    app.command = $query.val();
                    $query.effect("highlight", {color: "#dddddd"});
                    app.addLoadDataWithFilter(app.command, true);
                }
            })
            // Autocomplete for preloaded tags
            .bind("keydown", function(event) {
                // Don't navigate away from the field on tab when selecting an
                // item
                if (event.keyCode === $.ui.keyCode.TAB && $(this)
                        .autocomplete("instance").menu.active) {
                    event.preventDefault();
                }
            })
            .autocomplete({
                minLength: 1,
                autoFocus: true,
                source   : function(request, response) {
                    // Remove elements that are already there
                    var terms = $("#query").val().split(" "),
                        availableTags = app.preloadedTags.sort();
                    for (var i = 0; i < availableTags.length; ++i) {
                        for (var j = 0; j < terms.length; ++j) {
                            if (availableTags[i] == terms[j]) {
                                // Same element found, remove it
                                terms.splice(j, 1);
                                availableTags.splice(i, 1);
                                break;
                            }
                        }
                    }
                    // Delegate back to autocomplete, but extract the last term
                    response($.ui.autocomplete.filter(availableTags,
                        request.term.split(/ \s*/).pop()));
                },
                focus    : function() {
                    // Prevent value inserted on focus
                    return false;
                },
                select   : function(event, ui) {
                    var terms = this.value.split(/ \s*/);
                    // Remove the current input
                    terms.pop();
                    // Add the selected item
                    terms.push(ui.item.value);
                    // Add placeholder to get the comma-and-space at the end
                    terms.push("");
                    this.value = terms.join(" ");
                    return false;
                }
            });
    }
    var _initializeReformatSummaryTimeOnHover = function() {
        $(document)
            .delegate("#search-result:not(.stats)",
                "mouseover mouseleave",
                function(e) {
                    var $search = $("#search-result");
                    var $total = $("#total-time");

                    if (e.type === "mouseover") {
                        $search.hide();
                        $total.text(Math.floor(app.displayedTime / 60) + ":" + app.displayedTime % 60);
                        $search.fadeIn(500);
                    } else {
                        $search.hide();
                        $total.text(app.displayedTime);
                        $search.fadeIn(500);
                    }
                });
    };
    /**
     * Initialize header info (which refers to the div that displays current
     * year and last updated time of token and journal data
     */
    var _initializeHeaderInfoUpdateOnHover = function() {
        $("#header-info").mouseover(function() {
            // Update #last-updated
            app.readLastUpdated();
            // Update #token-expired-in
            var expiration = parseInt(localStorage["expiration"]),
                expiresIn;
            if (expiration) {
                // A valid cookie number
                var now = new Date().getTime();
                if (expiration > now) {
                    // Yet to be expired
                    expiresIn = archive.list.prototype.date(now - (expiration - now));
                }
            }
            expiresIn = expiresIn || "Expired";
            $("#token-expires-in").html(expiresIn);
        });
    };
    var _initializeNetworkSetup = function() {
// Setup timeout time
        $.ajaxSetup({
            timeout: network.timeOut
        });
        // Setup network monitor
        $(document).ajaxStart(function() {
            network.isAjaxActive = true;
            // By default, just initialize the network bar
            network.init();
        });
        $(document).ajaxStop(function() {
            network.isAjaxActive = false;
            if (network.breakpoint === 0) {
                // Do not destroy it if there are breakpoints
                network.destroy();
            }
        });
    };
    var _initializeIconsAppearance = function() {
// Test if there is any cache
        animation.testCacheIcons();
        animation.testAllSubs();
    };
    //endregion

    //region Load data
    /**
     * Gets the entires that are not in this year and remove invalid entries
     * @returns {Array} - an array of entries not in this year
     */
    var _getEntriesNotInThisYear = function() {
        var queuedYears = [];

        journal.archive.data[app.year] = journal.archive.data[app.year].filter(
            function(entry) {
                if (entry == undefined) {
                    app.yearChange[app.year] = true;
                    // Do not need this one
                    return false;
                }
                // Test if the data is in current `app.year`
                var time = entry["time"],
                    createdYear = new Date(time["created"]).getFullYear(),
                    startYear = new Date(time["created"]).getFullYear();
                // Either the created time or the start time of the entry
                if (createdYear == app.year || startYear == app.year) {
                    return true;
                } else {
                    // Move this entry to a new year, given the created time
                    if (!app.yearQueue[createdYear]) {
                        app.yearQueue[createdYear] = [];
                    }
                    // Add to this year
                    app.yearQueue[createdYear].push(entry);
                    app.yearChange[createdYear] = true;
                    // This year has also been changed
                    app.yearChange[app.year] = true;
                    $("#year").addClass("change");
                    $("#last-updated").addClass("change");
                    // Test for uniqueness
                    if (queuedYears.indexOf(createdYear) === -1) {
                        queuedYears.push(createdYear);
                    }
                    return false;
                }
            });

        return queuedYears;
    };
    /**
     * Add processed years into the archive
     * @param {Array} queuedYears - the queued year to be processed
     */
    var _processQueuedYears = function(queuedYears) {
        animation.log(log.DATA_MOVED_TO_OTHER_YEAR + queuedYears.join(", ") + log.DATA_MOVED_TO_OTHER_YEAR_END);
        // Add to `app.years`
        for (var i = 0; i !== queuedYears.length; ++i) {
            if (app.years.indexOf(queuedYears[i]) === -1) {
                // This year does not exist in `app.years`
                app.years.push(queuedYears[i]);
            }
        }
        // Sort the years
        app.years.sort();
    }
    /**
     * Resets the data and layout to regenerate the layout
     * @param (string} filter - to filter the element that is supposed to be in
     *     the result
     */
    var _resetDataAndLayout = function(filter) {
// Reset animation indentation
        animation.indent = 0;
        // Remove all the child elements and always
        animation.debug(log.CONTENTS_RELOADED);
        animation.testAllSubs();
        console.log("==================Force loaded==================");
        $("#list").empty();
        app.lastLoaded = 0;
        app.lastQualified = -1;
        app.displayedChars = 0;
        app.displayedLines = 0;
        app.displayedNum = 0;
        app.displayedTime = 0;
        app.currentDisplayed = -1;

        app.command = filter;
        app.highlightWords = [];

        $("#query").val(filter);
        $("#total-displayed").text(app.displayedNum);
        $("#total-char").text(app.displayedChars);
        $("#total-line").text(app.displayedLines);
        $("#total-time").text(app.displayedTime);
        $("#year").effect("slide", {direction: "up"}).html(app.year);
        // Show the dot for changed stuff
        if (app.yearChange[app.year]) {
            $("#year").addClass("change");
            $("#last-updated").addClass("change");
        } else {
            $("#year").removeClass("change");
        }

        // Reset every stuff
        for (var key = 0, len = journal.archive.data[app.year].length;
             key != len;
             ++key) {
            journal.archive.data[app.year][key]["processed"] = 0;
        }

        calendar.showContent();
    };

    var _attemptLoadDataFromQueue = function() {
        if (app.yearQueue[app.year]) {
            app.yearChange[app.year] = true;
            // Push to the new data
            journal.archive.data[app.year].push.apply(journal.archive.data[app.year],
                app.yearQueue[app.year]);
            // Then sort it to remove the duplicate
            edit.sortArchive();
            edit.removeDuplicate();
            // Remove the data from the queue
            delete app.yearQueue[app.year];
        }
    }
    var _processQueuedData = function() {
// Test if there are any data in the queue
        _attemptLoadDataFromQueue();

        // Filter out undefined element and entries not belong to this year
        var queuedYears = _getEntriesNotInThisYear();

        if (queuedYears.length > 0) {
            _processQueuedYears(queuedYears);
        }
    }
    /**
     * Load a script and passed in a function
     * @param {object} data - the data to be loaded
     * @param {function} callback - the callback function after the data is
     *     loaded
     * @private
     */
    var _loadData = function(data, callback) {
        // Raw data
        console.log("app.loadScript(): data.length = " + data.length);

        // Get the version of the data
        var version = "", i;
        for (var i = 0; i !== data.length && data[i] != "["; ++i) {
            version += data[i];
        }
        version = parseInt(version);
        if (version) {
            app.version[app.year] = version;
        }

        journal.archive.data[app.year] = app.updateData(JSON.parse(data.substr(i)));
        callback();
    }
    //endregion

    /**
     * The function to be called to reload the layout
     *
     * @param filter - the filter to filter out the data
     * @private
     */
    var _displayDataInList = function(filter) {
        $("#total-entry").text(journal.archive.data[app.year].length);
        ////console.log("Calling app.list(" + filter + ")");
        ////console.log("\t> lastLoaded = " + app.lastLoaded);
        new app.list(filter);
        app.dataLoaded[app.year] = true;
    };

    /**
     * Initialize the calendar
     * @private
     */
    var _initializeCalendar = function() {
        calendar.initView();
    };

    //endregion

    return {
        //region Public variables
        /** The resource folder of all the images/video/music covers, etc. */
        resource        : "resource/",
        monthArray      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        weekArray       : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        /** The year to be displayed */
        year            : new Date().getFullYear(),
        years           : [],
        /** The data to be appended to the year, if this year has not already loaded */
        yearQueue       : {},
        /** The years that have unsaved changes (used for remind the user to upload the data) */
        yearChange      : {},
        /** The number of the pages already loaded */
        lastLoaded      : 0,
        /** The index of the page that is currently being displayed */
        currentDisplayed: -1,
        /** The number of entry displayed */
        displayedNum    : 0,
        /** The number of lines displayed */
        displayedLines  : 0,
        /** The number of characters displayed */
        displayedChars  : 0,
        /** The total of time used on writing all the displayed entries (if appliable), in seconds */
        displayedTime   : 0.0,
        /** The index of the page that last loaded. Set to -1 so that no entry is loaded at the beginning */
        lastQualified   : -1,
        /** The number of pages to be loaded each time */
        pageLoaded      : 1,
        /** Available tags to be searched */
        preloadedTags   : [],
        /** The keyword to be searched */
        command         : "",
        /** A list of words that should be highlighted */
        highlightWords  : [],
        /** The boolean indicates if some mutually exclusive functions should be running if any others are */
        isFunction      : true,
        /** The variable to track the media that do not belong to any entry */
        lostMedia       : [],

        /** Whether the date of this year is loaded */
        dataLoaded : {},
        /** When the data of this year is updated */
        lastUpdated: {},

        /** The data decoding version of this app, integer decimal only */
        version: {
            data: 2
        },

        contentType: {
            BULB: 1
        },
        //endregion

        /**
         * Initializes this app
         */
        initializeApp: function() {
            // Enter to search
            var thisApp = this;
            // Header fix
            showLoginButton();
            // Initialize preloaded tags
            _initializePreloadedTags();

            // Clear the field of search input every time on focus
            _initializeQueryTextbox(thisApp);
            // Change the format of time on hover
            _initializeReformatSummaryTimeOnHover();
            // Hover to update other-status
            _initializeHeaderInfoUpdateOnHover();
            // Set the current year
            $("#year").effect("slide", {direction: "up"});
            app.getYears();
            // Network setup
            _initializeNetworkSetup();
            _initializeIconsAppearance();
            _initializeCalendar();
        },

        /**
         * Reloads the content view of the journal.
         * This function will NOT affect the appearance of calendar
         *
         * @param {String} filter - The string representing the filter of
         *     display
         * @param {String} newContent - The string representing the new content
         *     of journal archive
         * @version 2.0 - Removes param `forceReload` as every call to this
         *     function needs a force reload
         */
        addLoadDataWithFilter: function(filter, newContent) {
            // Test the validity of `newContent`
            if (newContent == "") {
                // Try to add nothing
                ////console.log("addLoadDataWithFilter()\tNo new content!");
                animation.error(log.LOAD_DATA_FAIL + log.NO_CONTENT);
                animation.deny("#refresh-media");
                return;
            } else if (newContent == undefined) {
                // Process the data on this year. Return if this year has
                // nothing at all even after reading data from the queue
                if (!journal.archive.data[app.year]) {
                    journal.archive.data[app.year] = [];
                }

                _processQueuedData();

                if (journal.archive.data[app.year].length === 0) {
                    ////console.log("addLoadDataWithFilter()\tNo archive
                    // data!");
                    animation.warn(log.LOAD_DATA_FAIL + log.NO_ARCHIVE);
                    animation.deny("#refresh-media");
                    return;
                }
            }

            // Reset the UI
            // Hide anyway
            var $search = $("#search-result");
            $search.hide();
            // Also hide the detail view
            app.detail.prototype.hideDetail();
            // Test if #add has sub-menu
            animation.testAllSubs();

            // Try to find the new data (if applicable)
            if (!app.dataLoaded[app.year]) {
                if (newContent) {
                    // New contents available! Refresh the new data
                    animation.debug(log.CONTENTS_NEW + newContent.length + log.CONTENTS_NEW_END);
                    console.log("addLoadDataWithFilter(): data.length = " + newContent.length);
                    _loadData(newContent, function() {
                        _displayDataInList(filter)
                    });
                    edit.saveDataCache();
                }
            }

            // Start to reload, HERE GOES ALL THE DATA RESET
            _resetDataAndLayout(filter);
            _displayDataInList(filter);

            // Show the final result anyway
            $search.fadeIn(500);
        },

        /**
         * Simply refreshes and force reloads the app
         */
        refresh: function() {
            app.addLoadDataWithFilter("");
        },

        updateData: function(data) {
            if (!app.version[app.year]) {
                app.version[app.year] = 1;
            }
            if (app.version[app.year] !== app.version.data) {
                // Let the user know the content is going to be upgraded
                animation.debug(log.CONTENTS_UPGRADING);
                switch (app.version[app.year]) {
                    case 1:
                        // Up to v2
                        // Integrate textTags and iconTags
                        for (var i = 0; i !== data.length; ++i) {
                            var iconTags = data[i]["iconTags"],
                                textTags = data[i]["textTags"];
                            if (iconTags) {
                                // There are iconTags
                                iconTags = app.tag()
                                    .getIconsInNameByVal(iconTags)
                                    .join("|");
                                // Add icon tags to texttags
                                if (textTags) {
                                    textTags += "|" + iconTags;
                                } else {
                                    textTags += iconTags;
                                }
                            }
                            textTags = textTags || "";
                            var tags;
                            if (data[i]["tags"]) {
                                // Append to this
                                tags += "|" + textTags;
                            } else {
                                tags = textTags;
                            }
                            // Delete deprecated tags
                            delete data[i]["icontags"];
                            delete data[i]["textTags"];
                        }
                        app.version[app.year] = 2;
                    // Intentionally omit "break;"
                }
            }
            // Fix the version if something is wrong
            if (app.version[app.year] > app.version.data) {
                app.version[app.year] = app.version.data;
            }
            return data;
        },

        /**
         * Gets all the available year by the folder name under /core/ and
         * stores them in `app.years`, in ascending order (earliest year first)
         */
        getYears: function() {
            animation.log(log.GET_YEARS_START);
            getTokenCallback(function(token) {
                $.ajax({
                        type: "GET",
                        url : "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/core:/children?select=name,createdBy&orderby=name&access_token=" + token
                    })
                    .done(function(data) {
                        var itemList = data["value"];
                        app.years = [];
                        for (var i = 0; i !== itemList.length; ++i) {
                            var name = itemList[i]["name"];
                            // Deliberately not force equal them to test if
                            // `name` is an integer
                            if (parseInt(name) == name) {
                                name = parseInt(name);
                                app.years.push(name);
                                network.yearFolders.push(name);
                            }
                        }
                        app.user = itemList[0]["createdBy"]["user"]["displayName"];
                        $("#username").html(app.user);
                        // If it is the first day of the year and this folder
                        // is not created, add this year to `app.years`
                        if (app.years.indexOf(new Date().getFullYear()) === -1) {
                            // It is supposed to the latest year
                            app.years.push(new Date().getFullYear());
                            // So unnecessary to sort it after push
                        }
                        backupAll();
                        animation.testYearButton();
                        animation.log(log.GET_YEARS_END);
                    })
                    .fail(function(xhr, status, error) {
                        animation.error(log.GET_YEARS_FAIL, error);
                        app.getYears();
                    });
            });
        },

        /**
         * Calls the program to start changing the year, and if the change
         * succeeds, it will call `app.yearUpdate` for further updating.
         * However, this This function will check the correctness of the year
         * passed in, and will automatically download the contents of the data
         * if no data found for this year in the memory.
         * @param {number} year - The year to go
         */
        yearUpdateTry: function(year) {
            app.year = year;
            if (app.years.length === 0) {
                app.years.push(app.year);
            }
            if (!journal.archive.data[year]) {
                // The data is not loaded yet, download the data
                downloadFile(undefined, true);
            } else {
                app.yearUpdate(year);
            }
        },

        /**
         * Change the year of the contents to be displayed, and refreshes the
         * display view (by calling `app.refresh()`). This function does not
         * accept any parameters by using `app.year` to update everything with
         * it. It does NOT check the validness of `app.year`, and will assume
         * that it is a valid one
         * (e.g. the data is already loaded). However, if `app.year` is invalid
         * that
         * `(app.years.indexOf(app.year))` yields -1, `app.year` will be set to
         * this
         * year and it will call `app.yearUpdateTry()`. This function will also
         * correct the buttons for switching between years.
         */
        yearUpdate: function() {
            app.refresh();
            // Test the correctness of the buttons
            animation.testYearButton();
            animation.debug(log.YEAR_SWITCHED_TO + app.year);
        },

        /**
         * Sets the year to the previous year.
         * This function will guarantee the correctness of `app.year`, and will
         * correct it if `app.year` is invalid.
         * @param {boolean} isToEnd - If year goes to the earliest possible year
         */
        prev: function(isToEnd) {
            if (network.isAjaxActive) {
                // Do not switch if network is still working
                animation.warn(log.NETWORK_WORKING);
                return;
            }
            var index = app.years.indexOf(app.year);
            if (index === -1) {
                // Current year is invalid, sets to this year
                app.yearUpdateTry(new Date().getFullYear());
                return;
            }
            if (isToEnd) {
                index = 0;
            } else {
                --index;
            }
            app.yearUpdateTry(app.years[index]);
        },

        /**
         * Sets the year to the next year
         * This function will guarantee the correctless of `app.year`, and will
         * correct it if `app.year` is invalid.
         * @param {boolean} isToEnd - If year goes to the latest year (i.e. this
         *     year)
         */
        next: function(isToEnd) {
            if (network.isAjaxActive) {
                // Do not switch if network is still working
                animation.warn(log.NETWORK_WORKING);
                return;
            }
            var index = app.years.indexOf(app.year);
            if (index === -1) {
                // Current year is invalid, sets to this year
                app.yearUpdateTry(new Date().getFullYear());
                return;
            }
            if (isToEnd) {
                index = app.years.length - 1;
            } else {
                ++index;
            }
            app.yearUpdateTry(app.years[index]);
        },

        /**
         * Updates when the last saved data of `app.year` is updated, given an
         * optioinal timestamp of seconds from epoch
         * @param {number} time (Optional) - the time that marks when the data
         *     is last updated, or set to current time
         */
        updateLastUpdated: function(time) {
            time = parseInt(time) || new Date().getTime();
            app.lastUpdated[app.year] = time;
            if (app.year === new Date().getFullYear()) {
                // This year, also save to cache
                localStorage["lastUpdated"] = new Date().getTime();
            }
            app.readLastUpdated();
        },

        /**
         * Reads the last saved data of `app.year`, or read it from cache if not
         * found
         * (this year only), and displays it on the appropriate area
         */
        readLastUpdated: function() {
            var lastUpdated = app.lastUpdated[app.year];
            if (!lastUpdated) {
                // Test if it is this year
                if (app.year === new Date().getFullYear()) {
                    // Try read it from cache
                    if (localStorage["lastUpdated"]) {
                        lastUpdated = parseInt(localStorage["lastUpdated"]);
                        // Also add it to `app.lastUpdated`
                        app.lastUpdated[app.year] = lastUpdated;
                        lastUpdated = archive.list.prototype.date(lastUpdated);
                    } else {
                        lastUpdated = "N/A";
                    }
                } else {
                    lastUpdated = "N/A";
                }
            } else {
                // Find the last updated time
                lastUpdated = archive.list.prototype.date(lastUpdated);
            }
            $("#last-updated").html(lastUpdated);
        },

        /**
         * Test if the bulb with this timestamp has already been merged into
         * the archive
         * @param timestamp - the timestamp of the bulb
         * @return true if this bulb is already in the journal
         */
        isBulbExist: function(timestamp) {
            // TODO implement it
        },

        /**
         * Adds a bulb into the archive
         * @require content is a valid bulb content
         * @param content - the content of a bulb in bulb._data
         * @param timestamp - the timestamp of the bulb
         */
        addBulb: function(content, timestamp) {
            var body = content["content"] || content["contentRaw"];
            var newData = {
                contentType: app.contentType.BULB,
                time       : {
                    created: timestamp
                },
                text       : {
                    body : body,
                    chars: body.length
                }
            };

            if (content["location"]) {
                newData["place"] = {
                    latitude : content["location"]["lat"],
                    longitude: content["location"]["long"]
                };
                newData["place"]["title"] = content["location"]["name"] || "";
            }

            if (content["website"]) {
                newData["weblink"] = {
                    url: content["website"]
                };
            }

            journal.archive.data[app.year].push(newData);

            $("#year").addClass("change");
            bulb.setIsMerged(timestamp);
        },

        /**
         * Wraps up the integration of bulbs
         * @require called after all the bulbs are downloaded and merged
         */
        finishMergingBulbs: function() {
            animation.log(log.BULB_FETCH_END + (bulb.getTotalAvailableBulbs() - bulb.getMergedBulbCounter() ));

            // Sort the data
            edit.removeDuplicate();
            edit.sortArchive();

            app.refresh();
            bulb.isProcessing = false;

            // Upload the file
            uploadFile(undefined, function() {
                animation.log(log.BULB_REMOVE_MERGED_START);
                bulb.removeUploadedBulbs();
            });
        },

    }

}();


/**
 * Displays a list on the #list
 * @param {String} filter - The request string to display certain filter
 */
app.list = function(filter) {
    ////console.log("Called app.list(" + filter + ")");
    var f = this,
    /* The data loaded */
        data = journal.archive.data[app.year]; // original:[e]
    journal.total = data.length;
    var d = app.cList,
        c = d.children("ul");
    // Load more if the user requests
    if (!this.contents && c.length < 1) {
        d.html("<ul></ul><div class=\"loadmore\"></div>");
        this.contents = d.children("ul");
        this.loadmore = d.children("div.loadmore");
        this.loadmore.on("click", function() {
            ////console.log("> Loadmore clicked");
            f.load(filter);
        });
        this.load(filter);

        // Load all the data at once
        while ($(".loadmore").length != 0) {
            f.load(app.command);
        }

        // Scroll to load more
        d.off("scroll").on("scroll", function() {
            ////console.log("scrollTop() = " + $(this).scrollTop() + ";\t
            // f.contents.height() = " + f.contents.height() + ";\t d.height()
            // = " + d.height());
            if ($(this).scrollTop() > (f.contents.height() - d.height())) {
                if ($(".loadmore").length != 0) {
                    ////console.log("> Loadmore scrolled");
                    f.load(app.command);
                }
            }
        });
    }
};
app.list.prototype = {
    /**
     * Used to cache the query result to avoid multiple processing of the same string
     * Format of each entry: ${queryString}: [${startDate}, ${endDate}]
     */
    queryCache   : {},
    /* Load one qualified entry of the contents from the data */
    load         : function(filter) {
        ////console.log("Call app.list.load(" + filter + ")");
        var currentList = this, // [h]
            contents = journal.archive.data[app.year], // original:[f]
            currentLoaded = app.lastLoaded, // original [g]
            lastQualifiedLoaded = app.lastQualified;

        // Adjust if the number of contents needed to be loaded is more than
        // all the available contents Load the contents
        if (app.lastLoaded >= journal.archive.data[app.year].length) {
            currentLoaded = app.lastLoaded = journal.archive.data[app.year].length - 1;
        }
        contents[currentLoaded].index = currentLoaded;

        filter = this.processFilter(filter);

        // Test if current entry satisfies the filter
        while (true) {
            if (this.qualify(contents[currentLoaded], filter)) {
                var lastTime;
                // Get the time of last clip
                if (lastQualifiedLoaded == -1) {
                    lastTime = 0;
                } else {
                    lastTime = contents[lastQualifiedLoaded].time.start || contents[lastQualifiedLoaded].time.created;
                }
                // Go to load/change html of the content
                currentList.html(journal.archive.data[app.year][currentLoaded],
                    lastTime);
                // Track the index of this data
                lastQualifiedLoaded = currentLoaded;
                // Update other information
                ++app.displayedNum;
                app.displayedChars += contents[currentLoaded].text.chars || 0;
                app.displayedLines += contents[currentLoaded].text.lines || 0;
                if (contents[currentLoaded].time.end) {
                    // Gets the integer part of timeDelta, measured in second
                    var timeDelta = parseInt((contents[currentLoaded].time.end - contents[currentLoaded].time.start) / 60000);
                    if (!isNaN(timeDelta)) {
                        app.displayedTime += timeDelta;
                    }
                }

                // Find the qualified entry, break the loop if scrollbar is not
                // visible yet
                if ($("#list").get(0).scrollHeight == $("#list").height() && ++currentLoaded != journal.total) {
                    continue;
                }
                break;
            } else {
                // Not qualified; add an empty list
                this.htmlEmpty();
                // 1) Increment currentLoaded to try to load the next entry
                // candidate 2) Tests if this is the last entry to be loaded.
                // If so, break the circle
                if (++currentLoaded == journal.total) {
                    // Break out of the loop
                    break;
                }
            }
        }

        // Update the data
        $("#search-result").hide().fadeIn(500);
        $("#total-displayed").text(app.displayedNum);
        $("#total-char").text(app.displayedChars);
        $("#total-line").text(app.displayedLines);
        $("#total-time").text(app.displayedTime);

        // Update loaded contents
        if (++currentLoaded >= journal.total) {
            // Remove load more
            $(".loadmore").remove();
            // Append a sign to indicate all of the entries have been loaded
            $("#list")
                .append("<li><p class=\"separator\"><span>EOF</span></p></li>");
        }
        app.lastQualified = lastQualifiedLoaded;
        app.lastLoaded = currentLoaded;
    },
    /**
     * Pre-process the filter to make it easier to process
     * @param filter - the raw filter to be processed
     * @return Array - an array of filter requirements
     */
    processFilter: function(filter) {
        if (!filter) {
            return [];
        }

        // Clear multiple white spaces
        while (filter.search("  ") != -1) {
            filter = filter.replace("  ", " ");
        }

        var processedFilter = [];

        var andGroups = filter.toLowerCase().split(" ");
        for (var i = 0, len = andGroups.length; i < len; ++i) {
            var orGroups = andGroups[i].split("|"),
                req = {
                    tags       : [],
                    attachments: [],
                    keywords   : []
                };
            for (var j = 0, len2 = orGroups.length; j < len2; ++j) {
                var currentReq = orGroups[j];
                if (currentReq[0] === "#") {
                    req.tags.push(currentReq.substr(1));
                } else if (currentReq[0] === "%") {
                    req.attachments.push(currentReq.substr(1));
                } else if (currentReq[0] === "@") {
                    req.timeRange = currentReq.substr(1);
                } else {
                    req.keywords.push(currentReq);
                    app.highlightWords.push(currentReq);
                }
            }

            processedFilter.push(req);
        }

        return processedFilter;
    },
    /**
     *  */
    /**
     * Checks if this entry satisfies current string filter
     * This function assumes that `processFilter` is called beforehand
     * @param data - the data entry
     * @param filter - the processed filter
     * @returns {boolean}
     */
    qualify      : function(data, filter) {
        /**
         * A helper function to return if two arrays have common elements
         * @param array1
         * @param array2
         */
        var hasCommonElement = function(array1, array2) {
            for (var i = 0; i < array1.length; ++i) {
                if (array2.indexOf(array1[i]) !== -1) {
                    return true;
                }
            }

            return false;
        };

        var tags = (data["tags"] || "").split("|"),
            attachments = app.tag().content(data["attachments"]),
            time = data["time"]["created"];

        for (var i = 0; i < filter.length; ++i) {
            var currentReq = filter[i];

            // Test if time is in range, or tags/attachments match
            if (this.isInRange(filter.timeRange || "", time) ||
                hasCommonElement(tags, currentReq.tags) ||
                hasCommonElement(attachments, currentReq.attachments)) {
                continue;
            }

            // Test if the keywords match
            for (var j = 0; j < current.keywords.length; ++j) {
                if (data["title"].match(new RegExp(current.keywords[j], "i")) ||
                    data["text"]["body"].match(new RegExp(current.keywords[j], "i"))) {
                    break;
                }
            }

            // Nothing matches
            if (j === current.keywords.length) {
                return false;
            }
        }

        return true;
    },
    /**
     * Returns the data string in human-readable format. It will also convert
     * date within the last week
     * @param {number} time - The seconds since epoch
     * @param {boolean} timeOnly - If only returns the time
     * @returns {string} Converted time
     */
    date         : function(time, timeOnly) {
        var date = new Date(time),
            hour = date.getHours(),
            minute = date.getMinutes();
        minute = minute < 10 ? "0" + minute : minute;
        hour = hour < 10 ? "0" + hour : hour;
        // Test for today and yesterday
        if (timeOnly) {
            return hour + ":" + minute;
        } else {
            // Gets the day since the first day of this year
            var year = date.getFullYear(),
                now = new Date(),
                nowYear = now.getFullYear(),
                month = date.getMonth(),
                day = date.getDate(),
                dateHeader;
            if (year === nowYear) {
                var firstDay = new Date(year, 0, 1),
                    yearDay = Math.floor((date - firstDay) / 86400000),
                    nowYearDay = Math.floor((now - firstDay) / 86400000);
                // Test for today and yesterday
                if (yearDay === nowYearDay) {
                    dateHeader = "Today";
                } else if (yearDay + 1 === nowYearDay) {
                    dateHeader = "Yesterday";
                } else {
                    // Test for this week
                    var firstWeekDay = firstDay.getDay(),
                        yearWeek = Math.floor((yearDay - firstWeekDay) / 7),
                        nowYearWeek = Math.floor((nowYearDay - firstWeekDay) / 7);
                    dateHeader = "";
                    switch (nowYearWeek - yearWeek) {
                        case 1:
                            // It was the last week
                            dateHeader = "Last ";
                        // Intentionally omit `break`
                        case 0:
                            // It is this week
                            dateHeader += app.weekArray[date.getDay()];
                            break;
                        default:
                            dateHeader = app.monthArray[month] + " " + day;
                            break;
                    }
                }
            } else {
                dateHeader = app.monthArray[month] + " " + day;
            }
            return dateHeader + " " + hour + ":" + minute;
        }
    },
    /* Converts the content to html and append to the list of contents */
    html         : function(data, lastTime) { // [d]
        // All the summary
        data.summary = data.text.ext || data.text.body.substr(0, 50);

        data.isBulb = 0;

        if (!data.contentType) {
            // Find the cover type
            switch (data.coverType) {
                default:
                    data.type = "text";
                    data.ext = "";
                    // data.ext = "<p>" + data.contentsExt + "</p>";
                    break;
                case 1:
                    data.type = "photo";
                    data.ext = this.thumb(data, "images");
                    break;
                case 2:
                    data.type = "video";
                    data.ext = this.thumb(data, "video");
                    break;
                case 3:
                    data.type = "music";
                    data.ext = this.thumb(data, "music");
                    break;
                case 4:
                    data.type = "voice";
                    data.ext = this.thumb("dummy");
                    break;
                case 5:
                    data.type = "book";
                    data.ext = this.thumb(data, "book");
                    break;
                case 6:
                    data.type = "movie";
                    data.ext = this.thumb(data, "movie");
                    break;
                case 7:
                    data.type = "place";
                    data.ext = this.thumb("dummy");
                    break;
                case 8:
                    data.type = "weblink";
                    data.ext = this.thumb(data, "weblink");
                    break;
            }

            // Get the attached data
            data.attached = this.attached(data.attachments);
        } else if (data.contentType === app.contentType.BULB) {
            data.ext = "";

            // Add bulb property for rendering
            data.isBulb = 1;
        }

        // Get the created time
        var createTime = data.time.start || data.time.created;
        data.datetime = this.date(createTime);
        data.endtime = "";
        if (data.time.end) {
            data.datetime += " - " + this.date(data.time.end, 1);
        }

        // Separator
        data.month = this.isInSameMonth(createTime, lastTime);

        var item = $(app.itemView(data));

        // Bind the click event of this data clip
        item.find(" > a").on("click", function(j) {
            j.preventDefault();
            // Show edit panel
            animation.showMenuOnly("edit");
            // Remove all the photos that have already been loaded
            if (app.photos) {
                app.photos.remove();
            }
            // De-hightlight the data that is displayed
            ////console.log(app.currentDisplayed);
            $("#list")
                .find("ul li:nth-child(" + (app.currentDisplayed + 1) + ") a")
                .removeClass("display");
            // Highlight the data that is now displayed
            $(this).addClass("display");
            // Update the index of the list to be displayed
            var flag = (app.currentDisplayed == $(this).parent().index());
            if (!flag) {
                app.currentDisplayed = $(this).parent().index();
                $("#detail").hide().fadeIn(500);
                app.view = new app.detail();
            }
            return false;
        });

        // The event when clicking the list
        if (data.contentType === app.contentType.BULB) {

        } else {
            $(".thumb > img:not([style])", item).on("load", function() {
                var h = this.naturalWidth || this.width,
                    f = this.naturalHeight || this.height,
                    g = app.util.crop(h, f, 160);
                $(this).css(g);
            });
            $(".thumb > canvas", item).each(function() {
                var g = new Image(),
                    f = this.getContext("2d");
                g.src = $(this).data("src");
                g.onload = function() {
                    var croppedPhoto = app.util.crop(this.width,
                        this.height,
                        160),
                        x = croppedPhoto.marginLeft || 0,
                        y = croppedPhoto.marginTop || 0,
                        width = croppedPhoto.width || 160,
                        height = croppedPhoto.height || 160;
                    f.drawImage(g, x, y, width, height);
                };
            });
        }

        // return item.data("pid",
        // data.pid).addClass(data.type).appendTo(this.contents); //return
        // item.addClass(data.type).appendTo(this.contents);
        var $newClass = item.addClass(data.type).hide();
        this.contents.append($newClass.fadeIn(500));
    },
    /* Add an empty html list */
    htmlEmpty    : function() {
        return $("#list ul").append("<li></li>");
    },
    /*  Get the thumbnail of the contents and returns the html */
    thumb        : function(data, type) {
        var typeContents = data[type],
            returnHtml;
        if (!!typeContents && typeContents.length > 0) {
            // Test if it is a text file
            var first = typeContents[0],
                g = "";
            // Check the validity of the file
            if (!first.fileName) {
                return "<div class=\"dummy\"></div>";
            }
            if (type != "images" && type != "video") {
                // Check the validity of the file
                if (!!first.thumb) {
                    first = first.thumb;
                } else {
                    return "<div class=\"dummy\"></div>";
                }
            }
            ////var width = first.width,
            ////    height = first.height;
            ////if (type == "video") {
            ////	if (first.rotation == 90 || first.rotation == 270) {
            ////		width = first.height;
            ////		height = first.width;
            ////	}
            ////}
            ////var thumbProperties = (width && height) ? app.util.crop(width,
            // height, 160) : {}, Manual data
            var thumbProperties = app.util.crop(1024, 720, 80),
                thumbPropertiesHtml = app.util.style(thumbProperties);
            // Match to see if this filename is already in the map
            var fileName;
            if (type == "images") {
                if (journal.archive.map[first.fileName]) {
                    fileName = journal.archive.map[first.fileName]["url"];
                }
                if (fileName == undefined) {
                    return "<div class=\"dummy\"></div>";
                }
            }
            if (type == "video") {
                if (journal.archive.map[first.fileName + "_thumb.jpg"]) {
                    fileName = journal.archive.map[first.fileName + "_thumb.jpg"]["url"];
                }
                if (fileName == undefined) {
                    return "<div class=\"dummy\"></div>";
                }
            }
            // Check the validity of photos
            ////if (!fileName.match(/.(jpg|png)$/) && !!first.type)
            ////	if (first.type.match(/(png|jpg)/))
            ////		fileName = fileName + "." + first.type;
            ////	else
            ////		return '<div class="dummy"></div>';
            if (thumbPropertiesHtml) {
                thumbPropertiesHtml = " style=\"" + thumbPropertiesHtml + "\"";
            }
            var j = "<img src=\"" + fileName + "\"" + thumbPropertiesHtml + ">";
            if (Modernizr.canvas) {
                j = "<canvas width=\"160\" height=\"160\" data-src=\"" + fileName + "\"></canvas>";
            }
            if (first.urlType > 1 && type == "weblink") {
                g = "<span class=\"weblink-video\"></span>";
            }
            if (type == "video") {
                g = "<span class=\"video-play\"></span>";
            }
            returnHtml = "<div class=\"thumb\">" + j + "" + g + "</div>";
        }
        return returnHtml || "<div class=\"dummy\"></div>";
    },
    /* Attach the attachments the contents have to the content */
    attached     : function(contentFlag) { // [d, h]
        var retArray = [], // [g]
            typeArray = app.tag().content(contentFlag); // [e]
        // Iterate to push all of the contents
        for (var i = 0, len = typeArray.length; i < len; ++i) {
            // Push all of the contents
            retArray.push("<span class=\"" + typeArray[i] + "\"></span>");
        }
        return retArray.join("");
    },
    /*
     Test if the timeStr specified include timeNum.
     The time format should be mmddyy
     Supported time format: @mmddyy:mmddyy @mmddyy @mmyy:mmyy @mmyy
     */
    isInRange    : function(timeStr, timeNum) {
        // Test if it is cached already
        var queryResult = this.queryCache[timeStr];
        if (!queryResult) {
            queryResult = [0, 0];
            var timeArray = timeStr.split(":");
            if (timeArray.length == 1) {
                queryResult = this.getTimeRange(timeArray[0]);
            } else {
                queryResult[0] = this.getTimeRange(timeArray[0])[0];
                queryResult[1] = this.getTimeRange(timeArray[1])[1];
            }
            this.queryCache[timeStr] = queryResult;
        }

        return timeNum >= queryResult[0] && timeNum <= queryResult[1];
    },
    /**
     * A private function, called to return a range specified by timeStr
     * @param timeStr - a time str specificed
     * @return [${startDate}, ${endDate}];
     */
    getTimeRange : function(timeStr) {
        var range = [0, 0];
        if (timeStr.length == 4) {
            var month = parseInt(timeStr.substr(0, 2)),
                year = parseInt(timeStr.substr(2)) + 2000;

            if (!isNaN(month) && !isNaN(year)) {
                range[0] = new Date(year, month - 1).getTime();
                range[1] = new Date(year, month).getTime() - 1;
            }
        } else if (timeStr.length == 6) {
            var month = parseInt(timeStr.substr(0, 2)),
                day = parseInt(timeStr.substr(2, 2)),
                year = parseInt(timeStr.substr(4)) + 2000;

            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                range[0] = new Date(year, month - 1, day).getTime();
                // Because a day has fixed length of seconds
                range[1] = range[0] + 86399999;
            }
        }

        return range;
    },
    /*
     Tests if the months and years are the same.
     Returns an array as [year, month] 0 if are, the month of the new one if not
     */
    /**
     * Tests if two passed-in parameters have the same months. If not, returns
     * the month of the first parameter.
     * @param {number} newTime - The newer time, measured by seconds since
     *     epoch
     * @param {number} oldTime - The older time, measured by seconds since
     *     epoch
     * @returns {number} - The month of `newTime` if two time differs, -1 if
     *     same
     */
    isInSameMonth: function(newTime, oldTime) {
        var newDate = new Date(newTime),
            newMonth = newDate.getMonth();
        // Just initialized
        if (oldTime === 0) {
            return app.monthArray[newMonth];
        }
        var oldDate = new Date(oldTime),
            oldMonth = oldDate.getMonth();
        return oldMonth === newMonth ? -1 : app.monthArray[newMonth];
    }
};

/**
 * Display the detail of the data at current index
 */
app.detail = function() {
    var dataClip = journal.archive.data[app.year][app.currentDisplayed];
    var contents = this.text(dataClip.text.body);

    // Highlight the keyword
    if (app.highlightWords) {
        for (var i = 0; i < app.highlightWords.length; ++i) {
            var re = new RegExp(app.highlightWords[i], "g");
            contents.replace(re, "<span class='highlight'>" + app.highlightWords[i] + "</span>");
        }
    }

    dataClip.contents = contents;
    dataClip.chars = dataClip.text.chars + " Chars";

    if (!dataClip.processed) {
        if (dataClip.contentType === app.contentType.BULB) {
            dataClip.title = "";
            dataClip.weblink = dataClip.weblink || undefined;
            dataClip.place = dataClip.place || undefined;
        } else {
            dataClip.lines = dataClip.text.lines + " Lines";
            if (dataClip.weblink) {
                this.thumb(dataClip, "weblink", 50, 50);
            }
            if (dataClip.book) {
                this.thumb(dataClip, "book", 50, 70);
                for (var i = 0; i !== dataClip["book"].length; ++i) {
                    getCoverPhoto("#detail .book:eq(" + i + ") ",
                        dataClip.book[i].author + " " + dataClip.book[i].title,
                        false,
                        "book");
                }
            }
            if (dataClip.music) {
                this.thumb(dataClip, "music", 50, 50);
                for (var i = 0; i !== dataClip["music"].length; ++i) {
                    getCoverPhoto("#detail .music:eq(" + i + ") ",
                        dataClip.music[i].author + " " + dataClip.music[i].title);
                }
            }
            if (dataClip.movie) {
                this.thumb(dataClip, "movie", 50, 70);
                for (var i = 0; i !== dataClip["movie"].length; ++i) {
                    getCoverPhoto("#detail .movie:eq(" + i + ") ",
                        dataClip.movie[i].author + " " + dataClip.movie[i].title,
                        false,
                        "movie");
                }
            }
            if (dataClip.tags) {
                // Process tags if applicable
                var tags = app.tag().separate(dataClip.tags);
                dataClip.iconTags = tags.iconTags || [];
                dataClip.textTags = tags.textTags || [];
            } else {
                dataClip.iconTags = [];
                dataClip.textTags = [];
            }
            // To avoid undefined error in _.template
            var elements = "video weblink book music movie images voice place textTags iconTags".split(
                " ");
            for (var i = 0, len = elements.length; i < len; ++i) {
                if (dataClip[elements[i]] == undefined) {
                    dataClip[elements[i]] = undefined;
                }
            }
        }
        // Set the clip as processed already
        dataClip.processed = 1;
    }

    var l = $(app.detailView(dataClip));
    // !!!!!HIDE THE CONTENT LISTS!!!!
    app.cDetail.css("display", "inline-block").html(l);
    app.app.addClass("detail-view");
    $(".content.loading").removeClass("loading");
    // Show the button if any images available
    if (dataClip["images"]) {
        $("#menu-show-images").removeClass("hidden");
    } else {
        $("#menu-show-images").addClass("hidden");
    }

    // Click the icons to search
    $(".icontags > span").on("click", function() {
        var tag = app.tag().getNameByHtml(this.className);
        if (tag != "") {
            addLoadDataWithFilter("#" + tag);
        }
    });

    var eachOp = function() {
        var className = $(this).attr("class");
        if (journal.archive.map[className]) {
            $(this)
                .attr("href", journal.archive.map[className]["url"])
                .removeAttr("class");
        }
    };
    $(".lower .video a").each(function(n) {
        // Make sure previous audio player is cleared
        app.videoPlayer.quit();
        var className = $(this).attr("class");
        if (journal.archive.map[className]) {
            var funcName = "app.videoPlayer(\"#app #video-preview\",\"" + journal.archive.map[className]["url"] + "\")";
            $(this).attr("onclick", funcName).removeAttr("class");
        } else {
            animation.error(log.FILE_NOT_LOADED + className + log.DOWNLOAD_PROMPT);
        }
    });
    $(".lower .voice a").each(function(n) {
        // Make sure previous audio player is cleared
        app.audioPlayer.quit();
        var className = $(this).attr("class");
        if (journal.archive.map[className]) {
            var funcName = "app.audioPlayer(\"#detail .content .voice:eq(" + n + ") a\",\"" + journal.archive.map[className]["url"] + "\")";
            $(this).attr("onclick", funcName).removeAttr("class");
        } else {
            animation.error(log.FILE_NOT_LOADED + className + log.DOWNLOAD_PROMPT);
        }
    });
    // Show edit and delete buttons
    $("#edit-this, #delete").removeClass("hidden");
    animation.testAllSubs();
    return dataClip;
};
app.detail.prototype = {
    text            : function(rawText) { // [c]
        // Processes spacial characters
        rawText = this.htmlSpacialChars(rawText);
        // Replace all manual lines to a horizontal line
        rawText = rawText.replace(/\t\t[*]\t[*]\t[*]/g, "<hr>");
        // Replace all \r\n to \n
        rawText = rawText.replace(/\r\n/g, "\n");
        // Replace all manual tabs to real tabs
        rawText = rawText.replace(/\n\t\t/g, "</p><p class=\"t2\">");
        rawText = rawText.replace(/\n\t/g, "</p><p class=\"t1\">");
        // Replace all double lines to a new character
        rawText = rawText.replace(/\n\n/ig, "</p></br><p>");
        // Replace all other single lines to a new line
        rawText = rawText.replace(/\n/ig, "</p><p>");
        return "<p>" + rawText + "</p>";
    },
    // Processes all the spacial characters to html-style characters
    htmlSpacialChars: function(rawText) {
        return rawText.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/'/g, "&#039;")
            .replace(/"/g, "&quot;");
    },
    thumb           : function(dataClip, thumbType, width, height) { // [h, l, d, n]
        // Seems that only the type of music, movie, book, weblink will be
        // passed in
        var thumbClip = dataClip[thumbType]; // [m]
        if (thumbClip && thumbClip.length > 0) {
            thumbClip = thumbClip[0]; // [k]
            // Invalid data
            if (!thumbClip) {
                return false;
            }
            ////var fileData = thumbClip.data, // [j]
            ////styleArray = (fileData.width && fileData.height) ?
            // app.util.crop(fileData.width, fileData.height, width, height) :
            // {}, Manual input
            var styleArray = app.util.crop(1024, 720, width, height),
                styleHtml = app.util.style(styleArray),
            // !!!!!IMPORTANT!!!!! THE DIRECTORY OF THE FILE
                fileDir = app.resource + thumbClip.thumb;
            if (!fileDir.match(/.(jpg|png)$/)) {
                fileDir = fileDir + ".jpg";
            }
            if (styleHtml) {
                styleHtml = " style=\"" + styleHtml + "\"";
            }
            if (!(thumbClip.thumb === undefined)) {
                thumbClip.thumb = "<img src=\"" + fileDir + "\"" + styleHtml + ">";
            }
        }
    },
    /* Hide the detail-view */
    hideDetail      : function() {
        // !!!!!HIDE THE CONTENT LISTS!!!!
        $("#edit-this, #delete").addClass("hidden");
        animation.testAllSubs();
        app.cDetail.css("display", "none").empty();
        app.cList.css("display", "inline-block");
        app.app.removeClass("detail-view");
        //// $(window).off("keyup.detail-key");
        // Remove all the photos
        if (app.photos) {
            app.photos.remove();
        }
    }
};
// Change the layout the main container
app.layout = function() {
    var activeWindow = $(window), // Current active window
        changeWindowSize = function() {
            // Tests the width of current window to enable spaces on the top
            // and the buttom to disappear
            var newHeight = activeWindow.height() - 110;
            app.app.height(newHeight);
            app.contents.height(newHeight);
        };
    changeWindowSize();
    // Seems to refer to some function else
    activeWindow.on("resize", changeWindowSize);
};
// Defines the utility functions for this
app.util = {
    // Fit the picture into an allocated frame (space can be saw)
    fit    : function(width, height, newWidth, newHeight) {
        var l = (newWidth < width) ? newWidth : width,
            g = (newHeight < height) ? newHeight : height;
        var j = Math.ceil((width / height) * g),
            d = Math.ceil(l / (width / height));
        var retArray = {};
        if (width > height) {
            if (newHeight > d) {
                retArray.width = l;
                retArray.height = d;
            } else {
                retArray.width = j;
                retArray.height = g;
            }
        } else {
            if (newWidth > j) {
                retArray.width = j;
                retArray.height = g;
            } else {
                retArray.width = l;
                retArray.height = d;
            }
        }
        return retArray;
    },
    // Crop a picture to FILL all of the spaces allocated
    crop   : function(width, height, newWidth, newHeight) {
        newHeight = newHeight || newWidth;
        var e = Math.ceil((width / height) * newHeight),
            j = Math.ceil(newWidth / (width / height));
        var retArray = {};
        if (width > height) {
            if (newHeight > j) {
                retArray.width = e;
                retArray.height = newHeight;
                retArray.marginLeft = -((e - newWidth) / 2);
            } else {
                retArray.width = newWidth;
                retArray.height = j;
                retArray.marginTop = -((j - newHeight) / 2);
            }
        } else {
            if (width < height) {
                if (newWidth > e) {
                    retArray.width = newWidth;
                    retArray.height = j;
                    retArray.marginTop = -((j - newHeight) / 2);
                } else {
                    retArray.width = e;
                    retArray.height = newHeight;
                    retArray.marginLeft = -((e - newWidth) / 2);
                }
            }
        }
        return retArray;
    },
    // Converts object to html-style and returns the converted code
    style  : function(styleArray) {
        var c = [];
        for (i in styleArray) {
            if (styleArray.hasOwnProperty(i)) {
                c.push(i.replace(/([A-Z])/, "-$1")
                        .toLowerCase() + ":" + (typeof styleArray[i] == "number" ? styleArray[i] + "px" : styleArray[i]));
            }
        }
        return c.join(";");
    },
    // Converts the second to human readable type
    runTime: function(second) {
        if (second && second > 0) {
            second = second / 1000;
            var e = "0",
                c = "";
            if (second >= 60) {
                e = second / 60;
                c = second - (e * 60);
                c = c >= 10 ? Math.ceil(c) : "0" + Math.ceil(c);
            } else {
                c = second >= 10 ? Math.ceil(second) : "0" + Math.ceil(second);
            }
            return e + ":" + c;
        }
    }
};
// Use the power of 2 to store multiple data
app.tag = function() {
    /************************************************************
     * When adding a new element here, please make sure that CSS file is also
     * updated. The maximum integer allowed for JavaScript is 2^53 - 1.
     * However, since `iconTags` is deprecated since version 2 of the tag, this
     * value should no longer be included in the consideration The element
     * added here will be presented as an icon, and    `html` tag means the
     * class of the icon
     ************************************************************/
    var icons = [
            {
                name : "clear",
                value: 1,
                html : "w01"
            }, {
                name : "overcast",
                value: 2,
                html : "w02"
            }, {
                name : "raining",
                value: 4,
                html : "w03"
            }, {
                name : "snowing",
                value: 8,
                html : "w04"
            }, {
                name : "thundering",
                value: 16,
                html : "w05"
            }, {
                name : "windy",
                value: 32,
                html : "w06"
            }, {
                name : "happy",
                value: 1024,
                html : "e01"
            }, {
                name : "notbad",
                value: 2048,
                html : "e02"
            }, {
                name : "surprised",
                value: 4096,
                html : "e03"
            }, {
                name : "sad",
                value: 8192,
                html : "e04"
            }, {
                name : "angry",
                value: 16384,
                html : "e05"
            }, {
                name : "journal",
                value: 32768,
                html : "c01"
            }, {
                name : "thoughts",
                value: 65536,
                html : "c02"
            }, {
                name : "ingress",
                value: 131072,
                html : "c03"
            }, {
                name : "minecraft",
                value: 262144,
                html : "c04"
            }, {
                name : "dream",
                value: 524288,
                html : "c05"
            }, {
                name : "code",
                value: 1048576,
                html : "c06"
            }, {
                name : "letter",
                value: 2097152,
                html : "c07"
            }, {
                name : "handwriting",
                value: 4194304,
                html : "c08"
            }, {
                name : "wechat",
                value: 8388608,
                html : "c09"
            }, {
                name : "friendship",
                value: 16777216,
                html : "c10"
            }, {
                name : "snooker",
                value: -1,
                html : "c11"
            }, {
                name : "skateboard",
                value: -1,
                html : "c12"
            }, {
                name : "relationship",
                value: 33554432,
                html : "s01"
            }, {
                name : "star",
                value: 67108864,
                html : "s02"
            }, {
                name : "food",
                value: 134217728,
                html : "s03"
            }, {
                name : "leisure",
                value: 268435456,
                html : "s04"
            }, {
                name : "info",
                value: 536870912,
                html : "s05"
            }, {
                name : "baby",
                value: 1073741824,
                html : "s06"
            }, {
                name : "fun",
                value: 2147483648,
                html : "s07"
            }, {
                name : "travel",
                value: 4294967296,
                html : "s08"
            }, {
                name : "health",
                value: 8589934592,
                html : "s09"
            }, {
                name : "outfit",
                value: 17179869184,
                html : "s10"
            }, {
                name : "shopping",
                value: 34359738368,
                html : "s11"
            }, {
                name : "pets",
                value: 68719476736,
                html : "s12"
            }, {
                name : "work",
                value: 137438953472,
                html : "s13"
            }, {
                name : "sports",
                value: 274877906944,
                html : "s14"
            }, {
                name : "cook",
                value: 549755813888,
                html : "s15"
            }, {
                name : "makeup",
                value: 1099511627776,
                html : "s16"
            }, {
                name : "home",
                value: 2199023255552,
                html : "s17"
            }, {
                name : "car",
                value: 4398046511104,
                html : "s18"
            }
        ],
        photoVal = 1, // [k]
        videoVal = 2, // [j]
        musicVal = 4, // [w]
        voiceVal = 8, // [I]
        bookVal = 16, // [p]
        movieVal = 32, // [J]
        placeVal = 64, // [h]
        weblinkVal = 128, // [P]
        binaryString = "000000000000000000000000000000000000000000000000000000000000000"; // [c]
    return {
        content            : function(contentFlag) { // [Q, S]
            var retArray = []; // [R]
            if (this.is(contentFlag, photoVal)) {
                retArray.push("photo");
            }
            if (this.is(contentFlag, videoVal)) {
                retArray.push("video");
            }
            if (this.is(contentFlag, musicVal)) {
                retArray.push("music");
            }
            if (this.is(contentFlag, voiceVal)) {
                retArray.push("voice");
            }
            if (this.is(contentFlag, bookVal)) {
                retArray.push("book");
            }
            if (this.is(contentFlag, movieVal)) {
                retArray.push("movie");
            }
            if (this.is(contentFlag, placeVal)) {
                retArray.push("place");
            }
            if (this.is(contentFlag, weblinkVal)) {
                retArray.push("weblink");
            }
            return retArray;
        },
        /**
         * Returns the list of all the icons in html
         * E.g. 9 = 8 + 1, which corresponds to two icons
         * @deprecated This function is only used to decode v1 data
         * @param {number} typeVal - The number of type value
         * @returns {object} The list of all the icons in this value
         */
        getIconsInHtmlByVal: function(typeVal) {
            var retArray = [];
            for (var i = 0; i !== icons.length; ++i) {
                if (this.is(typeVal, icons[i]["value"])) {
                    retArray.push(icons[i]["html"]);
                }
            }
            return retArray;
        },
        /**
         * Returns the list of all the icons in html
         * E.g. 9 = 8 + 1, which corresponds to two icons
         * This function is used to convert v1 data to v2 data
         * @param {number} typeVal - The number of type value
         * @returns {object} The list of all the icons in this value
         */
        getIconsInNameByVal: function(typeVal) {
            var retArray = [];
            for (var i = 0; i !== icons.length; ++i) {
                if (this.is(typeVal, icons[i]["value"])) {
                    retArray.push(icons[i]["name"]);
                }
            }
            return retArray;
        },
        getValueByName     : function(name) {
            return this.translate(name.toLowerCase(), "name", "value");
        },
        getValueByHtml     : function(name) {
            return this.translate(name.toLowerCase(), "html", "value");
        },
        getHtmlByName      : function(name) {
            return this.translate(name.toLowerCase(), "name", "html");
        },
        getNameByHtml      : function(html) {
            return this.translate(html.toLowerCase(), "html", "name");
        },
        getIconsInHtml     : function() {
            return this.getAll("html");
        },
        getIconsInName     : function() {
            return this.getAll("name");
        },
        /**
         * Gets the list of all the type specfied
         * @param {string} type - The specified type
         * @returns {object} The list of all the available tag icons. Empty if
         *     type is invalid
         */
        getAll             : function(type) {
            var retArray = [];
            for (var i = 0; i !== icons.length; ++i) {
                if (icons[i][type]) {
                    retArray.push(icons[i][type]);
                }
            }
            return retArray;
        },
        /**
         * Translates a name of an icon between value, html and human-readable
         * @param {string/number} data - The data to be translated
         * @param {string} source - The source language of the data ("value",
         *     "html", "name")
         * @param {string} target - The target language of the data ("value",
         *     "html", "name")
         * @returns {string} The result if and only if found, empty string
         *     otherwise
         */
        translate          : function(data, source, target) {
            for (var i = 0; i !== icons.length; ++i) {
                if (icons[i][source] && icons[i][target]) {
                    // Intentionally use == instead of ===
                    if (icons[i][source] == data) {
                        return icons[i][target];
                    }
                }
            }
            return "";
        },
        /**
         * Separates a string representation of a list of tags into icontags
         * and texttags
         * @param {string} tags - The tag string, separated by "|"
         * @returns {object} The object with keys of `icontags` and `texttags`
         */
        separate           : function(tags) {
            // Re-process the tags
            // Remove any empty tags
            while (tags.indexOf("||") !== -1) {
                tags = tags.replace(/||/g, "|");
            }
            // Remove the first "|"
            while (tags.length && tags[0] == "|") {
                tags = tags.substr(1);
            }
            // Remove the last "|"
            while (tags.length && tags[tags.length - 1] == "|") {
                tags = tags.substr(0, tags.length - 1);
            }
            var icontags = [],
                texttags = tags.split("|");
            // Iterates from all the icons
            for (var i = 0; i !== icons.length; ++i) {
                // Test if `tags` has this icon
                var index = texttags.indexOf(icons[i]["name"]);
                if (index > -1) {
                    // If it does, push the html name to icontags
                    icontags.push(icons[i]["html"]);
                    // Then remove it from texttags
                    texttags.splice(index, 1);
                }
            }
            return {
                iconTags: icontags,
                textTags: texttags
            };
        },


        /* Set typeVal on typesVal. Return typesVal | typeVal */
        or    : function(typesVal, typeVal) {
            var newVal = this.get(typesVal).split("");
            newVal[this.get(typeVal).indexOf("1")] = "1";
            return parseInt(newVal.join(""), 2);
        },
        andnot: function(typesVal, typeVal) {
            var newVal = this.get(typesVal).split("");
            newVal[this.get(typeVal).indexOf("1")] = "0";
            return parseInt(newVal.join(""), 2);
        },
        // Tests if testValue is in totalValue, i.e. typesVal has type of
        // typeVal
        is    : function(typesVal, typeVal) { // [R, Q]
            return this.get(typesVal)
                    .charAt(this.get(typeVal).indexOf("1")) == "1";
        },
        // Gets the binary value at the length of 64
        get   : function(value) { // [Q]
            return this.substr(binaryString + value.toString(2));
        },
        // Returns the last 64 digits of this string
        substr: function(string) { // [R]
            var len = string.length; // [Q]
            return string.substr(len - 64);
        }
    };
};
/**
 * Shows the images of the entry
 */
app.showEntryImages = function() {
    var data = journal.archive.data[app.year][app.currentDisplayed];
    if (data["images"]) {
        for (var key = 0; key != data["images"].length; ++key) {
            var file = data["images"][key].fileName;
            if (journal.archive.map[file]) {
                $(".upper")
                    .append("<a href=\"" + journal.archive.map[file]["url"] + "\"><span></span><img src=\"" + journal.archive.map[file]["url"] + "\"></a>");
            } else {
                animation.error(log.FILE_NOT_LOADED + file + log.DOWNLOAD_PROMPT);
            }
        }
    }
    $("#menu-show-images").addClass("hidden");
    $(".upper").addClass("expand").mousewheel(function(event, delta) {
        // Only scroll horizontally
        this.scrollLeft -= (delta * 50);
        event.preventDefault();
    });
    ;
    var photos = $(".upper > a", app.cDetail);
    // Activate the photo viewer on click
    if (photos.length > 0) {
        app.photos = new app.PhotoViewer(photos.find(" > img").clone());
        photos.on("click", function(o) {
            o.preventDefault();
            var n = $(this).index();
            app.photos.open(n);
            return false;
        });
    }
}
app.PhotoViewer = function(c, d) {
    if (!c && typeof c != "object") {
        return false;
    }
    this.list = c;
    this.callback = d || function() {
        };
    this.make();
    this.init();
};
app.PhotoViewer.prototype = {
    make  : function() {
        var f = this.list;
        if (f.length > 1) {
            var c = $("<ul>");
        }
        var d = $("<ul class=\"swipe-wrap\">");
        f.each(function(j) {
            $("<li>").html(this).appendTo(d);
            if (!!c) {
                $("<li>")
                    .html("<a href=\"#" + j + "\">" + j + "</a>")
                    .appendTo(c);
            }
        });
        var e = $("<div class=\"wrap swipe\">").html(d);
        var g = $("<div class=\"control\">");
        g.append("<input type=\"button\" value=\"Close\" class=\"btn-close\"/>");
        if (!!c) {
            c.css("width", f.length * 17)
                .wrap("<div class=\"pagination\"/>")
                .parent()
                .appendTo(g);
        }
        e.append(g);
        e.append("<div class=\"background\"></div>");
        var h = $("<div id=\"photoviewer\">").html(e);
        h.appendTo("body");
    },
    init  : function() {
        var c = this;
        this.viewer = $("body > div#photoviewer");
    },
    bind  : function() {
        if (!!this._bind) {
            this.swipe.setup();
            return false;
        }
        var j = this;
        var g = this.viewer = $("body > div#photoviewer");
        this.pagination = $("div.pagination>ul>li", this.viewer);
        var c = g.find(" > div.swipe");
        this.swipe = new Swipe(c[0], {
            continuous   : false,
            callback     : j.callback,
            transitionEnd: function(k) {
                j.paging(k);
            }
        });
        $("input.btn-close", g).on("click", function() {
            j.close();
        });
        var h = c.find(" > ul > li > img");

        function d(n) {
            var k = $(window),
                m = k.width(),
                l = k.height();
            h.each(function() {
                var r = $(this),
                    q = r.context.naturalWidth || r.context.width,
                    o = r.context.naturalHeight || r.context.height,
                    p = j.fit(q, o, m, l);
                r.css(p);
            });
        }

        d();
        $(window).on("resize", d);
        var f = $("div.control", g);
        h.on("click", function() {
            f.fadeToggle(200);
        });
        var e = c.find(" > ul > li");
        e.on("click", function(k) {
            if (this == k.toElement) {
                // Below is the original code. But the minifier reports it can be a bug or something. If anything goes
                // wrong, use the code below: if (k, this == k.toElement) {
                j.close();
            }
        });
        this._bind = 1;
    },
    fit   : function(g, f, e, d) {
        var c = app.util.fit(g, f, e, d);
        if (!$.browser.msie) {
            c.marginLeft = -((c.width / 2) + 10);
            c.marginTop = -((c.height / 2) + 10);
        } else {
            c.marginLeft = -(c.width / 2);
            c.marginTop = -(c.height / 2);
        }
        return c;
    },
    open  : function(c) {
        var c = c || 0,
            e = this,
            d = this.viewer;
        d.css({
            display: "block",
            opacity: 0
        });
        this.bind();
        this.go(c);
        this.paging(c);
        d.css({
            opacity: 1
        }, 200);
        $(window).on("keyup.photoviewer", function(f) {
            if (f.keyCode == 27) {
                e.close();
            } else {
                if (f.keyCode == 37) {
                    e.prev();
                } else {
                    if (f.keyCode == 39) {
                        e.next();
                    }
                }
            }
        });
    },
    close : function() {
        this.viewer.fadeOut(200);
        $(window).off("keyup.photoviewer");
    },
    prev  : function() {
        this.swipe.prev();
    },
    next  : function() {
        this.swipe.next();
    },
    go    : function(c) {
        var c = c || 0;
        this.swipe.slide(c, 1);
    },
    paging: function(c) {
        this.pagination.filter(".active").removeClass("active");
        this.pagination.eq(c).addClass("active");
    },
    remove: function() {
        this.viewer.remove();
    }
};

/**
 * Initializes an audio player within the selector provided
 * @param {String} selector - The selector of the element to embed audio
 *     player, in jQuery style
 * @param {String} source - The url of the source of music file
 */
app.audioPlayer = function(selector, source) {
    if (app.isFunction) {
        app.isFunction = false;
    } else {
        // Do not continue
        animation.warn(log.MEDIA_ALREADY_DISPLAYED);
        return;
    }
    animation.log(log.AUDIO_DOWNLOAD_START, 1);
    $("#play-media")
        .html("&#xf04b")
        .removeClass("play")
        .attr("onclick", "app.audioPlayer.play()");
    $("#stop-media").attr("onclick", "app.audioPlayer.quit()");
    var element = "<div id=\"audioplayer\">" +
        "<audio id=\"music\" preload=\"true\"><source src=\"" + source + "\"></audio>" +
        "<div id=\"music-position\">00:00</div><div id=\"timeline\"><div id=\"playhead\"></div></div><div id=\"music-length\">--:--</div></div>";
    // Add to the document
    $(element).appendTo(selector);
    // Give places to the bar
    $(selector + " p").css("padding-top", "3px");
    app.audioPlayer.music = document.getElementById("music");
    app.audioPlayer.playhead = document.getElementById("playhead");
    app.audioPlayer.timeline = document.getElementById("timeline");
    var duration,
    /* Timeline width adjusted for playhead */
        timelineWidth = timeline.offsetWidth - playhead.offsetWidth,
    /* Boolean value so that mouse is moved on mouseUp only when the playhead is released */
        onplayhead = false;
    app.audioPlayer.formatTime = function(timeNum) {
        var minute = parseInt(timeNum / 60),
            second = parseInt(timeNum % 60);
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;
        return minute + ":" + second;
    }; // Synchronizes playhsead position with current point in audio
    app.audioPlayer.timeUpdate = function() {
        var playPercent = timelineWidth * (music.currentTime / duration);
        playhead.style.marginLeft = playPercent + "px";
        if (music.currentTime === duration) {
            // Replay back
            $("#play-media").html("&#xf04b").removeClass("play");
        } else {
            $("#music-position")
                .html(app.audioPlayer.formatTime(music.currentTime));
        }
    };
    app.audioPlayer.moveplayHead = function(e) {
        var newMargLeft = e.pageX - timeline.getBoundingClientRect().left;
        if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
            playhead.style.marginLeft = newMargLeft + "px";
        }
        if (newMargLeft < 0) {
            playhead.style.marginLeft = "0px";
        }
        if (newMargLeft > timelineWidth) {
            playhead.style.marginLeft = timelineWidth + "px";
        }
    };
    app.audioPlayer.click = function(e) {
        app.audioPlayer.moveplayHead(e);
        // returns click as decimal (.77) of the total timelineWidth
        var clickPercent = (e.pageX - timeline.getBoundingClientRect().left) / timelineWidth;
        music.currentTime = duration * clickPercent;
    };
    app.audioPlayer.mouseDown = function() {
        app.audioPlayer.onplayhead = true;
        window.addEventListener("mousemove",
            app.audioPlayer.moveplayHead,
            true);
        music.removeEventListener("timeupdate",
            app.audioPlayer.timeUpdate,
            false);
    };
    app.audioPlayer.mouseUp = function(e) {
        if (app.audioPlayer.onplayhead) {
            app.audioPlayer.moveplayHead(e);
            window.removeEventListener("mousemove",
                app.audioPlayer.moveplayHead,
                true);
            // returns click as decimal (.77) of the total timelineWidth
            var clickPercent = (e.pageX - timeline.getBoundingClientRect().left) / timelineWidth;
            music.currentTime = duration * clickPercent;
            music.addEventListener("timeupdate",
                app.audioPlayer.timeUpdate,
                false);
        }
        app.audioPlayer.onplayhead = false;
    };
    app.audioPlayer.loadedData = function() {
        animation.log(AUDIO_DOWNLOAD_END, -1);
        // Update the length
        $("#music-length").html(app.audioPlayer.formatTime(music.duration));
        // Hide the fullscreen icon
        $("#toggle-media").addClass("hidden");
        // Show the play icon
        animation.showMenu("media");
    }; // Gets audio file duration
    app.audioPlayer.music.addEventListener("canplaythrough", function() {
        duration = app.audioPlayer.music.duration;
    }, false);
    // timeupdate event listener
    app.audioPlayer.music.addEventListener("timeupdate",
        app.audioPlayer.timeUpdate,
        false);
    app.audioPlayer.music.addEventListener("loadedmetadata",
        app.audioPlayer.loadedData);

    //Makes timeline clickable
    app.audioPlayer.timeline.addEventListener("click",
        app.audioPlayer.click,
        false);
    // Makes playhead draggable
    app.audioPlayer.playhead.addEventListener("mousedown",
        app.audioPlayer.mouseDown,
        false);
    window.addEventListener("mouseup", app.audioPlayer.mouseUp, false);
};
/**
 * Handles the play and pause of the audio player after loading
 */
app.audioPlayer.play = function() {
    // Test if the media is playing
    if ($("#play-media").hasClass("play")) {
        // Is playing
        music.pause();
        $("#play-media").html("&#xf04b").removeClass("play");
    } else {
        if (isNaN(music.duration)) {
            // Address expires
            animation.error(log.AUDIO_EXPIRED);
            return false;
        }
        // Is pausing
        music.play();
        $("#play-media").html("&#xf04c").addClass("play");
    }
};
/**
 * Quits and gracefully removes all the traces of audio player
 * @param {String} selector - The selector of the element to embed audio
 *     player, in jQuery style
 * @param {String} source - The url of the source of music file
 */
app.audioPlayer.quit = function() {
    $("#play-media").html("&#xf04b").removeClass("play");
    // Remove audioplayer
    $("#audioplayer").fadeOut(400, function() {
        $(this).remove();
    });
    // Reset the css
    $("#detail .content .voice p").css("padding-top", "");
    // Reset this variable
    app.isFunction = true;
    // Unbine all the action listener
    if (app.audioPlayer.music) {
        app.audioPlayer.music.removeEventListener("timeupdate",
            app.audioPlayer.timeUpdate);
        app.audioPlayer.music.removeEventListener("loadedmetadata",
            app.audioPlayer.loadedData);
    }
    if (app.audioPlayer.timeline) {
        app.audioPlayer.timeline.removeEventListener("click",
            app.audioPlayer.click);
    }
    if (app.audioPlayer.playhead) {
        app.audioPlayer.playhead.removeEventListener("mousedown",
            app.audioPlayer.mouseDown);
    }
    window.removeEventListener("mouseup", app.audioPlayer.mouseUp);
    animation.hideMenu("media");
};
/**
 * Initializes a video player within the selector provided
 * @param {String} selector - The selector of the element to embed video
 *     player, in jQuery style
 * @param {String} source - The url of the source of video file
 */
app.videoPlayer = function(selector, source) {
    if (app.isFunction) {
        app.isFunction = false;
    } else {
        // Do not continue
        animation.warn(log.MEDIA_ALREADY_DISPLAYED);
        return;
    }
    animation.log(log.VIDEO_DOWNLOAD_START, 1);
    $(selector).fadeIn();
    $("#play-media")
        .html("&#xf04b")
        .removeClass("play")
        .attr("onclick", "app.videoPlayer.play()");
    $("#stop-media").attr("onclick", "app.videoPlayer.quit()");
    var element = "<div id=\"videoplayer\">" +
        "<video id=\"video\" preload=\"true\"><source src=\"" + source + "\"></video>" +
        "<div id=\"video-position\">00:00</div><div id=\"timeline\"><div id=\"playhead\"></div></div><div id=\"video-length\">--:--</div></div>";
    // Add to the document
    $(element).appendTo(selector);
    // Give places to the bar
    app.videoPlayer.video = document.getElementById("video");
    app.videoPlayer.playhead = document.getElementById("playhead");
    app.videoPlayer.timeline = document.getElementById("timeline");
    var duration,
    /* Timeline width adjusted for playhead */
        timelineWidth,
    /* Boolean value so that mouse is moved on mouseUp only when the playhead is released */
        onplayhead = false;
    app.videoPlayer.formatTime = function(timeNum) {
        var minute = parseInt(timeNum / 60),
            second = parseInt(timeNum % 60);
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;
        return minute + ":" + second;
    }; // Synchronizes playhsead position with current point in audio
    app.videoPlayer.timeUpdate = function() {
        var playPercent = timelineWidth * (video.currentTime / duration);
        playhead.style.marginLeft = playPercent + "px";
        if (video.currentTime === duration) {
            // Replay back
            $("#play-media").html("&#xf04b").removeClass("play");
        } else {
            $("#video-position")
                .html(app.videoPlayer.formatTime(video.currentTime));
        }
    };
    app.videoPlayer.moveplayHead = function(e) {
        var newMargLeft = e.pageX - timeline.getBoundingClientRect().left;
        if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
            playhead.style.marginLeft = newMargLeft + "px";
        }
        if (newMargLeft < 0) {
            playhead.style.marginLeft = "0px";
        }
        if (newMargLeft > timelineWidth) {
            playhead.style.marginLeft = timelineWidth + "px";
        }
    };
    app.videoPlayer.click = function(e) {
        app.videoPlayer.moveplayHead(e);
        // returns click as decimal (.77) of the total timelineWidth
        var clickPercent = (e.pageX - timeline.getBoundingClientRect().left) / timelineWidth;
        video.currentTime = duration * clickPercent;
    };
    app.videoPlayer.mouseDown = function() {
        app.videoPlayer.onplayhead = true;
        window.addEventListener("mousemove",
            app.videoPlayer.moveplayHead,
            true);
        video.removeEventListener("timeupdate",
            app.videoPlayer.timeUpdate,
            false);
    };
    app.videoPlayer.mouseUp = function(e) {
        if (app.videoPlayer.onplayhead) {
            app.videoPlayer.moveplayHead(e);
            window.removeEventListener("mousemove",
                app.videoPlayer.moveplayHead,
                true);
            // returns click as decimal (.77) of the total timelineWidth
            var clickPercent = (e.pageX - timeline.getBoundingClientRect().left) / timelineWidth;
            video.currentTime = duration * clickPercent;
            video.addEventListener("timeupdate",
                app.videoPlayer.timeUpdate,
                false);
        }
        app.videoPlayer.onplayhead = false;
    };
    app.videoPlayer.loadedData = function() {
        animation.log(log.VIDEO_DOWNLOAD_END, -1);
        // Change the height
        if (app.videoPlayer.height != undefined) {
            $("#videoplayer").css("height", app.videoPlayer.height);
        } else {
            $("#videoplayer").css("height", "450px");
        }
        // Update the length
        $("#video-length").html(app.videoPlayer.formatTime(video.duration));
        // Show the fullscreen menu
        $("#toggle-media").removeClass("hidden");
        // Show the play icons
        animation.showMenu("media");
        // Show the control
        $("#video-position, #video-length, #timeline")
            .fadeIn()
            .css("display", "inline-block");
        // Recalculate the width
        timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
        if (this.toggle) {
            this.toggle.isFullScreen = false;
            this.toggle.windowSelector = undefined;
        }
        $("#toggle-media").html("&#xf065");
    }; // Gets audio file duration
    app.videoPlayer.video.addEventListener("canplaythrough", function() {
        duration = app.videoPlayer.video.duration;
    }, false);
    // timeupdate event listener
    app.videoPlayer.video.addEventListener("timeupdate",
        app.videoPlayer.timeUpdate,
        false);
    app.videoPlayer.video.addEventListener("loadedmetadata",
        app.videoPlayer.loadedData);

    //Makes timeline clickable
    app.videoPlayer.timeline.addEventListener("click",
        app.videoPlayer.click,
        false);
    // Makes playhead draggable
    app.videoPlayer.playhead.addEventListener("mousedown",
        app.videoPlayer.mouseDown,
        false);
    window.addEventListener("mouseup", app.videoPlayer.mouseUp, false);
};
/**
 * Toggles the fullscreen of the videoplayer.
 * This function will determine if the video is fullscreen by a static variable
 * inside function
 */
app.videoPlayer.toggle = function() {
    if (this.toggle.isFullScreen) {
        // Switch to window mode
        if (this.toggle.windowSelector) {
            $("#video-fullscreen").fadeOut();
            // Move child
            $(this.toggle.windowSelector)
                .append($("#videoplayer").css("height", "450px"));
            // Change the icon
            $("#toggle-media").html("&#xf065");
        } else {
            // Invalid call
            animation.error(
                "Program error: no app.videoPlayer.toggle.windowSelector");
        }
        this.toggle.isFullScreen = false;
    } else {
        // Go fullscreen
        this.toggle.windowSelector = $("#videoplayer").parent();
        // Move child
        $("#video-fullscreen")
            .fadeIn()
            .append($("#videoplayer")
                .css("height", "-webkit-calc(100% - 25px)"));
        // Go fullscreen
        $("#toggle-media").html("&#xf066");
        this.toggle.isFullScreen = true;
    }
};
/**
 * Handles the play and pause of the vedio player after loading
 */
app.videoPlayer.play = function() {
    // Test if the media is playing
    if ($("#play-media").hasClass("play")) {
        // Is playing
        video.pause();
        $("#play-media").html("&#xf04b").removeClass("play");
    } else {
        if (isNaN(video.duration)) {
            // Address expires
            animation.error(log.VIDEO_EXPIRED);
            return false;
        }
        // Is pausing
        video.play();
        $("#play-media").html("&#xf04c").addClass("play");
    }
};
/**
 * Quits and gracefully removes all the traces of video player
 * @param {String} selector - The selector of the element to embed video
 *     player, in jQuery style
 * @param {String} source - The url of the source of video file
 */
app.videoPlayer.quit = function() {
    $("#play-media").html("&#xf04b").removeClass("play");
    // Remove videoplayer
    $("#videoplayer").fadeOut(400, function() {
        $(this).remove();
    });
    // Reset this variable
    app.isFunction = true;
    // Unbine all the action listener
    if (app.videoPlayer.video) {
        app.videoPlayer.video.removeEventListener("timeupdate",
            app.videoPlayer.timeUpdate);
        app.videoPlayer.video.removeEventListener("loadedmetadata",
            app.videoPlayer.loadedData);
    }
    if (app.videoPlayer.timeline) {
        app.videoPlayer.timeline.removeEventListener("click",
            app.videoPlayer.click);
    }
    if (app.videoPlayer.playhead) {
        app.videoPlayer.playhead.removeEventListener("mousedown",
            app.videoPlayer.mouseDown);
    }
    window.removeEventListener("mouseup", app.videoPlayer.mouseUp);
    animation.hideMenu("media");
    $("#toggle-media").html("&#xf065");
    $("#video-fullscreen").fadeOut();
    this.toggle.isFullScreen = false;
    this.toggle.windowSelector = undefined;
};

/**
 * Checks if there are any lost media (i.e. the media not connected to any
 * entry), and store that data in app.lostMedia There are two kinds of lost
 * media. One can be the one in the /resource but not connected to any entry.
 * The other can be the media that claimed to be existing in /resource but in
 * fact it does not
 */
app.checkResource = function() {
    // Test if the necessary file is ready
    if (Object.keys(journal.archive.map).length === 0) {
        animation.error(log.MEDIA_CLEAN_NOT_FOUND + log.DOWNLOAD_PROMPT);
        return;
    }
    var allMedia = Object.keys(journal.archive.map),
        groups = ["images", "video", "voice"],
        undefMedia = 0;
    // Iterate to find any media that is not contained in archive.data
    for (var i = 0, length = journal.archive.data[app.year].length;
         i !== length;
         ++i) {
        var dataClip = journal.archive.data[app.year][i];
        // Iterate to find all the media in different groups
        for (var j = 0; j !== groups.length; ++j) {
            if (dataClip[groups[j]]) {
                // Iterate to process all the media within the same group
                for (var k = 0; k < dataClip[groups[j]].length; ++k) {
                    var index = allMedia.indexOf(dataClip[groups[j]][k]["fileName"]);
                    if (index === -1) {
                        // Element existed in the entry is not found in
                        // /resource
                        ++undefMedia;
                        dataClip[groups[j]].splice(k, 1);
                        --k;
                    } else {
                        // Remove this element from allMedia because this file
                        // is matched
                        allMedia.splice(index, 1);
                    }
                }
            }
        }
    }
    // Empty lostMedia
    app.lostMedia = [];
    // Now the elements still in allMedia are also lost media
    for (var i = 0; i !== allMedia.length; ++i) {
        app.lostMedia.push(allMedia[i]);
    }
    // Report the result
    // "Real" lost media
    if (app.lostMedia.length === 0) {
        animation.log(log.MEDIA_CLEAN_NOT_FOUND);
    } else {
        animation.log(app.lostMedia.length + log.MEDIA_CLEAN_FOUND);
    }
    // Undefined media in the entry
    if (undefMedia === 0) {
        animation.log(log.MEDIA_CLEAN_UNDEFINED_NOT_FOUND);
    } else {
        animation.log(undefMedia + log.MEDIA_CLEAN_UNDEFINED_FOUND);
        app.refresh();
    }
    // Show the button for furthur actions
    animation.showIcon("#return-lost-media");
};

/**
 * Cleans the resource folder and moves those files that are not collected back
 * to their date folder according to the file name, after app.checkResource()
 * is run
 */
app.cleanResource = function() {
    // Test if the required variable is needed
    if (app.lostMedia.length === 0) {
        animation.error(log.MEDIA_CLEAN_NO_DATA);
    } else {
        animation.log(log.MEDIA_CLEAN_START);
        // Move to their folder according to their names
        getTokenCallback(function(token) {
            // Finds all the available folder names
            $.ajax({
                type: "GET",
                url : getDataUrlHeader() + ":/children?select=name&top=500&access_token=" + token
            }).done(function(data) {
                    var itemList = data["value"],
                        folders = [];
                    for (var i = 0, len = itemList.length; i !== len; ++i) {
                        folders.push(itemList[i]["name"]);
                    }
                    // Keep processing the lost media
                    var done = 0,
                        fail = 0;
                    for (var i = 0; i !== lostMedia.length; ++i) {
                        // Get the first six letters. Assume them to be the
                        // folder name
                        var path = lostMedia[i].substring(0, 6);
                        if (folders.indexOf(path) === -1) {
                            // An invalid folder path, redirect it to /queue
                            path = "queue";
                        } else {
                            path = "data/" + path;
                        }
                        path = "/drive/root:/Apps/Journal/" + path;
                        var requestJson = {
                                parentReference: {
                                    path: path
                                }
                            },
                            id = journal.archive.map[lostMedia[i]]["id"],
                        /* The url to find the media to be moved */
                            url;
                        if (id) {
                            url = "https://api.onedrive.com/v1.0/drive/items/" + id + "?select=id,@content.downloadUrl&access_token=" + token;
                        } else {
                            url = getResourceUrlHeader(true) + "/" + encodeURI(
                                    lostMedia[i]) + "/" + "?select=id,@content.downloadUrl&access_token=" + token;
                        }
                        // Trying to send to the folder
                        $.ajax({
                                type       : "PATCH",
                                url        : url,
                                contentType: "application/json",
                                data       : JSON.stringify(requestJson)
                            })
                            .done(function() {
                                // Placeholder, do nothing
                            })
                            .fail(function() {
                                // Add the counter for the failure
                                ++fail;
                            })
                            .always(function() {
                                if (++done === app.lostMedia.length) {
                                    // All finished
                                    // Print fail info
                                    if (fail > 0) {
                                        animation.log(fail + log.MEDIA_CLEAN_FAIL);
                                    } else {
                                        animation.log(log.MEDIA_CLEAN_SUCCESS);
                                    }
                                    // Empty the list
                                    app.lostMedia = [];
                                }
                            });
                    }
                })
                .fail(function(xhr, status, error) {
                    animation.error(log.MEDIA_CLEAN_GET_FOLDERS_FAIL,
                        error,
                        -1);
                });
        });
    }
}


$(document).ready(function() {
    app.app = $("div#app");
    app.contents = app.app.find(" > #contents");
    app.cList = app.app.find(" > #contents > #list");
    app.cDetail = app.app.find(" > #contents > #detail");
    app.itemView = _.template($("#list-view").html());
    app.detailView = _.template($("#detail-view").html());
    calendar.viewTemplate = _.template($("#calendar-view").html());
    app.layout();
    app.initializeApp();
    archive.itemView = _.template($("#archive-view").html());
    archive.detailView = _.template($("#archive-detail-view").html());
});

//endregion

/*****************************************************************************
 *
 *
 *
 *
 *                                  app.js
 *
 *
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 *
 *
 *
 *                                  archive.js
 *
 *
 *
 *
 *****************************************************************************/

//region archive.js

/* Defines the archive operation */

window.archive = {};

archive.data = [];
archive.displayId = "";
archive.isDisplayed = false;

archive.lastLoaded = 0;
archive.currentDisplayed = -1;

archive.confirmName = "";

/**
 * Initializes the archive view with a selector of the caller of this function
 * @param {String} selector - The string of selector
 */
archive.init = function(selector) {
    $(selector).addClass("spinr");
    archive.contents = undefined;
    archive.data = [];
    archive.confirmName = "";
    // Get the data from the server
    getTokenCallback(function(token) {
        animation.log(log.ARCHIVE_START, 1);
        $.ajax({
                type: "GET",
                url : "https://api.onedrive.com/v1.0/drive/special/approot:/core/" + app.year + ":/children?select=id,name,size,createdDateTime,lastModifiedDateTime,@content.downloadUrl&top=500&orderby=lastModifiedDateTime%20desc&access_token=" + token
            })
            .done(function(data, status, xhr) {
                if (data["@odata.nextLink"]) {
                    animation.warn(log.ARCHIVE_TOO_MANY);
                }
                animation.log(log.ARCHIVE_END, -1);
                var itemList = data["value"];
                for (var key = 0, len = itemList.length; key !== len; ++key) {
                    var name = itemList[key]["name"];
                    // Filter the .js files only, and data.js shouldn't be
                    // included
                    if ((name.substring(0, 4) === "data" || name.substring(0,
                            5) === "_data") && name.substring(name.length - 3) === ".js" && name !== "data.js") {
                        var dataElement = {
                            name     : name,
                            id       : itemList[key]["id"],
                            url      : itemList[key]["@content.downloadUrl"],
                            size     : itemList[key]["size"],
                            created  : Date.parse(itemList[key]["createdDateTime"]),
                            modified : Date.parse(itemList[key]["lastModifiedDateTime"]),
                            selected : false,
                            processed: false,
                            protect  : false
                        };
                        if (name.substring(0, 1) === "_") {
                            // Protected data
                            dataElement["protect"] = true;
                        }
                        archive.data.push(dataElement);
                    }
                }
                app.audioPlayer.quit();
                // Clean both list and detail
                $("#list").empty();
                $("#detail").empty();
                // Display the result
                archive.isDisplayed = true;
                archive.lastLoaded = 0;
                animation.showMenuOnly("archive");
                // Hide searchbox
                $("#search-new, #search-result").fadeOut();
                archive.load();
            })
            .fail(function(xhr, status, error) {
                animation.error(log.FILES_NOT_FOUND, error, -1);
            })
            .always(function() {
                $(selector).removeClass("spinr");
            });
    });
};

/**
 * Reloads the content view of the journal.
 */
archive.load = function() {
    // Hide anyway
    $("#search-result").hide();
    // Also hide the detail view
    archive.detail.prototype.hideDetail();
    // Remove all the child elements and always
    $("#list").empty();
    archive.lastLoaded = 0;
    archive.currentDisplayed = -1;
    // Refresh every stuff
    for (var key = 0, len = archive.data.length; key !== len; ++key) {
        archive.data[key]["processed"] = false;
    }
    new archive.list();
    archive.dataLoaded = true;
};

archive.list = function() {
    ////console.log("Called archive.list(" +  + ")");
    var f = this,
        d = app.cList,
        c = d.children("ul");
    // Load more if the user requests
    if (!this.contents && c.length < 1) {
        d.html("<ul></ul><div class=\"loadmore\"></div>");
        this.contents = d.children("ul");
        this.loadmore = d.children("div.loadmore");
        this.loadmore.on("click", function() {
            f.load();
        });
        this.load();
        // Scroll to load more
        d.off("scroll").on("scroll", function() {
            if ($(this).scrollTop() > (f.contents.height() - d.height())) {
                if ($(".loadmore").length !== 0) {
                    f.load();
                }
            }
        });
    }
};
archive.list.prototype = {
    /**
     * Load one qualified entry of the contents from the data until the
     * scrollbar appears
     */
    load: function() {
        ////console.log("Call archive.list.load(" + filter + ")");
        var contents = archive.data,
            currentLoaded = archive.lastLoaded;
        // Adjust if the number of contents needed to be loaded is more than
        // all the available contents
        if (archive.lastLoaded >= archive.data.length) {
            currentLoaded = archive.lastLoaded = archive.data.length - 1;
        }
        // Load the contents
        contents[currentLoaded].index = currentLoaded;
        // Test if current entry satisfies the filter
        while (true) {
            var data = archive.data[currentLoaded];
            archive.data[currentLoaded]["created"] = this.date(data["created"]);
            archive.data[currentLoaded]["modified"] = this.date(data["modified"]);
            this.html(data);
            ++currentLoaded;
            // Find the qualified entry, break the loop if scrollbar is not
            // visible yet
            if ($("#list").get(0).scrollHeight == $("#list")
                    .height() && currentLoaded < archive.data.length) {
                continue;
            }
            break;
        }
        // Update loaded contents
        if (++currentLoaded >= archive.data.length) {
            // Remove load more
            $(".loadmore").remove();
            // Append a sign to indicate all of the entries have been loaded
            $("#list")
                .append("<li><p class=\"separator\"><span>EOF</span></p></li>");
        }
        archive.lastLoaded = currentLoaded;
    },
    /**
     * Returns the data string in human-readable format. It will also convert
     * date within the last week
     * @param {number} time - The seconds since epoch
     * @param {boolean} timeOnly - If only returns the time
     * @returns {string} Converted time
     */
    date: function(time) {
        if (typeof time !== "number") {
            return "";
        }
        var date = new Date(time),
            hour = date.getHours(),
            minute = date.getMinutes();
        // Gets the day since the first day of this year
        var year = date.getFullYear(),
            now = new Date(),
            nowYear = now.getFullYear(),
            month = date.getMonth(),
            day = date.getDate(),
            dateHeader;
        if (year === nowYear) {
            var firstDay = new Date(year, 0, 1),
                yearDay = Math.floor((date - firstDay) / 86400000),
                nowYearDay = Math.floor((now - firstDay) / 86400000);
            // Test for today and yesterday
            if (yearDay === nowYearDay) {
                // Test for hours
                var deltaMinutes = Math.floor((now - date) / 60000);
                if (deltaMinutes === 0) {
                    return "Just now";
                } else if (deltaMinutes < 60) {
                    // Within an hour
                    return deltaMinutes + " min";
                } else {
                    // Within today
                    return Math.floor(deltaMinutes / 60) + " hr";
                }
            } else if (yearDay + 1 === nowYearDay) {
                dateHeader = "Yesterday";
            } else {
                // Test for this week
                var firstWeekDay = firstDay.getDay(),
                    yearWeek = Math.floor((yearDay - firstWeekDay) / 7),
                    nowYearWeek = Math.floor((nowYearDay - firstWeekDay) / 7);
                dateHeader = "";
                switch (nowYearWeek - yearWeek) {
                    case 1:
                        // It was the last week
                        dateHeader = "Last ";
                    // Intentionally omit `break`
                    case 0:
                        // It is this week
                        dateHeader += app.weekArray[date.getDay()];
                        break;
                    default:
                        dateHeader = app.monthArray[month] + " " + day;
                        break;
                }
            }
        } else {
            dateHeader = app.monthArray[month] + " " + day;
        }
        minute = minute < 10 ? "0" + minute : minute;
        hour = hour < 10 ? "0" + hour : hour;
        return dateHeader + " " + hour + ":" + minute;
    },
    /**
     * Converts the content to html and append to the list of contents
     * @param {Object} data - The data to be appended
     */
    html: function(data) { // [d]
        var item = $(archive.itemView(data));
        // The event when clicking the list
        item.find(" > a").on("click", function(j) {
            j.preventDefault();
            // Hide restore icon
            animation.hideHiddenIcons();
            // De-hightlight the data that is displayed
            ////console.log(archive.currentDisplayed);
            $("#list ul li:nth-child(" + (archive.currentDisplayed + 1) + ") a")
                .removeClass("display");
            // Highlight the data that is now displayed
            $(this).addClass("display");
            // Update the index of the list to be displayed
            var flag = (archive.currentDisplayed == $(this).parent().index());
            if (!flag) {
                archive.currentDisplayed = $(this).parent().index();
                $("#detail").hide();
                archive.view = new archive.detail();
            }
            return false;
        }).on("contextmenu", function() {
            // Right click to select the archive list
            $(this).toggleClass("change");
            // Return false to disable other functionalities
            return false;
        });
        var $newClass = item.hide();
        this.contents.append($newClass.fadeIn(500));
    }
};

archive.detail = function() {
    var dataClip = archive.data[archive.currentDisplayed];
    if (!dataClip.processed) {
        animation.log(log.CONTENTS_DOWNLOAD_START, 1);
        // Add loading icon
        $("#list").addClass("loading");
        var t = this;
        $.ajax({
            type: "GET",
            url : dataClip["url"]
        }).done(function(data, status, xhr) {
            animation.log(log.CONTENTS_DOWNLOAD_END, -1);
            // Stop telling the user it is loading
            $("#list").removeClass("loading");
            var contents = JSON.parse(xhr.responseText.substring(xhr.responseText.indexOf(
                "["))).slice(0, 50);
            // Convert date
            for (var i = 0; i !== contents.length; ++i) {
                contents[i]["time"]["created"] = edit.getMyTime(contents[i]["time"]["created"]);
                contents[i]["time"]["modified"] = edit.getMyTime(contents[i]["time"]["modified"]);
            }
            dataClip.contents = contents;
            // Set the read status of the clip to read
            dataClip.processed = true;
            var l = $(archive.detailView(dataClip));
            app.cDetail.css("display", "inline-block").html(l);
            app.app.addClass("detail-view");
            $("#detail").fadeIn(500);
            // Back button
            $(".btn-back", app.cDetail).on("click", function() {
                t.hideDetail();
            });
            // Show restore button
            $("#archive-restore").removeClass("hidden");
            return dataClip;
        }).fail(function(xhr, status, error) {
            animation.error(log.CONTENTS_DOWNLOAD_TEXT_FAIL, error, -1);
            // Hide this detail
            t.hideDetail();
        });
    } else {
        try {
            var l = $(archive.detailView(dataClip));
            // !!!!!HIDE THE CONTENT LISTS!!!!
            app.cDetail.html(l);
            app.app.addClass("detail-view");
            // Hide center if no images available
            if (!dataClip["images"]) {
                $(".center").hide();
            }
            $("#detail").fadeIn(500);
            // Back button
            $(".btn-back", app.cDetail).on("click", function() {
                this.hideDetail();
            });
            return dataClip;
        } catch (e) {
            animation.error(log.ARCHIVE_INVALID_JSON);
        }
    }
};
archive.detail.prototype = {
    // Processes all the spacial characters to html-style characters
    htmlSpacialChars: function(rawText) {
        return rawText.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/'/g, "&#039;")
            .replace(/"/g, "&quot;");
    },
    /* Hide the detail-view */
    hideDetail      : function() {
        // !!!!!HIDE THE CONTENT LISTS!!!!
        app.cDetail.css("display", "none").empty();
        app.cList.css("display", "inline-block");
        app.app.removeClass("detail-view");
        animation.hideHiddenIcons();
        //// $(window).off("keyup.detail-key");
    }
};

/**
 * Restores this archive
 * This fcuntion will contact OneDrive server
 */
archive.restore = function() {
    if (archive.currentDisplayed < 0) {
        // Invalid call: no item selected
        animation.error(log.ARCHIVE_NO_SELECTED);
        return false;
    }
    // Quit current view
    archive.quit();
    downloadFile(archive.data[archive.currentDisplayed]["url"]);
}

/**
 * Applies the changes on removal and protection
 */
archive.apply = function() {
    archive.protect(function() {
        archive.remove(function() {
            archive.init();
        });
    });
}

/**
 * Renames the selected files so that the files are protected (cannot be
 * removed unless unlocked) This function will contact OneDrive server
 * @param {Function} callback - The callback function after the server finishes
 *     all the tasks
 */
archive.protect = function(callback) {
    getTokenCallback(function(token) {
        var list = {},
            processed = 0;
        for (var i = 0; i !== archive.data.length; ++i) {
            var dataClip = archive.data[i];
            if (dataClip) {
                if (dataClip["protect"]) {
                    if (dataClip["name"].substring(0, 1) !== "_") {
                        // Wanna be protected
                        list[dataClip["id"]] = "_" + dataClip["name"];
                    }
                } else {
                    if (dataClip["name"].substring(0, 1) === "_") {
                        // Wanna be unprotected
                        list[dataClip["id"]] = dataClip["name"].substring(1);
                    }
                }
            }
        }
        var keys = Object.keys(list);
        if (keys.length === 0) {
            // Nothing to be applied
            animation.log(log.ARCHIVE_NO_PROTECT_CHANGE);
            callback();
        } else {
            animation.log(log.ARCHIVE_PROTECT_START, 1);
            for (var i = 0, len = keys.length; i !== len; ++i) {
                var id = keys[i],
                    url = "https://api.onedrive.com/v1.0/drive/items/" + id + "?select=id&access_token=" + token,
                    requestJson = {
                        name: list[id]
                    };
                $.ajax({
                        type       : "PATCH",
                        url        : url,
                        contentType: "application/json",
                        data       : JSON.stringify(requestJson)
                    })
                    .done(function(data) {
                        // Processed, remove it from the list
                        delete list[data["id"]];
                    })
                    .fail(function(xhr, status, error) {
                        list[data["id"]] = error;
                    })
                    .always(function() {
                        if (++processed >= len) {
                            // Processed all
                            if (Object.keys(list).length !== 0) {
                                // Error info
                                for (var j = 0;
                                     j !== archive.data.length;
                                     ++j) {
                                    if (list[archive.data[j]["id"]]) {
                                        // Matched
                                        animation.error(log.ARCHIVE_PROTECT_FAIL + archive.data[j]["name"] + log.SERVER_RETURNS_END + log.SERVER_RETURNS + list[data["id"]] + log.SERVER_RETURNS_END);
                                    }
                                }
                            }
                            animation.log(log.ARCHIVE_PROTECT_END, -1);
                            callback();
                        }
                    });
            }
        }
    });
}
/**
 * Removes selected archive files to trashcan on OneDrive so that removed files
 * are still recoverable This funciton will contact OneDrive server
 * @param {Function} callback - The callback function after the server finishes
 *     all the tasks
 */
archive.remove = function(callback) {
    getTokenCallback(function(token) {
        var total = 0,
            fail = 0,
            processed = 0;
        for (var i = 0; i !== archive.data.length; ++i) {
            if (archive.data[i]["delete"]) {
                if (archive.data[i]["protect"]) {
                    // This file is protected, cannot be removed unless
                    // de-protect it
                    animation.log(log.ARCHIVE_PROTECT_REMOVE + archive.data[i]["name"] + log.ARCHIVE_PROTECT_REMOVE_END);
                    archive.data[i]["delete"] = false;
                } else {
                    ++total;
                }
            }
        }
        if (total === 0) {
            // Nothing displayed, return error
            animation.log(log.ARCHIVE_NO_SELECTED_REMOVE);
            callback();
        } else {
            animation.log(log.ARCHIVE_REMOVE_START, 1);
            for (var i = 0; i !== archive.data.length; ++i) {
                if (archive.data[i]["delete"]) {
                    $.ajax({
                            type: "DELETE",
                            url : "https://api.onedrive.com/v1.0/drive/items/" + archive.data[i]["id"] + "?access_token=" + token
                        })
                        .done(function() {
                            // Do nothing now
                        })
                        .fail(function() {
                            ++fail;
                        })
                        .always(function() {
                            if (++processed >= total) {
                                // All the files are removed
                                if (fail > 0) {
                                    // One operation failed
                                    animation.error(log.ARCHIVE_REMOVE_FAIL);
                                }
                                animation.log((total - fail) + log.CONTENTS_DOWNLOAD_MEDIA_OF + total + log.ARCHIVE_REMOVE_END,
                                    -1);
                                callback();
                            }
                        });
                }
            }
        }
    });
}

/**
 * Toggles selected archive files to type and then deselect them
 * This function simply toggles the class of each list on entry, whose name is
 * given by the parameter
 * @param {String} type - The type to be marked
 */
archive.toggle = function(type) {
    var changed = false;
    $("#list .archive").each(function(index) {
        if ($(this).children("a").hasClass("change")) {
            changed = true;
            if ($(this).children("a").toggleClass(type).hasClass(type)) {
                archive.data[index][type] = true;
            } else {
                archive.data[index][type] = false;
            }
            $(this).children("a").removeClass("change");
        }
    });
    if (!changed) {
        animation.warn(log.ARCHIVE_NO_SELECTED);
    }
}

/**
 * Selects the archives since archive.currentDisplayed
 */
archive.selectBelow = function() {
    var since = archive.currentDisplayed;
    if (since === -1) {
        // Select all
        animation.log(log.ARCHIVE_SELECT_ALL);
    }
    ++since;
    $("#list .archive").each(function(index) {
        if (index >= since) {
            $(this).children("a").addClass("change");
        }
    });
}

/**
 * Reverses selection of all archive lists
 */
archive.reverse = function() {
    $("#list .archive").each(function() {
        $(this).children("a").toggleClass("change");
    });
}

/**
 * Clears the selection of all archive lists and removes all their changes
 */
archive.clear = function() {
    $("#list .archive").each(function() {
        $(this).children("a").removeAttr("class");
    });
}


archive.quit = function() {
    if (archive.isDisplayed) {
        archive.isDisplayed = false;
        $("#list").empty();
        $("#detail").empty();
        // Reshow the menu
        $("#refresh-media").trigger("click");
        $("#search-new, #search-result").fadeIn();
        animation.showMenuOnly("menu");
    }
}

//endregion

/*****************************************************************************
 *
 *
 *
 *
 *                                  archive.js
 *
 *
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 *
 *
 *
 *                                  network.js
 *
 *
 *
 *
 *****************************************************************************/

//region network.js

/**
 * Was previously onedrive.v2.js, renamed for convenience
 */

window.network = {};

network.percent = 0;
network.current = 0;
network.breakpoint = 0;
network.interval = 0;
/** The local variables to store if current year has /core/ folder */
network.yearFolders = [];
/** Whether there are any outgoing ajax event */
network.isAjaxActive = false;
/** The timeout time for ajax, in milliseconds */
network.timeOut = 15000;

/**
 * Initializes the network bar and show it
 * @param {number} breakpoint - The number of breakpoints
 */
network.init = function(breakpoint) {
    // Remove all the network activity bar
    $("#network-bar").remove();
    $(".header")
        .append(
            "<div id=\"network-bar\" ><div id=\"network-progress\"><div id=\"network-followup\"></div></div></div>");
    if (!breakpoint || breakpoint < 0) {
        breakpoint = 0;
    }
    network.current = 0;
    network.breakpoint = breakpoint || 0;
    network.setPercent(0);
    // Increment by a little automatically
    clearInterval(network.interval);
    var toDestroy = false;
    network.interval = setInterval(function() {
        // Test if the network bar needs destroyed
        if (toDestroy) {
            network.destroy();
            return;
        }
        // The network bar will not exceed half-way
        if (network.percent < (network.current + .5) / (network.breakpoint + 1)) {
            network.percent += .05;
        }
        if (network.percent >= 1) {
            network.percent = 1;
            toDestroy = true;
        }
        // Render the network progress bar given `network.percent`
        $("#network-progress").css("width", network.percent * 100 + "%");
    }, 1000);
}

/**
 * Sets the percent of the network bar to show the progress of the network
 * @param {number} percent - The percent of the network bar. A number between 0
 *     and 1
 */
network.setPercent = function(percent) {
    network.percent = percent;
}

/**
 * Sets the status of the network bar and tell the user what is happening
 * @param {string} status - The status string to be shown on the bar
 * @returns {}
 */
network.setStatus = function(status) {

}

/**
 * Pushes network bar to the next breakpoint
 * @returns {}
 */
network.next = function() {
    network.setPercent(++network.current / (network.breakpoint + 1));
}

/**
 * Destroies the network bar and hide it. This function will set the percent to
 * 1 then hide it
 */
network.destroy = function() {
    if (network.percent < 1) {
        // Set to a larger value to make the slide bar go faster
        network.percent = 2;
        // Use the interval function to destroy this one
    } else {
        clearInterval(network.interval);
        $("#network-bar").remove();
    }
}

/**
 * ****************************************************************************
 */

/**
 * Returns the url of resource folder (where the media in the entry are
 * located) in the format of
 * "https://api.onedrive.com/v1.0/drive/special/approot:/resource/`year`". The
 * returned string should be appended with ":/" if necessary
 * @param {boolean} isAbsolute (Optional) - if set to true the format will be
 *     "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/resource/`year`"
 * @param {number} year (Optional) - The year of the resource folder. Default
 *     value is `app.year`
 * @returns {string} - The correct url given `app.year` (the year displayed) or
 *     specified year
 */
function getResourceUrlHeader(isAbsolute, year) {
    year = year || app.year;
    return "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/resource/"
        + year;
}

/**
 * Returns the url of data folder (where media that are not in the entries are
 * located) in the format of
 * "https://api.onedrive.com/v1.0/drive/special/approot:/data/`year`". The
 * returned string should be appended with ":/" if necessary
 * @param {boolean} isAbsolute (Optional) - if set to true the format will be
 *     "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/data/`year`"
 * @param {number} year (Optional) - The year of the resource folder. Default
 *     value is `app.year`
 * @returns {string} - The correct url given `app.year` (the year displayed) or
 *     specified year
 */
function getDataUrlHeader(isAbsolute, year) {
    year = year || app.year;
    return "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/data/"
        + year;
}

/**
 * Returns the url of core data (.js file) in the format of
 * "https://api.onedrive.com/v1.0/drive/special/approot:/core/`year`/data.js".
 * The returned string should be appended with ":/" if necessary
 * @param {boolean} isAbsolute (Optional) - if set to true the format will be
 *     "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/core/`year`/data.js"
 * @param {number} year (Optional) - The year of the core data. Default value
 *     is `app.year`
 * @returns {string} - The correct url given `app.year` (the year displayed) or
 *     `app.year` to the core data .js
 */
function getCoreDataUrlHeader(isAbsolute, year) {
    year = year || app.year;
    return "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/core/" + year + "/data.js";
}

/**
 * Returns the url of bulb folder
 */
function getBulbUrlHeader() {
    return "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/bulb/";
}


/**
 * Downloads the file (including the text file and the media file) from
 * OneDrive. If even the folders are not created, this function will also make
 * sure necessary folders exist
 * @param {String} url - The direct url of the file. Default is from
 *     core/data.js
 * @param {Boolean} textOnly - whether to download text file or not
 * @param {Function} callbackOnSuccess - the function to be called if downloading is a success
 */
function downloadFile(url, textOnly, callbackOnSuccess) {
    animation.log(log.CONTENTS_DOWNLOAD_START, 1);
    ////console.log("Start downloadFile()");
    // Change loading icons and disable click

    // Justify the callback function
    if (typeof callbackOnSuccess != "function") {
        // Create an empty function
        callbackOnSuccess = function() {
        };
    }

    getTokenCallback(function(token) {
        if (network.yearFolders.indexOf(app.year) === -1) {
            // Create a folder instead of searching for it
            createFolders(function() {
                // Simply refresh the list-view
                app.refresh();
                callbackOnSuccess();
            }, 3);
        } else {
            $("#download")
                .html("&#xf1ce")
                .addClass("spin")
                .removeAttr("onclick")
                .removeAttr("href");
            // Get text data
            url = url || getCoreDataUrlHeader(true) +
                ":/content?access_token=" + token;
            $.ajax({
                    type: "GET",
                    url : url
                })
                .done(function(data, status, xhr) {
                    window.app.dataLoaded[app.year] = false;
                    app.addLoadDataWithFilter("", xhr.responseText);
                    ////console.log("downloadFile()\tFinish core data");
                    animation.log(log.CONTENTS_DOWNLOAD_TEXT);
                    // Now the data is up-to-date
                    delete app.yearChange[app.year];
                    $("#year").removeClass("change");
                    app.updateLastUpdated();
                    app.yearUpdate();
                    if (textOnly) {
                        // Change loading icons and re-enable click
                        $("#download")
                            .html("&#xf0ed")
                            .removeClass("spin")
                            .attr({
                                onclick: "downloadFile()",
                                href   : "#"
                            });
                        animation.finished("#download");
                    } else {
                        // Get metadata
                        $.ajax({
                                type: "GET",
                                url : getResourceUrlHeader() + ":?select=folder&access_token=" + token
                            })
                            .done(function(data, status, xhr) {
                                // Get the data number
                                journal.archive.media = data["folder"]["childCount"];
                                app.refresh();
                                animation.log(log.CONTENTS_DOWNLOAD_MEDIA_START,
                                    1);
                                network.init(journal.archive.media);
                                downloadMedia();
                            })
                            .fail(function(xhr, status, error) {
                                animation.error(log.CONTENTS_DOWNLOAD_MEDIA_FAIL,
                                    error,
                                    -1);
                            });
                    }

                    callbackOnSuccess();
                })
                .fail(function(xhr, status, error) {
                    // Change loading icons and re-enable click
                    $("#download").html("&#xf0ed").removeClass("spin").attr({
                        onclick: "downloadFile()",
                        href   : "#"
                    });
                    animation.finished("#download");
                    if (xhr.status == 404) {
                        // Not found, but the folder is there, guess the data
                        // should be in `app.yearQueue`
                        if (app.yearQueue[app.year]) {
                            // It IS in `app.yearQueue`, pretend it is a
                            // successful load
                            app.yearUpdate();
                            app.refresh();
                            return;
                        }
                    }
                    animation.error(log.CONTENTS_DOWNLOAD_TEXT_FAIL, error, -1);
                    // `app.year` does not change
                    app.year = parseInt($("#year").html());
                    ////alert("Cannot download the file. Do you enable CORS?");
                })
                .always(function() {
                    animation.log(log.CONTENTS_DOWNLOAD_END, -1);
                    ////console.log("downloadFile()\tFinish downloading");
                });
        }
    });
}

/**
 * Recusively reads all the children under resource folder and read them as
 * media. This function will not refresh the token because it assumes that it
 * will be only called after downloadFile()
 * @param {string} url - The address of "nextLink", should be empty at the
 *     first call. Used for recursion
 */
function downloadMedia(url) {
    // Reset map
    if (url == undefined) {
        // Initial call
        var token = getTokenFromCookie();
        journal.archive.map = {};
        url = getResourceUrlHeader() + ":/children?select=id,name,size,@content.downloadUrl&top=500&access_token=" + token;
    }
    $.ajax({
            type: "GET",
            url : url
        })
        .done(function(data, status, xhr) {
            if (data["@odata.nextLink"]) {
                // More contents available!
                var nextUrl = data["@odata.nextLink"];
                var groups = nextUrl.split("&");

                // Manually to ask server return downloadUrl
                for (var i = 0; i !== groups.length; ++i) {
                    if (groups[i].startsWith("$select")) {
                        groups[i] = "$select=id,name,size,@content.downloadUrl";
                        break;
                    }
                }
                nextUrl = groups.join("&");
                downloadMedia(nextUrl);
            }
            var itemList = data["value"];
            for (var key = 0, len = itemList.length; key != len; ++key) {
                var dataElement = {
                    id  : itemList[key]["id"],
                    url : itemList[key]["@content.downloadUrl"],
                    size: itemList[key]["size"]
                };
                journal.archive.map[itemList[key]["name"]] = dataElement;
                network.next();
            }
            // Show progress
            var finished = _.size(journal.archive.map);
            animation.log(log.CONTENTS_DOWNLOAD_MEDIA_LOADED + finished + log.CONTENTS_DOWNLOAD_MEDIA_OF + journal.archive.media);
            if (finished == journal.archive.media) {
                animation.log(log.CONTENTS_DOWNLOAD_MEDIA_END, -1);
                network.destroy();
                // Change loading icons and re-enable click
                $("#download").html("&#xf0ed").removeClass("spin").attr({
                    onclick: "downloadFile()",
                    href   : "#"
                });
                animation.finished("#download");
            }
            ////console.log("downloadFile()\tFinish media data");
        })
        .fail(function() {
            network.destroy();
        });
}

/**
 * Creates a backup file for all the files given `app.years`. Should only be
 * called in `app.getYears`
 * @param {Object} - The list of years to backup
 */
function backupAll(years) {
    getTokenCallback(function(token) {
        animation.log(log.CONTENTS_BACKUP_START);
        years = years || app.years;
        network.init(years.length - 1);
        for (var i = 0; i !== years.length; ++i) {
            var d = new Date(),
                month = d.getMonth() + 1,
                day = d.getDate(),
                year = d.getFullYear() % 100,
                hour = d.getHours(),
                minute = d.getMinutes(),
                second = d.getSeconds(),
                dataYear = years[i];
            month = month < 10 ? "0" + month : month;
            day = day < 10 ? "0" + day : day;
            year = year < 10 ? "0" + year : year;
            hour = hour < 10 ? "0" + hour : hour;
            minute = minute < 10 ? "0" + minute : minute;
            second = second < 10 ? "0" + second : second;
            var fileName = "data_" + month + day + year + "_" + hour + minute + second + ".js",
                data = {name: fileName};
            // Backup the original file
            $.ajax({
                    type       : "POST",
                    url        : getCoreDataUrlHeader(false,
                        dataYear) + ":/action.copy?access_token=" + token,
                    contentType: "application/json",
                    data       : JSON.stringify(data),
                    headers    : {
                        Prefer: "respond-async"
                    }
                })
                ////////////////////////////// ADD PROGRESS BAR SOMEWHERE
                // BETWEEN !!!!!!!!  //////////////
                .done(function() {
                    ////console.log("uploadFile():\t Done backup");
                    animation.debug(log.CONTENTS_UPLOAD_BACKUP);
                })
                .fail(function(xhr, status, error) {
                    // Bad request means the file to be moved is not found
                    if (error !== "Bad Request") {
                        animation.error(log.CONTENTS_UPLOAD_BACKUP_FAIL,
                            error,
                            -1);
                        network.destroy();
                    }
                    ////alert("Cannot backup the file");
                })
                .always(function(xhr, status, error) {
                    network.next();
                    ////console.log("uploadFile()\tFinish uploading");
                });
        }
    });
}

/**
 * A helper function. Uploads journal.archive.data to OneDrive and creates a
 * backup. If this folder does not exist, this function will create a folder
 * before uploading
 * @param {number} dataYear (Optional) - The year of the data to be uploaded
 * @param {function} callbackOnSuccess (Optional) - the callback function after
 *     uploading is successful
 */
function uploadFile(dataYear, callbackOnSuccess) {
    dataYear = parseInt(dataYear) || app.year;
    // Change loading icons and disable click
    $("#upload")
        .html("&#xf1ce")
        .addClass("spin")
        .removeAttr("onclick")
        .removeAttr("href");

    getTokenCallback(function(token) {
        /**
         * The function to be called to upload the file. This function assumes
         * that the folder has already been prepared
         */
        var upload = function() {
            // Get the version
            var tmp = app.version[dataYear] || "";
            // Clean the unnecessary data
            tmp += JSON.stringify(edit.minData());
            $.ajax({
                    type       : "PUT",
                    url        : getCoreDataUrlHeader(true,
                        dataYear) + ":/content?access_token=" + token,
                    contentType: "text/plain",
                    data       : tmp
                })
                .done(function() {
                    ////console.log("uploadFile():\t Done!");
                    // Now the data is up-to-date
                    app.yearChange[app.year] = false;
                    $("#year").removeClass("change");
                    app.updateLastUpdated();
                    animation.log(log.CONTENTS_UPLOAD_END + dataYear, -1);

                    if (typeof callbackOnSuccess === "function") {
                        callbackOnSuccess();
                    } else {
                        edit.sortArchive();
                        edit.removeDuplicate();
                        journal.archive.data[app.year] = edit.minData();
                        edit.saveDataCache();
                    }
                })
                .fail(function(xhr2, status2, error2) {
                    animation.error(log.CONTENTS_UPLOAD_FAIL, error2, -1);
                    ////alert("Cannot upload files");
                })
                .always(function() {
                    network.next();
                    // Change loading icons and re-enable click
                    $("#upload")
                        .html("&#xf0ee")
                        .removeClass("spin")
                        .css("background", "")
                        .attr({
                            onclick: "uploadSingleFile()",
                            href   : "#"
                        });
                });
        };
        if (network.yearFolders.indexOf(app.year) === -1) {
            // This `app.year` has not already registered on the website
            createFolders(upload, 5);
        } else {
            // Just upload it
            upload();
        }
    });
}

/**
 * Uploads `journal.archive.data` of this year as a single file to OneDrive and
 * creates a backup. If this folder does not exist, this function will create a
 * folder before uploading by calling `uploadFile()`
 * @see uploadFile()
 */
function uploadSingleFile() {
    animation.log(log.CONTENTS_UPLOAD_START, 1);
    uploadFile();
}

/**
 * Uploads all `journal.archive.data` of the years that have "edit" tracked in
 * `app.yearChange`. This function will call `uploadFile()` separately for each
 * year and create backup files for each function
 * @see uploadFile()
 */
function uploadAllFiles() {
    animation.log(log.CONTENTS_UPLOAD_START, 1);
    if (app.yearChange.length === 0) {
        // No file to be uploaded, upload this year's data instead
        uploadFile();
    } else {
        var years = Object.keys(app.yearChange);
        for (var i = 0; i !== years.length; ++i) {
            var year = years[i];
            if (app.yearChange[year]) {
                uploadFile(years[i]);
            }
        }
    }
}

/* Download the cover photo from iTunes. type can be either number or string*/
function getCoverPhoto(selectorHeader, term, more, type) {
    var url = "https://itunes.apple.com/search?output=json&lang=1&limit=1&media=music&entity=song,album,musicArtist&term=";
    if (typeof (type) == "number") {
        type = edit.mediaName(type);
    }
    if (type == "movie") {
        url = "https://itunes.apple.com/search?output=json&lang=1&limit=1&media=movie&entity=movieArtist,movie&term=";
    } else if (type == "book") {
        url = "https://itunes.apple.com/search?output=json&lang=1&limit=1&media=ebook&entity=ebook&term=";
    }
    $.ajax({
        url     : url + term,
        dataType: "jsonp",
        // Work with the response
        success : function(response) {
            var result = response.results[0];
            if (result == undefined) {
                // Not found
                animation.warn(log.COVER_PHOTO_FAIL);
                animation.invalid(selectorHeader + "input");
            } else {
                // Result found
                animation.debug(log.COVER_PHOTO_FOUND);
                var artist = result["artistName"],
                    track = result["trackName"],
                    coverUrl = result["artworkUrl100"];
                if (more) {
                    $(selectorHeader + ".title").val(track);
                    $(selectorHeader + ".desc").val(artist);
                }
                $(selectorHeader + ".thumb").attr("src", coverUrl);
            }
        }
    });
}

/**
 * Creates a folder under data/
 * @param {string} dateStr - The name of the folder to be created
 * @param {function} callback - The callback function after completion of
 *     creating
 */
function createDateFolder(dateStr, callback) {
    getTokenCallback(function(token) {
        var requestJson = {
            name  : dateStr,
            folder: {}
        };
        $.ajax({
                type       : "POST",
                url        : getDataUrlHeader(true) + ":/children?access_token=" + token,
                contentType: "application/json",
                data       : JSON.stringify(requestJson),
                statusCode : {
                    // Conflict, considered this folder is created successfully
                    409: function() {
                        edit.isFolder = true;
                        edit.folderDate = dateStr;
                    }
                }
            })
            .done(function() {
                // Successfully created this directory
                edit.isFolder = true;
                edit.folderDate = dateStr;
                animation.debug(log.FOLDER_CREATED);
            })
            .always(function() {
                // Always try to run the callback function
                callback(dateStr);
            });
    });
}

/**
 * Creates the necessary folders (/core/, /resource/, /data/) for this
 * `app.year`
 * @param {function} callback(token) - The callback function after all the
 *     folders exist (already existed or newly created), can have a parameter
 *     for access_token
 * @param {number} breakpoints - The number of breakpoints for network progress
 *     bar
 */
function createFolders(callback, breakpoints) {
    getTokenCallback(function(token) {
        var created = 0,
            abort = false,
            urls = ["https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/core:/",
                "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/data:/",
                "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/resource:/"],
            requestJson = {
                name  : app.year.toString(),
                folder: {}
            };
        // Start create all the folder needed
        network.init(breakpoints);
        for (var i = 0; i !== urls.length; ++i) {
            $.ajax({
                    type       : "POST",
                    url        : urls[i] + "children?access_token=" + token,
                    contentType: "application/json",
                    data       : JSON.stringify(requestJson)
                })
                .done(function() {
                    network.next();
                    if (++created === urls.length) {
                        // All have been created
                        network.yearFolders.push(app.year);
                        // Upload the data
                        callback(token);
                    }
                })
                .fail(function(xhr) {
                    if (xhr.status == 409) {
                        // Conflict, considered this folder is created
                        // successfully
                        network.next();
                        if (++created === urls.length) {
                            // All have been created
                            network.yearFolders.push(app.year);
                            // Upload the data
                            callback(token);
                        }
                    } else {
                        network.destroy();
                        if (!abort) {
                            animation.error(log.CONTENTS_UPLOAD_REGISTER_FAIL);
                        }
                        // Abort everything, to prevent multiple prompt of the
                        // error
                        abort = true;
                    }
                });
        }
    })
}

/**
 * Removes the file on OneDrive by an id
 * @param id - the id of the file to be removed
 * @param done {function} - the callback function when the removal is a success
 * @param fail {function} - the callback function when the removal fails
 * @param always {function} - the callback function that is always called
 */
function removeFileById(id, done, fail, always) {
    getTokenCallback(function(token) {
        $.ajax({
            type: "DELETE",
            url : "https://api.onedrive.com/v1.0/drive/items/" + id + "?access_token=" + token
        }).done(function() {
            if (typeof done === "function") {
                done();
            }
        }).fail(function() {
            if (typeof  fail === "function") {
                fail();
            }
        }).always(function() {
            if (typeof always === "function") {
                always();
            }
        });
    });
}

//endregion

/*****************************************************************************
 *
 *
 *
 *
 *                                  network.js
 *
 *
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 *
 *
 *
 *                                  bulb.js
 *
 *
 *
 *
 *****************************************************************************/

//region bulb.js

/**
 * A file to do things with bulbs
 * Created by Anoxic on 061616.
 */

window.bulb = function() {
    "use strict";
    /**
     * These are the data to be processed
     * @type {{}} Format: {time: {content, location: [longitude, latitude],
     *     website: [], id, url, isAttached, isUploaded...}}
     */
    var _data = {};
    /**
     * The number of bulbs that were fetched from the bulb folder and to be
     * processed
     * @type {number}
     */
    var _totalBulbs = 0;
    /**
     * The size of the total bulbs that can be processed based on what was
     * fetched from the server
     * @type {number}
     * @private
     */
    var _totalAvailableBulbs = 0;
    /**
     * The counter of how many bulbs have been fetched and merged into the
     * archive data
     * @type {number}
     * @private
     */
    var _mergedBulbCounter = 0;

    /**
     * Extracts the website in a timestamp
     * @param timestamp
     * @private
     */
    function _extractWebsiteFromContent(timestamp) {
        var data = _data[timestamp]["contentRaw"];
        var websitePattern = /(.+)@(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))(.*)/g;
        var result = websitePattern.exec(data);
        if (result) {
            _data[timestamp]["website"] = result[2];

            // Remove the website
            _data[timestamp]["content"] = result[1] + result[result.length - 1];
        }
    }

    /**
     * Extracts the location in a timestamp
     * @param timestamp
     * @private
     */
    function _extractLocationFromContent(timestamp) {
        // Location, without name
        var locationPattern = /(.+)#\[(-?[0-9]+\.[0-9]+),(-?[0-9]+\.[0-9]+)\](.*)/;
        var data = _data[timestamp]["contentRaw"];
        var result = locationPattern.exec(data);

        if (result) {
            _data[timestamp]["location"] = {
                name: result[2] + "," + result[3],
                lat : result[2],
                long: result[3]
            };

            // Remove the location
            _data[timestamp]["content"] = result[1] + result[result.length - 1];
        } else {
            // Location, with name
            locationPattern = /(.+)#\[(.+),(-?[0-9]+\.[0-9]+),(-?[0-9]+\.[0-9]+)\](.*)/g;
            result = locationPattern.exec(data);
            if (result) {
                _data[timestamp]["location"] = {
                    name: result[2],
                    lat : result[3],
                    long: result[4]
                };

                // Remove the location
                _data[timestamp]["content"] = result[1] + result[result.length - 1];
            }
        }
    }

    /**
     * Fetch the bulb content given a timestamp to be used as an index to search
     * data from `bulb.data`
     * @param {string} timestamp The timestamp
     */
    function _fetchBulbContent(timestamp) {
        getTokenCallback(function(token) {
            var id = bulb.getID(timestamp);
            var url = "https://api.onedrive.com/v1.0/drive/items/" + id + "/content?access_token=" + token;

            $.ajax({
                type: "GET",
                url : url
            }).done(function(data, status, xhr) {
                // Get the content of bulb
                var content = xhr.responseText;
                // Remove illegal characters
                content = content.replace(/\r*\n/g, " ");

                bulb.setRawContent(timestamp, content);
                // Process the raw content
                bulb.extractRawContent(timestamp);
                // Merge into journal archive data
                bulb.mergeIntoArchive(timestamp);

                animation.log(++_mergedBulbCounter + log.BULB_PROCESSED_LEFT + _totalBulbs);
            }).always(function() {
                // Decrement the total bulbs to be processed
                bulb.decrementTotalBulbs();
                if (_totalBulbs <= 0) {
                    // None bulbs left
                    app.finishMergingBulbs();
                }
            });
        })
    }

    return {
        /**
         * Whether there is any merging in progress
         * This prevents the archive being uploaded
         */
        isProcessing: false,

        /**
         * Start fetching the bulb data from the server.
         * The first function to call to get started
         */
        initFetchData: function(url) {
            if (bulb.isProcessing) {
                animation.error(log.BULB_STILL_BUSY);
                return;
            }

            // Download the latest data first
            downloadFile(undefined, undefined, function() {
                animation.log(log.BULB_FETCH_START);

                bulb.isProcessing = true;

                if (url == undefined) {
                    // Initial call
                    var token = getTokenFromCookie();
                    url = getBulbUrlHeader() + ":/children?select=id,name,size,@content.downloadUrl&top=500&access_token=" + token;

                    bulb.totalBulbs = 0;
                }

                $.ajax({
                        type: "GET",
                        url : url
                    })
                    .done(function(data) {
                        // Test if there is more bulbs available
                        //if (data["@odata.nextLink"] && false) { // never go into
                        // the loop (intended) // More bulbs available! var nextUrl
                        // = data["@odata.nextLink"];  var groups =
                        // nextUrl.split("&"); // Manually ask server return
                        // downloadUrl for (var i = 0; i !== groups.length; ++i) {
                        // if (groups[i].startsWith("$select")) { groups[i] =
                        // "$select=id,name,size,@content.downloadUrl"; break; } }
                        // nextUrl = groups.join("&");
                        // bulb.initFetchData(nextUrl); }

                        // Add these bulbs to the queue to process them
                        var itemList = data["value"];
                        bulb.clearData();
                        bulb.setTotalBulbs(itemList.length);

                        if (itemList.length === 0) {
                            // Empty bulb list
                            animation.log(log.BULB_NO_CONTENT_AVAILABLE);
                            bulb.isProcessing = false;
                            return;
                        }

                        animation.log(log.BULB_FETCH_CONTENT_START);

                        for (var key = 0, len = itemList.length;
                             key != len;
                             ++key) {
                            var dataElement = {
                                id : itemList[key]["id"],
                                url: itemList[key]["@content.downloadUrl"],
                            };
                            var filename = itemList[key]["name"];
                            var timestamp = bulb.getTimeFromEpoch(filename);

                            bulb.setData(timestamp, dataElement);

                            _fetchBulbContent(timestamp);
                        }
                    }).fail(function() {
                    bulb.isProcessing = false;
                });
            });
        },

        setdata: function(timestamp, data) {
            _data[timestamp] = data;
        },

        /**
         * Todo test this method
         * Returns the time from epoch given the representation of bulb
         * filename (in the format of mmddyy_hhmmss)
         * @param {string} myStr - The filename of bulb
         */
        getTimeFromEpoch: function(myStr) {
            var month = parseInt(myStr.substr(0, 2));
            var day = parseInt(myStr.substr(2, 2));
            var year = 2000 + parseInt(myStr.substr(4, 2));
            var hour = parseInt(myStr.substr(7, 2));
            var minute = parseInt(myStr.substr(9, 2));
            var second = parseInt(myStr.substr(11, 2));

            return new Date(year, month - 1, day, hour, minute, second).getTime();
        },

        /**
         * TODO test this method
         * Extract some other information (location, website, etc...) from raw
         * data, given the timestamp to index `_data`
         * @param {number} timestamp - The timestamp of the data
         */
        extractRawContent: function(timestamp) {
            // Website
            _extractWebsiteFromContent(timestamp);

            // Location
            _extractLocationFromContent(timestamp);
        },

        /**
         * Merges the bulb indexed by the timestamp into the local archive
         * @param timestamp - the timestamp of the bulb to be merged
         */
        mergeIntoArchive: function(timestamp) {
            // Test if this timestamp has already been merged into the archive
            if (app.isBulbExist(timestamp)) {
                // Add it to the removal list
                _data[timestamp]["isMerged"] = true;
                _data[timestamp]["isUploaded"] = true;
            } else {
                // Merge it into archive
                app.addBulb(_data[timestamp], timestamp);
            }
        },

        setIsMerged: function(timestamp) {
            _data[timestamp]["isMerged"] = true;
        },

        setTotalBulbs: function(num) {
            _totalBulbs = num;
            _totalAvailableBulbs = num;
        },

        decrementTotalBulbs: function() {
            --_totalBulbs;
        },

        getTotalBulbs: function() {
            return _totalBulbs;
        },

        getTotalAvailableBulbs: function() {
            return _totalAvailableBulbs;
        },

        getMergedBulbCounter: function() {
            return _mergedBulbCounter;
        },

        setData: function(timestamp, data) {
            _data[timestamp] = data;
        },

        clearData: function() {
            _data = {};
        },

        /**
         * Call the server to remove merged and uploaded bulbs
         * @require called after all the bulbs are downloaded
         */
        removeUploadedBulbs: function() {
            for (var key in _data) {
                if (_data.hasOwnProperty(key)) {
                    if (_data[key]["isMerged"]) {
                        // It's merged, try to remove it
                        var id = _data[key]["id"];
                        removeFileById(id, undefined, undefined, function() {
                            if (--_mergedBulbCounter === 0) {
                                // All the merged bulbs have been removed (or
                                // at least attempts were made to)
                                bulb.isProcessing = false;

                                animation.log(log.BULB_FETCH_FINAL_END);
                            }
                        });
                    }
                }
            }
        },

        getBulbData: function() {
            return _data;
        },

        getID: function(timestamp) {
            return _data[timestamp]["id"];
        },

        setRawContent: function(timestamp, contentRaw) {
            _data[timestamp]["contentRaw"] = contentRaw;
        }
    }
}();

//endregion

/*****************************************************************************
 *
 *
 *
 *
 *                                  bulb.js
 *
 *
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 *
 *
 *
 *                                  stats.js
 *
 *
 *
 *
 *****************************************************************************/

//region stats.js

/**
 * The file to handle stats display for this year
 */

window.stats = {};

/** The value before the entry is added */
stats.oldValue = "";
/** The entries to be searched, with its result */
stats.entries = {};
/** The options for searching, will implement setup page later */
stats.options = {
    /** Both `startDay` and `endDay` are measured in the amount of days since the first day of the year (the value for the first day is 0). The `endDay` will not be included */
    startDay         : 0,
    endDay           : 366,
    // Todo add a calendar to display
    isIncludingTitles: true,
    isIncludingTags  : false,
    viewAsMonth      : false
};
/** A list to hold all the human-readable date from the first day to the last day for `app.year` */
stats.eachDay = [];
/**
 * A list to hold all the values for each year
 */
stats.monthVal = [];
stats.isLeapYear = false;

/** Set to a number not equal to -1 to indicate the entry that is currently editing */
stats.isEditing = -1;
stats.isGraphDisplayed = false;

/**
 * Initializes the stats panel
 */
stats.init = function() {
    /* Iterator */
    var i;
    // Initialize variables
    stats.result = [];
    stats.isLeapYear = new Date(app.year, 1, 29).getMonth() === 1;
    stats.isGraphDisplayed = false;
    stats.oldValue = "";
    if (stats.isLeapYear) {
        // This is a leap year
        stats.monthVal = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    } else {
        stats.monthVal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }
    for (i = 1; ; ++i) {
        var date = new Date(app.year, 0, i);
        if (date.getFullYear() !== app.year) {
            // New day, stop executing
            break;
        } else {
            var month = app.monthArray[date.getMonth()],
                day = date.getDate();
            stats.eachDay.push(month + " " + day);
        }
    }
    // Animation for initialization
    $("#query").fadeOut();
    $("#stats-query").fadeIn();
    // Empty this input box
    $("#stats-query").val("");
    $("#stats-query").unbind("keyup").bind("keyup", "return", function() {
        var newEntry = $(this).val();
        newEntry = stats.simplifyEntry(newEntry);
        if (newEntry.length === 0) {
            // Empty string, do nothing
            $(this).effect("highlight", {color: "#000"});
            animation.debug(log.STATS_ENTRY_EMPTY_STRING);
            return;
        }
        if (stats.entries[newEntry]) {
            // Already there
            $(this).effect("highlight", {color: "#000"});
            animation.debug(log.STATS_ENTRY_ALREADY_EXIST);
        } else {
            // This is a valid entry
            $(this).effect("highlight", {color: "#ddd"});
            // Add a new entry
            stats.addEntry(newEntry);
            $(this).val("");
            $(this).focus();
        }
        $(this).select();
    });
    stats.initTable();
    animation.showMenuOnly("stats");
    // Bind click to select for `.checkbox`
    $("#stats-options li.checkbox").each(function() {
        $(this).click(function() {
            $(this).toggleClass("checked");
            var name = $(this).attr("encode");
            stats.options[name] = !stats.options[name];
        });
    });
    // Hover to highlight the same column and row
    $("#stats-table")
        .delegate("td", "mouseover mouseleave contextmenu", function(e) {
            if (e.type === "mouseover") {
                $(this).parent().addClass("hover");
                $("tr td:nth-child(" + ($(this).index() + 1) + ")")
                    .addClass("hover");
            } else if (e.type === "mouseleave") {
                $(this).parent().removeClass("hover");
                $("tr td:nth-child(" + ($(this).index() + 1) + ")")
                    .removeClass("hover");
            } else {
                // Right click
                var key = stats.oldValue || $(this)
                        .parent()
                        .children("td")
                        .children("input")
                        .val();
                $(this).parent().slideUp(200, function() {
                    $(this).remove();
                });
                delete stats.entries[key];
                return false;
            }
        })
        // Click or leave to edit the input menu
        .delegate("input", "focusin focusout keyup", function(e) {
            if (e.type === "focusin") {
                // Record the old value
                stats.oldValue = $(this).val();
            } else if (e.type === "focusout") {
                $(this).val(stats.oldValue);
                stats.oldValue = "";
            } else {
                if (e.keyCode === 13) {
                    // Return pressed
                    var newEntry = $(this).val();
                    newEntry = stats.simplifyEntry(newEntry);
                    if (newEntry.length === 0) {
                        // Empty string, do nothing
                        $(this).effect("highlight", {color: "#000"});
                        animation.error(log.STATS_ENTRY_EMPTY_STRING);
                        $(this).val(stats.oldValue);
                        return;
                    }
                    if (stats.entries[newEntry]) {
                        // Already there
                        $(this).effect("highlight", {color: "#000"});
                        animation.error(log.STATS_ENTRY_ALREADY_EXIST);
                        $(this).val(stats.oldValue);
                        return;
                    } else {
                        // This is a valid entry
                        $(this)
                            .parent()
                            .parent()
                            .effect("highlight", {color: "#ddd"});
                        // Add a new entry
                        var index = $(this).parent().parent().index() + 1;
                        // Remove the old value
                        delete stats.entries[stats.oldValue];
                        stats.addEntry(newEntry, index);
                    }
                    // Update the value
                    stats.oldValue = newEntry;
                    this.blur();
                } else if (e.keyCode === 27) {
                    // Esc pressed
                    this.blur();
                }
            }
        })
        // Click to sort
        .delegate("th", "click", function() {
            if ($("tbody tr").length !== 0) {
                var desc = $(this).hasClass("desc"),
                    index = $(this).index(),
                    map = [];
                // Extract the data
                $("tbody tr").each(function() {
                    var key, value;
                    $(this).children("td").each(function(n) {
                        if (n === 0) {
                            // Get the index
                            key = $(this).children("input").val();
                        }
                        if (n === index) {
                            // Matched the index of the value to be sorted
                            if (n === 0) {
                                value = key;
                            } else {
                                value = $(this).html();
                            }
                        }
                    });
                    map.push({
                        key  : key,
                        value: value
                    });
                });
                // Reset the map to re-add those entries
                stats.initTable();
                // Sort the array
                if (!desc) {
                    $("th").eq(index).addClass("desc");
                    if (index === 0) {
                        // Sort the string
                        map.sort(function(a, b) {
                            return b["value"].localeCompare(a["value"]);
                        });
                    } else {
                        // Sort the value
                        map.sort(function(a, b) {
                            return b["value"] - a["value"];
                        });
                    }
                } else {
                    $("th").eq(index).addClass("asce");
                    if (index === 0) {
                        // Sort the string
                        map.sort(function(a, b) {
                            return a["value"].localeCompare(b["value"]);
                        });
                    } else {
                        // Sort the value
                        map.sort(function(a, b) {
                            return a["value"] - b["value"];
                        })
                    }
                }
                // Iterate to add the element
                for (i = 0; i !== Object.keys(map).length; ++i) {
                    stats.addEntry(map[i]["key"]);
                }
            }
        });
    $("#contents").fadeOut(400, function() {
        // Total count for everything
        $("#search-result").addClass("stats");
        $(".response").addClass("stats");
        stats.getYearSum();
        $("#stats-pane").fadeIn();
    });
};
/**
 * Initializes or resets the table for display
 */
stats.initTable = function() {
    stats.oldValue = "";
    stats.removeAll();
    // The first line
    var html = "<thead><tr><th>Index</th>";
    // Add from existed array
    for (var i = 0; i !== app.monthArray.length; ++i) {
        html += "<th>" + app.monthArray[i] + "</th>";
    }
    html += "<th>Total</th></tr></thead><tbody></tbody>";
    $("#stats-table").html(html);
    $("tbody").addClass("fadein");
};
/**
 * Quits the stats panel
 */
stats.quit = function() {
    stats.removeAll();
    // Animation to recover what it was
    $("#query").fadeIn();
    $("#stats-query").fadeOut().unbind("keyup");
    // Unbind click to toggle checkbox
    $("#stats-options li.checkbox").each(function() {
        $(this).unbind("click");
    });
    $(".stats").removeClass("stats");
    // Unbind hover to highlight the same column and row
    $("#stats-table")
        .undelegate("td", "mouseover mouseleave contextmenu")
        .undelegate("input", "focusin focusout keyup")
        .delegate("th", "contextmenu");
    // Unbind enter to search for #stats-query
    $("#stats-pane").fadeOut(400, function() {
        $("#contents").fadeIn();
        animation.showMenuOnly();
        app.refresh();
    });
};

/**
 * Adds an entry to the stats chart. If the entries have multiple keywords,
 * separate by `|`
 * @param {string} entry - An entry string of keywords separated by `|`
 * @param {number} overwriteNum (Optional) - The index of the table row to be
 *     overwriten, started with 1
 */
stats.addEntry = function(entry, overwriteNum) {
    /* Iterator */
    var i;
    // Empty or create it anyway
    var result = stats.getResult(entry);
    stats.entries[entry] = result;
    // Process each month's list
    var monthCount = new Array(12),
        day = 0,
        sum = 0;
    for (i = 0; i !== stats.monthVal.length; ++i) {
        monthCount[i] = 0;
        for (var j = 0; j !== stats.monthVal[i]; ++j, ++day) {
            if (result[day]) {
                monthCount[i] += result[day];
            }
        }
        // Add to the sum
        sum += monthCount[i];
    }
    // Show the html result
    var htmlContent = "<td><input type='text' class='edit' autocomplete='off' onclick='this.select()' value='" + entry + "' /></td>";
    for (i = 0; i !== monthCount.length; ++i) {
        htmlContent += "<td>" + monthCount[i] + "</td>";
    }
    htmlContent += "<td>" + sum + "</td>";
    if (overwriteNum) {
        // Overwrite a content
        $("tbody tr:nth-child(" + overwriteNum + ") input")
            .parent()
            .parent()
            .html(htmlContent)
            .addClass("fadein");
    } else {
        // Wrap with <tr>
        htmlContent = "<tr>" + htmlContent + "</tr>";
        // Append to the end of the table
        $(htmlContent).appendTo("tbody").addClass("fadein");
    }
    stats.hideGraph();
};
/**
 * Processes an entry to its simplified form (e.g. foo|||||bar goes to foo|bar)
 * and returns it. This function does not split this string.
 * @param {string} str - The entry to be processed
 * @returns {string} - The simplified entry
 */
stats.simplifyEntry = function(str) {
    var group = str.split("|"),
        ret = [];
    for (var i = 0; i !== group.length; ++i) {
        if (group[i].length > 0) {
            ret.push(group[i]);
        }
    }
    return ret.join("|");
};
/**
 * Gets the summary for this year and update necessary DOM's
 */
stats.getYearSum = function() {
    var totalChar = 0,
        totalLine = 0,
        totalTime = 0,
        totalImage = 0,
        totalVideo = 0,
        totalVoice = 0;
    for (var i = 0; i !== journal.archive.data[app.year].length; ++i) {
        var data = journal.archive.data[app.year][i];
        if (stats.isInTimeRange(data["time"]["created"])) {
            totalChar += data["text"]["chars"] || 0;
            totalLine += data["text"]["lines"] || 0;
            if (data["time"]["end"]) {
                var timeDelta = (data["time"]["end"] - data["time"]["start"]) / 60000;
                if (!isNaN(timeDelta)) {
                    totalTime += timeDelta;
                }
            }
            if (data["images"]) {
                totalImage += data["images"].length;
            }
            if (data["video"]) {
                totalVideo += data["video"].length;
            }
            if (data["voice"]) {
                totalVoice += data["voice"].length;
            }
        }
    }
    // Update it on DOM
    $("#total-char").text(totalChar);
    $("#total-line").text(totalLine);
    // Human-readable time
    var minute = totalTime % 60;
    if (minute < 10) {
        minute = "0" + minute;
    }
    $("#total-time").text(Math.floor(totalTime / 60) + ":" + minute);
    $("#total-image").text(totalImage);
    $("#total-video").text(totalVideo);
    $("#total-voice").text(totalVoice);
};
/**
 * Gets the result of this entry search, of 12 sizes, which refers to 12 months
 * @param {string} entry - An entry string of keywords separated by `|`
 * @returns {object} - A list of 12 elements, refer to 12 months, each of which
 *     has at most 31 elements refer to each day in the month
 */
stats.getResult = function(entry) {
    var keywords = entry.split("|"),
        result;
    if (stats.isLeapYear) {
        // This is a leap year
        result = new Array(366);
    } else {
        result = new Array(365);
    }
    for (var i = 0; i !== journal.archive.data[app.year].length; ++i) {
        // The string result to search
        var strings = [],
            data = journal.archive.data[app.year][i],
            createdTime = data["time"]["created"];
        if (stats.isInTimeRange(createdTime)) {
            var day = stats.getDayNumber(createdTime);
            strings.push(data["text"]["body"]);
            if (this.options.isIncludingTags) {
                strings.push(data["tags"]);
            }
            if (this.options.isIncludingTitles) {
                strings.push(data["title"]);
            }
            // The time is in range
            for (var j = 0; j !== strings.length; ++j) {
                // Iterate strings
                var string = strings[j];
                if (string) {
                    for (var k = 0; k !== keywords.length; ++k) {
                        // Iterate keywords
                        var keyword = keywords[k];
                        if (!result[day]) {
                            result[day] = 0;
                        }
                        // Add the counts of the keyword
                        result[day] += (string.match(new RegExp(keyword, "gi")) || []).length;
                    }
                }
            }
        }
    }
    return result;
};


/**
 * Gets how many days have passed since the first day of `app.year`. The first
 * day should return 0
 * @param {number} time - The time to get the result
 * @returns {number} - How many days has passed
 */
stats.getDayNumber = function(time) {
    var date = new Date(time),
        firstDay = new Date(app.year, 0, 1);
    return Math.floor((new Date(date) - firstDay) / 86400000);
};
/**
 * Tests if the passed in created time is in range limited by `stats.options`
 * @param {number} createdTime - The started time of seconds since epoch
 * @returns {boolean} - Whether created time is in the range
 */
stats.isInTimeRange = function(createdTime) {
    var day = stats.getDayNumber(createdTime);
    return day >= stats.options.startDay && day <= stats.options.endDay;
};

/**
 * Removes all the entries on the chart to reset the chart
 */
stats.removeAll = function() {
    $("#stats-table").html("").fadeIn().css("display", "inline-table");
    stats.entries = {};
    stats.hideGraph();
};

/**
 * Toggles to show the analysis graph
 * Todo add a parameter to determine whether to display as each day or each
 * month
 */
stats.toggleGraph = function() {
    if (!stats.isGraphDisplayed) {
        stats.showGraph();
    } else {
        stats.hideGraph();
    }
};
/**
 * Shows the analysis graph
 * @param {boolean} viewAsMonth - Whether to view the chart as month
 */
stats.showGraph = function(viewAsMonth) {
    /* Iterator */
    var i, j;
    stats.isGraphDisplayed = true;
    var series = [],
        days = [],
        name;
    // Choose the way of showing the graph
    if (viewAsMonth) {
        days = app.monthArray;
        // Extract the data from the html content
        $("#stats-table tbody tr").each(function() {
            var monthData = [];
            $(this).children("td").each(function(n) {
                if (n === 0) {
                    // The first element, get the input value
                    name = $(this).children("input").val();
                } else if (n < 13) {
                    // Gets the data
                    monthData.push($(this).html());
                }
            });
            series.push({
                name: name,
                data: monthData
            });
        });
    } else {
        var entries;
        for (i = 0, entries = Object.keys(stats.entries);
             i !== entries.length;
             ++i) {
            name = entries[i];
            series.push({
                name: entries[i],
                data: stats.entries[name]
            });
            // Test if `days` has been initialized according to the dates
            // available
            if (i === 0) {
                var entry = stats.entries[name];
                // Only do this check once
                for (j = 0; j !== entry.length; ++j) {
                    if (entry[j] != undefined) {
                        // A valid date
                        days.push(stats.eachDay[j]);
                    }
                }
            }
        }
    }
    // Clean up the series for incoming days (undefined array element)
    for (i = 0; i !== Object.keys(series).length; ++i) {
        var arr = series[i]["data"],
            newArr = [];
        // Clean undefined days
        for (j = 0; j !== arr.length; ++j) {
            // Add only valid day(s)
            if (arr[j] != undefined) {
                newArr.push(arr[j]);
            }
        }
        series[i]["data"] = newArr;
    }
    var data = {
        chart    : {
            backgroundColor: "#f3f3f3"
        },
        title    : {
            text: "Stats for this year",
            x   : -20 //center
        },
        subtitle : {
            text: "Collected from " + $("#total-char")
                .html() + " chars in " + $("#total-entry").html() + " entries",
            x   : -20
        },
        xAxis    : {
            categories: days
        },
        yAxis    : {
            min      : 0,
            plotLines: [{
                value: 0,
                width: 1,
                color: "#808080"
            }],
            title    : {
                text: "Times"
            }
        },
        legend   : {
            layout       : "vertical",
            align        : "right",
            verticalAlign: "middle",
            borderWidth  : 0
        },
        series   : series,
        exporting: {
            enabled : false,
            filename: "Journal Analysis " + app.year
        }
    };
    $("#graph").fadeIn().highcharts(data);
    $("#action-stats .hidden").removeClass("hidden");
    animation.testAllSubs();
};
/**
 * Hides the analysis graph
 */
stats.hideGraph = function() {
    stats.isGraphDisplayed = false;
    $("#graph").fadeOut(function() {
        $(this).html("");
    });
    $("#action-stats .hidden-icon").addClass("hidden");
    animation.testAllSubs();
};
/**
 * Toggles the year view between by day and by month (i.e. as the chart shows)
 */
stats.toggleYearView = function() {
    stats.hideGraph();
    stats.options.viewAsMonth = !stats.options.viewAsMonth;
    stats.showGraph(stats.options.viewAsMonth);
};


//endregion


//region calendar
window.calendar = function() {
    "use strict";

    /**
     * The threshold of each bulb. The first element (number) of each element means the minimum number the bulb(s) have
     * to be. The key (number) should be sorted descendingly
     * @type {{}}
     * @private
     */
    var _BULB_CLASS_THRESHOLD = [
            [15, "bulb-3"],
            [7, "bulb-2"],
            [3, "bulb-1"],
            [1, "bulb-0"]
        ],
        /**
         * Whether some basic functions of it has been initialized
         * @type {boolean}
         * @private
         */
        _isInitialized = false,
        _monthArticleNum = {},
        _monthBulbNum = {};

    /**
     * Generates the calendar of this year
     * @returns {Array} - an array of 12 elements representing 12 months, with each element having 42 (6 * 7) days. It
     *     starts with Sunday. For empty day, use 0 instead.
     * @private
     */
    var _generateCalendar = function() {
        // Get the first day of this year
        var day = new Date();

        var days = [];

        day.setMonth(0, 0);

        var monthArray = [];
        for (var i = 0; i < (day.getDay() + 1) % 7; ++i) {
            monthArray.push(0);
        }

        // To adjust the year
        day.setFullYear(day.getFullYear() + 1);

        for (var month = 1; month <= 12; ++month) {
            // Go to the last day of the previous month
            day.setMonth(month, 0);

            // Fill in the date
            for (i = 1; i <= day.getDate(); ++i) {
                monthArray.push(i);
            }

            // Fill in zero's to make 42 elements
            while (monthArray.length < 42) {
                monthArray.push(0);
            }

            days.push(monthArray);

            monthArray = [];

            // Push zero's for the next month
            for (var i = 0; i < (day.getDay() + 1) % 7; ++i) {
                monthArray.push(0);
            }
        }

        return days;
    };

    /**
     * Gets the appropriate class name given the amount of bulbs
     * @param bulbNumber {Number} - the number of bulbs
     * @returns {string} - the class name
     * @private
     */
    var _getBulbClassGivenAmount = function(bulbNumber) {
        for (var i = 0; i !== _BULB_CLASS_THRESHOLD.length; ++i) {
            if (bulbNumber > _BULB_CLASS_THRESHOLD[i][0]) {
                return _BULB_CLASS_THRESHOLD[i][1];
            }
        }

        return "";
    };

    /**
     * Renders the content on the calendar
     * @param time {Number} - the time of the day to render
     * @param articleNumber {Number} - whether this day has article
     * @param bulbNumber {Number} - the number of bulbs of this day
     * @private
     */
    var _renderHtml = function(time, articleNumber, bulbNumber) {
        var date = new Date(time),
            month = date.getMonth(),
            day = date.getDate(),
            dateStr = app.monthArray[month] + " " + day,
            $targetHtml = $("#month-" + month + " .day-" + day);

        if (articleNumber) {
            $targetHtml.addClass("article");
        }

        $targetHtml.addClass(_getBulbClassGivenAmount(bulbNumber))
            // Add data onto this class
            .css({
                article: articleNumber,
                bulb   : bulbNumber
            })
            // Add the new bubbles
            .prepend("<div class='bubble'>" + dateStr +
                "<p class='article-no'>" + articleNumber +
                "</p><p class='bulb-no'>" + bulbNumber +
                "</p></div>");

        _monthArticleNum[month] = (_monthArticleNum[month] || 0) + (articleNumber || 0);
        _monthBulbNum[month] = (_monthBulbNum[month] || 0) + (bulbNumber || 0);

        // Add href
        if (articleNumber || bulbNumber) {
            $targetHtml.attr("href", "javascript:;").off("click")
                .click(function() {
                    calendar.shrink(dateStr);

                    var str = "@";
                    str += month < 9 ? ("0" + (month + 1)) : (month + 1);
                    str += day < 10 ? ("0" + day) : day;
                    str += app.year % 100;
                    app.addLoadDataWithFilter(str);
                });
        } else {
        }
    };

    /**
     * Renders the month summary
     * @private
     */
    var _renderMonthSummary = function() {
        for (var i = 0; i != 12; ++i) {
            var article = _monthArticleNum[i] || 0;
            var bulb = _monthBulbNum[i] || 0;

            $("#month-" + i)
                .prepend("<div class='bubble'><p class='article-no'>" + article +
                    "</p><p class='bulb-no'>" + bulb +
                    "</p></div>")
                .find(".month-title").off("click").click(function() {
                // Get the month
                var month = parseInt($(this).parent().prop("id").substr(6));
                calendar.shrink(app.monthArray[month]);

                var str = "@";
                str += month < 9 ? ("0" + (month + 1)) : (month + 1);
                str += app.year % 100;

                app.addLoadDataWithFilter(str);
            });
        }
    };

    /**
     * Hides the upcoming month (because there is nothing to display)
     * @private
     */
    var _hideUpcomingMonths = function() {
        var date = new Date();
        if (app.year === date.getFullYear()) {
            for (var i = date.getMonth() + 1; i < 12; ++i) {
                $("#month-" + i).addClass("hidden");
            }
        }
    };

    /**
     * Highlights today
     * @private
     */
    var _highlightToday = function() {
        var date = new Date();
        if (app.year === date.getFullYear()) {
            $("#month-" + date.getMonth() + " .day-" + date.getDate()).addClass("today");
        }
    };

    return {
        viewTemplate: undefined,

        /**
         * Initialize the calendar view, should only be called once every time a new year is loaded
         */
        initView: function() {
            // Clean the canvas
            var data = {
                days     : _generateCalendar(),
                monthName: app.monthArray,
            };

            var view = $(calendar.viewTemplate(data));

            // Show the view
            $("#data-calendar").html(view);
        }
        ,

        /**
         * Shows the data on the calendar
         * @param filter {String} - the filter to be applied
         */
        showContent: function(filter) {
            this.clear();

            var contents = journal.archive.data[app.year],
                length = contents.length;

            // Iterate through the elements
            var currentDaySeconds = new Date(app.year, 0, 1).getTime(),
                articleNumber = 0,
                bulbNumber = 0;
            for (var i = 0; i !== length; ++i) {
                var content = contents[i];

                // Test if the difference is more than 1 day
                var time = content.time.start || content.time.created;
                if (time - currentDaySeconds >= 86400000 || time - currentDaySeconds < 0) {
                    // Render it on the previous day
                    _renderHtml(currentDaySeconds, articleNumber, bulbNumber);

                    // Update necessary data fields
                    articleNumber = 0;
                    bulbNumber = 0;
                    var newDay = new Date(time);
                    currentDaySeconds = new Date(app.year, newDay.getMonth(), newDay.getDate()).getTime();
                }

                // Count it!
                if (content.contentType === app.contentType.BULB) {
                    ++bulbNumber;
                } else {
                    ++articleNumber;
                }
            }

            _renderMonthSummary();
            _hideUpcomingMonths();
            _highlightToday();
        }
        ,

        /**
         * Clear all the labels/tags on the calendar, also reset all the data fields
         */
        clear: function() {
            $(".calendar-table .day")
                .removeClass("article bulb-0 bulb-1 bulb-2 bulb-3 bulb-4 bulb-5 bulb-6 bulb-7");

            _monthArticleNum = {};
            _monthBulbNum = {};

            $(".calendar-table").find(".bubble").remove();

            $(".month-cell").removeClass("hidden");
            $(".today").removeClass("today");
        }
        ,

        /**
         * Shrinks the calendar area
         * @param str - the name to be displayed
         */
        shrink: function(str) {
            str = str || "";
            $("#calendar-thumbnail").text(str);
            $("#data-calendar").addClass("minimized");
            $("#list").addClass("extended");
        }
        ,

        /**
         * Expands the calendar area
         */
        expand: function() {
            $("#data-calendar").removeClass("minimized");
            $("#list").removeClass("extended");
        }
    }
}();

//endregion