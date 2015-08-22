/**
 * Version 1.0
 */
var oldIndex = -1,
	newIndex = -1,
	timeout = [];
$(document).ready(function() {
	/* Iterator */
	var i;
	$(".contact").hover(function() {
		var m = "runjie";
		m = "guan" + m;
		m += "@" + "gmail.com";
		$(this).html(m);
	}, function() {
		$(this).empty();
	});
	$(".wrapper").addClass("display");
	$(".wrapper").addClass("display");
	$("h1").addClass("show");
	$("h2").each(function(index) {
		var $h2 = $(this);
		setTimeout(function() {
			$h2.addClass("show");
		}, 3000 * (index + 1));
	});
	// Add page indicator for each page
	var length = $("#intro ul").length;
	for (i = 0; i !== length; ++i) {
		$("#page").append("<span></span>");
	}
	var pause = false;
	$("#page span").hover(function() {
		newIndex = $(this).index();
		pause = true;
	}, function() {
		pause = false;
	});
	// Repeatly check the change of page
	setInterval(function() {
		if (oldIndex !== newIndex) {
			// Test for validity
			if (newIndex >= 0 && newIndex < length) {
				// Clear previous timeout
				for (i = 0; i !== timeout.length; ++i) {
					clearTimeout(timeout[i]);
				}
				timeout = [];
				// Show the appropriate indicator on page
				$("#page span").removeClass("selected");
				$("#page span:nth-child(" + (newIndex + 1) + ")").addClass("selected");
				$("#intro ul:nth-child(" + (oldIndex + 1) + ")").addClass("hide");
				var subLength;
				$("#intro ul:nth-child(" + (newIndex + 1) + ")").removeClass("hide").addClass("show").children().each(function(subIndex) {
					subLength = subIndex;
					var $thisSub = $(this);
					timeout.push(setTimeout(function() {
						$thisSub.addClass("show");
					}, subIndex * 3000));
				});
				oldIndex = newIndex;
				if (newIndex !== length - 1) {
					timeout.push(setTimeout(function() {
						++newIndex;
					}, (subLength + 2) * 3000));
				}
			} else {
				// Go to replay
				newIndex = length - 1;
			}
		}
	}, 100);
	setTimeout(replay, ($("h2").length + 1) * 3000);
});

function replay() {
	oldIndex = -1;
	newIndex = -1;
	$("#intro ul:last-child").addClass("hide");
	$(".wrapper").addClass("hide");
	$("#page").addClass("show");
	setTimeout(function() {
		$("ul.show, li.show").removeClass("show hide");
		newIndex = 0;
	}, 3000);
}