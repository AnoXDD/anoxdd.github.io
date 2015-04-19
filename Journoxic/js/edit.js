/* The script for editing anything */

window.edit = {};
/* The index of the entry being edited. Set to -1 to save a new entry */
edit.time = 0;
edit.intervalId = -1;
edit.confirmName = "";

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
	// Add to cache, all the cache processing starts here
	data = edit.importCache(data);
	console.log(Object.keys(data));
	editPane = $(edit.editView(data));

	// Content processing
	$(".header div").fadeOut();
	// Initialize the contents
	$("#contents").fadeOut(400, function() {
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
		$("#edit-pane #attach-area .icontags .other, #edit-pane #attach-area .texttags .other").mousewheel(function(event, delta) {
			// Only scroll horizontally
			this.scrollLeft -= (delta * 50);
			event.preventDefault();
		});

		edit.refreshSummary();
	});
	headerShowMenu("add");
	edit.intervalId = setInterval(edit.refreshTime, 1000);
}

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
	data["iconTags"] = parseInt(localStorage["iconTags"]);
	data["textTags"] = localStorage["textTags"];
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
			data["time"]["begin"] = edit.convertTime(line.substring(8));
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

/* Return the index of data found */
edit.find = function(created) {
	for (key in journal.archive.data) {
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
	for (key in elements)
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
	for (key in tmp) {
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

edit.cleanEditCache = function() {
	localStorage["_cache"] = 0;
	delete localStorage["title"];
	delete localStorage["body"];
	delete localStorage["created"];
	delete localStorage["currentEditing"];
	delete localStorage["iconTags"];
	delete localStorage["textTags"];
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

edit.toggleIcon = function(htmlName) {
	var selector = "#attach-area .icontags p." + htmlName,
		parent = $(selector).parent().attr("class"),
		iconVal = app.bitwise().getIconval($(selector).attr("title").toLowerCase());
	if ($(selector).toggleClass("highlight").hasClass("highlight")) {
		if (parent == "weather" || parent == "emotion")
			$("#attach-area .icontags ." + parent + " p:not(." + htmlName + ")").css("height", "0");
		// Now highlighted
		localStorage["iconTags"] = parseInt(localStorage["iconTags"]) | iconVal;
	} else {
		if (parent == "weather" || parent == "emotion")
			$("#attach-area .icontags ." + parent + " p:not(." + htmlName + ")").removeAttr("style");
		// Dimmed
		localStorage["iconTags"] = parseInt(localStorage["iconTags"]) & ~iconVal;
	}
}

edit.toggleLight = function() {
	$("#text-area").toggleClass("dark").children().toggleClass("dark");
}

edit.saveTitle = function() {
	localStorage["title"] = $("#entry-header").val();
}

edit.saveTag = function() {
	var tagVal = $("#entry-tag").val().toLowerCase().replace(/\|/g, "");
	// Test for duplicate
	if (localStorage["textTags"].split("|").indexOf(tagVal) != -1) {
		$("#entry-tag").effect("highlight", { color: "#000" }, 400);
	} else {
		var found = false;
		// Try to convert to iconTag
		$("#attach-area .icontags p").each(function() {
			if ($(this).attr("title").toLowerCase() == tagVal) {
				// Found
				found = true;
				if (!$(this).hasClass("highlight")) {
					$(this).trigger("click");
				} else {
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

/* Get my format of time and convert it to the milliseconds since epoch */
edit.convertTime = function(time) {
	var month = parseInt(time.substring(0, 2)),
		day = parseInt(time.substring(2, 4)),
		year = parseInt(time.substring(4, 6)),
		hour = parseInt(time.substring(7, 9)),
		minute = parseInt(time.substring(9, 11)),
		date = new Date(2000 + year, month - 1, day, hour, minute);
	return date.getTime();
}

/* Sort journal.archive.data */
edit.sortArchive = function() {
	journal.archive.data.sort(function(a, b) {
		// From the latest to oldest
		return b["time"]["created"] - a["time"]["created"];
	});
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

edit.quit = function(save) {
	clearInterval(edit.intervalId);
	edit.time = 0;
	if (save) {
		// Save to local contents
		var index = edit.find(localStorage["created"]),
			data = edit.exportCache(index);
		edit.sortArchive();
		journal.archive.data = edit.minData();
		edit.saveDataCache();
	} else {
	}
	// Clean cache anyway
	edit.cleanEditCache();
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
}

/* A function to be called by confirm */
edit.confirm = function() {
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
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}