/**
 * Shows the content, including emulating the UNIX console input
 */
function showContent() {
	// Add something before
	var header = "<p>(C) 2015 Runjie Guan. All rights reserved.<br/>This website only supports modern browser. </p>";

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
				} else if (i === console.length + 1) {
					// Carriage return
					$("<br/>").appendTo($("#console-content"));
					setTimeout(function() {
						$(".console").addClass("finished");

						// Start the incoming animation
						setTimeout(function() {
							animateElems();
						}, 500);
					}, 2000);
				}
			};

		// Start showing the content of the homepage
		func(0);
	}, 500);
}

/**
 * Animates the elements
 */
function animateElems() {
	// Show the link
	$("header ul").addClass("show");

	// The link on the header
	$("header a").each(function(i) {
		var $this = $(this);
		setTimeout(function() {
			$this.css({
				animation: "fadein-top .4s ease",
				opacity: 1
			});
		}, 100 * i);
	});

	// The basic description
	$("#main-frame li").each(function(i) {
		var $this = $(this);
		setTimeout(function() {
			$this.css({
				animation: "fadein-left 1s ease",
				opacity: 1
			});
		}, 100 * i);
	});
}

/**
 * Enables the scroll of header
 */
function enableResponsiveHeader() {
	// Store the previous scroll
	var prevScroll = 0;

	$(window).scroll(function() {
		var scrollTop = $(window).scrollTop();

		if (scrollTop > $("header").height()) {
			$("header").addClass("independent");

			// Only do this when the header is out of the window
			if (prevScroll > scrollTop) {
				// Scrolled up
				$("header").addClass("float");
			} else {
				// Scrolled down
				$("header").removeClass("float");
			}

			prevScroll = scrollTop;
		} else {
			// Just remove the class
			$("header").removeClass("float independent");
		}

	});
}

/**
 * Enables the smooth scroll
 */
function enableSmoothScroll() {
	$(document).delegate("a[href*=#]:not([href=#])", "click", function() {
		if (location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") &&
			location.hostname === this.hostname) {
			var target = $(this.hash);

			target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");

			if (target.length) {
				$("html, body").animate({
					scrollTop: target.offset().top
				}, 400);
				return false;
			}
		}
	});
}

/**
 * Initializes the separator
 * @returns {} 
 */
function initSeparator() {

}

// You can start with the documents ready
showContent();
enableSmoothScroll();

$(document).ready(function() {
	enableResponsiveHeader();
})
