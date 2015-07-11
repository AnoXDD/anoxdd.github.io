﻿/**
 * The file to handle stats display for this year
 */

window.stats = {};

/**
 * Todo Don't include date in graph that does not have journals
 * 
 */

/** The value before the entry is added */
stats.oldValue = "";
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
stats.isGraphDisplayed = false;

/**
 * Initializes the stats panel 
 */
stats.init = function() {
	// Initialize variables
	stats.result = [];
	stats.isLeapYear = new Date(app.year, 1, 29).getMonth() === 1;
	stats.isGraphDisplayed = false;
	stats.oldValue = "";
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
	$("#stats-query").bind("keyup", "return", function() {
		var newEntry = $(this).val();
		newEntry = stats.simplifyEntry(newEntry);
		if (newEntry.length === 0) {
			// Empty string, do nothing
			$(this).effect("highlight", { color: "#000" });
			animation.error(log.STATS_ENTRY_EMPTY_STRING);
			return;
		}
		if (stats.entries[newEntry]) {
			// Already there
			$(this).effect("highlight", { color: "#000" });
			animation.error(log.STATS_ENTRY_ALREADY_EXIST);
		} else {
			// This is a valid entry
			$(this).effect("highlight", { color: "#ddd" });
			// Add a new entry
			stats.addEntry(newEntry);
			$(this).val("");
			$(this).focus();
		}
		$(this).select();
	});
	stats.initTable();
	animation.showMenuOnly("stats");
	// Bind click to select for `.checkbox`
	$("#stats-options li.checkbox").each(function() {
		$(this).click(function() {
			$(this).toggleClass("checked");
			var name = $(this).attr("encode");
			stats.options[name] = !stats.options[name];
		});
	});
	// Hover to highlight the same column and row
	$("#stats-table").delegate("td", "mouseover mouseleave contextmenu", function(e) {
			if (e.type === "mouseover") {
				$(this).parent().addClass("hover");
				$("tr td:nth-child("+($(this).index() + 1)+")").addClass("hover");
			} else if (e.type === "mouseleave") {
				$(this).parent().removeClass("hover");
				$("tr td:nth-child("+($(this).index() + 1)+")").removeClass("hover");
			} else {
				// Right click
				var key = stats.oldValue || $(this).siblings("input").val("");
				$(this).parent().slideUp(200, function() {
					$(this).remove();
				});
				delete stats.entries[key];
				return false;
			}
		})
		.delegate("input", "focusin focusout keyup", function(e) {
			if (e.type === "focusin") {
				// Record the old value
				stats.oldValue = $(this).val();
			} else if (e.type === "focusout") {
				$(this).val(stats.oldValue);
				stats.oldValue = "";
			} else {
				if (e.keyCode === 13) {
					// Return pressed
					var newEntry = $(this).val();
					newEntry = stats.simplifyEntry(newEntry);
					if (newEntry.length === 0) {
						// Empty string, do nothing
						$(this).effect("highlight", { color: "#000" });
						animation.error(log.STATS_ENTRY_EMPTY_STRING);
						$(this).val(stats.oldValue);
						return;
					}
					if (stats.entries[newEntry]) {
						// Already there
						$(this).effect("highlight", { color: "#000" });
						animation.error(log.STATS_ENTRY_ALREADY_EXIST);
												$(this).val(stats.oldValue);
return;
					} else {
						// This is a valid entry
						$(this).parent().parent().effect("highlight", { color: "#ddd" });
						// Add a new entry
						var index = $(this).parent().parent().index() + 1;
						// Remove the old value
						delete stats.entries[stats.oldValue];
						stats.addEntry(newEntry, index);
					}
					// Update the value
					
				stats.oldValue = newEntry;
				this.blur();
				} else if (e.keyCode === 27) {
					// Esc pressed
				this.blur();
				}
			}
		});
	$("#contents").fadeOut(400, function() {
		// Total count for everything
		$("#search-result").addClass("stats");
		stats.getYearSum();
		$("#stats-pane").fadeIn();
	});
}

/**
 * Initializes or resets the table for display
 */
stats.initTable = function() {
	stats.oldValue = "";
	stats.removeAll();
	// The first line
	$("#stats-table").html("<thead><tr><th>Index</th><th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Mar</th><th>Jun</th><th>Jul</th><th>Aug</th><th>Sep</th><th>Oct</th><th>Nov</th><th>Dec</th><th>Total</th></tr></thead><tbody></tbody>");
	$("tbody").addClass("fadein");
}

