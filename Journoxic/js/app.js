window.journal = {};
window.app = {};

//(function(window, $) {
journal.archive = {};
journal.archive.data = {};
/** The number of the total media */
journal.archive.media = 0;
/** The map to map the source name to the weblink. Format: {name: {id: xxx, url: xxx, size: xxx}} */
journal.archive.map = {};

app.month_array = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
/** The year to be displayed */
app.year = new Date().getFullYear();
app.years = [];
/** The data to be appended to the year, if this year has not already loaded */
app.yearQueue = {};
/** Whether there are any changes for this year (used for remind the user to upload the data */
app.yearChange = {};
/** The resource folder of all the images/video/music covers, etc. */
app.resource = "resource/";
/** The number of the pages already loaded */
app.lastLoaded = 0;
/** The index of the page that is currently being displayed */
app.currentDisplayed = -1;
/** The number of entry displayed */
app.displayedNum = 0;
/** The number of lines displayed */
app.displayedLines = 0;
/** The number of characters displayed */
app.displayedChars = 0;
/** The total of time used on writing all the displayed entries (if appliable), in seconds */
app.displayedTime = 0.0;
/** The index of the page that last loaded. Set to -1 so that no entry is loaded at the beginning */
app.lastQualified = -1;
/** The number of pages to be loaded each time */
app.pageLoaded = 1;
/** Available tags to be searched */
app.preloadedTags = [];
/** The keyword to be searched */
app.command = "";
/** The boolean indicates if some mutually exclusive functions should be running if any others are */
app.isFunction = true;
/** The variable to track the media that do not belong to any entry */
app.lostMedia = [];

/** The data decoding version of this app, integer decimal only */
app.version = {
	data: 2
};

/** Whether there are any outgoing ajax event */
app.isAjaxActive = false;
/** The timeout time for ajax, in milliseconds */
app.timeOut = 15000;

/**
 * Initializes this app
 */
app.init = function() {
	// Enter to search
	var thisApp = this;
	// Header fix
	showLoginButton();
	// Initialize preloaded tags
	app.preloadedTags.push("%photo", "%video", "%music", "%voice", "%book", "%movie", "%place", "%weblink");
	var tagsArray = app.tag().getIconsInName();
	for (var key = 0; key != tagsArray.length; ++key) {
		app.preloadedTags.push("#" + tagsArray[key]);
	}
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
	// Set the current year
	$("#year").html(app.year).css("opacity", "1");
	app.getYears();
	// Network setup
	// Setup timeout time
	$.ajaxSetup({
		timeout: app.timeOut
	});
	// Setup network monitor
	$(document).ajaxStart(function() {
		app.isAjaxActive = true;
		// By default, just initialize the network bar
		network.init();
	});
	$(document).ajaxStop(function() {
		app.isAjaxActive = false;
		if (network.breakpoint === 0) {
			// Do not destroy it if there are breakpoints
			network.destroy();
		}
	});
	// Test if there is any cache
	animation.testCacheIcons();
	animation.testSub("#add");
};
/**
 * Simply refreshes and force reload
 */
app.refresh = function() {
	app.load("");
}
/**
 * Reloads the content view of the journal. 
 * @param {String} filter - The string representing the filter of display
 * @param {String} newContent - The string representing the new content of journal archive
 * @version 2.0 - Removes param `forceReload` as every call to this function needs a force reload
 */
