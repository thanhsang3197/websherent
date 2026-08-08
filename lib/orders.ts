import fs from 'fs';
import path from 'path';

export interface OrderRecord {
  orderId: string;
  productId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status: string;
}

let cachedOrders: OrderRecord[] | null = null;

function parseDateVn(dateStr: string): string | null {
  if (!dateStr) return null;
  const parts = dateStr.trim().split('/');
  if (parts.length !== 3) return null;
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

export function getOrders(): OrderRecord[] {
  if (cachedOrders) return cachedOrders;

  try {
    const filePath = path.join(process.cwd(), 'data', 'App QL TĐ - Đơn Hàng.csv');
    if (!fs.existsSync(filePath)) return [];

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split(/\r?\n/);
    const records: OrderRecord[] = [];

    // Header is row 0
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle simple CSV splitting
      const cols = line.split(',');
      if (cols.length < 9) continue;

      const orderId = cols[0]?.trim();
      const productId = cols[3]?.trim();
      const startDateRaw = cols[6]?.trim();
      const endDateRaw = cols[8]?.trim();
      const status = cols[11]?.trim() || '';

      if (!productId || status.toLowerCase().includes('huỷ')) continue;

      const startDate = parseDateVn(startDateRaw);
      const endDate = parseDateVn(endDateRaw);

      if (startDate && endDate) {
        records.push({
          orderId,
          productId: productId.toUpperCase(),
          startDate,
          endDate,
          status,
        });
      }
    }

    cachedOrders = records;
    return records;
  } catch (err) {
    console.error('Error reading order CSV:', err);
    return [];
  }
}

/**
 * Kiểm tra xem sản phẩm (productId) có bị trùng lịch trong khoảng [fromDate, toDate] hay không.
 * fromDate, toDate có dạng YYYY-MM-DD.
 */
export function isProductAvailable(productId: string, fromDate: string, toDate: string): { available: boolean; conflictOrder?: OrderRecord } {
  const orders = getOrders();
  const targetId = productId.toUpperCase();

  const reqStart = new Date(fromDate).getTime();
  const reqEnd = new Date(toDate).getTime();

  if (isNaN(reqStart) || isNaN(reqEnd) || reqStart > reqEnd) {
    return { available: true };
  }

  for (const order of orders) {
    if (order.productId !== targetId) continue;

    const ordStart = new Date(order.startDate).getTime();
    const ordEnd = new Date(order.endDate).getTime();

    // Hai khoảng thời gian trùng nhau khi: reqStart <= ordEnd AND reqEnd >= ordStart
    if (reqStart <= ordEnd && reqEnd >= ordStart) {
      return { available: false, conflictOrder: order };
    }
  }

  return { available: true };
}
