"use client";

import { useEffect, useRef } from "react";

/**
 * CropCanvas component for interactive image cropping.
 */
export function CropCanvas({
  src,
  aspect,
  scale,
  offset,
  onOffsetChange,
  onScaleInit,
  disabled = false,
}) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imgRef.current = img;
      if (onScaleInit) {
        // Canvas dimensions based on numeric aspect ratio
        const baseWidth = 640;
        const cw = aspect >= 1 ? baseWidth : baseWidth * aspect;
        const ch = aspect >= 1 ? baseWidth / aspect : baseWidth;
        const s = Math.max(cw / img.width, ch / img.height);
        onScaleInit(s);
      }
      renderToCanvas();
    };
  }, [src, aspect]);

  useEffect(() => {
    renderToCanvas();
  }, [scale, offset, aspect]);

  const renderToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);
    ctx.save();
    ctx.translate(cw / 2 + offset.x, ch / 2 + offset.y);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  };

  const startDrag = (x, y) => {
    if (disabled) return;
    dragRef.current = { x, y, ox: offset.x, oy: offset.y };
  };

  const moveDrag = (x, y) => {
    if (disabled || !dragRef.current) return;
    const dx = x - dragRef.current.x;
    const dy = y - dragRef.current.y;
    onOffsetChange({
      x: dragRef.current.ox + dx,
      y: dragRef.current.oy + dy,
    });
  };

  const onUp = () => {
    dragRef.current = null;
  };

  const onPointerDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    startDrag(e.clientX - rect.left, e.clientY - rect.top);
    canvasRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (disabled || !dragRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    moveDrag(e.clientX - rect.left, e.clientY - rect.top);
  };

  const onPointerUp = (e) => {
    onUp();
    canvasRef.current.releasePointerCapture(e.pointerId);
  };

  const onTouchStart = (e) => {
    if (disabled) return;
    if (e.touches.length !== 1) return;
    // touchAction: none on canvas handles scroll prevention
    const rect = canvasRef.current.getBoundingClientRect();
    startDrag(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
  };

  const onTouchMove = (e) => {
    if (disabled) return;
    if (e.touches.length !== 1) return;
    // touchAction: none on canvas handles scroll prevention
    const rect = canvasRef.current.getBoundingClientRect();
    moveDrag(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
  };

  const baseWidth = 640;
  const cw = aspect >= 1 ? baseWidth : baseWidth * aspect;
  const ch = aspect >= 1 ? baseWidth / aspect : baseWidth;

  return (
    <canvas
      ref={canvasRef}
      width={cw}
      height={ch}
      style={{
        maxWidth: "100%",
        maxHeight: "70vh",
        background: "#000",
        cursor: disabled ? "default" : "move",
        borderRadius: 8,
        display: "block",
        margin: "0 auto",
        touchAction: "none", // Prevent browser scroll/zoom during touch
        opacity: disabled ? 0.8 : 1,
      }}
      onPointerDown={disabled ? undefined : onPointerDown}
      onPointerMove={disabled ? undefined : onPointerMove}
      onPointerUp={disabled ? undefined : onPointerUp}
      onTouchStart={disabled ? undefined : onTouchStart}
      onTouchMove={disabled ? undefined : onTouchMove}
      onTouchEnd={disabled ? undefined : onUp}
    />
  );
}

/**
 * Renders a cropped image to a data URL.
 */
export async function renderCropToDataUrl(src, aspect, scale, offset) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Allow CORS for data URLs
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const baseWidth = 1280;
        // Handle all aspect ratios including square (1)
        const cw = aspect >= 1 ? baseWidth : baseWidth * aspect;
        const ch = aspect >= 1 ? baseWidth / aspect : baseWidth;
        canvas.width = Math.round(cw);
        canvas.height = Math.round(ch);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Scale coordinate mapping (output / preview canvas size)
        const previewBaseWidth = 640;
        const previewCw = aspect >= 1 ? previewBaseWidth : previewBaseWidth * aspect;
        const renderScale = cw / previewCw;

        ctx.save();
        ctx.translate(canvas.width / 2 + offset.x * renderScale, canvas.height / 2 + offset.y * renderScale);
        ctx.scale(scale * renderScale, scale * renderScale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        const dataUrl = canvas.toDataURL("image/png");
        if (!dataUrl || dataUrl === "data:,") {
          reject(new Error("Failed to generate image data URL"));
          return;
        }
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => {
      reject(new Error("Failed to load image for cropping"));
    };
    img.src = src;
  });
}

/**
 * Downloads an image from a URL or data URL.
 */
export async function downloadImage(url, fileName) {
  try {
    let blob;

    // Case 1: Data URL (base64)
    if (/^data:image\//i.test(url)) {
      const r = await fetch(url);
      blob = await r.blob();
    }
    // Case 2: Already a proxy URL
    else if (url.includes('/api/labsflow/download')) {
      const r = await fetch(url);
      if (!r.ok) {
        throw new Error(`Download failed: ${r.status}`);
      }
      // Check if response is actually an image
      const contentType = r.headers.get('content-type') || '';
      if (!contentType.includes('image')) {
        // Try to get the original URL and download directly
        const text = await r.text();
        console.error("Proxy returned non-image:", contentType, text.slice(0, 100));
        throw new Error("Proxy returned non-image content");
      }
      blob = await r.blob();
    }
    // Case 3: External URL - use proxy
    else {
      const r = await fetch(`/api/labsflow/download?url=${encodeURIComponent(url)}`);
      if (!r.ok) {
        throw new Error(`Download failed: ${r.status}`);
      }
      const contentType = r.headers.get('content-type') || '';
      if (!contentType.includes('image')) {
        console.error("Proxy returned non-image:", contentType);
        throw new Error("Proxy returned non-image content");
      }
      blob = await r.blob();
    }

    // Verify we have a valid image blob
    if (!blob || blob.size === 0) {
      throw new Error("Downloaded blob is empty");
    }

    // Determine correct file extension from blob type
    let ext = 'png';
    if (blob.type.includes('jpeg') || blob.type.includes('jpg')) ext = 'jpg';
    else if (blob.type.includes('webp')) ext = 'webp';
    else if (blob.type.includes('gif')) ext = 'gif';

    const finalFileName = fileName?.replace(/\.[^.]+$/, '') + '.' + ext || `image.${ext}`;

    const a = document.createElement("a");
    const href = URL.createObjectURL(blob);
    a.href = href;
    a.download = finalFileName;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(href);
    a.remove();
  } catch (e) {
    console.error("Download failed:", e);
    alert(`Download gagal: ${e.message}`);
  }
}
