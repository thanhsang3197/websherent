import Link from 'next/link';
import type { ReactNode } from 'react';
import { siteConfig } from '@/lib/site-config';
import type { ThongKe } from '@/lib/thong-ke-gia';
import type { ProductCategory } from '@/types/product';

/**
 * BÀI CẨM NANG — bài viết trả lời đúng câu khách hay tìm trên Google/AI
 * ("thuê áo dài Hóc Môn giá bao nhiêu"...). Mục đích: người CHƯA biết tên
 * Sherent cũng tìm ra tiệm (trang sản phẩm chỉ bắt được người đã biết tên).
 *
 * QUY TẮC VIẾT:
 *  - Giá, số mẫu, size: KHÔNG ghi cứng — lấy từ `tk` (tính từ app nội bộ), shop
 *    đổi giá là bài tự đúng theo.
 *  - Chính sách (thời gian thuê, cọc, giao hàng…): chỉ ghi điều đã có ở
 *    lib/faq.ts. Đổi chính sách thì sửa cả hai chỗ.
 *  - Thêm bài: thêm một phần tử vào `BAI_VIET`, không cần sửa trang nào khác
 *    (danh sách, sitemap, llms.txt tự lấy từ đây).
 *  - GIỌNG VĂN (chủ shop chọn 27/11/2026): như trả lời tin nhắn Zalo. Tiệm
 *    xưng "em", gọi khách "chị iu", mở câu bằng "dạ", cuối câu "ạ"/"nha"; hỏi
 *    lại khách (đi dịp gì, chụp ở đâu, size, thích dài/ngắn, màu) rồi mới tư
 *    vấn; giá viết gọn "80k/1 ngày" (hàm k()). Không bịa chuyện khách. 3 bài
 *    ngày 26/11 viết lại theo giọng này ngày 27/11.
 */
export interface BaiViet {
  slug: string;
  /** Tiêu đề hiện trên trang + thẻ <title>. Nên chứa cụm khách hay gõ tìm. */
  tieuDe: string;
  /**
   * Thẻ <title> riêng khi `tieuDe` quá dài — Google cắt ở ~60 ký tự (đã tính
   * cả đuôi " · Sherent"), nên giữ khoảng 50 ký tự. Bỏ trống thì dùng tieuDe.
   */
  tieuDeSeo?: string;
  /** Mô tả ngắn (meta description, thẻ trong danh sách). ~150 ký tự. */
  moTa: string;
  /** yyyy-mm-dd */
  ngayDang: string;
  ngaySua?: string;
  /** Loại đồ dùng làm ảnh bìa và gợi ý mẫu cuối bài. */
  loai: Exclude<ProductCategory, 'phu-kien'>;
  noiDung: (tk: ThongKe) => ReactNode;
}

/**
 * Giá viết gọn kiểu chủ shop nhắn Zalo: 80000 -> "80k", 1500000 -> "1,5 triệu".
 * Dùng cho các bài viết giọng chat (từ 27/11/2026).
 */
