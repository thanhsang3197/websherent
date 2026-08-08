/**
 * Tạo slug tiếng Việt không dấu, thân thiện URL & SEO.
 */

/**
 * "AD35 Thủy Nhu" -> "ad35-thuy-nhu".
 * Bỏ dấu tiếng Việt, đổi đ/Đ -> d, hạ chữ thường, thay khoảng trắng/ký tự lạ bằng "-".
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD') // tách dấu khỏi ký tự gốc
    .replace(/[̀-ͯ]/g, '') // xoá dấu kết hợp (huyền, sắc, hỏi, ngã, nặng...)
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // ký tự không phải a-z0-9 -> "-"
    .replace(/^-+|-+$/g, ''); // bỏ "-" thừa ở đầu/cuối
}

/**
 * Slug đầy đủ cho 1 sản phẩm = slug(tên) + "-" + mã SP (viết thường).
 * Mã SP đảm bảo duy nhất vì tên/ảnh có thể trùng. Vd "amy-dress-s-t001".
 */
export function buildProductSlug(name: string, id: string): string {
  const namePart = slugify(name);
  const idPart = slugify(id);
  return namePart ? `${namePart}-${idPart}` : idPart;
}
