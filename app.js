/**
 * Version 1.0
 */
$(document).ready(function() {
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
	setTimeout(replay, ($("h2").length + 1) * 3000);
});

function replay() {
	$("ul.show, li.show").removeClass("show hide");
	setTimeout(function() {
		$(".wrapper").addClass("hide");

		// Calculate the delay time
		var delays = [0];
		$("#intro ul").each(function(index) {
			delays.push(delays[index] + 3000 * ($(this).children().length + 1));
		});
		setTimeout(function() {
			/* Change the value to adjust the time for changes, 3000*(elem+1) */
			var clear = [0, 0, 0, 0],
				currentDisplay = -1;
			$("#intro ul").each(function(index) {
				var $this = $(this);
				setTimeout(function() {
					currentDisplay = index;
				}, delays[index]);
				clear[index] = setInterval(function() {
					if (currentDisplay === index) {
						$("ul.show").addClass("hide");
						// Time to display it
						$this.addClass("show").children().each(function(subIndex) {
							var $thisSub = $(this);
							setTimeout(function() {
								$thisSub.addClass("show");
							}, subIndex * 3000);
						});
						clearInterval(clear[index]);
					}
				}, 100);
			});
		}, 3000);

	}, 1000);

}