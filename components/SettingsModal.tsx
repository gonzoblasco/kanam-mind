"use client";

import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getOllamaConfig,
  isOllamaAvailable,
  type OllamaConfig,
  saveOllamaConfig,
} from "@/lib/ollama";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ConnectionStatus = "idle" | "checking" | "ok" | "error";

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [config, setConfig] = useState<OllamaConfig>(() => getOllamaConfig());
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [saved, setSaved] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      // Reload config from storage when opening
      setConfig(getOllamaConfig());
      setStatus("idle");
      setSaved(false);
    }
    onOpenChange(next);
  };

  const handleCheck = async () => {
    setStatus("checking");
    // Save first so the check uses the current values
    saveOllamaConfig(config);
    const ok = await isOllamaAvailable();
    setStatus(ok ? "ok" : "error");
  };

  const handleSave = () => {
    saveOllamaConfig(config);
    setSaved(true);
    setTimeout(() => onOpenChange(false), 800);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
          <DialogDescription>
            Configurá la conexión a Ollama local (BYOK).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="ollama-base-url">Base URL de Ollama</Label>
            <Input
              id="ollama-base-url"
              value={config.baseUrl}
              onChange={(e) =>
                setConfig((c) => ({ ...c, baseUrl: e.target.value }))
              }
              placeholder="http://localhost:11434"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ollama-model">Modelo</Label>
            <Input
              id="ollama-model"
              value={config.model}
              onChange={(e) =>
                setConfig((c) => ({ ...c, model: e.target.value }))
              }
              placeholder="deepseek-v4-flash:cloud"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheck}
              disabled={status === "checking"}
            >
              {status === "checking" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="h-4 w-4" aria-hidden="true" />
              )}
              Verificar conexión
            </Button>
            {status === "ok" && (
              <span className="text-sm text-green-600" role="status">
                Conexión exitosa
              </span>
            )}
            {status === "error" && (
              <span className="text-sm text-destructive" role="alert">
                No se pudo conectar
              </span>
            )}
          </div>

          {saved && (
            <p className="text-sm text-green-600" role="status">
              Configuración guardada ✓
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
