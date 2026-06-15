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


	// hero-3-slider-function
	if ($('.cx_h2_slider_active').length) {

		const WA_DISP_IMG = "assets/img/hero/h3-img-shape.png";
		let pixiApp = null;
		let currentDispSprite = null;
		let resizeTimer = null;
		const textureCache = {};

		function preloadTextures(urls, callback) {
			const loader = new PIXI.Loader();
			const toLoad = [];

			if (!textureCache['waDisp'] && !PIXI.utils.TextureCache[WA_DISP_IMG]) {
				toLoad.push({ key: 'waDisp', url: WA_DISP_IMG });
			}

			urls.forEach((url) => {
				if (
					url &&
					!textureCache[url] &&
					!PIXI.utils.TextureCache[url] &&
					!toLoad.find(item => item.url === url)
				) {
					toLoad.push({ key: url, url: url });
				}
			});

			if (toLoad.length === 0) {
				if (!textureCache['waDisp'] && PIXI.utils.TextureCache[WA_DISP_IMG]) {
					textureCache['waDisp'] = PIXI.utils.TextureCache[WA_DISP_IMG];
				}
				urls.forEach(url => {
					if (url && !textureCache[url] && PIXI.utils.TextureCache[url]) {
						textureCache[url] = PIXI.utils.TextureCache[url];
					}
				});
				return callback();
			}

			toLoad.forEach(item => loader.add(item.key, item.url, { crossOrigin: true }));

			loader.load((ldr, res) => {
				if (!textureCache['waDisp']) {
					if (res['waDisp']) {
						textureCache['waDisp'] = res['waDisp'].texture;
					} else if (PIXI.utils.TextureCache[WA_DISP_IMG]) {
						textureCache['waDisp'] = PIXI.utils.TextureCache[WA_DISP_IMG];
					}
				}
				urls.forEach(url => {
					if (url && !textureCache[url]) {
						if (res[url]) {
							textureCache[url] = res[url].texture;
						} else if (PIXI.utils.TextureCache[url]) {
							textureCache[url] = PIXI.utils.TextureCache[url];
						}
					}
				});
				callback();
			});

			loader.onError.add((err) => {
				console.warn("PIXI Loader error:", err);
				callback();
			});
		}

		function getOrCreateApp(imgWrap, w, h) {
			if (pixiApp) {
				pixiApp.renderer.resize(w, h);

				const existingWrap = document.querySelector(".wa-pixi-wrap");
				if (existingWrap && existingWrap.parentNode !== imgWrap) {
					imgWrap.appendChild(existingWrap);
				}
				return pixiApp;
			}

			const wrap = document.createElement("div");
			wrap.className = "wa-pixi-wrap";
			wrap.style.cssText = "position:absolute;inset:0;z-index:1;pointer-events:none;will-change:transform;";
			imgWrap.appendChild(wrap);

			pixiApp = new PIXI.Application({
				width: w,
				height: h,
				transparent: true,
				autoDensity: true,
				resolution: window.devicePixelRatio || 1,
				powerPreference: "high-performance",
			});

			pixiApp.view.style.cssText = "pointer-events:none;will-change:transform;";
			wrap.appendChild(pixiApp.view);

			return pixiApp;
		}

		function runGlassyEffect(swiper) {
			const activeSlide = swiper.slides[swiper.activeIndex];
			if (!activeSlide) return;

			const imgEl = activeSlide.querySelector(".cx-hero-2-item-img img");
			const imgWrap = activeSlide.querySelector(".cx-hero-2-item-img");
			if (!imgEl || !imgWrap) return;

			if (window.getComputedStyle(imgWrap).position === "static") {
				imgWrap.style.position = "relative";
			}

			const rect = imgWrap.getBoundingClientRect();
			const w = Math.max(1, Math.round(rect.width));
			const h = Math.max(1, Math.round(rect.height));

			const imgURL = imgEl.getAttribute("src");
			const heroTexture = textureCache[imgURL];
			const dispTexture = textureCache['waDisp'];

			if (!heroTexture || !dispTexture) return;

			document.querySelectorAll(".cx-hero-2-item-img img").forEach(img => {
				img.style.opacity = "1";
			});
			imgEl.style.opacity = "0";

			const app = getOrCreateApp(imgWrap, w, h);
			app.stage.removeChildren();

			const stageContainer = new PIXI.Container();
			app.stage.addChild(stageContainer);

			const hero = new PIXI.Sprite(heroTexture);
			stageContainer.addChild(hero);

			const texRatio = hero.texture.width / hero.texture.height;
			const contRatio = w / h;
			if (contRatio > texRatio) {
				hero.width = w;
				hero.height = w / texRatio;
			} else {
				hero.height = h;
				hero.width = h * texRatio;
			}
			hero.x = (w - hero.width) / 2;
			hero.y = (h - hero.height) / 2;

			if (currentDispSprite) {
				try { currentDispSprite.destroy(); } catch(e){}
			}
			const dispSprite = new PIXI.Sprite(dispTexture);
			dispSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
			dispSprite.scale.set(1.5);
			currentDispSprite = dispSprite;

			const dispFilter = new PIXI.filters.DisplacementFilter(dispSprite);
			app.stage.addChild(dispSprite);
			stageContainer.filters = [dispFilter];

			gsap.killTweensOf(dispFilter.scale);
			gsap.fromTo(
				dispFilter.scale,
				{ x: 300, y: 0 },
				{
					x: 0,
					y: 0,
					duration: 1.5,
					ease: "expo.out",
					onComplete: () => {
						stageContainer.filters = [];
						app.ticker.stop();
					}
				}
			);

			app.ticker.stop();
			app.ticker.start();
		}

		function initGlassyEffect(swiperInstance) {
			const imageURLs = [];
			document.querySelectorAll(".cx-hero-2-item-img img").forEach(img => {
				const src = img.getAttribute("src");
				if (src) imageURLs.push(src);
			});

			preloadTextures(imageURLs, () => {
				requestAnimationFrame(() => runGlassyEffect(swiperInstance));

				swiperInstance.on("slideChangeTransitionStart", () => {
					runGlassyEffect(swiperInstance);
				});

				window.addEventListener("resize", () => {
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(() => {
						runGlassyEffect(swiperInstance);
					}, 200);
				});

				swiperInstance.on("destroy", () => {
					if (pixiApp) {
						try { pixiApp.destroy(true, { children: true, texture: false, baseTexture: false }); } catch(e){}
						pixiApp = null;
					}
				});
			});
		}

		const isDesktop = !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

		var cx_h2_slider_active = new Swiper(".cx_h2_slider_active", {
			loop: true,
			speed: 1000,
			effect: "fade",
			fadeEffect: { crossFade: true },
			autoplay: { delay: 5000 },
			navigation: {
				nextEl: ".cx_hero_2_next",
				prevEl: ".cx_hero_2_prev",
			},
			pagination: {
				el: ".cx_h2_slider_pagination",
				clickable: true,
			},
			on: {
				init: function () {
					// setTimeout(() => { this.slideNext(); }, 0);

					if (isDesktop) {
						initGlassyEffect(this); 
					}

					updatePagination(this);
				},

				slideChange: function () {
					updatePagination(this);
				},
			}
		});


		function updatePagination(swiper) {

			// Current
			const currentSlide = swiper.realIndex + 1;
		
			// Total
			const totalSlides = swiper.wrapperEl.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)").length;
		
			$(".current-number").text(
				String(currentSlide).padStart(2, "0")
			);
		
			$(".total-number").text(
				String(totalSlides).padStart(2, "0")
			);
		}

	}

	
	// hero-3-slider-function
	if ($('.cx_h3_slider').length) {

		var cx_h3_slider = new Swiper(".cx_h3_slider", {
			loop: true,
			speed: 800,
			spaceBetween: 0,
			slidesPerView: 1,
			autoplay: { delay: 4000 },

			effect: "creative",
			creativeEffect: {
				prev: {
					shadow: true,
					translate: [0, 0, -800],
					rotate: [180, 0, 0],
				},
				next: {
					shadow: true,
					translate: [0, 0, -800],
					rotate: [-180, 0, 0],
				},
			},

			pagination: {
				el: ".cx_h3_slider_pagination",
				clickable: true,
			},

			on: {
				init: function () {
					setTimeout(() => {
						this.slideNext();
					}); 
				},
			},
		});

	
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


})(jQuery);