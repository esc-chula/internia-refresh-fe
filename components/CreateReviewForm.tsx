"use client";

import { useMemo, useRef, useState } from "react";
import { CustomSelect } from "./CustomSelect";
import { CompanyLogo } from "./CompanyLogo";
import { FaceIcon, scoreToFace } from "./FaceIcon";
import { companies as knownCompanies } from "@/lib/mock-data";

const companyTypes = [
  "Banking, Finance & Investment",
  "Computer Systems, IT & Communications Technology",
  "Manufacturing, Logistics & Industrial",
  "Research, Academia & Government Agencies",
  "Mining & Geology",
  "Energy & Sustainability",
  "Construction",
  "Consulting & Strategy",
  "Entrepreneurship & Startups",
  "Automotive & Mobility",
  "Chemical & Process Industry",
  "Other",
];

const companyTypeOptions = companyTypes.map((option) => ({ value: option, label: option }));
const workModeOptions = ["Work from home", "Hybrid", "Onsite"].map((option) => ({ value: option, label: option }));
const salaryUnitOptions = ["บาท/เดือน", "บาท/วัน"].map((option) => ({ value: option, label: option }));

const scoreFields = [
  ["work", "ด้านเนื้องาน", "งานไม่ค่อยมีบทบาท ไม่ชัดเจน", "งานท้าทาย ได้เรียนรู้มาก"],
  ["social", "ด้านสังคม", "ไม่ค่อยเอื้อต่อการทำงาน", "สบายใจ ทำงานร่วมกับทีมได้ดี"],
  ["mentor", "ด้านพี่เลี้ยง", "ไม่ค่อยสนับสนุน", "สนับสนุนดีเยี่ยม"],
  ["experience", "ด้านประสบการณ์", "ประสบการณ์ที่ไม่ค่อยดี", "ประสบการณ์ที่ดีมาก"],
  ["overall", "คะแนนโดยรวม", "ไม่เป็นไปตามที่คาดหวัง", "ดีกว่าที่คาดหวัง"],
] as const;

const outlineColors = ["rgba(234, 67, 53, 0.7)", "rgba(242, 153, 74, 0.78)", "rgba(242, 201, 76, 0.85)", "rgba(124, 179, 66, 0.8)", "rgba(39, 174, 96, 0.8)"];

const steps = [
  { title: "ข้อมูลบริษัทและการฝึกงาน" },
  { title: "เขียนรีวิว" },
  { title: "ให้คะแนนและส่งรีวิว" },
] as const;

