/**
 * Was previously onedrive.v2.js, renamed for convenience
 */

window.network = {};

network.percent = 0;
network.current = 0;
network.breakpoint = 0;
network.interval = 0;

/**
 * Initializes the network bar and show it
 * @param {number} breakpoint - The number of breakpoints
 */
network.init = function(breakpoint) {
	// Remove all the network activity bar
	$("#network-bar").remove();
	$(".header").append("<div id=\"network-bar\" ><div id=\"network-progress\"><div id=\"network-followup\"></div></div></div>");
	if (!breakpoint || breakpoint < 0) {
		breakpoint = 0;
	}
	network.current = 0;
	network.breakpoint = breakpoint || 0;
	network.setPercent(0);
	// Increment by a little automatically
	clearInterval(network.interval);
	network.interval = setInterval(function() {
		// Render the network progress bar given `network.percent`
		$("#network-progress").css("width", network.percent * 100 + "%");
		// The network bar will not exceed half-way
		if (network.percent < (network.current + .5) / (network.breakpoint + 1)) {
			network.percent += .015;
		}
		if (parseInt($("#network-bar").css("width")) <= parseInt($("#network-progress").css("width"))) {
			network.destroy();
			return;
		}
	}, 1000);
}

/**
 * Sets the percent of the network bar to show the progress of the network
 * @param {number} percent - The percent of the network bar. A number between 0 and 1
 */
network.setPercent = function(percent) {
	network.percent = percent;
}

/**
 * Sets the status of the network bar and tell the user what is happening
 * @param {string} status - The status string to be shown on the bar
 * @returns {} 
 */
network.setStatus = function(status) {

}

/**
 * Pushes network bar to the next breakpoint
 * @returns {} 
 */
network.next = function() {
	network.setPercent(++network.current / (network.breakpoint + 1));
}

/**
 * Destories the network bar and hide it. This function will set the percent to 1 then hide it
 */
network.destroy = function() {
	if (network.percent < 1) {
		// Set to a larger value to make the slide bar go faster
		network.percent = 2;
		// Use the interval function to destroy this one
	} else {
		clearInterval(network.interval);
		$("#network-bar").remove();
	}
}


/**
 * Downloads the file (including the text file and the media file) from OneDrive
 * @param {String} url - The direct url of the file. Default is from core/data.js
 */
