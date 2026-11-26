import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatVnd } from '@/lib/format';
import { siteConfig } from '@/lib/site-config';
import type { ThongKe, ThongKeLoai } from '@/lib/thong-ke-gia';
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

const gia = formatVnd;

/** "S, M, L và Freesize" */
function lietKe(ds: string[]): string {
  if (ds.length <= 1) return ds.join('');
  return `${ds.slice(0, -1).join(', ')} và ${ds[ds.length - 1]}`;
}

/** "từ 100.000₫ đến 300.000₫" hoặc "đồng giá 100.000₫" */
function khoangGia(t: ThongKeLoai): string {
  return t.thue3Thap === t.thue3Cao
    ? `đồng giá ${gia(t.thue3Thap)}`
    : `từ ${gia(t.thue3Thap)} đến ${gia(t.thue3Cao)}`;
}

const L = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href}>{children}</Link>
);

/** Đoạn dùng chung: 2 gói thời gian thuê — khớp lib/faq.ts. */
function GoiThoiGian() {
  return (
    <ul>
      <li>
        <strong>Thuê 1 ngày:</strong> nhận đồ từ 15:00, trả trước 20:00 hôm sau. Hợp khi bạn chỉ
        mặc một buổi tiệc hoặc một buổi chụp.
      </li>
      <li>
        <strong>Thuê 3 ngày:</strong> ngày nhận, ngày mặc, ngày trả. Thoải mái thử lại ở nhà, ủi
        phẳng và không phải vội trả.
      </li>
      <li>
        Cần thêm ngày thì báo trước cho tiệm, phí phát sinh <strong>10% mỗi ngày</strong>.
      </li>
    </ul>
  );
}

/**
 * Đoạn dùng chung về tiền cọc — khớp lib/faq.ts.
 * Cọc bằng CCCD CHỈ áp dụng cho áo dài và pháp phục (chủ shop 26/11/2026);
 * đầm, váy, gấm chỉ cọc tiền.
 *   - `kieu="ao-dai"`: bài chỉ nói về áo dài → có 2 hình thức.
 *   - `kieu="dam"`:    bài chỉ nói về đầm → chỉ cọc tiền.
 *   - `kieu="chung"`:  bài nói cả hai → ghi rõ CCCD chỉ cho áo dài, pháp phục.
 */
function CachCoc({
  cocThap,
  kieu,
}: {
  cocThap: number | null | undefined;
  kieu: 'ao-dai' | 'dam' | 'chung';
}) {
  const tienCoc = (
    <>
      {cocThap != null ? <>từ {gia(cocThap)}, </> : null}tuỳ mẫu, ghi rõ trên trang từng mẫu
    </>
  );

  if (kieu === 'dam') {
    return (
      <p>
        Đầm, váy dự tiệc đặt cọc bằng tiền: {tienCoc}. Tiền cọc được{' '}
        <strong>trả lại đầy đủ</strong> khi bạn trả đồ đúng hẹn và nguyên vẹn.
      </p>
    );
  }

  return (
    <>
      <p>
        {kieu === 'ao-dai' ? (
          <>
            Áo dài có <strong>2 hình thức đặt cọc</strong>, bạn chọn cách nào tiện:
          </>
        ) : (
          <>Về tiền cọc:</>
        )}
      </p>
      <ul>
        <li>
          <strong>Cọc tiền:</strong> {tienCoc}.
        </li>
        <li>
          <strong>Cọc bằng CCCD:</strong> để lại căn cước công dân thay cho tiền cọc
          {kieu === 'ao-dai' ? (
            <> (áp dụng cho áo dài và pháp phục)</>
          ) : (
            <>
              , <strong>chỉ áp dụng cho áo dài và pháp phục</strong>; đầm, váy cọc bằng tiền
            </>
          )}
          .
        </li>
      </ul>
      <p>
        Tiền cọc hoặc CCCD được <strong>trả lại đầy đủ</strong> khi bạn trả đồ đúng hẹn và nguyên
        vẹn.
      </p>
    </>
  );
}

