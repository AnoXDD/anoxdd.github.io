/* The script for editing anything */

window.edit = {};
/* The index of the entry being edited. Set to -1 to save a new entry */
edit.currentEditing = -1;

edit.init = function(index) {
	if (index)
		edit.currentEditing = index;
	// Content processing
	$(".header div").fadeOut();
	$("#contents").fadeOut(400, function() {
		$("#edit-pane").fadeIn();
	});
	headerShowMenu("add");
}

edit.fullScreen = function() {
	// Disable auto-height
	$(window).off("resize");
	// Change the icon
	animation.hideIcon(".actions a", function() {
		$("#toggle-screen").html("&#xE1D8").attr("title", "Back to window").click(edit.windowMode);
	});
	animation.showIcon("#toggle-screen");
	// Add the icon
	animation.showIcon("#toggle-light");
	// Hide the other part
	$(".header").fadeOut();
	$("#attach-area").fadeOut(400, function() {
		$("#text-area").animate({ width: "99%" });
	});
	$("#app").animate({ top: "2%", height: "95%" });
	$("#text-area").each(function() {
		$(this).toggleClass("fullscreen");
	});
}

edit.windowMode = function() {
	// Re-enable auto-height
	app.layout();
	// Change the icon
	headerShowMenu("add");
	$("#toggle-screen").html("&#xE1D9").attr("title", "Go fullscreen").click(edit.fullScreen);
	// Resize
	$(".header").fadeIn();
	$("#app").animate({ top: "8%", height: "76%" });
	$("#text-area").toggleClass("fullscreen").animate({ width: "64%" }, function() {
		$("#attach-area").fadeIn();
	});
}

edit.quit = function(save) {
	// Content processing
	$(".header div").fadeIn();
	$("#edit-pane").fadeOut(400, function() {
		$("#contents").fadeIn();
	});
	headerShowMenu("edit");
}