function k(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('vi-VN')} triệu`;
  return `${Math.round(n / 1000)}k`;
}

/** "120k – 390k" */
function khoangK(thap: number, cao: number): string {
  return `${k(thap)} – ${k(cao)}`;
}

/**
 * Lịch nghỉ Tết Đinh Mùi 2027 — chủ shop báo 27/11/2026: nghỉ 29 Tết đến mùng 6.
 * Qua Tết 2027 thì sửa hoặc bỏ các đoạn nhắc tới hằng số này.
 */
const NGHI_TET = 'từ 29 Tết đến mùng 6 Tết (âm lịch)';

/** "S, M, L và Freesize" */
function lietKe(ds: string[]): string {
  if (ds.length <= 1) return ds.join('');
  return `${ds.slice(0, -1).join(', ')} và ${ds[ds.length - 1]}`;
}

const L = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href}>{children}</Link>
);

/** Đoạn dùng chung: 2 gói thời gian thuê — khớp lib/faq.ts. */
function GoiThoiGian() {
  return (
    <p>
      Thuê 1 ngày thì chị iu nhận đồ từ 3 giờ chiều, trả trước 8 giờ tối hôm sau, hợp khi mình
      chỉ mặc một buổi tiệc hay một buổi chụp. Thuê 3 ngày là ngày nhận, ngày mặc, ngày trả, mình
      có thời gian thử lại ở nhà, ủi cho phẳng, không phải vội trả. Cần thêm ngày thì chị iu nhắn
      em trước, mỗi ngày thêm 10% ạ.
    </p>
  );
}

/**
 * Đoạn dùng chung về tiền cọc — khớp lib/faq.ts.
 * Cọc bằng CCCD (chủ shop chốt 27/11/2026, quy tắc ở choCocCccd trong
 * lib/tui-do-mon.ts): áo dài thuê 1 ngày ≤ 80k và mọi pháp phục;
 * đầm, váy, gấm chỉ cọc tiền.
 *   - `kieu="ao-dai"`: bài chỉ nói về áo dài → có 2 hình thức.
 *   - `kieu="dam"`:    bài chỉ nói về đầm → chỉ cọc tiền.
 *   - `kieu="chung"`:  bài nói cả hai → ghi rõ CCCD chỉ cho áo dài ≤ 80k, pháp phục.
 */
function CachCoc({
  cocThap,
  kieu,
}: {
  cocThap: number | null | undefined;
  kieu: 'ao-dai' | 'dam' | 'chung';
}) {
  const muc = cocThap != null ? <>từ {k(cocThap)} </> : null;
  const traLai = (
    <>Trả đồ đúng hẹn, đồ nguyên vẹn là em gửi lại đủ cọc cho mình ạ.</>
  );

  if (kieu === 'dam') {
    return (
      <p>
        Đầm, váy thì cọc bằng tiền ạ, {muc}tuỳ mẫu, em ghi rõ trên trang từng mẫu. {traLai}
      </p>
    );
  }
  if (kieu === 'ao-dai') {
    return (
      <p>
        Cọc thì chị iu cọc tiền ({muc}tuỳ mẫu, ghi trên trang từng mẫu). Mẫu nào thuê 1 ngày từ
        80k trở xuống thì để lại <strong>CCCD</strong> thay cọc cũng được ạ, trên trang mẫu đó em
        có ghi &ldquo;không cần cọc tiền&rdquo;. Trả đồ đúng hẹn, đồ nguyên vẹn là em gửi lại đủ cọc
        hoặc CCCD cho mình.
      </p>
    );
  }
  return (
    <p>
      Cọc thì chị iu cọc tiền, {muc}tuỳ mẫu, ghi trên trang từng mẫu. Riêng{' '}
      <strong>pháp phục và áo dài thuê 1 ngày từ 80k trở xuống</strong> thì để lại CCCD thay cọc
      cũng được ạ, còn đầm, váy thì cọc tiền. {traLai}
    </p>
  );
}

function CachGiuMau() {
  return (
    <p>
      Chị iu xem mẫu ở <L href="/#san-pham">mục sản phẩm</L>, bấm vào mẫu ưng là thấy ảnh, size,
      giá thuê với tiền cọc. Nhắn Zalo hoặc Messenger cho em <strong>mã mẫu</strong> với ngày mình
      cần mặc, em xem còn trống ngày đó không rồi giữ mẫu, hẹn giờ nhận đồ cho mình ạ. Nhận ở tiệm{' '}
      {siteConfig.address.district} hoặc em gửi giao hàng, thanh toán tiền mặt hay chuyển khoản
      đều được.
    </p>
  );
}

export const BAI_VIET: BaiViet[] = [
  {
    slug: 'thue-ao-dai-hoc-mon-gia-bao-nhieu',
    tieuDe: 'Thuê áo dài ở Hóc Môn giá bao nhiêu? Bảng giá, tiền cọc và kinh nghiệm chọn mẫu',
    tieuDeSeo: 'Thuê áo dài Hóc Môn giá bao nhiêu? Giá và tiền cọc',
    moTa:
      'Giá thuê áo dài thiết kế tại Hóc Môn, tiền cọc, phụ kiện handmade đi kèm và mẹo chọn màu, chọn size cho chụp Tết, kỷ yếu, đám cưới.',
    ngayDang: '2026-11-26',
    ngaySua: '2026-11-27',
    loai: 'ao-dai',
    noiDung: (tk) => {
      const a = tk['ao-dai'];
      const p = tk['phap-phuc'];
      const pk = tk['phu-kien'];
      return (
        <>
          <p>
            Dạ một bộ áo dài thiết kế mua mới cũng vài triệu, mà một năm mình mặc có mấy lần: Tết,
            đám cưới bạn, chụp kỷ yếu. Nên nhiều chị iu chọn thuê, mỗi dịp một mẫu mới mà tốn ít
            hơn nhiều. Em gửi chị iu giá thuê thực tế bên em với mấy kinh nghiệm chọn mẫu nha.
          </p>

          <h2>Thuê áo dài bao nhiêu ạ?</h2>
          {a ? (
            <p>
              Dạ bên em đang có <strong>{a.soMau} mẫu áo dài</strong>, thuê 3 ngày{' '}
              <strong>
                {a.thue3Thap === a.thue3Cao ? k(a.thue3Thap) : khoangK(a.thue3Thap, a.thue3Cao)}
              </strong>
              , đa số mẫu {k(a.thue3PhoBien)} ạ.
              {a.thue1Thap != null && <> Thuê 1 ngày thì từ {k(a.thue1Thap)}.</>}
            </p>
          ) : (
            <p>Dạ giá từng mẫu em ghi trên trang của mẫu đó ạ.</p>
          )}
          <CachCoc cocThap={a?.cocThap} kieu="ao-dai" />
          {p && (
            <p>
              Bên em còn có {p.soMau} mẫu <strong>pháp phục</strong> (áo đi chùa),{' '}
              {p.thue3Thap === p.thue3Cao ? k(p.thue3Thap) : khoangK(p.thue3Thap, p.thue3Cao)}/3
              ngày. Chị iu xem thêm bài{' '}
              <L href="/cam-nang/thue-phap-phuc-di-chua-hoc-mon">pháp phục đi chùa</L> nha.
            </p>
          )}

          <h2>Thuê 1 ngày hay 3 ngày ạ?</h2>
          <GoiThoiGian />

          <h2>Mặc dịp nào thì chọn màu gì ạ?</h2>
          <p>Dạ chị iu mặc đi đâu ạ? Mỗi dịp em hay gợi ý vầy:</p>
          <ul>
            <li>
              <strong>Chụp Tết:</strong> đỏ, vàng, hồng đào nổi giữa hoa mai, hoa đào. Chụp nền
              hoa nhiều màu thì áo trắng hoặc kem cho ảnh nhẹ, không bị rối. Chụp Tết năm nay chị
              iu xem thêm bài <L href="/cam-nang/thue-ao-dai-chup-tet-2027">áo dài chụp Tết 2027</L>.
            </li>
            <li>
              <strong>Kỷ yếu:</strong> cả nhóm chọn một tông (cùng trắng, cùng pastel) hoặc cùng
              một mẫu mỗi người một màu, ảnh tập thể nhìn đều mắt ạ.
            </li>
            <li>
              <strong>Đi đám cưới:</strong> né trắng tinh với đỏ rực cho khỏi trùng cô dâu. Hồng
              phấn, xanh nhạt, tím pastel là an toàn nha chị iu.
            </li>
            <li>
              <strong>Lễ chùa, đám giỗ:</strong> chọn màu trầm, kín đáo, hoặc mặc pháp phục luôn ạ.
            </li>
          </ul>

          <h2>Size áo dài sao ạ?</h2>
          <p>
            {a && a.sizes.length > 0 && <>Dạ áo dài bên em có size {lietKe(a.sizes)} ạ. </>}
            Áo dài ôm người nên em cần số đo <strong>vòng ngực với vòng eo</strong> hơn là cân
            nặng. Chị iu đang lưng chừng hai size thì gửi em số đo, em xem form từng mẫu rồi báo
            lại cho mình. Ở gần thì ghé tiệm mặc thử là chắc nhất ạ.
          </p>

          <h2>Phụ kiện đi kèm thì sao ạ?</h2>
          <p>
            Cùng một bộ áo dài mà cầm thêm cây quạt, cài thêm cái trâm là ảnh khác hẳn đó chị iu.
            {pk && (
              <>
                {' '}
                Bên em có <strong>{pk.soMau} món phụ kiện</strong>, mỗi món{' '}
                {pk.thue3Thap === pk.thue3Cao
                  ? k(pk.thue3Thap)
                  : khoangK(pk.thue3Thap, pk.thue3Cao)}{' '}
                thôi ạ:
              </>
            )}
          </p>
          <ul>
            <li>
              <strong>Trên tóc:</strong> cài tóc, trâm, kẹp, hoa cài, vòng hoa.
            </li>
            <li>
              <strong>Cầm tay:</strong> quạt, túi xách (có cả túi hình nón lá), túi vải, ô.
            </li>
            <li>
              <strong>Trên người:</strong> kiềng, dây ngọc, khăn choàng.
            </li>
            <li>
              <strong>Cho đủ bộ:</strong> guốc, kính.
            </li>
          </ul>
          <p>
            Nhiều món bên em là <strong>đồ handmade</strong>, làm tay nên mỗi món một kiểu, chụp
            ảnh không sợ đụng hàng ạ. Trên trang từng mẫu áo dài em có gợi ý sẵn phụ kiện hợp mẫu
            đó, chị iu thêm vào túi đồ rồi nhắn em giữ chung với áo luôn nha.
          </p>

          <h2>Giữ mẫu thế nào ạ?</h2>
          <CachGiuMau />

          <h2>Mấy lưu ý nhỏ ạ</h2>
          <ul>
            <li>
              Mùa nhiều khách (trước Tết, mùa kỷ yếu tháng 3 tới tháng 5) chị iu giữ mẫu sớm giúp em,
              mẫu đẹp hết lịch nhanh lắm.
            </li>
            <li>Nhận đồ trước một ngày để mặc thử lại với giày và phụ kiện.</li>
          </ul>
          <p>Em cảm ơn chị iu nhiều ạ.</p>
        </>
      );
    },
  },
  {
    slug: 'mac-gi-di-dam-cuoi-thue-dam-du-tiec',
    tieuDe: 'Mặc gì đi đám cưới, tiệc tối? Gợi ý chọn đầm và giá thuê đầm dự tiệc',
    tieuDeSeo: 'Mặc gì đi đám cưới? Gợi ý và giá thuê đầm dự tiệc',
    moTa:
      'Gợi ý chọn đầm đi đám cưới, tiệc tối, sự kiện theo dáng người và màu sắc, kèm giá thuê đầm dự tiệc thiết kế tại Hóc Môn, TP.HCM.',
    ngayDang: '2026-11-26',
    ngaySua: '2026-11-27',
    loai: 'dam-vay',
    noiDung: (tk) => {
      const d = tk['dam-vay'];
      const g = tk.gam;
      return (
        <>
          <p>
            Dạ thiệp cưới tới, tiệc công ty sắp tới mà tủ đồ toàn bộ đã mặc rồi thì chị iu thuê
            đầm là nhẹ nhất ạ. Mặc có một tối mà mua nguyên cái đầm thì tiếc lắm. Em tư vấn chị iu
            chọn đầm theo dịp, theo dáng, kèm giá thuê bên em nha.
          </p>

          <h2>Đi dịp nào thì mặc gì ạ?</h2>
          <p>Dạ chị iu đi tiệc ban ngày hay buổi tối, ở nhà hàng hay ngoài trời ạ?</p>
          <ul>
            <li>
              <strong>Đám cưới ban ngày, tiệc ngoài trời:</strong> đầm midi, vải nhẹ, màu pastel
              hoặc hoa nhí.
            </li>
            <li>
              <strong>Tiệc cưới nhà hàng buổi tối:</strong> đầm dài hoặc đầm có điểm nhấn (đính
              kết, satin, lệch vai), màu đậm như xanh navy, đỏ rượu, đen.
            </li>
            <li>
              <strong>Tiệc công ty, sự kiện:</strong> đầm suông hoặc ôm nhẹ, dài qua gối, né xẻ
              cao hay hở nhiều nha. Tiệc cuối năm thì chị iu xem thêm bài{' '}
              <L href="/cam-nang/mac-gi-di-tiec-tat-nien-year-end-party">mặc gì đi tất niên</L>.
            </li>
            <li>
              <strong>Đi đám cưới nói chung:</strong> né trắng tinh cho khỏi trùng cô dâu ạ.
            </li>
          </ul>

          <h2>Dáng mình vầy thì chọn đầm sao ạ?</h2>
          <ul>
            <li>
              <strong>Chị iu nhỏ nhắn:</strong> đầm ngắn hoặc midi, eo cao cho chân dài ra. Đầm quá
              dài, nhiều tầng bèo dễ bị nuốt người ạ.
            </li>
            <li>
              <strong>Bắp tay to:</strong> chọn tay phồng, tay lỡ hoặc cổ vuông.
            </li>
            <li>
              <strong>Bụng chưa gọn:</strong> đầm chiết eo cao, dáng chữ A hoặc vải rũ nhẹ là che
              khéo lắm.
            </li>
            <li>
              <strong>Chị iu cao:</strong> đầm dài, xẻ tà, cổ yếm mặc lên rất đẹp.
            </li>
          </ul>

          <h2>Đầm thuê bao nhiêu ạ?</h2>
          {d ? (
            <p>
              Dạ bên em đang có <strong>{d.soMau} mẫu đầm, váy dự tiệc</strong>, thuê 3 ngày{' '}
              <strong>
                {d.thue3Thap === d.thue3Cao ? k(d.thue3Thap) : khoangK(d.thue3Thap, d.thue3Cao)}
              </strong>
              , đa số mẫu khoảng {k(d.thue3PhoBien)} ạ.
              {d.thue1Thap != null && <> Thuê 1 ngày thì từ {k(d.thue1Thap)}.</>}
            </p>
          ) : (
            <p>Dạ giá từng mẫu em ghi trên trang của mẫu đó ạ.</p>
          )}
          <CachCoc cocThap={d?.cocThap} kieu="dam" />
          {g && (
            <p>
              Chị iu muốn nổi hẳn thì bên em có thêm <strong>đầm gấm</strong> ({g.soMau} mẫu),{' '}
              {g.thue3Thap === g.thue3Cao ? k(g.thue3Thap) : khoangK(g.thue3Thap, g.thue3Cao)}/3
              ngày nha.
            </p>
          )}

          <h2>Thuê 1 ngày hay 3 ngày ạ?</h2>
          <GoiThoiGian />
          <p>Đi đám cưới buổi tối thì thuê 1 ngày là đủ rồi ạ.</p>

          <h2>Size sao ạ?</h2>
          <p>
            {d && d.sizes.length > 0 && <>Dạ đầm bên em có size {lietKe(d.sizes)} ạ. </>}
            Đầm ôm thì em cần số đo ngực, eo, mông. Đầm suông thì chủ yếu xem vai với chiều dài.
            Chị iu chưa chắc thì gửi em số đo, em tư vấn trước rồi mới giữ mẫu nha.
          </p>

          <h2>Giữ mẫu thế nào ạ?</h2>
          <CachGiuMau />
          <p>Em cảm ơn chị iu nhiều ạ.</p>
        </>
      );
    },
  },
  {
    slug: 'thue-do-online-chon-size-giu-mau-tu-xa',
    tieuDe: 'Thuê đầm, áo dài online: cách chọn size và giữ mẫu khi ở xa',
    tieuDeSeo: 'Thuê đầm, áo dài online: chọn size, giữ mẫu từ xa',
    moTa:
      'Ở xa vẫn thuê được đầm, áo dài thiết kế: hướng dẫn chọn size theo số đo, giữ mẫu qua Zalo/Messenger, nhận đồ qua giao hàng toàn quốc.',
    ngayDang: '2026-11-26',
    ngaySua: '2026-11-27',
    loai: 'dam-vay',
    noiDung: (tk) => {
      const d = tk['dam-vay'];
      const a = tk['ao-dai'];
      const sizes = Array.from(new Set([...(d?.sizes ?? []), ...(a?.sizes ?? [])]));
      const cacMucCoc = [d?.cocThap, a?.cocThap].filter((v): v is number => v != null);
      const cocThap = cacMucCoc.length ? Math.min(...cacMucCoc) : null;
      return (
        <>
          <p>
            Dạ chị iu ở xa {siteConfig.address.district} vẫn thuê được nha, bên em cho thuê online
            và gửi đồ đi các tỉnh. Nhiều chị iu ngại nhất là sợ mặc không vừa, nên em chỉ mình cách
            đo với chọn size trước ạ.
          </p>

          <h2>Đo số đo sao cho đúng ạ?</h2>
          <p>Dạ chị iu đo giúp em 4 số này nha:</p>
          <ul>
            <li>
              <strong>Vòng ngực:</strong> đo qua chỗ cao nhất của ngực, thước giữ ngang.
            </li>
            <li>
              <strong>Vòng eo:</strong> chỗ nhỏ nhất của eo, thường trên rốn chừng 2–3 cm.
            </li>
            <li>
              <strong>Vòng mông:</strong> chỗ nở nhất.
            </li>
            <li>
              <strong>Chiều cao:</strong> để em tính độ dài đầm, tà áo dài cho mình.
            </li>
          </ul>
          <p>Đo sát người, mặc đồ mỏng, đừng kéo thước chặt quá nha chị iu.</p>

          <h2>Chọn size sao ạ?</h2>
          <p>
            {sizes.length > 0 && <>Dạ đồ bên em có size {lietKe(sizes)} ạ. </>}
            Mẫu nào còn size gì em ghi ngay trên trang của mẫu đó.
          </p>
          <ul>
            <li>
              <strong>Freesize</strong> thường là dáng suông hoặc có dây rút, nhiều dáng mặc được,
              nhưng chị iu vẫn hỏi em số đo tối đa cho chắc nha.
            </li>
            <li>Áo dài với đầm ôm thì vừa ngực, vừa eo là quan trọng nhất.</li>
            <li>
              Lưng chừng hai size thì gửi em số đo. Em biết form từng mẫu nên tư vấn sát hơn bảng
              size chung ạ.
            </li>
          </ul>

          <h2>Giữ mẫu thế nào ạ?</h2>
          <CachGiuMau />
          <p>
            Ở xa thì chị iu báo em ngày cần mặc sớm một chút, để em tính thời gian gửi đồ cho kịp
            ạ.
          </p>

          <h2>Thuê mấy ngày ạ?</h2>
          <GoiThoiGian />

          <h2>Hết bao nhiêu tiền ạ?</h2>
          <ul>
            {d && (
              <li>
                Đầm, váy dự tiệc:{' '}
                {d.thue3Thap === d.thue3Cao ? k(d.thue3Thap) : khoangK(d.thue3Thap, d.thue3Cao)}/3
                ngày ({d.soMau} mẫu).
              </li>
            )}
            {a && (
              <li>
                Áo dài:{' '}
                {a.thue3Thap === a.thue3Cao ? k(a.thue3Thap) : khoangK(a.thue3Thap, a.thue3Cao)}/3
                ngày ({a.soMau} mẫu).
              </li>
            )}
          </ul>
          <CachCoc cocThap={cocThap} kieu="chung" />
          <p>
            Phí ship thì tuỳ địa chỉ, chị iu nhắn giữ mẫu là em báo luôn ạ. Còn thắc mắc gì chị iu
            xem thêm trang <L href="/cau-hoi-thuong-gap">Hỏi đáp</L> nha.
          </p>
          <p>Em cảm ơn chị iu nhiều ạ.</p>
        </>
      );
    },
  },
  {
    slug: 'thue-phap-phuc-di-chua-hoc-mon',
    tieuDe: 'Thuê pháp phục đi chùa ở Hóc Môn: giá thuê, chọn màu, chọn size',
    tieuDeSeo: 'Thuê pháp phục đi chùa Hóc Môn: giá, màu, size',
    moTa:
      'Pháp phục cách tân cho thuê 1 ngày hoặc 3 ngày, cọc tiền hoặc CCCD. Cách chọn màu đi lễ Rằm, đi chùa đầu năm, chọn size và vài lưu ý khi mặc vào chùa.',
    ngayDang: '2026-11-27',
    loai: 'phap-phuc',
    noiDung: (tk) => {
      const p = tk['phap-phuc'];
      return (
        <>
          <p>
            Dạ chị iu tính đi chùa đầu năm, đi lễ Rằm hay muốn có bộ ảnh nhẹ nhàng ở chùa mà chưa
            có pháp phục thì thuê là hợp nhất ạ. Một năm mình mặc có mấy lần, mua về treo tủ thì
            tiếc lắm.
            {p && (
              <>
                {' '}
                Bên em đang có <strong>{p.soMau} mẫu pháp phục cách tân</strong>, nhiều màu, chị
                iu xem thử nha.
              </>
            )}
          </p>

          <h2>Pháp phục thuê bao nhiêu ạ?</h2>
          {p ? (
            <p>
              Dạ pháp phục bên em giá{' '}
              {p.thue1Thap != null && (
                <>
                  <strong>{k(p.thue1Thap)}/1 ngày</strong>,{' '}
                </>
              )}
              <strong>
                {p.thue3Thap === p.thue3Cao ? k(p.thue3Thap) : khoangK(p.thue3Thap, p.thue3Cao)}
                /3 ngày
              </strong>{' '}
              ạ.
              {p.cocPhoBien != null && (
                <>
                  {' '}
                  Cọc {k(p.cocPhoBien)}, hoặc chị iu để lại CCCD cũng được ạ.
                </>
              )}{' '}
              Trả đồ đúng hẹn, đồ nguyên vẹn là em gửi lại đủ cọc cho mình.
            </p>
          ) : (
            <p>Dạ giá từng mẫu em ghi trên trang của mẫu đó ạ.</p>
          )}
          <p>
            Thuê 1 ngày thì chị iu nhận đồ từ 3 giờ chiều, trả trước 8 giờ tối hôm sau. Thuê 3 ngày
            là ngày nhận, ngày mặc, ngày trả, đi chùa xa hay về quê cũng không phải vội. Cần thêm
            ngày thì chị iu nhắn em trước, mỗi ngày thêm 10% ạ.
          </p>

          <h2>Nên chọn màu nào ạ?</h2>
          <p>
            Dạ chị iu đi dịp gì, đi một mình hay đi cùng gia đình ạ? Em hay hỏi vậy trước, rồi
            gợi ý theo kiểu này:
          </p>
          <ul>
            <li>
              <strong>Đi lễ Rằm, mùng Một, đi chùa đầu năm:</strong> trắng, be, kem. Nhìn thanh
              tịnh mà lên ảnh cũng sáng da.
            </li>
            <li>
              <strong>Muốn tươi hơn chút cho ngày đầu năm:</strong> hồng nhạt, vàng nhạt.
            </li>
            <li>
              <strong>Chụp ngoài sân chùa, trời nắng:</strong> xanh lá, xanh dương nhạt nhìn mát
              mắt.
            </li>
            <li>
              <strong>Đi cả nhà hoặc nhóm bạn:</strong> nhiều mẫu bên em có cùng một kiểu mà nhiều
              màu, mỗi người một màu đứng chung ảnh rất đều ạ.
            </li>
          </ul>

          <h2>Size sao ạ?</h2>
          <p>
            {p && p.sizes.length > 0 && (
              <>
                Dạ pháp phục bên em có size {lietKe(p.sizes)} ạ.{' '}
              </>
            )}
            Chị iu chưa chắc size nào thì gửi em chiều cao, cân nặng với số đo vòng ngực, em xem
            form từng bộ rồi báo lại cho mình. Ở gần thì ghé tiệm mặc thử là chắc nhất ạ.
          </p>

          <h2>Mặc pháp phục vào chùa cần để ý gì ạ?</h2>
          <ul>
            <li>Tóc búi hoặc kẹp gọn, nhìn trang nghiêm mà chụp ảnh cũng gọn gàng.</li>
            <li>
              Đi dép hay giày dễ tháo, vì vào chánh điện mình để dép bên ngoài ạ.
            </li>
            <li>Trang điểm nhẹ, đeo ít trang sức thôi chị iu.</li>
            <li>
              Chụp ảnh thì tránh lúc mọi người đang hành lễ, đừng tạo dáng ngay trước bàn thờ
              Phật, nói chuyện nhỏ nhẹ ạ.
            </li>
          </ul>
          <p>
            Chị iu cần túi vải, kẹp tóc hay quạt cầm tay cho đủ bộ thì bên em có cho thuê phụ kiện
            luôn, nhắn em lấy kèm nha.
          </p>

          <h2>Muốn mặc đi chùa mùng Một Tết thì sao ạ?</h2>
          <p>
            Dạ bên em <strong>nghỉ Tết {NGHI_TET}</strong>. Chị iu muốn mặc đi chùa đầu năm thì
            nhận đồ trước 29 Tết, nhắn em trước để em giữ mẫu và hẹn ngày trả cho mình ạ. Gần Tết
            nhiều người giữ mẫu lắm, chị iu nhắn sớm giúp em nha. Chụp áo dài Tết thì chị iu xem
            thêm bài <L href="/cam-nang/thue-ao-dai-chup-tet-2027">thuê áo dài chụp Tết</L>.
          </p>

          <h2>Giữ mẫu thế nào ạ?</h2>
          <p>
            Chị iu xem mẫu ở <L href="/#san-pham">mục sản phẩm</L>, bấm vào mẫu ưng là thấy mã
            mẫu. Nhắn Zalo hoặc Messenger cho em mã mẫu với ngày mình cần mặc, em xem lịch rồi giữ
            cho mình ạ.
          </p>
          <p>
            Ở gần thì chị iu ghé tiệm ở {siteConfig.address.full} thử đồ, mở cửa{' '}
            {siteConfig.openingHours.text}. Ở xa thì em gửi đồ đi tỉnh được ạ. Thanh toán tiền mặt
            hay chuyển khoản đều được.
          </p>
          <p>Em cảm ơn chị iu nhiều ạ.</p>
        </>
      );
    },
  },
  {
    slug: 'thue-ao-dai-chup-tet-2027',
    tieuDe: 'Thuê áo dài chụp Tết 2027: giữ mẫu lúc nào, chọn màu theo nền chụp',
    tieuDeSeo: 'Thuê áo dài chụp Tết 2027: giữ mẫu, chọn màu',
    moTa:
      'Tết Đinh Mùi 2027 chụp áo dài nên giữ mẫu từ khi nào, chọn màu theo nền mai, đào, phố lồng đèn, phụ kiện đi kèm, giá thuê và lịch nghỉ Tết của tiệm.',
    ngayDang: '2026-11-27',
    loai: 'ao-dai',
    noiDung: (tk) => {
      const a = tk['ao-dai'];
      const pk = tk['phu-kien'];
      return (
        <>
          <p>
            Dạ Tết năm nay là Tết Đinh Mùi, mùng Một rơi vào thứ Bảy, 6/2/2027 ạ. Chị iu tính
            chụp áo dài Tết thì đọc giúp em mấy dòng này trước khi chọn mẫu nha.
          </p>

          <h2>Bên em nghỉ Tết ngày nào ạ?</h2>
          <p>
            Dạ bên em <strong>nghỉ Tết {NGHI_TET}</strong>. Chị iu muốn mặc áo dài trong mấy ngày
            Tết thì nhận đồ trước 29 Tết, nhắn em trước để em hẹn ngày trả cho mình ạ.
          </p>

          <h2>Nên giữ mẫu từ lúc nào ạ?</h2>
          <p>
            Chụp ảnh Tết hay dồn vào mấy tuần cuối tháng Chạp, cuối tuần lại càng đông. Chị iu
            chốt được ngày chụp là nhắn em giữ mẫu luôn nha, giữ sớm thì còn nhiều mẫu để chọn
            hơn ạ.
          </p>

          <h2>Chọn màu áo dài sao cho đẹp ạ?</h2>
          <p>
            Dạ chị iu định chụp ở đâu ạ, chụp một mình hay nhóm bạn ạ? Em hỏi vậy vì màu áo phải
            hợp với nền chụp thì ảnh mới nổi:
          </p>
          <ul>
            <li>
              <strong>Nền mai vàng:</strong> áo trắng, đỏ hoặc xanh ngọc tách khỏi nền rất rõ.
              Áo vàng đứng cạnh mai dễ bị chìm ạ.
            </li>
            <li>
              <strong>Nền hoa đào, hoa giấy hồng:</strong> trắng, kem, xanh nhạt nhìn nhẹ nhàng.
            </li>
            <li>
              <strong>Phố lồng đèn, nền nhiều màu đỏ:</strong> trắng, vàng nhạt, be cho khỏi lẫn
              vào nền.
            </li>
            <li>
              <strong>Chụp ở nhà, nền tường trơn:</strong> chị iu mạnh dạn chọn màu đậm như đỏ,
              xanh lá đậm, áo sẽ là điểm nhấn của tấm ảnh.
            </li>
            <li>
              <strong>Chụp nhóm bạn:</strong> cả nhóm chọn cùng một tông, hoặc cùng một kiểu mỗi
              người một màu, ảnh tập thể nhìn đều mắt ạ.
            </li>
          </ul>

          <h2>Thêm phụ kiện gì cho ảnh Tết ạ?</h2>
          <p>
            Cầm thêm cây quạt, cây ô hay đeo cái kiềng là bộ ảnh khác hẳn đó chị iu. Bên em có cho
            thuê quạt, ô, túi nón lá, kiềng, cài tóc, khăn choàng, guốc
            {pk && (
              <>
                , mỗi món chỉ{' '}
                {pk.thue3Thap === pk.thue3Cao
                  ? k(pk.thue3Thap)
                  : khoangK(pk.thue3Thap, pk.thue3Cao)}{' '}
                thôi ạ
              </>
            )}
            . Chị iu nhắn em lấy kèm với áo dài cho tiện nha.
          </p>

          <h2>Áo dài thuê bao nhiêu ạ?</h2>
          {a ? (
            <p>
              Dạ áo dài bên em{' '}
              <strong>
                {a.thue3Thap === a.thue3Cao ? k(a.thue3Thap) : khoangK(a.thue3Thap, a.thue3Cao)}
                /3 ngày
              </strong>
              , đa số mẫu {k(a.thue3PhoBien)} ạ.
              {a.thue1Thap != null && <> Thuê 1 ngày thì từ {k(a.thue1Thap)}.</>}
              {a.cocThap != null && (
                <> Cọc tiền từ {k(a.cocThap)} tuỳ mẫu,</>
              )}{' '}
              mẫu nào thuê 1 ngày từ 80k trở xuống thì chị iu để lại CCCD thay cọc cũng được ạ. Giá
              với cọc từng mẫu em ghi trên trang của mẫu đó.
            </p>
          ) : (
            <p>Dạ giá từng mẫu em ghi trên trang của mẫu đó ạ.</p>
          )}
          <p>
            Thuê 1 ngày là nhận từ 3 giờ chiều, trả trước 8 giờ tối hôm sau. Thuê 3 ngày là ngày
            nhận, ngày chụp, ngày trả, mình có thời gian thử lại ở nhà ạ.
          </p>

          <h2>Size áo dài sao ạ?</h2>
          <p>
            {a && a.sizes.length > 0 && <>Dạ áo dài bên em có size {lietKe(a.sizes)} ạ. </>}
            Áo dài ôm người nên chị iu gửi em số đo vòng ngực với vòng eo, em xem form từng mẫu
            rồi báo lại cho mình. Ở gần thì ghé tiệm mặc thử luôn cho chắc nha.
          </p>

          <h2>Mấy điều nhỏ cho buổi chụp</h2>
          <ul>
            <li>Nhận đồ trước ngày chụp để mặc thử với giày và phụ kiện.</li>
            <li>Mặc đồ lót màu da bên trong, áo màu nhạt không bị lộ.</li>
            <li>Trang điểm xong rồi mới mặc áo, để phấn son không dính lên cổ áo ạ.</li>
            <li>
              Sáng mùng Một đi chùa thì chị iu xem thêm{' '}
              <L href="/cam-nang/thue-phap-phuc-di-chua-hoc-mon">pháp phục đi chùa</L> bên em nha.
            </li>
          </ul>

          <h2>Giữ mẫu thế nào ạ?</h2>
          <p>
            Chị iu xem mẫu ở <L href="/#san-pham">mục sản phẩm</L>, bấm vào mẫu ưng là thấy mã
            mẫu. Nhắn Zalo hoặc Messenger cho em mã mẫu với ngày chụp, em xem lịch rồi giữ cho
            mình ạ. Ở xa em gửi đồ đi tỉnh được, thanh toán tiền mặt hay chuyển khoản đều được.
          </p>
          <p>Em cảm ơn chị iu nhiều ạ.</p>
        </>
      );
    },
  },
  {
    slug: 'mac-gi-di-tiec-tat-nien-year-end-party',
    tieuDe: 'Mặc gì đi tiệc tất niên, year-end party cho đẹp mà không lố?',
    tieuDeSeo: 'Mặc gì đi tiệc tất niên cho đẹp mà không lố?',
    moTa:
      'Chọn đầm đi tiệc tất niên, year-end party công ty theo dress code, dài hay ngắn, lụa hay satin, màu gì. Kèm giá thuê đầm dự tiệc 1 ngày, 3 ngày tại Hóc Môn.',
    ngayDang: '2026-11-27',
    loai: 'dam-vay',
    noiDung: (tk) => {
      const d = tk['dam-vay'];
      const g = tk.gam;
      return (
        <>
          <p>
            Dạ cuối năm là mùa tiệc: tất niên công ty, year-end party, họp lớp. Chị iu chưa biết
            mặc gì cho đẹp mà không bị lố thì để em tư vấn cho mình nha.
          </p>

          <h2>Trước khi chọn, em hỏi chị iu mấy câu ạ</h2>
          <p>
            Dạ đầu tiên chị iu cho em xin size của mình, rồi cho em hỏi chị iu thích mặc dài hay
            ngắn, có thích lụa không, thích màu gì ạ. Biết mấy cái này là em lọc mẫu cho mình
            nhanh lắm.
          </p>
          <ul>
            <li>
              <strong>Size:</strong>{' '}
              {d && d.sizes.length > 0 ? (
                <>đầm bên em có size {lietKe(d.sizes)}, mỗi mẫu ghi rõ size trên trang.</>
              ) : (
                <>mỗi mẫu ghi rõ size trên trang.</>
              )}{' '}
              Đầm ôm thì em cần thêm số đo ngực, eo, mông.
            </li>
            <li>
              <strong>Dài hay ngắn:</strong> tiệc ở nhà hàng, khách sạn thì đầm dài hoặc qua gối
              nhìn sang hơn. Tiệc nhẹ, họp lớp thì đầm ngắn, midi cho dễ đi lại.
            </li>
            <li>
              <strong>Lụa hay satin:</strong> lụa mềm, rũ, nhìn nhẹ nhàng. Satin có độ bóng, lên
              ảnh dưới đèn tiệc rất sang ạ.
            </li>
            <li>
              <strong>Màu:</strong> đen, đỏ rượu, xanh navy hợp tiệc tối. Thích tươi thì hồng,
              champagne, xanh pastel.
            </li>
          </ul>

          <h2>Công ty có dress code thì sao ạ?</h2>
          <ul>
            <li>
              <strong>Sang trọng, gala:</strong> đầm dài, satin hoặc đính kết.
              {g && <> Bên em có thêm đầm gấm ({g.soMau} mẫu) cho chị iu muốn nổi bật hẳn.</>}
            </li>
            <li>
              <strong>Có màu chủ đề:</strong> chọn đầm đúng tông, rồi thêm phụ kiện cho khác
              người bên cạnh.
            </li>
            <li>
              <strong>Vintage, retro:</strong> bên em có nhiều đầm dáng vintage, chị iu nhắn em
              gửi mẫu cho mình xem ạ.
            </li>
            <li>
              <strong>Không có dress code:</strong> đầm midi ôm nhẹ, màu trơn là an toàn mà vẫn
              xinh.
            </li>
          </ul>

          <h2>Đẹp mà không lố là sao ạ?</h2>
          <ul>
            <li>Tiệc công ty thì tránh đầm xẻ quá cao hay hở nhiều nha chị iu.</li>
            <li>
              Nhà hàng máy lạnh hay lạnh lắm, chị iu lấy thêm khăn choàng, bên em có cho thuê ạ.
            </li>
            <li>Đi giày quen chân, tiệc tất niên đứng nói chuyện lâu lắm.</li>
            <li>Hỏi trước màu với bạn đi cùng để khỏi đụng đầm.</li>
          </ul>
          <p>
            Chị iu muốn chọn đầm theo dáng người thì xem thêm bài{' '}
            <L href="/cam-nang/mac-gi-di-dam-cuoi-thue-dam-du-tiec">mặc gì đi đám cưới</L> bên em
            nha.
          </p>

          <h2>Đầm thuê bao nhiêu ạ?</h2>
          {d ? (
            <p>
              Dạ đầm dự tiệc bên em{' '}
              <strong>
                {d.thue3Thap === d.thue3Cao ? k(d.thue3Thap) : khoangK(d.thue3Thap, d.thue3Cao)}
                /3 ngày
              </strong>
              , đa số mẫu khoảng {k(d.thue3PhoBien)} ạ.
              {d.thue1Thap != null && <> Thuê 1 ngày thì từ {k(d.thue1Thap)}.</>}
              {g && (
                <>
                  {' '}
                  Đầm gấm{' '}
                  {g.thue3Thap === g.thue3Cao ? k(g.thue3Thap) : khoangK(g.thue3Thap, g.thue3Cao)}
                  /3 ngày.
                </>
              )}
            </p>
          ) : (
            <p>Dạ giá từng mẫu em ghi trên trang của mẫu đó ạ.</p>
          )}
          <p>
            Đầm thì cọc bằng tiền ạ
            {d?.cocThap != null && <>, từ {k(d.cocThap)} tuỳ mẫu</>}. Trả đồ đúng hẹn, đồ nguyên
            vẹn là em gửi lại đủ cọc cho mình.
          </p>

          <h2>Tiệc buổi tối thì thuê 1 ngày là đủ ạ</h2>
          <p>
            Thuê 1 ngày chị iu nhận đồ từ 3 giờ chiều, tối đi tiệc, trả trước 8 giờ tối hôm sau.
            Muốn có thời gian thử đồ ở nhà thì thuê 3 ngày: ngày nhận, ngày đi tiệc, ngày trả.
            Cần thêm ngày thì nhắn em trước, mỗi ngày thêm 10% ạ.
          </p>

          <h2>Nhớ giữ mẫu sớm nha chị iu</h2>
          <p>
            Tiệc cuối năm dồn vào tháng 12 tới sát Tết, mẫu đẹp hay bị giữ trước. Bên em{' '}
            <strong>nghỉ Tết {NGHI_TET}</strong>, nên tiệc tất niên trước Tết thì chị iu tính lịch
            trả đồ trước 29 Tết giúp em ạ.
          </p>
          <p>
            Chị iu xem mẫu ở <L href="/#san-pham">mục sản phẩm</L>, bấm vào mẫu ưng là thấy mã.
            Nhắn Zalo hoặc Messenger cho em mã mẫu với ngày đi tiệc, em xem lịch rồi giữ cho mình.
            Ở gần thì ghé tiệm thử, {siteConfig.openingHours.text}. Ở xa em gửi đồ đi tỉnh được ạ.
          </p>
          <p>Em cảm ơn chị iu nhiều ạ.</p>
        </>
      );
    },
  },
];

export function getBaiViet(slug: string): BaiViet | undefined {
  return BAI_VIET.find((b) => b.slug === slug);
}
