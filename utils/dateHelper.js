// คืนจำนวนวันที่เหลือจาก startDate ถึงวันกำหนดคืน endDate
export function getDaysRemaining(endDate, startDate) {
  const start = new Date(startDate);
  const due = new Date(endDate);
  // ใช้วันที่แบบ local
  const startLocal = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const dueLocal = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffTime = dueLocal - startLocal;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// คืนจำนวนวันระหว่าง startDate ถึง endDate (รวมวันสุดท้าย)
export function getDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0,0,0,0);
  end.setHours(0,0,0,0);
  const diffTime = end - start;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// แปลงวันที่เป็นรูปแบบ dd/MM/yyyy
export function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}