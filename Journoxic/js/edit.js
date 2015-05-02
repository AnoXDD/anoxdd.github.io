/* The script for editing anything */

/*
 Todo:	edit.photoHeader to get the general header for photos
			then fix edit.photoSave
		Add a reponse log area under buttons or somewhere to tell the user what is going on

*/


window.edit = {};
/* The index of the entry being edited. Set to -1 to save a new entry */
edit.time = 0;
edit.intervalId = -1;
edit.confirmName = "";
edit.currentEditing = -1;

edit.photos = [];

edit.mediaIndex = {};
edit.isEditing = -1;

edit.removalList = {};

edit.localChange = [];

/******************************************************************
 ********************** INIT & QUIT *******************************
 ******************************************************************/

/* 
 Initialize the edit pane.
 localStorage["created"] will be used to track the entry being edited
 overwrite - boolean to determine whether or not to create a new entry (overwrite previously stored info)
 index - the index of the archive data (optional)
 */
edit.init = function(overwrite, index) {
	////console.log("edit.init(" + overwrite + ", " + index + ")");
	edit.editView = _.template($("#edit-view").html());
	var editPane, data;

	// Test if there are cached data
	if (localStorage["_cache"] == 1) {
		// There is cache
		if (overwrite == true) {
			edit.cleanEditCache();
			if (index != undefined) {
				// Modify an entry
				data = journal.archive.data[index];
				localStorage["created"] = data["time"]["created"];
			}
		} else if (overwrite == false) {
			// Read from available caches
			if (localStorage["created"]) {
				var index = edit.find(localStorage["created"]);
				if (index != -1)
					data = journal.archive.data[index];
			} else
				// Nothing found, start a new one
				// Placeholder
				;
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
		if (index != undefined)
			data = journal.archive.data[index];
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
	console.log(Object.keys(data));
	editPane = $(edit.editView(data));

	// Content processing
	$(".header div").fadeOut();
	// Initialize the contents
	$("#contents").fadeOut(400, function() {
		// Initialize the pane, this line must be the first one!
		$("#edit-pane").html(editPane).fadeIn();
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
			if (n.keyCode == 13)
				edit.saveTag();
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
		if (localStorage["title"])
			$("#entry-header").val(localStorage["title"]);
		if (localStorage["body"])
			$("#entry-body").text(localStorage["body"]);
		// Tag processing
		var tagsHTML = app.bitwise().getTagsHTML(),
			tagsName = app.bitwise().getTagsArray(),
			/* The array of html names for highlighted icons */
			iconTags = app.bitwise().iconTags(parseInt(localStorage["iconTags"]));
		console.log("edit.init()\ticonTags = " + iconTags);
		for (var i = 0; i != tagsHTML.length; ++i) {
			var parent = "#attach-area .icontags";
			if (tagsHTML[i].charAt(0) == 'w')
				parent += " .weather";
			else if (tagsHTML[i].charAt(0) == 'e')
				parent += " .emotion";
			else
				parent += " .other";
			// Processed existed tags
			$(parent).append(
				"<p class='icons " + tagsHTML[i] +
				"' title=" + tagsName[i].capitalize() +
				" onclick=edit.toggleIcon('" + tagsHTML[i] +
				"')></p>");
		}
		// In this loop, imitate to click on each icon (so some icons can disappear)
		for (var i = 0; i != tagsHTML.length; ++i)
			if ($.inArray(tagsHTML[i], iconTags) != -1)
				$("#edit-pane #attach-area .icontags p." + tagsHTML[i]).trigger("click");
		$("#edit-pane #attach-area .icontags .other, #edit-pane #attach-area .texttags .other, #edit-pane #attach-area .images").mousewheel(function(event, delta) {
			// Only scroll horizontally
			this.scrollLeft -= (delta * 50);
			event.preventDefault();
		});

		edit.refreshSummary();
	});
	headerShowMenu("add");
	edit.intervalId = setInterval(edit.refreshTime, 1000);
}

edit.quit = function(selector, save) {
	clearInterval(edit.intervalId);
	edit.time = 0;
	edit.mediaIndex = {};
	edit.localChange = [];
	if (save)
		// Save to local contents
		edit.save(selector);
	else
		animation.log("Data discarded");
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
}

/* Save cache for edit-pane to journal.archive.data */
edit.save = function(selector) {
	var id, html;
	animation.log("Saving data ...");
	if (selector) {
		html = $(selector).html();
		$(selector).html("&#xE10C").removeAttr("onclick").removeAttr("href");
		id = animation.blink(selector);
	}
	edit.processRemovalList();
	edit.photoSave(function() {
		clearInterval(id);
		var index = edit.find(localStorage["created"]);
		edit.exportCache(index);
		edit.sortArchive();
		journal.archive.data = edit.minData();
		edit.saveDataCache();
		$(selector).html(html).attr({
			onclick: "edit.save('" + selector + "')",
			href: "#"
		});
		// Show finish animation
		animation.finished(selector);
		animation.log("Finished saving data");
	})
}

/* Process removal list to do the final cleanup of contents */
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
}

/******************************************************************
 **************************** CACHE *******************************
 ******************************************************************/

/* Sync between the local and caches. Local cache will overwrite data if there is */
edit.importCache = function(data) {
	// Title
	if (localStorage["title"])
		data["title"] = localStorage["title"];
	else if (data["title"])
		localStorage["title"] = data["title"];
	// Body
	if (localStorage["body"]) {
		if (!data["text"])
			data["text"] = {};
		data["text"]["body"];
	} else {
		if (data["text"])
			if (data["text"]["body"])
				localStorage["body"] = data["text"]["body"];
	}
	// created is not modifiable from user-side
	localStorage["created"] = data["time"]["created"];
	// iconTags
	if (localStorage["iconTags"])
		data["iconTags"] = localStorage["iconTags"];
	else
		localStorage["iconTags"] = data["iconTags"] ? data["iconTags"] : 0;
	// textTags
	if (localStorage["textTags"])
		data["textTags"] = localStorage["textTags"];
	else
		localStorage["textTags"] = data["textTags"] ? data["textTags"] : "";
	// photos, video, place, music, book, movie
	var elem = ["images", "video", "place", "music", "book", "movie", "weblink"];
	for (var i = 0; i != elem.length; ++i) {
		var medium = elem[i];
		if (localStorage[medium])
			data[medium] = JSON.parse(localStorage[medium]);
		else
			localStorage[medium] = data[medium] ? JSON.stringify(data[medium]) : "[]";
	}
	// Return value
	return data;
}

edit.exportCache = function(index) {
	var data = journal.archive.data[index] || {};
	// Process body from cache
	data = edit.exportCacheBody(data);
	// Title
	data["title"] = localStorage["title"] || "Untitled";
	data["processed"] = 0;
	if (!data["coverType"])
		data["coverType"] = 0;
	if (!data["attachments"])
		data["attachments"] = 0;
	data["iconTags"] = !isNaN(parseInt(localStorage["iconTags"])) ? parseInt(localStorage["iconTags"]) : 0;
	data["textTags"] = localStorage["textTags"];
	var media,
		elem = ["images", "video", "music", "voice", "book", "movie", "place", "weblink"],
		attach = 0;
	for (var i = 0; i < elem.length; ++i) {
		var media = localStorage[elem[i]] ? JSON.parse(localStorage[elem[i]]) : [];
		for (var j = 0; j < media.length; ++j) {
			if (!media[j] || media[j]["title"] == "")
				// null or undefined or empty title, remove this
				media.splice(j--, 1);
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
}

/* Read the cache and process start, created and end time from the text body */
edit.exportCacheBody = function(data) {
	if (!data["time"])
		data["time"] = {};
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
	if (!data["text"])
		data["text"] = {};
	var newBody = lines.join("\r\n");
	data["text"]["body"] = newBody;
	data["text"]["chars"] = newBody.length;
	data["text"]["lines"] = lines.length;
	data["text"]["ext"] = newBody.substring(0, 50);
	return data;
}

edit.cleanEditCache = function() {
	localStorage["_cache"] = 0;
	var deleteList = ["title", "body", "created", "currentEditing", "iconTags", "textTags", "place", "music", "movie", "book", "images", "weblink", "video"];
	for (var i = 0; i != deleteList.length; ++i)
		delete localStorage[deleteList[i]];
}

/* Save the entire journal.archive.data to cache after minimizing it */
edit.saveDataCache = function(data) {
	localStorage["archive"] = JSON.stringify(journal.archive.data);
}

/* Clean the cache for journal.archive.data */
edit.removeDataCache = function() {
	delete localStorage["archive"];
}

/* Try to read journal.archive.data from cache */
edit.tryReadCache = function() {
	if (localStorage["archive"]) {
		// Seems that there is available data
		journal.archive.data = JSON.parse(localStorage["archive"]);
		app.load("", true);
	}
}

/******************************************************************
 **************************** DATA ********************************
 ******************************************************************/

/* Return the index of data found */
edit.find = function(created) {
	for (var key = 0, len = journal.archive.data.length; key != len; ++key) {
		if (journal.archive.data[key]["time"])
			if (journal.archive.data[key]["time"]["created"] == created)
				return key;
	}
	// Nothing found
	return -1;
}

/* Parse the json to fit _.template. This function also syncs data to localStorage */
edit.parseJSON = function(string) {
	var dict = JSON.parse(string),
		elements = "title time text video weblink book music movie images voice place iconTags2 textTags".split(" "),
		dict = {};
	// Add to cache
	if (dict["title"])
		localStorage["title"] = dict["title"];
	if (dict["text"])
		if (dict["text"]["body"])
			localStorage["body"] = dict["text"]["body"];
	// Add undefined object to make it displayable
	for (var key = 0, len = elements.length; key != len; ++key)
		if (dict[elements[key]] == undefined)
			dict[elements[key]] = undefined;
	return dict;
}

/* Return an empty content object array entry */
edit.newContent = function() {
	var dict = {};
	// Set created time
	dict["time"] = {};
	dict["time"]["created"] = new Date().getTime();
	dict["textTags"] = "";
	return dict;
}

/* Minimize the data, remove unnecessary tags */
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
		for (var i = 0; i < tmp[key].length; ++i)
			if (tmp[key][i] == undefined || tmp[key][i] == "undefined")
				// Splice this key and also decrement i
				tmp[key].splice(i--, 1);
	};
	return tmp;
}

/* Sort journal.archive.data */
edit.sortArchive = function() {
	journal.archive.data.sort(function(a, b) {
		// From the latest to oldest
		return b["time"]["created"] - a["time"]["created"];
	});
}

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
}

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

}

