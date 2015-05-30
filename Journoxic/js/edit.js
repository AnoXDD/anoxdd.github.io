/* The script for editing anything */

window.edit = {};
/* The index of the entry being edited. Set to -1 to save a new entry */
edit.time = 0;
edit.intervalId = -1;
edit.confirmName = "";
edit.currentEditing = -1;

edit.photos = [];
edit.voices = [];
edit.videos = [];

edit.mediaIndex = {};
edit.isEditing = -1;

edit.removalList = {};

edit.localChange = [];

/******************************************************************
 ********************** INIT & QUIT *******************************
 ******************************************************************/

/**
 * Initializes the edit pane
 * localStorage["created"] will be used to track the entry being edited
 * @param {boolean} overwrite - Determines whether or not to create a new entry (overwrite previously stored info)
 * @param {number} index - The index of the archive data (optional)
 */
edit.init = function(overwrite, index) {
	// Sometimes the user just presses the edit button without quitting the audioPlayer elsewhere
	app.audioPlayer.quit();
	////console.log("edit.init(" + overwrite + ", " + index + ")");
	edit.editView = _.template($("#edit-view").html());
	var data;

	// Test if there are cached data
	if (localStorage["_cache"] == 1) {
		// There is cache
		if (overwrite == true) {
			edit.cleanEditCache();
			if (index != undefined && index != -1) {
				// Modify an entry
				data = journal.archive.data[index];
				localStorage["created"] = data["time"]["created"];
			}
		} else if (overwrite == false) {
			// Read from available caches
			if (localStorage["created"]) {
				index = edit.find(localStorage["created"]);
				if (index !== -1) {
					data = journal.archive.data[index];
				}
			} else {
				// Nothing found, start a new one
				// Placeholder
				;
			}
		} else if (overwrite == undefined) {
			// Do not overwrite or overwrite is undefined
			if (index != undefined) {
				// Display edit-confirm
				animation.setConfirm("edit");
			} else {
				// Display add-confirm
				animation.setConfirm("add");
			}
			return;
		}
	} else {
		if (index != undefined) {
			data = journal.archive.data[index];
		}
	}
	// If still no available data to be stored, create a new one
	data = data || edit.newContent();

	// Now you have caches anyway
	localStorage["_cache"] = 1;
	edit.mediaIndex = {
		place: -1,
		music: -1,
		book: -1,
		movie: -1,
		weblink: -1,
		video: -1,
		voice: -1
	};
	edit.isEditing = -1;
	// Add to cache, all the cache processing starts here
	data = edit.importCache(data);
	// Process edit.voices and edit.videos
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
			for (var i = 0; i !== data[processGroup[h]].length; ++i) {
				var name = data[processGroup[h]][i]["fileName"];
				if (journal.archive.map[name]) {
					dataGroup.push({
						name: name,
						title: data[processGroup[h]][i]["title"],
						size: journal.archive.map[name]["size"],
						id: journal.archive.map[name]["id"],
						resource: true,
						change: false
					});
				}
			}
		}
	}
	console.log(Object.keys(data));
	var editPane = $(edit.editView(data));

	// Content processing
	$(".header div").fadeOut();
	// Initialize the contents
	$("#contents").fadeOut(400, function() {
		// Initialize the pane, this line must be the first one!
		$("#edit-pane").html(editPane).fadeIn();
		// Hide photo preview panal
		$("#photo-preview").hide();
		// Enter to finish entry header
		$("#entry-header").keyup(function(n) {
			if (n.keyCode == 13) {
				// Test to add date header
				if (isNaN(parseInt($(this).val().substring(0, 6)))) {
					var date = new Date().getTime();
					date = new Date(date - 14400000);
					$(this).val(edit.format(date.getMonth() + 1) + edit.format(date.getDate()) + edit.format(date.getFullYear() % 100) + " " + $(this).val());
				}
				$("#entry-body").focus();
			}
			edit.saveTitle();
		});
		// Enter to add tag
		$("#entry-tag").keyup(function(n) {
			if (n.keyCode == 13) {
				edit.saveTag();
			}
		});
		// Click to remove tags
		$("#attach-area .texttags .other p").click(function() {
			edit.removeTag($(this).text().substring(1));
		});
		// Update cover photo for music, book and movie
		var elem = ["music", "book", "movie"];
		for (var i = 0; i != elem.length; ++i) {
			var medium = elem[i];
			for (var j = 0; j != $("#attach-area ." + medium).length; ++j) {
				var selectorHeader = edit.getSelectorHeader(medium, j),
					term = $(selectorHeader + ".title").val() + "%20" + $(selectorHeader + ".desc").val();
				getCoverPhoto(selectorHeader, term, false, medium);
			}
		}
		if (localStorage["title"]) {
			$("#entry-header").val(localStorage["title"]);
		}
		if (localStorage["body"]) {
			$("#entry-body").text(localStorage["body"]);
		}
		// Tag processing
		var tagsHtml = app.bitwise().getTagsHTML(),
			tagsName = app.bitwise().getTagsArray(),
			/* The array of html names for highlighted icons */
			iconTags = app.bitwise().iconTags(parseInt(localStorage["iconTags"]));
		console.log("edit.init()\ticonTags = " + iconTags);
		for (var i = 0; i != tagsHtml.length; ++i) {
			var parent = "#attach-area .icontags";
			if (tagsHtml[i].charAt(0) == "w") {
				parent += " .weather";
			} else if (tagsHtml[i].charAt(0) == "e") {
				parent += " .emotion";
			} else {
				parent += " .other";
			}
			// Processed existed tags
			$(parent).append(
				"<p class='icons " + tagsHtml[i] +
				"' title=" + tagsName[i].capitalize() +
				" onclick=edit.toggleIcon('" + tagsHtml[i] +
				"')></p>");
		}
		// In this loop, imitate to click on each icon (so some icons can disappear)
		for (var i = 0; i != tagsHtml.length; ++i) {
			if ($.inArray(tagsHtml[i], iconTags) != -1) {
				$("#edit-pane #attach-area .icontags p." + tagsHtml[i]).trigger("click");
			}
		}
		$("#edit-pane #attach-area .icontags .other, #edit-pane #attach-area .texttags .other, #edit-pane #attach-area .images").mousewheel(function(event, delta) {
			// Only scroll horizontally
			this.scrollLeft -= (delta * 50);
			event.preventDefault();
		});

		edit.refreshSummary();
	});
	headerShowMenu("add");
	edit.intervalId = setInterval(edit.refreshTime, 1000);
};
edit.quit = function(selector, save) {
	clearInterval(edit.intervalId);
	edit.time = 0;
	edit.mediaIndex = {};
	edit.localChange = [];
	if (save) {
		// Save to local contents
		edit.save(selector);
	} else {
		animation.log(log.EDIT_PANE_QUIT);
	}
	edit.photos = [];
	edit.removalList = {};
	// Set everything to initial state
	edit.cleanupMediaEdit();
	// Content processing
	$(".header div").fadeIn();
	$("#edit-pane").fadeOut(400, function() {
		// Remove the edit pane
		$("#edit-pane").html("");
		$("#contents").fadeIn();
		// Reload
		app.load("", true);
		headerShowMenu("edit");
	});
	// Clean cache anyway
	edit.cleanEditCache();
};
/**
 * Saves cache for edit-pane to journal.archive.data
 * @param {string} selector - The selector to show the finished animation
 */
