/* Defines the archive operation */

window.archive = {};

archive.data = [];
archive.displayId = "";

archive.lastLoaded = 0;
archive.currentDisplayed = -1;

archive.init = function() {
	archive.contents = undefined;
	archive.data = [];
	// Get the data from the server
	getTokenCallback(function(token) {
		animation.log(log.ARCHIVE_START, 1);
		$.ajax({
			type: "GET",
			url: "https://api.onedrive.com/v1.0/drive/special/approot:/core:/children?select=id,name,size,createdDateTime,lastModifiedDateTime,@content.downloadUrl&top=500&access_token=" + token
		}).done(function(data, status, xhr) {
			if (data["@odata.nextLink"]) {
				animation.warning(log.ARCHIVE_TOO_MANY);
			}
			animation.log(log.ARCHIVE_END, -1);
			var itemList = data["value"];
			for (var key = 0, len = itemList.length; key !== len; ++key) {
				var name = itemList[key]["name"];
				// Filter the js.file only
				if (name.substring(0, 4) === "data" && name.substring(name.length - 3) === ".js") {
					var dataElement = {
						name: name,
						id: itemList[key]["id"],
						url: itemList[key]["@content.downloadUrl"],
						size: itemList[key]["size"],
						created: Date.parse(itemList[key]["createdDateTime"]),
						modified: Date.parse(itemList[key]["lastModifiedDateTime"]),
						selected: false,
						processed: false
					};
					archive.data.push(dataElement);
				}
			}
			app.audioPlayer.quit();
			// Clean both list and detail
			$("#list").empty();
			$("#detail").empty();
			// Display the result
			archive.lastLoaded = 0;
			headerShowMenu("archive");
			archive.load();
		}).fail(function(xhr, status, error) {
			animation.error(log.FILES_NOT_FOUND + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
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
			data["created"] = this.date(data["created"]);
			data["modified"] = this.date(data["modified"]);
			this.html(data);
			++currentLoaded;
			// Find the qualified entry, break the loop if scrollbar is not visible yet
			if ($("#list").get(0).scrollHeight == $("#list").height() && ++currentLoaded != journal.total) {
				continue;
			}
			break;
		}
		// Update loaded contents
		if (++currentLoaded >= journal.total) {
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
			$("#list ul li:nth-child(" + (archive.currentDisplayed + 1) + ") a").removeAttr("style");
			// Highlight the data that is now displayed
			$(this).css("background", "#5d5d5d").css("color", "#fff");
			// Update the index of the list to be displayed
			var flag = (archive.currentDisplayed == $(this).parent().index());
			if (!flag) {
				archive.currentDisplayed = $(this).parent().index();
				$("#detail").hide().fadeIn(500);
				archive.view = new archive.detail();
			}
			return false;
		}).
			on("contextmenu", function() {
				// Right click to select the archive list
				$(this).toggleClass("change");
				archive.data[$(this).parent().index()]["change"] = !archive.data[$(this).parent().index()]["change"];
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
			dataClip.contents = JSON.parse(xhr.responseText).slice(0, 50);
			//dataClip.contents = JSON.parse(t.text(dataClip.contents));
			// Set the read status of the clip to read
			dataClip.processed = true;
			var l = $(archive.detailView(dataClip));
			// !!!!!HIDE THE CONTENT LISTS!!!!
			app.cDetail.css("display", "inline-block").html(l);
			app.app.addClass("detail-view");
			// Hide center if no images available
			if (!dataClip["images"]) {
				$(".center").hide();
			}
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
			var l = $(archive.detailView(JSON.parse(dataClip)));
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
			return dataClip;
		} catch (e) {
			animation.error(log.ARCHIVE_INVALID_JSON);
		}
	}
};
archive.detail.prototype = {
	text: function(rawText) {
		// Processes spacial characters
		rawText = this.htmlSpacialChars(rawText);
		// Replace all double lines to a new character
		rawText = rawText.replace(/\n(|\r)\n(|\r)/ig, "</p></br><p>");
		// Replace all other single lines to a new line
		rawText = rawText.replace(/\n(|\r)/ig, "</p><p>");
		return rawText;
	},
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
 * Reverses selection of all archive lists
 */
archive.reverse = function() {
	$("#list .archive").each(function() {
		$(this).toggleClass("change");
	});
	for (var i = 0; i !== archive.data.length; ++i) {
		archive.data[i]["change"] = !archive.data[i]["change"];
	}
}

/**
 * Clears the selection of all archive lists
 */
archive.clear = function() {
	$("#list .archive").each(function() {
		$(this).removeClass("change");
	});
	for (var i = 0; i !== archive.data.length; ++i) {
		archive.data[i]["change"] = false;
	}
}

archive.quit = function() {
	$("#list").empty();
	$("#detail").empty();
}