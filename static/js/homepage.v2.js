/**
 * Shows the content, including emulating the UNIX console input
 */
function showContent() {
	// Add something before
	var header = "<p>(C) 2015 Runjie Guan. All rights reserved.\n</p>"
	setTimeout(function() {
		// Add to header
		$(header).prependTo(".console");

		// Show console input
		var console = "ls -a",
			func = function(i) {
				if (i !== console.length + 1) {
					setTimeout(function() {
						$("#console-content").html(console.substr(0, i));
						func(++i);
					}, 200);
				} else if (i === console.length+ 1) {
					// Carriage return
					$("<br/>").appendTo($("#console-content"));
					setTimeout(function() {
						$(".console").addClass("finished");
					}, 2000);
				}
			};

		// Start showing the content of the homepage
		func(0);
	}, 500);
}

// You can start with the documents ready
showContent();
