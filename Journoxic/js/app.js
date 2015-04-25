//(function(window, $) {
window.journal = {};
window.app = {};
journal.archive = {};
journal.archive.data = [];
/* The number of the total media */
journal.archive.media = 0;
/* The map to map the source name to the weblink */
journal.archive.map = {};

app.month_array = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
/* The resource folder of all the images/video/music covers, etc. */
app.resource = "resource/";
/* The number of the pages already loaded */
app.lastLoaded = 0;
/* The index of the page that is currently being displayed */
app.currentDisplayed = -1;
/* The number of entry displayed */
app.displayedNum = 0;
/* The number of lines displayed */
app.displayedLines = 0;
/* The number of characters displayed */
app.displayedChars = 0;
/* The total of time used on writing all the displayed entries (if appliable), in seconds */
app.displayedTime = 0.0;
/*
 The index of the page that last loaded.
 Set to -1 so that no entry is loaded at the beginning 
 */
app.lastQualified = -1;
/* The number of pages to be loaded each time */
app.pageLoaded = 1;
/* Available tags to be searched */
app.preloadedTags = [];
/* The keyword to be searched */
app.command = "";
app.init = function() {
	// Enter to search
	var thisApp = this;
	// Header fix
	showLoginButton();
	// Initialize preloaded tags
	app.preloadedTags.push("%photo", "%video", "%music", "%voice", "%book", "%movie", "%place", "%weblink");
	var tagsArray = app.bitwise().getTagsArray();
	for (var key = 0; key != tagsArray.length; ++key)
		app.preloadedTags.push("#" + tagsArray[key]);
	// Clear the field of search input every time on focus
	$("#query").keyup(function(n) {
		if (n.keyCode == 13) {
			app.command = $("#query").val();
			$("#query").effect("highlight", { color: "#dddddd" });
			thisApp.load(app.command, true);
		}
	})
	// Autocomplete for preloaded tags
	.bind("keydown", function(event) {
		// Don't navigate away from the field on tab when selecting an item
		if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
			event.preventDefault();
		}
	})
	.autocomplete({
		minLength: 1,
		autoFocus: true,
		source: function(request, response) {
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
			response($.ui.autocomplete.filter(availableTags, request.term.split(/ \s*/).pop()));
		},
		focus: function() {
			// Prevent value inserted on focus
			return false;
		},
		select: function(event, ui) {
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
	// Change the format of time on hover
	$("#search-result").hover(function() {
		$("#search-result").hide();
		$("#total-time").text(Math.floor(app.displayedTime / 60) + ":" + app.displayedTime % 60);
		$("#search-result").fadeIn(500);
	}, function() {
		$("#search-result").hide();
		$("#total-time").text(app.displayedTime);
		$("#search-result").fadeIn(500);
	});
	// Show confirm button for delete
	$("#delete").on("click", function() {
		if (app.currentDisplayed == -1) {
			console.log("delete\tNothing to delete!")
			animation.deny(this);
			return;
		}
		animation.setConfirm("delete");
	});
	// Add clickon event for all the menu buttons
	$(".entry-menu").each(function() {
		$(this).on("click", function() {
			headerShowMenu($(this).attr("id"));
		});
	});
};
app.load = function(filter, forceReload, newContent) {
	if (newContent == "") {
		// Try to add nothing
		console.log("app.load()\tNo new content!");
		animation.deny("#refresh-media");
		return;
	} else if (newContent == undefined) {
		// Filter out undefined element
		journal.archive.data = journal.archive.data.filter(function(key) {
			return key != undefined;
		});
		if (journal.archive.data.length == 0) {
			console.log("app.load()\tNo archive data!");
			animation.deny("#refresh-media");
			return;
		}
	}
	// Hide anyway
	$("#search-result").hide();
	// Also hide the detail view
	app.detail.prototype.hideDetail();
	/* The function to be called to reload the layout */
	var loadFunction = function() {
		$("#total-entry").text(journal.archive.data.length);
		console.log("Calling app.list(" + filter + ")");
		console.log("\t> lastLoaded = " + app.lastLoaded);
		new app.list(filter);
		app.dataLoaded = true;
	};
	if (!app.dataLoaded) {
		// app.loadScript("data/data.js", loadFunction, true);
		if (newContent) {
			// New contents available! Refresh the new data
			console.log("app.load(): data.length = " + newContent.length);
			app.loadScript(newContent, loadFunction, false);
			edit.saveDataCache();
		}
	}
	if (forceReload) {
		// Start to reload
		// Remove all the child elements and always
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
		$("#query").val(filter);
		$("#total-displayed").text(app.displayedNum);
		$("#total-char").text(app.displayedChars);
		$("#total-line").text(app.displayedLines);
		$("#total-time").text(app.displayedTime);
		// Refresh every stuff
		for (var key = 0, len = journal.archive.data.length; key != len; ++key)
			journal.archive.data[key]["processed"] = 0;
		loadFunction();
	}
	// Show the final result anyway
	$("#search-result").fadeIn(500);
	if (filter == undefined)
		filter == "";
}
// Load a script and passed in a function
app.loadScript = function(data, func, isScript) {
	if (isScript) {
		var newScript = document.createElement("script"),
				newFunction = function() {
					func();
				};
		newScript.src = data;
		newScript.charset = "utf-8";
		newScript.onload = newFunction;
		// * Seems that if everything is ready then load the data
		newScript.onreadystatechange = function() {
			if (this.readyState == "complete" || this.readyState == "loaded") {
				newFunction();
			}
		};
		document.getElementsByTagName("head")[0].appendChild(newScript);
	} else {
		// Raw data
		console.log("app.loadScript(): data.length = " + data.length);
		journal.archive.data = JSON.parse(data);
		func();
	}
};
// Do not need to understand because no user is provided
app.user = function() {
	var e = "",
		c = journal.archive.user;
	if (c.ProfileHash) {
		e += '<img src="' + app.resource + 'profile.jpg">';
	}
	e += "<p>" + c.Name + "</p>";
	var d = [];
	if (!!c.bg && c.bg.length > 0) {
		d = c.bg;
	} else {
		d = app.background;
	}
	if (d.length > 0) {
		var f = Math.floor(Math.random() * d.length),
			g = d[f];
		$('<div id="bg-dimmed">').prependTo("body");
		$('<div id="bg-image">').css("background-image", "url('" + g + "')").prependTo("body");
	}
	$("#user").html(e);
};
/* filter - the request string to display certain filter */
app.list = function(filter) {
	////console.log("Called app.list(" + filter + ")");
	var f = this,
		/* The data loaded */
		data = journal.archive.data; // original:[e]
	journal.total = data.length;
	var d = app.cList,
		c = d.children("ul");
	// Load more if the user requests
	if (!this.contents && c.length < 1) {
		d.html('<ul></ul><div class="loadmore"></div>');
		this.contents = d.children("ul");
		this.loadmore = d.children("div.loadmore");
		this.loadmore.on("click", function() {
			////console.log("> Loadmore clicked");
			app.currentPage++;
			f.load(filter);
		});
		this.load(filter);
		// Scroll to load more
		d.off("scroll").on("scroll", function() {
			////console.log("scrollTop() = " + $(this).scrollTop() + ";\t f.contents.height() = " + f.contents.height() + ";\t d.height() = " + d.height());
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
	/* Load one qualified entry of the contents from the data */
	load: function(filter) {
		////console.log("Call app.list.load(" + filter + ")");
		var currentList = this, // [h]
			contents = journal.archive.data, // original:[f]
			e = app.currentPage,
			currentLoaded = app.lastLoaded, // original [g]
			lastQualifiedLoaded = app.lastQualified;
		// Adjust if the number of contents needed to be loaded is more than all the available contents
		// Load the contents
		if (app.lastLoaded >= journal.archive.data.length)
			currentLoaded = app.lastLoaded = journal.archive.data.length - 1;
		contents[currentLoaded].index = currentLoaded;
		// Test if current entry satisfies the filter
		while (true) {
			if (this.qualify(contents[currentLoaded], filter)) {
				var lastTime;
				// Get the time of last clip
				if (lastQualifiedLoaded == -1)
					lastTime = 0;
				else
					lastTime = contents[lastQualifiedLoaded].time.start || contents[lastQualifiedLoaded].time.created;
				// Go to load/change html of the content
				currentList.html(journal.archive.data[currentLoaded], lastTime);
				// Track the index of this data
				lastQualifiedLoaded = currentLoaded;
				// Update other information
				++app.displayedNum;
				app.displayedChars += contents[currentLoaded].text.chars;
				app.displayedLines += contents[currentLoaded].text.lines;
				if (contents[currentLoaded].time.end) {
					var timeDelta = (contents[currentLoaded].time.end - contents[currentLoaded].time.start) / 60000;
					if (!isNaN(timeDelta))
						app.displayedTime += timeDelta;
				}
				$("#search-result").hide().fadeIn(500);
				$("#total-displayed").text(app.displayedNum);
				$("#total-char").text(app.displayedChars);
				$("#total-line").text(app.displayedLines);
				$("#total-time").text(app.displayedTime);
				// Find the qualified entry, break the loop if scrollbar is not visible yet
				if ($("#list").get(0).scrollHeight == $("#list").height() && ++currentLoaded != journal.total)
					continue;
				break;
			} else {
				// Not qualified; add an empty list
				this.htmlEmpty();
				// 1) Increment currentLoaded to try to load the next entry candidate
				// 2) Tests if this is the last entry to be loaded. If so, break the circle
				if (++currentLoaded == journal.total)
					// Break out of the loop
					break;
			}
		}
		// Update loaded contents
		if (++currentLoaded >= journal.total) {
			// Remove load more
			$(".loadmore").remove();
			// Append a sign to indicate all of the entries have been loaded
			$("#list").append('<li><p class="separator"><span>EOF</span></p></li>');
		}
		app.lastQualified = lastQualifiedLoaded;
		app.lastLoaded = currentLoaded;
	},
	/* Checks if this entry satisfies current string filter */
	qualify: function(data, filter) {
		////console.log("Call app.list.qualify(" + data["title"] + ", " + filter + ")");
		// Test if the filter is there
		if (!filter)
			return true;
		// Clear multiple white spaces
		while (filter.search("  ") != -1)
			filter = filter.replace("  ", " ");
		/* The elements of all the filter */
		var elements = filter.toLowerCase().split(" ");
		// Iterate for all the elements
		for (var key = 0, len = elements.length; key < len; ++key) {
			var element = elements[key].split("|"),
				found = false;
			console.log("\t\t> Testing " + element);
			// The for-loop will break if any match is found
			for (subkey in element) {
				// Tag
				if (element[subkey].charAt(0) == '#') {
					if (data["textTags"]) {
						var textTagArray = data["textTags"].split("|"),
							subfound = false;
						for (tag in textTagArray)
							if (textTagArray[tag] == element[subkey].substr(1)) {
								subfound = true;
								break;
							}
						if (subfound) {
							////console.log("\t- Tags Found!");
							// Found
							break;
						}
					}
					var iconTags = data["iconTags"];
					if (iconTags) {
						if (app.bitwise().getNum(iconTags, element[subkey].substr(1))) {
							////console.log("\t- Icon Found!");
							// Found
							found = true;
							break;
						}
					}

				} else if (element[subkey].charAt(0) == '%') {
					////console.log("\t- Test type");
					// Type
					var typeArray = app.bitwise().content(data["attachments"]),
						type = element[subkey].substr(1),
					subfound = false;
					for (var key = 0; key != typeArray.length; ++key)
						if (type == typeArray[key]) {
							subfound = true;
							break;
						}
					if (subfound) {
						////console.log("\t- Type match!");
						// Found
						found = true;
						break;
					}
				} else if (element[subkey].charAt(0) == '@') {
					////console.log("\t- Test time");
					// Time
					var timeStr = element[subkey].substr(1);
					if (this.isInRange(timeStr, data["time"]["created"])) {
						console.log("\t- Time match!");
						// Found
						found = true;
						break;
					}
				} else if (element[subkey].charAt(0) == '+') {
					////console.log("\t- Test body");
					if (data["text"]["body"].match(new RegExp(element[subkey].substr(1), "i"))) {
						////console.log("\t- Body match!");
						// Found
						found = true;
						break;
					}
				} else {
					////console.log("\t- Test title");
					if (data["title"].match(new RegExp(element[subkey], "i"))) {
						////console.log("\t- Title match!");
						// Found
						found = true;
						break;
					}
				}
				// Any one matches will break the inner loop
				if (found)
					break;
			}
			// If any one matches in the inner loop, the outer loop will continue until any one doe not match or all the tests have been passed
			if (found)
				continue;
			console.log("Reach end");
			// No result found
			return false;
		}
		console.log("Passed all");
		return true;
	},
	/* Returns the date string */
	date: function(time, timeOnly) {
		var date = new Date(time),
			year = date.getFullYear(),
			month = date.getMonth(),
			day = date.getDate(),
			hour = date.getHours(),
			minute = date.getMinutes(),
			minute = minute < 10 ? "0" + minute : minute;
		hour = hour < 10 ? "0" + hour : hour;
		if (!timeOnly)
			return app.month_array[month] + " " + day + ", " + year + " " + hour + ":" + minute;
		else
			return hour + ":" + minute;
	},
	/* Converts the content to html and append to the list of contents */
	html: function(data, lastTime) { // [d]
		// All the summary
		data.summary = data.text.ext;
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
		// Get the created time
		var createTime = data.time.start || data.time.created;
		data.datetime = this.date(createTime);
		data.endtime = "";
		if (data.time.end)
			data.datetime += " - " + this.date(data.time.end, 1);
		// Separator
		var date_arr = this.isInSameMonth(createTime, lastTime);
		data.year = date_arr[0];
		data.month = date_arr[1];
		// Get the attached data
		data.attached = this.attached(data.attachments);
		var item = $(app.itemView(data));
		// The event when clicking the list
		item.find(">a").on("click", function(j) {
			j.preventDefault();
			// Show edit panel
			headerShowMenu("edit");
			// Remove all the photos that have already been loaded
			if (app.photos)
				app.photos.remove();
			// De-hightlight the data that is displayed
			////console.log(app.currentDisplayed);
			$("#list ul li:nth-child(" + (app.currentDisplayed + 1) + ") a").removeAttr("style");
			// Highlight the data that is now displayed
			$(this).css("background", "#5d5d5d").css("color", "#fff");
			// Update the index of the list to be displayed
			var flag = (app.currentDisplayed == $(this).parent().index());
			if (!flag) {
				app.currentDisplayed = $(this).parent().index();
				$("#detail").hide().fadeIn(500);
				app.view = new app.detail();
			}
			return false;
		});
		$(".thumb > img:not([style])", item).on("load", function() {
			var h = this.naturalWidth || this.width,
				f = this.naturalHeight || this.height,
				g = app.util.crop(h, f, 160);
			$(this).css(g);
		});
		$(".thumb > canvas", item).each(function() {
			var h = $(this).data("src"),
				g = new Image(),
				f = this.getContext("2d");
			g.src = h;
			g.onload = function() {
				var croppedPhoto = app.util.crop(this.width, this.height, 160),
					x = croppedPhoto.marginLeft || 0,
					y = croppedPhoto.marginTop || 0,
					width = croppedPhoto.width || 160,
					height = croppedPhoto.height || 160;
				f.drawImage(g, x, y, width, height);
			};
		});
		// return item.data("pid", data.pid).addClass(data.type).appendTo(this.contents);
		////return item.addClass(data.type).appendTo(this.contents);
		var $newClass = item.addClass(data.type).hide();
		this.contents.append($newClass.fadeIn(500));
	},
	/* Add an empty html list */
	htmlEmpty: function() {
		console.log("not show!");
		return $("#list ul").append("<li></li>");
	},
	/*  Get the thumbnail of the contents and returns the html */
	thumb: function(data, type) {
		var typeContents = data[type],
			returnHtml;
		if (!!typeContents && typeContents.length > 0) {
			// Test if it is a text file
			var first = typeContents[0],
				g = "";
			// Check the validity of the file
			if (!first.fileName)
				return '<div class="dummy"></div>';
			if (type != "images" && type != "video")
				// Check the validity of the file
				if (!!first.thumb)
					first = first.thumb;
				else
					return '<div class="dummy"></div>';
			////var width = first.width,
			////    height = first.height;
			////if (type == "video") {
			////	if (first.rotation == 90 || first.rotation == 270) {
			////		width = first.height;
			////		height = first.width;
			////	}
			////}
			////var thumbProperties = (width && height) ? app.util.crop(width, height, 160) : {},
			// Manual data
			var thumbProperties = app.util.crop(1024, 720, 80),
				thumbPropertiesHtml = app.util.style(thumbProperties);
			// Match to see if this filename is already in the map
			var fileName;
			if (type == "images") {
				fileName = journal.archive.map[first.fileName]["url"];
				if (fileName == undefined)
					return '<div class="dummy"></div>';
			}
			if (type == "video") {
				fileName = journal.archive.map[first.fileName + "_thumb.jpg"]["url"];
			}
			// Check the validity of photos
			////if (!fileName.match(/.(jpg|png)$/) && !!first.type)
			////	if (first.type.match(/(png|jpg)/))
			////		fileName = fileName + "." + first.type;
			////	else
			////		return '<div class="dummy"></div>';
			if (thumbPropertiesHtml)
				thumbPropertiesHtml = ' style="' + thumbPropertiesHtml + '"';
			var j = '<img src="' + fileName + '"' + thumbPropertiesHtml + ">";
			if (Modernizr.canvas)
				j = '<canvas width="160" height="160" data-src="' + fileName + '"></canvas>';
			if (first.urlType > 1 && type == "weblink")
				g = '<span class="weblink-video"></span>';
			if (type == "video")
				g = '<span class="video-play"></span>';
			returnHtml = '<div class="thumb">' + j + "" + g + "</div>";
		}
		return returnHtml || '<div class="dummy"></div>';
	},
	/* Attach the attachments the contents have to the content */
	attached: function(contentFlag) { // [d, h]
		var retArray = [], // [g]
			typeArray = app.bitwise().content(contentFlag); // [e]
		// Iterate to push all of the contents
		for (var i = 0, len = typeArray.length; i < len; ++i) {
			// Push all of the contents
			retArray.push('<span class="' + typeArray[i] + '"></span>');
		}
		return retArray.join("");
	},
	/*
	 Test if the timeStr specified include timeNum.
	 The time format should be mmddyy
	 Supported time format: @mmddyy:mmddyy @mmddyy @mmyy:mmyy @mmyy
	 */
	isInRange: function(timeStr, timeNum) {
		console.log("Call app.load.isInRange(" + timeStr + "," + timeNum + ")");
		var timeArray = timeStr.split(":"),
			date = new Date(timeNum);
		if (timeArray.length == 1) {
			// An element, test for the length
			var singleTime = timeArray[0];
			if (singleTime.length == 4) {
				// mmyy
				var month = parseInt(singleTime.substr(0, 2)),
					year = parseInt(singleTime.substr(2, 2));
				if (isNaN(month) || isNaN(year))
					// Parse failed
					return false;
				// Return the result
				return (date.getYear() % 100 == year && date.getMonth() + 1 == month);
			} else if (singleTime.length == 6) {
				// mmddyy
				var month = parseInt(singleTime.substr(0, 2)),
					day = parseInt(singleTime.substr(2, 2)),
					year = parseInt(singleTime.substr(4, 2));
				if (isNaN(month) || isNaN(day) || isNaN(year))
					// Parse failed
					return false;
				// Return the result
				return (date.getYear() % 100 == year && date.getMonth() + 1 == month && date.getDate() == day);
			} else {
				// No such matches
				return false;
			}
		} else if (timeArray.length == 2) {
			// Double elements; an range has be specified
			var startTime = timeArray[0],
				endTime = timeArray[1];
			if (startTime.length == 4) {
				// mmyy
				var startMonth = parseInt(startTime.substr(0, 2)),
					startYear = parseInt(startTime.substr(2, 2)),
					endMonth = parseInt(endTime.substr(0, 2)),
					endYear;
				// Automatically fill endYear if the user does not specify it
				if (endTime.length == 2)
					endYear = startYear;
				else if (endTime.length == 4)
					endYear = parseInt(endTime.substr(2, 2));
				else
					// Invalid length
					return false;
				if (isNaN(startMonth) || isNaN(startYear) || isNaN(endMonth) || isNaN(endYear))
					// Parse failed
					return false;
				var month = date.getMonth() + 1,
					year = date.getYear() % 100;
				// Test if the time is in range
				if (month >= startMonth && month <= endMonth && year >= startYear && year <= endYear)
					return true;
				else
					return false;
			} else if (startTime.length == 6) {
				// mmyydd
				var startMonth = parseInt(startTime.substr(0, 2)),
					startDay = parseInt(startTime.substr(2, 2)),
					startYear = parseInt(startTime.substr(4, 2)),
					endMonth = startMonth,
					endDay = startDay,
					endYear = startYear;
				if (endTime.length == 2) {
					endDay = parseInt(endTime);
				} else if (endTime.length == 4) {
					endMonth = parseInt(endTime.substr(0, 2));
					endDay = parseInt(endTime.substr(2, 2));
				} else if (endTime.length == 6) {
					endMonth = parseInt(endTime.substr(0, 2));
					endDay = parseInt(endTime.substr(2, 2));
					endYear = parseInt(endTime.substr(4, 2));
				} else {
					// Illegal endTime length
					return false;
				}
				if (isNaN(startMonth) || isNaN(startDay) || isNaN(startYear) || isNaN(endMonth) || isNaN(endDay) || isNaN(endTime))
					// Parse failed
					return false;
				var startDate = new Date(2000 + startYear, startMonth - 1, startDay),
					endDate = new Date(2000 + endYear, endMonth - 1, endDay, 23, 59, 59);
				// Test if the time is in range
				return startDate < timeNum && endDate > timeNum;
			} else {
				// Illegal length
				return false;
			}
		}
	},
	/* 
	 Tests if the months and years are the same. 
	 Returns an array as [year, month] 0 if are, the month of the new one if not
	 */
	isInSameMonth: function(newTime, oldTime) {
		var newDate = new Date(newTime),
			newMonth = newDate.getMonth(),
			newYear = newDate.getFullYear();
		// Just initialized
		if (oldTime == 0)
			return [newYear, app.month_array[newMonth]];
		var oldDate = new Date(oldTime),
			oldMonth = oldDate.getMonth(),
			oldYear = oldDate.getFullYear();
		return [oldYear == newYear ? -1 : newYear, oldMonth == newMonth ? -1 : app.month_array[newMonth]];
	}
};
/* Display the detail of the data at current index */
app.detail = function() { // [m]
	var dataClip = journal.archive.data[app.currentDisplayed]; // [d]
	if (!dataClip.processed) {
		dataClip.chars = dataClip.text.chars + " Chars";
		dataClip.lines = dataClip.text.lines + " Lines";
		dataClip.contents = this.text(dataClip.text.body);
		if (dataClip.weblink)
			this.thumb(dataClip, "weblink", 50, 50);
		if (dataClip.book) {
			this.thumb(dataClip, "book", 50, 70);
			for (var i = 0; i != dataClip["book"].length; ++i) {
				getCoverPhoto("#detail .book:eq(" + i + ") ", dataClip.book[i].author + " " + dataClip.book[i].title, false, "book");
			}
		}
		if (dataClip.music) {
			this.thumb(dataClip, "music", 50, 50);
			for (var i = 0; i != dataClip["music"].length; ++i) {
				getCoverPhoto("#detail .music:eq(" + i + ") ", dataClip.music[i].author + " " + dataClip.music[i].title);
			}
		}
		if (dataClip.movie) {
			this.thumb(dataClip, "movie", 50, 70);
			for (var i = 0; i != dataClip["movie"].length; ++i) {
				getCoverPhoto("#detail .movie:eq(" + i + ") ", dataClip.movie[i].author + " " + dataClip.movie[i].title, false, "movie");
			}
		}
		// Put missing extensions
		////if (dataClip.contents.images)
		////	for (element in dataClip.images)
		////		if (!dataClip.images[element].name.match(/.(jpg|png)$/))
		////			dataClip.images[element].name = dataClip.images[element].fileName + ".jpg";
		// Audio runtime
		////if (dataClip.voice)
		////	for (element in dataClip.voice)
		////		// If the voice clip has values
		////		if (dataClip.voice[element].runTime)
		////			// Convert the time to human-readable time
		////			dataClip.voice[element].humanTime = app.util.runTime(dataClip.voice[element].runTime);
		if (dataClip.iconTags) {
			var j = app.bitwise().iconTags(dataClip.iconTags);
			if (j.length > 0)
				dataClip.iconTags2 = j;
		}
		// To avoid undefined error in _.template
		var elements = "video weblink book music movie images voice place iconTags2 textTags iconTags".split(" ");
		for (var i = 0, len = elements.length; i < len; ++i)
			if (dataClip[elements[i]] == undefined)
				dataClip[elements[i]] = undefined;
		// Set the read status of the clip to read
		dataClip.processed = 1;
	}
	var l = $(app.detailView(dataClip));
	// !!!!!HIDE THE CONTENT LISTS!!!!
	app.cDetail.css("display", "inline-block").html(l);
	app.app.addClass("detail-view");
	// Hide center if no images available
	if (!dataClip["images"])
		$(".center").hide();
	// Back button
	$(".btn-back", app.cDetail).on("click", function() {
		this.hideDetail();
	});
	// Click to load the photos
	$(".center").on("click", function() {
		var data = journal.archive.data[app.currentDisplayed];
		if (data["images"]) {
			for (var key = 0; key != data["images"].length; ++key) {
				$(".upper").append('<a href="' + journal.archive.map[data["images"][key].fileName]["url"] + '"><img src="' + journal.archive.map[data["images"][key].fileName]["url"] + '"><span></span></a>');
			}
		}
		$(".center").hide();
		$(".upper").css("height", "70%").mousewheel(function(event, delta) {
			// Only scroll horizontally
			this.scrollLeft -= (delta * 50);
			event.preventDefault();
		});;
		var photos = $(".upper > a", app.cDetail);
		// Activate the photo viewer on click
		if (photos.length > 0) {
			app.photos = new app.PhotoViewer(photos.find(">img").clone());
			photos.on("click", function(o) {
				o.preventDefault();
				var n = $(this).index();
				app.photos.open(n);
				return false;
			});
		}
	});
	// Click the icons to search
	$(".icontags > span").on("click", function() {
		var tag = app.bitwise().getTypeByClass(this.className);
		if (tag != "")
			app.load("#" + tag, true);
	});
	////$(window).on("keyup.detail-key", function(n) {
	////	if (n.keyCode == 8) {
	////		$(".btn-back", app.cDetail).trigger("click");
	////	}
	////});
	// Add online media url to the classes
	var eachOp = function() {
		var className = $(this).attr("class");
		$(this).attr("href", journal.archive.map[className]["url"]).removeAttr("class");
	};
	$(".lower .video a").each(eachOp);
	$(".lower .voice a").each(eachOp);
	return dataClip;
};
app.detail.prototype = {
	text: function(rawText) { // [c]
		// Processes spacial characters
		rawText = this.htmlSpacialChars(rawText);
		// Replace all manual lines to a horizontal line
		rawText = rawText.replace(/\t\t[*]\t[*]\t[*]/g, "<hr>");
		// Replace all manual tabs to real tabs
		rawText = rawText.replace(/\r\n\t\t/g, '</p><p class="t2">');
		rawText = rawText.replace(/\r\n\t/g, '</p><p class="t1">');
		// Replace all double lines to a new character
		rawText = rawText.replace(/\n(|\r)\n(|\r)/ig, "</p></br><p>");
		// Replace all other single lines to a new line
		rawText = rawText.replace(/\n(|\r)/ig, "</p><p>");
		return "<p>" + rawText + "</p>";
	},
	// Processes all the spacial characters to html-style characters
	htmlSpacialChars: function(rawText) {
		return rawText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;");
	},
	thumb: function(dataClip, thumbType, width, height) { // [h, l, d, n]
		// Seems that only the type of music, movie, book, weblink will be passed in 
		var thumbClip = dataClip[thumbType]; // [m]
		if (thumbClip && thumbClip.length > 0) {
			var thumbClip = thumbClip[0]; // [k]
			// Invalid data
			if (!thumbClip)
				return false;
			////var fileData = thumbClip.data, // [j]
			////styleArray = (fileData.width && fileData.height) ? app.util.crop(fileData.width, fileData.height, width, height) : {},
			// Manual input
			var styleArray = app.util.crop(1024, 720, width, height),
				styleHtml = app.util.style(styleArray),
				// !!!!!IMPORTANT!!!!! THE DIRECTORY OF THE FILE
				fileDir = app.resource + thumbClip.thumb;
			if (!fileDir.match(/.(jpg|png)$/))
				fileDir = fileDir + ".jpg";
			if (styleHtml)
				styleHtml = ' style="' + styleHtml + '"';
			if (!(thumbClip.thumb === undefined))
				thumbClip.thumb = '<img src="' + fileDir + '"' + styleHtml + ">";
		}
	},
	/* Hide the detail-view */
	hideDetail: function() {
		// !!!!!HIDE THE CONTENT LISTS!!!!
		$(".entry-edit").each(function() {
			animation.hideIcon(this);
		});
		$(".entry-option").each(function() {
			animation.hideIcon(this);
		});
		app.cDetail.css("display", "none").empty();
		app.cList.css("display", "inline-block");
		app.app.removeClass("detail-view");
		//// $(window).off("keyup.detail-key");
		// Remove all the photos
		if (app.photos)
			app.photos.remove();
	}
};
// Change the layout the main container
app.layout = function() {
	var activeWindow = $(window), // Current active window
		changeWindowSize = function() {
			var newHeight = activeWindow.height() < 750 ? activeWindow.height() : activeWindow.height() - 200; // Tests the width of current window to enable spaces on the top and the buttom to disappear
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
	fit: function(width, height, newWidth, newHeight) {
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
	crop: function(width, height, newWidth, newHeight) {
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
	style: function(styleArray) {
		var c = [];
		for (i in styleArray) {
			c.push(i.replace(/([A-Z])/, "-$1").toLowerCase() + ":" + (typeof styleArray[i] == "number" ? styleArray[i] + "px" : styleArray[i]));
		}
		return c.join(";");
	},
	// Converts the second to human readable type
	runTime: function(second) {
		if (second && second > 0) {
			var second = second / 1000,
				e = "0",
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
app.bitwise = function() {
	/************************************************************
	 * When adding a new element here, please make sure that	*
	 * iconVal is also updated.									*
	 ************************************************************/
	var sunny = 1,
		overcast = 2,
		raining = 4,
		snowing = 8,
		thundering = 16,
		happy = 1024,
		notBad = 2048,
		surprised = 4096,
		sad = 8192,
		angry = 16384,
		journal = 32768,
		thoughts = 65536,
		ingress = 131072,
		minecraft = 262144,
		dream = 524288,
		code = 1048576,
		letter = 2097152,
		handwriting = 4194304,
		friendship = 16777216,
		relationship = 33554432,
		star = 67108864,
		food = 134217728,
		leisure = 268435456,
		info = 536870912,
		baby = 1073741824,
		fun = 2147483648,
		travel = 4294967296,
		health = 8589934592,
		outfit = 17179869184,
		shopping = 34359738368,
		pets = 68719476736,
		work = 137438953472,
		sports = 274877906944,
		cook = 549755813888,
		makeup = 1099511627776,
		home = 2199023255552,
		car = 4398046511104,
		D = 0,
		photoVal = 1, // [k]
		videoVal = 2, // [j]
		musicVal = 4, // [w]
		voiceVal = 8, // [I]
		bookVal = 16, // [p]
		movieVal = 32, // [J]
		placeVal = 64, // [h]
		weblinkVal = 128, // [P]
		binaryString = "000000000000000000000000000000000000000000000000000000000000000"; // [c]
	var iconName = {};
	iconName[sunny] = "w01";
	iconName[overcast] = "w02";
	iconName[raining] = "w03";
	iconName[snowing] = "w04";
	iconName[thundering] = "w05";
	iconName[happy] = "e01";
	iconName[notBad] = "e02";
	iconName[surprised] = "e03";
	iconName[sad] = "e04";
	iconName[angry] = "e05";
	iconName[journal] = "c01";
	iconName[thoughts] = "c02";
	iconName[ingress] = "c03";
	iconName[minecraft] = "c04";
	iconName[dream] = "c05";
	iconName[code] = "c06";
	iconName[letter] = "c07";
	iconName[handwriting] = "c08";
	iconName[friendship] = "c10";
	iconName[relationship] = "s01";
	iconName[star] = "s02";
	iconName[food] = "s03";
	iconName[leisure] = "s04";
	iconName[info] = "s05";
	iconName[baby] = "s06";
	iconName[fun] = "s07";
	iconName[travel] = "s08";
	iconName[health] = "s09";
	iconName[outfit] = "s10";
	iconName[shopping] = "s11";
	iconName[pets] = "s12";
	iconName[work] = "s13";
	iconName[sports] = "s14";
	iconName[cook] = "s15";
	iconName[makeup] = "s16";
	iconName[home] = "s17";
	iconName[car] = "s18";
	/* Translate the string tag to the numerical value of icon tag */
	var iconVal = {};
	iconVal["sunny"] = 1;
	iconVal["overcast"] = 2;
	iconVal["raining"] = 4;
	iconVal["snowing"] = 8;
	iconVal["thundering"] = 16;
	iconVal["happy"] = 1024;
	iconVal["notbad"] = 2048;
	iconVal["surprised"] = 4096;
	iconVal["sad"] = 8192;
	iconVal["angry"] = 16384;
	iconVal["journal"] = 32768;
	iconVal["thoughts"] = 65536;
	iconVal["ingress"] = 131072;
	iconVal["minecraft"] = 262144;
	iconVal["dream"] = 524288;
	iconVal["code"] = 1048576;
	iconVal["letter"] = 2097152;
	iconVal["handwriting"] = 4194304;
	iconVal["friendship"] = 16777216;
	iconVal["relationship"] = 33554432;
	iconVal["star"] = 67108864;
	iconVal["food"] = 134217728;
	iconVal["leisure"] = 268435456;
	iconVal["info"] = 536870912;
	iconVal["baby"] = 1073741824;
	iconVal["fun"] = 2147483648;
	iconVal["travel"] = 4294967296;
	iconVal["health"] = 8589934592;
	iconVal["outfit"] = 17179869184;
	iconVal["shopping"] = 34359738368;
	iconVal["pets"] = 68719476736;
	iconVal["work"] = 137438953472;
	iconVal["sports"] = 274877906944;
	iconVal["cook"] = 549755813888;
	iconVal["makeup"] = 1099511627776;
	iconVal["home"] = 2199023255552;
	iconVal["car"] = 4398046511104;
	return {
		content: function(contentFlag) { // [Q, S]
			var retArray = []; // [R]
			if (this.is(contentFlag, photoVal))
				retArray.push("photo");
			if (this.is(contentFlag, videoVal))
				retArray.push("video");
			if (this.is(contentFlag, musicVal))
				retArray.push("music");
			if (this.is(contentFlag, voiceVal))
				retArray.push("voice");
			if (this.is(contentFlag, bookVal))
				retArray.push("book");
			if (this.is(contentFlag, movieVal))
				retArray.push("movie");
			if (this.is(contentFlag, placeVal))
				retArray.push("place");
			if (this.is(contentFlag, weblinkVal))
				retArray.push("weblink");
			return retArray;
		},
		/* Get the array of html names from a typeVal */
		iconTags: function(typeVal) {
			var retArray = [];
			for (i in iconName) {
				if (this.is(typeVal, parseInt(i))) {
					retArray.push(iconName[i]);
				}
			}
			return retArray;
		},
		/* 
		 Get the bitwise number from the string then test if typeVal has this icon. 
		 Return false if the string is either invalid or not found
		 */
		getNum: function(typeVal, stringVal) {
			if (iconVal.hasOwnProperty(stringVal.toLowerCase()))
				return this.is(typeVal, iconVal[stringVal.toLowerCase()]);
			else
				return false;
		},
		/* Return the value in iconVal */
		getIconval: function(tagName) {
			return iconVal[tagName.toLowerCase()];
		},
		/* Get the tag names in HTML languages */
		getTagsHTML: function() {
			var retArray = [];
			Object.keys(iconName).forEach(function(key) {
				retArray.push(iconName[key]);
			});
			return retArray;
		},
		/* Get all the human-readable available tags */
		getTagsArray: function() {
			return Object.keys(iconVal);
		},
		/*
		 Get the value given the class displayed in html 
		 Return -1 if the value is not found
		 */
		getValueByClass: function(className) {
			for (val in iconName)
				if (iconName[val] == className)
					// Found
					return val;
			return -1;
		},
		/*
		 Get the name given the class displayed in html 
		 Return an empty string if the string is either invalid or not found
		 */
		getTypeByClass: function(className) {
			var classVal = this.getValueByClass(className);
			if (classVal == -1)
				return "";
			for (str in iconVal)
				if (iconVal[str] == classVal)
					// Found
					return str;
			return "";
		},
		/* Set typeVal on typesVal. Return typesVal | typeVal */
		or: function(typesVal, typeVal) {
			var newVal = this.get(typesVal).split("");
			newVal[this.get(typeVal).indexOf("1")] = '1';
			return parseInt(newVal.join(""), 2);
		},
		andnot: function(typesVal, typeVal) {
			var newVal = this.get(typesVal).split("");
			newVal[this.get(typeVal).indexOf("1")] = '0';
			return parseInt(newVal.join(""), 2);
		},
		// Tests if testValue is in totalValue, i.e. typesVal has type of typeVal
		is: function(typesVal, typeVal) { // [R, Q]
			return this.get(typesVal).charAt(this.get(typeVal).indexOf("1")) == "1";
		},
		// Gets the binary value at the length of 64
		get: function(value) { // [Q]
			return this.substr(binaryString + value.toString(2));
		},
		// Returns the last 64 digits of this string
		substr: function(string) { // [R]
			var len = string.length; // [Q]
			return string.substr(len - 64);
		}
	};
};
app.PhotoViewer = function(c, d) {
	if (!c && typeof c != "object") {
		return false;
	}
	this.list = c;
	this.callback = d || function() { };
	this.make();
	this.init();
};
app.PhotoViewer.prototype = {
	make: function() {
		var f = this.list;
		if (f.length > 1) {
			var c = $("<ul>");
		}
		var d = $('<ul class="swipe-wrap">');
		f.each(function(j) {
			$("<li>").html(this).appendTo(d);
			if (!!c) {
				$("<li>").html('<a href="#' + j + '">' + j + "</a>").appendTo(c);
			}
		});
		var e = $('<div class="wrap swipe">').html(d);
		var g = $('<div class="control">');
		g.append('<input type="button" value="Close" class="btn-close"/>');
		////if (f.length > 1) {
		////	g.append('<input type="button" value="Prev" class="btn-prev"/>');
		////	g.append('<input type="button" value="Next" class="btn-next"/>');
		////}
		if (!!c) {
			c.css("width", f.length * 17).wrap('<div class="pagination"/>').parent().appendTo(g);
		}
		e.append(g);
		e.append('<div class="background"></div>');
		var h = $('<div id="photoviewer">').html(e);
		h.appendTo("body");
	},
	init: function() {
		var c = this;
		this.viewer = $("body>div#photoviewer");
	},
	bind: function() {
		if (!!this._bind) {
			this.swipe.setup();
			return false;
		}
		var j = this;
		var g = this.viewer = $("body>div#photoviewer");
		this.pagination = $("div.pagination>ul>li", this.viewer);
		var c = g.find(">div.swipe");
		this.swipe = new Swipe(c[0], {
			continuous: false,
			callback: j.callback,
			transitionEnd: function(k) {
				j.paging(k);
			}
		});
		$("input.btn-close", g).on("click", function() {
			j.close();
		});
		////$("input.btn-prev", g).on("click", function() {
		////	j.prev();
		////});
		////$("input.btn-next", g).on("click", function() {
		////	j.next();
		////});
		var h = c.find(">ul>li>img");

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
		var e = c.find(">ul>li");
		e.on("click", function(k) {
			if (k, this == k.toElement) {
				j.close();
			}
		});
		this._bind = 1;
	},
	fit: function(g, f, e, d) {
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
	open: function(c) {
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
	close: function() {
		this.viewer.fadeOut(200);
		$(window).off("keyup.photoviewer");
	},
	prev: function() {
		this.swipe.prev();
	},
	next: function() {
		this.swipe.next();
	},
	go: function(c) {
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
app.VideoPlayer = function(f, o) {
	var h = o.rotation || 0,
		e = o.width || 400,
		m = o.height || 304,
		j = $("div.vp-jplayer", f);
	j.jPlayer({
		ready: function() {
			$(this).jPlayer("setMedia", {
				m4v: o.media,
				poster: o.poster
			}).jPlayer("volume", 0.8);
		},
		swfPath: "static/lib",
		solution: ($.browser.msie && parseFloat($.browser.version.substr(0, 1)) <= 9) ? "flash" : "html,flash",
		supplied: "m4v",
		size: {
			width: e,
			height: m,
			cssClass: "vp-video-360p"
		},
		idPrefix: "vp",
		sizeFull: {
			width: "100%",
			height: "100%",
			cssClass: "vp-video-full"
		},
		fullScreen: false,
		autohide: {
			restored: $.browser.mozilla ? false : true,
			full: $.browser.mozilla ? false : true,
			hold: 2000
		},
		cssSelectorAncestor: ".vp-video",
		cssSelector: {
			videoPlay: ".vp-video-play",
			play: ".vp-play",
			pause: ".vp-pause",
			seekBar: ".vp-seek-bar",
			playBar: ".vp-play-bar",
			mute: ".vp-mute",
			unmute: ".vp-unmute",
			volumeBar: ".vp-volume-bar",
			volumeBarVaule: ".vp-volume-bar-value",
			currentTime: ".vp-current-time",
			duration: ".vp-duration",
			fullScreen: ".vp-full-screen",
			restoreScreen: ".vp-restore-screen",
			gui: ".vp-gui",
			noSolution: ".vp-no-solution"
		},
		eventName: ".videoPlayer"
	});
	var k = $("video", j),
		g = 0;
	if (h > 1 && $.browser.chrome) {
		if (h == 90 || h == 270) {
			g = m / e;
			k.data("scale", g);
		}
		k.css("-webkit-transform", "rotate(" + h + "deg)" + (g ? " scale(" + g + ")" : ""));
	}
	var n = $(".vp-volume-bar", f);

	function d(q) {
		var p = ((q - n.offset().left) / n.width()) * 100;
		p = (p > 100) ? 100 : p;
		player.jPlayer("volume", p);
		$(".vp-volume-bar-value", f).css("width", p + "%");
	}
	$(".vp-volume-bar", f).grab({
		onstart: function() {
			self.dragging = true;
		},
		onmove: function(p) {
			d(p.position.x);
		},
		onfinish: function(p) {
			self.dragging = false;
			d(p.position.x);
		}
	});
	var c = $(".vp-progress", f);

	function l(q) {
		var p = ((q - (c.offset().left)) / c.width()) * 100;
		p = (p > 100) ? 100 : p;
		player.jPlayer("playHead", p);
		$(".vp-play-bar", f).css("width", p + "%");
	}
	$(".vp-progress", f).grab({
		onstart: function() {
			self.dragging = true;
		},
		onmove: function(p) {
			l(p.position.x);
		},
		onfinish: function(p) {
			self.dragging = false;
			l(p.position.x);
		}
	});
	j.bind($.jPlayer.event.resize + ".videoPlayer", function(p) {
		if (g > 0) {
			if (p.jPlayer.status.cssClass == "vp-video-full") {
				k.css("-webkit-transform", "rotate(" + h + "deg)");
			} else {
				k.css("-webkit-transform", "rotate(" + h + "deg) scale(" + g + ")");
			}
		}
	});
	j.bind($.jPlayer.event.play + ".videoPlayer", function(p) {
		$(".vp-current-time", f).css("display", "block");
		$(".vp-duration", f).css("display", "none");
		$(".vp-jplayer", f).addClass("vp-played");
	});
	j.bind($.jPlayer.event.stop + ".videoPlayer", function(p) {
		$(".vp-current-time", f).css("display", "none");
		$(".vp-duration", f).css("display", "block");
	});
};
$(document).ready(function() {
	app.app = $("div#app");
	app.contents = app.app.find(">#contents");
	app.cList = app.app.find(">#contents>#list");
	app.cDetail = app.app.find(">#contents>#detail");
	app.itemView = _.template($("#list-view").html());
	app.detailView = _.template($("#detail-view").html());
	app.layout();
	app.init();
});
//})(window, jQuery);