/**
 * Quits the stats panel
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
	$("#search-result").removeClass("stats");
	// Unbind hover to highlight the same column and row
	$("#stats-table").undelegate("td").undelegate("input");
	// Unbind enter to search for #stats-query
	$("#stats-pane").fadeOut(400, function() {
		$("#contents").fadeIn();
		animation.showMenuOnly();
		app.refresh();
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
		day = 0,
		sum = 0;
	for (i = 0; i !== stats.monthVal.length; ++i) {
		monthCount[i] = 0;
		for (var j = 0; j !== stats.monthVal[i]; ++j, ++day) {
			if (result[day]) {
				monthCount[i] += result[day];
			}
		}
		// Add to the sum
		sum += monthCount[i];
	}
	// Show the html result
	var htmlContent = "<td><input type='text' class='edit' autocomplete='off' onclick='this.select()' value='" + entry + "' /></td>";
	for (i = 0; i !== monthCount.length; ++i) {
		htmlContent += "<td>" + monthCount[i] + "</td>";
	}
	htmlContent += "<td>" + sum + "</td>";
	if (overwriteNum) {
		// Overwrite a content
		$("tbody tr:nth-child(" + overwriteNum + ") input").parent().parent().html(htmlContent).addClass("fadein");
	} else {
		// Wrap with <tr>
		htmlContent = "<tr>" + htmlContent + "</tr>";
		// Append to the end of the table
		$(htmlContent).appendTo("tbody").addClass("fadein");
	}
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
 * Gets the summary for this year and update necessary DOM's
 */
stats.getYearSum = function() {
	var totalChar = 0,
		totalLine = 0,
		totalTime = 0;
	for (var i = 0; i !== journal.archive.data[app.year].length; ++i) {
		var data = journal.archive.data[app.year][i];
		if (stats.isInTimeRange(data["time"]["created"])) {
			totalChar += data["text"]["chars"];
			totalLine += data["text"]["lines"];
			if (data["time"]["end"]) {
				var timeDelta = (data["time"]["end"] - data["time"]["start"]) / 60000;
				if (!isNaN(timeDelta)) {
					totalTime += timeDelta;
				}
			}
		}
	}
	// Update it on DOM
	$("#total-char").text(totalChar);
	$("#total-line").text(totalLine);
	// Human-readable time
	var minute = totalTime % 60;
	if (minute < 10) {
		minute = "0" + minute;
	}
	$("#total-time").text(Math.floor(totalTime / 60) + ":" + minute);
	// Todo add more details for the number of videos/photos/etc this year
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
			createdTime = data["time"]["created"];
		if (stats.isInTimeRange(createdTime)) {
			var day = stats.getDayNumber(createdTime);
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
				if (string) {
					for (var k = 0; k !== keywords.length; ++k) {
						// Iterate keywords
						var keyword = keywords[k];
						if (!result[day]) {
							result[day] = 0;
						}
						// Add the counts of the keyword
						result[day] += (string.match(new RegExp(keyword, "gi")) || []).length;
					}
				}
			}
		}
	}
	return result;
}


/**
 * Gets how many days have passed since the first day of `app.year`. The first day should return 0
 * @param {number} time - The time to get the result
 * @returns {number} - How many day have passed
 */
stats.getDayNumber = function(time) {
	var date = new Date(time),
		firstDay = new Date(app.year, 0, 1);
	return Math.floor((new Date(date) - firstDay) / 86400000);
}

/**
 * Tests if the passed in created time is in range limited by `stats.options`
 * @param {number} createdTime - The started time of seconds since epoch
 * @returns {boolean} - Whether created time is in the range
 */
stats.isInTimeRange = function(createdTime) {
	var day = stats.getDayNumber(createdTime);
	return day >= stats.options.startDay && day <= stats.options.endDay;
}

/**
 * Removes all the entries on the chart to reset the chart 
 */
stats.removeAll = function() {
	$("#stats-table").html("").fadeIn().css("display", "inline-table");
	stats.entries = {};
	stats.hideGraph();
}

/**
 * Toggles to show the analysis graph
 * Todo add a parameter to determine whether to display as each day or each month
 */
stats.toggleGraph = function() {
	if (!stats.isGraphDisplayed) {
		stats.showGraph();
	} else {
		stats.hideGraph();
	}
}

/**
 * Shows the analysis graph
 */
stats.showGraph = function() {
	stats.isGraphDisplayed = true;
	var series = [],
		days = [];
	for (var i = 0, entries = Object.keys(stats.entries) ; i !== entries.length; ++i) {
		var name = entries[i];
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
			min: 0,
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
	stats.isGraphDisplayed = false;
	$("#graph").fadeOut(function() {
		$(this).html("");
	});
}

