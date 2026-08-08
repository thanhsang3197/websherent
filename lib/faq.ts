import { siteConfig } from './site-config';

/**
 * Nội dung Câu hỏi thường gặp — dùng cho trang /cau-hoi-thuong-gap VÀ JSON-LD FAQPage.
 *
 * // TODO(chính sách): câu "Nếu trả trễ hẹn hoặc lỡ làm hư đồ thì sao?" mình chưa có số
 * // liệu cụ thể (mức phạt/đền bù) nên để câu trả lời chung, hướng khách nhắn Zalo.
 * // Nếu tiệm có chính sách rõ ràng, điền cụ thể vào đây để khách nắm được ngay.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'Thuê đồ cần đặt cọc bao nhiêu?',
    answer:
      `Mỗi mẫu có mức cọc riêng, ghi rõ ngay trên trang chi tiết sản phẩm (mục "Phí cọc"). ` +
      `Cọc được hoàn lại đầy đủ khi bạn trả đồ đúng hẹn và nguyên vẹn.`,
  },
  {
    question: 'Thời gian thuê là bao lâu?',
    answer:
      `Bạn có thể chọn thuê 1 ngày (từ 15:00 hôm nhận đến trước 20:00 hôm sau) hoặc 3 ngày ` +
      `(ngày nhận — ngày mặc — ngày trả). Nếu cần thuê thêm ngày, phí phát sinh là 10%/ngày ` +
      `— bạn chỉ cần báo trước cho ${siteConfig.name} qua Zalo.`,
  },
  {
    question: 'Cách giữ mẫu như thế nào?',
    answer:
      `Rất đơn giản: xem mẫu ưng ý trên website, bấm vào mẫu để lấy mã sản phẩm, rồi nhắn ` +
      `Zalo ${siteConfig.phone.display} kèm mã đó để giữ mẫu và chốt ngày nhận — trả. ` +
      `Không cần dùng Instagram hay Facebook để hỏi.`,
  },
  {
    question: 'Có thể đến thử đồ trực tiếp tại cửa hàng không?',
    answer:
      `Có. Bạn ghé trực tiếp tại ${siteConfig.address.full} trong giờ mở cửa ` +
      `(${siteConfig.openingHours.text}) để thử đồ trước khi quyết định.`,
  },
  {
    question: 'Ở xa có thuê được không? Có giao hàng không?',
    answer:
      `Có. Ngoài việc ghé cửa hàng, ${siteConfig.name} hỗ trợ cho thuê online và giao hàng ` +
      `trên phạm vi toàn quốc — chọn mẫu trên web rồi nhắn Zalo để được tư vấn size và cách gửi.`,
  },
  {
    question: 'Thanh toán bằng cách nào?',
    answer: 'Bạn có thể thanh toán tiền mặt hoặc chuyển khoản khi nhận đồ.',
  },
  {
    question: 'Nếu trả trễ hẹn hoặc lỡ làm hư đồ thì sao?',
    answer:
      `Cứ báo ngay cho ${siteConfig.name} qua Zalo càng sớm càng tốt — tiệm sẽ trao đổi ` +
      `phương án phù hợp với từng trường hợp cụ thể.`,
  },
  {
    question: 'Tiệm có những loại trang phục nào?',
    answer:
      'Đầm, váy dự tiệc; áo dài thiết kế; và pháp phục — đa dạng size, xem đầy đủ ở mục Sản phẩm.',
  },
  {
    question: 'Làm sao biết mẫu còn size mình cần?',
    answer:
      'Mỗi mẫu ghi rõ các size đang có ngay trên trang chi tiết. Nếu chưa chắc vừa dáng, cứ nhắn Zalo để được tư vấn size trước khi giữ mẫu.',
  },
];
