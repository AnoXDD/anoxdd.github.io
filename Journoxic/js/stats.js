/**
 * The file to handle stats display for this year
 */

window.stats = {};

/** The entries to be searched, with its result */
stats.entries = {};
/** The options for searching, will implement setup page later */
stats.options = {
	/** Both `startDay` and `endDay` are measured in the amount of days since the first day of the year (the value for the first day is 0). The `endDay` will not be included */
	startDay: 0,
	endDay: 366,
	// Todo add a calendar to display
	isIncludingTitles: true,
	isIncludingTags: false
};
/** A list to hold all the human-readable date from the first day to the last day for `app.year` */
stats.eachDay = [];
/**
 * A list to hold all the values for each year
 */
stats.monthVal = [];
stats.isLeapYear = false;

/** Set to a number not equal to -1 to indicate the entry that is currently editing */
stats.isEditing = -1;

/**
 * Initializes the stats panel 
 * @returns {} 
 */
stats.init = function() {
	// Initialize variables
	stats.result = [];
	stats.isLeapYear = new Date(app.year, 1, 29).getMonth() === 1;
	if (stats.isLeapYear) {
		// This is a leap year
		stats.monthVal = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	} else {
		stats.monthVal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	}
	for (var i = 1; ; ++i) {
		var date = new Date(app.year, 0, i);
		if (date.getFullYear() !== app.year) {
			// New day, stop executing
			break;
		} else {
			var month = app.month_array[date.getMonth()],
				day = date.getDate();
			stats.eachDay.push(month + " " + day);
		}
	}
	// Animation for initialization
	$("#query").fadeOut();
	$("#stats-query").fadeIn();
	// Empty this input box
	$("#stats-query").val("");
	stats.bindInput("#stats-query");
	stats.initTable();
	// Bind click to select for `.checkbox`
	$("#stats-options li.checkbox").each(function() {
		$(this).click(function() {
			$(this).toggleClass("checked");
			var name = $(this).attr("encode");
			stats.options[name] = !stats.options[name];
		});
	});
	$("#contents").fadeOut(400, function() {
		// Total count for everything
		$("#search-result").each(function() {
			$(this).addClass("stats");
		});
		$("#stats-pane").fadeIn();
	});
}

/**
 * Initializes or resets the table for display
 */
stats.initTable = function() {
	stats.removeAll();
	// The first line
	$("#stats-table").html("<tbody><tr><th></th><th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Mar</th><th>Jun</th><th>Jul</th><th>Aug</th><th>Sep</th><th>Oct</th><th>Nov</th><th>Dec</th></tr></tbody>");
	$("tbody").addClass("fadein");
}

/**
 * Quits the stats panel
 * @returns {} 
 */
stats.quit = function() {
	stats.removeAll();
	// Animation to recover what it was
	$("#query").fadeIn();
	$("#stats-query").fadeOut();
	// Unbind click to toggle checkbox
	$("#stats-options li.checkbox").each(function() {
		$(this).unbind("click");
	});
	// Unbind enter to search for #stats-query
	$("#stats-pane").fadeOut(400, function() {
		$("#contents").fadeIn();
	});
}

/**
 * Adds an entry to the stats chart. If the entries have multiple keywords, separate by `|`
 * @param {string} entry - An entry string of keywords separated by `|`
 * @param {number} overwriteNum (Optional) - The index of the table row to be overwriten, started with 1
 */
stats.addEntry = function(entry, overwriteNum) {
	/* Iterator */
	var i;
	// Empty or create it anyway
	var result = stats.getResult(entry);
	stats.entries[entry] = result;
	// Process each month's list
	var monthCount = new Array(12),
		day = 0;
	for (i = 0; i !== stats.monthVal.length; ++i) {
		monthCount[i] = 0;
		for (var j = 0; j !== stats.monthVal[i]; ++j, ++day) {
			monthCount[i] += result[day];
		}
	}
	// Show the html result
	var htmlContent = "<tr><td><input type='text' class='edit' autocomplete='off' onclick='this.select' value='" + entry + "' /></td>";
	for (i = 0; i !== monthCount.length; ++i) {
		htmlContent += "<td>" + monthCount[i] + "</td>";
	}
	htmlContent += "</tr>";
	if (overwriteNum) {
		// Overwrite a content
		$("tbody:nth-child(" + overwriteNum + ")").html(htmlContent).addClass("fadein").on("contextmenu", function() {
			// Right click to remove it
			$(this).slideUp(200, function() {
				$(this).remove();
			});
			return false;
		});
	} else {
		// Append to the end of the table
		$(htmlContent).appendTo("tbody").addClass("fadein").on("contextmenu", function() {
			// Right click to remove it
			$(this).slideUp(200, function() {
				$(this).remove();
			});
			return false;
		});
	}
	var index = overwriteNum || $("tr").length;
	// Add press return to change the value
	stats.bindInput("tbody:nth-child(" + index + ") input");
	// Right click to remove this entry
}

