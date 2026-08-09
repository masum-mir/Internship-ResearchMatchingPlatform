export function buildMultipart(data, files = {}) {
  const form = new FormData();
  form.append(
    'data',
    new Blob([JSON.stringify(data ?? {})], { type: 'application/json' })
  );

  Object.entries(files).forEach(([key, file]) => {
    if (file instanceof File) form.append(key, file);
  });

  return form;
}
