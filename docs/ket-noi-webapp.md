# Nối website với WebApp nội bộ Sherent

Website lấy danh sách sản phẩm **trực tiếp từ hệ thống quản lý của tiệm**
(repo `Sherent-app`, chạy ở `sherent-app.vercel.app`). Nhân viên sửa giá hay
thêm đồ trong app là website tự cập nhật, không phải đụng Google Sheets nữa.

> `.env.example` bị `.gitignore` chặn (`.env*`), nên tài liệu biến môi trường
> nằm ở file này.

---

## 1. Biến môi trường

Khai trên Vercel → project **sherent-web** → Settings → Environment Variables.

| Tên | Giá trị | Bắt buộc |
|---|---|---|
| `INTERNAL_API_URL` | `https://sherent-app.vercel.app/api/cong-khai` | ✅ |
| `REVALIDATE_SECRET` | chuỗi ngẫu nhiên, **giống hệt** biến `LANDING_REVALIDATE_SECRET` bên repo app | ✅ |
| `API_REVALIDATE_SECONDS` | mặc định `604800` (7 ngày) — chỉ là lưới an toàn, xem app/san-pham/[slug]/page.tsx | không |

Sinh khoá mới:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

⚠️ `INTERNAL_API_URL` **dừng ở `/api/cong-khai`**, đừng thêm `/san-pham`. Code
tự nối phần đó; thêm vào là thành `.../san-pham/san-pham` và hỏng.

---

## 2. Thứ tự ưu tiên nguồn dữ liệu

`lib/products.ts` chọn theo thứ tự: **WebApp nội bộ → Google Sheets → mock-data**.

⚠️ **Gọi API lỗi thì tự động quay về mock-data mà KHÔNG báo gì.** Website vẫn
chạy, vẫn đầy sản phẩm — chỉ là đồ giả. Nên sau mỗi lần đổi cấu hình phải kiểm
bằng một mã CÓ THẬT trong app mà mock không có, ví dụ `T215` (Sarose Dress):

```
https://sherent.vercel.app/san-pham/sarose-dress-t215
```

Ra trang là đã nối đúng. Trả 404 là đang chạy bằng dữ liệu cũ.

---

## 3. Làm mới ngay khi shop sửa sản phẩm

App nội bộ gọi `POST /api/lam-moi` kèm `Authorization: Bearer <REVALIDATE_SECRET>`
mỗi khi có sản phẩm thêm / sửa / xoá. Endpoint gọi `revalidateTag('san-pham')`,
cache bay và trang dựng lại bằng dữ liệu mới.

Không có bước này thì website chờ hết `API_REVALIDATE_SECONDS` mới cập nhật —
và tệ hơn, **người đầu tiên vào sau khi shop sửa giá vẫn thấy giá cũ**, vì chính
họ mới là người kích hoạt dựng lại trang.

Thử tay:

```bash
curl -X POST -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  https://sherent.vercel.app/api/lam-moi
```

Trả `{"ok":true,...}` là được. `401` là sai khoá, `503` là chưa khai biến.

### ⚠️ Cache CDN của API phải NGẮN

Cơ chế trên từng **không chạy** dù `revalidateTag` gọi đúng, vì API bên app cache
ở CDN 60 giây: website xoá cache xong gọi lại thì Vercel trả đúng bản cũ đang
giữ, và trang dựng lại bằng dữ liệu cũ. Đo thật lúc đó: tải trang 12 lần trong
10 giây vẫn ra giá cũ.

Đã hạ xuống 5 giây bên repo app (`lib/cong-khai/cors.ts`). **Ai tăng lại con số
đó là làm hỏng tính năng này** — mà hỏng im lặng, không có thông báo lỗi nào.

---

## 4. Trang thanh lý (pass mẫu) — cần bên app trả thêm 3 trường

Trang `/thanh-ly` liệt kê những mẫu tiệm đang **pass (bán đứt)**. Mẫu đang pass
**vẫn nằm trong danh sách cho thuê** — vừa cho thuê vừa rao bán, bán xong nhân
viên mới gỡ mẫu như bình thường. Website không có nơi nhập giá bán: giá do app
nội bộ trả về.

### Việc phải làm bên repo `Sherent-app`

Thêm 3 cột vào bảng sản phẩm và trả kèm trong `GET /api/cong-khai/san-pham`:

| Trường JSON | Kiểu | Ý nghĩa |
|---|---|---|
| `dang_pass` | boolean | Tick = đang rao bán mẫu này |
| `gia_pass` | number | Giá bán đứt (VND). `0`/`null` = chưa chốt giá → web hiện "Liên hệ" |
| `ghi_chu_pass` | string \| null | Tình trạng mẫu, vd `"còn mới 95%"`, `"có vết nhỏ ở gấu"` |

Ví dụ một dòng:

```json
{
  "ma": "T168",
  "ten": "Nathalia Dress",
  "gia_thue": 390000,
  "dang_pass": true,
  "gia_pass": 800000,
  "ghi_chu_pass": "Còn mới 95%, mặc 3 lần"
}
```

⚠️ **Đừng lọc mẫu đang pass ra khỏi API.** Website cần chúng ở CẢ hai chỗ; nó
tự lọc ra danh sách thanh lý bằng `dang_pass`.

### Cách website đọc (`lib/internal-api.ts` → `mapSale`)

