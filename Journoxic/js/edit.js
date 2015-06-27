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
/** If /data has this folder */
edit.isFolder = false;
/** The name of the folder mentioned above */
edit.folderDate = "";

edit.removalList = {};

edit.localChange = [];

edit.isProcessing = false;

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
	app.videoPlayer.quit();
	// Disable fixed height
	app.videoPlayer.height = "-webkit-calc(100% - 32px)";
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
				edit.addTag();
				// Clean the entry
				$("#entry-tag").val("");
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
		for (var i = 0; i !== tagsHtml.length; ++i) {
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
				" onclick=edit.toggleTag('" + tagsName[i] +
				"',true)></p>");
		}
		// In this loop, show some icons (so some icons can disappear)
		for (var i = 0; i !== tagsHtml.length; ++i) {
			if (iconTags.indexOf(tagsHtml[i]) !== -1) {
				edit.toggleIcon(tagsName[i]);
			}
		}
		// Bind hotkeys to add tags
		// If you want to use more than one modifier (e.g. alt+ctrl+z) you should define them by an alphabetical order e.g. alt+ctrl+shift
		$("#entry-body").bind("keyup", "return", function() {
			// Command line work
			var body = $("#entry-body").val(),
				/* The start of the last line before return is hit*/
				start = body.lastIndexOf("\n", body.length - 2) + 1,
				/* The last line */
				last = body.substring(start, body.length - 1),
				truncate = false;
			if (last.length > 2 && last.charAt(0) === "#") {
				// Add a tag
				edit.addTag(last.substring(1));
				truncate = true;
			}
			if (truncate) {
				// Truncate the "command" just input
				$("#entry-body").val(body.substring(0, start));
			}
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
		$("#edit-pane #attach-area .icontags .other, #edit-pane #attach-area .texttags .other, #edit-pane #attach-area .images").mousewheel(function(event, delta) {
			// Only scroll horizontally
			this.scrollLeft -= (delta * 50);
			event.preventDefault();
		});
		// Right click to select videos and voices
		edit.playableSetToggle();
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
		app.refresh();
		headerShowMenu("edit");
	});
	// Clean cache anyway
	edit.cleanEditCache();
	// Reset videoplayer's heiht
	app.videoPlayer.height = undefined;
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
		$(selector).html("&#xf1ce").addClass("spin").removeAttr("onclick").removeAttr("href");
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
	// tags
	if (localStorage["tags"]) {
		data["tags"] = localStorage["tags"];
	} else {
		localStorage["tags"] = data["tags"] ? data["tags"] : "";
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
	// Cover
	localStorage["coverType"] = data["coverType"] || 0;
	// Return value
	return data;
};
edit.exportCache = function(index) {
	var data = journal.archive.data[index] || {};
	// Process body from cache
	data = edit.exportCacheBody(data);
	// Force the program to reload it
	data["processed"] = 0;
	// Title
	data["title"] = localStorage["title"] || "Untitled";
	data["coverType"] = parseInt(localStorage["coverType"]);
	if (data["coverType"] <= 0) {
		data["coverType"] = edit.coverAuto();
	}
	if (!data["attachments"]) {
		data["attachments"] = 0;
	}
	data["tags"] = localStorage["tags"] || "";
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
	var deleteList = ["title", "body", "created", "currentEditing", "tags", "place", "music", "movie", "book", "images", "weblink", "video", "voice"];
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
 * Removes an entry from view-list
 */
edit.removeEntry = function() {
	// Change the data displ1ayed
	--app.displayedNum;
	var data = journal.archive.data[app.currentDisplayed];
	app.displayedChars -= data["text"]["chars"];
	app.displayedLines -= data["text"]["lines"];
	app.displayedTime -= (data["time"]["end"] - data["time"]["start"]) / 60000;
	// Remove from the map
	delete journal.archive.data[app.currentDisplayed];
	// Clear from the list
	var $entry = $("#list ul li:nth-child(" + (app.currentDisplayed + 1) + ")");
	if ($entry.next().length === 0 || $entry.next.has("p.separator").length !== 0) {
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
	headerShowMenu("edit");
}
/**
 * Adds a medium to the edit pane, given the typeNum
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
			// In other cases, this step will be taken care of in their individual functions because it is not sure that if the transfer will be successful from the server side
			edit.addToRemovalList(type);
	}
	edit.cleanupMediaEdit();
};
/**
 * Adds media from /queue to help the user to accelerate to select the media
 * @see edit.playableSearch() - This function is based on the algorithms in edit.playableSearch(). Should any bugs are found, check to see if that function has the same bugs
 */
edit.addMediaFromQueue = function() {
	// Add throttle
	$("#return-lost-media").removeAttr("onclick");
	animation.log(log.QUEUE_START, 1);
	edit.photo(true);
	getTokenCallback(function(token) {
		var url = "https://api.onedrive.com/v1.0/drive/special/approot:/queue:/children?select=id,name,size,@content.downloadUrl&access_token=" + token;
		$.ajax({
			type: "GET",
			url: url
		})
			.done(function(data, status, xhr) {
				/* Iterator */
				var i = 0;
				var itemList = data["value"],
					addedVoice = 0,
					addedVideo = 0;
				// Iterate to find all the results on the server
				for (var key = 0, len = itemList.length; key !== len; ++key) {
					var id = itemList[key]["id"],
						size = itemList[key]["size"],
						name = itemList[key]["name"],
						contentUrl = itemList[key]["@content.downloadUrl"],
						suffix = name.substring(name.length - 4).toLowerCase(),
						elementData = {
							id: id,
							name: name,
							title: name.substring(0, name.length - 4),
							url: contentUrl,
							size: size,
							resource: false,
							change: true
						},
						newContent = true;
					// Test supported file types, if file is not supported then restart the loop
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
							url: contentUrl,
							title: name.substring(0, name.length - 4)
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
							url: contentUrl,
							title: name.substring(0, name.length - 4)
						});
					}
				}
				// Right click to select
				edit.playableSetToggle();
				if (addedVideo > 0) {
					animation.log(addedVideo + log.QUEUE_FOUND_VIDEOS);
				}
				if (addedVoice > 0) {
					animation.log(addedVoice + log.QUEUE_FOUND_VOICES);
				}
			})
			.fail(function(xhr, status, error) {
				animation.error(log.QUEUE_FAILED + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END);
			})
			.always(function() {
				// Add it back
				$("#return-lost-media").attr("onclick", "app.cleanResource()");
				animation.log(log.QUEUE_END, -1);
			});
	});
}
/**
 * Adds media element to pending removal list and make this element fade out from the view. 
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
	if (type === "photo")
		return 0;
	if (type === "video")
		return 1;
	if (type === "place")
		return 2;
	if (type === "voice")
		return 3;
	if (type === "music")
		return 4;
	if (type === "movie")
		return 5;
	if (type === "book")
		return 6;
	if (type === "weblink")
		return 7;
	// Not applicable
	return -1;
}
/**
 * A function to be called by confirm 
 */
