/** Reads a device image and returns a small, optimized data URL (WebP when supported). */
export async function fileToCompressedDataUrl(file: File, max = 256): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > 12 * 1024 * 1024) throw new Error("Image must be under 12MB");

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the image"));
    reader.readAsDataURL(file);
  });

  if (file.type === "image/svg+xml") return dataUrl;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not load the image"));
    el.src = dataUrl;
  });

  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const webp = canvas.toDataURL("image/webp", 0.82);
  if (webp.startsWith("data:image/webp")) return webp;
  return canvas.toDataURL("image/png");
}
