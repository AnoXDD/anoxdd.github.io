/**
 * Was previously onedrive.v2.js, renamed for convenience
 */

window.network = {};

network.percent = 0;
network.current = 0;
network.breakpoint = 0;
network.interval = 0;
/** The local variables to store if current year has /core/ folder */
network.yearFolders = [];
/** Whether there are any outgoing ajax event */
network.isAjaxActive = false;
/** The timeout time for ajax, in milliseconds */
network.timeOut = 15000;

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
	var toDestroy = false;
	network.interval = setInterval(function() {
		// Test if the network bar needs destroyed 
		if (toDestroy) {
			network.destroy();
			return;
		}
		// The network bar will not exceed half-way
		if (network.percent < (network.current + .5) / (network.breakpoint + 1)) {
			network.percent += .05;
		}
		if (network.percent >= 1) {
			network.percent = 1;
			toDestroy = true;
		}
		// Render the network progress bar given `network.percent`
		$("#network-progress").css("width", network.percent * 100 + "%");
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
 * Destroies the network bar and hide it. This function will set the percent to 1 then hide it
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
 * ****************************************************************************
 */

/**
 * Returns the url of resource folder (where the media in the entry are located) in the format of "https://api.onedrive.com/v1.0/drive/special/approot:/resource/`year`". The returned string should be appended with ":/" if necessary
 * @param {boolean} isAbsolute (Optional) - if set to true the format will be "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/resource/`year`"
 * @param {number} year (Optional) - The year of the resource folder. Default value is `app.year`
 * @returns {string} - The correct url given `app.year` (the year displayed) or specified year
 */
function getResourceUrlHeader(isAbsolute, year) {
	year = year || app.year;
	if (isAbsolute) {
		return "https://api.onedrive.com/v1.0/drive/special/approot:/resource/" +
			year;
	} else {
		return "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/resource/"
			+ year;
	}
}

/**
 * Returns the url of data folder (where media that are not in the entries are located) in the format of "https://api.onedrive.com/v1.0/drive/special/approot:/data/`year`". The returned string should be appended with ":/" if necessary
 * @param {boolean} isAbsolute (Optional) - if set to true the format will be "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/data/`year`"
 * @param {number} year (Optional) - The year of the resource folder. Default value is `app.year`
 * @returns {string} - The correct url given `app.year` (the year displayed) or specified year
 */
function getDataUrlHeader(isAbsolute, year) {
	year = year || app.year;
	if (isAbsolute) {
		return "https://api.onedrive.com/v1.0/drive/special/approot:/data/" +
			year;
	} else {
		return "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/data/"
			+ year;
	}
}

/**
 * Returns the url of core data (.js file) in the format of "https://api.onedrive.com/v1.0/drive/special/approot:/core/`year`/data.js". The returned string should be appended with ":/" if necessary
 * @param {boolean} isAbsolute (Optional) - if set to true the format will be "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/core/`year`/data.js"
 * @param {number} year (Optional) - The year of the core data. Default value is `app.year`
 * @returns {string} - The correct url given `app.year` (the year displayed) or `app.year` to the core data .js
 */
function getCoreDataUrlHeader(isAbsolute, year) {
	year = year || app.year;
	if (isAbsolute) {
		return "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/core/" + year + "/data.js";
	} else {
		return "https://api.onedrive.com/v1.0/drive/special/approot:/core/" + year + "/data.js";
	}
}

/**
 * Downloads the file (including the text file and the media file) from OneDrive. If even the folders are not created, this function will also make sure necessary folders exist
 * @param {String} url - The direct url of the file. Default is from core/data.js
 * @param {Boolean} textOnly - whether to download text file or not
 */
function downloadFile(url, textOnly) {
	animation.log(log.CONTENTS_DOWNLOAD_START, 1);
	////console.log("Start downloadFile()");
	// Change loading icons and disable click
	$("#download").html("&#xf1ce").addClass("spin").removeAttr("onclick").removeAttr("href");
	getTokenCallback(function(token) {
		if (network.yearFolders.indexOf(app.year) === -1) {
			// Create a folder instead of searching for it
			createFolders(function() {
				// Simply refresh the list-view
				app.refresh();
			}, 3);
		} else {
			// Get text data
			url = url || getCoreDataUrlHeader(true) +
				":/content?access_token=" + token;
			$.ajax({
				type: "GET",
				url: url
			})
				.done(function(data, status, xhr) {
					window.app.dataLoaded = false;
					window.app.load("", xhr.responseText);
					////console.log("downloadFile()\tFinish core data");
					animation.log(log.CONTENTS_DOWNLOAD_TEXT);
					// Now the data is up-to-date
					app.yearChange[app.year] = false;
					$("#year").removeClass("change");
					app.yearUpdate();
					if (textOnly) {
						// Change loading icons and re-enable click
						$("#download").html("&#xf0ed").removeClass("spin").attr({
							onclick: "downloadFile()",
							href: "#"
						});
						animation.finished("#download");
					} else {
						// Get metadata
						$.ajax({
							type: "GET",
							url: getResourceUrlHeader() + ":?select=folder&access_token=" + token
						})
							.done(function(data, status, xhr) {
								// Get the data number
								journal.archive.media = data["folder"]["childCount"];
								app.refresh();
								animation.log(log.CONTENTS_DOWNLOAD_MEDIA_START, 1);
								network.init(journal.archive.media);
								downloadMedia();
							})
							.fail(function(xhr, status, error) {
								animation.error(log.CONTENTS_DOWNLOAD_MEDIA_FAIL + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
							});
					}
				})
				.fail(function(xhr, status, error) {
					animation.error(log.CONTENTS_DOWNLOAD_TEXT_FAIL + log.SERVER_RETURNS + error + log.SERVER_RETURNS_END, -1);
					// Change loading icons and re-enable click
					$("#download").html("&#xf0ed").removeClass("spin").attr({
						onclick: "downloadFile()",
						href: "#"
					});
					// `app.year` does not change
					app.year = parseInt($("#year").html());
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
 * Recusively reads all the children under resource folder and read them as media. 
 * This function will not refresh the token because it assumes that it will be only called after downloadFile()
 * @param {string} url - The address of "nextLink", should be empty at the first call. Used for recursion
 */
function downloadMedia(url) {
	// Reset map
	if (url == undefined) {
		// Initial call
		var token = getTokenFromCookie();
		journal.archive.map = {};
		url = getResourceUrlHeader() + ":/children?select=id,name,size,@content.downloadUrl&top=500&access_token=" + token;
	}
	$.ajax({
		type: "GET",
		url: url
	})
		.done(function(data, status, xhr) {
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
		})
		.fail(function() {
			network.destroy();
		});
}

/**
 * Uploads journal.archive.data to OneDrive and creates a backup. If this folder does not exist, this function will create a folder before uploading
 */
function uploadFile() {
	////console.log("Starting uploadFile()");
	animation.log(log.CONTENTS_UPLOAD_START, 1);
	// Change loading icons and disable click
	$("#upload").html("&#xf1ce").addClass("spin").removeAttr("onclick").removeAttr("href");
	getTokenCallback(function(token) {
		/**
		 * The function to be called to upload the file. This function assumes that the folder has already been prepared
		 */
		var upload = function() {
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
				url: getCoreDataUrlHeader() + "?access_token=" + token,
				contentType: "application/json",
				data: JSON.stringify(data)
			})
				////////////////////////////// ADD PROGRESS BAR SOMEWHERE BETWEEN !!!!!!!!  //////////////
				.done(function() {
					////console.log("uploadFile():\t Done backup");
					animation.log(log.CONTENTS_UPLOAD_BACKUP);
					// Now the data is up-to-date
					app.yearChange[app.year] = false;
					$("#year").removeClass("change");
					network.next();
					// Clean the unnecessary data
					var tmp = edit.minData();
					$.ajax({
						type: "PUT",
						url: getCoreDataUrlHeader(true) + ":/content?access_token=" + token,
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
		};
		if (network.yearFolders.indexOf(app.year) === -1) {
			// This `app.year` has not already registered on the website
			createFolders(upload, 5);
		} else {
			// Just upload it
			network.init(1);
			upload();
		}
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
function createDateFolder(dateStr, callback) {
	getTokenCallback(function(token) {
		var requestJson = {
			name: dateStr,
			folder: {}
		};
		$.ajax({
			type: "POST",
			url: getDataUrlHeader(true) + ":/children?access_token=" + token,
			contentType: "application/json",
			data: JSON.stringify(requestJson),
			statusCode: {
				// Conflict, considered this folder is created successfully
				409: function() {
					edit.isFolder = true;
					edit.folderDate = dateStr;
				}
			}
		})
			.done(function() {
				// Successfully created this directory
				edit.isFolder = true;
				edit.folderDate = dateStr;
				animation.log(log.FOLDER_CREATED);
			})
			.always(function() {
				// Always try to run the callback function
				callback(dateStr);
			});
	});
}

/**
 * Creates the necessary folders (/core/, /resource/, /data/) for this `app.year`
 * @param {function} callback(token) - The callback function after all the folders exist (already existed or newly created), can have a parameter for access_token
 * @param {number} breakpoints - The number of breakpoints for network progress bar
 */
function createFolders(callback, breakpoints) {
	getTokenCallback(function(token) {
		var created = 0,
			abort = false,
			urls = ["https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/core:/",
				"https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/data:/",
				"https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/resource:/"],
			requestJson = {
				name: app.year,
				folder: {}
			};
		// Start create all the folder needed
		network.init(breakpoints);
		for (var i = 0; i !== urls.length; ++i) {
			$.ajax({
				type: "POST",
				url: urls[i] + "children?access_token=" + token,
				contentType: "application/json",
				data: JSON.stringify(requestJson)
			})
				.done(function() {
					network.next();
					if (++created === urls.length) {
						// All have been created
						network.yearFolders.push(app.year);
						// Upload the data
						callback(token);
					}
				})
				.fail(function(xhr) {
					if (xhr.status == 409) {
						// Conflict, considered this folder is created successfully
						network.next();
						if (++created === urls.length) {
							// All have been created
							network.yearFolders.push(app.year);
							// Upload the data
							callback(token);
						}
					} else {
						network.destroy();
						if (!abort) {
							animation.error(log.CONTENTS_UPLOAD_REGISTER_FAIL);
						}
						// Abort everything, to prevent multiple prompt of the error
						abort = true;
					}
				});
		}
	})
}