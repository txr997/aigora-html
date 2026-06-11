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
					duration: 1,

					ease: "ease1",
					stagger: 0.08,
					delay: delayValue, 
				});
			});
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
			offset:       50,
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
	const btn = document.querySelector('.ag-offcanvas-btn-1');
	const menu = document.querySelector('.ag-header-1-menu');
	btn.addEventListener('click', function () {
		btn.classList.toggle('active');
		menu.classList.toggle('active');
	});
});


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


// image-animation-1
document.querySelectorAll(".vy-cover-trigger").forEach(trigger => {

	const vyct = gsap.timeline({
	  scrollTrigger: {
		trigger: trigger, 
		start: "top 85%", 
		toggleActions: "play none none reverse", 
		markers: false 
	  }
	});
  
	vyct.to(trigger.querySelectorAll(".vy-cover-slice"), 1, { 
	  height: 0, 
	  ease: "power4.InOut",
	  stagger: { amount: 0.33 } 
	}, 'start')
	
	.from(trigger.querySelector(".vy-cover-slice-img"), 1.2, { 
	  scale: 1.3, 
	  ease: "power4.InOut"
	}, 'start');

});

// features-1-svg 
if ($(".cx-about-1-features-bg-shape").length) {

	const svg = document.querySelector(".cx-about-1-features-bg-shape");
	const path = svg.querySelector(".svg-line");

	const pathLength = path.getTotalLength();

	gsap.set(path, {
		strokeDasharray: pathLength,
		strokeDashoffset: -pathLength, // reverse direction
	});

	gsap.to(path, {
		strokeDashoffset: 0,
		duration: 3,
		ease: "power2.out",
		scrollTrigger: {
			trigger: svg,
			start: "top 70%",
			// scrub: 1,
			markers: false,
		},
	});

}




// services-1-slider
if ($('.cx_services_1_slider').length) {

	const cx_services_1_slider = new Swiper('.cx_services_1_slider', {
		loop: true,
		speed: 500,
		slidesPerView: "auto",
		spaceBetween: 24,
		autoplay: { delay: 4000 },

	});
  
}



})(jQuery);