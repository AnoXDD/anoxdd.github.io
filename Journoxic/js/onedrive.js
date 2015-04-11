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
	// Show progress on hover
	$("#refresh-media").hover(function() {
		$(this).html(parseInt(_.size(journal.archive.map) / journal.archive.media * 100) + "%");
	}, function() {
		$(this).html("&#xE149");
	})
	var token = getTokenFromCookie();
	if (token != "") {
		// Get text data
		$.ajax({
			type: "GET",
			url: "https://api.onedrive.com/v1.0/drive/root:/Apps/Journal/data/data.js:/content?access_token=" + token,
		}).done(function(data, status, xhr) {
			myxhr = xhr.responseText;
			window.app.dataLoaded = false;
			window.app.load("", true, xhr.responseText);
		}).fail(function(xhr, status, error) {
			alert("Cannot download the file");
		}).always(function() {
			// Change loading icons and re-enable click
			$("#download").html("&#xE118").attr("onclick", "downloadFile()").attr("href", "#");
			console.log("downloadFile()\tFinish downloading");
		});
		// Get media data
		downloadMedia();
	}
}

/* Recusively read all the children under resource folder */
function downloadMedia(url) {
	$.ajax({
		type: "GET",
		url: "https://api.onedrive.com/v1.0/drive/special/approot:/resource:?select=folder&access_token=" + token
	}).done(function(data, status, xhr) {
		// Get the data number
		journal.archive.media = data["folder"]["childCount"];
		console.log("downloadFile()\tFinish metadata");
		if (url == undefined)
			url = "https://api.onedrive.com/v1.0/drive/special/approot:/resource:/children?select=name&access_token=" + token;
		$.ajax({
			type: "GET",
			url: url
		}).done(function(data, status, xhr) {
			if (data["@odata.nextLink"])
				// More content available!
				downloadMedia(data["@odata.nextLink"]);
			var itemList = data["value"];
			for (key in itemList)
				journal.archive.map[itemList[key]["name"]] = itemList[key]["@content.downloadUrl"];
			// Show progress
			$("#refresh-media").css("background", "-webkit-radial-gradient(center, ellipse cover, #3f3f3f 0%,#3f3f3f " + _.size(journal.archive.map) / journal.archive.media * 100 + "%,#343434 0%,#343434 100%)");
			if (_.size(journal.archive.map) == journal.archive.media) {
				// All the media have been loaded, so refresh button goes back to original status
				$("#refresh-media").css("background", "").unbind("mouseenter mouseleave");
			}
			console.log("downloadFile()\tFinish media data");
		});
	});
}

////$(document).ready(function() {
////	$("#login").on("click", function() {
////	});
////	/* Get ready for all the folders that needed */
////	$("#create-folder").on("click", function() {
////		mkdir("", "folderC");
////		mkdir("folderC", "another");
////		ls();
////		cat("", "textfile.txt");
////		cat("folderC", "text2.txt");
////		cat("", "Untitled.png");
////		emacs("", "text1.txt", "text1.txtxtxt");
////		emacs("folderC", "text2.txt", "textstring");
////	});
////});


