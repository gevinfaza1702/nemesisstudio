import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";

export function useSoraGenerator() {
  const [isFree, setIsFree] = useState(false);
  const [mode, setMode] = useState("basic");
  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("");
  const [action, setAction] = useState("");
  const [setting, setSetting] = useState("");
  const [lighting, setLighting] = useState("");
  const [style, setStyle] = useState("");
  const [shot, setShot] = useState("");
  const [details, setDetails] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [orientation, setOrientation] = useState("landscape");
  const [grokAspectRatio, setGrokAspectRatio] = useState("landscape");
  const [grokResolution, setGrokResolution] = useState("480p");
  const [model, setModel] = useState("sora-2");
  const [duration, setDuration] = useState(10);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");
  const [imageData, setImageData] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageMime, setImageMime] = useState("image/jpeg");
  const [refThumbs, setRefThumbs] = useState([]);
  const [genSeconds, setGenSeconds] = useState(0);
  const [isTiming, setIsTiming] = useState(false);
  const [jobUuid, setJobUuid] = useState("");
  const [jobId, setJobId] = useState("");
  const [isPolling, setIsPolling] = useState(false);
  const [credits, setCredits] = useState(0);
  const [creditScope, setCreditScope] = useState("none");
  const [plan, setPlan] = useState("free");

  const pollSessionRef = useRef(0);
  const genTimerRef = useRef(null);
  const genStartRef = useRef(0);
  const videoUrlRef = useRef("");
  const creditsDeductedRef = useRef(false);
  const costCreditsRef = useRef(0);

  useEffect(() => {
    videoUrlRef.current = videoUrl;
  }, [videoUrl]);

  // Durations valid per model
  const isGrok = model === "grok";
  const isVeo = model.startsWith("veo");
  const modelLabel = isGrok ? "Grok" : isVeo ? "Veo" : "Sora";

  const allowedDurations = useMemo(() => {
    if (model === "grok") return [6, 10];
    if (isVeo) return [8];
    if (model === "sora-2-pro" || model === "sora-2-pro-hd") return [15];
    return [10, 15];
  }, [model]);

  useEffect(() => {
    if (!allowedDurations.includes(duration)) {
      setDuration(allowedDurations[0]);
    }
  }, [allowedDurations, duration]);

  const bumpStat = (key) => {
    try {
      const v = parseInt(localStorage.getItem(key) || "0", 10) || 0;
      localStorage.setItem(key, String(v + 1));
    } catch (_) {}
  };

  const refreshCredits = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = String(session?.access_token || "");
      if (!token) return;

      const rAdmin = await fetch("/api/admin/credits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (rAdmin.ok) {
        const dA = await rAdmin.json();
        setCreditScope("admin");
        setCredits(Number(dA?.credits?.sora2 || 0));
        return;
      }

      const rMe = await fetch("/api/me/credits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dM = await rMe.json();
      if (rMe.ok) {
        setCreditScope(String(dM?.scope || "none"));
        setCredits(Number(dM?.credits || 0));
      }
    } catch (_) {}
  };

  useEffect(() => {
    refreshCredits();
  }, [plan]);

  const startTimer = () => {
    if (genTimerRef.current) clearInterval(genTimerRef.current);
    genStartRef.current = Date.now();
    setGenSeconds(0);
    setIsTiming(true);
    genTimerRef.current = setInterval(() => {
      const diff = Math.floor((Date.now() - genStartRef.current) / 1000);
      setGenSeconds(diff >= 0 ? diff : 0);
    }, 250);
  };

  const stopTimer = () => {
    setIsTiming(false);
    if (genTimerRef.current) clearInterval(genTimerRef.current);
    genTimerRef.current = null;
  };

  const deductCreditsOnce = async () => {
    const amount = Number(costCreditsRef.current || 0);
    if (!amount || creditsDeductedRef.current) return;
    creditsDeductedRef.current = true;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = String(session?.access_token || "");
      if (!token) return;
      const resp = await fetch("/api/credits/deduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      const dd = await resp.json();
      if (resp.ok) {
        setCredits(Number(dd?.credits || 0));
        window.dispatchEvent(new CustomEvent("creditsUpdated"));
        refreshCredits();
      } else {
        console.error("[useSoraGenerator] Credit deduction failed:", dd);
      }
    } catch (err) {
      console.error("[useSoraGenerator] Credit deduction error:", err);
    }
  };

  const sanitizeUrl = (s) => {
    try {
      let v = typeof s === "string" ? s : "";
      v = v.replace(/[`"']/g, "").trim();
      v = v.replace(/\s+/g, " ");
      v = v.replace(/ /g, "%20");
      return v;
    } catch { return ""; }
  };

  const finalPrompt = useMemo(() => {
    if (mode === "basic") return (prompt || "").trim();
    const parts = [
      subject ? `subjek: ${subject}` : "",
      action ? `aksi: ${action}` : "",
      setting ? `setting: ${setting}` : "",
      lighting ? `pencahayaan/waktu: ${lighting}` : "",
      style ? `gaya visual: ${style}` : "",
      shot ? `camera shot: ${shot}` : "",
      details ? `detail: ${details}` : "",
    ].filter(Boolean);
    return parts.join(", ");
  }, [mode, prompt, subject, action, setting, lighting, style, shot, details]);

  const pollStatus = async (uuid, id, attempt, session) => {
    try {
      if (session !== pollSessionRef.current) {
        setIsPolling(false);
        stopTimer();
        return;
      }
      if (!uuid && !id) {
        setIsPolling(false);
        stopTimer();
        return;
      }
      const q = new URLSearchParams();
      if (uuid) q.set("uuid", uuid);
      if (id) q.set("id", id);
      const resp = await fetch(`/api/sora/status?${q.toString()}`, { method: "GET" });
      const ct = resp.headers.get("content-type") || "";
      let d = ct.includes("application/json") ? await resp.json() : await resp.text();
      if (typeof d === "string") {
        try { d = JSON.parse(d); } catch {}
      }
      if (resp.ok && d) {
        setResult(d);
        const gv = Array.isArray(d?.generated_video) ? d.generated_video[0] : undefined;
        const vuri = sanitizeUrl(gv?.video_uri || d?.video_uri || "");
        let vurl = sanitizeUrl(gv?.video_url || gv?.file_download_url || d?.video_url || d?.file_download_url || "");
        const turl = sanitizeUrl(gv?.thumbnail_url || d?.thumbnail_url || d?.last_frame_url || "");
        
        if (!vurl && vuri) {
          vurl = sanitizeUrl(`https://user-files-downloader.geminigen.ai/${vuri}`);
        }
        if (vurl) {
          if (!videoUrlRef.current || videoUrlRef.current !== vurl) setVideoUrl(vurl);
          stopTimer();
          deductCreditsOnce();
          setIsPolling(false);
          setStatus("Berhasil.");
          if (turl) setThumbUrl(turl);
          const refs = Array.isArray(d?.reference_item) ? d.reference_item : [];
          const rthumbs = refs.map((x) => sanitizeUrl(x?.thumbnail_url || "")).filter(Boolean);
          if (rthumbs.length) setRefThumbs(rthumbs);
          return;
        }
        if (turl) setThumbUrl(turl);
        const refs = Array.isArray(d?.reference_item) ? d.reference_item : [];
        const rthumbs = refs.map((x) => {
          const a = sanitizeUrl(x?.thumbnail_url || "");
          if (a) return a;
          const b = sanitizeUrl(x?.uri || "");
          if (b) return sanitizeUrl(`https://cdn.geminigen.ai/${b}`);
          return "";
        }).filter(Boolean);
        if (rthumbs.length) setRefThumbs(rthumbs);
      } else if (resp.status === 404 || resp.status === 400) {
          setIsPolling(false);
          stopTimer();
          setStatus("Job Sora tidak ditemukan atau sudah kadaluarsa.");
          return;
      }
    } catch (_) {}
    
    const next = attempt + 1;
    if (next > 120) {
      setIsPolling(false);
      stopTimer();
      setStatus("Timeout saat mengecek status. Silahkan cek manual.");
      return;
    }
    setTimeout(() => pollStatus(uuid, id, next, session), 3000);
  };

  const generate = async () => {
    const text = (finalPrompt || "").trim();
    if (!text) {
      setStatus("Isi prompt terlebih dahulu.");
      return;
    }
    const costCredits = 1;
    costCreditsRef.current = costCredits;
    creditsDeductedRef.current = false;

    if (!(creditScope === "admin" || creditScope === "user")) {
      setStatus(`Plan tidak eligible untuk ${modelLabel}.`);
      return;
    }

    if (credits < costCredits) {
        setStatus("Credit tidak mencukupi.");
        return;
    }

    try {
      setStatus(`Mengirim ke ${modelLabel}...`);
      startTimer();
      setResult(null);
      setVideoUrl("");
      setThumbUrl("");
      setRefThumbs([]);
      setJobUuid("");
      setJobId("");
      setIsPolling(false);
      pollSessionRef.current += 1;
      const session = pollSessionRef.current;

      const token = localStorage.getItem("licenseActivationToken") || "";
      // Build aspect_ratio based on model
      let fieldAspectRatio;
      if (isGrok) fieldAspectRatio = grokAspectRatio;
      else if (isVeo) fieldAspectRatio = orientation; // server maps to 16:9 etc
      else fieldAspectRatio = orientation === "portrait" ? "portrait" : "landscape";

      const fields = {
        prompt: finalPrompt,
        model: model,
        aspect_ratio: fieldAspectRatio,
        resolution: (isGrok || isVeo) ? grokResolution : "small",
        duration: duration,
        provider: "openai",
        image_data: imageData || undefined,
        image_name: imageName || undefined,
        image_mime: imageMime || undefined,
      };
      if (isGrok && negativePrompt.trim()) {
        fields.negative_prompt = negativePrompt.trim();
      }

      const resp = await fetch("/api/sora/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-credential": token,
        },
        body: JSON.stringify(fields),
      });

      let data = await resp.json();
      if (!resp.ok) {
        setStatus(`Gagal: ${data?.error || "HTTP " + resp.status}`);
        stopTimer();
        return;
      }

      setResult(data);
      const gv = Array.isArray(data?.generated_video) ? data.generated_video[0] : undefined;
      const vurl = sanitizeUrl(gv?.video_url || gv?.file_download_url || data?.video_url || data?.file_download_url || "");
      const turl = sanitizeUrl(gv?.thumbnail_url || data?.thumbnail_url || data?.last_frame_url || "");
      
      if (vurl) {
        setVideoUrl(vurl);
        stopTimer();
        deductCreditsOnce();
      }
      setThumbUrl(turl);
      
      const refs = Array.isArray(data?.reference_item) ? data.reference_item : [];
      const rthumbs = refs.map((x) => {
        const a = sanitizeUrl(x?.thumbnail_url || "");
        if (a) return a;
        const b = sanitizeUrl(x?.uri || "");
        if (b) return sanitizeUrl(`https://cdn.geminigen.ai/${b}`);
        return "";
      }).filter(Boolean);
      setRefThumbs(rthumbs);

      const ju = String(data?.uuid || gv?.uuid || "");
      const jid = String(data?.id || gv?.history_id || "");
      setJobUuid(ju);
      setJobId(jid);

      if (!vurl && (ju || jid)) {
        setIsPolling(true);
        setStatus("Memproses video...");
        pollStatus(ju, jid, 0, session);
      } else if (vurl) {
        setStatus("Berhasil.");
      }
      bumpStat(isGrok ? "stat.grok.video.success" : isVeo ? "stat.veo.video.success" : "stat.sora.video.success");
    } catch (e) {
      setStatus(String(e?.message || "Terjadi kesalahan."));
      stopTimer();
    }
  };

  const handleManualCheck = () => {
    if (!jobUuid && !jobId) return;
    setIsPolling(true);
    pollSessionRef.current += 1;
    pollStatus(jobUuid, jobId, 0, pollSessionRef.current);
  };

  return {
    state: {
      mode, prompt, subject, action, setting, lighting, style, shot, details,
      negativePrompt, orientation, grokAspectRatio, grokResolution,
      model, duration, status, result, videoUrl, thumbUrl,
      imageData, imagePreview, imageName, imageMime, refThumbs, genSeconds,
      isTiming, jobUuid, jobId, isPolling, credits, creditScope, plan, isFree,
      allowedDurations, isGrok, isVeo, modelLabel
    },
    actions: {
      setMode, setPrompt, setSubject, setAction, setSetting, setLighting,
      setStyle, setShot, setDetails, setNegativePrompt, setOrientation,
      setGrokAspectRatio, setGrokResolution, setModel, setDuration,
      setImageData, setImagePreview, setImageName, setImageMime,
      generate, handleManualCheck, refreshCredits, setIsFree, setPlan
    },
    utils: { sanitizeUrl, finalPrompt }
  };
}
