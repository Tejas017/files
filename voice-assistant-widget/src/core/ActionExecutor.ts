import { FieldDetector } from './FieldDetector';
import { ReactAdapter } from '../adapters/ReactAdapter';
import { VanillaAdapter } from '../adapters/VanillaAdapter';

export type Action =
  | { type: 'fill_field'; field: string; value: string }
  | { type: 'navigate'; page: string }
  | { type: 'scroll'; direction: 'up' | 'down' }
  | { type: 'open_dropdown'; field: string }
  | { type: 'select_option'; value: string };

export class ActionExecutor {
  private detector: FieldDetector;
  private adapter: ReactAdapter | VanillaAdapter;

  constructor(detector: FieldDetector) {
    this.detector = detector;
    this.adapter = this.detectFramework();
  }

  private detectFramework() {
    if ((window as any).React || document.querySelector('[data-reactroot]')) {
      return new ReactAdapter();
    }
    return new VanillaAdapter();
  }

  execute(action: Action) {
    switch (action.type) {
      case 'fill_field':
        return this.fillField(action.field, action.value);
      case 'navigate':
        return this.navigate(action.page);
      case 'scroll':
        return this.scroll(action.direction);
      case 'open_dropdown':
        return this.openDropdown(action.field);
      case 'select_option':
        return this.selectOption(action.value);
    }
  }

  private fillField(field: string, value: string) {
    const el = this.detector.findField(field) as any;
    if (!el) return { success: false, error: `Field not found: ${field}` };
    try {
      (el as HTMLElement).focus();
      (this.adapter as any).setValue(el, value);
      this.highlight(el);
      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  private navigate(page: string) {
    const route = page.startsWith('/') ? page : `/${page}`;
    window.location.assign(route);
    return { success: true };
  }

  private scroll(direction: 'up' | 'down') {
    window.scrollBy({ top: direction === 'down' ? 400 : -400, behavior: 'smooth' });
    return { success: true };
  }

  private openDropdown(field: string) {
    const el = this.detector.findField(field) as HTMLSelectElement | null;
    if (!el || el.tagName.toLowerCase() !== 'select') return { success: false, error: 'Dropdown not found' };
    el.focus();
    el.click();
    this.highlight(el);
    return { success: true };
  }

  private selectOption(value: string) {
    const active = document.activeElement as HTMLSelectElement | null;
    if (!active || active.tagName.toLowerCase() !== 'select') return { success: false, error: 'No active dropdown' };
    const v = value.toLowerCase();
    const opt = Array.from(active.options).find(
      (o) => o.text.toLowerCase().includes(v) || o.value.toLowerCase().includes(v)
    );
    if (!opt) return { success: false, error: 'Option not found' };
    active.value = opt.value;
    active.dispatchEvent(new Event('change', { bubbles: true }));
    return { success: true };
  }

  private highlight(el: HTMLElement) {
    el.classList.add('voice-assistant-highlight');
    setTimeout(() => el.classList.remove('voice-assistant-highlight'), 1200);
  }
}
