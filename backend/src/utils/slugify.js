/**
 * Chuyển đổi một chuỗi tiếng Việt có dấu thành slug không dấu chuẩn SEO.
 * @param {string} text - Chuỗi cần chuyển đổi
 * @returns {string} Slug sạch dạng hoc-chu-cai
 */
export const generateVnSlug = (text) => {
  if (!text) return '';
  
  let slug = text.toString().toLowerCase();

  // Loại bỏ dấu tiếng Việt (Normal Form Decomposition)
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Thay thế ký tự đ, Đ đặc trưng của tiếng Việt
  slug = slug.replace(/đ/g, 'd');

  // Loại bỏ các ký tự đặc biệt, giữ lại chữ cái, số, khoảng trắng và dấu gạch ngang
  slug = slug.replace(/[^a-z0-9\s-]/g, '');

  // Thay thế các khoảng trắng và dấu gạch dưới liên tiếp bằng dấu gạch ngang
  slug = slug.replace(/[\s_]+/g, '-');

  // Loại bỏ các dấu gạch ngang liên tiếp
  slug = slug.replace(/-+/g, '-');

  // Loại bỏ dấu gạch ngang ở đầu và cuối chuỗi
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
};
