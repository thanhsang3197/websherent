# Đồng bộ ảnh chụp từ AppSheet sang website

Mục tiêu: chụp ảnh sản phẩm ngay trong AppSheet trên điện thoại → ảnh **vừa xem được
trong AppSheet, vừa tự hiện lên website** — không phải upload GitHub thủ công.

## Cơ chế (tóm tắt)

1. Trong AppSheet, bạn chụp ảnh vào một cột kiểu **Image**. AppSheet lưu file ảnh vào
   **Google Drive** và ghi **tên file** vào ô Sheet (không phải link công khai).
2. Một **Google Apps Script** (chạy tự động mỗi ~15 phút) đọc cột đó, đặt ảnh ở chế độ
   **công khai**, tạo **link ảnh Google**, rồi ghi link vào cột **`Ảnh sản phẩm`** — đúng
   cột mà website đang đọc.
3. Website tự cập nhật sau ~5 phút như bình thường. Xong.

> Website đã được cấu hình cho phép đọc ảnh từ Google Drive (`next.config.js`) — chỉ cần
> deploy lại là phần web sẵn sàng.

---

## Bước 1 — Thêm cột "Ảnh chụp" vào Sheet

Mở Google Sheet, tab **Sản Phẩm**, thêm **1 cột mới ở cuối** (sau cột `Ảnh phụ`), đặt tên
header đúng chính tả: **`Ảnh chụp`**.

## Bước 2 — Cấu hình AppSheet

1. Trong AppSheet, mở lại (regenerate) cấu trúc bảng để nhận cột `Ảnh chụp` mới.
2. Đặt **kiểu (type)** của cột `Ảnh chụp` là **Image**. (Đây là cột bạn sẽ bấm chụp.)
3. **Quan trọng:** với cột `Ảnh sản phẩm`, đặt **Editable = OFF** (hoặc ẩn đi) trong
   AppSheet — để AppSheet KHÔNG ghi đè lên link mà script tạo ra. Chỉ script quản lý cột này.

## Bước 3 — Cài Google Apps Script

1. Ngay trong Google Sheet: menu **Tiện ích mở rộng → Apps Script** (Extensions → Apps Script).
2. Xoá code mẫu, dán toàn bộ đoạn dưới đây vào:

```javascript
/**
 * Sherent — Đồng bộ ảnh chụp từ AppSheet sang website.
 * Đọc cột "Ảnh chụp" (AppSheet Image) -> tạo link Google công khai -> ghi vào "Ảnh sản phẩm".
 */
const CONFIG = {
  SHEET_NAME: 'Sản Phẩm',       // tên tab chứa sản phẩm
  COL_MASP: 'Mã SP',            // cột khoá
  COL_SOURCE: 'Ảnh chụp',       // cột AppSheet Image (chứa tên file)
  COL_TARGET: 'Ảnh sản phẩm',   // cột website đọc (script ghi link vào đây)
  THUMB_SIZE: 'w1600',          // độ rộng ảnh lấy về (px)
};

function syncAppSheetImages() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) { Logger.log('Không thấy tab: ' + CONFIG.SHEET_NAME); return; }

  const values = sheet.getDataRange().getValues();
  const header = values[0];
  const iKey = header.indexOf(CONFIG.COL_MASP);
  const iSrc = header.indexOf(CONFIG.COL_SOURCE);
  const iDst = header.indexOf(CONFIG.COL_TARGET);
  if (iKey < 0 || iSrc < 0 || iDst < 0) {
    Logger.log('Thiếu cột. Cần: ' + CONFIG.COL_MASP + ', ' + CONFIG.COL_SOURCE + ', ' + CONFIG.COL_TARGET);
    return;
  }

  const props = PropertiesService.getScriptProperties();
  const processed = JSON.parse(props.getProperty('processed_v1') || '{}');

  let updated = 0, skipped = 0, failed = 0;

  for (let r = 1; r < values.length; r++) {
    const key = String(values[r][iKey]).trim();
    if (!key) continue;
    const src = String(values[r][iSrc] || '').trim();
    if (!src) continue;                       // chưa chụp ảnh
    if (/^https?:\/\//i.test(src)) continue;  // đã là link, bỏ qua
    if (processed[key] === src) { skipped++; continue; } // không đổi từ lần trước

    const fileId = resolveDriveFileId_(src);
    if (!fileId) { failed++; Logger.log('Không tìm thấy file cho ' + key + ': ' + src); continue; }

    try {
      DriveApp.getFileById(fileId)
        .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {
      failed++; Logger.log('Không chia sẻ được ' + key + ': ' + e);
      continue;
    }

    const url = 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=' + CONFIG.THUMB_SIZE;
    sheet.getRange(r + 1, iDst + 1).setValue(url);
    processed[key] = src;
    updated++;
  }

  props.setProperty('processed_v1', JSON.stringify(processed));
  Logger.log('Xong. Cập nhật: ' + updated + ' | Bỏ qua: ' + skipped + ' | Lỗi: ' + failed);
}

function resolveDriveFileId_(appSheetValue) {
  const name = appSheetValue.split('/').pop();
  const it = DriveApp.getFilesByName(name);
  return it.hasNext() ? it.next().getId() : null;
}
```

