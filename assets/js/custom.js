$.fn.serializeObject = function () {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || "");
		} else {
			o[this.name] = this.value || "";
		}
	});
	return o;
};

// parallax header
$("#cover-image").css("background-position", "50% 50%");
$(window).scroll(function () {
	var scroll = $(window).scrollTop(),
		slowScroll = scroll / 4,
		slowBg = 50 - slowScroll;
	if (slowBg < -125) {
		slowBg = -125
	};
	$("#cover-image").css("background-position", "50% " + slowBg + "%");
});

$(document).ready(function () {

	/* off canvas menu ======================================= */
	$(".menu-link, .close-menu").on("click", function () {
		$("#wrap").toggleClass("menu-open");

		if ($("#menu").hasClass("hidden")) {
			$("#menu").removeClass("hidden")
		} else {
			setTimeout(function () {
				$("#menu").addClass("hidden")
			}, 500);
		}

		return false;
	});
	$(".submenu a").click(function () {
		$(this).parent().toggleClass("submenu-open");
		//return false;
	});

	/* validate comment ======================================= */
	$("#mycomment").submit(function (e) {
		// Stop the browser from submitting the form.
		e.preventDefault();

		var buttonCopy = $("#mycomment button").html(),
			errorMessage = $("#mycomment button").data("error-message"),
			sendingMessage = $("#mycomment button").data("sending-message"),
			okMessage = $("#mycomment button").data("ok-message"),
			hasError = false;
		$("#mycomment .error-message").remove();
		$("#mycomment .requiredField").each(function () {
			$(this).removeClass("inputError");
			if ($.trim($(this).val()) == "") {
				var errorText = $(this).data("error-empty");
				$(this).parents(".controls").append("<span class=\"error-message\" style=\"display:none;\">" + errorText + "</span>").find(".error-message").fadeIn("fast");
				$(this).addClass("inputError");
				hasError = true;
			} else if ($(this).is("input[type=\"email\"]") || $(this).attr("name") === "email") {
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				if (!emailReg.test($.trim($(this).val()))) {
					var invalidEmail = $(this).data("error-invalid");
					$(this).parents(".controls").append("<span class=\"error-message\" style=\"display:none;\">" + invalidEmail + "</span>").find(".error-message").fadeIn("fast");
					$(this).addClass("inputError");
					hasError = true;
				}
			}
		});
		if (hasError) {
			$("#mycomment button").html("" + errorMessage).addClass("btn-error");

			setTimeout(function () {
				$("#mycomment button").removeClass("btn-error").html(buttonCopy);

			}, 2000);
		} else {
			$("#mycomment button").html("<i class=\"icon-spinner icon-spin\"></i>" + sendingMessage);

			var formData = $(this).serializeObject();
			var data = {
				name: formData.contactName,
				email: formData.email,
				message: formData.comments,
				url: window.location.href
			};

			var _this = this;

			// Submit the form using AJAX.
			$.post("https://push.dbogatov.org/api/push/dmytro", data)
				.done(function (response) {

					$("#mycomment button").html(okMessage);
					setTimeout(function () {
						$("#mycomment button").html(buttonCopy);
						$("#mycomment")[0].reset();
					}, 2000);

				});
		}
		return false;
	});

	/* wow ======================================= */
	new WOW().init({
		offset: 20
	});


	/* Bootstrap Affix ======================================= */
	$("#modal-bar").affix({
		offset: {
			top: 10,
		}
	});


	/* Smooth Hash Link Scroll ======================================= */
	$(".smooth-scroll").click(function () {
		if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
			if (target.length) {
				$("html,body").animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});

});