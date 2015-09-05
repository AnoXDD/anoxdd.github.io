﻿/**
 * In charge of comment section of the entries
 */

window.comment = {};

/**
 * Initialize the comment panel
 */
comment.init = function() {
	$("#app").addClass("comment");
	animation.showMenuOnly("comment");
}

/**
 * Adds a comment by giving an optional parameter of the timestemp of the comment it replies to 
 */
comment.add = function() {
	// Adds to the date
	var newComment = {
		content: ("#comment-input-wrapper input").val(),
		time: new Date().getTime()
	};
	if (journal.archive.data[app.year][app.currentDisplayed]["comments"]) {
		journal.archive.data[app.year][app.currentDisplayed]["comments"].push(newComment);
	} else {
		journal.archive.data[app.year][app.currentDisplayed]["comments"] = [newComment];
	}
	// Todo Show on the screen
}

/**
 * Removes a comment
 * The target comment will be selected by searching .selected class on each comment
 */
comment.remove = function() {
	// Search the selected comment
	var commentIndex = $("#comment-list > ul > li.selected").index(),
		replyIndex = $(".comment-replies > ul > li.selected").index();
	if (commentIndex === -1) {
		// No comment is selected
		return;
	}
	if (replyIndex === -1) {
		// Delete the entire comment
		journal.archive.data[app.year][app.currentDisplayed]["comments"].splice(commentIndex, 1);
		// Todo Process the DOM element
	} else {
		// Delete specific reply
		journal.archive.data[app.year][app.currentDisplayed]["comments"][commentIndex]["replies"].splice(replyIndex, 1);
		// Todo process the DOM element
	}
}

/**
 * Replies the comment that is currently selected
 * The target comment will be selected by searching .selected class on each comment
 */
comment.reply = function() {
	var commentIndex = $("#comment-list > ul > li.selected").index();
	if (commentIndex === -1) {
		// No comment is selected
		return;
	}
	var reply = {
		content: ("#comment-input-wrapper input").val(),
		time: new Date().getTime()
	};
	if (journal.archive.data[app.year][app.currentDisplayed]["comments"][commentIndex]["replies"]) {
		journal.archive.data[app.year][app.currentDisplayed]["comments"][commentIndex]["replies"].push(reply);
	} else {
		journal.archive.data[app.year][app.currentDisplayed]["comments"][commentIndex]["replies"] = [reply];
	}
	// Todo process the DOM element
}

/**
 * Quits the comment panel
 */
comment.quit = function() {
	$("#app").removeClass("comment");
	animation.showMenuOnly();
}