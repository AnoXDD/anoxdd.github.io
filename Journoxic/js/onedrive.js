var ROOTURL = "https://api.onedrive.com/v1.0/drive/special/approot",
	token, mydata, mystatus, myxhr;

/************************************************************************
		EVERY PATH SHOULD _NOT_ BE _STARTED_ AND _ENDED_ WITH '/'
 ************************************************************************/

/*
 Create a folder under the path 
 Leave dir empty if under the root
 */
function mkdir(dir, name, overwrite) {
	if (dir != "")
		dir = ":/" + dir + ":";
	$.ajax({
		type: "POST",
		url: ROOTURL + dir + "/children" + "?access_token=" + token,
		contentType: "application/json",
		data: JSON.stringify({
			"name": name,
			"folder": {},
			// Overwrite based on option
			"@name.conflictBehavior": overwrite ? "rename" : "fail"
		}),
		statusCode: {
			409: function() {
				console.log("mkdir(): 409");
			}
		},
		success: function(data, status, xhr) {
			$("#data").text(data);
			$("#status").text(status);
			$("#xhr").text(xhr);
			flag = true;
		}
	}).always(function() {
		console.log("Finished mkdir()");
	});
}

/*
 Return an array of all the files and folders under current directory
 Return an empty array if something goes wrong
 */
function ls(dir, detail) {
	if (dir == undefined)
		dir = "";
	else if (dir && dir != "")
		dir = ":/" + dir + "/:";
	var array = [];
	$.ajax({
		type: "GET",
		dataType: "json",
		url: ROOTURL + dir + "?select=id,children&expand=children&access_token=" + token,
		success: function(data, status, xhr) {
			response = $.parseJSON(xhr.responseText);
			for (child in response["children"]) {
				if (child) {
					if (detail)
						array.push(response["children"][child]);
					else
						array.push(response["children"][child]["name"]);
				}
			}
			console.log(array);
		}
	});
}

/*
 Return a raw string of the file content
 Return an empty string if something goes wrong
 */
function cat(dir, name) {
	console.log("Starting cat()");
	if (dir && dir != "")
		dir += "/";
	$.ajax({
		type: "GET",
		// url: ROOTURL + dir + name + ":/content?access_token=" + token,
		url: "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/" + dir + name + ":/content?access_token=" + token,
		success: function(data, status, xhr) {
			mydata = data;
			myxhr = xhr;
			console.log("\tcontentURL = " + xhr.responseText);
			console.log("Finished cat()");
		}
	});
}

/*
 Write the contents to the file
 Return if writing succeeds
 */
function emacs(dir, name, content) {
	console.log("Starting emacs()");
	if (dir == "")
		dir = ":/";
	else if (dir && dir != "")
		dir = ":/" + dir + "/";
	$.ajax({
		type: "PUT",
		url: ROOTURL + dir + name + ":/content?access_token=" + token,
		contentType: "text/plain",
		data: content,
		success: function(data, status, xhr) {
			console.log("\txhr.responseText: " + xhr.responseText);
			console.log("Finished emacs()");
		}
	});
}

/*
 Copy a file to a new destination. This by default does not overwrite the destination file
 Return if the copy succeeds
 */
function cp(srcPath, srcName, desPath, desName) {

}

/*
 Delete a file 
 Return if delete succeeds
 */
function rm(dir, name) {

}

/* The setup of the onedrive folder and ensures that all the folders and files exist */
function init() {

}

function downloadFile() {
	console.log("Start downloadFile()");
	// Change loading icons and disable click
	$("#download").html("&#xE10C").removeAttr("onclick").removeAttr("href");
	var id1 = animation.blink("#download");
	// Show progress on hover
	$("#refresh-media").hover(function() {
		var percent = parseInt(_.size(journal.archive.map) / journal.archive.media * 100);
		if (isNaN(percent))
			percent = 0;
		$(this).html(percent + "%");
	}, function() {
		$(this).html("&#xE149");
	})
	var token = getTokenFromCookie();
	if (token != "") {
		// Get text data
		$.ajax({
			type: "GET",
			url: "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/data/data.js:/content?access_token=" + token,
		})
		.done(function(data, status, xhr) {
			window.app.dataLoaded = false;
			window.app.load("", true, xhr.responseText);
			console.log("downloadFile()\tFinish core data");
			// Get metadata
			$.ajax({
				type: "GET",
				url: "https://api.onedrive.com/v1.0/drive/special/approot:/resource:?select=folder&access_token=" + token
			}).done(function(data, status, xhr) {
				// Get the data number
				journal.archive.media = data["folder"]["childCount"];
				console.log("downloadFile()\tFinish metadata");
				downloadMedia();
			}).fail(function() {
				alert("Cannot load children list");
			});
		})
		.fail(function(xhr, status, error) {
			alert("Cannot download the file. Do you enable CORS?");
		})
		.always(function() {
			// Stop blinking and rotating
			clearInterval(id1);
			// Change loading icons and re-enable click
			$("#download").html("&#xE118").attr("onclick", "downloadFile()").attr("href", "#");
			animation.finished("#download");
			console.log("downloadFile()\tFinish downloading");
		});
	}
}

