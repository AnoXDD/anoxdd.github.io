/* The script for editing anything */

window.edit = {};
/* The index of the entry being edited. Set to -1 to save a new entry */
edit.time = 0;
edit.intervalId = -1;

/* 
 Initialize the edit pane.
 localStorage["created"] will be used to track the entry being edited
 overwrite - boolean to determine whether or not to create a new entry (overwrite previously stored info)
 index - the index of the archive data (optional)
 */
edit.init = function(overwrite, index) {
	edit.editView = _.template($("#edit-view").html());
	var editPane, data;

	// Test if there are cached data
	if (localStorage["_cache"]) {
		// There is cache
		if (overwrite == true) {
			edit.cleanCache();
			if (index != undefined) {
				data = journal.archive.data[index];
				localStorage["created"] = data["time"]["created"];
			}
		} else if (overwrite == false) {
			// Read from available caches
			if (localStorage["created"])
				data = edit.find(localStorage["created"]);
			else
				// Nothing found, start a new one
				// Placeholder
				;
		} else if (overwrite == undefined) {
			// Do not overwrite or overwrite is undefined
			if (index != undefined) {
				// Display edit-confirm
				animation.hideIcon("#add-confirm", animation.showIcon("#edit-confirm"));
			} else {
				// Display add-confirm
				animation.hideIcon("#edit-confirm", animation.showIcon("#add-confirm"));
			}
			return;
		}
	}
	// If still no available data to be stored, create a new one
	data = data || edit.newContent();

	// Now you have caches anyway
	localStorage["_cache"] = true;
	// Add to cache
	if (data["title"])
		localStorage["title"] = data["title"];
	if (data["text"])
		if (data["text"]["body"])
			localStorage["body"] = data["text"]["body"];

	editPane = $(edit.editView(data));
	// This is a must
	localStorage["created"] = data["time"]["created"];

	// Content processing
	$(".header div").fadeOut();
	$("#contents").fadeOut(400, function() {
		$("#edit-pane").html(editPane).fadeIn();
		if (localStorage["title"])
			$("#entry-header").val(localStorage["title"]);
		if (localStorage["body"])
			$("#entry-body").text(localStorage["body"]);
		edit.refreshSummary();
	});
	headerShowMenu("add");
	edit.intervalId = setInterval(edit.refreshTime, 1000);
}

/* Return the data indexed by created */
edit.find = function(created) {
	for (key in journal.archive.data) {
		if (journal.archive.data[key]["time"])
			if (journal.archive.data[key]["time"]["created"] == created)
				return journal.archive.data[key];
	}
}

/* Parse the json to fit _.template. This function also syncs data to localStorage */
edit.parseJSON = function(string) {
	var dict = JSON.parse(string),
		elements = "title time text video webLink book music movie images voice place iconTags2 textTags".split(" "),
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
	return dict;
}

edit.cleanCache = function() {
	localStorage["_cache"] = false;
	delete localStorage["title"];
	delete localStorage["body"];
	delete localStorage["created"];
	delete localStorage["currentEditing"];
}

edit.toCache = function(data) {

}

edit.toggleLight = function() {
	$("#text-area").toggleClass("dark").children().toggleClass("dark");
}

edit.saveTitle = function() {
	localStorage["title"] = $("#entry-header").val();
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
		// Save the cache
		localStorage["_cache"] = true;
		localStorage["title"] = $("#entry-header").val();
		localStorage["body"] = $("#entry-body").val();
		// Store the data
		// ...
	} else {
		// Discard the cache
		edit.cleanCache();
	}
	// Content processing
	$(".header div").fadeIn();
	$("#edit-pane").fadeOut(400, function() {
		// Remove the edit pane
		$("#edit-pane").html("");
		$("#contents").fadeIn();
	});
	headerShowMenu("edit");
}