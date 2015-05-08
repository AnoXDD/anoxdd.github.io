/*
 V2 odauth for code flow so that the user does not have to log out to get access token 
 Based on OneDrive API from github
 Embed odauth.js in your app like this:
	<script id="odauth" src="odauth.js" clientsecret="YourClientSecret"
		clientId="YourClientId" scopes="ScopesYouNeed"
		redirectUri="YourUrlForCallback.html"></script>

 Created 050415
 Author Anoxic
 */

function odauth(wasClicked) {
	ensureHttps();
	var token = getTokenFromCookie(),
		refresh = getRefreshFromCookie();
	if (token) {
		onAuthenticated(token);
	} else if (refresh) {
		// refreshToken() is called in removeLoginButton()
		removeLoginButton();
	} else if (wasClicked) {
		challengeForAuth();
	} else {
		showLoginButton();
	}
}

// for added security we require https
function ensureHttps() {
	if (window.location.protocol != "https:") {
		window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
	}
}

function onAuthCallback() {
	var authInfo = getAuthInfoFromUrl(),
		code = authInfo["code"],
		appinfo = window.opener.getAppInfo();
	// Redeem the code: post to get authentication token
	$.ajax({
		type: "POST",
		url: "https://login.live.com/oauth20_token.srf",
		contentType: "application/x-www-form-urlencoded",
		data: "client_id=" + appinfo.clientId +
			"&redirect_uri=" + appinfo.redirectUri +
			"&client_secret=" + appinfo.clientSecret +
			"&code=" + code +
			"&grant_type=authorization_code"
	}).done(function(data, status, xhr) {
		// Try to get the access token and expiry
		var token = data["access_token"],
			refresh = data["refresh_token"],
			expiry = parseInt(data["expires_in"]);
		window.opener.setCookie(token, expiry, refresh);
		window.opener.onAuthenticated(token, window);
	}).fail(function() {
		alert("Cannot get the code. Did you enable CORS?");
	});
}

function getAuthInfoFromUrl() {
	if (window.location.search) {
		var authResponse = window.location.search.substring(1);
		var authInfo = JSON.parse(
		  "{\"" + authResponse.replace(/&/g, "\",\"").replace(/=/g, "\":\"") + "\"}",
		  function(key, value) { return key === "" ? value : decodeURIComponent(value); });
		return authInfo;
	} else {
		alert("failed to receive auth token");
	}
}

/**
 * Get a valid access token then do the callback
 * @param {function} callback - the callback function
 * @returns {}
 */
function getTokenCallback(callback) {
	if (getTokenFromCookie()) {
		var token = getTokenFromCookie();
		callback(token);
	} else if (getRefreshFromCookie()) {
		// Previos session expired
		animation.log("Previous session expired");
		refreshToken(callback);
	}
}

/**
 * Get the access token from the cookie
 * @returns {string} - The token if found, empty string otherwise
 */
function getTokenFromCookie() {
	return getFromCookie("odauth");
}

function getRefreshFromCookie() {
	return getFromCookie("refresh");
}

/**
 * Get the cookie component specifying the name
 * @param {string} name - the name to be searched
 * @returns {string} the result. Empty string if not found
 */
function getFromCookie(name) {
	name += "=";
	var cookies = document.cookie,
		start = cookies.indexOf(name);
	if (start >= 0) {
		start += name.length;
		var end = cookies.indexOf(";", start);
		if (end < 0) {
			end = cookies.length;
		} else {
			postCookie = cookies.substring(end);
		}

		var value = cookies.substring(start, end);
		return value;
	}

	return "";
}

/**
 * Set the cookie of access token and refresh token to cookie
 * @param {string} token - the access token
 * @param {number} expiresInSeconds - the expire time in seconds of access token
 * @param {string} refreshToken - the refresh token
 * @returns {} 
 */
function setCookie(token, expiresInSeconds, refreshToken) {
	var expiration = new Date();
	expiration.setTime(expiration.getTime() + expiresInSeconds * 1000);
	// Access token
	var cookie = "odauth=" + token + "; path=/; expires=" + expiration.getTime();
	console.log("setCookie(): cookie = " + cookie);
	if (document.location.protocol.toLowerCase() == "https") {
		cookie = cookie + ";secure";
	}
	document.cookie = cookie;
	// Refresh token
	// Expire when the browser closes
	cookie = "refresh=" + refreshToken + "; path=/";//; expires=" + expiration.getTime();
	console.log("setCookie(): cookie = " + cookie);
	if (document.location.protocol.toLowerCase() == "https") {
		cookie = cookie + ";secure";
	}
	document.cookie = cookie;
}

/**
 * Toggle auto refresh token, the default is true
 * @returns {}
 */
function toggleAutoRefreshToken() {
	var func = function() {
		refreshToken();
	};
	if (toggleAutoRefreshToken.id) {
		// Turn off auto refresh
		$("#toggle-refresh-token").fadeOut(300, function() {
			$(this).html("&#xE149");
		}).fadeIn(300);
		animation.log("The access token auto-refresh is turned off");
		clearInterval(toggleAutoRefreshToken.id);
		toggleAutoRefreshToken.id = undefined;
	} else {
		// Set to refresh token every 30 minute
		$("#toggle-refresh-token").fadeOut(300, function() {
			$(this).html("&#xE194");
		}).fadeIn(300);
		animation.log("The access token will now be refreshed every 30 minute");
		//refreshToken();
		toggleAutoRefreshToken.id = setInterval(func, 1800000);
	}
}

