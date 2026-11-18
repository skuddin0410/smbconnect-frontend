"use client";

import { useActionState } from "react";
import { submitEnquiry, type FormState } from "@/lib/actions";

type Field = { name: string; label: string; type?: string; required?: boolean; hint?: string; textarea?: boolean; autoComplete?: string; defaultValue?: string };

export default function EnquiryForm({
  kind,
  fields,
  submitLabel,
  hidden = {},
}: {
  kind: "new" | "claim" | "contact";
  fields: Field[];
  submitLabel: string;
  hidden?: Record<string, string>;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitEnquiry, { ok: false, message: "" });

  if (state.ok) {
    return (
      <div role="status" className="rounded-xl border-2 border-navy bg-mist p-8">
        <p className="display-soft text-[1.5rem] text-navy">Sent</p>
        <p className="mt-2 text-lg">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="kind" value={kind} />
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <div aria-hidden="true" className="hidden">
        <label>Fax<input name="company_fax" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {state.message && !state.ok && (
        <p role="alert" className="rounded-md bg-[#fdecea] px-4 py-3 font-medium text-[#8a1c12]">{state.message}</p>
      )}
      {fields.map((f) => {
        const err = state.errors?.[f.name];
        const id = `f-${f.name}`;
        const cls = `mt-1.5 w-full rounded-md border bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-sky ${
          err ? "border-[#c0392b]" : "border-line focus:border-blue"
        }`;
        return (
          <div key={f.name}>
            <label htmlFor={id} className="font-semibold text-ink">
              {f.label}
              {!f.required && <span className="font-normal text-muted"> (optional)</span>}
            </label>
            {f.hint && <p id={`${id}-hint`} className="text-[0.92rem] text-muted">{f.hint}</p>}
            {f.textarea ? (
              <textarea id={id} name={f.name} rows={5} defaultValue={f.defaultValue} aria-invalid={!!err} aria-describedby={err ? `${id}-err` : f.hint ? `${id}-hint` : undefined} className={cls} />
            ) : (
              <input id={id} name={f.name} type={f.type ?? "text"} autoComplete={f.autoComplete} defaultValue={f.defaultValue} aria-invalid={!!err} aria-describedby={err ? `${id}-err` : f.hint ? `${id}-hint` : undefined} className={cls} />
            )}
            {err && <p id={`${id}-err`} className="mt-1 text-[0.92rem] font-medium text-[#8a1c12]">{err}</p>}
          </div>
        );
      })}
      <button disabled={pending} className="rounded-md bg-navy px-6 py-3.5 text-lg font-bold text-white hover:bg-navy-2 disabled:opacity-60">
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
