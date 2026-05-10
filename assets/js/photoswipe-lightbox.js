import PhotoSwipeLightbox from "https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe-lightbox.esm.min.js";

const lightbox = new PhotoSwipeLightbox({
  gallery: "main.main",
  children: "a.portfolio-lightbox",
  pswpModule: () => import("https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.esm.min.js"),
  wheelToZoom: true,
  paddingFn: () => ({
    top: 32,
    bottom: 112,
    left: window.innerWidth < 768 ? 16 : 48,
    right: window.innerWidth < 768 ? 16 : 48
  })
});

lightbox.on("uiRegister", () => {
  lightbox.pswp.ui.registerElement({
    name: "custom-caption",
    order: 9,
    isButton: false,
    appendTo: "root",
    html: "",
    onInit: (captionEl, pswp) => {
      const updateCaption = () => {
        if (!pswp.currSlide) {
          return;
        }

        const linkEl = pswp.currSlide.data.element;
        const caption = linkEl?.dataset.title || linkEl?.querySelector("img")?.alt || "";
        const imageEl = pswp.currSlide?.holderElement?.querySelector(".pswp__img");
        const imageWidth = imageEl?.getBoundingClientRect().width;

        captionEl.textContent = caption;
        captionEl.hidden = !caption;
        captionEl.style.width = imageWidth ? `${imageWidth}px` : "";
      };

      pswp.on("change", updateCaption);
      pswp.on("resize", updateCaption);
      pswp.on("zoomPanUpdate", updateCaption);
      pswp.on("openingAnimationEnd", updateCaption);
    }
  });
});

lightbox.init();
