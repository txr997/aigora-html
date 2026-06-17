/*
	Template Name: SaasRiver - SaaS & StartUp HTML Template
	Author: https://themexriver.com/
	Version: 1.0
*/


(function ($) {
"use strict";


/* 
	windows-load-function
*/


window.addEventListener('load', function(){


	if (document.querySelectorAll(".ag-preloader-1").length) {
		const loader = document.querySelector(".ag-preloader-1");
		
		setTimeout(() => {
			loader.classList.add("loaded");
			afterPreloader();
		});
		setTimeout(function () {
			loader.remove();
		}, 1500);

	} else {
		afterPreloader();
	}

	afterPageLoad();

})




/* 
	after-preloader-start
*/
function afterPreloader() {


	/* 
		only-LTR-direction
	*/
	if (getComputedStyle(document.body).direction !== "rtl") {

		if ($(".wa_btn_split").length) {
			var splitButton2 = $(".wa_btn_split");
			gsap.registerPlugin(SplitText);

			splitButton2.each(function (index, el) {
				el.split = new SplitText(el, {
					type: "words,chars",
				});

				$(el).on("mouseenter", function () {
					el.split.chars.forEach((char, i) => {
						let yValue = i % 2 === 0 ? -50 : 50;

						gsap.fromTo(
							char,
							{ y: yValue, },
							{
								y: 0,
								opacity: 1,
								duration: 0.4,
								ease: "ease1",
								delay: i * 0.05
							}
						);
					});
				});
			});
		}
		


        /* 
			section-title-1
		*/	
		if ($(".wa_title_ani_1").length) {
			var wa_title_ani_1 = $(".wa_title_ani_1");
			if (wa_title_ani_1.length == 0) return;

			gsap.registerPlugin(SplitText);

			wa_title_ani_1.each(function (index, el) {
				el.split = new SplitText(el, {
					type: "lines,words",
					linesClass: "split-line",
				});

				let delayValue = $(el).attr("data-split-delay") || "0s";
				delayValue = parseFloat(delayValue) || 0; 

				if ($(el).hasClass("wa_title_ani_1")) {
					gsap.set(el.split.words, {
						x: 30,
                        filter: "blur(5px)",
                        opacity: 0,
					});
				}

				el.anim = gsap.to(el.split.words, {
					scrollTrigger: {
						trigger: el,
						start: "top 86%",
						toggleActions: 'play none none reverse',
					},
					x: 0,
                    filter: "blur(0px)",
					opacity: 1,
					duration: 1.5,

					ease: "ease1",
					stagger: 0.08,
					delay: delayValue, 
				});
			});
		}


	}	

	// hero-1-animation
	var hero1tl = gsap.timeline();

	hero1tl.from(".ag-hero-1-img img", {
		scale: .4,
		yPercent: 60,
		duration: 1,
	});


	// hero-2-bg-animation
	if ($(".ag-hero-2-bg-img").length) {
		const hero2Bg = $(".ag-hero-2-bg-img");
		const hero2Img = hero2Bg.find("img");
		const hero2Shimmer = hero2Bg.find(".ag-hero-2-bg-shimmer");
		const hero2tl = gsap.timeline({
			onComplete: () => {
				if (typeof initWaHoverWave === "function") {
					initWaHoverWave(".ag-hero-2-bg-img.wa-hover-wave");
				} else {
					hero2Bg.addClass("is-animated");
				}
			},
		});

		gsap.set(hero2Bg, { opacity: 0, scale: 1.04 });
		gsap.set(hero2Img, { scale: 1.18, opacity: 0, filter: "blur(14px)" });

		if (hero2Shimmer.length) {
			gsap.set(hero2Shimmer, { opacity: 1 });
		}

		hero2tl
			.to(hero2Bg, { opacity: 1, scale: 1, duration: 1.1 })
			.to(hero2Img, {
				scale: 1,
				opacity: 1,
				filter: "blur(0px)",
				duration: 1,
			}, 0.15);

		if (hero2Shimmer.length) {
			hero2tl
				.to(hero2Shimmer, {
					x: "120%",
					duration: 1.2,
					ease: "power2.inOut",
				}, 0.6)
				.to(hero2Shimmer, {
					opacity: 0,
					duration: 0.4,
				}, 1.4);
		}
	}





/* 
	after-preloader-end
*/
}



/* 
	after-page-load-start
*/
function afterPageLoad() {

	/* 
		add-active-class
	*/
	const waAddClass = gsap.utils.toArray('.wa_add_class');
	waAddClass.forEach(waAddClassItem => {
		gsap.to(waAddClassItem, {
			scrollTrigger: {
				trigger: waAddClassItem,
				start: "top 90%",
				end: "bottom bottom",
				toggleActions: "play none none reverse",
				toggleClass: "active",
				once: true,
				markers: false,
			}
		});
	});



	/* 
		wow-activation
	*/
	if($('.wow').length){
		var wow = new WOW({
			boxClass:     'wow',
			animateClass: 'animated',
			offset:       100,
			mobile:       true,
			live:         true
		});
		wow.init();
	};




		

/* 
	after-page-load-start
*/
}


// header-1-menu
document.addEventListener('DOMContentLoaded', function () {
	if($(".ag-header-1-menu").length) {
		const btn = document.querySelector('.ag-offcanvas-btn-1');
		const menu = document.querySelector('.ag-header-1-menu');
		btn.addEventListener('click', function () {
			btn.classList.toggle('active');
			menu.classList.toggle('active');
		});
	}

});


// about-1-card-animation
if (window.matchMedia("(min-width: 1200px)").matches) { 
	const about1tl = gsap.timeline({
		scrollTrigger: {
		  trigger: ".ag-about-1-card", 
		  start: "top 50%", 
		  toggleActions: "play none none reverse", 
		  markers: false 
		}
	  });
	
	  about1tl.from(".ag-about-1-card .has-ani:nth-of-type(1)", { 
		yPercent: 100,
		duration: .5
	  })
	
	  about1tl.from(".ag-about-1-card .has-ani:nth-of-type(2)", { 
		yPercent: -100,
		duration: .5
	  },"<")
}

// services-tabs-animation
document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function (e) {
        const target = document.querySelector(
            e.target.getAttribute('data-bs-target')
        );

        target.classList.remove('animate__slideInUp');

        void target.offsetWidth;

        target.classList.add(
            'animate__animated',
            'animate__slideInUp'
        );
    });
});