function downloadFile(url) {
	animation.log(log.CONTENTS_DOWNLOAD_START, 1);
	////console.log("Start downloadFile()");
	// Change loading icons and disable click
	$("#download").html("&#xf1ce").addClass("spin").removeAttr("onclick").removeAttr("href");
	getTokenCallback(function(token) {
		if (token != "") {
			// Get text data
			url = url || "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/core/data.js:/content?access_token=" + token;
			$.ajax({
				type: "GET",
				url: url
			})
				.done(function(data, status, xhr) {
					window.app.dataLoaded = false;
					window.app.load("", true, xhr.responseText);
					////console.log("downloadFile()\tFinish core data");
					animation.log(log.CONTENTS_DOWNLOAD_TEXT);
					// Get metadata
					$.ajax({
						type: "GET",
						url: "https://api.onedrive.com/v1.0/drive/special/approot:/resource:?select=folder&access_token=" + token
					}).done(function(data, status, xhr) {
						// Get the data number
						journal.archive.media = data["folder"]["childCount"];
						animation.log(log.CONTENTS_DOWNLOAD_MEDIA_START, 1);
						network.init(journal.archive.media);
						downloadMedia();
					}).fail(function(xhr, status, error) {
						animation.error(log.CONTENTS_DOWNLOAD_MEDIA_FAIL + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
					});
				})
				.fail(function(xhr, status, error) {
					animation.error(log.CONTENTS_DOWNLOAD_TEXT_FAIL + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
					// Change loading icons and re-enable click
					$("#download").html("&#xf0ed").removeClass("spin").attr({
						onclick: "downloadFile()",
						href: "#"
					});
					animation.finished("#download");
					////alert("Cannot download the file. Do you enable CORS?");
				})
				.always(function() {
					animation.log(log.CONTENTS_DOWNLOAD_END, -1);
					////console.log("downloadFile()\tFinish downloading");
				});
		}
	});
}

/**
 * Recusively reads all the children under resource folder and read them as media
 * This function will not refresh the token because it assumes that it will be only called after downloadFile()
 * @param {string} url - The address of "nextLink", should be empty at the first call. Used for recursion
 * @returns {} 
 */
function downloadMedia(url) {
	// Reset map
	if (url == undefined) {
		// Initial call
		var token = getTokenFromCookie();
		journal.archive.map = {};
		url = "https://api.onedrive.com/v1.0/drive/special/approot:/resource:/children?select=id,name,size,@content.downloadUrl&top=500&access_token=" + token;
	}
	$.ajax({
		type: "GET",
		url: url
	}).done(function(data, status, xhr) {
		if (data["@odata.nextLink"]) {
			// More contents available!
			var nextUrl = data["@odata.nextLink"];
			var groups = nextUrl.split("&");
			// Manually to ask server return downloadUrl
			for (var i = 0; i !== groups.length; ++i) {
				if (groups[i].startsWith("$select")) {
					groups[i] = "$select=id,name,size,@content.downloadUrl";
					break;
				}
			}
			nextUrl = groups.join("&");
			downloadMedia(nextUrl);
		}
		var itemList = data["value"];
		for (var key = 0, len = itemList.length; key != len; ++key) {
			var dataElement = {
				id: itemList[key]["id"],
				url: itemList[key]["@content.downloadUrl"],
				size: itemList[key]["size"]
			};
			journal.archive.map[itemList[key]["name"]] = dataElement;
			network.next();
		}
		// Show progress
		var finished = _.size(journal.archive.map);
		animation.log(log.CONTENTS_DOWNLOAD_MEDIA_LOADED + finished + log.CONTENTS_DOWNLOAD_MEDIA_OF + journal.archive.media);
		if (finished == journal.archive.media) {
			animation.log(log.CONTENTS_DOWNLOAD_MEDIA_END, -1);
			network.destroy();
			// Change loading icons and re-enable click
			$("#download").html("&#xf0ed").removeClass("spin").attr({
				onclick: "downloadFile()",
				href: "#"
			});
			animation.finished("#download");
		}
		////console.log("downloadFile()\tFinish media data");
	});
}

/**
 * Uploads journal.archive.data to OneDrive and creates a backup
 * @returns {} 
 */
function uploadFile() {
	////console.log("Starting uploadFile()");
	animation.log(log.CONTENTS_UPLOAD_START, 1);
	// Change loading icons and disable click
	$("#upload").html("&#xf1ce").addClass("spin").removeAttr("onclick").removeAttr("href");
	getTokenCallback(function(token) {
		network.init(1);
		var d = new Date(),
			month = d.getMonth() + 1,
			day = d.getDate(),
			year = d.getFullYear() % 100,
			hour = d.getHours(),
			minute = d.getMinutes(),
			second = d.getSeconds();
		month = month < 10 ? "0" + month : month;
		day = day < 10 ? "0" + day : day;
		year = year < 10 ? "0" + year : year;
		hour = hour < 10 ? "0" + hour : hour;
		minute = minute < 10 ? "0" + minute : minute;
		second = second < 10 ? "0" + second : second;
		var fileName = "data_" + month + day + year + "_" + hour + minute + second + ".js",
			data = { name: fileName };
		// Backup the original file
		$.ajax({
			type: "PATCH",
			url: "https://api.onedrive.com/v1.0/drive/special/approot:/core/data.js?access_token=" + token,
			contentType: "application/json",
			data: JSON.stringify(data)
		})
			////////////////////////////// ADD PROGRESS BAR SOMEWHERE BETWEEN !!!!!!!!  //////////////
			.done(function() {
				////console.log("uploadFile():\t Done backup");
				animation.log(log.CONTENTS_UPLOAD_BACKUP);
				network.next();
				// Clean the unnecessary data
				var tmp = edit.minData();
				$.ajax({
						type: "PUT",
						url: "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/core/data.js:/content?access_token=" + token,
						contentType: "text/plain",
						data: JSON.stringify(tmp)
					})
					.done(function(data, status, xhr) {
						////console.log("uploadFile():\t Done!");
						animation.log(log.CONTENTS_UPLOAD_END, -1);
					})
					.fail(function(xhr, status, error) {
						animation.error(log.CONTENTS_UPLOAD_FAIL + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
						////alert("Cannot upload files");
					})
					.always(function() {
						network.next();
					});
			})
			.fail(function(xhr, status, error) {
				animation.error(log.CONTENTS_UPLOAD_BACKUP_FAIL + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
				network.destroy();
				////alert("Cannot backup the file");
			})
			.always(function() {
				// Change loading icons and re-enable click
				$("#upload").html("&#xf0ee").removeClass("spin").css("background", "").attr({
					onclick: "uploadFile()",
					href: "#"
				});
				animation.finished("#upload");
				////console.log("uploadFile()\tFinish uploading");
			});
	});
}

/* Download the cover photo from iTunes. type can be either number or string*/
function getCoverPhoto(selectorHeader, term, more, type) {
	var url = "https://itunes.apple.com/search?output=json&lang=1&limit=1&media=music&entity=song,album,musicArtist&term=";
	if (typeof (type) == "number") {
		type = edit.mediaName(type);
	}
	if (type == "movie") {
		url = "https://itunes.apple.com/search?output=json&lang=1&limit=1&media=movie&entity=movieArtist,movie&term=";
	} else if (type == "book") {
		url = "https://itunes.apple.com/search?output=json&lang=1&limit=1&media=ebook&entity=ebook&term=";
	}
	$.ajax({
		url: url + term,
		dataType: "jsonp",
		// Work with the response
		success: function(response) {
			var result = response.results[0];
			if (result == undefined) {
				// Not found
				animation.warn(log.COVER_PHOTO_FAIL);
				animation.invalid(selectorHeader + "input");
			} else {
				// Result found
				animation.log(log.COVER_PHOTO_FOUND);
				var artist = result["artistName"],
					track = result["trackName"],
					coverUrl = result["artworkUrl100"];
				if (more) {
					$(selectorHeader + ".title").val(track);
					$(selectorHeader + ".desc").val(artist);
				}
				$(selectorHeader + ".thumb").attr("src", coverUrl);
			}
		}
	});
}

/**
 * Creates a folder under data/
 * @param {string} dateStr - The name of the folder to be created
 * @param {function} callback - The callback function after completion of creating
 */
function createFolder(dateStr, callback) {
	getTokenCallback(function(token) {
		var requestJson = {
			name: dateStr,
			folder: {}
		};
		$.ajax({
			type: "POST",
			url: "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/data:/children?access_token=" + token,
			contentType: "application/json",
			data: JSON.stringify(requestJson),
			statusCode: {
				// Conflict, considered this folder is created successfully
				409: function() {
					edit.isFolder = true;
					edit.folderDate = dateStr;
				}
			}
		}).done(function() {
			// Successfully created this directory
			edit.isFolder = true;
			edit.folderDate = dateStr;
			animation.log(log.FOLDER_CREATED);
		}).always(function() {
			// Always try to run the callback function
			callback(dateStr);
		});
	});
}