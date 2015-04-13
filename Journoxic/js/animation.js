/* A library for animations */
window.animation = {};

animation.degree = 0;

animation.hideIcon = function(selector, callback) {
	callback = callback || function() { };
	$(selector).fadeOut(300).animate({ top: "-80px" },300,"swing", callback);
}

animation.showIcon = function(selector, callback) {
	callback = callback || function() { };
	$(selector).fadeIn(0).animate({ top: "10px" },300,"swing", callback);
}

animation.blink = function(selector) {
	var pulse = function() {
		$(selector).fadeOut(700);
		$(selector).fadeIn(700);
	}
	return setInterval(pulse, 2000);
}

animation.rotate = function(selector) {
	var pulse = function() {
		$(selector).css("-webkit-transform", "rotate(" + (++animation.degree) * 360 + "deg)");
	}
	return setInterval(pulse, 2000);
}

animation.deny = function(selector) {
	/* Keep a record of original text */
	var text = $(selector).html();
	$(selector).fadeOut(300, function() {
		$(this).html("&#xE10A");
	}).fadeIn(300).delay(500).fadeOut(300, function() {
		$(this).html(text);
	}).fadeIn(300);
}

function headerShowMenu(name) {
	// Hide everything
	animation.hideIcon(".actions a");
	if (name == "edit")
		name = ".entry-edit";
	else if (name == "add")
		name = ".entry-add";
	else if (name == "comm")
		name = ".entry-comm";
	else {
		// name == undefined or other situations
		return $(".entry-menu").each(function() {
			animation.showIcon(this);
		});
	}
	animation.showIcon("#show-menu");
	return $(name).each(function() {
		animation.showIcon(this);
	});

}

