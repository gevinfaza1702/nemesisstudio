/**
 * Helper to build the JSON payload for Google Labs Video API.
 */

// Centralized Labs Endpoints
const LABS_BASE = "https://aisandbox-pa.googleapis.com";
const LABS_PATHS = {
  VIDEO_TEXT: "/v1/video:batchAsyncGenerateVideoText",
  VIDEO_START_IMAGE: "/v1/video:batchAsyncGenerateVideoStartImage",
  VIDEO_START_END_IMAGE: "/v1/video:batchAsyncGenerateVideoStartAndEndImage",
  VIDEO_EXTEND: "/v1/video:batchAsyncGenerateVideoExtendVideo",
};

export const CONFIG = {
  defaultAspectRatio: "VIDEO_ASPECT_RATIO_LANDSCAPE",
  defaultGenerateUrl: LABS_BASE + LABS_PATHS.VIDEO_TEXT,
};

// Map simpler style keys to partial prompts
export const STYLE_PROMPTS = {
  sinematik: "gaya sinematik, dynamic camera, filmic lighting",
  realistik: "gaya realistik, natural lighting, handheld feel",
  anime: "gaya anime, cel-shaded, high contrast",
  dokumenter: "gaya dokumenter, handheld camera, natural color",
  pixar3d: "gaya Pixar 3D, karakter stylized, warna cerah, pencahayaan lembut",
  cyberpunk: "gaya cyberpunk, neon lighting, cityscape futuristik, kontras tinggi",
  retro80an: "gaya retro 80-an, tekstur VHS, color grading vintage, grain halus",
  claymation: "gaya claymation, nuansa stop-motion, tekstur tanah liat",
  fantasi: "gaya fantasi, epic scenery, atmosfer magis, warna kaya",
  steampunk: "gaya steampunk, mesin mekanik, brass dan uap, nuansa Victorian",
  filmnoir: "gaya film noir, hitam-putih, high contrast, bayangan dramatis",
};

export const MODEL_CONFIGS = {
  VIDEO_ASPECT_RATIO_LANDSCAPE: {
    text: "veo_2_0_0_preview_720p_landscape_30fps",
    startImage: "veo_2_0_0_preview_720p_landscape_30fps_i2v",
    extend: "veo_3_1_extend_fast_landscape_ultra",
    reshoot: "veo_3_0_reshoot_landscape",
  },
  VIDEO_ASPECT_RATIO_PORTRAIT: {
    text: "veo_2_0_0_preview_720p_portrait_30fps",
    startImage: "veo_2_0_0_preview_720p_portrait_30fps_i2v",
    extend: "veo_3_1_extend_fast_portrait_ultra",
    reshoot: "veo_3_0_reshoot_portrait",
  },
  VIDEO_ASPECT_RATIO_SQUARE: {
    text: "veo_2_0_0_preview_720p_square_30fps",
    startImage: "veo_2_0_0_preview_720p_square_30fps_i2v",
    extend: "veo_3_1_extend_fast_square_ultra", // Hypothetical
    reshoot: "veo_3_0_reshoot_square",   // Hypothetical
  }
};

export const RELAXED_MODELS = {
  landscape: {
    t2v: "veo_2_0_0_preview_720p_landscape_30fps_relaxed",
    i2v: "veo_2_0_0_preview_720p_landscape_30fps_i2v_relaxed",
  },
  portrait: {
    t2v: "veo_2_0_0_preview_720p_portrait_30fps_relaxed",
    i2v: "veo_2_0_0_preview_720p_portrait_30fps_i2v_relaxed",
  },
};

/**
 * Builds the payload for a generation request.
 * @param {Object} params
 * @param {string} params.prompt - Main prompt
 * @param {string} params.aspect - VIDEO_ASPECT_RATIO_LANDSCAPE etc.
 * @param {string} params.modelKey - Specific model key to use (optional)
 * @param {Object} params.style - { key, subLabel }
 * @param {string} params.resolution - '1080p' etc (suffix)
 * @param {boolean} params.audio - Enable audio prompt suffix
 * @param {string} params.voiceLang - Language for audio
 * @param {string} params.startOneMediaId - Media ID for single start image
 * @param {string} params.startTwoMediaId - Media ID for frame interpolation end
 * @param {Object} params.clientContext - Session context
 */
