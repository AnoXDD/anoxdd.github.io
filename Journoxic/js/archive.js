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
			url: "https://api.onedrive.com/v1.0/drive/special/approot:/core:/children?select=id,name,size,createdDateTime,lastModifiedDateTime,@content.downloadUrl&top=500&orderby=lastModifiedDateTime%20desc&access_token=" + token
		})
			.done(function(data, status, xhr) {
				if (data["@odata.nextLink"]) {
					animation.warn(log.ARCHIVE_TOO_MANY);
				}
				animation.log(log.ARCHIVE_END, -1);
				var itemList = data["value"];
				for (var key = 0, len = itemList.length; key !== len; ++key) {
					var name = itemList[key]["name"];
					// Filter the .js files only, and data.js shouldn't be included
					if ((name.substring(0, 4) === "data" || name.substring(0, 5) === "_data") && name.substring(name.length - 3) === ".js" && name !== "data.js") {
						var dataElement = {
							name: name,
							id: itemList[key]["id"],
							url: itemList[key]["@content.downloadUrl"],
							size: itemList[key]["size"],
							created: Date.parse(itemList[key]["createdDateTime"]),
							modified: Date.parse(itemList[key]["lastModifiedDateTime"]),
							selected: false,
							processed: false,
							protect: false
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
				$("#search-new").fadeOut();
				// Bind click event
				$("#comm").click(archive.quit);
				$("#show-menu").click(archive.quit);
				archive.load();
			})
			.fail(function(xhr, status, error) {
				animation.error(log.FILES_NOT_FOUND + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
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
	 * Load one qualified entry of the contents from the data until the scrollbar appears
	 */
	load: function() {
		////console.log("Call archive.list.load(" + filter + ")");
		var contents = archive.data,
			currentLoaded = archive.lastLoaded;
		// Adjust if the number of contents needed to be loaded is more than all the available contents
		if (archive.lastLoaded >= archive.data.length) {
			currentLoaded = archive.lastLoaded = archive.data.length - 1;
		}
		// Load the contents
		contents[currentLoaded].index = currentLoaded;
		// Test if current entry satisfies the filter
		while (true) {
			var data = archive.data[currentLoaded];
			archive.data[currentLoaded]["created"] = edit.getMyTime(data["created"]);
			archive.data[currentLoaded]["modified"] = edit.getMyTime(data["modified"]);
			this.html(data);
			++currentLoaded;
			// Find the qualified entry, break the loop if scrollbar is not visible yet
			if ($("#list").get(0).scrollHeight == $("#list").height() && currentLoaded < archive.data.length) {
				continue;
			}
			break;
		}
		// Update loaded contents
		if (++currentLoaded >= archive.data.length) {
			// Remove load more
			$(".loadmore").remove();
			// Append a sign to indicate all of the entries have been loaded
			$("#list").append("<li><p class=\"separator\"><span>EOF</span></p></li>");
		}
		archive.lastLoaded = currentLoaded;
	},
	/**
	 * Returns the date string using the seconds from epoch
	 * @param {String} time - The seconds from epoch
	 * @param {Boolean} timeOnly - Display only the time (hh:mm)
	 * @returns {String} - The formatted string
	 */
	date: function(time, timeOnly) {
		var date = new Date(time);
		if (isNaN(date.getTime())) {
			return time;
		}
		var year = date.getFullYear(),
			month = date.getMonth(),
			day = date.getDate(),
			hour = date.getHours(),
			minute = date.getMinutes();
		minute = minute < 10 ? "0" + minute : minute;
		hour = hour < 10 ? "0" + hour : hour;
		if (!timeOnly) {
			return app.month_array[month] + " " + day + ", " + year + " " + hour + ":" + minute;
		} else {
			return hour + ":" + minute;
		}
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
			// De-hightlight the data that is displayed
			////console.log(archive.currentDisplayed);
			$("#list ul li:nth-child(" + (archive.currentDisplayed + 1) + ") a").removeClass("display");
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
		}).
			on("contextmenu", function() {
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
		var t = this;
		$.ajax({
			type: "GET",
			url: dataClip["url"]
		}).done(function(data, status, xhr) {
			animation.log(log.CONTENTS_DOWNLOAD_END, -1);
			var contents = JSON.parse(xhr.responseText).slice(0, 50);
			// Convert date
			for (var i = 0; i !== contents.length; ++i) {
				contents[i]["time"]["created"] = edit.getMyTime(contents[i]["time"]["created"]);
				contents[i]["time"]["modified"] = edit.getMyTime(contents[i]["time"]["modified"]);
			}
			dataClip.contents = contents;
			// Set the read status of the clip to read
			dataClip.processed = true;
			var l = $(archive.detailView(dataClip));
			// !!!!!HIDE THE CONTENT LISTS!!!!
			app.cDetail.css("display", "inline-block").html(l);
			app.app.addClass("detail-view");
			$("#detail").fadeIn(500);
			// Back button
			$(".btn-back", app.cDetail).on("click", function() {
				t.hideDetail();
			});
			return dataClip;
		}).fail(function(xhr, status, error) {
			animation.error(log.CONTENTS_DOWNLOAD_TEXT_FAIL + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
		});
	} else {
		try {
			var l = $(archive.detailView(dataClip));
			// !!!!!HIDE THE CONTENT LISTS!!!!
			app.cDetail.css("display", "inline-block").html(l);
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
		return rawText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;");
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
 * Renames the selected files so that the files are protected (cannot be removed unless unlocked) 
 * This function will contact OneDrive server
 * @param {Function} callback - The callback function after the server finishes all the tasks
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
					type: "PATCH",
					url: url,
					contentType: "application/json",
					data: JSON.stringify(requestJson)
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
								for (var j = 0; j !== archive.data.length; ++j) {
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
 * Removes selected archive files to trashcan on OneDrive so that removed files are still recoverable
 * This funciton will contact OneDrive server
 * @param {Function} callback - The callback function after the server finishes all the tasks
 */
archive.remove = function(callback) {
	getTokenCallback(function(token) {
		var total = 0,
			fail = 0,
			processed = 0;
		for (var i = 0; i !== archive.data.length; ++i) {
			if (archive.data[i]["delete"]) {
				if (archive.data[i]["protect"]) {
					// This file is protected, cannot be removed unless de-protect it
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
						url: "https://api.onedrive.com/v1.0/drive/items/" + archive.data[i]["id"] + "?access_token=" + token
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
								animation.log((total - fail) + log.CONTENTS_DOWNLOAD_MEDIA_OF + total + log.ARCHIVE_REMOVE_END, -1);
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
 * This function simply toggles the class of each list on entry, whose name is given by the parameter
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
		// Unbind events
		$("#show-menu").off("click");
		// Reshow the menu
		$("#refresh-media").trigger("click");
		$("#search-new").fadeIn();
	}
}