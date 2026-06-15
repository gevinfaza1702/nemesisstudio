import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useSettings } from "../context/SettingsContext";
import { checkQuota, writeQuota } from "../utils/quota";
import { buildPayload } from "../utils/payloader";

export function useVideoGeneration() {
  const { bearer, appCredential } = useSettings();
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, queuing, processing, completed, failed
  const [statusMessage, setStatusMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null); // The final video data
  const [isBearerExpired, setIsBearerExpired] = useState(false); // For 401 errors
  const pollStreamRef = useRef(null);
  const lastProgressUpdate = useRef(0);
  const isGeneratingRef = useRef(isGenerating);

  useEffect(() => {
    isGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollStreamRef.current) {
        pollStreamRef.current.close();
      }
    };
  }, []);

  const generate = useCallback(async (params) => {
    if (isGenerating) return;

    // 1. Quota Check
    const mode = params.mode || "single"; // 'single', 'batch', 'frame'
    const quotaCheck = checkQuota(mode, 1);

    // Admin bypass check could be added here if we had plan info in context
    // For now, we enforce quota unless explicit bypass
    if (!quotaCheck.ok && !params.bypassQuota) {
      setStatus("failed");
      setStatusMessage("Kuota habis. Silakan tunggu reset harian.");
      return;
    }

    setIsGenerating(true);
    setStatus("queuing");
    setStatusMessage("Menyiapkan request...");
    setProgress(0);
    setResult(null);

    try {
      // 2. Build Payload
      const { url, payload: constructedPayload, method, headers } = buildPayload({
        ...params,
        clientContext: { sessionId: "react-client" } // simplified
      });

      // 3. Submit Job
      const jobResp = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-credential": appCredential || "",
        },
        body: JSON.stringify({
          url,
          method,
          headers: headers || {},
          payload: constructedPayload
        }),
      });

      const jobJson = await jobResp.json().catch(() => ({}));

      // Check for 401 Bearer expired
      if (jobResp.status === 401) {
        setIsBearerExpired(true);
        setStatus("failed");
        setStatusMessage("Bearer kadaluarsa, Segera hubungi admin");
        setIsGenerating(false);
        return;
      }

      if (!jobResp.ok || !jobJson?.jobId) {
        throw new Error(jobJson.error || `Gagal membuat job (${jobResp.status})`);
      }

      const jobId = jobJson.jobId;
      setStatus("processing");
      setStatusMessage("Menunggu antrian server...");

      // Dispatch start event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("videoGenerationStarted", {
          detail: {
            prompt: params.prompt,
            sceneIndex: 0,
            aspect: params.aspect
          }
        }));
      }

      // 4. Start Polling (SSE)
      if (pollStreamRef.current) pollStreamRef.current.close();

      const es = new EventSource(`/api/jobs/${jobId}/stream`);
      pollStreamRef.current = es;

      es.addEventListener("queued", () => {
        setStatus("queuing");
        setStatusMessage("Antrian server...");
      });

      es.addEventListener("started", () => {
        setStatus("processing");
        setStatusMessage("Sedang memproses video...");
        setProgress(10);
      });

      es.addEventListener("initial", (ev) => {
        // Initial data often contains the plan/structure but not video yet
        // We can use this to show placeholders if we wanted
        setProgress(20);
      });

      es.onerror = (err) => {
        console.error("SSE Error:", err);
        es.close();
        // Don't throw globally, just stop polling might be safer, 
        // or let the 'failed' event handle specific errors if they come.
        // For generic connection errors, we might want to retry or just stall?
        // Let's close for now to stop infinite loops.
        if (isGeneratingRef.current) { // Ref usage would be ideal, but for now just log
          // triggering a status update might be risky if unmounted
        }
      };

      es.addEventListener("polled", (ev) => {
        // Throttled Parsing: Skip heavy JSON.parse if we just did it recently
        const now = Date.now();
        if (now - lastProgressUpdate.current < 100) {
          return;
        }
        lastProgressUpdate.current = now;

        const p = JSON.parse(ev.data || "{}");
        const data = p.data || {};

        // Check for 401 in polled data
        if (p.status === 401 || p.ok === false && p.status === 401) {
          es.close();
          setIsBearerExpired(true);
          setStatus("failed");
          setStatusMessage("Bearer kadaluarsa, Segera hubungi admin");
          setIsGenerating(false);
          return;
        }

        setProgress((prev) => Math.min(prev + 5, 90));

        // Cek status operasi
        const ops = data.operations || [];
        const allDone = ops.length > 0 && ops.every(op =>
          op.status === "SUCCESSFUL" ||
          op.status === "FAILED" ||
          op.status === "CANCELLED"
        );

        if (allDone) {
          es.close();
          handleCompletion(data, mode, params.prompt, params.aspect);
        }
      });

      es.addEventListener("completed", (ev) => {
        es.close();
        const p = JSON.parse(ev.data || "{}");
        handleCompletion(p.data, mode, params.prompt, params.aspect);
      });

      // Listen for bearer expired event from server
      es.addEventListener("bearer_expired", () => {
        es.close();
        setIsBearerExpired(true);
        setStatus("failed");
        setStatusMessage("Bearer kadaluarsa, Segera hubungi admin");
        setIsGenerating(false);
      });

      es.addEventListener("failed", (ev) => {
        es.close();
        // Check if the failure message contains 401 or bearer/auth related
        const evData = ev.data ? JSON.parse(ev.data) : {};
        const errorMsg = evData.error || evData.message || "";
        if (errorMsg.includes("401") || errorMsg.toLowerCase().includes("bearer") || errorMsg.toLowerCase().includes("unauthorized")) {
          setIsBearerExpired(true);
          setStatusMessage("Bearer kadaluarsa, Segera hubungi admin");
        }
        setIsGenerating(false);
        setStatus("failed");
        if (!statusMessage) {
          setStatusMessage("Job server melaporkan kegagalan.");
        }
      });

    } catch (err) {
      console.error("Generate Error:", err);
      setStatus("failed");
      setStatusMessage(err.message || "Terjadi kesalahan sistem.");
      setIsGenerating(false);
      if (pollStreamRef.current) {
        pollStreamRef.current.close();
        pollStreamRef.current = null;
      }
    }
  }, [appCredential, isGenerating]);

  const handleCompletion = (data, mode, prompt, aspect) => {
    setResult(data);
    setStatus("completed");
    setStatusMessage("Selesai!");
    setIsGenerating(false);
    setProgress(100);

    // Decrement Quota
    // Note: In real app, check if video is actually generated before deducting
    const currentQ = checkQuota(mode);
    writeQuota(mode, currentQ.current + 1);

    if (pollStreamRef.current) {
      pollStreamRef.current.close();
      pollStreamRef.current = null;
    }

    // Helper to find video URL (duplicated from page logic for safety)
    const findUniqueVideoUrl = (obj) => {
      const urls = new Set();
      const walk = (val) => {
        if (!val) return;
        if (typeof val === "string") {
          if (val.includes("/video/") || (val.startsWith("https://") && val.endsWith(".mp4"))) {
            urls.add(val.replace(/[`]/g, "").trim());
          }
        } else if (Array.isArray(val)) val.forEach(walk);
        else if (typeof val === "object") Object.values(val).forEach(walk);
      };
      walk(obj);
      return Array.from(urls)[0];
    };

    // Helper to find IDs recursively
    const findIds = (obj) => {
      let foundMediaId = "";
      let foundGenId = "";
      let foundMediaGenerationId = "";

      const walk = (val) => {
        if (!val || typeof val !== "object") return;
        if (foundMediaId && foundGenId && foundMediaGenerationId) return;

        if (val.mediaId && typeof val.mediaId === "string") {
          foundMediaId = val.mediaId;
        }
        if (val.name && typeof val.name === "string" && val.name.startsWith("projects/")) {
          foundGenId = val.name;
        }
        // Legacy Compatibility: Extract mediaGenerationId explicitly
        if (val.mediaGenerationId && typeof val.mediaGenerationId === "string") {
          foundMediaGenerationId = val.mediaGenerationId;
        }

        if (Array.isArray(val)) val.forEach(walk);
        else Object.values(val).forEach(walk);
      };
      walk(obj);
      return { foundMediaId, foundGenId, foundMediaGenerationId };
    };

    const videoUrl = findUniqueVideoUrl(data);
    const { foundMediaId, foundGenId, foundMediaGenerationId } = findIds(data);

    // Prefer specific known path, fallback to recursive find
    const mediaId = data.operations?.[0]?.response?.result?.video?.mediaId || foundMediaId || "";

    // CRITICAL FIX: The Extend API specifically requires 'mediaGenerationId', NOT the operation name.
    // Legacy code confirms: api extend expects field 'mediaId' to contain mediaGenerationId.
    const generationId = foundMediaGenerationId || data.operations?.[0]?.name || foundGenId || "";

    // Dispatch completion event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("videoGenerated", {
        detail: {
          result: data,
          prompt: prompt || "Generated Video",
          sceneIndex: 0,
          videoUrl: videoUrl,
          mediaId: mediaId,
          generationId: generationId,
          aspect: aspect
        }
      }));
    }
  };

  const cancel = useCallback(() => {
    if (pollStreamRef.current) {
      pollStreamRef.current.close();
      pollStreamRef.current = null;
    }
    setIsGenerating(false);
    setStatus("idle");
    setStatusMessage("Dibatalkan.");
  }, []);

  const resetBearerExpired = useCallback(() => {
    setIsBearerExpired(false);
  }, []);

  return useMemo(() => ({
    generate,
    cancel,
    isGenerating,
    status,
    statusMessage,
    progress,
    result,
    isBearerExpired,
    resetBearerExpired
  }), [generate, cancel, isGenerating, status, statusMessage, progress, result, isBearerExpired, resetBearerExpired]);
}
