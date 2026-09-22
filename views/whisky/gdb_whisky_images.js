(function () {
  const MAX_THUMBNAIL_WIDTH = 320;
  const MAX_THUMBNAIL_HEIGHT = 640;
  const WEBP_QUALITY = 0.80;
  const JPEG_QUALITY = 0.80;

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

  async function normalizeWebpBlob(blob) {
    if (!blob) return null;
    if ((blob.type || "").toLowerCase() === "image/webp") return blob;

    try {
      const header = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
      const isWebp =
        header.length >= 12 &&
        String.fromCharCode(...header.slice(0, 4)) === "RIFF" &&
        String.fromCharCode(...header.slice(8, 12)) === "WEBP";
      return isWebp ? new Blob([blob], { type: "image/webp" }) : null;
    } catch {
      return null;
    }
  }

  async function normalizeJpegBlob(blob) {
    if (!blob) return null;
    const type = (blob.type || "").toLowerCase();
    if (type === "image/jpeg" || type === "image/jpg") {
      return type === "image/jpeg" ? blob : new Blob([blob], { type: "image/jpeg" });
    }

    try {
      const header = new Uint8Array(await blob.slice(0, 3).arrayBuffer());
      const isJpeg = header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
      return isJpeg ? new Blob([blob], { type: "image/jpeg" }) : null;
    } catch {
      return null;
    }
  }

  function dataUrlToBlob(dataUrl, expectedType) {
    const separatorIndex = dataUrl.indexOf(",");
    if (separatorIndex === -1) return null;

    const header = dataUrl.slice(0, separatorIndex);
    if (!header.toLowerCase().startsWith(`data:${expectedType}`)) return null;

    const encoded = dataUrl.slice(separatorIndex + 1);
    const binary = header.includes(";base64")
      ? atob(encoded)
      : decodeURIComponent(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: expectedType });
  }

  async function canvasToWebpBlob(canvas) {
    if (typeof canvas.toBlob === "function") {
      const blob = await new Promise((resolve) => {
        try {
          canvas.toBlob(resolve, "image/webp", WEBP_QUALITY);
        } catch {
          resolve(null);
        }
      });
      const normalizedBlob = await normalizeWebpBlob(blob);
      if (normalizedBlob) return normalizedBlob;
    }

    if (typeof OffscreenCanvas === "function") {
      try {
        const offscreen = new OffscreenCanvas(canvas.width, canvas.height);
        const context = offscreen.getContext("2d");
        if (context) {
          context.drawImage(canvas, 0, 0);
          const blob = await offscreen.convertToBlob({
            type: "image/webp",
            quality: WEBP_QUALITY
          });
          const normalizedBlob = await normalizeWebpBlob(blob);
          if (normalizedBlob) return normalizedBlob;
        }
      } catch {
        // Der Data-URL-Fallback wird als Nächstes versucht.
      }
    }

    try {
      const blob = dataUrlToBlob(canvas.toDataURL("image/webp", WEBP_QUALITY), "image/webp");
      const normalizedBlob = await normalizeWebpBlob(blob);
      if (normalizedBlob) return normalizedBlob;
    } catch {
      // Die eindeutige Fehlermeldung folgt unterhalb.
    }

    if (typeof canvas.toBlob === "function") {
      const blob = await new Promise((resolve) => {
        try {
          canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
        } catch {
          resolve(null);
        }
      });
      const normalizedBlob = await normalizeJpegBlob(blob);
      if (normalizedBlob) return normalizedBlob;
    }

    try {
      const blob = dataUrlToBlob(canvas.toDataURL("image/jpeg", JPEG_QUALITY), "image/jpeg");
      const normalizedBlob = await normalizeJpegBlob(blob);
      if (normalizedBlob) return normalizedBlob;
    } catch {
      // Die eindeutige Fehlermeldung folgt unterhalb.
    }

    throw new Error("Thumbnail konnte weder als WebP noch als JPEG erzeugt werden.");
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