edit.save = function(selector) {
	var id, html;
	animation.log(log.EDIT_PANE_SAVE_START, 1);
	if (animation.isShown("#confirm")) {
		// Confirm button will be pressed automatically if shown
		animation.log(log.EDIT_PANE_SAVE_PENDING_ATTACHMENTS);
		edit.confirm();
	}
	if (selector) {
		html = $(selector).html();
		$(selector).html("&#" +
			"" +
			"xf1ce").addClass("spin").removeAttr("onclick").removeAttr("href");
		id = animation.blink(selector);
	}
	edit.processRemovalList();
	// Save photos, voices and videos
	edit.photoSave(function() {
		edit.playableSave(1, function() {
			edit.playableSave(3, function() {
				clearInterval(id);
				var index = edit.find(localStorage["created"]);
				edit.exportCache(index);
				edit.sortArchive();
				journal.archive.data = edit.minData();
				edit.saveDataCache();
				$(selector).html(html).removeClass("spin").attr({
					onclick: "edit.save('" + selector + "')",
					href: "#"
				});
				// Show finish animation
				animation.finished(selector);
				animation.log(log.EDIT_PANE_SAVE_END, -1);
				// Upload the file to OneDrive
				uploadFile();
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
 * Syncs between the local and caches. Local cache will overwrite data if there is 
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
	// iconTags
	if (localStorage["iconTags"]) {
		data["iconTags"] = localStorage["iconTags"];
	} else {
		localStorage["iconTags"] = data["iconTags"] ? data["iconTags"] : 0;
	}
	// textTags
	if (localStorage["textTags"]) {
		data["textTags"] = localStorage["textTags"];
	} else {
		localStorage["textTags"] = data["textTags"] ? data["textTags"] : "";
	}
	// photos, video, place, music, book, movie
	var elem = ["images", "video", "voice", "place", "music", "book", "movie", "weblink"];
	for (var i = 0; i !== elem.length; ++i) {
		var medium = elem[i];
		if (localStorage[medium]) {
			data[medium] = JSON.parse(localStorage[medium]);
		} else {
			localStorage[medium] = data[medium] ? JSON.stringify(data[medium]) : "[]";
		}
	}
	// Return value
	return data;
};
edit.exportCache = function(index) {
	var data = journal.archive.data[index] || {};
	// Process body from cache
	data = edit.exportCacheBody(data);
	// Title
	data["title"] = localStorage["title"] || "Untitled";
	data["processed"] = 0;
	if (!data["coverType"]) {
		data["coverType"] = 0;
	}
	if (!data["attachments"]) {
		data["attachments"] = 0;
	}
	data["iconTags"] = !isNaN(parseInt(localStorage["iconTags"])) ? parseInt(localStorage["iconTags"]) : 0;
	data["textTags"] = localStorage["textTags"];
	var media,
		elem = ["images", "video", "music", "voice", "book", "movie", "place", "weblink"],
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
		journal.archive.data.push(data);
	} else {
		// Modify the new one
		journal.archive.data[index] = data;
		app.currentDisplayed = -1;
	}
};
/**
 * Reads the cache and process start, created and end time from the text body
 * @param {object} data - The data clip of entry to be processed
 */
edit.exportCacheBody = function(data) {
	if (!data["time"]) {
		data["time"] = {};
	}
	data["time"]["created"] = parseInt(localStorage["created"]);
	// Test if begin and end time is overwritten
	var lines = localStorage["body"].split(/\r*\n/);
	for (var i = 0; i != lines.length; ++i) {
		var line = lines[i],
			flag = false;
		if (line.substring(0, 7) == "Begin @") {
			// Overwrite begintime
			data["time"]["start"] = edit.convertTime(line.substring(8));
			flag = true;
		} else if (line.substring(0, 5) == "End @") {
			// Overwrite endtime
			data["time"]["end"] = edit.convertTime(line.substring(6));
			flag = true;
		} else if (line.substring(0, 9) == "Created @") {
			// Overwrite createdtime
			data["time"]["created"] = edit.convertTime(line.substring(10));
			flag = true;
		}
		if (flag) {
			// Remove the current line
			lines.splice(i, 1);
			--i;
		}
	}
	if (!data["text"]) {
		data["text"] = {};
	}
	var newBody = lines.join("\r\n");
	data["text"]["body"] = newBody;
	data["text"]["chars"] = newBody.length;
	data["text"]["lines"] = lines.length;
	data["text"]["ext"] = newBody.substring(0, 50);
	return data;
};
edit.cleanEditCache = function() {
	localStorage["_cache"] = 0;
	var deleteList = ["title", "body", "created", "currentEditing", "iconTags", "textTags", "place", "music", "movie", "book", "images", "weblink", "video", "voice"];
	for (var i = 0; i != deleteList.length; ++i) {
		delete localStorage[deleteList[i]];
	}
	edit.photos = [];
	edit.voices = [];
	edit.videos = [];
};
/**
 * Saves the entire journal.archive.data to cache
 */
edit.saveDataCache = function() {
	localStorage["archive"] = JSON.stringify(journal.archive.data);
};
/**
 * Cleans the cache for journal.archive.data
 */
edit.removeDataCache = function() {
	delete localStorage["archive"];
};
/**
 * Tries to read journal.archive.data from cache and then copy it to journal.archive.data
 */
edit.tryReadCache = function() {
	if (localStorage["archive"]) {
		// Seems that there is available data
		journal.archive.data = JSON.parse(localStorage["archive"]);
		app.load("", true);
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
	for (var key = 0, len = journal.archive.data.length; key != len; ++key) {
		if (journal.archive.data[key]) {
			if (journal.archive.data[key]["time"]) {
				if (journal.archive.data[key]["time"]["created"] == created) {
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
	dict["textTags"] = "";
	// photos, video, place, music, book, movie
	var elem = ["images", "video", "voice", "place", "music", "book", "movie", "weblink"];
	for (var i = 0; i !== elem.length; ++i) {
		dict[elem[i]] = undefined;
	}
	return dict;
};
/**
 * Minimizes the data, remove unnecessary tags 
 */
edit.minData = function() {
	var tmp = journal.archive.data.filter(function(key) {
		return key != undefined;
	});
	for (var key = 0, len = tmp.length; key != len; ++key) {
		delete tmp[key]["attached"];
		delete tmp[key]["contents"];
		delete tmp[key]["datetime"];
		delete tmp[key]["endtime"];
		delete tmp[key]["ext"];
		delete tmp[key]["index"];
		delete tmp[key]["lines"];
		delete tmp[key]["month"];
		delete tmp[key]["processed"];
		delete tmp[key]["summary"];
		delete tmp[key]["type"];
		delete tmp[key]["year"];
		// Remove undefined object
		for (var i = 0; i < tmp[key].length; ++i) {
			if (tmp[key][i] == undefined || tmp[key][i] == "undefined") {
				// Splice this key and also decrement i
				tmp[key].splice(i--, 1);
			}
		}
	};
	return tmp;
};
/**
 * Sorts journal.archive.data 
 */
edit.sortArchive = function() {
	journal.archive.data.sort(function(a, b) {
		// From the latest to oldest
		return b["time"]["created"] - a["time"]["created"];
	});
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
 * Add a medium to the edit pane, given the typeNum
 * @param {Number} typeNum - The number of the type of media, or can be a helper value to video and voice
 * @param {Object} arg - The extra arg to be provided by other helper call to this function. When typeNum == -3 this has to include "url", "fileName", "id" and "title" key
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
			htmlContent = "<div class=\"voice data change\"><a class='" + arg["fileName"] + "' onclick=\"edit.voice(" + length + ",'" + arg["url"] + "')\" title=\"Listen to it\"><div class=\"thumb\"><span></span></div><input disabled class=\"title\" value=\"" + arg["title"] + "\" /></a></div>";
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
		$(htmlContent).insertAfter($(selectorHeader + ":eq(" + (length - 1) + ")"));
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
	// Move voice and video data to data folder
	switch (typeNum) {
		case 1:
			// Video
			// Placeholder, do nothing now 
			break;
		case 3:
			// Voice
			edit.voiceToggle();
			break;
		default:
			// In other cases, this step will be taken care of in their individual functions because it is not sure that if the transfer will be successful from the server side
			edit.addToRemovalList(type);
	}
	edit.cleanupMediaEdit();
};
/**
 * Add a media element to pending removal list and make this element fade out from the view. 
 * The list will not be removed until edit.quit() is called
 * @param {string} name - The string of the type of media
 * @param {number} index (Optional) - The index of the type of media to be added to the list
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
/* Get the name of media by value */
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
 * A function to be called by confirm 
 */
edit.confirm = function() {
	if (typeof (edit.confirmName) == "string") {
		if (edit.confirmName == "discard") {
			edit.quit(false);
		} else if (edit.confirmName == "delete") {
			// Change the data displayed
			--app.displayedNum;
			var data = journal.archive.data[app.currentDisplayed];
			app.displayedChars -= data["text"]["chars"];
			app.displayedLines -= data["text"]["lines"];
			app.displayedTime -= (data["time"]["end"] - data["time"]["start"]) / 60000;
			// Remove from the map
			delete journal.archive.data[app.currentDisplayed];
			// Clear from the list
			$("#list ul li:nth-child(" + (app.currentDisplayed + 1) + ") a").fadeOut(500, function() {
				// Remove this from the list
				$(this).remove();
			});
			app.detail.prototype.hideDetail();
			$(".loadmore").trigger("click");
			// Save to cache
			edit.saveDataCache();
			headerShowMenu("edit");
		} else if (edit.confirmName == "add") {
			edit.init(true);
		} else if (edit.confirmName == "edit") {
			edit.init(true, app.currentDisplayed);
		}
	} else {
		// Media removal
		edit.removeMedia(edit.confirmName);
	}
};
/**
 * Cleans up all the media edit data to get ready for next editing 
 */
edit.cleanupMediaEdit = function() {
	$("#edit-pane").off("keyup");
	switch (edit.isEditing) {
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
 * @param {number} index (Optional) - The index of the media. If not specified, value will be retrieved from edit.mediaIndex
 * @returns {string} - The selector header
 */
edit.getSelectorHeader = function(type, index) {
	if (index == undefined) {
		return "#attach-area ." + type + ":eq(" + edit.mediaIndex[type] + ") ";
	}
	return "#attach-area ." + type + ":eq(" + index + ") ";
};

/************************** ANIMATION *****************************/

edit.toggleIcon = function(htmlName) {
	var selector = "#attach-area .icontags p." + htmlName,
		parent = $(selector).parent().attr("class"),
		iconVal = app.bitwise().getIconval($(selector).attr("title").toLowerCase());
	if ($(selector).toggleClass("highlight").hasClass("highlight")) {
		if (parent == "weather" || parent == "emotion") {
			$("#attach-area .icontags ." + parent + " p:not(." + htmlName + ")").css("height", "0");
		}
		// Now highlighted
		localStorage["iconTags"] = app.bitwise().or(parseInt(localStorage["iconTags"]), iconVal);
	} else {
		if (parent == "weather" || parent == "emotion") {
			$("#attach-area .icontags ." + parent + " p:not(." + htmlName + ")").removeAttr("style");
		}
		// Dimmed
		localStorage["iconTags"] = app.bitwise().andnot(parseInt(localStorage["iconTags"]), iconVal);
	}
};
edit.toggleLight = function() {
	$("#text-area").toggleClass("dark").children().toggleClass("dark");
};
edit.fullScreen = function() {
	// Clean all the data to hide map selector and photo viewer
	edit.cleanupMediaEdit();
	// Disable auto-height
	$(window).off("resize");
	// Change the icon
	animation.hideIcon(".actions a", function() {
		$("#toggle-screen").html("&#xf066").attr({
			title: "Back to window",
			onclick: "edit.windowMode()"
		});
	});
	animation.showIcon("#toggle-screen");
	// Add the icon
	animation.showIcon("#toggle-light");
	// Hide the other part
	$(".header").fadeOut(400, function() {
		$("#app").animate({ top: "2%", height: "95%" });
	});
	$("#attach-area").fadeOut(400, function() {
		$("#text-area").animate({ width: "100%" });
	});
	$("#text-area").children().toggleClass("fullscreen");
	$("#text-area p").toggleClass("fullscreen");
};
edit.windowMode = function() {
	// Exit dark mode
	$("#text-area").removeClass("dark").children().removeClass("dark");
	// Change the icon
	headerShowMenu("add");
	$("#toggle-screen").html("&#xf065").attr({
		title: "Go fullscreen",
		onclick: "edit.fullScreen()"
	});
	// Resize
	$("#app").animate({ top: "8%", height: "76%" });
	$(".header").fadeIn(400, function() {
		$("#text-area p").toggleClass("fullscreen");
		$("#text-area").animate({ width: "64%" }, function() {
			$("#attach-area").fadeIn();
			// Re-enable auto-height
			app.layout();
		})
			.children().toggleClass("fullscreen");
	});
};

/************************** TITLE *********************************/

edit.saveTitle = function() {
	localStorage["title"] = $("#entry-header").val();
};

/************************** TITLE HEADER **************************/

edit.saveTag = function() {
	var tagVal = $("#entry-tag").val().toLowerCase().replace(/\|/g, "");
	// Test for duplicate
	if (localStorage["textTags"].split("|").indexOf(tagVal) != -1) {
		// The entry is already added
		animation.warning(log.TAG_ADD_HEADER + tagVal + log.TAG_ADDED_ALREADY);
		$("#entry-tag").effect("highlight", { color: "#000" }, 400);
	} else {
		var found = false;
		// Try to convert to iconTag
		$("#attach-area .icontags p").each(function() {
			if ($(this).attr("title").toLowerCase() == tagVal) {
				// Found
				found = true;
				var parent = $(this).parent().attr("class");
				if (parent == "weather" || parent == "emotion") {
					// Only one weather and emotion is allowed
					if ($(this).css("height") == "0px") {
						// Hidden div, means another weather/emotion has already been added
						animation.warning(log.TAG_ADD_HEADER + tagVal + log.TAG_ADDED_FAILED);
						$("#entry-tag").effect("highlight", { color: "#000" }, 400);
						return;
					}
				}
				if (!$(this).hasClass("highlight")) {
					animation.log(log.TAG_ADD_HEADER + tagVal + log.TAG_ADDED_ICON);
					$(this).trigger("click");
				} else {
					animation.warning(log.TAG_ADD_HEADER + tagVal + log.TAG_ADDED_ICON_ALREADY);
					$("#entry-tag").effect("highlight", { color: "#000" }, 400);
					// Saved
				}
				return;
			}
		});
		if (!found) {
			// Keep searching
			$("#entry-tag").effect("highlight", { color: "#dadada" }, 400);
			// Marked for a new entry
			$("#attach-area .texttags .other").append("<p title='Click to remove' onclick=edit.removeTag('" + tagVal + "')>#" + tagVal + "</p>");
			// Add to the cache
			if (localStorage["textTags"] == "") {
				localStorage["textTags"] = tagVal;
			} else {
				localStorage["textTags"] += "|" + tagVal;
			}
		}
	}
	// Clean the entry
	$("#entry-tag").val("");
};
edit.removeTag = function(tagName) {
	var tagArray = localStorage["textTags"].split("|");
	delete tagArray[tagName];
	tagArray.join("|");
	// Remove from the panal
	$("#attach-area .texttags p").each(function() {
		if ($(this).text() == "#" + tagName) {
			$(this).animate({ width: "0" }, function() {
				$(this).remove();
			});
		}
	});
};
edit.refreshSummary = function() {
	var text = $("#entry-body").val(),
		char = text.length;
	$("#entry-char").text(char);
	// Cache the data
	localStorage["body"] = text;
	$("#entry-line").text(text.split(/\r*\n/).length);
};
edit.refreshTime = function() {
	++edit.time;
	var date = new Date();
	var timeString = edit.format(date.getMonth() + 1) + edit.format(date.getDate()) + edit.format(date.getFullYear() % 100) + " " + edit.format(date.getHours()) + edit.format(date.getMinutes());
	$("#entry-time").text(timeString);
	$("#entry-elapsed").text(parseInt(edit.time / 60) + ":" + edit.format(edit.time % 60));
};
/**
 * Returns a formatted string of a number. Equivalent to String.format("%2d", n)
 * @param {number} n - The digit number to be formatted
 * @returns {string} - The string to make the number at started with an 0 if length is 1
 */
edit.format = function(n) {
	return n < 10 ? "0" + n : n;
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
		hour = parseInt(time.substring(7, 9)),
		minute = parseInt(time.substring(9, 11)),
		date = new Date(2000 + year, month - 1, day, hour, minute);
	return date.getTime();
};
/**
 * Returns my version of data with priority of
 * 1) Title content
 * 2) Created time
 * 3) Time of calling this function
 * @returns {string} - My format of the time
 */
edit.getDate = function() {
	var dateStr;
	// Get date from title, ignore what title looks like
	if (localStorage["title"]) {
		// Sometimes for some reason the first character is an "empty" char
		dateStr = parseInt(localStorage["title"]);
		if (!isNaN(dateStr)) {
			if (dateStr.toString().length === 5) {
				dateStr = "0" + dateStr;
			}
			if (dateStr.toString().length === 6) {
				// Correct format
				return dateStr;
			}
		}
	}
	var date;
	if (localStorage["created"]) {
		// Date will be based on created
		date = new Date(parseInt(localStorage["created"]));
	} else {
		// Date will be based on now
		date = new Date().getTime();
		date = new Date(date - 14400000);
	}
	dateStr = "" + edit.format(date.getMonth() + 1) + edit.format(date.getDate()) + edit.format(date.getFullYear() % 100);
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
	return "" + edit.format(date.getMonth() + 1) + edit.format(date.getDate()) + edit.format(date.getFullYear() % 100) + " " + edit.format(date.getHours()) + edit.format(date.getMinutes());
}

/************************** PHOTO 0 ************************/

edit.photo = function() {
	if (edit.photos.length != 0) {
		// Return if edit.photo is already displayed
		animation.error(log.EDIT_PANE_IMAGES_ALREADY_LOADED);
		return;
	}
	var images = JSON.parse(localStorage["images"]);
	if (images) {
		// Test if this entry really doesn't have any images at all
		if (!(Object.keys(journal.archive.map).length > 0)) {
			animation.error(log.EDIT_PANE_IMAGES_FAIL + log.DOWNLOAD_PROMPT);
			animation.deny("#add-photo");
			return;
		}
	}
	$("#attach-area .images").css({ height: "100px" });
	// Add throttle
	$("#add-photo").html("&#xf1ce").addClass("spin").removeAttr("onclick").removeAttr("href");
	edit.photos = [];
	for (var i = 0; i < images.length; ++i) {
		var name = images[i]["fileName"];
		if (journal.archive.map[name]) {
			var image = {
				name: name,
				size: journal.archive.map[name]["size"],
				url: journal.archive.map[name]["url"],
				resource: true,
				/* Whether this image is moved to the other location, 
				 * i.e. if it is deleted or added
				 */
				change: false
			};
			edit.photos.push(image);
		} else {
			// File not found, remove this file
			images.splice(i--, 1);
			localStorage["images"] = JSON.stringify(images);
		}
	}
	// Get resource photos from user content folder
	// Get correct date folder
	var dateStr;
	if (images.length != 0) {
		// Get date from photos already existed
		dateStr = images[0]["fileName"].substring(0, 6);
	} else {
		dateStr = edit.getDate();
	}
	animation.log(log.EDIT_PANE_SAVE_START + dateStr + log.EDIT_PANE_IMAGES_START_END, 1);
	getTokenCallback(function(token) {
		var url = "https://api.onedrive.com/v1.0/drive/special/approot:/data/" + dateStr + ":/children?select=id,name,size,@content.downloadUrl&access_token=" + token;
		$.ajax({
			type: "GET",
			url: url
		}).done(function(data, status, xhr) {
			if (data["@odata.nextLink"]) {
				animation.warning(log.EDIT_PANE_TOO_MANY_RESULTS);
			}
			var itemList = data["value"];
			for (var key = 0, len = itemList.length; key != len; ++key) {
				var size = itemList[key]["size"],
					name = itemList[key]["name"],
					suffix = name.substring(name.length - 4),
					found = false;
				if (suffix != ".jpg" && suffix != ".png") {
					// Only support these two types
					continue;
				}
				// Use size to filter out duplicate pahotos
				for (var i = 0, tmp = edit.photos; i != tmp.length; ++i) {
					if (tmp[i]["size"] == size) {
						found = true;
						break;
					}
				}
				if (found) {
					// Abandon this image
					continue;
				} else {
					var data = {
						name: name,
						url: itemList[key]["@content.downloadUrl"],
						size: size,
						resource: false,
						change: false
					};
					edit.photos.push(data);
				}
			}
			console.log("edit.photo()\tFinish media data");
			// Add to images div
			for (var i = 0; i != edit.photos.length; ++i) {
				var htmlContent;
				if (edit.photos[i]["resource"]) {
					// The image should be highlighted if it is already at resource folder
					htmlContent = "<div class=\"highlight\">";
				} else {
					htmlContent = "<div>";
				}
				htmlContent += "<img src=\"" + edit.photos[i]["url"] + "\"/></div>";
				$("#attach-area .images").append(htmlContent);
			}
			// Stop throttle 
			$("#add-photo").html("&#xf03e").removeClass("spin").attr({
				onclick: "edit.addMedia(0)",
				href: "#"
			}).fadeIn();
			// Clicking on img functionality
			$("#attach-area .images div img").each(function() {
				$(this).on("contextmenu", function() {
					// Right click to select the images
					$(this).parent().toggleClass("highlight");
					// Return false to disable other functionalities
					return false;
				});
			});
			// Set preview
			$("#attach-area .images").hover(function() {
				// Mouseover
				// Clean up the data
				edit.cleanupMediaEdit();
				$("#photo-preview").css("opacity", "initial").show({
					effect: "fade",
					duration: 200
				});
			}, function() {
				// Mouseout
				$("#photo-preview").hide({
					effect: "fade",
					duration: 200
				});
			}).sortable({
				containment: "#attach-area .images",
				cursor: "crosshair",
				revert: true
			}).disableSelection();
			$("#attach-area .images img").each(function() {
				$(this).hover(function() {
					// Mouseover
					$("#photo-preview img").animate({ opacity: 1 }, 200).attr("src", $(this).attr("src"));
				}, function() {
					// Mouseout
					$("#photo-preview img").animate({ opacity: 0 }, 0);
				});
			});
			animation.setConfirm(0);
			animation.log(log.EDIT_PANE_IMAGES_END, -1);
			animation.finished("#add-photo");
		})
			.fail(function(xhr, status, error) {
				$("#add-photo").html("&#xf03e").removeClass("spin").attr({
					onclick: "edit.addMedia(0)",
					href: "#"
				});
				animation.error(log.EDIT_PANE_IMAGES_FAIL + log.EDIT_PANE_IMAGES_FIND_FAIL + dateStr + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
				animation.deny("#add-photo");
			});
	});
};
/**
 * Saves the photo to OneDrive
 * IMPORATNT: This function is to be called only at edit.save() because this function will contact OneDrive server to move files, which will cause async between client and the server 
 * @param {function} callback - The callback function to be called after all the changes have been made
 */
edit.photoSave = function(callback) {
	if (edit.photos.length == 0) {
		// Nothing to process
		callback();
		return;
	} else {
		// Get the photos whose locations to be changed
		var photoQueue = [],
			timeHeader,
			/* New images attached to this entry */
			newImagesData = [],
			/* New edit.photos */
			newPhotos = [];
		// Sort edit.photos based on the sequence
		$("#attach-area .images div").each(function() {
			for (var i = 0; i != edit.photos.length; ++i) {
				if ($(this).children("img").attr("src") == edit.photos[i]["url"]) {
					// Matched
					var data = edit.photos[i];
					// Test if it switches location
					if ($(this).hasClass("highlight")) {
						if (!data["resource"]) {
							data["change"] = !data["change"];
						}
					} else {
						if (data["resource"]) {
							data["change"] = !data["change"];
						}
					}
					newPhotos.push(data);
					break;
				}
			}
		});
		edit.photos = $.extend({}, newPhotos);
		// Get the correct header for the photo
		for (var i = 0; i != Object.keys(edit.photos).length; ++i) {
			var name = edit.photos[i]["name"],
				resource = edit.photos[i]["resource"];
			if (edit.photos[i]["change"]) {
				// Reset properties in edit.photos first
				edit.photos[i]["change"] = false;
				photoQueue.push({
					name: name,
					// New location
					resource: !resource
				});
			} else if (resource) {
				// Update the data for those photos that don't change locations
				newImagesData.push({
					fileName: name
				});
			}
			// Get the correct header folder
			if (timeHeader == undefined) {
				var timeHeaderTmp = parseInt(name);
				if (!isNaN(timeHeaderTmp) && timeHeaderTmp.toString().length >= 6) {
					// Correct format
					timeHeader = timeHeaderTmp.toString().substring(0, 6);
				}
			}
		}
		if (timeHeader == undefined) {
			// Still cannot find the correct header
			timeHeader = edit.getDate();
		}
		// Store all the files in the resource folder that don't change locations later in the cache
		localStorage["images"] = JSON.stringify(newImagesData);

		// Start to change location
		var resourceDir = "/drive/root:/Apps/Journal/resource",
			contentDir = "/drive/root:/Apps/Journal/data/" + timeHeader,
			processingPhoto = 0;
		if (photoQueue.length != 0) {
			// Process the photos
			getTokenCallback(function(token) {
				animation.log(log.EDIT_PANE_SAVE_START, 1);
				for (var i = 0; i !== photoQueue.length; ++i) {
					var requestJson,
						url,
						newName,
						name = photoQueue[i]["name"],
						isToResource = photoQueue[i]["resource"];
					if (isToResource) {
						// Would like to be added to entry, originally at data folder
						newName = timeHeader + (new Date().getTime() + i) + name.substring(name.length - 4);
						requestJson = {
							// New name of the file
							name: newName,
							parentReference: {
								path: resourceDir
							}
						};
						// Still use the old name to find the file
						url = "https://api.onedrive.com/v1.0" + contentDir + "/" + name + "?select=id,name,size,@content.downloadUrl&access_token=" + token;
						// Add to cache
					} else {
						// Would like to be added to data, i.e. remove from resource folder
						newName = name;
						requestJson = {
							parentReference: {
								path: contentDir
							}
						};
						url = "https://api.onedrive.com/v1.0" + resourceDir + "/" + name + "?select=id,name,size,@content.downloadUrl&access_token=" + token;
					}
					// Update the new name
					for (var j = 0; j != edit.photos.length; ++j) {
						if (edit.photos[j]["name"] == name) {
							edit.photos[j]["newName"] = newName;
							break;
						}
					}
					$.ajax({
						type: "PATCH",
						url: url,
						contentType: "application/json",
						data: JSON.stringify(requestJson)
					})
						.done(function(data, status, xhr) {
							var newName = data["name"];
							// Add the url of this new image to map
							journal.archive.map[newName] = {
								url: data["@content.downloadUrl"],
								size: data["size"],
								id: data["id"]
							};
							animation.log((++processingPhoto) + log.EDIT_PANE_IMAGES_OF + photoQueue.length + log.EDIT_PANE_IMAGES_TRASNFERRED);
							console.log("edit.photoSave()\tFinish update metadata");
						})
						.fail(function(xhr, status, error) {
							++processingPhoto;
							animation.error(log.EDIT_PANE_TRANSFERRED_FAILED + log.SERVER_RETURNS
 + error + log.SERVER_RETURNS_END);
							animation.warning("#add-photo");
							// Revert the transfer process
						})
						.always(function(data, status, xhr) {
							// Update the final destination
							var newName = data["name"];
							// Test if newName is undefined.
							// Being undefined means an error, so nothing will be changed
							if (newName != undefined) {
								for (var k = 0; k != edit.photos.length; ++k) {
									// Still use the old name
									if (edit.photos[k]["newName"] == newName) {
										// Find the matched name
										var name = edit.photos[k]["name"],
											resource = edit.photos[k]["resource"],
											photoIndex;
										// Update the new name
										edit.photos[k]["name"] = newName;
										// Switch the location
										edit.photos[k]["resource"] = !resource;
										// Find the correct img to add or remove highlight class on it
										$("#attach-area .images img").each(function(index) {
											if (journal.archive.map[name]) {
												if ($(this).attr("src") == journal.archive.map[name]["url"]) {
													photoIndex = index;
												}
											}
										});
										// Get the result of transferring
										if (!resource) {
											// Originally not at the resource, to resource
											$("#attach-area .images div:eq(" + photoIndex + ")").addClass("highlight");
											newImagesData.push({
												fileName: newName
											});
										} else {
											// To data, and remove from cache
											$("#attach-area .images div:eq(" + photoIndex + ")").removeClass("highlight");
											for (var j = 0; j != newImagesData.length; ++j) {
												if (newImagesData[j]["fileName"] == name) {
													delete newImagesData[name];
													break;
												}
											}
											delete journal.archive.map[name];
										}
										break;
									}
								}
							}
							// Test if it is elligible for calling callback()
							if (processingPhoto == photoQueue.length) {
								localStorage["images"] = JSON.stringify(newImagesData);
								animation.log(log.EDIT_PANE_FINISHED_TRANSFER + edit.mediaName(0) + log.EDIT_PANE_FINISHED_TRANSFER_END, -1);
								callback();
							}
						});
				}
			});
		} else {
			// Call callback directly
			callback();
		}
	}
};
edit.photoHide = function() {
	// Just hide everything, no further moves to be made
	$("#attach-area .images").animate({ height: "0" }).fadeOut().html("");
};

/************************** VIDEO 1 ************************/

/**
 * Edit a video element given the index and an optional parameter of the link of the resource
 * @param {number} index (Optional) - The index of video in all the voices. If none specified, it will add to the end of the current video list
 * @param {string} link (Optional) - The url to the address of the link, for newly created element
 */
edit.video = function(index, link) {
	if (index == edit.mediaIndex["video"] || index == undefined) {
		return;
	}
	edit.cleanupMediaEdit();
	edit.mediaIndex["video"] = index;
	var selectorHeader = edit.getSelectorHeader("video");
	animation.setConfirm(1);
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
		$("#video-preview").fadeIn();
		app.videoPlayer("#video-preview", source);
	} else {
		// Find it from this dataClip
		var fileName = $(selectorHeader + "a").attr("class");
		if (journal.archive.map[fileName]) {
			source = journal.archive.map[fileName]["url"];
			if (source == undefined) {
				animation.error(log.FILE_NOT_FOUND + $(selectorHeader + ".title").val());
				return;
			}
			$("#video-preview").fadeIn();
			app.videoPlayer("#video-preview", source);
		} else {
			animation.error(log.FILE_NOT_LOADED + $(selectorHeader + ".title") + log.DOWNLOAD_PROMPT);
		}
	}
	animation.setConfirm(1);
}
edit.videoHide = function() {
	if (edit.mediaIndex["video"] < 0) {
		// Invalid call
		return;
	}
	$("#video-preview").fadeOut();
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
		$(selectorHeader + "a").attr("onclick", "edit.video(" + edit.mediaIndex["video"] + ")");
	}
	// Save data
	edit.voiceSave(edit.mediaIndex["video"]);
	$("#edit-pane").off("keyup");
	// Hide all the option button
	animation.hideIcon(".entry-option");
	edit.mediaIndex["video"] = -1;
	edit.isEditing = -1;
}
edit.videoSave = function(index) {
	var data = localStorage["video"],
		selectorHeader = edit.getSelectorHeader("video", index),
		title = $(selectorHeader + ".title").val();
	data = data ? JSON.parse(data) : [];
	var newElem = {
		title: title,
		fileName: $(selectorHeader + "a").attr("class")
	};
	data[index] = newElem;
	localStorage["video"] = JSON.stringify(data);
}
/**
 * Toggles the location of the voice element
 */
edit.videoToggle = function() {
	var index = edit.mediaIndex["video"];
	if (index >= 0) {
		// Search to change this in edit.voices
		var selectorHeader = edit.getSelectorHeader("video", index);
		// Toggle the status
		$(selectorHeader).toggleClass("change");
	}
}
/**
 * Search for all the voices from the data folder and add it to the edit.voice
 */
edit.videoSearch = function() {
	edit.playableSearch(1);
}

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
	animation.setConfirm(2);
	// Update media index
	edit.mediaIndex["place"] = index;
	// Spread map-selector
	$("#map-holder").fadeIn();
	var selectorHeader = edit.getSelectorHeader("place", index);
	// Try HTML5 geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
				var latitude = parseFloat($(selectorHeader + ".latitude").val()) || position.coords.latitude,
				longitude = parseFloat($(selectorHeader + ".longitude").val()) || position.coords.longitude;
			pos = new google.maps.LatLng(latitude, longitude);
			mapOptions = {
				zoom: 15,
				center: pos,
			};
			map = new google.maps.Map(document.getElementById("map-selector"), mapOptions);
			searchBox = new google.maps.places.Autocomplete(document.getElementsByClassName("place-search")[edit.mediaIndex["place"]], { types: ["geocode"] });
			markers = [];

			google.maps.event.clearListeners(searchBox, "place_changed");
			google.maps.event.addListener(searchBox, "place_changed", function() {
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
						map: map,
						title: place.name,
						position: place.geometry.location
					});
					marker.setMap(map);
					markers.push(marker);
					map.setZoom(16);
					map.setCenter(place.geometry.location);
					$(selectorHeader + ".latitude").val(place.geometry.location.lat());
					$(selectorHeader + ".longitude").val(place.geometry.location.lng());
				}
			});

			// Bias the SearchBox results towards places that are within the bounds of the
			// current map's viewport.
			google.maps.event.addListener(map, "bounds_changed", function() {
				var bounds = map.getBounds();
				searchBox.setBounds(bounds);
			});

			// Press enter to search
			$("#attach-area .place .desc").keyup(function(n) {
				if (n.keyCode == 13) {
					var latitude = parseFloat($(selectorHeader + ".latitude").val()),
						longitude = parseFloat($(selectorHeader + ".longitude").val());
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
		if (n.keyCode == 27) {
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
	$(selectorHeader + "a").attr("onclick", "edit.location(" + edit.mediaIndex["place"] + ")");
	// Save data by default
	edit.locationSave(edit.mediaIndex["place"]);
	// Remove the contents
	$("#map-holder").fadeOut().html("<div id=\"map-selector\"></div>");
	$("#edit-pane").off("keyup");
	// Hide all the options button
	animation.hideIcon(".entry-option");
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
 * Reverses geocoding to get the address of this position add shows it on place element on the website
 * @param {object} pos - The position object indicating the position to be reverse geocoded
 */
edit.locationGeocode = function(pos) {
	var mapOptions = {
		zoom: 16,
		center: pos
	},
		map = new google.maps.Map(document.getElementById("map-selector"), mapOptions),
		marker = new google.maps.Marker({
			map: map,
			position: pos
		}),
		selectorHeader = edit.getSelectorHeader("place");
	// Set on the map
	map.setCenter(pos);
	// Reverse geocoding to get current address
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({ 'latLng': pos }, function(results, status) {
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
 * Finds the weather info based on the position passed in. This function will only work if the weather icon in the edit-pane is not assigned to any value
 * @param {object} pos - The position object indicating the position to find the weather
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
		animation.log(log.EDIT_PANE_WEATHER_START, 1);
	}

	var apiKey = "6f1ee423e253fba5e40e3276ff3e6d33",
		url = "https://api.forecast.io/forecast/" + apiKey + "/" + pos.lat() + "," + pos.lng() + "," + parseInt(new Date().getTime() / 1000) + "?units=si";
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp"
	}).done(function(data, staus, xhr) {
		var weather = data["currently"],
			icon = weather["icon"];
		animation.log(log.EDIT_PANE_WEATHER_RESULT + weather["temperature"] + log.EDIT_PANE_WEATHER_RESULT_END);
		// Test for different icon value
		// clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night.
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
			animation.log(log.EDIT_PANE_WEATHER_END_FAIL + data["summary"] + log.EDIT_PANE_WEATHER_END_FAIL_END, -1);
		}
	});
}

/************************** VOICE 3 ************************/

/**
 * Edit a voice element given the index and an optional parameter of the link of the resource
 * @param {number} index (Optional) - The index of voice in all the voices. If none specified, it will add to the end of the current voice list
 * @param {string} link (Optional) - The url to the address of the link, for newly created element
 */
edit.voice = function(index, link) {
	if (index == edit.mediaIndex["voice"] || index == undefined) {
		return;
	}
	edit.cleanupMediaEdit();
	edit.mediaIndex["voice"] = index;
	var selectorHeader = edit.getSelectorHeader("voice");
	animation.setConfirm(3);
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
				animation.error(log.FILE_NOT_FOUND + $(selectorHeader + ".title").val());
				return;
			}
			app.audioPlayer(selectorHeader + "a", source);
		} else {
			animation.error(log.FILE_NOT_LOADED + $(selectorHeader + ".title") + log.DOWNLOAD_PROMPT);
		}
	}
	animation.setConfirm(3);
};
edit.voiceHide = function() {
	if (edit.mediaIndex["voice"] < 0) {
		// Invalid call
		return;
	}
	app.audioPlayer.quit();
	var selectorHeader = edit.getSelectorHeader("voice");
	// Disable input boxes
	$(selectorHeader + "input").prop("disabled", true).off("keyup");
	// Recover onclick event
	if (edit.func) {
		// Use edit.func
		$(selectorHeader + "a").attr("onclick", edit.func);
		edit.func = undefined;
	} else {
		$(selectorHeader + "a").attr("onclick", "edit.voice(" + edit.mediaIndex["voice"] + ")");
	}
	// Save data
	edit.voiceSave(edit.mediaIndex["voice"]);
	$("#edit-pane").off("keyup");
	// Hide all the option button
	animation.hideIcon(".entry-option");
	edit.mediaIndex["voice"] = -1;
	edit.isEditing = -1;
}
edit.voiceSave = function(index) {
	var data = localStorage["voice"],
		selectorHeader = edit.getSelectorHeader("voice", index),
		title = $(selectorHeader + ".title").val();
	data = data ? JSON.parse(data) : [];
	var newElem = {
		title: title,
		fileName: $(selectorHeader + "a").attr("class")
	};
	data[index] = newElem;
	localStorage["voice"] = JSON.stringify(data);
}
/**
 * Toggles the location of the voice element
 */
edit.voiceToggle = function() {
	var index = edit.mediaIndex["voice"];
	if (index >= 0) {
		// Search to change this in edit.voices
		var selectorHeader = edit.getSelectorHeader("voice", index);
		// Toggle the status
		$(selectorHeader).toggleClass("change");
	}
}
/**
 * Search for all the voices from the data folder and add it to the edit.voice
 */
edit.voiceSearch = function() {
	edit.playableSearch(3);
}
/**
 * Use the microphone to record a new voice
 */
edit.voiceNew = function() {

}

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
	animation.setConfirm(7);
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
	$(selectorHeader + "a").attr("onclick", "edit.weblink(" + edit.mediaIndex["weblink"] + ")");
	// Save data
	edit.weblinkSave(edit.mediaIndex["weblink"], 7);
	$("#edit-pane").off("keyup");
	// Hide all the option button
	animation.hideIcon(".entry-option");
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
		url: url
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
	animation.setConfirm(typeNum);
	$(selectorHeader + "a").removeAttr("onclick");
	$(selectorHeader + "input").prop("disabled", false).keyup(function(n) {
		// Press enter to search
		if (n.keyCode == 13) {
			var term = $(selectorHeader + ".title").val() + "%20" + $(selectorHeader + ".desc").val();
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
	$(selectorHeader + "a").attr("onclick", "edit." + type + "(" + edit.mediaIndex[type] + ")");
	// Save data
	edit.itunesSave(edit.mediaIndex[type], typeNum);
	$("#edit-pane").off("keyup");
	// Hide all the option button
	animation.hideIcon(".entry-option");
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
		title: title,
		author: author
	};
	data[index] = newElem;
	localStorage[type] = JSON.stringify(data);
};

/************* GENERIC FOR VOICE & VIDEO ***************/

/**
 * Adds a playable item from the data folder to the edit view (video and audio)
 * This function will simply fetch the data and will not make any difference on OneDrive server
 * @param {Number} typeNum - The type number of the content to be added. 1: video. 3: voice.
 */
edit.playableSearch = function(typeNum) {
	getTokenCallback(function(token) {
		var dateStr = edit.getDate(),
			url = "https://api.onedrive.com/v1.0/drive/special/approot:/data/" + dateStr + ":/children?select=id,name,size,@content.downloadUrl&access_token=" + token;
		animation.log(log.EDIT_PANE_PLAYABLE_SEARCH_START, 1);
		$.ajax({
			type: "GET",
			url: url
		})
			.done(function(data, status, xhr) {
				if (data["@odata.nextLink"]) {
					// More content available!
					// Do nothing right now
					animation.warning(log.EDIT_PANE_TOO_MANY_RESULTS);
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
				for (var key = 0, len = itemList.length; key !== len; ++key) {
					var id = itemList[key]["id"],
						size = itemList[key]["size"],
						name = itemList[key]["name"],
						contentUrl = itemList[key]["@content.downloadUrl"],
						suffix = name.substring(name.length - 4),
						elementData = {
							id: id,
							name: name,
							title: name.substring(0, name.length - 4),
							url: contentUrl,
							size: size,
							resource: false,
							change: true
						};
					// Test supported file types, if file is not supported restart the loop
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
					animation.log(edit.mediaName(typeNum).capitalize() + log.EDIT_PANE_PLAYABLE_FILE + name + log.EDIT_PANE_PLAYABLE_FILE_ADDED);
					// Add to the edit pane
					var newIndex,
						htmlContent;
					switch (typeNum) {
						case 1:
							// Video
							break;
						case 3:
							// Voice
							// Helper call to edit.media
							edit.addMedia(-3, {
								fileName: name,
								url: contentUrl,
								title: name.substring(0, name.length - 4)
							});
							break;
					}
				}
				animation.log(log.EDIT_PANE_PLAYABLE_SEARCH_END, -1);
			})
			.fail(function(xhr, status, error) {
				animation.error(log.EDIT_PANE_PLAYABLE_SEARCH_FAILED + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
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
}
/**
 * Saves all the playable items. Forward animation.log is required.
 * This function will contact OneDrive server and will upload the data as soon as saving is complete
 * @param {Number} typeNum - The type number of the content to be saved. 1: video. 3: voice.
 * @param {Function} callback - The callback function to be called after all the processing is done
 */
edit.playableSave = function(typeNum, callback) {
	var dateStr = edit.getDate(),
		resourceDir = "/drive/root:/Apps/Journal/resource",
		contentDir = "/drive/root:/Apps/Journal/data/" + dateStr,
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
				var match = (dataGroup[i]["resource"] && $(this).hasClass("resource")) || (!dataGroup[i]["resource"] && $(this).hasClass("data"));
				// Avoid cross-folder confusion to the files with the same name
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
		callback();
	} else {
		getTokenCallback(function(token) {
			animation.log(log.EDIT_PANE_PLAYABLE_SAVE_START + edit.mediaName(typeNum) + log.EDIT_PANE_PLAYABLE_SAVE_START_END, 1);
			for (var i = 0; i !== dataGroup.length; ++i) {
				if (dataGroup[i]["change"]) {
					// This element wants to change its location
					var name = dataGroup[i]["name"],
						title = dataGroup[i]["title"],
						id = dataGroup[i]["id"],
						newName = dateStr + (new Date().getTime() + i) + name.substring(name.length - 4),
						path;
					dataGroup[i]["success"] = false;
					if (dataGroup[i]["resource"]) {
						// Wants to be removed, search for the title in the cache
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
						name: newName,
						parentReference: {
							path: path
						}
					};
					// Use id to navigate to the file to avoid coding problem for utf-8 characters
					var url;
					if (id) {
						url = "https://api.onedrive.com/v1.0/drive/items/" + id + "?select=id,name,size,@content.downloadUrl&access_token=" + token;
					} else {
						path = path === resourceDir ? contentDir : resourceDir;
						url = "https://api.onedrive.com/v1.0" + path + "/" + encodeURI(name) + "?select=name,size,@content.downloadUrl&access_token=" + token;
					}
					$.ajax({
						type: "PATCH",
						url: url,
						contentType: "application/json",
						data: JSON.stringify(requestJson)
					})
						.done(function(data, status, xhr) {
							--pending;
							var title = "";
							// Search for this name
							for (var j = 0; j !== dataGroup.length; ++j) {
								if (dataGroup[j]["id"] === data["id"]) {
									// Size matched
									title = "\"" + dataGroup[j]["title"] + "\" ";
									dataGroup[j]["success"] = true;
									// "resource" is to be changed later
									//// dataGroup[j]["resource"] = !dataGroup[j]["resource"];
									// Update map
									delete journal.archive.map[dataGroup[j]["name"]];
									if (!dataGroup[j]["resource"]) {
										// If the source is from data, new name must be added
										var newName = data["name"];
										dataGroup[j]["newName"] = newName;
										journal.archive.map[newName] = {
											id: data["id"],
											size: data["size"],
											url: data["@content.downloadUrl"]
										};
									}
									break;
								}
							}
							animation.log(edit.mediaName(typeNum).capitalize() + log.EDIT_PANE_PLAYABLE_FILE + title + log.EDIT_PANE_PLAYABLE_FILE_SAVED);
						})
						.fail(function(xhr, status, error) {
							--pending;
							animation.warning(log.EDIT_PANE_TRANSFERRED_FAILED + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, false);
							animation.warning("#add-" + edit.mediaName(typeNum));
						})
						.always(function(data, status, xhr) {
							if (pending <= 0) {
								// Finished all the processing
								// Process HTML element
								$("#attach-area ." + edit.mediaName(typeNum)).each(function() {
									$(this).removeClass("change");
									for (var j = 0; j !== dataGroup.length; ++j) {
										if (!$(this).hasClass("ignore")) {
											if ($(this).children("a").hasClass(dataGroup[j]["name"])) {
												var match = (dataGroup[j]["resource"] && $(this).hasClass("resource")) || (!dataGroup[j]["resource"] && $(this).hasClass("data"));
												// Avoid cross-folder confusion to the files with the same name
												if (match) {
													if (dataGroup[j]["success"]) {
														dataGroup[j]["success"] = false;
														dataGroup[j]["resource"] = !dataGroup[j]["resource"];
														// Transfer succeeds, update the class
														if ($(this).hasClass("resource")) {
															$(this).removeClass("resource").addClass("data");
														} else if ($(this).hasClass("data")) {
															$(this).removeClass("data").addClass("resource");
														}
														// Also update <a> if a new name is available
														if (dataGroup[j]["newName"]) {
															dataGroup[j]["name"] = dataGroup[j]["newName"];
															$(this).children("a").attr("class", dataGroup[j]["newName"]);
															// Remove this
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
										$(this).addClass("ignore").empty().fadeOut();
									}
								});
								// Process JS data
								var cacheData = [];
								for (var j = 0; j !== dataGroup.length; ++j) {
									dataGroup[j]["change"] = false;
									if (dataGroup[j]["resource"]) {
										// Update local cache 
										cacheData.push({
											fileName: dataGroup[j]["newName"] || dataGroup[j]["name"],
											title: dataGroup[j]["title"]
										});
									} else {
										// Remove unnecessary data member
										dataGroup.splice(j, 1);
										--j;
									}
								}
								localStorage[edit.mediaName(typeNum)] = JSON.stringify(cacheData);
								animation.log(log.EDIT_PANE_FINISHED_TRANSFER + edit.mediaName(typeNum) + log.EDIT_PANE_FINISHED_TRANSFER_END, -1);
								callback();
							}
						});
				}
			}
		});
	}
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