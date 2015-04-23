/* A library for animations */
window.animation = {};

animation.degree = 0;

animation.hideIcon = function(selector, callback) {
	callback = callback || function() { };
	$(selector).fadeOut(200).animate({ top: "-80px" }, 200, "swing", callback);
};

animation.showIcon = function(selector, callback) {
	callback = callback || function() { };
	$(selector).fadeIn(0).animate({ top: "10px" }, 200, "swing", callback);
};

animation.isShown = function(selector) {
	return $(selector).css("top") == "10px";
}

animation.toggleIcon = function(selector, callback) {
	callback = callback || function() { };
	if (animation.isShown(selector))
		animation.hideIcon(selector, callback);
	else
		animation.showIcon(selector, callback);
}

/* Set the name of confirm */
animation.setConfirm = function(name) {
	if (name == edit.confirmName) {
		// Do not need to follow the steps below, just toggle it
		animation.toggleIcon("#confirm");
		if (typeof (name) == "number") {
			switch (name) {
				case 2:
					// Place
					animation.toggleIcon("#pin-point");
					break;
			}
		} 
		return;
	}
	// Start a new one
	animation.hideIcon(".entry-option", function() {
		var title;
		// Change how it looks
		if (typeof (name) == "number") {
			$("#confirm").html("&#xE106");
			title = "Remove this medium";
			switch (name) {
				case 2:
					// Place
					animation.showIcon("#pin-point");
					break;
			}
		} else {
			$("#confirm").html("&#xE10B");
		}
		animation.showIcon("#confirm");
		if (name == "delete") {
			title = "Confirm to remove this entry";
		} else if (name == "discard") {
			title = "Discard this entry";
		} else if (name == "add") {
			title = "Overwrite saved data to create a new entry"
		} else if (name == "edit") {
			title = "Overwrite saved data to edit this entry"
		} else if (name == "save") {
			title = "Save entry";
		}
		if (title == undefined)
			// Not a valid call
			return;
		$("#confirm").css("title", title);
		edit.confirmName = name;
	});
}

/* Return undefined if it is not shown */
animation.blink = function(selector) {
	if (animation.isShown(selector)) {
		var pulse = function() {
			$(selector).fadeOut(700);
			$(selector).fadeIn(700);
		}
		return setInterval(pulse, 1800);
	} else {
		return undefined;
	}
};


/* Return undefined if it is not shown */
animation.rotate = function(selector) {
	if (animation.isShown(selector)) {
		var pulse = function() {
			$(selector).css("-webkit-transform", "rotate(" + (++animation.degree) * 360 + "deg)");
		};
		return setInterval(pulse, 2000);
	} else {
		return undefined;
	}
};

animation.finished = function(selector) {
	if (animation.isShown(selector)) {
		/* Keep a record of original text */
		var text = $(selector).html();
		$(selector).fadeOut(300, function() {
			$(this).html("&#xE10B").css({ background: "#fff" });
		}).fadeIn(300).delay(500).fadeOut(300, function() {
			$(this).html(text).css({ background: "" });
		}).fadeIn(300);
	}
}

animation.deny = function(selector) {
	if (animation.isShown(selector)) {
		/* Keep a record of original text */
		var text = $(selector).html();
		$(selector).fadeOut(300, function() {
			$(this).html("&#xE10A").css({ color: "#000", background: "#fff" });
		}).fadeIn(300).delay(500).fadeOut(300, function() {
			$(this).html(text).css({ background: "", color: "" });
		}).fadeIn(300);
	}
};

function headerShowMenu(name) {
	animation.hideIcon(".actions a");
	if (name == "edit")
		name = ".entry-edit";
	else if (name == "add")
		name = ".entry-add";
	else if (name == "comm")
		name = ".entry-comm";
	else
		// name == undefined or other situations
		name = ".entry-menu";
	// Disable going back for edit-pane
	if (name != ".entry-add" && name != ".entry-menu")
		animation.showIcon("#show-menu");
	if (name == ".entry-edit" && localStorage["_cache"] == 1)
		animation.showIcon("#reread");
	animation.showIcon(name);
};