/* Recusively read all the children under resource folder */
function downloadMedia(url, id) {
	if (id == undefined)
		id = animation.rotate("#refresh-media");
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
		if (data["@odata.nextLink"])
			// More content available!
			downloadMedia(data["@odata.nextLink"], id);
		var itemList = data["value"];
		for (var key = 0, len = itemList.length; key != len; ++key) {
			var data = {
				url: itemList[key]["@content.downloadUrl"],
				size: itemList[key]["size"]
			};
			journal.archive.map[itemList[key]["name"]] = data;
		}
		// Show progress
		$("#refresh-media").css("background", "-webkit-linear-gradient(top, #3f3f3f 0%,#3f3f3f " + _.size(journal.archive.map) / journal.archive.media * 100 + "%,#343434 0%,#343434 100%)");
		if (_.size(journal.archive.map) == journal.archive.media) {
			// All the media have been loaded, so refresh button goes back to original status
			$("#refresh-media").html("&#xE149").css("background", "").unbind("mouseenter mouseleave");
			clearInterval(id);
			animation.finished("#refresh-media");
		}
		console.log("downloadFile()\tFinish media data");
	});
}

/* Upload journal.archive.data to OneDrive, also created a backup */
function uploadFile() {
	console.log("Starting uploadFile()");
	// Change loading icons and disable click
	$("#upload").html("&#xE10C").removeAttr("onclick").removeAttr("href");
	var id = animation.blink("#upload"),
		token = getTokenFromCookie(),
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
		$("#upload").css("background", "-webkit-linear-gradient(top, #3f3f3f 0%,#3f3f3f 50%,#343434 0%,#343434 100%)");
		console.log("uploadFile():\t Done backup");
		// Clean the unnecessary data
		var tmp = edit.minData();
		$.ajax({
			type: "PUT",
			url: "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/data/data.js:/content?access_token=" + token,
			contentType: "text/plain",
			data: JSON.stringify(tmp)
		})
		.done(function(data, status, xhr) {
			console.log("uploadFile():\t Done!");
		})
		.fail(function() {
			alert("Cannot upload files");
		})
	})
	.fail(function() {
		alert("Cannot backup the file");
	})
	.always(function() {
		// Stop blinking
		clearInterval(id);
		// Change loading icons and re-enable click
		$("#upload").html("&#xE11C").css("background", "").attr("onclick", "uploadFile()").attr("href", "#");
		animation.finished("#upload");
		console.log("uploadFile()\tFinish uploading");
	})
}

/* Download the cover photo from iTunes. type can be either number or string*/
function getCoverPhoto(selectorHeader, term, more, type) {
	var id = animation.blink(selectorHeader + ".thumb"),
		url = "https://itunes.apple.com/search?output=json&lang=1&limit=1&media=music&entity=song,album,musicArtist&term=";
	if (typeof (type) == "number")
		type = edit.mediaName(type);
	if (type == "movie")
		url = "https://itunes.apple.com/search?output=json&lang=1&limit=1&media=movie&entity=movieArtist,movie&term=";
	else if (type == "book")
		url = "https://itunes.apple.com/search?output=json&lang=1&limit=1&media=ebook&entity=ebook&term=";
	$.ajax({
		url: url + term,
		dataType: "jsonp",
		// Work with the response
		success: function(response) {
			var result = response.results[0];
			if (result == undefined) {
				// Not found
				animation.invalid(selectorHeader + "input");
			} else {
				// Result found
				var artist = result["artistName"],
					track = result["trackName"],
					coverURL = result["artworkUrl100"];
				if (more) {
					$(selectorHeader + ".title").val(track);
					$(selectorHeader + ".desc").val(artist);
				}
				$(selectorHeader + ".thumb").attr("src", coverURL);
			}
			clearInterval(id);
		}
	});
}

