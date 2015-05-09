/* A library for animations */

// Todo: refresh-media should change its font back after "blink" to say finished (set font to inherit)

window.animation = {};

animation.degree = 0;
animation.duration = 250;

animation.hideIcon = function(selector, callback) {
	$(selector).fadeOut(animation.duration, callback);
};

animation.showIcon = function(selector, callback) {
	$(selector).css({ top: "10px" }).fadeIn(animation.duration, callback);
};

animation.isShown = function(selector) {
	return $(selector).css("top") === "10px" && $(selector).css("display") !== "none";
};
animation.toggleIcon = function(selector, callback) {
	callback = callback || function() {
	};
	if (animation.isShown(selector)) {
		animation.hideIcon(selector, callback);
	} else {
		animation.showIcon(selector, callback);
	}
}; /* Set the name of confirm */
animation.setConfirm = function(name) {
	if (name === edit.confirmName) {
		if (typeof (name) == "number") {
			// Always show
			animation.showIcon("#confirm");
			switch (name) {
				case 2:
					// Place
					animation.toggleIcon("#pin-point");
					break;
			}
		} else {
			// Do not need to follow the steps below, just toggle it
			animation.toggleIcon("#confirm");
		}
		return;
	}
	// Start a new one
	animation.hideIcon(".entry-option", function() {
		var title;
		// Change how it looks
		if (typeof (name) == "number") {
			$("#confirm").html("&#xf00d");
			title = "Remove this medium";
			switch (name) {
				case 2:
					// Place
					animation.showIcon("#pin-point");
					break;
			}
		} else {
			$("#confirm").html("&#xf00c");
		}
		animation.showIcon("#confirm");
		if (name === "delete") {
			title = "Confirm to remove this entry";
		} else if (name === "discard") {
			title = "Discard this entry";
		} else if (name === "add") {
			title = "Overwrite saved data to create a new entry";
		} else if (name === "edit") {
			title = "Overwrite saved data to edit this entry";
		} else if (name === "save") {
			title = "Save entry";
		}
		if (title == undefined) {
			// Not a valid call
			return;
		}
		$("#confirm").css("title", title);
		edit.confirmName = name;
	});
}; /* Return undefined if it is not shown */
animation.blink = function(selector) {
	if (animation.isShown(selector)) {
		var pulse = function() {
			$(selector).fadeOut();
			$(selector).fadeIn();
		};
		var id = setInterval(pulse, 1800);
		console.log("animation.blink()\t" + selector + ": id=" + id);
		return id;
	} else {
		return undefined;
	}
};

animation.finished = function(selector) {
	if (animation.isShown(selector)) {
		/* Keep a record of original text */
		var text = $(selector).html();
		$(selector).fadeOut(300, function() {
			$(this).html("&#xf00c").css({
				background: "#fff",
				"font-size": "inherit"
			});
		}).fadeIn(300).delay(500).fadeOut(300, function() {
			$(this).html(text).css({
				background: "",
				"font-size": ""
			});
		}).fadeIn(300);
	}
};

animation.warning = function(selector) {
	if (animation.isShown(selector)) {
		/* Keep a record of original text */
		var text = $(selector).html();
		$(selector).fadeOut(300, function() {
			$(this).html("&#xf071").css({
				background: "#fff"
			});
		}).fadeIn(300).delay(500).fadeOut(300, function() {
			$(this).html(text).css({
				background: ""
			});
		}).fadeIn(300);
	}
};

animation.deny = function(selector) {
	if (animation.isShown(selector)) {
		/* Keep a record of original text */
		var text = $(selector).html();
		$(selector).fadeOut(300, function() {
			$(this).html("&#xE10A").css({
				color: "#000",
				background: "#fff"
			});
		}).fadeIn(300).delay(500).fadeOut(300, function() {
			$(this).html(text).css({
				background: "",
				color: ""
			});
		}).fadeIn(300);
	}
};

animation.invalid = function(selector) {
	$(selector).effect("highlight", {
		color: "#8d8d8d"
	});
};

/* Log something on the menu to let the user now */
animation.log = function(message, error) {
	var id = new Date().getTime(),
		htmlContent;
	if (error) {
		htmlContent = "<p class=\"error\" id=" + id + ">" + message + "</p>";
	} else {
		htmlContent = "<p id=" + id + ">" + message + "</p>";
	}
	$(htmlContent).appendTo("#feedback").fadeTo(400, 1).click(function() {
		$(this).slideUp(200, function() {
			$(this).remove();
		});
	}).hover(function() {
		$(this).fadeTo(400, 1);
	});
	if (error) {
		// Add error message
		message = "[ERR] " + message;
	} else {
		// Auto dim
		setTimeout(function() {
			$("p#" + id).fadeTo(400, .5);
		}, 2000);
		// Auto remove itself
		var click = function() {
			if ($("p#" + id).css("opacity") != 1) {
				$("p#" + id).trigger("click");
			} else {
				setTimeout(click, 5000);
			}
		};
		setTimeout(click, 5000);
	}
	console.log("From user log: \t" + new Date() + ": " + message);
	////$("#feedback").html(message).css("opacity", "1");
	////setTimeout(function() {
	////	$("#feedback").css("opacity", ".01");
	////}, 2000);
};

function headerShowMenu(name) {
	animation.hideIcon(".actions a");
	setTimeout(function() {
		if (name === "edit") {
			name = ".entry-edit";
		} else if (name === "add") {
			name = ".entry-add";
		} else if (name === "comm") {
			name = ".entry-comm";
		} else {
			// name == undefined or other situations
			name = ".entry-menu";
		}
		// Disable going back for edit-pane
		if (name !== ".entry-add" && name !== ".entry-menu") {
			animation.showIcon("#show-menu");
		}
		if (name === ".entry-edit" && localStorage["_cache"] == 1) {
			animation.showIcon("#reread");
		}
		animation.showIcon(name);
	}, animation.duration + 50);
};