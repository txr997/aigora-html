(function (window) {
	"use strict";

	const VERTEX_SHADER = `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`;

	const FRAGMENT_SHADER = `
		uniform sampler2D uTexture;
		uniform vec2 uMouse;
		uniform vec2 uUvScale;
		uniform vec2 uUvOffset;
		uniform float uIntensity;
		varying vec2 vUv;

		void main() {
			vec2 uv = vUv * uUvScale + uUvOffset;

			if (uIntensity > 0.001) {
				vec2 mouse = uMouse * 0.5 + 0.5;
				vec2 delta = uv - mouse;
				float dist = length(delta);
				float wave = sin(dist * 20.0) * uIntensity;
				uv += normalize(delta + 0.0001) * wave;
			}

			gl_FragColor = texture2D(uTexture, clamp(uv, 0.001, 0.999));
		}
	`;

	const isDesktop = () => !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	function getCoverUv(texW, texH, contW, contH) {
		const texRatio = texW / texH;
		const contRatio = contW / contH;
		let scaleX = 1;
		let scaleY = 1;
		let offsetX = 0;
		let offsetY = 0;

		if (contRatio > texRatio) {
			scaleY = texRatio / contRatio;
			offsetY = (1 - scaleY) * 0.5;
		} else {
			scaleX = contRatio / texRatio;
			offsetX = (1 - scaleX) * 0.5;
		}

		return { scaleX, scaleY, offsetX, offsetY };
	}

	class WaHoverWave {
		constructor(el) {
			this.el = el;
			this.img = el.querySelector("img");
			this.strength = parseFloat(el.getAttribute("data-wa-hover-wave-strength")) || 0.0035;
			this.trigger = this.getTrigger();

			this.renderer = null;
			this.material = null;
			this.scene = null;
			this.camera = null;
			this.wrapEl = null;
			this.animId = null;
			this.resizeTimer = null;
			this.isReady = false;
			this.isActive = false;

			this.mouseTarget = { x: 0, y: 0 };
			this.mouseCurrent = { x: 0, y: 0 };
			this.lastClientX = 0;
			this.lastClientY = 0;
			this.movementEnergy = 0;

			this.onTriggerEnter = this.onTriggerEnter.bind(this);
			this.onTriggerMove = this.onTriggerMove.bind(this);
			this.onTriggerLeave = this.onTriggerLeave.bind(this);
			this.onResize = this.onResize.bind(this);
		}

		getTrigger() {
			const selector = this.el.getAttribute("data-wa-hover-wave-trigger");
			if (selector) {
				return document.querySelector(selector) || this.el;
			}
			return this.el;
		}

		setActive(state) {
			this.isActive = state;
			this.el.classList.toggle("is-wave-active", state);
		}

		destroy() {
			if (this.animId) {
				cancelAnimationFrame(this.animId);
				this.animId = null;
			}

			if (this.renderer) {
				this.renderer.dispose();
				this.renderer.domElement.remove();
				this.renderer = null;
			}

			if (this.material) {
				this.material.dispose();
				this.material = null;
			}

			if (this.scene) {
				this.scene.traverse((obj) => {
					if (obj.geometry) obj.geometry.dispose();
				});
				this.scene = null;
			}

			this.wrapEl?.remove();
			this.wrapEl = null;
			this.camera = null;
			this.isReady = false;
			this.setActive(false);
			this.el.classList.remove("is-wave-ready");
		}

		fail() {
			this.destroy();
		}

		animate() {
			if (!this.renderer || !this.material) return;

			this.animId = requestAnimationFrame(() => this.animate());

			// Smooth energy decay
			this.movementEnergy *= 0.88;
			if (this.movementEnergy < 0.005) {
				this.movementEnergy = 0;
			}

			// Smooth mouse follow
			this.mouseCurrent.x += (this.mouseTarget.x - this.mouseCurrent.x) * 0.08;
			this.mouseCurrent.y += (this.mouseTarget.y - this.mouseCurrent.y) * 0.08;

			this.material.uniforms.uMouse.value.set(this.mouseCurrent.x, this.mouseCurrent.y);
			this.material.uniforms.uIntensity.value = this.movementEnergy * this.strength;

			this.setActive(this.movementEnergy > 0.005);
			this.renderer.render(this.scene, this.camera);
		}

		build() {
			if (!this.img || typeof THREE === "undefined") {
				this.fail();
				return;
			}

			const rect = this.el.getBoundingClientRect();
			const w = Math.max(1, Math.round(rect.width));
			const h = Math.max(1, Math.round(rect.height));
			const imgURL = this.img.currentSrc || this.img.getAttribute("src");

			this.destroy();

			const loader = new THREE.TextureLoader();
			loader.load(
				imgURL,
				(texture) => {
					if (!texture.image || !texture.image.width) {
						this.fail();
						return;
					}

					if (window.getComputedStyle(this.el).position === "static") {
						this.el.style.position = "relative";
					}

					const cover = getCoverUv(texture.image.width, texture.image.height, w, h);

					texture.minFilter = THREE.LinearFilter;
					texture.magFilter = THREE.LinearFilter;
					texture.generateMipmaps = false;

					if (THREE.LinearSRGBColorSpace !== undefined) {
						texture.colorSpace = THREE.LinearSRGBColorSpace;
					} else if (texture.encoding !== undefined) {
						texture.encoding = THREE.LinearEncoding;
					}

					this.wrapEl = document.createElement("div");
					this.wrapEl.className = "wa-hover-wave-canvas";
					this.el.appendChild(this.wrapEl);

					this.scene = new THREE.Scene();
					this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
					this.camera.position.z = 1;

					this.material = new THREE.ShaderMaterial({
						uniforms: {
							uTexture: { value: texture },
							uMouse: { value: new THREE.Vector2(0, 0) },
							uUvScale: { value: new THREE.Vector2(cover.scaleX, cover.scaleY) },
							uUvOffset: { value: new THREE.Vector2(cover.offsetX, cover.offsetY) },
							uIntensity: { value: 0 },
						},
						vertexShader: VERTEX_SHADER,
						fragmentShader: FRAGMENT_SHADER,
						toneMapped: false,
						depthTest: false,
						depthWrite: false,
					});

					const geometry = new THREE.PlaneGeometry(2, 2);
					const mesh = new THREE.Mesh(geometry, this.material);
					this.scene.add(mesh);

					this.renderer = new THREE.WebGLRenderer({
						alpha: true,
						antialias: true,
						premultipliedAlpha: false,
						powerPreference: "high-performance",
					});
					this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
					this.renderer.setSize(w, h, false);
					this.renderer.setClearColor(0x000000, 0);
					this.renderer.toneMapping = THREE.NoToneMapping;

					if (THREE.LinearSRGBColorSpace !== undefined) {
						this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
					} else if (this.renderer.outputEncoding !== undefined) {
						this.renderer.outputEncoding = THREE.LinearEncoding;
					}

					this.wrapEl.appendChild(this.renderer.domElement);
					this.renderer.render(this.scene, this.camera);

					this.isReady = true;
					this.el.classList.add("is-wave-ready");
					this.animate();
				},
				undefined,
				() => this.fail()
			);
		}

		bindEvents() {
			this.trigger.addEventListener("mouseenter", this.onTriggerEnter);
			this.trigger.addEventListener("mousemove", this.onTriggerMove);
			this.trigger.addEventListener("mouseleave", this.onTriggerLeave);
			window.addEventListener("resize", this.onResize);
		}

		unbindEvents() {
			this.trigger.removeEventListener("mouseenter", this.onTriggerEnter);
			this.trigger.removeEventListener("mousemove", this.onTriggerMove);
			this.trigger.removeEventListener("mouseleave", this.onTriggerLeave);
			window.removeEventListener("resize", this.onResize);
		}

		onTriggerEnter(e) {
			// Fix: mouseenter এ current কে target এর সাথে sync করো — jerk বন্ধ হবে
			const rect = this.trigger.getBoundingClientRect();
			const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
			const ny = -(((e.clientY - rect.top) / rect.height - 0.5) * 2);

			this.mouseTarget.x = nx;
			this.mouseTarget.y = ny;
			this.mouseCurrent.x = nx;
			this.mouseCurrent.y = ny;

			this.lastClientX = e.clientX;
			this.lastClientY = e.clientY;
			this.movementEnergy = 0; // enter এ energy শূন্য থেকে শুরু
		}

		onTriggerMove(e) {
			const rect = this.trigger.getBoundingClientRect();
			this.mouseTarget.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
			this.mouseTarget.y = -(((e.clientY - rect.top) / rect.height - 0.5) * 2);

			const dx = e.clientX - this.lastClientX;
			const dy = e.clientY - this.lastClientY;
			const speed = Math.hypot(dx, dy);

			if (speed > 1) { // threshold বাড়ানো হয়েছে — ছোট movement ignore হবে
				this.movementEnergy = Math.min(speed * 0.06, 0.4);
			}

			this.lastClientX = e.clientX;
			this.lastClientY = e.clientY;
		}

		onTriggerLeave() {
			// Fix: হঠাৎ reset না করে smoothly fade হবে
			this.movementEnergy = 0;
			// target reset করো কিন্তু current যেখানে আছে সেখানেই থাকুক — smooth fade হবে
		}

		onResize() {
			clearTimeout(this.resizeTimer);
			this.resizeTimer = setTimeout(() => {
				if (this.isReady) this.build();
			}, 200);
		}

		init() {
			if (!this.img || !isDesktop() || prefersReducedMotion()) return this;

			this.build();
			this.bindEvents();
			return this;
		}

		destroyAll() {
			this.unbindEvents();
			this.destroy();
		}
	}

	const instances = new Map();

	window.WaHoverWave = WaHoverWave;

	window.initWaHoverWave = function (selector) {
		if (typeof THREE === "undefined") return instances;

		const elements = selector
			? document.querySelectorAll(selector)
			: document.querySelectorAll(".wa-hover-wave:not([data-wa-hover-wave-init])");

		elements.forEach((el) => {
			if (el.dataset.waHoverWaveInit === "true") return;

			el.dataset.waHoverWaveInit = "true";
			const instance = new WaHoverWave(el);
			instance.init();
			instances.set(el, instance);
		});

		return instances;
	};

	window.destroyWaHoverWave = function (selector) {
		const elements = selector
			? document.querySelectorAll(selector)
			: Array.from(instances.keys());

		elements.forEach((el) => {
			const instance = instances.get(el);
			if (instance) {
				instance.destroyAll();
				instances.delete(el);
				delete el.dataset.waHoverWaveInit;
			}
		});
	};
})(window);