app.load = function(filter, newContent) {
	// Test the validity of `newContent`
	if (newContent == "") {
		// Try to add nothing
		////console.log("app.load()\tNo new content!");
		animation.error(log.LOAD_DATA_FAIL + log.NO_CONTENT);
		animation.deny("#refresh-media");
		return;
	} else if (newContent == undefined) {
		if (journal.archive.data[app.year]) {
			// Test if there are any data in the queue
			if (app.yearQueue[app.year]) {
				app.yearChange[app.year] = true;
				// Push to the new data
				journal.archive.data[app.year].push.apply(journal.archive.data[app.year], app.yearQueue[app.year]);
				// Then sort it to remove the duplicate
				edit.sortArchive();
				edit.removeDuplicate();
				// Remove the data from the queue
				delete app.yearQueue[app.year];
			}
			var queuedYears = [];
			// Filter out undefined element and entries not belong to this year
			journal.archive.data[app.year] = journal.archive.data[app.year].filter(function(entry) {
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
					// Test for uniqueness
					if (queuedYears.indexOf(createdYear) === -1) {
						queuedYears.push(createdYear);
					}
					return false;
				}
			});
			if (queuedYears.length > 0) {
				animation.log(log.DATA_MOVED_TO_OTHER_YEAR + queuedYears.join(", ") + log.DATA_MOVED_TO_OTHER_YEAR_END);
			}
			if (journal.archive.data[app.year].length === 0) {
				////console.log("app.load()\tNo archive data!");
				animation.warn(log.LOAD_DATA_FAIL + log.NO_ARCHIVE);
				animation.deny("#refresh-media");
				return;
			}
		}
	}
	// Reset the UI
	// Hide anyway
	$("#search-result").hide();
	// Also hide the detail view
	app.detail.prototype.hideDetail();
	// Test if #add has sub-menu
	animation.testCacheIcons();
	animation.testSub("#add");
	/* The function to be called to reload the layout */
	var loadFunction = function() {
		$("#total-entry").text(journal.archive.data[app.year].length);
		////console.log("Calling app.list(" + filter + ")");
		////console.log("\t> lastLoaded = " + app.lastLoaded);
		new app.list(filter);
		app.dataLoaded = true;
	};
	// Try to find the new data (if applicable)
	if (!app.dataLoaded) {
		// app.loadScript("core/data.js", loadFunction, true);
		if (newContent) {
			// New contents available! Refresh the new data
			animation.log(log.CONTENTS_NEW + newContent.length + log.CONTENTS_NEW_END);
			console.log("app.load(): data.length = " + newContent.length);
			app.loadScript(newContent, loadFunction, false);
			edit.saveDataCache();
		}
	}
	// Start to reload, HERE GOES ALL THE DATA RESET
	// Reset animation indentation
	animation.indent = 0;
	// Remove all the child elements and always
	animation.log(log.CONTENTS_RELOADED);
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
	$("#year").html(app.year);
	// Show the dot for changed stuff
	if (app.yearChange[app.year]) {
		$("#year").addClass("change");
	} else {
		$("#year").removeClass("change");
	}
	// Refresh every stuff
	for (var key = 0, len = journal.archive.data[app.year].length; key != len; ++key) {
		journal.archive.data[app.year][key]["processed"] = 0;
	}
	loadFunction();
	// Show the final result anyway
	$("#search-result").fadeIn(500);
	if (filter == undefined) {
		filter = "";
	}
};
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
		journal.archive.data[app.year] = app.updateData(JSON.parse(data));
		func();
	}
};
app.updateData = function(data, toVersion) {
	if (!data["version"]) {
		data["version"] = 1;
	}
	if (data["version"] !== app.version.data) {
		// Let the user know the content is going to be upgraded
		animation.log(log.CONTENTS_UPGRADING);
		switch (toVersion) {
			case 1:
				// Up to v2
				// Integrate textTags and iconTags
				for (var i = 0; i !== data.length; ++i) {
					var iconTags = data[i]["iconTags"],
						textTags = data[i]["textTags"];
					if (iconTags) {
						// There are iconTags
						iconTags = app.tag().getIconsInNameByVal(iconTags).join("|");
						// Add icon tags to texttags
						if (textTags) {
							textTags += "|" + iconTags;
						} else {
							textTags += iconTags;
						}
					}
					data[i]["tags"] = textTags;
				}
				// Intentionally omit "break;"
		}
	}
	return data;
};
/**
 * Gets all the available year by the folder name under /core/ and stores them in `app.years`, in ascending order (earliest year first)
 */
app.getYears = function() {
	animation.log(log.GET_YEARS_START);
	getTokenCallback(function(token) {
		$.ajax({
			type: "GET",
			url: "https://api.onedrive.com/v1.0/drive/special/approot:/core:/children?select=name&orderby=name&access_token=" + token
		})
			.done(function(data) {
				var itemList = data["value"];
				app.years = [];
				for (var i = 0; i !== itemList.length; ++i) {
					var name = itemList[i]["name"];
					// Deliberately not force equal them to test if `name` is an integer
					if (parseInt(name) == name) {
						name = parseInt(name);
						app.years.push(name);
						network.yearFolders.push(name);
					}
				}
				animation.log(log.GET_YEARS_END);
			})
			.fail(function(xhr, status, error) {
				animation.error(log.GET_YEARS_FAIL + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END);
			});
	});
}
/**
 * Calls the program to start changing the year, and if the change succeeds, it will call `app.yearUpdate` for further updating. However, this 
 * This function will check the correctness of the year passed in, and will automatically download the contents of the data if no data found for this year in the memory.
 * @param {number} year - The year to go
 */
app.yearUpdateTry = function(year) {
	app.year = year;
	if (!journal.archive.data[year]) {
		// The data is not loaded yet, download the data
		downloadFile(undefined, true);
	} else {
		app.yearUpdate(year);
	}
}
/**
 * Change the year of the contents to be displayed, and refreshes the display view (by calling `app.refresh()`). 
 * This function does not accept any parameters by using `app.year` to update everything with it. It does NOT check the validness of `app.year`, and will assume that it is a valid one (e.g. the data is already loaded). However, if `app.year` is invalid that `(app.years.indexOf(app.year))` yields -1, `app.year` will be set to this year and it will call `app.yearUpdateTry()`. This function will also correct the buttons for switching between years.
 */
