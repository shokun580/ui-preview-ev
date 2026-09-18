"use client";

const STORAGE_KEY = "rc-theme";
const DEFAULT_THEME = "dark";

/**
 * สคริปต์ที่ต้องรันก่อนเบราว์เซอร์วาดหน้าแรก เพื่อไม่ให้เกิดอาการ "จอขาวแวบ" ตอนโหลดหน้า
 *
 * ค่าเริ่มต้นของเว็บนี้คือโหมดมืด ไม่ได้ตามการตั้งค่าของเครื่อง
 * (เป็นการตัดสินใจเชิงแบรนด์ ไม่ใช่ค่ามาตรฐานของเว็บทั่วไป)
 * แต่ถ้าผู้ใช้เคยกดสลับเองไว้ ให้ยึดตามที่เขาเลือกเสมอ
 */
export const themeInitScript = `
(function(){
  try {
    var saved = localStorage.getItem("${STORAGE_KEY}");
    var theme = saved === "light" || saved === "dark" ? saved : "${DEFAULT_THEME}";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;

/** สีแถบบนของเบราว์เซอร์ ต้องเปลี่ยนตามธีมด้วย ไม่งั้นขอบจอจะคนละโทนกับหน้าเว็บ */
function syncBrowserThemeColor(theme: "light" | "dark") {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#060f18" : "#ffffff");
}

/**
 * สลับธีมโดยแตะที่ <html> ตรง ๆ ไม่เก็บเป็น state ของ React
 * ทำแบบนี้เพราะทุกอย่างที่ต้องเปลี่ยนสีอ่านค่าจากคลาส .dark ผ่าน CSS อยู่แล้ว
 * จึงไม่ต้อง re-render และไม่มีจังหวะที่ค่าฝั่งเซิร์ฟเวอร์กับฝั่งเบราว์เซอร์ไม่ตรงกัน
 */
export function toggleTheme() {
  const root = document.documentElement;
  const next = root.classList.contains("dark") ? "light" : "dark";
  root.classList.toggle("dark", next === "dark");
  root.style.colorScheme = next;
  syncBrowserThemeColor(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {}
}
