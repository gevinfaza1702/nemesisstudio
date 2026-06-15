"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export function useImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [images, setImages] = useState([]);
  const [aspect, setAspect] = useState("landscape");
  const [count, setCount] = useState(1);
  const [model, setModel] = useState("imagen-4");
  const [projectId, setProjectId] = useState("");
  const [refs, setRefs] = useState([null, null, null]);
  const [refPreviews, setRefPreviews] = useState([]);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropImg, setCropImg] = useState(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [cropAspect, setCropAspect] = useState(aspect);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedMediaId, setUploadedMediaId] = useState("");
  const [showRefSection, setShowRefSection] = useState(false);
  const [plan, setPlan] = useState("free");
  const [isFree, setIsFree] = useState(true);

  // Stats helper
  const bumpStat = (key) => {
    try {
      const v = parseInt(localStorage.getItem(key) || "0", 10) || 0;
      localStorage.setItem(key, String(v + 1));
    } catch (_) { }
  };

  // Fetch Config (SADIS Mode: With Fallback)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/config");
        if (!r.ok) throw new Error("Config fetch failed");
        const d = await r.json();
        if (mounted) setProjectId(d?.clientContext?.projectId || "");
      } catch (e) {
        console.warn("Using default project ID due to:", e.message);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Fetch Plan & Auth
  useEffect(() => {
    (async () => {
      try {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const fetchPlan = async (retryCount = 0) => {
          try {
            const resp = await fetch("/api/me/plan", {
              headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (!resp.ok && retryCount < 2) return fetchPlan(retryCount + 1);
            const d = await resp.json();
            const p = String(d?.plan || "free").toLowerCase();
            setPlan(p);
            setIsFree(p === "free");
          } catch (_) {
            setPlan("free");
          }
        };
        fetchPlan();
      } catch (_) { }
    })();
  }, []);

  /**
   * SADIS Mode API Wrapper: Robust fetching with auto-retry
   */
  const sadisFetch = async (url, options, retries = 2) => {
    try {
      const res = await fetch(url, options);
      if (!res.ok && retries > 0) {
        setStatus(`Retrying... (${3 - retries})`);
        return sadisFetch(url, options, retries - 1);
      }
      return res;
    } catch (e) {
      if (retries > 0) return sadisFetch(url, options, retries - 1);
      throw e;
    }
  };

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const pickFileForSlot = async (slot, files) => {
    try {
      const f = Array.from(files || []).filter(f => f.type.startsWith("image/"))[0];
      if (!f) return;
      const dataUrl = await readFileAsDataUrl(f);
      setCropImg({ dataUrl, fileName: f.name, slot });
      setCropAspect(aspect); // Initialize with current aspect ratio
      setUploadStatus("");
      setUploadedMediaId("");
      setCropOpen(true);
    } catch (e) {
      setStatus(`Pick Error: ${e.message}`);
    }
  };

  const uploadRefSlot = async (slot) => {
    const rp = refPreviews[slot];
    if (!rp) return;
    setStatus("Uploading reference...");
    try {
      const du = rp.dataUrl || await fetch(rp.url).then(r => r.blob()).then(readFileAsDataUrl);
      await uploadDataUrlAsRef(slot, du, rp.fileName);
      setStatus("Reference uploaded.");
    } catch (e) {
      setStatus(`Upload Error: ${e.message}`);
    }
  };

  const clearRefSlot = (slot) => {
    const nextPrev = [...refPreviews];
    const nextRefs = [...refs];
    nextPrev[slot] = null;
    nextRefs[slot] = null;
    setRefPreviews(nextPrev);
    setRefs(nextRefs);
  };

  const uploadDataUrlAsRef = async (slot, dataUrl, fileName) => {
    const aspectKey = cropAspect === "landscape" ? "IMAGE_ASPECT_RATIO_LANDSCAPE" : cropAspect === "portrait" ? "IMAGE_ASPECT_RATIO_PORTRAIT" : "IMAGE_ASPECT_RATIO_SQUARE";

    try {
      setUploadStatus("Mengupload ke Labs...");
      setUploadedMediaId("");

      const resp = await fetch("/api/labs/upload_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, dataUrl, imageAspectRatio: aspectKey }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const errorMsg = data?.detail || data?.error || data?.message || `Upload failed (${resp.status}: ${resp.statusText})`;
        throw new Error(errorMsg);
      }

      const mediaId = data?.mediaId || data?.upload?.metadata?.name || data?.upload?.name;

      if (!mediaId) {
        throw new Error("Media ID not found in response");
      }

      setUploadStatus("Menyimpan ke galeri...");

      let galleryUrl = "";
      const upResp = await fetch("/api/upload_base64", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, dataUrl }),
      });
      const upData = await upResp.json();
      if (upResp.ok) galleryUrl = upData?.url || "";

      const nextRefs = [...refs];
      const nextPrev = [...refPreviews];
      nextRefs[slot] = { mediaId, url: galleryUrl };
      nextPrev[slot] = { url: galleryUrl, dataUrl, fileName };

      setRefs(nextRefs);
      setRefPreviews(nextPrev);
      setUploadStatus("Upload berhasil!");
      setUploadedMediaId(mediaId);
      return { mediaId, galleryUrl };
    } catch (e) {
      let errorMsg = "Upload failed";
      if (typeof e === 'string') {
        errorMsg = e;
      } else if (e instanceof Error) {
        errorMsg = e.message;
      } else if (e && typeof e === 'object') {
        try {
          errorMsg = JSON.stringify(e);
          // If it's a JSON string of an error object, try to parse it to get a cleaner message if possible
          const parsed = JSON.parse(errorMsg);
          if (parsed.message) errorMsg = parsed.message;
          else if (parsed.error) errorMsg = typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error);
        } catch (_) { }
      }

      console.error("Upload Error Detail:", e);
      setUploadStatus(`Upload gagal: ${errorMsg}`);
      setStatus(`Error: ${errorMsg}`);
      setUploadedMediaId("ERROR");
      throw e;
    }
  };

  const generate = async () => {
    if (!prompt.trim()) {
      setStatus("Isi prompt gambar terlebih dahulu.");
      return;
    }
    setBusy(true);
    setStatus("Membuat gambar...");

    try {
      // Format imageInputs correctly to match Google Labs API format
      // Google uses: { name: "mediaId", imageInputType: "IMAGE_INPUT_TYPE_REFERENCE" }
      const imageInputs = refs.filter(r => r?.mediaId).map(r => ({
        name: r.mediaId,
        imageInputType: "IMAGE_INPUT_TYPE_REFERENCE"
      }));
      const hasRefs = imageInputs.length > 0;

      // Safe Model Mapping
      const modelKeyForMeta = hasRefs
        ? "R2I"
        : model === "nano-banana-pro" ? "GEM_PIX_2" : (model === "nano-banana" ? "GEM_PIX" : "IMAGEN_3_5");

      const aspectKey = aspect === "landscape"
        ? "IMAGE_ASPECT_RATIO_LANDSCAPE"
        : aspect === "portrait"
          ? "IMAGE_ASPECT_RATIO_PORTRAIT"
          : "IMAGE_ASPECT_RATIO_SQUARE";

      const currentSessionId = `;${Date.now()}`;
      const effectiveProjectId = projectId || "50f60660-a8e5-4489-9c80-64f3b73d6513";

      const payload = {
        clientContext: {
          sessionId: currentSessionId,
          // Note: outer clientContext usually doesn't need projectId/tool in successful logs
        },
        requests: Array.from({ length: count }, () => {
          // Model names: Keep the selected model even with refs (Google uses GEM_PIX_2 with refs)
          let finalModel = "IMAGEN_3_5"; // Default for imagen-4
          if (model === "nano-banana") {
            finalModel = "GEM_PIX";
          } else if (model === "nano-banana-pro") {
            finalModel = "GEM_PIX_2";
          }
          // Note: With refs, Google still uses the same model (GEM_PIX_2), not a special R2I model

          const request = {
            clientContext: {
              sessionId: currentSessionId,
              projectId: effectiveProjectId,
              tool: "PINHOLE"
            },
            seed: Math.floor(Math.random() * 1000000),
            imageModelName: finalModel,
            imageAspectRatio: aspectKey,
            prompt: prompt,
          };

          // Only add imageInputs if we have refs
          if (hasRefs && imageInputs.length > 0) {
            request.imageInputs = imageInputs;
          }

          return request;
        })
      };


      // Force actual project ID if available to avoid 400 Bad Request
      const projectIdPath = `projects/${effectiveProjectId}`;

      const resp = await sadisFetch("/api/labsflow/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: `https://aisandbox-pa.googleapis.com/v1/${projectIdPath}/flowMedia:batchGenerateImages`,
          payload
        })
      });

      if (!resp.ok) {
        throw new Error(`API Error: ${resp.status} ${resp.statusText}`);
      }

      const data = await resp.json();
      console.log("Image Gen Response:", data); // Helper check

      // Robust recursive finder for encodedImage (base64)
      const findEncodedImages = (obj, results = []) => {
        if (!obj || typeof obj !== 'object') return results;
        if (obj.encodedImage && typeof obj.encodedImage === 'string') {
          results.push(obj.encodedImage);
        }
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            findEncodedImages(obj[key], results);
          }
        }
        return results;
      };

      // Robust recursive finder for all possible base64/image data fields
      const findAllImageData = (obj, results = []) => {
        if (!obj || typeof obj !== 'object') return results;
        // Check for all possible base64/raw image properties
        const b64Props = ['encodedImage', 'rawImageBytes', 'data', 'base64_image', 'imageBytes', 'content', 'imageData'];
        for (const prop of b64Props) {
          if (obj[prop] && typeof obj[prop] === 'string' && obj[prop].length > 100) {
            // Check if it looks like base64 (no URL patterns)
            if (!obj[prop].startsWith('http') && !obj[prop].startsWith('/')) {
              results.push(obj[prop]);
            }
          }
        }
        // Check inline_data.data pattern (Gemini format)
        if (obj.inline_data && obj.inline_data.data && typeof obj.inline_data.data === 'string') {
          results.push(obj.inline_data.data);
        }
        // Recurse
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            findAllImageData(obj[key], results);
          }
        }
        return results;
      };

      // Robust recursive finder for image URLs (fifeUrl, fileUrl, imageUrl)
      const findImageUrls = (obj, results = []) => {
        if (!obj || typeof obj !== 'object') return results;
        // Check for common image URL properties
        const urlProps = ['fifeUrl', 'fileUrl', 'imageUrl', 'url'];
        for (const prop of urlProps) {
          if (obj[prop] && typeof obj[prop] === 'string' &&
            (obj[prop].includes('lh3.googleusercontent.com') ||
              obj[prop].includes('ai-sandbox') ||
              obj[prop].includes('.png') ||
              obj[prop].includes('.jpg') ||
              obj[prop].includes('.jpeg') ||
              obj[prop].includes('.webp'))) {
            results.push(obj[prop].replace(/[`]/g, '').trim());
          }
        }
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            findImageUrls(obj[key], results);
          }
        }
        return results;
      };

      // Try to find base64 images - check multiple sources
      let rawImages = findEncodedImages(data);
      console.log("findEncodedImages found:", rawImages.length);

      // If no encodedImage, try findAllImageData (more comprehensive)
      if (rawImages.length === 0) {
        rawImages = findAllImageData(data);
        console.log("findAllImageData found:", rawImages.length);
      }

      let foundUrls = rawImages.map(b64 => `data:image/png;base64,${b64}`);

      // If no base64 found, try to find direct URLs
      if (foundUrls.length === 0) {
        const imageUrls = findImageUrls(data);
        console.log("findImageUrls found:", imageUrls.length, imageUrls);
        // Proxy URLs through labsflow/download for CORS
        foundUrls = imageUrls.map(url => `/api/labsflow/download?url=${encodeURIComponent(url)}`);
      }

      if (foundUrls.length === 0) {
        // Log full response for debugging
        console.log("Full Image Gen Response:", JSON.stringify(data));
        // Safe error preview
        const preview = JSON.stringify(data).slice(0, 300);
        setStatus(`Gagal menemukan gambar. Response: ${preview}`);
      } else {
        setImages(foundUrls.map((url, i) => ({ url, title: `Result ${i + 1}` })));
        setStatus(`Berhasil! ${foundUrls.length} gambar siap cetak.`);
        bumpStat("stat.veo.image.success");
        bumpStat(`stat.image.model.${model}`);
      }

    } catch (e) {
      setStatus(`Generate Error: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return {
    prompt, setPrompt,
    status, setStatus,
    busy, setBusy,
    images, setImages,
    aspect, setAspect,
    count, setCount,
    model, setModel,
    refs, setRefs,
    refPreviews, setRefPreviews,
    plan, isFree,
    showRefSection, setShowRefSection,
    cropOpen, setCropOpen,
    cropImg, setCropImg,
    cropScale, setCropScale,
    cropOffset, setCropOffset,
    cropAspect, setCropAspect,
    uploadStatus, setUploadStatus,
    uploadedMediaId, setUploadedMediaId,
    isSettingsOpen, setIsSettingsOpen,
    generate,
    uploadDataUrlAsRef,
    pickFileForSlot,
    uploadRefSlot,
    clearRefSlot,
    bumpStat
  };
}
