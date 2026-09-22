(function () {
  const MAX_THUMBNAIL_WIDTH = 320;
  const MAX_THUMBNAIL_HEIGHT = 640;
  const WEBP_QUALITY = 0.80;

  function getTargetSize(width, height) {
    const scale = Math.min(
      1,
      MAX_THUMBNAIL_WIDTH / width,
      MAX_THUMBNAIL_HEIGHT / height
    );

    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale))
    };
  }

  function canvasToWebpBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob || blob.type !== "image/webp") {
          reject(new Error("WebP-Thumbnail konnte nicht erzeugt werden."));
          return;
        }
        resolve(blob);
      }, "image/webp", WEBP_QUALITY);
    });
  }

  function loadImageFallback(file) {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => resolve({ image, objectUrl });
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Bilddatei konnte nicht gelesen werden."));
      };
      image.src = objectUrl;
    });
  }

  async function createThumbnail(file) {
    if (!(file instanceof Blob)) {
      throw new Error("Keine gültige Bilddatei ausgewählt.");
    }

    let source = null;
    let width = 0;
    let height = 0;
    let closeSource = () => {};

    if (typeof createImageBitmap === "function") {
      try {
        const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
        source = bitmap;
        width = bitmap.width;
        height = bitmap.height;
        closeSource = () => bitmap.close();
      } catch {
        source = null;
      }
    }

    if (!source) {
      const fallback = await loadImageFallback(file);
      source = fallback.image;
      width = fallback.image.naturalWidth;
      height = fallback.image.naturalHeight;
      closeSource = () => URL.revokeObjectURL(fallback.objectUrl);
    }

    try {
      if (!width || !height) {
        throw new Error("Bildabmessungen konnten nicht ermittelt werden.");
      }

      const target = getTargetSize(width, height);
      const canvas = document.createElement("canvas");
      canvas.width = target.width;
      canvas.height = target.height;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Canvas ist nicht verfügbar.");
      }

      context.drawImage(source, 0, 0, target.width, target.height);
      return await canvasToWebpBlob(canvas);
    } finally {
      closeSource();
    }
  }

  window.GdbWhiskyImages = {
    createThumbnail
  };
})();