function CachGiuMau() {
  return (
    <ol>
      <li>
        Xem mẫu trên <L href="/#san-pham">trang sản phẩm</L>, bấm vào mẫu ưng ý để xem ảnh, size,
        phí thuê và tiền cọc.
      </li>
      <li>
        Nhắn Zalo hoặc Messenger cho {siteConfig.name} kèm <strong>mã mẫu</strong> và ngày bạn cần
        mặc.
      </li>
      <li>Tiệm báo còn trống ngày đó không, giữ mẫu và hẹn giờ nhận đồ.</li>
      <li>
        Nhận đồ tại tiệm ở {siteConfig.address.district} hoặc nhận qua giao hàng, thanh toán tiền
        mặt hay chuyển khoản đều được.
      </li>
    </ol>
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
    loai: 'ao-dai',
    noiDung: (tk) => {
      const a = tk['ao-dai'];
      const p = tk['phap-phuc'];
      const pk = tk['phu-kien'];
      return (
        <>
          <p>
            Mua một bộ áo dài thiết kế đẹp thường tốn vài triệu, trong khi mỗi năm bạn chỉ mặc vài
            lần: Tết, đám cưới bạn bè, chụp kỷ yếu. Vì vậy ngày càng nhiều người chọn{' '}
            <strong>thuê áo dài</strong>: mỗi dịp một mẫu mới, chi phí chỉ bằng một phần nhỏ. Bài
            này tổng hợp giá thuê thực tế tại {siteConfig.name} ({siteConfig.address.district},{' '}
            {siteConfig.address.city}) và vài kinh nghiệm để chọn được bộ vừa ý.
          </p>

          <h2>Giá thuê áo dài bao nhiêu?</h2>
          {a ? (
            <>
              <p>
                Hiện tiệm có <strong>{a.soMau} mẫu áo dài</strong>, phí thuê 3 ngày {khoangGia(a)},
                phần lớn các mẫu ở mức <strong>{gia(a.thue3PhoBien)}</strong>.
                {a.thue1Thap != null && (
                  <>
                    {' '}
                    Nếu chỉ cần 1 ngày, giá chỉ từ <strong>{gia(a.thue1Thap)}</strong>.
                  </>
                )}
              </p>
              <CachCoc cocThap={a.cocThap} kieu="ao-dai" />
            </>
          ) : (
            <p>Giá từng mẫu ghi rõ trên trang sản phẩm.</p>
          )}
          {p && (
            <p>
              Ngoài áo dài, tiệm còn {p.soMau} mẫu <strong>pháp phục</strong> (áo đi chùa) với phí
              thuê {khoangGia(p)}.
            </p>
          )}

          <h2>Thuê bao lâu thì hợp?</h2>
          <GoiThoiGian />

          <h2>Chọn màu áo dài theo dịp</h2>
          <ul>
            <li>
              <strong>Chụp Tết:</strong> đỏ, vàng, hồng đào nổi bật giữa hoa mai, hoa đào. Nếu
              chụp nền hoa nhiều màu, áo trắng hoặc kem giúp ảnh nhẹ nhàng, không bị rối.
            </li>
            <li>
              <strong>Kỷ yếu:</strong> cả nhóm nên thống nhất một tông (cùng trắng, cùng pastel)
              hoặc cùng một mẫu khác màu để ảnh tập thể đều mắt.
            </li>
            <li>
              <strong>Đi đám cưới:</strong> tránh trắng tinh và đỏ rực để không trùng cô dâu; hồng
              phấn, xanh nhạt, tím pastel là lựa chọn an toàn.
            </li>
            <li>
              <strong>Lễ chùa, đám giỗ:</strong> chọn màu trầm, kín đáo, hoặc chuyển sang pháp
              phục.
            </li>
          </ul>

          <h2>Chọn size cho vừa</h2>
          <p>
            {a && a.sizes.length > 0 ? (
              <>
                Áo dài tại tiệm có các size {lietKe(a.sizes)}.{' '}
              </>
            ) : null}
            Áo dài ôm sát nên cần chú ý số đo <strong>vòng ngực và vòng eo</strong> hơn là cân
            nặng. Nếu bạn đang giữa hai size, cứ nhắn số đo cho tiệm để được tư vấn trước khi giữ
            mẫu. Ở gần thì tốt nhất là ghé thử trực tiếp.
          </p>

          <h2>Phụ kiện đi kèm: điểm nhấn cho bộ áo dài</h2>
          <p>
            Cùng một bộ áo dài, thêm chiếc quạt, cài tóc hay túi xách là bộ ảnh đã khác hẳn. Vì
            vậy ngoài áo dài, {siteConfig.name} còn cho thuê
            {pk ? (
              <>
                {' '}
                <strong>{pk.soMau} món phụ kiện</strong>, giá chỉ {khoangGia(pk)} mỗi món
              </>
            ) : (
              ' phụ kiện đi kèm với giá rất mềm'
            )}
            :
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
              <strong>Hoàn thiện:</strong> guốc, kính.
            </li>
          </ul>
          <p>
            Đặc biệt, tiệm có nhiều <strong>phụ kiện handmade làm thủ công</strong>: mỗi món một
            nét riêng, khó tìm thấy ở nơi khác, giúp bộ ảnh của bạn có điểm nhấn mà không bị đụng
            hàng.
          </p>
          <p>
            Trên trang từng mẫu áo dài đều có sẵn gợi ý phụ kiện hợp với mẫu đó. Bạn chỉ cần thêm
            vào túi đồ và nhắn tiệm giữ cùng lúc với áo dài.
          </p>

          <h2>Cách thuê áo dài tại {siteConfig.name}</h2>
          <CachGiuMau />

          <h2>Mẹo nhỏ để buổi chụp suôn sẻ</h2>
          <ul>
            <li>
              Đặt mẫu sớm vào mùa cao điểm (trước Tết, mùa kỷ yếu tháng 3 đến tháng 5) vì mẫu đẹp
              hết lịch rất nhanh.
            </li>
            <li>Nhận đồ trước một ngày để thử lại cùng giày và phụ kiện.</li>
          </ul>
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
    loai: 'dam-vay',
    noiDung: (tk) => {
      const d = tk['dam-vay'];
      const g = tk.gam;
      return (
        <>
          <p>
            Thiệp cưới tới, tiệc công ty sắp diễn ra mà tủ đồ toàn là những bộ đã mặc rồi? Thay vì
            mua một chiếc đầm chỉ mặc một lần, bạn có thể <strong>thuê đầm dự tiệc</strong> thiết
            kế với giá chỉ bằng một phần nhỏ. Dưới đây là cách chọn đầm hợp dịp, hợp dáng và giá
            thuê thực tế tại {siteConfig.name}.
          </p>

          <h2>Chọn đầm theo dịp</h2>
          <ul>
            <li>
              <strong>Đám cưới ban ngày, tiệc ngoài trời:</strong> đầm midi, chất liệu nhẹ, màu
              pastel hoặc hoạ tiết hoa nhỏ.
            </li>
            <li>
              <strong>Tiệc cưới nhà hàng buổi tối:</strong> đầm dài hoặc đầm có điểm nhấn (đính
              kết, satin, lệch vai), màu đậm như xanh navy, đỏ rượu, đen.
            </li>
            <li>
              <strong>Tiệc công ty, sự kiện:</strong> đầm dáng suông hoặc ôm nhẹ, độ dài qua gối,
              tránh xẻ quá cao hay hở nhiều.
            </li>
            <li>
              <strong>Đi đám cưới nói chung:</strong> tránh trắng tinh để không trùng cô dâu.
            </li>
          </ul>

          <h2>Chọn đầm theo dáng người</h2>
          <ul>
            <li>
              <strong>Người nhỏ nhắn:</strong> đầm ngắn hoặc midi, eo cao để chân trông dài hơn;
              tránh đầm quá dài, nhiều tầng bèo.
            </li>
            <li>
              <strong>Bắp tay to:</strong> chọn đầm có tay phồng, tay lỡ hoặc cổ vuông.
            </li>
            <li>
              <strong>Vòng 2 chưa gọn:</strong> đầm chiết eo cao, dáng chữ A hoặc vải rủ nhẹ che
              khéo phần bụng.
            </li>
            <li>
              <strong>Dáng cao:</strong> đầm dài, xẻ tà, cổ yếm đều rất hợp.
            </li>
          </ul>

          <h2>Giá thuê đầm dự tiệc bao nhiêu?</h2>
          {d ? (
            <p>
              Tiệm hiện có <strong>{d.soMau} mẫu đầm, váy dự tiệc</strong>, phí thuê 3 ngày{' '}
              {khoangGia(d)}, phổ biến khoảng <strong>{gia(d.thue3PhoBien)}</strong>.
              {d.thue1Thap != null && <> Thuê 1 ngày chỉ từ {gia(d.thue1Thap)}.</>}
            </p>
          ) : (
            <p>Giá từng mẫu ghi rõ trên trang sản phẩm.</p>
          )}
          <CachCoc cocThap={d?.cocThap} kieu="dam" />
          {g && (
            <p>
              Muốn nổi bật hơn nữa thì có dòng <strong>đầm gấm</strong> ({g.soMau} mẫu), phí thuê{' '}
              {khoangGia(g)}.
            </p>
          )}

          <h2>Thuê 1 ngày hay 3 ngày?</h2>
          <GoiThoiGian />

          <h2>Size và độ vừa</h2>
          <p>
            {d && d.sizes.length > 0 && <>Đầm tại tiệm có các size {lietKe(d.sizes)}. </>}
            Mỗi mẫu ghi rõ size đang có trên trang chi tiết. Đầm ôm thì xem kỹ vòng ngực, eo,
            mông; đầm suông thì chủ yếu xem vai và chiều dài. Chưa chắc thì nhắn số đo cho tiệm
            tư vấn trước khi giữ mẫu.
          </p>

          <h2>Cách giữ mẫu</h2>
          <CachGiuMau />
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
            Không ở gần {siteConfig.address.district} vẫn có thể thuê đồ tại {siteConfig.name}:
            tiệm <strong>cho thuê online và giao hàng toàn quốc</strong>. Điều khiến nhiều người
            ngại là sợ mặc không vừa. Bài này hướng dẫn cách chọn size và các bước giữ mẫu để
            nhận được bộ đồ vừa ý mà không cần ghé tiệm.
          </p>

          <h2>Bước 1: Đo đúng 4 số đo</h2>
          <ul>
            <li>
              <strong>Vòng ngực:</strong> đo vòng qua điểm cao nhất của ngực, thước song song mặt
              đất.
            </li>
            <li>
              <strong>Vòng eo:</strong> chỗ nhỏ nhất của eo, thường trên rốn khoảng 2–3 cm.
            </li>
            <li>
              <strong>Vòng mông:</strong> chỗ nở nhất của mông.
            </li>
            <li>
              <strong>Chiều cao:</strong> để tiệm tư vấn độ dài đầm, tà áo dài.
            </li>
          </ul>
          <p>Đo sát người, mặc đồ mỏng, không kéo thước quá chặt.</p>

          <h2>Bước 2: Chọn size</h2>
          <p>
            {sizes.length > 0 && <>Đồ tại tiệm có các size {lietKe(sizes)}. </>}
            Mỗi mẫu ghi rõ size đang có ngay trên trang chi tiết. Một vài lưu ý:
          </p>
          <ul>
            <li>
              <strong>Freesize</strong> thường là dáng suông hoặc có dây rút, hợp nhiều dáng người
              nhưng vẫn nên hỏi lại số đo tối đa.
            </li>
            <li>Áo dài và đầm ôm: ưu tiên vừa vòng ngực và eo.</li>
            <li>
              Giữa hai size thì gửi số đo cho tiệm. Tiệm biết rõ form từng mẫu nên tư vấn sát hơn
              bảng size chung.
            </li>
          </ul>

          <h2>Bước 3: Giữ mẫu</h2>
          <CachGiuMau />

          <h2>Bước 4: Chọn thời gian thuê</h2>
          <GoiThoiGian />
          <p>
            Khi thuê online, hãy tính thêm thời gian giao nhận và báo tiệm ngày bạn cần mặc để
            được sắp xếp gửi đồ kịp.
          </p>

          <h2>Chi phí</h2>
          <ul>
            {d && (
              <li>
                Đầm, váy dự tiệc: {khoangGia(d)} / 3 ngày ({d.soMau} mẫu).
              </li>
            )}
            {a && (
              <li>
                Áo dài: {khoangGia(a)} / 3 ngày ({a.soMau} mẫu).
              </li>
            )}
          </ul>
          <CachCoc cocThap={cocThap} kieu="chung" />
          <p>
            Phí giao hàng tuỳ địa chỉ, tiệm báo cụ thể khi bạn nhắn giữ mẫu. Có thắc mắc khác, xem
            thêm trang <L href="/cau-hoi-thuong-gap">Hỏi đáp</L>.
          </p>
        </>
      );
    },
  },
];

export function getBaiViet(slug: string): BaiViet | undefined {
  return BAI_VIET.find((b) => b.slug === slug);
}
