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
| `API_REVALIDATE_SECONDS` | mặc định `300` | không |

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

## 4. Website KHÔNG hiện lịch trống

Chủ shop chốt 11/08/2026: không cho website biết món nào đang bận. API bên app
đã gỡ hẳn khả năng đó — hàm trong database còn không đọc bảng đơn hàng nữa.

Vì vậy đã xoá `components/AvailabilityCheck.tsx`, `app/api/kiem-tra-lich/` và
`lib/orders.ts`. Trang sản phẩm thay bằng lời mời nhắn Zalo.

Đừng dựng lại tính năng này bằng cách đoán từ dữ liệu hiện có — không còn đường
nào lấy được lịch, và đó là chủ ý.