/************************** EDITING *******************************/

edit.addMedia = function(typeNum) {
	var selectorHeader = "#attach-area ." + edit.mediaName(typeNum),
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
			htmlContent = '<div class="place"><a title="Edit" onclick="edit.location(' + length + ')" href="#"><div class="thumb"></div><input disabled title="Place" class="title place-search" autocomplete="off"/><input disabled title="Latitude" class="desc latitude" autocomplete="off" /><p>,</p><input disabled title="Longitude" class="desc longitude" autocomplete="off" /></a></div>';
			break;
		case 4:
			// Music
			htmlContent = '<div class="music"><a title="Edit" onclick="edit.music(' + length + ')" href="#"><img class="thumb <% if( music[i].thumb ) { music[i].thumb; } %>"><span></span><input disabled class="title" placeholder="Track name" autocomplete="off" /><input disabled class="desc" placeholder="Artist" autocomplete="off" /></a></div>';
			break;
		case 5:
			// Movie
			htmlContent = '<div class="movie"><a title="Edit" onclick="edit.movie(' + length + ')" href="#"><img class="thumb"><span></span><input disabled class="title" placeholder="Movie title" autocomplete="off" onclick="this.select()" /><input disabled class="desc" placeholder="Director" autocomplete="off" onclick="this.select()" /></a></div>';
			break;
		case 6:
			// Book
			htmlContent = '<div class="book"><a title="Edit" onclick="edit.book(' + length + ')" href="#"><img class="thumb"><span></span><input disabled class="title" placeholder="Book title" autocomplete="off" onclick="this.select()" /><input disabled class="desc" placeholder="Author" autocomplete="off" onclick="this.select()" /></a></div>';
			break;
		case 7:
			// Weblink
			htmlContent = '<div class="weblink"><a title="Edit" onclick="edit.weblink(' + length + ')" href="#"><div class="thumb"><span></span></div><input disabled class="title" placeholder="Title" /><input disabled class="desc" placeholder="http://" /></a></div>';
			break;
		default:

	}
	if (length > 0)
		// Elements already exist
		$(htmlContent).insertAfter($(selectorHeader + ":eq(" + (length - 1) + ")"));
	else
		// Have to create a new one
		$(htmlContent).appendTo("#attach-area");
	$(selectorHeader + ":eq(" + length + ") a").trigger("click");
}