export function CreateReviewForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const formTopRef = useRef<HTMLDivElement>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [company, setCompany] = useState("");
  const [companyFocused, setCompanyFocused] = useState(false);
  const [companyType, setCompanyType] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [workMode, setWorkMode] = useState("");
  const [salaryMode, setSalaryMode] = useState<"yes" | "no" | null>(null);
  const [salaryUnit, setSalaryUnit] = useState("");
  const [yearLimit, setYearLimit] = useState<"yes" | "no" | null>(null);
  const [yearValues, setYearValues] = useState<string[]>([]);
  const [gpaMode, setGpaMode] = useState<"yes" | "no" | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  const [scores, setScores] = useState<Record<string, number | null>>({});

  const normalizedCompany = company.trim().toLowerCase();
  const matchedCompanyItem = knownCompanies.find((item) => item.name.toLowerCase() === normalizedCompany);
  const matchedCompany = Boolean(matchedCompanyItem);
  const showCompanyType = normalizedCompany.length > 0 && !matchedCompany;
  const filteredCompanies = useMemo(
    () => knownCompanies.filter((item) => item.name.toLowerCase().includes(normalizedCompany)).slice(0, 5),
    [normalizedCompany],
  );
  const showCompanyList = companyFocused && filteredCompanies.length > 0;

  function goToStep(next: 1 | 2 | 3) {
    setStep(next);
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <form className="grid justify-items-center gap-5">
      <div ref={formTopRef} className="grid w-full max-w-[760px] gap-[26px] max-sm:gap-[22px]">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between gap-2 text-sm font-semibold text-zinc-700">
              <span>ขั้นตอน {step} จาก {steps.length}</span>
              <span className="text-zinc-400">{steps[step - 1].title}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {steps.map((item, index) => (
                <div key={item.title} className={`h-1.5 rounded-full transition-colors duration-300 ${index < step ? "bg-internia-primary" : "bg-zinc-200"}`} />
              ))}
            </div>
          </div>

          <div className={step === 1 ? "animate-fade-in-up grid w-full gap-[26px] max-sm:gap-[22px]" : "hidden"}>
          <FormSection title="ข้อมูลบริษัท" icon={<BuildingIcon />}>
            <Field label="บริษัท" required>
              <div className="relative">
                {matchedCompanyItem ? (
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                    <CompanyLogo id={matchedCompanyItem.id} size={20} />
                  </div>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                )}
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  onFocus={() => setCompanyFocused(true)}
                  onBlur={() => window.setTimeout(() => setCompanyFocused(false), 120)}
                  placeholder="ค้นหาหรือพิมพ์ชื่อบริษัท"
                  className={`${inputClassName} pl-11`}
                />
                {showCompanyList && (
                  <div className="animate-dropdown-in absolute left-0 right-0 top-[calc(100%+8px)] z-10 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lift">
                    {filteredCompanies.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setCompany(item.name);
                          setCompanyFocused(false);
                        }}
                        className="flex w-full items-center gap-3 border-b border-zinc-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-zinc-100"
                      >
                        <CompanyLogo id={item.id} size={36} />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-zinc-900">{item.name}</div>
                          <div className="truncate text-sm text-zinc-500">{item.tag}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Field>

            {showCompanyType && (
              <>
                <Field label="ประเภทบริษัท" required>
                  <CustomSelect
                    value={companyType}
                    onChange={setCompanyType}
                    placeholder="เลือกประเภทบริษัท"
                    options={companyTypeOptions}
                  />
                </Field>

                <Field label="โลโก้บริษัท">
                  <label className="flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-full border border-dashed border-zinc-300 bg-white px-4 text-sm text-zinc-500 transition hover:border-zinc-400">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-zinc-400">
                      <path d="M12 16V4m0 0 4 4m-4-4-4 4" />
                      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                    </svg>
                    <span className="truncate">{logoFile ? logoFile.name : "อัปโหลดโลโก้บริษัท"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
                    />
                  </label>
                </Field>
              </>
            )}
          </FormSection>

          <FormSection title="ข้อมูลการฝึกงาน" icon={<BriefcaseIcon />}>
            <Field label="ตำแหน่งที่ฝึกงาน" required>
              <input className={inputClassName} placeholder="ตำแหน่งที่ฝึกงาน" />
            </Field>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Field label="วันที่เริ่มฝึกงาน" required>
                <input type="date" className={inputClassName} />
              </Field>
              <Field label="วันที่สิ้นสุด" required>
                <input type="date" className={inputClassName} />
              </Field>
            </div>

            <Field label="รูปแบบการทำงาน" required>
              <CustomSelect
                value={workMode}
                onChange={setWorkMode}
                placeholder="เลือกรูปแบบการทำงาน"
                options={workModeOptions}
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 p-4">
              <button
                type="button"
                onClick={() => setShowMoreDetails((value) => !value)}
                className="flex items-center justify-between gap-2 text-left text-sm font-semibold text-zinc-700"
              >
                <span>
                  รายละเอียดเพิ่มเติม <OptionalTag />
                </span>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`shrink-0 text-zinc-400 transition-transform ${showMoreDetails ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {showMoreDetails && (
                <div className="animate-fade-in-up grid grid-cols-1 gap-[18px]">
                  <div className="grid gap-2">
                    <div className="text-sm font-medium leading-[1.4] text-zinc-700">
                      ค่าตอบแทน <OptionalTag />
                    </div>
                    <div className="grid gap-[10px]">
                      <div className="grid gap-[10px] sm:grid-cols-2">
                        <ToggleBox selected={salaryMode === "no"} onClick={() => setSalaryMode(salaryMode === "no" ? null : "no")}>
                          ไม่มี
                        </ToggleBox>
                        <ToggleBox selected={salaryMode === "yes"} onClick={() => setSalaryMode(salaryMode === "yes" ? null : "yes")}>
                          มี
                        </ToggleBox>
                      </div>
                      {salaryMode === "yes" && (
                        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(120px,140px)]">
                          <input className={inputClassName} inputMode="numeric" placeholder="15000" />
                          <CustomSelect
                            value={salaryUnit}
                            onChange={setSalaryUnit}
                            placeholder="เลือกหน่วย"
                            options={salaryUnitOptions}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-medium leading-[1.4] text-zinc-700">
                      ชั้นปีที่เปิดรับ <OptionalTag />
                    </div>
                    <div className="grid gap-[10px]">
                      <div className="grid gap-[10px] sm:grid-cols-2">
                        <ToggleBox selected={yearLimit === "no"} onClick={() => setYearLimit(yearLimit === "no" ? null : "no")}>
                          ไม่จำกัด
                        </ToggleBox>
                        <ToggleBox selected={yearLimit === "yes"} onClick={() => setYearLimit(yearLimit === "yes" ? null : "yes")}>
                          จำกัด
                        </ToggleBox>
                      </div>
                      {yearLimit === "yes" && (
                        <div className="grid gap-[10px] sm:grid-cols-2">
                          {["1", "2", "3", "4"].map((value) => {
                            const checked = yearValues.includes(value);
                            return (
                              <label
                                key={value}
                                className={`flex cursor-pointer items-center gap-[10px] rounded-md border px-[14px] py-3 ${
                                  checked ? "border-zinc-900 bg-white" : "border-zinc-300 bg-white"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    setYearValues((current) =>
                                      checked ? current.filter((item) => item !== value) : [...current, value],
                                    )
                                  }
                                  className="h-[18px] w-[18px] accent-internia-primary"
                                />
                                <span className="text-sm text-zinc-700">ชั้นปีที่ {value}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-medium leading-[1.4] text-zinc-700">
                      เกรดเฉลี่ยขั้นต่ำ <OptionalTag />
                    </div>
                    <div className="grid gap-[10px]">
                      <div className="grid gap-[10px] sm:grid-cols-2">
                        <ToggleBox selected={gpaMode === "no"} onClick={() => setGpaMode(gpaMode === "no" ? null : "no")}>
                          ไม่มี
                        </ToggleBox>
                        <ToggleBox selected={gpaMode === "yes"} onClick={() => setGpaMode(gpaMode === "yes" ? null : "yes")}>
                          มี
                        </ToggleBox>
                      </div>
                      {gpaMode === "yes" && <input className={inputClassName} inputMode="decimal" placeholder="เช่น 2.75" />}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FormSection>
          </div>

          <div className={step === 2 ? "animate-fade-in-up grid w-full gap-[26px] max-sm:gap-[22px]" : "hidden"}>
          <FormSection title="รีวิว" icon={<MessageIcon />}>
            <TextArea label="ขั้นตอนการสมัคร" placeholder="สมัครผ่านช่องทางไหน มีกี่รอบ ใช้เวลานานไหม ต้องเตรียมอะไรเป็นพิเศษ" />
            <TextArea label="งานที่ได้รับ" placeholder="หน้าที่ที่รับผิดชอบ โปรเจคที่ได้ทำ ความรู้หรือเครื่องมือที่ใช้ เนื้องานตรงกับตำแหน่งที่สมัครไหม" />
            <TextArea label="บรรยากาศการทำงาน" placeholder="บรรยากาศภายในทีม วัฒนธรรมองค์กร พี่เลี้ยง" />
            <TextArea label="สวัสดิการและการเดินทาง" placeholder="สวัสดิการที่ได้รับ สิ่งอำนวยความสะดวก การเดินทางไปทำงาน" />
            <TextArea label="สิ่งที่อยากบอกต่อ" placeholder="ชอบอะไร ไม่ชอบอะไร ได้เรียนรู้อะไร และอยากแนะนำคนที่สนใจว่าอะไร" />
          </FormSection>
          </div>

          <div className={step === 3 ? "animate-fade-in-up grid w-full gap-[26px] max-sm:gap-[22px]" : "hidden"}>
          <section className="grid gap-[14px]">
            <div className="grid gap-[1.4rem]">
              <h2 className="m-0 flex items-center gap-2 text-[1.2rem] font-bold text-zinc-900">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-internia-primarySoft text-internia-primary">
                  <StarIcon />
                </span>
                แบบประเมิน
              </h2>
              {scoreFields.map(([key, title, low, high]) => (
                <div key={key} className="grid gap-2">
                  <div className="text-sm font-medium leading-[1.4] text-zinc-700">
                    {title} <span className="text-internia-primary">*</span>
                  </div>
                  <div className="grid gap-3">
                    <div className="grid items-center gap-3 max-sm:grid-cols-[minmax(72px,1fr)_auto_minmax(72px,1fr)] sm:grid-cols-[minmax(92px,1fr)_auto_minmax(92px,1fr)]">
                      <div className="text-right text-sm leading-[1.4] text-zinc-500 max-sm:text-sm max-sm:leading-[1.35]">{low}</div>
                      <div className="grid grid-cols-5 justify-center gap-[0.3rem] max-sm:gap-[0.24rem]">
                        {[1, 2, 3, 4, 5].map((score) => {
                          const selected = scores[key] === score;
                          return (
                            <button
                              key={score}
                              type="button"
                              onClick={() =>
                                setScores((current) => ({
                                  ...current,
                                  [key]: selected ? null : score,
                                }))
                              }
                              className={`grid place-items-center overflow-hidden rounded-[10px] bg-white transition hover:scale-[1.04] ${
                                selected ? "shadow-[0_0_0_2px_#000]" : ""
                              } max-sm:h-[30px] max-sm:w-[30px] h-[34px] w-[34px]`}
                              style={{
                                boxShadow: selected ? "0 0 0 2px #000" : `inset 0 0 0 2px ${outlineColors[score - 1]}`,
                              }}
                            >
                              {selected ? (
                                <FaceIcon score={scoreToFace(score)} className="h-full w-full rounded-[10px]" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-left text-sm leading-[1.4] text-zinc-500 max-sm:text-sm max-sm:leading-[1.35]">{high}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-2">
            <label
              className={`flex cursor-pointer items-center gap-[10px] rounded-md border px-[14px] py-3 ${
                anonymous ? "border-zinc-900 bg-white" : "border-zinc-300 bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={anonymous}
                onChange={() => setAnonymous((value) => !value)}
                className="h-[18px] w-[18px] accent-internia-primary"
              />
              <span className="text-sm text-zinc-700">ส่งรีวิวแบบไม่ระบุตัวตน</span>
            </label>
          </div>
          </div>

          {step === 1 && (
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="min-h-11 rounded-full bg-internia-primary text-sm font-semibold text-white shadow-crisp transition active:scale-[0.98] hover:bg-internia-primaryDark"
            >
              ถัดไป
            </button>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="min-h-11 rounded-full border border-zinc-300 bg-white text-sm font-semibold text-zinc-700 transition active:scale-[0.98] hover:border-zinc-400"
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="min-h-11 rounded-full bg-internia-primary text-sm font-semibold text-white shadow-crisp transition active:scale-[0.98] hover:bg-internia-primaryDark"
              >
                ถัดไป
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="min-h-11 rounded-full border border-zinc-300 bg-white text-sm font-semibold text-zinc-700 transition active:scale-[0.98] hover:border-zinc-400"
              >
                ย้อนกลับ
              </button>
              <button type="button" className="min-h-11 rounded-full bg-internia-primary text-sm font-semibold text-white shadow-crisp transition active:scale-[0.98] hover:bg-internia-primaryDark">
                ยืนยันส่งรีวิว
              </button>
            </div>
          )}
      </div>
    </form>
  );
}

function FormSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-[14px]">
      <h2 className="m-0 flex items-center gap-2 text-[1.2rem] font-bold text-zinc-900">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-internia-primarySoft text-internia-primary">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22v-4h6v4M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  );
}

function OptionalTag() {
  return <span className="font-normal text-zinc-400">(ไม่บังคับ)</span>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="grid grid-cols-1 gap-2">
      <span className="text-sm font-medium leading-[1.4] text-zinc-700">
        {label} {required ? <span className="text-internia-primary">*</span> : <OptionalTag />}
      </span>
      {children}
    </label>
  );
}

function TextArea({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="grid gap-2">
      <p className="m-0 text-sm font-medium leading-[1.4] text-zinc-700">
        {label} <OptionalTag />
      </p>
      <textarea
        placeholder={placeholder}
        className="min-h-[188px] w-full resize-y rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-internia-primary/10"
      />
    </div>
  );
}

function ToggleBox({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-[10px] rounded-md border px-[14px] py-3 text-left ${
        selected ? "border-zinc-900 bg-white" : "border-zinc-300 bg-white"
      }`}
    >
      <span
        className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-2 ${
          selected ? "border-internia-primary" : "border-zinc-400"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-internia-primary" />}
      </span>
      <span className="text-sm text-zinc-700">{children}</span>
    </button>
  );
}

const inputClassName =
  "h-11 w-full rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-internia-primary/10";
