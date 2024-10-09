export function render(template: string, data: Record<string, any>): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return template.replace(/\$\{([\s\S]+?)\}/g, (match, p1) => {
    const keys = p1.trim().split('.');
    let value = data;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        return '';
      }
    }
    return value;
  });
}
