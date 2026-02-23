import { FieldDetector, type FieldDetectorConfig } from './core/FieldDetector';
import { ActionExecutor, type Action } from './core/ActionExecutor';

export type VoiceAssistantConfig = FieldDetectorConfig & {
  backendUrl?: string;
  wakeWord?: string;
};

export class VoiceAssistantWidget {
  private detector: FieldDetector;
  private executor: ActionExecutor;

  constructor(config: VoiceAssistantConfig = {}) {
    this.detector = new FieldDetector(config);
    this.executor = new ActionExecutor(this.detector);
  }

  execute(action: Action) {
    return this.executor.execute(action);
  }
}

// UMD-style global init for script-tag usage
export function init(config: VoiceAssistantConfig = {}) {
  const widget = new VoiceAssistantWidget(config);
  (window as any).VoiceAssistant = widget;
  return widget;
}

// For ESM/CJS consumers
export default { init, VoiceAssistantWidget };
