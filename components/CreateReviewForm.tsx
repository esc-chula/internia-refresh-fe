"use client";

import { useMemo, useState } from "react";
import { FaceIcon, scoreToFace } from "./FaceIcon";

const companies = ["LINE MAN Wongnai", "PTT Digital", "Agoda", "SCB TechX"];

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

const scoreFields = [
  ["work", "ด้านเนื้องาน", "งานไม่ค่อยมีบทบาท ไม่ชัดเจน", "งานท้าทาย ได้เรียนรู้มาก"],
  ["social", "ด้านสังคม", "ไม่ค่อยเอื้อต่อการทำงาน", "สบายใจ ทำงานร่วมกับทีมได้ดี"],
  ["mentor", "ด้านพี่เลี้ยง", "ไม่ค่อยสนับสนุน", "สนับสนุนดีเยี่ยม"],
  ["experience", "ด้านประสบการณ์", "ประสบการณ์ที่ไม่ค่อยดี", "ประสบการณ์ที่ดีมาก"],
  ["overall", "คะแนนโดยรวม", "ไม่เป็นไปตามที่คาดหวัง", "ดีกว่าที่คาดหวัง"],
] as const;

const outlineColors = ["rgba(234, 67, 53, 0.7)", "rgba(242, 153, 74, 0.78)", "rgba(242, 201, 76, 0.85)", "rgba(124, 179, 66, 0.8)", "rgba(39, 174, 96, 0.8)"];

