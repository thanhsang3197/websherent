/**
 * Nền ô ảnh trên trang Thanh lý, luân phiên theo thứ tự trong lưới — kiểu
 * catalogue: mỗi mẫu đứng riêng trên một ô màu phẳng, cùng tỉ lệ, cùng cỡ.
 *
 * Đặt ở file thường (không 'use client') vì cả trang server lẫn SaleCard/
 * SaleGrid (client) cùng dùng: export thường từ module 'use client' bị Next
 * thay bằng client-reference khi import ở server — xem ghi chú SO_MAU_MOI_VE
 * trong lib/site-config.ts.
 */
export const NEN_O = ['bg-tint', 'bg-accent/15', 'bg-ink/[0.07]', 'bg-tint/50'];