/**
 * Refresh the token to get a new access token, then call the callback
 * @param {function} callback - callback function, should be with a parameter to handle the ACCESS TOKEN passed in
 * @returns {} 
 */
function refreshToken(callback) {
	animation.log("Refreshing access token ...");
	var refresh = getRefreshFromCookie(),
		appinfo = getAppInfo();
	if (refresh) {
		$.ajax({
			type: "POST",
			url: "https://login.live.com/oauth20_token.srf",
			contentType: "application/x-www-form-urlencoded",
			data: "client_id=" + appinfo.clientId +
				"&redirect_uri=" + appinfo.redirectUri +
				"&client_secret=" + appinfo.clientSecret +
				"&refresh_token=" + refresh +
				"&grant_type=authorization_code"
		}).done(function(data, status, xhr) {
			var token = data["access_token"],
				refresh = data["refresh_token"],
				expiry = parseInt(data["expires_in"]);
			setCookie(token, expiry, refresh);
			animation.log("Access token refreshed");
			callback(token);
		}).fail(function(xhr, status, error) {
			animation.log("Cannot refresh access token. The server returns \"" + status + "\"");
		});
	} else {
		// No refresh token, then try to sign in
		challengeForAuth();
	}
}

function getAppInfo() {
	var scriptTag = document.getElementById("odauth");
	if (!scriptTag) {
		alert("the script tag for odauth.js should have its id set to 'odauth'");
	}

	var clientId = scriptTag.getAttribute("clientId");
	if (!clientId) {
		alert("the odauth script tag needs a clientId attribute set to your application id");
	}

	var scopes = scriptTag.getAttribute("scopes");
	if (!scopes) {
		alert("the odauth script tag needs a scopes attribute set to the scopes your app needs");
	}

	var redirectUri = scriptTag.getAttribute("redirectUri");
	if (!redirectUri) {
		alert("the odauth script tag needs a redirectUri attribute set to your redirect landing url");
	}

	var clientSecret = scriptTag.getAttribute("clientSecret");
	if (!clientSecret) {
		alert("the odauth script tag needs a clientSecret attribute to refresh the token");
	}

	var appInfo = {
		"clientId": clientId,
		"scopes": scopes,
		"redirectUri": redirectUri,
		"clientSecret": clientSecret
	};

	return appInfo;
}

// called when a login button needs to be displayed for the user to click on.
// if a customLoginButton() function is defined by your app, it will be called
// with 'true' passed in to indicate the button should be added. otherwise, it
// will insert a textual login link at the top of the page. if defined, your
// showCustomLoginButton should call challengeForAuth() when clicked.
function showLoginButton() {
	var refresh = getRefreshFromCookie();
	if (refresh) {
		// Get access token from refresh
		refreshToken();
	} else {
		// Prompt the user to re-login
		animation.hideIcon(".actions a", function() {
			animation.showIcon("#signin");
		});
	}
}

// called with the login button created by showLoginButton() needs to be
// removed. if a customLoginButton() function is defined by your app, it will
// be called with 'false' passed in to indicate the button should be removed.
// otherwise it will remove the textual link that showLoginButton() created.
function removeLoginButton(debug) {
	// Refresh token
	if (!debug) {
		refreshToken();
	}
	// Show everything app needs
	animation.log("Welcome back");
	$("#sign-in-prompt").remove();
	headerShowMenu();
	$("#search-new").fadeIn();
	$("#search-result").fadeIn();
	$("#app").fadeIn();
	edit.tryReadCache();
}

function challengeForAuth() {
	var appInfo = getAppInfo();
	var url =
	  "https://login.live.com/oauth20_authorize.srf" +
	  "?client_id=" + appInfo.clientId +
	  "&scope=" + encodeURIComponent(appInfo.scopes) +
	  "&response_type=code" +
	  "&redirect_uri=" + encodeURIComponent(appInfo.redirectUri);
	popup(url);
}

function popup(url) {
	var width = 525,
		height = 525,
		screenX = window.screenX,
		screenY = window.screenY,
		outerWidth = window.outerWidth,
		outerHeight = window.outerHeight;

	var left = screenX + Math.max(outerWidth - width, 0) / 2;
	var top = screenY + Math.max(outerHeight - height, 0) / 2;

	var features = [
				"width=" + width,
				"height=" + height,
				"top=" + top,
				"left=" + left,
				"status=no",
				"resizable=yes",
				"toolbar=no",
				"menubar=no",
				"scrollbars=yes"];
	var popup = window.open(url, "oauth", features.join(","));
	if (!popup) {
		alert("failed to pop up auth window");
	}

	popup.focus();
}

function onAuthenticated(token, authWindow) {
	if (token) {
		if (authWindow) {
			authWindow.close();
		}
		removeLoginButton();
	}
}
