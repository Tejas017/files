export class ReactAdapter {
  setValue(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
    // Try to trigger React onChange via fiber if available; fall back to native
    const fiberKey = Object.keys(el).find((k) => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
    const fiber: any = fiberKey ? (el as any)[fiberKey] : undefined;
    const props = fiber?.memoizedProps;
    if (props && typeof props.onChange === 'function') {
      props.onChange({ target: { name: (el as any).name, value } });
      return;
    }
    // Fallback: native + events
    const tag = el.tagName.toLowerCase();
    const proto = tag === 'textarea' ? HTMLTextAreaElement.prototype : tag === 'select' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) setter.call(el, value);
    else (el as any).value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
