export type FieldDetectorConfig = {
  strategies?: Array<
    | 'dataAttribute'
    | 'name'
    | 'id'
    | 'ariaLabel'
    | 'placeholder'
    | 'labelText'
    | 'semanticAnalysis'
  >;
  customMappings?: Record<string, string | string[]>;
  excludeSelectors?: string[];
};

export class FieldDetector {
  private config: Required<FieldDetectorConfig>;

  constructor(config: FieldDetectorConfig = {}) {
    this.config = {
      strategies: config.strategies ?? [
        'dataAttribute',
        'name',
        'id',
        'ariaLabel',
        'placeholder',
        'labelText',
        'semanticAnalysis',
      ],
      customMappings: config.customMappings ?? {},
      excludeSelectors: config.excludeSelectors ?? ['[data-voice-ignore]'],
    } as Required<FieldDetectorConfig>;
  }

  findField(voiceFieldName: string): HTMLElement | null {
    const normalized = this.normalizeFieldName(voiceFieldName);

    // custom mappings first
    const mapped = this.resolveMapping(normalized);

    for (const strategy of this.config.strategies) {
      const method = (this as any)[`findBy${this.capitalize(strategy)}`];
      if (typeof method === 'function') {
        const el = method.call(this, mapped);
        if (el && this.isFormField(el) && !this.isExcluded(el)) return el;
      }
    }
    return null;
  }

  // Strategies
  private findByDataAttribute(name: string) {
    return document.querySelector(
      `input[data-voice-field="${name}"], select[data-voice-field="${name}"], textarea[data-voice-field="${name}"]`
    ) as HTMLElement | null;
  }

  private findByName(name: string) {
    return document.querySelector(
      `input[name*="${name}" i], select[name*="${name}" i], textarea[name*="${name}" i]`
    ) as HTMLElement | null;
  }

  private findById(name: string) {
    const variations = this.getFieldVariations(name);
    for (const v of variations) {
      const el = (document.getElementById(v) || document.querySelector(`[id*="${v}" i]`)) as HTMLElement | null;
      if (el) return el;
    }
    return null;
  }

  private findByAriaLabel(name: string) {
    return document.querySelector(
      `input[aria-label*="${name}" i], select[aria-label*="${name}" i], textarea[aria-label*="${name}" i]`
    ) as HTMLElement | null;
  }

  private findByPlaceholder(name: string) {
    return document.querySelector(
      `input[placeholder*="${name}" i], textarea[placeholder*="${name}" i]`
    ) as HTMLElement | null;
  }

  private findByLabelText(name: string) {
    const labels = Array.from(document.querySelectorAll('label'));
    for (const label of labels) {
      const text = (label.textContent || '').toLowerCase().replace(/[:*]/g, '').trim();
      if (text.includes(name)) {
        if ((label as HTMLLabelElement).htmlFor) {
          const el = document.getElementById((label as HTMLLabelElement).htmlFor);
          if (el) return el as HTMLElement;
        }
        const nested = label.querySelector('input, select, textarea') as HTMLElement | null;
        if (nested) return nested;
      }
    }
    return null;
  }

  private findBySemanticAnalysis(name: string) {
    const fields = Array.from(document.querySelectorAll<HTMLElement>('input, select, textarea'));
    let best: { el: HTMLElement; score: number } | null = null;
    for (const el of fields) {
      if (this.isExcluded(el)) continue;
      const score = this.semanticScore(el, name);
      if (!best || score > best.score) best = { el, score };
    }
    return best && best.score > 0 ? best.el : null;
  }

  // Utils
  private semanticScore(el: HTMLElement, target: string) {
    let s = 0;
    const t = target.toLowerCase();
    const attrs = ['name', 'id', 'aria-label', 'placeholder', 'data-voice-field'];
    for (const a of attrs) {
      const v = el.getAttribute(a);
      if (v && v.toLowerCase().includes(t)) s += 10;
    }
    // label
    const label = this.getAssociatedLabel(el);
    if (label && (label.textContent || '').toLowerCase().includes(t)) s += 15;
    return s;
  }

  private getAssociatedLabel(el: HTMLElement) {
    if (el.id) {
      const label = document.querySelector(`label[for="${el.id}"]`);
      if (label) return label;
    }
    let p: HTMLElement | null = el.parentElement;
    while (p) {
      if (p.tagName === 'LABEL') return p;
      p = p.parentElement;
    }
    return null;
  }

  private getFieldVariations(name: string) {
    const camel = name.replace(/\s+/g, '');
    const snake = name.replace(/\s+/g, '_').toLowerCase();
    const pascal = camel.charAt(0).toUpperCase() + camel.slice(1);
    return [name, camel, snake, pascal, `user${pascal}`, `${snake}_field`, `txt${pascal}`, `input${pascal}`];
  }

  private isFormField(el: Element): el is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
    return ['input', 'select', 'textarea'].includes(el.tagName.toLowerCase());
  }

  private isExcluded(el: Element) {
    return this.config.excludeSelectors.some((sel) => (el as HTMLElement).matches(sel));
  }

  private normalizeFieldName(n: string) {
    return n.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  }

  private capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  private resolveMapping(name: string) {
    const map = this.config.customMappings[name];
    if (!map) return name;
    return Array.isArray(map) ? map[0] : map; // simple resolution for now
  }
}