edit.removeMedia = function(typeNum) {
	var type = edit.mediaName(typeNum);
	selectorHeader = edit.getSelectorHeader(type);
	$(selectorHeader).fadeOut();
	edit.addToRemovalList(type);
	edit.cleanupMediaEdit();
}

edit.addToRemovalList = function(name) {
	if (!edit.removalList[name])
		edit.removalList[name] = [];
	if (edit.removalList[name].indexOf(edit.mediaIndex[name]) != -1)
		// Only add when this element does not exist
		edit.removalList[name].push(edit.mediaIndex[name]);
}

/* Get the name of media by value */
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
}

/* A function to be called by confirm */
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
}

/* Get ready for next editing */
edit.cleanupMediaEdit = function() {
	$("#edit-pane").off("keyup");
	switch (edit.isEditing) {
		case 2:
			edit.locationHide();
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
}

/* Get a header for selector */
edit.getSelectorHeader = function(type, index) {
	if (index == undefined)
		return "#attach-area ." + type + ":eq(" + edit.mediaIndex[type] + ") ";
	return "#attach-area ." + type + ":eq(" + index + ") ";
}

/************************** ANIMATION *****************************/

edit.toggleIcon = function(htmlName) {
	var selector = "#attach-area .icontags p." + htmlName,
		parent = $(selector).parent().attr("class"),
		iconVal = app.bitwise().getIconval($(selector).attr("title").toLowerCase());
	if ($(selector).toggleClass("highlight").hasClass("highlight")) {
		if (parent == "weather" || parent == "emotion")
			$("#attach-area .icontags ." + parent + " p:not(." + htmlName + ")").css("height", "0");
		// Now highlighted
		localStorage["iconTags"] = app.bitwise().or(parseInt(localStorage["iconTags"]), iconVal);
	} else {
		if (parent == "weather" || parent == "emotion")
			$("#attach-area .icontags ." + parent + " p:not(." + htmlName + ")").removeAttr("style");
		// Dimmed
		localStorage["iconTags"] = app.bitwise().andnot(parseInt(localStorage["iconTags"]), iconVal);
	}
}

edit.toggleLight = function() {
	$("#text-area").toggleClass("dark").children().toggleClass("dark");
}

edit.fullScreen = function() {
	// Disable auto-height
	$(window).off("resize");
	// Change the icon
	animation.hideIcon(".actions a", function() {
		$("#toggle-screen").html("&#xE1D8").attr({
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
}

edit.windowMode = function() {
	// Exit dark mode
	$("#text-area").removeClass("dark").children().removeClass("dark");
	// Change the icon
	headerShowMenu("add");
	$("#toggle-screen").html("&#xE1D9").attr({
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
}

/************************** TITLE *********************************/

edit.saveTitle = function() {
	localStorage["title"] = $("#entry-header").val();
}

/************************** TITLE HEADER **************************/

edit.saveTag = function() {
	var tagVal = $("#entry-tag").val().toLowerCase().replace(/\|/g, "");
	// Test for duplicate
	if (localStorage["textTags"].split("|").indexOf(tagVal) != -1) {
		// The entry is already added
		animation.log('Tag "' + tagVal + '" is already added', true);
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
						animation.log('Tag "' + tagVal + '" cannot be added as an icon', true);
						$("#entry-tag").effect("highlight", { color: "#000" }, 400);
						return;
					}
				}
				if (!$(this).hasClass("highlight")) {
					animation.log('Tag "' + tagVal + '" is added as an icon');
					$(this).trigger("click");
				} else {
					animation.log('Tag "' + tagVal + '" is already added as an icon', true);
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
			if (localStorage["textTags"] == "")
				localStorage["textTags"] = tagVal;
			else
				localStorage["textTags"] += "|" + tagVal;
		}
	}
	// Clean the entry
	$("#entry-tag").val("");
}

edit.removeTag = function(tagName) {
	var tagArray = localStorage["textTags"].split("|");
	delete tagArray[tagName];
	tagArray.join("|");
	// Remove from the panal
	$("#attach-area .texttags p").each(function() {
		if ($(this).text() == "#" + tagName)
			$(this).animate({ width: "0" }, function() {
				$(this).remove();
			})
	})
}

edit.refreshSummary = function() {
	var text = $("#entry-body").val(),
		char = text.length;
	$("#entry-char").text(char);
	// Cache the data
	localStorage["body"] = text;
	$("#entry-line").text(text.split(/\r*\n/).length);
}

edit.refreshTime = function() {
	++edit.time;
	var date = new Date();
	var timeString = edit.format(date.getMonth() + 1) + edit.format(date.getDate()) + edit.format(date.getFullYear() % 100) + " " + edit.format(date.getHours()) + edit.format(date.getMinutes());
	$("#entry-time").text(timeString);
	$("#entry-elapsed").text(parseInt(edit.time / 60) + ":" + edit.format(edit.time % 60));
}

/* =printf("%2d", n); add an zero if n < 10 */
edit.format = function(n) {
	return n < 10 ? "0" + n : n;
}

/* Convert my format of time to the milliseconds since epoch */
edit.convertTime = function(time) {
	var month = parseInt(time.substring(0, 2)),
		day = parseInt(time.substring(2, 4)),
		year = parseInt(time.substring(4, 6)),
		hour = parseInt(time.substring(7, 9)),
		minute = parseInt(time.substring(9, 11)),
		date = new Date(2000 + year, month - 1, day, hour, minute);
	return date.getTime();
}

/* Get my version of date with priority of 1) title content 2) created 3) now */
edit.getDate = function() {
	var dateStr;
	// Get date from title, ignore what title looks like
	if (localStorage["title"]) {
		// Sometimes for some reason the first character is an "empty" char
		dateStr = parseInt(localStorage["title"]);
		if (!isNaN(dateStr) && dateStr.toString().length == 6) {
			// Correct format
			return dateStr;
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
}

/************************** PHOTO 0 ************************/

edit.photo = function() {
	if (edit.photos.length != 0) {
		// Return if edit.photo is already displayed
		animation.log("You have already displayed the images");
		return;
	}
	var images = JSON.parse(localStorage["images"]);
	if (images) {
		// Test if this entry really doesn't have any images at all
		if (!(Object.keys(journal.archive.map).length > 0)) {
			animation.log("Cannot load images: please download all the media on the main menu", true);
			animation.deny("#add-photo");
			return;
		}
	}
	$("#attach-area .images").css({ height: "100px" });
	// Add throttle
	$("#add-photo").html("&#xE10C").removeAttr("onclick").removeAttr("href");
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
				 i.e. if it is deleted or added
				 */
				change: false,
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
	animation.log("Start loading images under data/" + dateStr + " ...");
	var token = getTokenFromCookie(),
		url = "https://api.onedrive.com/v1.0/drive/special/approot:/data/" + dateStr + ":/children?select=name,size&access_token=" + token;
	$.ajax({
		type: "GET",
		url: url
	}).done(function(data, status, xhr) {
		if (data["@odata.nextLink"]) {
			// More content available!
			// Do nothing right now
		}
		var itemList = data["value"];
		for (var key = 0, len = itemList.length; key != len; ++key) {
			var size = itemList[key]["size"],
				name = itemList[key]["name"],
				suffix = name.substring(name.length - 4),
				found = false;
			if (suffix != ".jpg" && suffix != ".png")
				// Only support these two types
				continue;
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
					change: false,
				};
				edit.photos.push(data);
			}
		}
		console.log("edit.photo()\tFinish media data");
		// Add to images div
		for (var i = 0; i != edit.photos.length; ++i) {
			var htmlContent;
			if (edit.photos[i]["resource"])
				// The image should be highlighted if it is already at resource folder
				htmlContent = '<a class="highlight" onclick="edit.photoClick(' + i + ')" href="#"><img src="' + edit.photos[i]["url"] + '"/></a>';
			else
				htmlContent = '<a onclick="edit.photoClick(' + i + ')" href="#"><img src="' + edit.photos[i]["url"] + '"/></a>';
			$("#attach-area .images").append(htmlContent);
		}
		// Stop throttle 
		$("#add-photo").html("&#xE114").attr({
			onclick: "edit.addMedia(0)",
			href: "#"
		}).fadeIn();
		// Set preview
		$("#attach-area .images").hover(function() {
			// Mouseover
			$("#photo-preview").css("display", "block");
		}, function() {
			// Mouseout
			$("#photo-preview").css("display", "none");
		})
		$("#attach-area .images img").each(function() {
			$(this).hover(function() {
				// Mouseover
				$("#photo-preview img").attr("src", $(this).attr("src"));
			}, function() {
				// Mouseout
				$("#photo-preview img").removeAttr("src");
			})
		})
		animation.setConfirm(0);
		animation.log("Photos loaded");
		animation.finished("#add-photo");
	})
	.fail(function() {
		$("#add-photo").html("&#xE114").attr({
			onclick: "edit.addMedia(0)",
			href: "#"
		});
		animation.log("Cannot load image: failed to find images under data/" + dateStr, true);
		animation.deny("#add-photo");
	});
}

edit.photoClick = function(index) {
	$("#attach-area .images a:eq(" + index + ")").toggleClass("highlight");
	// Tell the photos map that this photo would like to switch location
	edit.photos[index]["change"] = !edit.photos[index]["change"];
}

/* 
 This function is to be called only at edit.save() 
 because this function will contact OneDrive server to move files,
 which will cause async between client and the server
 The callback function will be called after all the changes have been made
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
			newImagesData = [];
		// Get the correct header for the photo
		for (var i = 0; i != edit.photos.length; ++i) {
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
				if (!isNaN(timeHeaderTmp) && timeHeaderTmp.toString().length >= 6)
					// Correct format
					timeHeader = timeHeaderTmp.toString().substring(0, 6);
			}
		}
		if (timeHeader == undefined)
			// Still cannot find the correct header
			timeHeader = edit.getDate();
		// Store all the files in the resource folder that don't change locations later in the cache
		localStorage["images"] = JSON.stringify(newImagesData);

		// Start to change location
		var resourceDir = "/drive/root:/Apps/Journal/resource",
			contentDir = "/drive/root:/Apps/Journal/data/" + timeHeader,
			processingPhoto = 0;
		if (photoQueue.length != 0) {
			// Process the photos
			for (var i = 0; i != photoQueue.length; ++i) {
				var requestJSON, url, newName,
					token = getTokenFromCookie(),
					name = photoQueue[i]["name"],
					isToResource = photoQueue[i]["resource"];
				if (isToResource) {
					// Would like to be added to entry, originally at data folder
					newName = timeHeader + (new Date().getTime() + i) + name.substring(name.length - 4);
					requestJSON = {
						// New name of the file
						name: newName,
						parentReference: {
							path: resourceDir
						}
					};
					// Still use the old name to find the file
					url = "https://api.onedrive.com/v1.0" + contentDir + "/" + name + "?select=name,size&access_token=" + token;
					// Add to cache
				} else {
					// Would like to be added to data, i.e. remove from resource folder
					newName = name;
					requestJSON = {
						parentReference: {
							path: contentDir
						}
					};
					url = "https://api.onedrive.com/v1.0" + resourceDir + "/" + name + "?select=name,size&access_token=" + token;
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
					data: JSON.stringify(requestJSON)
				})
				.done(function(data, status, xhr) {
					var newName = data["name"];
					// Add the url of this new image to map
					journal.archive.map[newName] = {
						url: data["@content.downloadUrl"],
						size: data["size"]
					}
					animation.log("Photo transferred");
					console.log("edit.photoSave()\tFinish update metadata");
				})
				.fail(function(xhr, status, error) {
					animation.log("One tranfer failed. No transfer was made", true);
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
										resource = edit.photos[k]["resource"];
								// Update the new name
								edit.photos[k]["name"] = newName;
								// Switch the location
								edit.photos[k]["resource"] = !resource;
								// Get the result of transferring
								if (!resource) {
									// Originally not at the resource, to resource
									newImagesData.push({
										fileName: newName
									});
								} else {
									// To data, and remove from cache
									for (var j = 0; j != newImagesData.length; ++j)
										if (newImagesData[j]["fileName"] == name) {
											delete newImagesData[name];
											break;
										}
									delete journal.archive.map[name];
								}
								break;
							}
						}
					}
					// Test if it is elligible for calling callback()
					if (++processingPhoto == photoQueue.length) {
						localStorage["images"] = JSON.stringify(newImagesData);
						animation.log("Finished photo transfer");
						callback();
					}
				});
			}
		} else {
			// Call callback directly
			callback();
		}
	}
}

edit.photoHide = function() {
	// Just hide everything, no further moves to be made
	$("#attach-area .images").animate({ height: "0" }).fadeOut().html("");
}

/************************** LOCATION 2 ************************/

/* Toggle location getter by using Google Map */
edit.location = function(index) {
	if (index == edit.mediaIndex["place"] || index == undefined)
		return;
	edit.cleanupMediaEdit();
	// Just start a new one
	animation.setConfirm(2);
	// Update media index
	edit.mediaIndex["place"] = index;
	var selectorHeader = edit.getSelectorHeader("place");
	// Spread map-selector
	$("#map-holder").fadeIn();
	var errorMsg = "Did you enable location sharing?";
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
			searchBox = new google.maps.places.Autocomplete(document.getElementsByClassName('place-search')[edit.mediaIndex["place"]], { types: ['geocode'] });
			markers = [];

			google.maps.event.clearListeners(searchBox, 'place_changed');
			google.maps.event.addListener(searchBox, 'place_changed', function() {
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
			google.maps.event.addListener(map, 'bounds_changed', function() {
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
			alert(errorMsg);
		});
	} else {
		// Browser doesn't support Geolocation
		alert(errorMsg);
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
}

edit.locationHide = function() {
	if (edit.mediaIndex["place"] < 0)
		// Invalid call
		return;
	var selectorHeader = edit.getSelectorHeader("place");
	// Disable input boxes
	$(selectorHeader + "input").prop("disabled", true);
	// Recover onclick event
	$(selectorHeader + "a").attr("onclick", "edit.location(" + edit.mediaIndex["place"] + ")");
	// Save data by default
	edit.locationSave(edit.mediaIndex["place"]);
	// Remove the contents
	$("#map-holder").fadeOut().html('<div id="map-selector"></div>');
	$("#edit-pane").off("keyup");
	// Hide all the options button
	animation.hideIcon(".entry-option");
	edit.mediaIndex["place"] = -1;
	edit.isEditing = "";
}

/* Save the location and collapse the panal */
edit.locationSave = function(index) {
	// TODO change to fix each location
	var data = localStorage["place"],
		selectorHeader = edit.getSelectorHeader("place", index),
		latitude = parseFloat($(selectorHeader + ".latitude").val()),
		longitude = parseFloat($(selectorHeader + ".longitude").val()),
		newElem = {};
	if (!data)
		data = [];
	else
		data = JSON.parse(data);
	newElem["title"] = $(selectorHeader + ".title").val();
	// Test if both latitude and longitude are valid 
	if (!isNaN(latitude) && !isNaN(longitude)) {
		newElem["latitude"] = latitude;
		newElem["longitude"] = longitude;
	}
	// Update the data
	data[index] = newElem;
	localStorage["place"] = JSON.stringify(data);
}

edit.locationPin = function() {
	// Show the location menu
	var errorMsg = "Did you enable location sharing?",
		selectorHeader = edit.getSelectorHeader("place");
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
		}, function() {
			alert(errorMsg);
		});
	} else {
		// Browser doesn't support Geolocation
		alert(errorMsg);
	}
}

/* Reverse geocoding */
edit.locationGeocode = function(pos) {
	var mapOptions = {
		zoom: 16,
		center: pos,
	}, map = new google.maps.Map(document.getElementById("map-selector"), mapOptions),
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
			if (results[0])
				$(selectorHeader + ".title").val(results[0].formatted_address);
			else
				alert('No results found');
		} else {
			alert('Geocoder failed due to: ' + status);
		}
	});
}

/************************** MUSIC 4 **************************/

edit.music = function(index) {
	edit.itunes(index, 4);
}

edit.musicHide = function() {
	edit.itunesHide(4);
}

edit.musicSave = function(index) {
	edit.itunesSave(index, 4);
}

/************************** MOVIE 5 *************************/

edit.movie = function(index) {
	edit.itunes(index, 5);
}

edit.movieHide = function() {
	edit.itunesHide(5);
}

edit.movieSave = function(index) {
	edit.itunesSave(index, 5);
}

/************************** BOOK 6 **************************/

edit.book = function(index) {
	edit.itunes(index, 6);
}

edit.bookHide = function() {
	edit.itunesHide(6);
}

edit.bookSave = function(index) {
	edit.itunesHide(index, 6);
}

/************* GENERIC FOR MUSIC MOVIE & BOOK ***************/

edit.itunes = function(index, typeNum) {
	var type = edit.mediaName(typeNum);
	if (index == edit.mediaIndex[type] || index == undefined)
		return;
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
}

edit.itunesHide = function(typeNum) {
	var type = edit.mediaName(typeNum);
	if (edit.mediaIndex[type] < 0)
		// Invalid call
		return;
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
}

edit.itunesSave = function(index, typeNum) {
	var type = edit.mediaName(typeNum);
	data = localStorage[type],
	selectorHeader = edit.getSelectorHeader(type, index),
	title = $(selectorHeader + ".title").val(),
	author = $(selectorHeader + ".desc").val();
	data = data ? JSON.parse(data) : [];
	var newElem = {
		title: title,
		author: author,
	};
	data[index] = newElem;
	localStorage[type] = JSON.stringify(data);
}

/************************** WEBLINK 7 **************************/

edit.weblink = function(index) {
	if (index == edit.mediaIndex["weblink"] || index == undefined)
		return;
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
}

edit.weblinkHide = function() {
	if (edit.mediaIndex["weblink"] < 0)
		// Invalid call
		return;
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
}

edit.weblinkSave = function(index) {
	var data = localStorage["weblink"],
	selectorHeader = edit.getSelectorHeader("weblink", index),
	title = $(selectorHeader + ".title").val(),
	url = $(selectorHeader + ".desc").val();
	data = data ? JSON.parse(data) : [];
	var newElem = {
		title: title,
		url: url,
	};
	data[index] = newElem;
	localStorage["weblink"] = JSON.stringify(data);
}

/******************************************************************
 ************************ OTHERS **********************************
 ******************************************************************/

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

