/**
 *  Handle all the network activities besides the authentication problem in odauth.js
 * 
 * <What's new>
 * V2 version is written to be compatible with functions in odauth.v2.js
 * 
 * Some functions that are never used are cleaned
 * All the function now will be able to refresh the access token on their own if it expires
 * 
 */

var ROOTURL = "https://api.onedrive.com/v1.0/drive/special/approot";

/************************************************************************
		EVERY PATH SHOULD _NOT_ BE _STARTED_ AND _ENDED_ WITH '/'
 ************************************************************************/

/**
 * Downloads the file (including the text file and the media file) from OneDrive
 * This function will refresh the token
 * @returns {} 
 */
function downloadFile() {
	animation.log("Start downloading data...");
	////console.log("Start downloadFile()");
	// Change loading icons and disable click
	$("#download").html("&#xf1ce").addClass("spin").removeAttr("onclick").removeAttr("href");
	var id1 = animation.blink("#download");
	// Show progress on hover
	$("#refresh-media").hover(function() {
		var percent = parseInt(_.size(journal.archive.map) / journal.archive.media * 100);
		if (isNaN(percent)) {
			percent = 0;
		}
		$(this).html(percent + "%");
	}, function() {
		$(this).html("&#xf021");
	});
	getTokenCallback(function(token) {
		if (token != "") {
			// Get text data
			$.ajax({
					type: "GET",
					url: "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/data/data.js:/content?access_token=" + token,
				})
				.done(function(data, status, xhr) {
					window.app.dataLoaded = false;
					window.app.load("", true, xhr.responseText);
					////console.log("downloadFile()\tFinish core data");
					animation.log("Text data fetched");
					// Get metadata
					$.ajax({
						type: "GET",
						url: "https://api.onedrive.com/v1.0/drive/special/approot:/resource:?select=folder&access_token=" + token
					}).done(function(data, status, xhr) {
						// Get the data number
						journal.archive.media = data["folder"]["childCount"];
						animation.log("Start downloading media data ...");
						downloadMedia();
					}).fail(function(xhr, status, error) {
						animation.log("Cannot find the media data. The server returns error \"" + error + "\"", true);
					});
				})
				.fail(function(xhr, status, error) {
					animation.log("Cannot find any text data. The server returns error \"" + error + "\"", true);
					////alert("Cannot download the file. Do you enable CORS?");
				})
				.always(function() {
					// Stop blinking and rotating
					clearInterval(id1);
					// Change loading icons and re-enable click
					$("#download").html("&#xf0ed").removeClass("spin").attr({
							onclick: "downloadFile()",
							href: "#"
						});
					animation.finished("#download");
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
		url = "https://api.onedrive.com/v1.0/drive/special/approot:/resource:/children?select=name,size&access_token=" + token;
	}
	$.ajax({
		type: "GET",
		url: url
	}).done(function(data, status, xhr) {
		if (data["@odata.nextLink"]) {
			// More content available!
			downloadMedia(data["@odata.nextLink"]);
		}
		var itemList = data["value"];
		for (var key = 0, len = itemList.length; key != len; ++key) {
			var dataElement = {
				url: itemList[key]["@content.downloadUrl"],
				size: itemList[key]["size"]
			};
			journal.archive.map[itemList[key]["name"]] = dataElement;
		}
		// Show progress
		var finished = _.size(journal.archive.map);
		animation.log("Fetched " + finished + " of " + journal.archive.media);
		$("#refresh-media").css("background", "-webkit-linear-gradient(top, #3f3f3f 0%,#3f3f3f " + finished / journal.archive.media * 100 + "%,#343434 0%,#343434 100%)");
		if (finished == journal.archive.media) {
			// All the media have been loaded, so refresh button goes back to original status
			$("#refresh-media").html("&#xf021").removeClass("spin").css("background", "").unbind("mouseenter mouseleave");
			animation.log("Media data fetched");
			animation.finished("#refresh-media");
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
	animation.log("Start uploading ...");
	// Change loading icons and disable click
	$("#upload").html("&#xf1ce").addClass("spin").removeAttr("onclick").removeAttr("href");
	getTokenCallback(function(token) {
		var id = animation.blink("#upload"),
			d = new Date(),
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
				url: "https://api.onedrive.com/v1.0/drive/special/approot:/data/data.js?access_token=" + token,
				contentType: "application/json",
				data: JSON.stringify(data)
			})
			////////////////////////////// ADD PROGRESS BAR SOMEWHERE BETWEEN !!!!!!!!  //////////////
			.done(function() {
				$("#upload").css("background", "-webkit-linear-gradient(top, #3f3f3f 0%, #3f3f3f 50%, #343434 0%, #343434 100%)");
				////console.log("uploadFile():\t Done backup");
				animation.log("Data backup finished");
				// Clean the unnecessary data
				var tmp = edit.minData();
				$.ajax({
						type: "PUT",
						url: "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/data/data.js:/content?access_token=" + token,
						contentType: "text/plain",
						data: JSON.stringify(tmp)
					})
					.done(function(data, status, xhr) {
						////console.log("uploadFile():\t Done!");
						animation.log("Data uploaded");
					})
					.fail(function(xhr, status, error) {
						animation.log("Cannot upload data. Please try fixing the problem manually. The server returns error \"" + error + "\"", true);
						////alert("Cannot upload files");
					});
			})
			.fail(function(xhr, status, error) {
				animation.log("Cannot backup data. Please see if there is any name conflict. The server returns error \"" + error + "\"", true);
				////alert("Cannot backup the file");
			})
			.always(function() {
				// Stop blinking
				clearInterval(id);
				// Change loading icons and re-enable click
				$("#upload").html("&#xE11C").removeClass("spin").css("background", "").attr({
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
	var id = animation.blink(selectorHeader + ".thumb"),
		url = "https://itunes.apple.com/search?output=json&lang=1&limit=1&media=music&entity=song,album,musicArtist&term=";
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
				animation.log("Cannot find matched result", true);
				animation.invalid(selectorHeader + "input");
			} else {
				// Result found
				animation.log("Result found");
				var artist = result["artistName"],
					track = result["trackName"],
					coverUrl = result["artworkUrl100"];
				if (more) {
					$(selectorHeader + ".title").val(track);
					$(selectorHeader + ".desc").val(artist);
				}
				$(selectorHeader + ".thumb").attr("src", coverUrl);
			}
			clearInterval(id);
		}
	});
}