export function buildPayload({
  prompt,
  aspect = "VIDEO_ASPECT_RATIO_LANDSCAPE",
  modelKey,
  style = {}, // { key: 'sinematik', subLabel: 'Heroic' }
  resolution,
  audio = false,
  voiceLang = "Indonesia",
  startOneMediaId,
  startTwoMediaId, // If present, implies Frame Interpolation
  extendFromMediaId, // ID of the video to extend (Generation ID)
  clientContext,
}) {
  // Construct Final Prompt
  const styleSuffix = STYLE_PROMPTS[style.key] || "";
  const resSuffix = resolution ? `resolusi ${resolution}` : "";
  const audioSuffix = audio ? `narasi suara berbahasa ${voiceLang}` : "";
  
  const finalPrompt = [
    prompt,
    styleSuffix,
    style.subLabel,
    resSuffix,
    audioSuffix
  ].filter(Boolean).join(", ");



  // Determine Model
  const config = MODEL_CONFIGS[aspect] || MODEL_CONFIGS.VIDEO_ASPECT_RATIO_LANDSCAPE;
  
  let selectedModel = modelKey;
  if (!selectedModel) {
    if (extendFromMediaId) {
      selectedModel = config.extend;
    } else if (startOneMediaId) {
      selectedModel = config.startImage;
    } else {
      selectedModel = config.text;
    }
  }

  // Precise Mapping for Veo 3.1 Image-to-Video
  // Resolves incorrect legacy keys (e.g. with '_s_') or T2V mismatches
  if (startOneMediaId && selectedModel && selectedModel.includes("veo_3_1")) {
      const isPortrait = aspect === "VIDEO_ASPECT_RATIO_PORTRAIT";
      const isRelaxed = selectedModel.includes("relaxed");
      
      if (isPortrait) {
          selectedModel = isRelaxed 
              ? "veo_3_1_i2v_s_fast_portrait_ultra_relaxed" 
              : "veo_3_1_i2v_s_fast_portrait_ultra";
      } else {
          // Landscape (Default)
          selectedModel = isRelaxed 
              ? "veo_3_1_i2v_s_fast_ultra_relaxed" 
              : "veo_3_1_i2v_s_fast_ultra";
      }
  }

  const seed = Math.floor(Math.random() * 40000) + 1;

  // Build Request Object
  const request = {
    videoModelKey: selectedModel,
    textInput: { prompt: finalPrompt },
    aspectRatio: aspect,
    seed,
  };

  // Attach Images or Video Inputs
  if (extendFromMediaId) {
     request.videoInput = {
       mediaId: extendFromMediaId,
       startFrameIndex: 420, // Default for 8s (approx 1s context)
       endFrameIndex: 480    // End of previous clip
     };
     // Override model key if user didn't specify one suitable for extend? 
     // For now assume selectedModel is correct (config.extend).
  } else if (startOneMediaId) {
    request.startImage = { mediaId: startOneMediaId };
  }
  
  if (startTwoMediaId) {
    request.endImage = { mediaId: startTwoMediaId };
    request.metadata = { sceneId: `frame-${Date.now().toString(16)}` };
  }

  // Final Payload
  const payload = {
    requests: [request],
  };

  if (clientContext) {
    payload.clientContext = {
      ...clientContext,
      sessionId: `${clientContext.sessionId || 'session'};${Date.now()}`
    };
  }

  // Determine Endpoint URL
  let url = CONFIG.defaultGenerateUrl;
  if (extendFromMediaId) {
    url = LABS_BASE + LABS_PATHS.VIDEO_EXTEND;
  } else if (startOneMediaId && startTwoMediaId) {
    url = LABS_BASE + LABS_PATHS.VIDEO_START_END_IMAGE;
  } else if (startOneMediaId) {
    url = LABS_BASE + LABS_PATHS.VIDEO_START_IMAGE;
  }

  return {
    url,
    payload,
    method: "POST",
    headers: {} // Will be filled by caller or API route
  };
}