edit.confirm = function() {
	if (typeof (edit.confirmName) == "string") {
		if (edit.confirmName == "discard") {
			edit.quit(false);
		} else if (edit.confirmName == "delete") {
			edit.removeEntry();
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
 * This function will also make sure that this folder is created under /data to avoid 404 error while attempting to move media to this folder
 * @param {function} callback - Callback function, with a parameter of the dateStr returned (e.g. function(dateStr))
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
		dateStr = "" + edit.format(date.getMonth() + 1) + edit.format(date.getDate()) + edit.format(date.getFullYear() % 100);
	}
	// Test server folder validity
	if (dateStr != edit.folderDate) {
		// Try to create the folder
		createFolder(dateStr, callback);
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
	return "" + edit.format(date.getMonth() + 1) + edit.format(date.getDate()) + edit.format(date.getFullYear() % 100) + " " + edit.format(date.getHours()) + edit.format(date.getMinutes());
};

/************************** TAG *********************************/

/**
 * Adds a tag given a tag value or fetch it from entry tag, providing optional tag value, toggle or force to set true, and the source of this operation
 * @param {string} tag (Optional) - The value of the tag to be added
 * @param {boolean} mute - Whether log "xxx is added" or not
 */
edit.addTag = function(tag, mute) {
	// If a tag is not specified, it will get the value from the input box where user puts a new tag value
	tag = tag || $("#entry-tag").val().toLowerCase().replace(/\|/g, "");
	// Test for duplicate
	if (localStorage["tags"].split("|").indexOf(tag) !== -1) {
		// The entry is already added
		// This tag has already been added
		animation.warn(log.TAG_ADD_HEADER + tag + log.TAG_ADDED_ALREADY);
		$("#entry-tag").effect("highlight", { color: "#000" }, 400);
	} else {
		var found = false,
			added = false;
		// Try to convert to iconTag
		$("#attach-area .icontags p").each(function() {
			if ($(this).attr("title").toLowerCase() === tag) {
				// Found
				found = true;
				var parent = $(this).parent().attr("class");
				if (parent === "weather" || parent === "emotion") {
					// Only one weather and emotion is allowed
					if ($(this).css("height") === "0px") {
						// Hidden div, means another weather/emotion has already been added
						animation.warn(log.TAG_ICON_ADD_HEADER + tag + log.TAG_ADDED_FAILED);
						$("#entry-tag").effect("highlight", { color: "#000" }, 400);
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
					$("#entry-tag").effect("highlight", { color: "#000" }, 400);
					// Saved
				}
			}
		});
		if (!found) {
			// Keep searching for texttags
			$("#entry-tag").effect("highlight", { color: "#dadada" }, 400);
			// Marked for a new entry
			$("#attach-area .texttags .other").append("<p title='Click to remove' onclick=edit.removeTag('" + tag + "')>#" + tag + "</p>");
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
					$(this).animate({ width: "0" }, function() {
						$(this).remove();
						removed = true;
					});
				}
			});
			if (!removed) {
				// Keep searching in icontags
				$("#attach-area .icontags p").each(function() {
					if ($(this).attr("title").toLowerCase() === tag) {
						if (!mute) {
							animation.log(log.TAG_ICON_ADD_HEADER + tag + log.TAG_REMOVED);
						}
						edit.toggleIcon(tag);
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
}
/**
 * Toggles the icon on the website.
 * This function will only give visual feedback
 * @param {string} tag - The name of the tag to be toggled
 */
edit.toggleIcon = function(tag) {
	var htmlName = app.tag().getHtmlByName(tag),
		selector = "#attach-area .icontags p." + htmlName,
		parent = $(selector).parent().attr("class");
	if ($(selector).toggleClass("highlight").hasClass("highlight")) {
		if (parent == "weather" || parent == "emotion") {
			// Now highlighted
			$("#attach-area .icontags ." + parent + " p:not(." + htmlName + ")").css("height", "0");
		}
	} else {
		if (parent == "weather" || parent == "emotion") {
			// Dimmed
			$("#attach-area .icontags ." + parent + " p:not(." + htmlName + ")").removeAttr("style");
		}
	}
}

/************************** COVER **************************/

/**
 * Sets the cover type of current entry and animates on the edit pane.
 * This function will not test if this type is attached in this entry. 
 * Only if the cover is set to be photo, it will appear on the entry. Otherwise a dummy image will be shown
 * @param {Number|String} type - My value of type classification. -1 for no cover
 * @param {boolean} isToggle - Whether covertype will toggle to 0 if `type` is the same as current type
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
		$(".types p:not(#" + edit.mediaName(typeNum) + "-cover)").addClass("hidden");
		if (name) {
			$(".types #" + edit.mediaName(typeNum) + "-cover").addClass("selected");
		} else {
			// Do not display cover
			$(".types #no-cover").addClass("selected");
		}
	}
	return coverType;
};
/**
 * Automatically selects a type from given typeList. If no typeList is specified, this function will assign coverType based on all the valid attachments in this entry. 
 * See the first line of the code for the priority of all the attachments
 * @param {Object} typeList - A list of attachments to be selected from
 * @return {Number} the chosen cover
 */
edit.coverAuto = function(typeList) {
	var priority = ["images", "music", "book", "movie", "video", "voice", "weblink", "place"];
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
 * Refreshes the covertype area to returns the avaiable cover type of current entry
 * @returns {Object} - A list of all the available attachments
 */
edit.coverRefresh = function() {
	var elem = ["images", "video", "voice", "place", "music", "book", "movie", "weblink"],
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
 * Test if current entry has any attachments of the type specifed by cover type. If not, deselect the covertype in edit pane
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
}

/************************** PHOTO 0 ************************/

/**
 * Adds the photo on the edit-pane and extend the photo area
 * @param {boolean} isQueue (Optional) - whether the source of the photos is /queue
 */
edit.photo = function(isQueue) {
	if (edit.photos.length !== 0 && !isQueue) {
		// Return if edit.photo is already displayed
		animation.error(log.EDIT_PANE_IMAGES_ALREADY_LOADED);
		return;
	}
	// Test if this entry really doesn't have any images at all
	var images = JSON.parse(localStorage["images"]);
	if (images) {
		if (Object.keys(journal.archive.map).length === 0) {
			// No media in the map, ask for downloading the images
			animation.error(log.EDIT_PANE_IMAGES_FAIL + log.DOWNLOAD_PROMPT);
			animation.deny("#add-photo");
			return;
		}
	}
	// If queue photos want to be displayed before this panel is initialized, initialize photo panel first
	var addQueue = false;
	if ($("#attach-area .images").css("height") !== "100px" && isQueue) {
		// Change the parameter to pretend to add local images first
		addQueue = true;
		isQueue = false;
	}
	// Extend the image area and add sortable functionality and hover 
	$("#attach-area .images").css({ height: "100px" }).hover(function() {
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
	// Prepartion before doing server work
	var processFunc = function(dateStr) {
		getTokenCallback(function(token) {
			var url;
			if (isQueue) {
				url = "https://api.onedrive.com/v1.0/drive/special/approot:/queue:/children?select=id,name,size,@content.downloadUrl&access_token=" + token;
			} else {
				url = "https://api.onedrive.com/v1.0/drive/special/approot:/data/" + dateStr + ":/children?select=id,name,size,@content.downloadUrl&access_token=" + token;
			}
			$.ajax({
				type: "GET",
				url: url
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
							name: name,
							id: id,
							url: itemList[key]["@content.downloadUrl"],
							size: size,
							resource: false,
							change: false
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
							// The image should be highlighted if it is already at resource folder
							htmlContent = "<div class=\"resource\">";
						} else {
							htmlContent = "<div class=\"data\">";
						}
					}
					htmlContent += "<span></span><img src=\"" + edit.photos[i]["url"] + "\"/></div>";
					$("#attach-area .images").append(htmlContent);
				}
				// Stop throttle 
				$("#add-photo").html("&#xf03e").removeClass("spin").attr({
					onclick: "edit.addMedia(0)",
					href: "#"
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
						$("#photo-preview img").animate({ opacity: 1 }, 200).attr("src", $(this).attr("src"));
					}, function() {
						// Mouseout
						$("#photo-preview img").animate({ opacity: 0 }, 0);
					});
				});
				if (isQueue) {
					animation.log(added + log.QUEUE_FOUND_IMAGES);
				} else {
					animation.setConfirm(0);
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
						$("#add-photo").html("&#xf03e").removeClass("spin").attr({
							onclick: "edit.addMedia(0)",
							href: "#"
						});
						animation.debug("status: " + status);
						// Test if error is not found
						if (error === "Not Found" && !addQueue) {
							// If the error is not found and the user just wants to add the photo from this folder, then report error
							animation.error(log.EDIT_PANE_IMAGES_FAIL + log.EDIT_PANE_IMAGES_FIND_FAIL + dateStr + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
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
						edit.photo(true);
					}
				});
		});
	}
	if (!isQueue) {
		// Add throttle
		$("#add-photo").html("&#xf1ce").addClass("spin").removeAttr("onclick").removeAttr("href");
		// Empty edit.photos only if the photos are not added from queue
		edit.photos = [];
		// Iterate to add all photos of this dataclip to edit.photos
		for (var i = 0; i < images.length; ++i) {
			var name = images[i]["fileName"];
			if (journal.archive.map[name]) {
				var image = {
					name: name,
					id: journal.archive.map[name]["id"],
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
		edit.getDate(function(dateStr) {
		// Get resource photos from user content folder
		animation.log(log.EDIT_PANE_IMAGES_START + dateStr + log.EDIT_PANE_IMAGES_START_END, 1);
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
			/* New images attached to this entry */
			newImagesData = [];
		edit.getDate(function(timeHeader) {
			// Change the `change` of edit.photos according to html contents
			$("#attach-area .images div").each(function() {
				for (var i = 0; i !== edit.photos.length; ++i) {
					if ($(this).children("img").attr("src") === edit.photos[i]["url"]) {
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
						name: name,
						id: id,
						// New location
						resource: !resource
					});
				}
			}

			// Start to change location
			var resourceDir = "/drive/root:/Apps/Journal/resource",
				contentDir = "/drive/root:/Apps/Journal/data/" + timeHeader,
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
							// Would like to be added to entry, originally at data folder
							newName = timeHeader + (new Date().getTime() + i) + name.substring(name.length - 4);
							requestJson = {
								// New name of the file
								name: newName,
								parentReference: {
									path: resourceDir
								}
							};
						} else {
							// Would like to be added to data, i.e. remove from resource folder
							newName = name;
							requestJson = {
								parentReference: {
									path: contentDir
								}
							};
						}
						$.ajax({
							type: "PATCH",
							url: url,
							contentType: "application/json",
							data: JSON.stringify(requestJson)
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
											url: data["@content.downloadUrl"],
											size: data["size"],
											id: data["id"]
										};
									}
								}
								animation.log((++processingPhoto) + log.EDIT_PANE_IMAGES_OF + photoQueue.length + log.EDIT_PANE_IMAGES_TRASNFERRED);
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
								// Test if it is elligible for calling callback()
								if (processingPhoto === photoQueue.length) {
									// Process all the html elements
									// Find the correct img to add or remove highlight class on it
									$("#attach-area .images div").each(function() {
										$(this).removeClass("change");
										// Try to match images with edit.photos
										for (j = 0; j !== edit.photos.length; ++j) {
											if ($(this).children("img").attr("src") === edit.photos[j]["url"]) {
												if (edit.photos[j]["success"]) {
													if (edit.photos[j]["resource"]) {
														// Originally at /resource
														$(this).addClass("data").removeClass("resource");
														// Remove from the map
														delete journal.archive.map[edit.photos[j]["name"]];
													} else {
														// Originally at /data
														$(this).addClass("resource").removeClass("queue data");
													}
													edit.photos[j]["resource"] = !edit.photos[j]["resource"];
												}
												break;
											}
										}
									});
									// Process edit.photos
									for (j = 0; j !== edit.photos.length; ++j) {
										edit.photos[j]["change"] = false;
										edit.photos[j]["success"] = false;
										if (edit.photos[j]["resource"]) {
											newImagesData.push({
												fileName: edit.photos[j]["name"]
											});
										}
									}
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
		});
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
		$("#text-area #video-preview").fadeIn();
		app.videoPlayer("#text-area #video-preview", source);
	} else {
		// Find it from this dataClip
		var fileName = $(selectorHeader + "a").attr("class");
		if (journal.archive.map[fileName]) {
			source = journal.archive.map[fileName]["url"];
			if (source == undefined) {
				animation.error(log.FILE_NOT_FOUND + $(selectorHeader + ".title").val());
				return;
			}
			$("#text-area #video-preview").fadeIn();
			app.videoPlayer("#text-area #video-preview", source);
		} else {
			animation.error(log.FILE_NOT_LOADED + $(selectorHeader + ".title") + log.DOWNLOAD_PROMPT);
		}
	}
	animation.setConfirm(1);
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
		$(selectorHeader + "a").attr("onclick", "edit.video(" + edit.mediaIndex["video"] + ")");
	}
	// Save data
	edit.videoSave(edit.mediaIndex["video"]);
	$("#edit-pane").off("keyup");
	// Hide all the option button
	animation.hideIcon(".entry-option");
	edit.mediaIndex["video"] = -1;
	edit.isEditing = -1;
};
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
}; /**
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
};

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
		$(selectorHeader + "a").attr("onclick", "edit.voice(" + edit.mediaIndex["voice"] + ")");
	}
	// Save data
	edit.voiceSave(edit.mediaIndex["voice"]);
	$("#edit-pane").off("keyup");
	// Hide all the option button
	animation.hideIcon(".entry-option");
	edit.mediaIndex["voice"] = -1;
	edit.isEditing = -1;
};
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
 * @see edit.queue() - This function also uses part of this function. If any change is made, make sure that function is corresponding change is made as well
 */
edit.playableSearch = function(typeNum) {
	getTokenCallback(function(token) {
		edit.getDate(function(dateStr) {
			var url = "https://api.onedrive.com/v1.0/drive/special/approot:/data/" + dateStr + ":/children?select=id,name,size,@content.downloadUrl&access_token=" + token;
			animation.log(log.EDIT_PANE_PLAYABLE_SEARCH_START, 1);
			$.ajax({
				type: "GET",
				url: url
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
					for (var key = 0, len = itemList.length; key !== len; ++key) {
						var id = itemList[key]["id"],
							size = itemList[key]["size"],
							name = itemList[key]["name"],
							contentUrl = itemList[key]["@content.downloadUrl"],
							suffix = name.substring(name.length - 4).toLowerCase(),
							elementData = {
								id: id,
								name: name,
								title: name.substring(0, name.length - 4),
								url: contentUrl,
								size: size,
								resource: false,
								change: true
							};
						// Test supported file types, if file is not supported then restart the loop
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
						switch (typeNum) {
							case 1:
								// Video
								// Helper call to edit.media
								edit.addMedia(-1, {
									fileName: name,
									url: contentUrl,
									title: name.substring(0, name.length - 4)
								});
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
					// Right click to select
					edit.playableSetToggle();
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
	});
};
/**
 * Sets all video and voice attachments so that their classes will be toggled "change" upon right clicking
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
 * This function will contact OneDrive server and will upload the data as soon as saving is complete
 * @param {Number} typeNum - The type number of the content to be saved. 1: video. 3: voice.
 * @param {Function} callback - The callback function to be called after all the processing is done
 */
edit.playableSave = function(typeNum, callback) {
	edit.getDate(function(dateStr) {
		var resourceDir = "/drive/root:/Apps/Journal/resource",
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
							.done(function(data) {
								--pending;
								var title = "";
								for (var j = 0; j !== dataGroup.length; ++j) {
									if (dataGroup[j]["id"] === data["id"]) {
										// ID matched
										title = dataGroup[j]["title"];
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
								animation.warn(log.EDIT_PANE_TRANSFERRED_FAILED + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, false);
								animation.warning("#add-" + edit.mediaName(typeNum));
							})
							.always(function() {
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