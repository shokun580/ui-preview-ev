import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <div className="shell grid min-h-[60vh] place-items-center py-20 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-soft text-brand">
          <Icon name="mapPin" size={34} />
        </span>
        <h1 className="t-h1 mt-6">ไม่พบหน้าที่ต้องการ</h1>
        <p className="t-body mt-3 text-fg-muted">
          หน้านี้อาจถูกย้ายหรือลิงก์ไม่ถูกต้อง ลองกลับไปเริ่มที่หน้าแรก
          หรือค้นหาสถานีชาร์จที่ต้องการได้เลย
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" icon="arrowLeft">กลับหน้าแรก</ButtonLink>
          <ButtonLink href="/stations" variant="secondary" icon="mapPin">
            ค้นหาสถานีชาร์จ
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
