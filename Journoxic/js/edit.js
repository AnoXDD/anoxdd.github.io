/* The script for editing anything */

window.edit = {};
/* The index of the entry being edited. Set to -1 to save a new entry */
edit.time = 0;
edit.intervalId = -1;
edit.confirmName = "";
edit.currentEditing = -1;
edit.mediaIndex = -1;

edit.isLocationShown = false;
edit.map;

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

edit.quit = function(save) {
	clearInterval(edit.intervalId);
	edit.time = 0;
	if (save) {
		// Save to local contents
		edit.save();
		edit.sortArchive();
		journal.archive.data = edit.minData();
		edit.saveDataCache();
	}
	// Map selector toggle
	if (edit.isLocationShown)
		edit.location();
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
edit.save = function(response) {
	var index = edit.find(localStorage["created"]);
	edit.exportCache(index);
	if (response)
		// Show finish animation
		animation.finished("#add-save-local");
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
	// place
	if (localStorage["place"])
		data["place"] = JSON.parse(localStorage["place"].replace(/null/g, ",").replace(/,,/g, ""));
	else
		localStorage["place"] = data["place"] ? JSON.stringify(data["place"]) : "[]";
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
	// Place
	data["place"] = JSON.parse(localStorage["place"].replace(/null/g, ",").replace(/,,/g, ""));
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

edit.cleanEditCache = function() {
	localStorage["_cache"] = 0;
	delete localStorage["title"];
	delete localStorage["body"];
	delete localStorage["created"];
	delete localStorage["currentEditing"];
	delete localStorage["iconTags"];
	delete localStorage["textTags"];
	delete localStorage["place"];
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

edit.addMedia = function(type) {
	switch (type) {
		case 2:
			edit.mediaIndex = $("#attach-area .place").length;
			var htmlContent = '<div class="place"><a title="Edit" onclick="edit.location(' + edit.mediaIndex + ')" href="#"><div class="thumb"></div><input disabled title="Place" class="title place-search" autocomplete="off"/><input disabled title="Latitude" class="desc latitude" autocomplete="off" /><p>,</p><input disabled title="Longitude" class="desc longitude" autocomplete="off" /></a></div>';
			$(htmlContent).insertAfter($("#attach-area .place:eq(" + (edit.mediaIndex - 1) + ")"));
			break;
		default:

	}
}

edit.deleteMedia = function() {

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
		switch (edit.confirmName) {
			case 2:
				// Place
				// Clear the html
				$("#attach-area .place")[edit.mediaIndex].html("");
				// Remove from cache
				var data = JSON.parse(localStorage["place"]);
				delete data[edit.mediaIndex];
				localStorage["place"] = JSON.stringify(data);
				break;
			default:

		}
	}
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

/************************** LOCATION **************************/

/* Toggle location getter by using Google Map */
edit.location = function(index) {
	if (edit.mediaIndex == -1)
		edit.mediaIndex = index;
	var selectorHeader = "#attach-area .place:eq(" + edit.mediaIndex + ") ";
	// Just start a new one
	animation.setConfirm(2);
	if (edit.isLocationShown) {
		// To collapse the current menu anyway
		// Disable input boxes
		$(selectorHeader + "input").prop("disabled", true);
		// Recover onclick event
		$(selectorHeader + "a").attr("onclick", "edit.location(" + edit.mediaIndex + ")");
		// Save data by default
		edit.locationSave(edit.mediaIndex);
		// Remove the contents
		$("#map-holder").fadeOut().html('<div id="map-selector"></div>');
		$("#edit-pane").off("keyup");
		if (index == edit.mediaIndex || index == undefined) {
			// Yes, collapse the current menu
			// Hide all the options button
			animation.hideIcon(".entry-option");
			edit.mediaIndex = -1;
			edit.isLocationShown = false;
			// Avoid following general stuffs for other conditions
			return;
		} else {
			// Start a map-selector for another entry
			selectorHeader = "#attach-area .place:eq(" + index + ") ";
		}
	} else {
		// Spread map-selector
		$("#map-holder").fadeIn();
		edit.isLocationShown = true;
	}
	// Update media index
	edit.mediaIndex = index;
	var errorMsg = "Did you enable location sharing?";
	// Try HTML5 geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var latitude = parseFloat($(selectorHeader + ".latitude").val()) || position.coords.latitude,
				longitude = parseFloat($(selectorHeader + ".longitude").val()) || position.coords.longitude;
			pos = new google.maps.LatLng(latitude, longitude),
			mapOptions = {
				zoom: 15,
				center: pos,
			},
			map = new google.maps.Map(document.getElementById("map-selector"), mapOptions),
				searchBox = new google.maps.places.SearchBox(document.getElementsByClassName('place-search')[edit.mediaIndex]),
			markers = [];

			google.maps.event.clearListeners(searchBox, 'places_changed');
			google.maps.event.addListener(searchBox, 'places_changed', function() {
				var places = searchBox.getPlaces();
				if (places != undefined && places.length == 0) {
					return;
				}
				// Only care about the first result
				var place = places[0],
					bounds = new google.maps.LatLngBounds();
				// Create a marker for each place.
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
						$(selectorHeader + ".latitude").effect("highlight", { color: "#8d8d8d" });
						return;
					}
					if (isNaN(longitude)) {
						$(selectorHeader + ".longitude").effect("highlight", { color: "#8d8d8d" });
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

	// Enable input boxes
	$(selectorHeader + "input").prop("disabled", false);
	// Avoid accidentally click
	$(selectorHeader + "a").removeAttr("onclick");
	// Press esc to save
	$("#edit-pane").keyup(function(n) {
		if (n.keyCode == 27) {
			edit.location(edit.mediaIndex);
		}
	});
}

/* Save the location and collapse the panal */
edit.locationSave = function(index) {
	// TODO change to fix each location
	var data = localStorage["place"],
		selectorHeader = "#attach-area .place:eq(" + edit.mediaIndex + ") ",
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
		selectorHeader = "#attach-area .place:eq(" + edit.mediaIndex + ") ";
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
	selectorHeader = "#attach-area .place:eq(" + edit.mediaIndex + ") ";
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


/******************************************************************
 ************************ OTHERS **********************************
 ******************************************************************/

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}