export function CreateReviewForm() {
  const [company, setCompany] = useState("");
  const [companyFocused, setCompanyFocused] = useState(false);
  const [companyType, setCompanyType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [salaryMode, setSalaryMode] = useState<"yes" | "no" | null>(null);
  const [salaryUnit, setSalaryUnit] = useState("");
  const [yearLimit, setYearLimit] = useState<"yes" | "no" | null>(null);
  const [yearValues, setYearValues] = useState<string[]>([]);
  const [gpaMode, setGpaMode] = useState<"yes" | "no" | null>(null);
  const [recommend, setRecommend] = useState<"yes" | "no" | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  const [scores, setScores] = useState<Record<string, number | null>>({});

  const normalizedCompany = company.trim().toLowerCase();
  const matchedCompany = companies.some((item) => item.toLowerCase() === normalizedCompany);
  const showCompanyType = normalizedCompany.length > 0 && !matchedCompany;
  const filteredCompanies = useMemo(
    () => companies.filter((item) => item.toLowerCase().includes(normalizedCompany)),
    [normalizedCompany],
  );
  const showCompanyList = companyFocused && filteredCompanies.length > 0;

  return (
    <main className="mx-auto w-[min(100%-32px,1120px)] py-7 pb-14">
      <form className="grid justify-items-center gap-5">
        <div className="grid w-[min(100%,760px)] gap-[26px] max-sm:w-full max-sm:gap-[22px]">
          <FormSection title="ข้อมูลบริษัท">
            <Field label="บริษัท" required>
              <div className="relative">
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  onFocus={() => setCompanyFocused(true)}
                  onBlur={() => window.setTimeout(() => setCompanyFocused(false), 120)}
                  placeholder="ค้นหาหรือพิมพ์ชื่อบริษัท"
                  className="h-[42px] w-full rounded-[3px] border border-[#bdbdbd] bg-white px-4 text-[0.92rem] text-[#232323] outline-none transition focus:border-[#222] focus:shadow-[0_0_0_1px_#222]"
                />
                {showCompanyList && (
                  <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded border border-[#cfcfcf] bg-white">
                    {filteredCompanies.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setCompany(item);
                          setCompanyFocused(false);
                        }}
                        className="block w-full bg-white px-[13px] py-[11px] text-left text-[0.92rem] text-[#232323] hover:bg-[#f5f5f5]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Field>

            {showCompanyType && (
              <Field label="ประเภทบริษัท" required>
                <CustomSelect
                  value={companyType}
                  onChange={setCompanyType}
                  placeholder="เลือกประเภทบริษัท"
                  options={companyTypes}
                />
              </Field>
            )}
          </FormSection>

          <FormSection title="ข้อมูลการฝึกงาน">
            <Field label="ตำแหน่งที่ฝึกงาน" required>
              <input className={inputClassName} placeholder="ตำแหน่งที่ฝึกงาน" />
            </Field>

            <div className="grid gap-2 sm:grid-cols-2">
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
                options={["Work from home", "Hybrid", "Onsite"]}
              />
            </Field>

            <div className="grid gap-2">
              <div className="text-[0.92rem] font-medium leading-[1.4] text-[#232323]">ค่าตอบแทน</div>
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
                      options={["บาท/เดือน", "บาท/วัน"]}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-[0.92rem] font-medium leading-[1.4] text-[#232323]">ชั้นปีที่เปิดรับ</div>
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
                          className={`flex cursor-pointer items-center gap-[10px] rounded-[4px] border px-[14px] py-3 ${
                            checked ? "border-[#222] bg-white" : "border-[#d5d5d5] bg-white"
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
                            className="h-[18px] w-[18px] accent-[#111827]"
                          />
                          <span className="text-[0.92rem] text-[#232323]">ชั้นปีที่ {value}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-[0.92rem] font-medium leading-[1.4] text-[#232323]">เกรดเฉลี่ยขั้นต่ำ</div>
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
          </FormSection>

          <FormSection title="รีวิว">
            <TextArea label="ขั้นตอนการสมัคร" placeholder="สมัครผ่านช่องทางไหน มีกี่รอบ ใช้เวลานานไหม ต้องเตรียมอะไรเป็นพิเศษ" />
            <TextArea label="งานที่ได้รับ" placeholder="หน้าที่ที่รับผิดชอบ โปรเจคที่ได้ทำ ความรู้หรือเครื่องมือที่ใช้ เนื้องานตรงกับตำแหน่งที่สมัครไหม" />
            <TextArea label="บรรยากาศการทำงาน" placeholder="บรรยากาศภายในทีม วัฒนธรรมองค์กร สวัสดิการ การเดินทาง" />
            <TextArea label="สิ่งที่อยากบอกต่อ" placeholder="ชอบอะไร ไม่ชอบอะไร ได้เรียนรู้อะไร และอยากแนะนำคนที่สนใจว่าอะไร" />
          </FormSection>

          <section className="grid gap-[14px]">
            <div className="grid gap-[1.4rem]">
              <h2 className="m-0 text-[1.2rem] font-bold">แบบประเมิน</h2>
              {scoreFields.map(([key, title, low, high]) => (
                <div key={key} className="grid gap-2">
                  <div className="text-[0.92rem] font-medium leading-[1.4] text-[#232323]">
                    {title} <span className="text-[#b91c1c]">*</span>
                  </div>
                  <div className="grid gap-3">
                    <div className="grid items-center gap-3 max-sm:grid-cols-[minmax(72px,1fr)_auto_minmax(72px,1fr)] sm:grid-cols-[minmax(92px,1fr)_auto_minmax(92px,1fr)]">
                      <div className="text-right text-[0.78rem] leading-[1.4] text-[#444] max-sm:text-[0.72rem] max-sm:leading-[1.35]">{low}</div>
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
                                selected ? "shadow-[0_0_0_2px_#111]" : ""
                              } max-sm:h-[30px] max-sm:w-[30px] h-[34px] w-[34px]`}
                              style={{
                                boxShadow: selected ? "0 0 0 2px #111" : `inset 0 0 0 2px ${outlineColors[score - 1]}`,
                              }}
                            >
                              {selected ? (
                                <FaceIcon score={scoreToFace(score)} className="h-full w-full rounded-[10px]" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-left text-[0.78rem] leading-[1.4] text-[#444] max-sm:text-[0.72rem] max-sm:leading-[1.35]">{high}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <FormSection title="คุณแนะนำให้คนอื่นมาสมัครหรือไม่?">
            <div className="grid gap-[10px] sm:grid-cols-2">
              <RecommendBox
                selected={recommend === "yes"}
                tone="like"
                label="แนะนำ"
                onClick={() => setRecommend(recommend === "yes" ? null : "yes")}
              />
              <RecommendBox
                selected={recommend === "no"}
                tone="dislike"
                label="ไม่แนะนำ"
                onClick={() => setRecommend(recommend === "no" ? null : "no")}
              />
            </div>
          </FormSection>

          <div className="grid gap-2">
            <label
              className={`flex cursor-pointer items-center gap-[10px] rounded-[4px] border px-[14px] py-3 ${
                anonymous ? "border-[#222] bg-white" : "border-[#d5d5d5] bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={anonymous}
                onChange={() => setAnonymous((value) => !value)}
                className="h-[18px] w-[18px] accent-[#111827]"
              />
              <span className="text-[0.92rem] text-[#232323]">ส่งรีวิวแบบไม่ระบุตัวตน</span>
            </label>
          </div>

          <div className="grid">
            <button type="button" className="min-h-11 rounded-full bg-[#821923] text-[0.92rem] font-semibold text-white">
              Submit review
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-[14px]">
      <h2 className="m-0 text-[1.2rem] font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-[0.92rem] font-medium leading-[1.4] text-[#232323]">
        {label} {required ? <span className="text-[#b91c1c]">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function TextArea({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="grid gap-2">
      <p className="m-0 text-[0.92rem] font-medium leading-[1.4] text-[#232323]">{label}</p>
      <textarea
        placeholder={placeholder}
        className="min-h-[188px] w-full resize-y rounded-[3px] border border-[#bdbdbd] bg-white px-4 py-3 text-[0.92rem] text-[#232323] outline-none transition focus:border-[#222] focus:shadow-[0_0_0_1px_#222]"
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
      className={`flex items-center gap-[10px] rounded-[4px] border px-[14px] py-3 text-left ${
        selected ? "border-[#222] bg-white" : "border-[#d5d5d5] bg-white"
      }`}
    >
      <span
        className={`h-[18px] w-[18px] rounded-full border ${selected ? "border-[5px] border-[#111827]" : "border-[#9ca3af]"}`}
      />
      <span className="text-[0.92rem] text-[#232323]">{children}</span>
    </button>
  );
}

function CustomSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex h-[42px] w-full items-center justify-between rounded-[3px] border border-[#bdbdbd] bg-white px-4 text-left text-[0.92rem] outline-none transition focus:border-[#222] focus:shadow-[0_0_0_1px_#222] ${
          value ? "text-[#232323]" : "text-[#6b7280]"
        }`}
      >
        <span>{value || placeholder}</span>
        <span className="text-base">⌄</span>
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded border border-[#cfcfcf] bg-white">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="block w-full bg-white px-[13px] py-[11px] text-left text-[0.92rem] text-[#232323] hover:bg-[#f5f5f5]"
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RecommendBox({
  selected,
  tone,
  label,
  onClick,
}: {
  selected: boolean;
  tone: "like" | "dislike";
  label: string;
  onClick: () => void;
}) {
  const toneClasses =
    tone === "like"
      ? selected
        ? "border-[rgba(39,174,96,0.72)] bg-[rgba(39,174,96,0.14)]"
        : "border-[#d5d5d5] bg-white"
      : selected
        ? "border-[rgba(234,67,53,0.7)] bg-[rgba(234,67,53,0.14)]"
        : "border-[#d5d5d5] bg-white";

  const barColor = tone === "like" ? "#27ae60" : "#ea4335";
  const iconColor = tone === "like" ? "#27ae60" : "#ea4335";

  return (
    <button type="button" onClick={onClick} className={`relative flex items-center gap-[10px] overflow-hidden rounded-[4px] border px-[14px] py-3 text-left ${toneClasses}`}>
      <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: selected ? barColor : "transparent" }} />
      <ThumbIcon type={tone} color={iconColor} />
      <span className="text-[0.92rem] text-[#232323]">{label}</span>
    </button>
  );
}

function ThumbIcon({ type, color }: { type: "like" | "dislike"; color: string }) {
  if (type === "like") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
        <path d="M7 10v11" />
        <path d="M11 21h7.2a2 2 0 0 0 2-1.7l.7-5A2 2 0 0 0 19 12H14l1-5.1V6a2 2 0 0 0-2-2l-4 6v11Z" />
        <path d="M7 21H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
      <path d="M17 14V3" />
      <path d="M13 3H5.8a2 2 0 0 0-2 1.7l-.7 5A2 2 0 0 0 5 12h5l-1 5.1v.9a2 2 0 0 0 2 2l4-6V3Z" />
      <path d="M17 3h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3" />
    </svg>
  );
}

const inputClassName =
  "h-[42px] w-full rounded-[3px] border border-[#bdbdbd] bg-white px-4 text-[0.92rem] text-[#232323] outline-none transition focus:border-[#222] focus:shadow-[0_0_0_1px_#222]";
