# Voice Assistant Widget (Standalone)

A framework-agnostic, drop-in widget that detects form fields and executes actions (fill, navigate, scroll) with minimal or zero changes to the host web application.

## Install

### Option A: Script Tag

```html
<link
  rel="stylesheet"
  href="/voice-assistant-widget/styles/voice-assistant.css"
/>
<script src="/voice-assistant-widget/dist/index.global.js"></script>
<script>
  VoiceAssistant.init({
    strategies: ["dataAttribute", "name", "labelText", "semanticAnalysis"],
    customMappings: { email: ["userEmail", "emailAddress"] },
  });
</script>
```

### Option B: NPM

```bash
npm install ./voice-assistant-widget
```

```ts
import Widget from "voice-assistant-widget";
const va = Widget.init({ strategies: ["name", "semanticAnalysis"] });
va.execute({ type: "fill_field", field: "email", value: "user@example.com" });
```

## Dev

```powershell
cd voice-assistant-widget
npm install
npm run build
```

## Usage API

```ts
import { init } from "voice-assistant-widget";
const va = init();
va.execute({ type: "fill_field", field: "message", value: "Hello!" });
va.execute({ type: "open_dropdown", field: "type" });
va.execute({ type: "select_option", value: "Consultation" });
```

## Configuration

- `strategies`: field detection priority
- `customMappings`: voice label -> list of field aliases
- `excludeSelectors`: CSS selectors to ignore (e.g., hidden fields)

## Notes

- For React forms, ReactAdapter tries to trigger onChange when possible.
- Works with inputs, selects, and textareas.
