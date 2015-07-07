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
	endDay: 365,
	isIncludingTitles: true,
	isIncludingTags: false
};

/**
 * Initializes the stats panel 
 * @returns {} 
 */
stats.init = function() {
	// Initialize variables
	stats.result = [];
	// Animation for initialization
	$("#query").fadeOut();
	$("#stats-query").fadeIn();
	$("#stats-query").bind("keyup", "return", function() {
		var newEntry = $("#stats-query").val();
		newEntry = stats.simplifyEntry(newEntry);
		if (newEntry.length === 0) {
			// Empty string, do nothing
			$("#stats-query").effect("highlight", { color: "#000" });
			// logs.STATS_ENTRY_EMPTY_STRING
			animation.error("MISSING ERROR");
			return;
		}
		if (stats.entries[newEntry]) {
			// Already there
			$("#stats-query").effect("highlight", { color: "#000" });
			// logs.STATS_ENTRY_ALREADY_EXIST
			animation.error("MISSING ERROR");
		} else {
			// Add this one to the entry
			$("#stats-query").effect("highlight", { color: "#ddd" });
			stats.addEntry(newEntry);
		}
		// Empty this input box
		$("#stats-query").val("");
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
 * @returns {} 
 */
stats.initTable = function() {
	// The first line
	$("#stats-table").html("<thead><tr></tr><tr>Jan</tr><tr>Feb</tr><tr>Mar</tr><tr>Apr</tr><tr>Mar</tr><tr>Jun</tr><tr>Jul</tr><tr>Aug</tr><tr>Sep</tr><tr>Oct</tr><tr>Nov</tr><tr>Dec</tr></thead><tbody></tbody>");
	$("thead").addClass("fadein");
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
	// Unbind enter to search for #stats-query
	$("#stats-pane").fadeOut(400, function() {
		$("#contents").fadeIn();
	});
}

/**
 * Adds an entry to the stats chart. If the entries have multiple keywords, separate by `|`
 * @param {string} entry - An entry string of keywords separated by `|`
 */
stats.addEntry = function(entry) {
	/* Iterator */
	var i;
	// Empty or create it anyway
	var result = stats.getResult(entry);
	stats.entries[entry] = result;
	// Process each month's list
	var monthCount = new Array(12),
		monthVal;
	if (result.length === 366) {
		// Leap year
		monthVal = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	} else {
		monthVal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	}
	var day = 0;
	for (i = 0; i !== monthVal.length; ++i) {
		var thisMonth = monthVal[i];
		monthCount[i] = 0;
		for (var j = 0; j !== monthVal[i]; ++j, ++day) {
			monthCount[i] += result[day];
		}
	}
	// Show the html result
	var htmlContent = "<tr><td>" + entry + "</td>";
	for (i = 0; i !== monthCount.length; ++i) {
		htmlContent += "<td>" + monthCount[i] + "</td>";
	}
	htmlContent += "</tr>";
	// There should be only one table
	$(htmlContent).appendTo("tbody").addClass("fadein");
	// Todo add more to what happens when the user clicks on the entry (try to edit/remove it)
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
	if (new Date(app.year, 1, 29).getMonth() === 1) {
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
	return result;
}

/**
 * Removes all the entries on the chart to reset the chart 
 */
stats.removeAll = function() {

}

/**
 * Toggles to show the analysis graph
 */
stats.toggleGraph = function() {
	if ($("#graph").hasClass("hidden")) {
		stats.showGraph();
	} else {
		stats.hideGraph();
	}
}

/**
 * Shows the analysis graph
 */
stats.showGraph = function() {

}

/**
 * Hides the analysis graph
 */
stats.hideGraph = function() {

}