// projects-1-animation
if ($(".wa_magnetic_1_trigger").length) {
    var waMagnets2v2 = document.querySelectorAll('.wa_magnetic_1_trigger');
    var waStrength2v2 = 30;

    waMagnets2v2.forEach((magnet) => {
        magnet.addEventListener('mousemove', moveMagnet2);
        magnet.addEventListener('mouseout', function(event) {
            const innerElements = event.currentTarget.querySelectorAll('.wa_magnetic_1_elm');
            innerElements.forEach((elm) => {
                gsap.to(elm, {
                    x: 0,
                    y: 0,
					scale: 1.05,
                    duration: 1,
                    ease: "ease1"
                });
            });
        });
    });

    function moveMagnet2(event) {
        var magnetButton = event.currentTarget;
        var bounding = magnetButton.getBoundingClientRect();
        const innerElements = magnetButton.querySelectorAll('.wa_magnetic_1_elm');

        const xMove = (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * waStrength2v2;
        const yMove = (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * waStrength2v2;

        innerElements.forEach((elm) => {
            gsap.to(elm, {
                x: xMove,
                y: yMove,
				scale: 1.05,
                duration: 1,
                ease: "ease1"
            });
        });
    }
}


// step-1-card-animation
if (window.matchMedia("(min-width: 1200px)").matches) { 
	const about1tl = gsap.timeline({
		scrollTrigger: {
		  trigger: ".ag-step-1-card", 
		  start: "top 50%", 
		  toggleActions: "play none none reverse", 
		  markers: false 
		}
	  });
	
	  about1tl.from(".ag-step-1-card .has-ani:nth-of-type(1)", { 
		yPercent: 100,
		duration: .5
	  })
	
	  about1tl.from(".ag-step-1-card .has-ani:nth-of-type(2)", { 
		yPercent: -100,
		duration: .5
	  },"<")
	
	  about1tl.from(".ag-step-1-card .has-ani:nth-of-type(3)", { 
		yPercent: 100,
		duration: .5
	  },"<")
	
	  about1tl.from(".ag-step-1-card .has-ani:nth-of-type(4)", { 
		yPercent: -100,
		duration: .5
	  },"<")
}

// features-1-animation
if (window.matchMedia("(min-width: 1200px)").matches) {


	var features1tl = gsap.timeline({
		scrollTrigger: {
			trigger: ".ag-features-1-height",
			start: "top 20%",
			end: "bottom bottom",
			toggleActions: "play none none reverse",
			scrub: true,
			markers: false,
		},
	});

	features1tl.from(".ag-features-1-content-wrap .circle-1", {
		scale: .5,
	});

	features1tl.from(".ag-features-1-content-wrap .circle-2", {
		scale: .5,
	},"<50%");

	features1tl.from(".ag-features-1-card-single", {
		// autoAlpha: 0,
		yPercent: 300,
		stagger: .1
	},"<");
	
	
}

// projects-1-animation
if (window.matchMedia("(min-width: 1200px)").matches) { 
	const project1tl = gsap.timeline({
		scrollTrigger: {
			trigger: ".ag-projects-2-area", 
			start: "top top", 
			end: "bottom bottom", 
			toggleActions: "play none none reverse", 
			scrub: true,
			markers: false 
		}
	});
	
	project1tl.to(".ag-projects-2-sec-title", { 
		filter: "blur(5px)",
		opacity: .5,
		scale: .8
	})

}

// choose-1-animation
if (window.matchMedia("(min-width: 1200px)").matches) { 
	const project1tl = gsap.timeline({
		scrollTrigger: {
			trigger: ".ag-choose-2-height", 
			start: "top 50%", 
			end: "bottom 50%", 
			toggleActions: "play none none reverse", 
			scrub: true,
			markers: false 
		}
	});
	
	project1tl.from(".ag-choose-2-item:nth-of-type(1)", { 
		xPercent: 104,
	})
	
	project1tl.from(".ag-choose-2-item:nth-of-type(2)", { 
		xPercent: 104,
	},"<")
	
	project1tl.from(".ag-choose-2-item:nth-of-type(3)", { 
		yPercent: 104,
	},"<50%")
	
	project1tl.from(".ag-choose-2-item:nth-of-type(4)", { 
		yPercent: 104,
	},"<50%")

}



// award-2-cursor-follow
if($(".ag-award-2-item").length) {
	const featureItems = document.querySelectorAll(".ag-award-2-item");

	featureItems.forEach((featureItem) => {
		const flair = featureItem.querySelector(".cursor_follow");
	
		gsap.set(flair, { scale: 0, opacity: 0, xPercent: -60, yPercent: -50, rotate: 90,  });
	
		featureItem.addEventListener("mouseenter", () => {
			gsap.to(flair, { scale: 1, opacity: 1, duration: 0.4, rotate: 90, ease: "power3.out" });
		});


		featureItem.addEventListener("mousemove", (e) => {
			const rect = featureItem.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			gsap.to(flair, { x, y, duration: 0.1 });
		});
	
		featureItem.addEventListener("mouseleave", () => {
			gsap.to(flair, { scale: 0, opacity: 0, duration: 0.4, rotate: 90, ease: "power3.in" });
		});
	});
	
}


if($(".ag-header-3-area").length) {
	const $header = $('.ag-header-3-area');
	const headerTop = $header.offset().top;
	
	$(window).on('scroll', function () {
		if ($(this).scrollTop() >= headerTop) {
			$header.addClass('has-sticky');
		} else {
			$header.removeClass('has-sticky');
		}
	});
}



})(jQuery);