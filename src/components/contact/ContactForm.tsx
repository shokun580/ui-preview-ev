"use client";

import { useState, type FormEvent } from "react";
import { contactTopics } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "phone" | "topic", string>>;

/**
 * ฟอร์มติดต่อแบบสั้น (ชื่อ / เบอร์ / เรื่องที่ติดต่อ) — ยิ่งสั้นยิ่งมีคนกรอกจบ
 * ต้นแบบนี้ยังไม่มีระบบหลังบ้าน จึงตรวจความถูกต้องแล้วแสดงผลลัพธ์ในหน้าเลย
 * ไม่มีการส่งข้อมูลออกไปที่ไหน
 */
export function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    topic: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  function validate(): Errors {
    const e: Errors = {};
    if (!values.name.trim()) e.name = "กรุณากรอกชื่อ";
    const digits = values.phone.replace(/\D/g, "");
    if (!digits) e.phone = "กรุณากรอกเบอร์โทร";
    else if (digits.length < 9) e.phone = "เบอร์โทรไม่ครบ ตรวจสอบอีกครั้ง";
    if (!values.topic) e.topic = "เลือกเรื่องที่ต้องการติดต่อ";
    return e;
  }

  function submit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setState("sending");
    // จำลองเวลาที่ระบบจริงจะใช้ส่งข้อมูล เพื่อให้เห็นสถานะปุ่มครบทุกแบบ
    setTimeout(() => setState("sent"), 900);
  }

  if (state === "sent") {
    return (
      <div
        className="rounded-panel border border-border bg-surface p-8 text-center"
        style={{ animation: "rc-fade-up 400ms ease-out both" }}
      >
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ok-soft text-ok">
          <Icon name="check" size={30} strokeWidth={2.5} />
        </span>
        <h2 className="t-h2 mt-5">ได้รับเรื่องแล้ว</h2>
        <p className="t-body mx-auto mt-3 max-w-md text-fg-muted">
          ขอบคุณคุณ {values.name.trim()} ทีมงานจะติดต่อกลับที่ {values.phone}{" "}
          ภายใน 1 วันทำการ
        </p>
        <p className="t-caption mx-auto mt-4 max-w-md rounded-xl bg-bg-subtle px-4 py-3">
          หน้านี้เป็นต้นแบบสำหรับทบทวนงานออกแบบ ข้อมูลที่กรอกไม่ได้ถูกส่งไปที่ใด
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          icon="refresh"
          onClick={() => {
            setValues({ name: "", phone: "", topic: "", message: "" });
            setState("idle");
          }}
        >
          กรอกใหม่อีกครั้ง
        </Button>
      </div>
    );
  }

  const field =
    "h-12 w-full rounded-xl border bg-surface px-4 text-[0.9375rem] text-fg placeholder:text-fg-faint focus:outline-none transition-colors";

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-panel border border-border bg-surface p-6 sm:p-8"
    >
      <h2 className="t-h3">ฝากข้อมูลไว้ เดี๋ยวเราติดต่อกลับ</h2>
      <p className="t-body-sm mt-1.5 text-fg-muted">
        กรอกแค่ 3 ช่อง ใช้เวลาไม่ถึงนาที
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[0.875rem] text-fg">
            ชื่อ <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="ชื่อที่ให้เราเรียก"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(field, errors.name ? "border-danger" : "border-border focus:border-brand")}
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-[0.8125rem] text-danger">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-[0.875rem] text-fg">
            เบอร์โทร <span className="text-danger">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => setValues({ ...values, phone: e.target.value })}
            placeholder="08X-XXX-XXXX"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={cn(field, errors.phone ? "border-danger" : "border-border focus:border-brand")}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1.5 text-[0.8125rem] text-danger">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <span className="mb-2 block text-[0.875rem] text-fg">
            เรื่องที่ต้องการติดต่อ <span className="text-danger">*</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {contactTopics.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setValues({ ...values, topic: t.id })}
                aria-pressed={values.topic === t.id}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-[0.8125rem] transition-colors",
                  values.topic === t.id
                    ? "border-brand bg-brand-soft text-brand-soft-fg"
                    : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {errors.topic && (
            <p className="mt-2 text-[0.8125rem] text-danger">{errors.topic}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-[0.875rem] text-fg">
            รายละเอียดเพิ่มเติม <span className="font-normal text-fg-faint">(ไม่บังคับ)</span>
          </label>
          <textarea
            id="message"
            rows={4}
            value={values.message}
            onChange={(e) => setValues({ ...values, message: e.target.value })}
            placeholder="เช่น รุ่นรถที่ใช้ ขนาดมิเตอร์ที่บ้าน หรือจำนวนหัวชาร์จที่ต้องการ"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-[0.9375rem] leading-relaxed text-fg placeholder:text-fg-faint transition-colors focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        disabled={state === "sending"}
        icon={state === "sending" ? "refresh" : undefined}
        iconRight={state === "sending" ? undefined : "arrowRight"}
      >
        {state === "sending" ? "กำลังส่ง…" : "ส่งข้อมูล"}
      </Button>

      <p className="t-caption mt-4 text-center">
        เราใช้ข้อมูลนี้เพื่อติดต่อกลับเรื่องที่คุณสอบถามเท่านั้น
      </p>
    </form>
  );
}
