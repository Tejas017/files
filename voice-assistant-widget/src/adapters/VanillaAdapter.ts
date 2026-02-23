export class VanillaAdapter {
  setValue(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'select') {
      // best-effort: find option by text/value (case-insensitive contains)
      const options = Array.from((el as HTMLSelectElement).options);
      const v = value.toLowerCase();
      const match = options.find(
        (o) => o.text.toLowerCase().includes(v) || o.value.toLowerCase().includes(v)
      );
      if (match) (el as HTMLSelectElement).value = match.value;
    } else {
      const proto = tag === 'textarea' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (setter) setter.call(el, value);
      else (el as HTMLInputElement | HTMLTextAreaElement).value = value;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }
}
