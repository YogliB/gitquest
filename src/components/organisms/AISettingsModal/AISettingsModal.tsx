import { useState } from "react";
import { useStore } from "@/store";
import { aiEngine } from "@/lib/ai-engine";
import { getRateLimitStatus } from "@/lib/github";
import { Input, Button } from "@/components/atoms";
import * as styles from "./AISettingsModal.css";

interface AISettingsModalProps {
  onClose: () => void;
}

export function AISettingsModal({ onClose }: AISettingsModalProps) {
  const { aiMode, localModel, apiBaseUrl, apiKey, apiModel, githubToken, rateLimit, saveSettings } =
    useStore();
  const [mode, setMode] = useState(aiMode);
  const [lModel, setLModel] = useState(localModel);
  const [aBaseUrl, setABaseUrl] = useState(apiBaseUrl);
  const [aKey, setAKey] = useState(apiKey);
  const [aModel, setAModel] = useState(apiModel);
  const [ghToken, setGhToken] = useState(githubToken);

  const handleSave = () => {
    saveSettings({
      aiMode: mode,
      localModel: lModel,
      apiBaseUrl: aBaseUrl,
      apiKey: aKey,
      apiModel: aModel,
      githubToken: ghToken,
    });
    aiEngine.loadSettings();
    onClose();
  };

  const rl = getRateLimitStatus();

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>⚙ AI Engine Settings</h3>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.section}>
          <label className={styles.label}>AI Mode</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name="ai-mode"
                value="local"
                checked={mode === "local"}
                onChange={() => setMode("local")}
              />
              <span>🖥 Local Model (runs in browser, no API key needed)</span>
            </label>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name="ai-mode"
                value="api"
                checked={mode === "api"}
                onChange={() => setMode("api")}
              />
              <span>☁️ API (OpenAI / Groq / Ollama compatible)</span>
            </label>
          </div>
        </div>

        {mode === "local" && (
          <div className={styles.section}>
            <label className={styles.label}>Local Model</label>
            <select
              className={styles.select}
              value={lModel}
              onChange={(e) => setLModel(e.target.value)}
            >
              <option value="Phi-3-mini-4k-instruct-q4f16_1-MLC">
                Phi-3 Mini 4K (recommended, ~2GB)
              </option>
              <option value="gemma-2-2b-it-q4f16_1-MLC">Gemma 2 2B (~1.5GB)</option>
              <option value="SmolLM2-1.7B-Instruct-q4f16_1-MLC">
                SmolLM2 1.7B (~1GB, fastest)
              </option>
            </select>
            <p className={styles.hint}>
              ⚠ Model will be downloaded to your browser cache on first use.
            </p>
          </div>
        )}

        {mode === "api" && (
          <div className={styles.section}>
            <label className={styles.label}>API Base URL</label>
            <Input
              value={aBaseUrl}
              onChange={(e) => setABaseUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
            />
            <label className={styles.label} style={{ marginTop: "12px" }}>
              API Key
            </label>
            <Input
              type="password"
              value={aKey}
              onChange={(e) => setAKey(e.target.value)}
              placeholder="sk-..."
            />
            <label className={styles.label} style={{ marginTop: "12px" }}>
              Model Name
            </label>
            <Input
              value={aModel}
              onChange={(e) => setAModel(e.target.value)}
              placeholder="gpt-4o-mini"
            />
          </div>
        )}

        <div className={styles.section}>
          <label className={styles.label}>
            GitHub Token{" "}
            <a
              href="https://github.com/settings/tokens?type=beta"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-accent)", fontSize: "0.75rem" }}
            >
              (Get token)
            </a>
          </label>
          <Input
            type="password"
            value={ghToken}
            onChange={(e) => setGhToken(e.target.value)}
            placeholder="ghp_..."
          />
          <p className={styles.hint}>Without a token: 60 requests/hour. With token: 5,000/hour.</p>
          {rl.remaining !== null && (
            <div className={styles.rateLimitStatus}>
              Rate limit: {rl.remaining} remaining
              {rl.reset && <span> · resets {new Date(rl.reset * 1000).toLocaleTimeString()}</span>}
            </div>
          )}
        </div>

        <Button variant="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