/**
 * Binds the selector so that what inside can (possibly and hopefully) be added to the table
 * @param {string} selector - The selector to bind this event
 */
stats.bindInput = function(selector) {
	$(selector).bind("keyup", "return", function() {
		var newEntry = $(selector).val();
		newEntry = stats.simplifyEntry(newEntry);
		if (newEntry.length === 0) {
			// Empty string, do nothing
			$(selector).effect("highlight", { color: "#000" });
			// logs.STATS_ENTRY_EMPTY_STRING
			animation.error("MISSING ERROR");
			return;
		}
		if (stats.entries[newEntry]) {
			// Already there
			$(selector).effect("highlight", { color: "#000" });
			// logs.STATS_ENTRY_ALREADY_EXIST
			animation.error("MISSING ERROR");
		} else {
			// This is a valid entry
			$(selector).effect("highlight", { color: "#ddd" });
			// Add a new entry
			stats.addEntry(newEntry);
		}
	});
}

/**
 * Processes an entry to its simplified form (e.g. foo|||||bar goes to foo|bar) and returns it. 
 * This function does not split this string.
 * @param {string} str - The entry to be processed
 * @returns {string} - The simplified entry
 */
stats.simplifyEntry = function(str) {
	var group = str.split("|"),
		ret = [];
	for (var i = 0; i !== group.length; ++i) {
		if (group[i].length > 0) {
			ret.push(group[i]);
		}
	}
	return ret.join("|");
}

/**
 * Gets the result of this entry search, of 12 sizes, which refers to 12 months
 * @param {string} entry - An entry string of keywords separated by `|`
 * @returns {object} - A list of 12 elements, refer to 12 months, each of which has at most 31 elements refer to each day in the month
 */
stats.getResult = function(entry) {
	var keywords = entry.split("|"),
		result;
	if (stats.isLeapYear) {
		// This is a leap year
		result = new Array(366);
	} else {
		result = new Array(365);
	}
	for (var i = 0; i !== journal.archive.data[app.year].length; ++i) {
		// The string result to search
		var strings = [],
			data = journal.archive.data[app.year][i],
			date = new Date(data["time"]["created"]),
			firstDay = new Date(app.year, 0, 1),
			day = Math.floor((new Date(date) - firstDay) / 86400000);
		if (day >= stats.options.startDay && day <= stats.options.endDay) {
			strings.push(data["text"]["body"]);
			if (this.options.isIncludingTags) {
				strings.push(data["tags"]);
			}
			if (this.options.isIncludingTitles) {
				strings.push(data["title"]);
			}
			// The time is in range
			for (var j = 0; j !== strings.length; ++j) {
				// Iterate strings
				var string = strings[j];
				for (var k = 0; k !== keywords.length; ++k) {
					// Iterate keywords
					var keyword = keywords[k];
					if (!result[day]) {
						result[day] = 0;
					}
					// Add the counts of the keyword
					result[day] += (string.match(new RegExp(keyword, "g")) || []).
						length;
				}
			}
		}
	}
	return result;
}

/**
 * Removes all the entries on the chart to reset the chart 
 */
stats.removeAll = function() {
	$("#stats-table").fadeOut().remove();
}

/**
 * Toggles to show the analysis graph
 * Todo add a parameter to determine whether to display as each day or each month
 */
stats.toggleGraph = function() {
	if ($("#graph").css("display", "none")) {
		stats.showGraph();
	} else {
		stats.hideGraph();
	}
}

/**
 * Shows the analysis graph
 */
stats.showGraph = function() {
	var series = [];
	for (var i = 0, entries = Object.keys(stats.entries); i !== entries.length; ++i) {
		series.push({
			name: entries[i],
			data: stats.entries[name]
		});
	}
	var data = {
		title: {
			text: "Stats for this year",
			x: -20 //center
		},
		subtitle: {
			text: "Collected from " + $("#total-char").html() + " in " + $("#total-entry").html() + " entries",
			x: -20
		},
		xAxis: {
			categories: stats.eachDay
		},
		yAxis: {
			plotLines: [
				{
					value: 0,
					width: 1,
					color: "#808080"
				}
			]
		},
		tooltip: {
			valueSuffix: " time(s)"
		},
		legend: {
			layout: "vertical",
			align: "right",
			verticalAlign: "middle",
			borderWidth: 0
		},
		series: series
	};
	$("#graph").fadeIn().highcharts(data);
};

/**
 * Hides the analysis graph
 */
stats.hideGraph = function() {
	$("#graph").fadeOut(function() {
		$(this).remove();
	});
}