- `dang_pass: false` → luôn ẩn khỏi trang thanh lý, **kể cả khi ô giá còn số**
  (nhân viên hay quên xoá giá cũ). Bỏ tick là mẫu biến mất khỏi trang ngay.
- Chưa kịp thêm cột `dang_pass` → web tạm hiểu "điền `gia_pass` > 0 là đang
  pass", nên có thể triển khai mỗi cột giá trước cũng chạy.
- API chưa có cả 3 trường → trang `/thanh-ly` hiện trạng thái trống kèm nút
  Zalo, **không lỗi**. Đây chính là những gì đang thấy tính tới hôm nay.

Bán xong: bỏ tick `dang_pass` (mẫu về lại chế độ chỉ cho thuê), hoặc gỡ hẳn sản
phẩm nếu không cho thuê nữa. App gọi `/api/lam-moi` như mọi thay đổi khác nên
website cập nhật trong vài giây.

---

## 5. Website KHÔNG hiện lịch trống

Chủ shop chốt 11/08/2026: không cho website biết món nào đang bận. API bên app
đã gỡ hẳn khả năng đó — hàm trong database còn không đọc bảng đơn hàng nữa.

Vì vậy đã xoá `components/AvailabilityCheck.tsx`, `app/api/kiem-tra-lich/` và
`lib/orders.ts`. Trang sản phẩm thay bằng lời mời nhắn Zalo.

Đừng dựng lại tính năng này bằng cách đoán từ dữ liệu hiện có — không còn đường
nào lấy được lịch, và đó là chủ ý.

---

## 6. Video sản phẩm (link Instagram / TikTok) — cần bên app trả thêm 1 trường

Trang chi tiết sản phẩm hiện được video: dải ảnh nhỏ có thêm ô ▶, bấm vào thì
khung Instagram/TikTok hiện thẳng vào chỗ ảnh lớn. Video chạy từ máy chủ của
Instagram/TikTok nên **không upload file video lên Supabase** (gói miễn phí chỉ
~5GB lượt tải/tháng, vài trăm lượt xem video là cạn).

### Việc phải làm bên repo `Sherent-app`

Thêm 1 cột vào bảng sản phẩm (ô nhập "Link video" trong form sửa sản phẩm) và
trả kèm trong `GET /api/cong-khai/san-pham`:

| Trường JSON | Kiểu | Ý nghĩa |
|---|---|---|
| `video` | string \| null | Link dán nguyên từ Instagram hoặc TikTok. `null`/trống = không có video |

Link nhận được:

- Instagram: `https://www.instagram.com/p/<mã>/`, `/reel/<mã>/`, `/tv/<mã>/`
  (có hay không có `?igsh=...` phía sau đều được).
- TikTok: `https://www.tiktok.com/@<tài khoản>/video/<số>` hoặc link ngắn
  `https://vt.tiktok.com/...`, `https://vm.tiktok.com/...`.

Sửa link xong app gọi `/api/lam-moi` như mọi thay đổi khác.

### Cách website đọc

- `lib/internal-api.ts` đọc `video`; mẫu gộp nhiều size lấy link của dòng đầu
  tiên có link (`lib/mapping.ts` → `groupProducts`).
- `lib/video.ts` đổi link thành link nhúng ở server. Link lạ / hỏng / TikTok
  không tra được ID → **ẩn ô ▶**, không hiện khung trống.
- API chưa có trường `video` → trang sản phẩm y như cũ, **không lỗi**.

Lưu ý cho nhân viên:

- **Tài khoản Instagram/TikTok phải để công khai**, không thì khung nhúng báo lỗi.
- Logo/watermark nằm sẵn trong file video (vd video tải từ TikTok người khác)
  sẽ hiện nguyên trên web — web không che được.
- Xoá bài trên IG/TikTok thì phải xoá link bên app, không thì khung video trên
  web báo "bài không còn".

## 7. Feedback của khách (04/10/2026)

Bên app: màn **Feedback** (menu Tổng quan) + `GET /api/cong-khai/feedback`, hợp đồng ở
`docs/api-cong-khai.md` §2.5 của repo `Sherent-app`. Migration `20261004090000_feedback.sql`
phải chạy TRƯỚC khi app deploy route này.

Bên web:

- `fetchFeedbackFromInternalApi` (`lib/internal-api.ts`) — 404 coi như chưa có feedback, nên web
  deploy trước hay sau app đều được.
- `getFeedback` (`lib/products.ts`) — đổi mã SP của API (CHƯA gộp size) sang mẫu ĐÃ gộp size
  của web: theo mã trước, không thấy thì theo tên đã bỏ size. Lỗi thì trả `[]`.
- Ba nơi hiện: dải "Khách hàng của Sherent" ở trang chủ (`FeedbackSection`, 8 ô: feedback được
  ghim theo thứ tự app, chưa ghim cái nào thì lấy mới nhất), trang `/feedback` (nàng thơ của
  tháng + lưới so le + lọc theo dịp + lời mời gửi ảnh), và mục "Khách đã mặc mẫu này" ở trang
  chi tiết sản phẩm. Rỗng thì trang chủ và trang sản phẩm ẩn hẳn khối.
- Cùng nhãn cache `san-pham`: app sửa feedback là gọi `/api/lam-moi`, web dựng lại ngay.
