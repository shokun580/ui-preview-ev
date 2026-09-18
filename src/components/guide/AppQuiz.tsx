"use client";

import { useMemo, useState } from "react";
import { quizQuestions, scoreQuiz } from "@/data/apps";
import { AppLogo } from "@/components/ui/AppLogo";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

/**
 * แบบทดสอบ 5 ข้อ — ให้คะแนนแอปตามคำตอบ แล้วสรุปเป็น 3 อันดับแรก
 * ทำงานฝั่งหน้าเว็บทั้งหมด ไม่มีการส่งข้อมูลไปที่ไหน
 */
export function AppQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const total = quizQuestions.length;
  const q = quizQuestions[step];
  const results = useMemo(() => (done ? scoreQuiz(answers) : []), [done, answers]);
  const maxScore = results[0]?.score ?? 1;

  function choose(optionId: string) {
    const next = { ...answers, [q.id]: optionId };
    setAnswers(next);
    // หน่วงสั้น ๆ ให้เห็นว่าตัวเลือกถูกเลือกแล้วก่อนเลื่อนไปข้อถัดไป
    setTimeout(() => {
      if (step + 1 < total) setStep(step + 1);
      else setDone(true);
    }, 220);
  }

  function reset() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  return (
    <div className="overflow-hidden rounded-panel border border-border bg-surface">
      {/* แถบความคืบหน้า */}
      <div className="border-b border-border px-5 py-4 sm:px-7">
        <div className="flex items-center justify-between gap-3">
          <p className="t-overline text-fg-muted">
            {done ? "ผลลัพธ์" : `ข้อ ${step + 1} จาก ${total}`}
          </p>
          {(step > 0 || done) && (
            <button
              type="button"
              onClick={done ? reset : () => setStep(step - 1)}
              className="t-caption inline-flex items-center gap-1 font-bold text-fg-muted hover:text-brand"
            >
              <Icon name={done ? "refresh" : "chevronLeft"} size={14} />
              {done ? "ทำใหม่อีกครั้ง" : "ย้อนกลับ"}
            </button>
          )}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-sunken">
          <div
            className="h-full rounded-full brand-gradient-bg transition-[width] duration-400 ease-out"
            style={{ width: `${done ? 100 : (step / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {!done ? (
          <div key={q.id} style={{ animation: "rc-fade-up 320ms ease-out both" }}>
            <h3 className="t-h3">{q.question}</h3>
            {q.help && <p className="t-caption mt-1">{q.help}</p>}

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {q.options.map((o) => {
                const active = answers[q.id] === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => choose(o.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-card border p-4 text-left transition-all",
                      active
                        ? "border-brand bg-brand-soft"
                        : "border-border hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                        active ? "border-brand bg-brand text-white" : "border-border-strong",
                      )}
                    >
                      {active && <Icon name="check" size={12} strokeWidth={3} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.9375rem] font-bold text-fg">{o.label}</span>
                      {o.hint && <span className="t-caption mt-0.5 block">{o.hint}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ animation: "rc-fade-up 400ms ease-out both" }}>
            <h3 className="t-h3">แอปที่น่าจะเหมาะกับคุณที่สุด</h3>
            <p className="t-body-sm mt-1 text-fg-muted">
              เรียงจากที่ตรงกับคำตอบของคุณมากที่สุด แนะนำให้โหลด 2 ตัวแรกไว้ก่อน
              แล้วค่อยเพิ่มตัวที่สามเมื่อเริ่มขับทางไกล
            </p>

            <ol className="mt-6 space-y-3">
              {results.map((r, i) => (
                <li
                  key={r.app.id}
                  className="rounded-card border border-border p-4"
                  style={{ animation: `rc-fade-up 420ms ease-out ${i * 110}ms both` }}
                >
                  <div className="flex items-start gap-3">
                    <AppLogo id={r.app.id} name={r.app.name} size={44} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-[1rem] font-bold text-fg">{r.app.name}</h4>
                        {i === 0 && <Badge tone="brand">ตรงที่สุด</Badge>}
                        {r.app.isDirectory && <Badge tone="outline">แอปดูแผนที่</Badge>}
                      </div>
                      <p className="t-caption mt-0.5">{r.app.operator}</p>
                      <p className="t-body-sm mt-2 text-fg-muted">{r.app.bestFor}</p>

                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
                          <div
                            className="h-full rounded-full brand-gradient-bg"
                            style={{ width: `${Math.round((r.score / maxScore) * 100)}%` }}
                          />
                        </div>
                        <span className="t-caption w-16 shrink-0 text-right">
                          ตรง {Math.round((r.score / maxScore) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={reset} variant="secondary" icon="refresh">
                ทำแบบทดสอบใหม่
              </Button>
              <a
                href="#apps"
                className="t-button inline-flex h-11 items-center gap-2 rounded-full px-5 text-brand hover:underline"
              >
                ดูรายละเอียดแอปทั้ง 10 ตัว
                <Icon name="arrowRight" size={17} />
              </a>
            </div>

            <p className="t-caption mt-5 border-t border-border pt-4">
              คำแนะนำนี้ประมวลผลจากคำตอบของคุณด้วยเกณฑ์อย่างง่าย
              ควรใช้ประกอบการตัดสินใจเท่านั้น
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
