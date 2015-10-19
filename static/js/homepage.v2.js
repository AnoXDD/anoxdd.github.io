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
 * Animates a DOM object to its auto height
 * @param {object} element - The element to adjust the height
 */
function animateHeightToAuto(element) {
	$(element).each(function() {
		var curHeight = $(this).height(),
			autoHeight = $(this).css("height", "auto").height();

		$(this).height(curHeight).animate({ height: autoHeight }, 0);
	});
}

/**
 * Animates a DOM object to its original height
 * @param {object} element - The element to adjust the height
 */
function animateHeightToOriginal(element) {
	$(element).each(function() {
		$(this).height("");
	});

}

/**
 * Enables the ripple effect
 */
function enableRippleEffect() {
	$(document).delegate("a:not(.no-ripple), input[type=checkbox] + label, input[type=radio] + label", "click", function(e) {
		var d;
		// Find if any ripple effect is in it
		if ($(this).find(".ink").length === 0) {
			$(this).prepend("<span class='ink'></span>");
		}

		// Select the only one ripple effect
		var $ink = $(this).find(".ink");
		$ink.removeClass("ripple-animate");

		if (!$ink.height() && !$ink.width()) {
			d = Math.max($(this).outerWidth(), $(this).outerHeight());
			$ink.css({
				height: d,
				width: d
			});
		}

		// Animate the stuffs
		var x = e.pageX - $(this).offset().left - $ink.width() / 2;
		var y = e.pageY - $(this).offset().top - $ink.height() / 2;

		$ink.css({ top: y + "px", left: x + "px" }).addClass("ripple-animate");
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
 * Enables the toggle of project detail
 * @returns {} 
 */
function enableToggleProjectDetail() {
	$(".project-wrapper").each(function() {
		// Prepend a toggle to each one
		var $this = $(this),
			$toggle = $("<a class='toggle'></a>"),
			isExpand = false;

		$toggle.prependTo($(this)).click(function() {
			// Toggle the class
			$(this).toggleClass("expand");

			if (isExpand) {
				// Hide the selection
				animateHeightToOriginal($this);
			} else {
				// Show the selection
				animateHeightToAuto($this);
			}

			// Change its status
			isExpand = !isExpand;
		});
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
	enableToggleProjectDetail();
	enableRippleEffect();
})