app.yearUpdate = function() {
	$("#year").html(app.year);
	app.refresh();
	// Test the correctness of the buttons
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
	animation.log(log.YEAR_SWITCHED_TO + app.year);
}
/**
 * Sets the year to the previous year. 
 * This function will guarantee the correctless of `app.year`, and will correct it if `app.year` is invalid.
 * @param {boolean} isToEnd - If year goes to the earliest possible year
 */
app.prev = function(isToEnd) {
	if (app.isAjaxActive) {
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
}
/**
 * Sets the year to the next year
 * This function will guarantee the correctless of `app.year`, and will correct it if `app.year` is invalid.
 * @param {boolean} isToEnd - If year goes to the latest year (i.e. this year)
 */
app.next = function(isToEnd) {
	if (app.isAjaxActive) {
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
}
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
			contents = journal.archive.data[app.year], // original:[f]
			currentLoaded = app.lastLoaded, // original [g]
			lastQualifiedLoaded = app.lastQualified;
		// Adjust if the number of contents needed to be loaded is more than all the available contents
		// Load the contents
		if (app.lastLoaded >= journal.archive.data[app.year].length) {
			currentLoaded = app.lastLoaded = journal.archive.data[app.year].length - 1;
		}
		contents[currentLoaded].index = currentLoaded;
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
				currentList.html(journal.archive.data[app.year][currentLoaded], lastTime);
				// Track the index of this data
				lastQualifiedLoaded = currentLoaded;
				// Update other information
				++app.displayedNum;
				app.displayedChars += contents[currentLoaded].text.chars;
				app.displayedLines += contents[currentLoaded].text.lines;
				if (contents[currentLoaded].time.end) {
					var timeDelta = (contents[currentLoaded].time.end - contents[currentLoaded].time.start) / 60000;
					if (!isNaN(timeDelta)) {
						app.displayedTime += timeDelta;
					}
				}
				$("#search-result").hide().fadeIn(500);
				$("#total-displayed").text(app.displayedNum);
				$("#total-char").text(app.displayedChars);
				$("#total-line").text(app.displayedLines);
				$("#total-time").text(app.displayedTime);
				// Find the qualified entry, break the loop if scrollbar is not visible yet
				if ($("#list").get(0).scrollHeight == $("#list").height() && ++currentLoaded != journal.total) {
					continue;
				}
				break;
			} else {
				// Not qualified; add an empty list
				this.htmlEmpty();
				// 1) Increment currentLoaded to try to load the next entry candidate
				// 2) Tests if this is the last entry to be loaded. If so, break the circle
				if (++currentLoaded == journal.total) {
					// Break out of the loop
					break;
				}
			}
		}
		// Update loaded contents
		if (++currentLoaded >= journal.total) {
			// Remove load more
			$(".loadmore").remove();
			// Append a sign to indicate all of the entries have been loaded
			$("#list").append("<li><p class=\"separator\"><span>EOF</span></p></li>");
		}
		app.lastQualified = lastQualifiedLoaded;
		app.lastLoaded = currentLoaded;
	},
	/* Checks if this entry satisfies current string filter */
	qualify: function(data, filter) {
		////console.log("Call app.list.qualify(" + data["title"] + ", " + filter + ")");
		// Test if the filter is there
		if (!filter) {
			return true;
		}
		// Clear multiple white spaces
		while (filter.search("  ") != -1) {
			filter = filter.replace("  ", " ");
		}
		/* The elements of all the filter */
		var elements = filter.toLowerCase().split(" ");
		// Iterate for all the elements
		for (var key = 0, len = elements.length; key < len; ++key) {
			var element = elements[key].split("|"),
				found = false;
			console.log("\t\t> Testing " + element);
			// The for-loop will break if any match is found
			for (var subkey in element) {
				if (element.hasOwnProperty(subkey)) {
					// Tag
					var subfound;
					if (element[subkey].charAt(0) === "#") {
						if (data["tags"]) {
							subfound = false;
							var textTagArray = data["tags"].split("|");
							for (tag in textTagArray) {
								if (textTagArray.hasOwnProperty(tag)) {
									if (textTagArray[tag] == element[subkey].substr(1)) {
										subfound = true;
										break;
									}
								}
							}
							if (subfound) {
								////console.log("\t- Tags Found!");
								// Found
								break;
							}
						}

					} else if (element[subkey].charAt(0) === "%") {
						////console.log("\t- Test type");
						// Type
						subfound = false;
						var typeArray = app.tag().content(data["attachments"]),
							type = element[subkey].substr(1);
						for (var i = 0; i !== typeArray.length; ++i) {
							if (type == typeArray[i]) {
								subfound = true;
								break;
							}
						}
						if (subfound) {
							////console.log("\t- Type match!");
							// Found
							found = true;
							break;
						}
					} else if (element[subkey].charAt(0) === "@") {
						////console.log("\t- Test time");
						// Time
						var timeStr = element[subkey].substr(1);
						if (this.isInRange(timeStr, data["time"]["created"])) {
							console.log("\t- Time match!");
							// Found
							found = true;
							break;
						}
					} else if (element[subkey].charAt(0) === "+") {
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
					if (found) {
						break;
					}
				}
			}
			// If any one matches in the inner loop, the outer loop will continue until any one doe not match or all the tests have been passed
			if (found) {
				continue;
			}
			console.log("Reach end");
			// No result found
			return false;
		}
		return true;
	},
	/* Returns the date string */
	date: function(time, timeOnly) {
		var date = new Date(time),
			//// year = date.getFullYear(),
			month = date.getMonth(),
			day = date.getDate(),
			hour = date.getHours(),
			minute = date.getMinutes();
		minute = minute < 10 ? "0" + minute : minute;
		hour = hour < 10 ? "0" + hour : hour;
		if (!timeOnly) {
			return app.month_array[month] + " " + day + /*", " + year +*/ " " + hour + ":" + minute;
		} else {
			return hour + ":" + minute;
		}
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
		if (data.time.end) {
			data.datetime += " - " + this.date(data.time.end, 1);
		}
		// Separator
		data.month = this.isInSameMonth(createTime, lastTime);
		// Get the attached data
		data.attached = this.attached(data.attachments);
		var item = $(app.itemView(data));
		// The event when clicking the list
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
			$("#list ul li:nth-child(" + (app.currentDisplayed + 1) + ") a").removeAttr("style");
			// Highlight the data that is now displayed
			$(this).css("background", "#aaa").css("color", "#fff");
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
			////var thumbProperties = (width && height) ? app.util.crop(width, height, 160) : {},
			// Manual data
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
	attached: function(contentFlag) { // [d, h]
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
				if (isNaN(month) || isNaN(year)) {
					// Parse failed
					return false;
				}
				// Return the result
				return (date.getYear() % 100 == year && date.getMonth() + 1 == month);
			} else if (singleTime.length == 6) {
				// mmddyy
				var month = parseInt(singleTime.substr(0, 2)),
					day = parseInt(singleTime.substr(2, 2)),
					year = parseInt(singleTime.substr(4, 2));
				if (isNaN(month) || isNaN(day) || isNaN(year)) {
					// Parse failed
					return false;
				}
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
				if (endTime.length == 2) {
					endYear = startYear;
				} else if (endTime.length == 4) {
					endYear = parseInt(endTime.substr(2, 2));
				} else {
					// Invalid length
					return false;
				}
				if (isNaN(startMonth) || isNaN(startYear) || isNaN(endMonth) || isNaN(endYear)) {
					// Parse failed
					return false;
				}
				var month = date.getMonth() + 1,
					year = date.getYear() % 100;
				// Test if the time is in range
				if (month >= startMonth && month <= endMonth && year >= startYear && year <= endYear) {
					return true;
				} else {
					return false;
				}
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
				if (isNaN(startMonth) || isNaN(startDay) || isNaN(startYear) || isNaN(endMonth) || isNaN(endDay) || isNaN(endTime)) {
					// Parse failed
					return false;
				}
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
	/**
	 * Tests if two passed-in parameters have the same months. If not, returns the month of the first parameter.
	 * @param {number} newTime - The newer time, measured by seconds since epoch
	 * @param {number} oldTime - The older time, measured by seconds since epoch
	 * @returns {number} - The month of `newTime` if two time differs, -1 if same
	 */
	isInSameMonth: function(newTime, oldTime) {
		var newDate = new Date(newTime),
			newMonth = newDate.getMonth();
		// Just initialized
		if (oldTime === 0) {
			return app.month_array[newMonth];
		}
		var oldDate = new Date(oldTime),
			oldMonth = oldDate.getMonth();
		return oldMonth === newMonth ? -1 : app.month_array[newMonth];
	}
};
/**
 * Display the detail of the data at current index
 */
app.detail = function() {
	var dataClip = journal.archive.data[app.year][app.currentDisplayed];
	if (!dataClip.processed) {
		dataClip.chars = dataClip.text.chars + " Chars";
		dataClip.lines = dataClip.text.lines + " Lines";
		dataClip.contents = this.text(dataClip.text.body);
		if (dataClip.weblink) {
			this.thumb(dataClip, "weblink", 50, 50);
		}
		if (dataClip.book) {
			this.thumb(dataClip, "book", 50, 70);
			for (var i = 0; i !== dataClip["book"].length; ++i) {
				getCoverPhoto("#detail .book:eq(" + i + ") ", dataClip.book[i].author + " " + dataClip.book[i].title, false, "book");
			}
		}
		if (dataClip.music) {
			this.thumb(dataClip, "music", 50, 50);
			for (var i = 0; i !== dataClip["music"].length; ++i) {
				getCoverPhoto("#detail .music:eq(" + i + ") ", dataClip.music[i].author + " " + dataClip.music[i].title);
			}
		}
		if (dataClip.movie) {
			this.thumb(dataClip, "movie", 50, 70);
			for (var i = 0; i !== dataClip["movie"].length; ++i) {
				getCoverPhoto("#detail .movie:eq(" + i + ") ", dataClip.movie[i].author + " " + dataClip.movie[i].title, false, "movie");
			}
		}
		if (dataClip.tags) {
			// Process icontags if applicable
			var tags = app.tag().separate(dataClip.tags);
			dataClip.iconTags = tags.iconTags;
			dataClip.textTags = tags.textTags;
		}
		// To avoid undefined error in _.template
		var elements = "video weblink book music movie images voice place textTags iconTags".split(" ");
		for (var i = 0, len = elements.length; i < len; ++i) {
			if (dataClip[elements[i]] == undefined) {
				dataClip[elements[i]] = undefined;
			}
		}
		// Set the read status of the clip to read
		dataClip.processed = 1;
	}
	var l = $(app.detailView(dataClip));
	// !!!!!HIDE THE CONTENT LISTS!!!!
	app.cDetail.css("display", "inline-block").html(l);
	app.app.addClass("detail-view");
	// Hide center if no images available
	if (!dataClip["images"]) {
		$(".center").hide();
	}
	// Back button
	$(".btn-back", app.cDetail).on("click", function() {
		this.hideDetail();
	});
	// Click to load the photos
	$(".center").on("click", function() {
		var data = journal.archive.data[app.year][app.currentDisplayed];
		if (data["images"]) {
			for (var key = 0; key != data["images"].length; ++key) {
				var file = data["images"][key].fileName;
				if (journal.archive.map[file]) {
					$(".upper").append("<a href=\"" + journal.archive.map[file]["url"] + "\"><span></span><img src=\"" + journal.archive.map[file]["url"] + "\"></a>");
				} else {
					animation.error(log.FILE_NOT_LOADED + file + log.DOWNLOAD_PROMPT);
				}
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
			app.photos = new app.PhotoViewer(photos.find(" > img").clone());
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
		var tag = app.tag().getValueByHtml(this.className);
		if (tag != "") {
			app.load("#" + tag);
		}
	});
	////$(window).on("keyup.detail-key", function(n) {
	////	if (n.keyCode == 8) {
	////		$(".btn-back", app.cDetail).trigger("click");
	////	}
	////});
	// Add online media url to the classes
	var eachOp = function() {
		var className = $(this).attr("class");
		if (journal.archive.map[className]) {
			$(this).attr("href", journal.archive.map[className]["url"]).removeAttr("class");
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
	animation.testCacheIcons();
	animation.testSub("#add");
	return dataClip;
};
app.detail.prototype = {
	text: function(rawText) { // [c]
		// Processes spacial characters
		rawText = this.htmlSpacialChars(rawText);
		// Replace all manual lines to a horizontal line
		rawText = rawText.replace(/\t\t[*]\t[*]\t[*]/g, "<hr>");
		// Replace all manual tabs to real tabs
		rawText = rawText.replace(/\r\n\t\t/g, "</p><p class=\"t2\">");
		rawText = rawText.replace(/\r\n\t/g, "</p><p class=\"t1\">");
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
			thumbClip = thumbClip[0]; // [k]
			// Invalid data
			if (!thumbClip) {
				return false;
			}
			////var fileData = thumbClip.data, // [j]
			////styleArray = (fileData.width && fileData.height) ? app.util.crop(fileData.width, fileData.height, width, height) : {},
			// Manual input
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
	hideDetail: function() {
		// !!!!!HIDE THE CONTENT LISTS!!!!
		$("#edit-this, #delete").addClass("hidden");
		animation.testSub("#add");
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
			if (styleArray.hasOwnProperty(i)) {
				c.push(i.replace(/([A-Z])/, "-$1").toLowerCase() + ":" + (typeof styleArray[i] == "number" ? styleArray[i] + "px" : styleArray[i]));
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
	 * When adding a new element here, please make sure that
	 * iconVal is also updated.				
	 * The element added here will be presented as an icon
	 ************************************************************/
	var icons = [
			{
				name: "clear",
				value: 1,
				html: "w01"
			}, {
				name: "overcast",
				value: 2,
				html: "w02"
			}, {
				name: "raining",
				value: 4,
				html: "w03"
			}, {
				name: "snowing",
				value: 8,
				html: "w04"
			}, {
				name: "thundering",
				value: 16,
				html: "w05"
			}, {
				name: "windy",
				value: 32,
				html: "w06"
			}, {
				name: "happy",
				value: 1024,
				html: "e01"
			}, {
				name: "notbad",
				value: 2048,
				html: "e02"
			}, {
				name: "surprised",
				value: 4096,
				html: "e03"
			}, {
				name: "sad",
				value: 8192,
				html: "e04"
			}, {
				name: "angry",
				value: 16384,
				html: "e05"
			}, {
				name: "journal",
				value: 32768,
				html: "c01"
			}, {
				name: "thoughts",
				value: 65536,
				html: "c02"
			}, {
				name: "ingress",
				value: 131072,
				html: "c03"
			}, {
				name: "minecraft",
				value: 262144,
				html: "c04"
			}, {
				name: "dream",
				value: 524288,
				html: "c05"
			}, {
				name: "code",
				value: 1048576,
				html: "c06"
			}, {
				name: "letter",
				value: 2097152,
				html: "c07"
			}, {
				name: "handwriting",
				value: 4194304,
				html: "c08"
			}, {
				name: "friendship",
				value: 16777216,
				html: "c10"
			}, {
				name: "relationship",
				value: 33554432,
				html: "s01"
			}, {
				name: "star",
				value: 67108864,
				html: "s02"
			}, {
				name: "food",
				value: 134217728,
				html: "s03"
			}, {
				name: "leisure",
				value: 268435456,
				html: "s04"
			}, {
				name: "info",
				value: 536870912,
				html: "s05"
			}, {
				name: "baby",
				value: 1073741824,
				html: "s06"
			}, {
				name: "fun",
				value: 2147483648,
				html: "s07"
			}, {
				name: "travel",
				value: 4294967296,
				html: "s08"
			}, {
				name: "health",
				value: 8589934592,
				html: "s09"
			}, {
				name: "outfit",
				value: 17179869184,
				html: "s10"
			}, {
				name: "shopping",
				value: 34359738368,
				html: "s11"
			}, {
				name: "pets",
				value: 68719476736,
				html: "s12"
			}, {
				name: "work",
				value: 137438953472,
				html: "s13"
			}, {
				name: "sports",
				value: 274877906944,
				html: "s14"
			}, {
				name: "cook",
				value: 549755813888,
				html: "s15"
			}, {
				name: "makeup",
				value: 1099511627776,
				html: "s16"
			}, {
				name: "home",
				value: 2199023255552,
				html: "s17"
			}, {
				name: "car",
				value: 4398046511104,
				html: "s18"
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
		content: function(contentFlag) { // [Q, S]
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
		getValueByName: function(name) {
			return this.translate(name.toLowerCase(), "name", "value");
		},
		getHtmlByName: function(name) {
			return this.translate(name.toLowerCase(), "name", "html");
		},
		getNameByHtml: function(html) {
			return this.translate(html.toLowerCase(), "html", "name");
		},
		getIconsInHtml: function() {
			return this.getAll("html");
		},
		getIconsInName: function() {
			return this.getAll("name");
		},
		/**
		 * Gets the list of all the type specfied
		 * @param {string} type - The specified type
		 * @returns {object} The list of all the available tag icons. Empty if type is invalid
		 */
		getAll: function(type) {
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
		 * @param {string} source - The source language of the data ("value", "html", "name")
		 * @param {string} target - The target language of the data ("value", "html", "name")
		 * @returns {string} The result if and only if found, empty string otherwise
		 */
		translate: function(data, source, target) {
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
		 * Separates a string representation of a list of tags into icontags and texttags
		 * @param {string} tags - The tag string, separated by "|"
		 * @returns {object} The object with keys of `icontags` and `texttags`
		 */
		separate: function(tags) {
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
		or: function(typesVal, typeVal) {
			var newVal = this.get(typesVal).split("");
			newVal[this.get(typeVal).indexOf("1")] = "1";
			return parseInt(newVal.join(""), 2);
		},
		andnot: function(typesVal, typeVal) {
			var newVal = this.get(typesVal).split("");
			newVal[this.get(typeVal).indexOf("1")] = "0";
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
	this.callback = d || function() {
	};
	this.make();
	this.init();
};
app.PhotoViewer.prototype = {
	make: function() {
		var f = this.list;
		if (f.length > 1) {
			var c = $("<ul>");
		}
		var d = $("<ul class=\"swipe-wrap\">");
		f.each(function(j) {
			$("<li>").html(this).appendTo(d);
			if (!!c) {
				$("<li>").html("<a href=\"#" + j + "\">" + j + "</a>").appendTo(c);
			}
		});
		var e = $("<div class=\"wrap swipe\">").html(d);
		var g = $("<div class=\"control\">");
		g.append("<input type=\"button\" value=\"Close\" class=\"btn-close\"/>");
		////if (f.length > 1) {
		////	g.append('<input type="button" value="Prev" class="btn-prev"/>');
		////	g.append('<input type="button" value="Next" class="btn-next"/>');
		////}
		if (!!c) {
			c.css("width", f.length * 17).wrap("<div class=\"pagination\"/>").parent().appendTo(g);
		}
		e.append(g);
		e.append("<div class=\"background\"></div>");
		var h = $("<div id=\"photoviewer\">").html(e);
		h.appendTo("body");
	},
	init: function() {
		var c = this;
		this.viewer = $("body > div#photoviewer");
	},
	bind: function() {
		if (!!this._bind) {
			this.swipe.setup();
			return false;
		}
		var j = this;
		var g = this.viewer = $("body > div#photoviewer");
		this.pagination = $("div.pagination>ul>li", this.viewer);
		var c = g.find(" > div.swipe");
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

/**
 * Initializes an audio player within the selector provided
 * @param {String} selector - The selector of the element to embed audio player, in jQuery style
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
	$("#play-media").html("&#xf04b").removeClass("play").attr("onclick", "app.audioPlayer.play()");
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
			$("#music-position").html(app.audioPlayer.formatTime(music.currentTime));
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
		window.addEventListener("mousemove", app.audioPlayer.moveplayHead, true);
		music.removeEventListener("timeupdate", app.audioPlayer.timeUpdate, false);
	};
	app.audioPlayer.mouseUp = function(e) {
		if (app.audioPlayer.onplayhead) {
			app.audioPlayer.moveplayHead(e);
			window.removeEventListener("mousemove", app.audioPlayer.moveplayHead, true);
			// returns click as decimal (.77) of the total timelineWidth
			var clickPercent = (e.pageX - timeline.getBoundingClientRect().left) / timelineWidth;
			music.currentTime = duration * clickPercent;
			music.addEventListener("timeupdate", app.audioPlayer.timeUpdate, false);
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
	app.audioPlayer.music.addEventListener("timeupdate", app.audioPlayer.timeUpdate, false);
	app.audioPlayer.music.addEventListener("loadedmetadata", app.audioPlayer.loadedData);

	//Makes timeline clickable
	app.audioPlayer.timeline.addEventListener("click", app.audioPlayer.click, false);
	// Makes playhead draggable 
	app.audioPlayer.playhead.addEventListener("mousedown", app.audioPlayer.mouseDown, false);
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
 * @param {String} selector - The selector of the element to embed audio player, in jQuery style
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
		app.audioPlayer.music.removeEventListener("timeupdate", app.audioPlayer.timeUpdate);
		app.audioPlayer.music.removeEventListener("loadedmetadata", app.audioPlayer.loadedData);
	}
	if (app.audioPlayer.timeline) {
		app.audioPlayer.timeline.removeEventListener("click", app.audioPlayer.click);
	}
	if (app.audioPlayer.playhead) {
		app.audioPlayer.playhead.removeEventListener("mousedown", app.audioPlayer.mouseDown);
	}
	window.removeEventListener("mouseup", app.audioPlayer.mouseUp);
	animation.hideMenu("media");
};
/**
 * Initializes a video player within the selector provided
 * @param {String} selector - The selector of the element to embed video player, in jQuery style
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
	$("#play-media").html("&#xf04b").removeClass("play").attr("onclick", "app.videoPlayer.play()");
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
			$("#video-position").html(app.videoPlayer.formatTime(video.currentTime));
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
		window.addEventListener("mousemove", app.videoPlayer.moveplayHead, true);
		video.removeEventListener("timeupdate", app.videoPlayer.timeUpdate, false);
	};
	app.videoPlayer.mouseUp = function(e) {
		if (app.videoPlayer.onplayhead) {
			app.videoPlayer.moveplayHead(e);
			window.removeEventListener("mousemove", app.videoPlayer.moveplayHead, true);
			// returns click as decimal (.77) of the total timelineWidth
			var clickPercent = (e.pageX - timeline.getBoundingClientRect().left) / timelineWidth;
			video.currentTime = duration * clickPercent;
			video.addEventListener("timeupdate", app.videoPlayer.timeUpdate, false);
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
		$("#video-position, #video-length, #timeline").fadeIn().css("display", "inline-block");
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
	app.videoPlayer.video.addEventListener("timeupdate", app.videoPlayer.timeUpdate, false);
	app.videoPlayer.video.addEventListener("loadedmetadata", app.videoPlayer.loadedData);

	//Makes timeline clickable
	app.videoPlayer.timeline.addEventListener("click", app.videoPlayer.click, false);
	// Makes playhead draggable 
	app.videoPlayer.playhead.addEventListener("mousedown", app.videoPlayer.mouseDown, false);
	window.addEventListener("mouseup", app.videoPlayer.mouseUp, false);
};
/**
 * Toggles the fullscreen of the videoplayer.
 * This function will determine if the video is fullscreen by a static variable inside function
 */
app.videoPlayer.toggle = function() {
	if (this.toggle.isFullScreen) {
		// Switch to window mode
		if (this.toggle.windowSelector) {
			$("#video-fullscreen").fadeOut();
			// Move child
			$(this.toggle.windowSelector).append($("#videoplayer").css("height", "450px"));
			// Change the icon
			$("#toggle-media").html("&#xf065");
		} else {
			// Invalid call
			animation.error("Program error: no app.videoPlayer.toggle.windowSelector");
		}
		this.toggle.isFullScreen = false;
	} else {
		// Go fullscreen
		this.toggle.windowSelector = $("#videoplayer").parent();
		// Move child
		$("#video-fullscreen").fadeIn().append($("#videoplayer").css("height", "-webkit-calc(100% - 25px)"));
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
 * @param {String} selector - The selector of the element to embed video player, in jQuery style
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
		app.videoPlayer.video.removeEventListener("timeupdate", app.videoPlayer.timeUpdate);
		app.videoPlayer.video.removeEventListener("loadedmetadata", app.videoPlayer.loadedData);
	}
	if (app.videoPlayer.timeline) {
		app.videoPlayer.timeline.removeEventListener("click", app.videoPlayer.click);
	}
	if (app.videoPlayer.playhead) {
		app.videoPlayer.playhead.removeEventListener("mousedown", app.videoPlayer.mouseDown);
	}
	window.removeEventListener("mouseup", app.videoPlayer.mouseUp);
	animation.hideMenu("media");
	$("#toggle-media").html("&#xf065");
	$("#video-fullscreen").fadeOut();
	this.toggle.isFullScreen = false;
	this.toggle.windowSelector = undefined;
};
/**
 * Checks if there are any lost media (i.e. the media not connected to any entry), and store that data in app.lostMedia
 * There are two kinds of lost media. One can be the one in the /resource but not connected to any entry. The other can be the media that claimed to be existing in /resource but in fact it does not
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
	for (var i = 0, length = journal.archive.data[app.year].length; i !== length; ++i) {
		var dataClip = journal.archive.data[app.year][i];
		// Iterate to find all the media in different groups
		for (var j = 0; j !== groups.length; ++j) {
			if (dataClip[groups[j]]) {
				// Iterate to process all the media within the same group
				for (var k = 0; k < dataClip[groups[j]].length; ++k) {
					var index = allMedia.indexOf(dataClip[groups[j]][k]["fileName"]);
					if (index === -1) {
						// Element existed in the entry is not found in /resource
						++undefMedia;
						dataClip[groups[j]].splice(k, 1);
						--k;
					} else {
						// Remove this element from allMedia because this file is matched
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
}
/**
 * Cleans the resource folder and moves those files that are not collected back to their date folder according to the file name, after app.checkResource() is run
 */
app.cleanResource = function() {
	// Test if the required variable is needed
	if (app.lostMedia.length === 0) {
		animation.error(log.MEDIA_CLEAN_NO_DATA);
	} else {
		animation.log(log.MEDIA_CLEAN_START, 1);
		// Move to their folder according to their names
		getTokenCallback(function(token) {
			// Finds all the available folder names
			$.ajax({
				type: "GET",
				url: getDataUrlHeader() + ":/children?select=name&top=500&access_token=" + token
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
					// Get the first six letters. Assume them to be the folder name
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
						url = getResourceUrlHeader(true) + "/" + encodeURI(lostMedia[i]) + "/" + "?select=id,@content.downloadUrl&access_token=" + token;
					}
					// Trying to send to the folder
					$.ajax({
						type: "PATCH",
						url: url,
						contentType: "application/json",
						data: JSON.stringify(requestJson)
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
								animation.log(log.MEDIA_CLEAN_FINISHED, -1);
							}
						});
				}
			})
			.fail(function(xhr, status, error) {
				animation.error(log.MEDIA_CLEAN_GET_FOLDERS_FAIL + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
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
	app.layout();
	app.init();
	archive.itemView = _.template($("#archive-view").html());
	archive.detailView = _.template($("#archive-detail-view").html());
});
//})(window, jQuery);