3. Bấm **Lưu** (biểu tượng đĩa mềm).

## Bước 4 — Chạy thử & cấp quyền

1. Trên thanh công cụ Apps Script, chọn hàm **`syncAppSheetImages`** rồi bấm **Run**.
2. Lần đầu Google sẽ hỏi cấp quyền → chọn tài khoản `thanhsang3197@gmail.com` → **Advanced
   → Go to (project) → Allow**. (Đây là script của chính bạn, cấp quyền để nó đọc Sheet +
   chia sẻ ảnh Drive.)
3. Xem **Execution log** (Ctrl+Enter) — thấy dòng "Xong. Cập nhật: ..." là chạy được.

## Bước 5 — Đặt lịch chạy tự động

1. Trong Apps Script, bên trái chọn biểu tượng **đồng hồ (Triggers)**.
2. **+ Add Trigger** → chọn:
   - Function: `syncAppSheetImages`
   - Event source: **Time-driven**
   - Type: **Minutes timer** → **Every 15 minutes**
3. **Save**. Từ giờ script tự chạy mỗi 15 phút.

> Vì sao dùng lịch (time-driven) chứ không phải "onEdit": AppSheet ghi dữ liệu qua API,
> không kích hoạt trigger onEdit của Sheet — nên bắt buộc dùng lịch định kỳ.

---

## Cách dùng hằng ngày

1. Mở AppSheet trên điện thoại → mở/ tạo sản phẩm → bấm chụp ở ô **`Ảnh chụp`**.
2. Đợi tối đa **~15 phút** (script chạy) + **~5 phút** (website làm mới) → ảnh lên web.
   Muốn nhanh hơn có thể vào Apps Script bấm **Run** thủ công 1 lần.

## Nghiệm thu lần đầu (bạn tự kiểm)

- Sau khi script chạy, mở Sheet xem cột **`Ảnh sản phẩm`** đã có link `drive.google.com/thumbnail?...`.
- Dán link đó vào trình duyệt → phải hiện ra ảnh. Nếu hiện ảnh là chuỗi đã thông.
- Mở website (sau ~5 phút) → ảnh sản phẩm đó hiển thị.

## Lưu ý & giới hạn

- Script chỉ xử lý **ảnh chính** (`Ảnh chụp` → `Ảnh sản phẩm`). Ảnh phụ (gallery) vẫn dán
  link thủ công như hiện tại. Muốn tự động cả gallery thì báo mình mở rộng thêm.
- Ảnh chụp được đặt **công khai "ai có link đều xem"** để web hiển thị — đừng chụp thông
  tin riêng tư vào cột này.
- Google Drive phục vụ ảnh cho web công cộng không "bền" bằng CDN chuyên dụng, nhưng
  website đã **tối ưu + lưu đệm ảnh trên Vercel** nên khách xem vẫn nhanh/ổn. Nếu sau này
  lượng truy cập lớn, có thể nâng cấp sang đẩy ảnh lên GitHub (bền hơn) — báo mình.
