"use client";
import { useState, useMemo } from "react";

// 2024 Federal Tax Brackets (married filing jointly / single)
const FEDERAL_BRACKETS_SINGLE = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];
const FEDERAL_BRACKETS_MARRIED = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 },
];
const FEDERAL_BRACKETS_HOH = [
  { min: 0, max: 16550, rate: 0.10 },
  { min: 16550, max: 63100, rate: 0.12 },
  { min: 63100, max: 100500, rate: 0.22 },
  { min: 100500, max: 191950, rate: 0.24 },
  { min: 191950, max: 243700, rate: 0.32 },
  { min: 243700, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

// 2024 Standard deductions
const STD_DEDUCTIONS: Record<string, number> = {
  single: 14600,
  married: 29200,
  hoh: 21900,
};

// State tax rates (simplified flat/effective rates for 2024)
const STATE_TAXES: Record<string, { name: string; rate: number; hasNoTax: boolean }> = {
  AL: { name: "Alabama", rate: 0.05, hasNoTax: false },
  AK: { name: "Alaska", rate: 0, hasNoTax: true },
  AZ: { name: "Arizona", rate: 0.025, hasNoTax: false },
  AR: { name: "Arkansas", rate: 0.044, hasNoTax: false },
  CA: { name: "California", rate: 0.093, hasNoTax: false },
  CO: { name: "Colorado", rate: 0.044, hasNoTax: false },
  CT: { name: "Connecticut", rate: 0.065, hasNoTax: false },
  DE: { name: "Delaware", rate: 0.066, hasNoTax: false },
  FL: { name: "Florida", rate: 0, hasNoTax: true },
  GA: { name: "Georgia", rate: 0.055, hasNoTax: false },
  HI: { name: "Hawaii", rate: 0.11, hasNoTax: false },
  ID: { name: "Idaho", rate: 0.058, hasNoTax: false },
  IL: { name: "Illinois", rate: 0.0495, hasNoTax: false },
  IN: { name: "Indiana", rate: 0.031, hasNoTax: false },
  IA: { name: "Iowa", rate: 0.057, hasNoTax: false },
  KS: { name: "Kansas", rate: 0.057, hasNoTax: false },
  KY: { name: "Kentucky", rate: 0.045, hasNoTax: false },
  LA: { name: "Louisiana", rate: 0.06, hasNoTax: false },
  ME: { name: "Maine", rate: 0.075, hasNoTax: false },
  MD: { name: "Maryland", rate: 0.0575, hasNoTax: false },
  MA: { name: "Massachusetts", rate: 0.05, hasNoTax: false },
  MI: { name: "Michigan", rate: 0.0425, hasNoTax: false },
  MN: { name: "Minnesota", rate: 0.0985, hasNoTax: false },
  MS: { name: "Mississippi", rate: 0.05, hasNoTax: false },
  MO: { name: "Missouri", rate: 0.054, hasNoTax: false },
  MT: { name: "Montana", rate: 0.069, hasNoTax: false },
  NE: { name: "Nebraska", rate: 0.0664, hasNoTax: false },
  NV: { name: "Nevada", rate: 0, hasNoTax: true },
  NH: { name: "New Hampshire", rate: 0, hasNoTax: true },
  NJ: { name: "New Jersey", rate: 0.1075, hasNoTax: false },
  NM: { name: "New Mexico", rate: 0.059, hasNoTax: false },
  NY: { name: "New York", rate: 0.109, hasNoTax: false },
  NC: { name: "North Carolina", rate: 0.0475, hasNoTax: false },
  ND: { name: "North Dakota", rate: 0.029, hasNoTax: false },
  OH: { name: "Ohio", rate: 0.0399, hasNoTax: false },
  OK: { name: "Oklahoma", rate: 0.0475, hasNoTax: false },
  OR: { name: "Oregon", rate: 0.099, hasNoTax: false },
  PA: { name: "Pennsylvania", rate: 0.0307, hasNoTax: false },
  RI: { name: "Rhode Island", rate: 0.0599, hasNoTax: false },
  SC: { name: "South Carolina", rate: 0.07, hasNoTax: false },
  SD: { name: "South Dakota", rate: 0, hasNoTax: true },
  TN: { name: "Tennessee", rate: 0, hasNoTax: true },
  TX: { name: "Texas", rate: 0, hasNoTax: true },
  UT: { name: "Utah", rate: 0.0485, hasNoTax: false },
  VT: { name: "Vermont", rate: 0.0875, hasNoTax: false },
  VA: { name: "Virginia", rate: 0.0575, hasNoTax: false },
  WA: { name: "Washington", rate: 0, hasNoTax: true },
  WV: { name: "West Virginia", rate: 0.065, hasNoTax: false },
  WI: { name: "Wisconsin", rate: 0.0765, hasNoTax: false },
  WY: { name: "Wyoming", rate: 0, hasNoTax: true },
  DC: { name: "Washington D.C.", rate: 0.0895, hasNoTax: false },
};

const SS_RATE = 0.062;
const SS_WAGE_BASE = 168600;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD_SINGLE = 200000;
const ADDITIONAL_MEDICARE_THRESHOLD_MARRIED = 250000;

function calcFederalTax(taxableIncome: number, filing: string): number {
  const brackets =
    filing === "married" ? FEDERAL_BRACKETS_MARRIED :
    filing === "hoh" ? FEDERAL_BRACKETS_HOH :
    FEDERAL_BRACKETS_SINGLE;
  let tax = 0;
  for (const b of brackets) {
    if (taxableIncome <= b.min) break;
    const taxable = Math.min(taxableIncome, b.max) - b.min;
    tax += taxable * b.rate;
  }
  return tax;
}

function calcEffectiveFederalRate(income: number, filing: string): number {
  const deduction = STD_DEDUCTIONS[filing] || STD_DEDUCTIONS.single;
  const taxableIncome = Math.max(0, income - deduction);
  const tax = calcFederalTax(taxableIncome, filing);
  return income > 0 ? tax / income : 0;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => (n * 100).toFixed(1) + "%";

type Freq = "annual" | "monthly" | "biweekly" | "weekly";
const FREQ_PERIODS: Record<Freq, number> = { annual: 1, monthly: 12, biweekly: 26, weekly: 52 };

export default function PaycheckCalculator() {
  const [salary, setSalary] = useState("75000");
  const [freq, setFreq] = useState<Freq>("annual");
  const [filing, setFiling] = useState("single");
  const [state, setState] = useState("CA");
  const [k401, setK401] = useState("5");
  const [healthPremium, setHealthPremium] = useState("200");
  const [additionalWithholding, setAdditionalWithholding] = useState("0");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const results = useMemo(() => {
    const annualGross = parseFloat(salary || "0") * (freq === "annual" ? 1 : FREQ_PERIODS[freq]);
    if (!annualGross || annualGross < 0) return null;

    const k401Pct = Math.min(100, Math.max(0, parseFloat(k401 || "0"))) / 100;
    const k401Annual = Math.min(annualGross * k401Pct, 23000); // 2024 contribution limit
    const annualHealthPremium = parseFloat(healthPremium || "0") * 12;
    const additionalAnnual = parseFloat(additionalWithholding || "0") * 12;

    // Pre-tax deductions reduce federal/state taxable income
    const preTaxDeductions = k401Annual + annualHealthPremium;
    const federalTaxableBeforeStd = Math.max(0, annualGross - preTaxDeductions);
    const stdDeduction = STD_DEDUCTIONS[filing] || STD_DEDUCTIONS.single;
    const federalTaxableIncome = Math.max(0, federalTaxableBeforeStd - stdDeduction);

    const federalTax = calcFederalTax(federalTaxableIncome, filing) + additionalAnnual;

    // State tax on income after pre-tax deductions (simplified)
    const stateTaxable = Math.max(0, annualGross - preTaxDeductions);
    const stateRate = STATE_TAXES[state]?.rate || 0;
    const stateTax = stateTaxable * stateRate;

    // FICA
    const ssWages = Math.min(annualGross, SS_WAGE_BASE);
    const ssTax = ssWages * SS_RATE;
    const medicareTax = annualGross * MEDICARE_RATE;
    const additionalMedicareThreshold = filing === "married"
      ? ADDITIONAL_MEDICARE_THRESHOLD_MARRIED
      : ADDITIONAL_MEDICARE_THRESHOLD_SINGLE;
    const additionalMedicare = Math.max(0, annualGross - additionalMedicareThreshold) * ADDITIONAL_MEDICARE_RATE;
    const totalFica = ssTax + medicareTax + additionalMedicare;

    const totalDeductions = federalTax + stateTax + totalFica + k401Annual + annualHealthPremium;
    const annualTakeHome = Math.max(0, annualGross - totalDeductions);
    const effectiveFedRate = annualGross > 0 ? federalTax / annualGross : 0;
    const effectiveTotalRate = annualGross > 0 ? (federalTax + stateTax + totalFica) / annualGross : 0;

    const periods = FREQ_PERIODS[freq];
    return {
      annualGross,
      annualTakeHome,
      perPeriodGross: annualGross / periods,
      perPeriodTakeHome: annualTakeHome / periods,
      federalTax, stateTax, totalFica, ssTax, medicareTax, additionalMedicare,
      k401Annual, annualHealthPremium,
      effectiveFedRate, effectiveTotalRate, stateRate,
      marginalRate: calcEffectiveFederalRate(annualGross + 1000, filing) > calcEffectiveFederalRate(annualGross, filing)
        ? FEDERAL_BRACKETS_SINGLE.find(b => federalTaxableIncome < b.max)?.rate || 0
        : FEDERAL_BRACKETS_SINGLE.find(b => federalTaxableIncome < b.max)?.rate || 0,
      totalDeductions,
      periods,
    };
  }, [salary, freq, filing, state, k401, healthPremium, additionalWithholding]);

  const freqLabel: Record<Freq, string> = { annual: "year", monthly: "month", biweekly: "paycheck", weekly: "week" };

  const inputStyle = { width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 15, outline: "none" };
  const labelStyle = { display: "block" as const, fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 };

  return (
    <div className="container" style={{ maxWidth: 980, padding: "0 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.2fr)", gap: 24, alignItems: "start", paddingTop: 32 }}>

        {/* === LEFT: Inputs === */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 24, color: "#111827" }}>Your details</h2>

          {/* Salary */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Gross salary / income</label>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontSize: 15 }}>$</span>
                <input type="number" value={salary} onChange={e => setSalary(e.target.value)} min="0"
                  style={{ ...inputStyle, paddingLeft: 26 }} placeholder="75,000" />
              </div>
              <select value={freq} onChange={e => setFreq(e.target.value as Freq)}
                style={{ ...inputStyle, width: "auto", paddingRight: 32 }}>
                <option value="annual">Per year</option>
                <option value="monthly">Per month</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="weekly">Per week</option>
              </select>
            </div>
          </div>

          {/* Filing status */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Filing status</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[["single","Single"],["married","Married"],["hoh","Head of\nHousehold"]].map(([v,l]) => (
                <button key={v} onClick={() => setFiling(v)}
                  style={{ padding: "9px 6px", borderRadius: 8, border: `1.5px solid ${filing === v ? "#1a56db" : "#e5e7eb"}`, background: filing === v ? "#eff6ff" : "#fff", color: filing === v ? "#1a56db" : "#374151", fontSize: 12, fontWeight: 500, cursor: "pointer", lineHeight: 1.3 }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* State */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>State</label>
            <select value={state} onChange={e => setState(e.target.value)} style={inputStyle}>
              {Object.entries(STATE_TAXES).sort((a,b)=>a[1].name.localeCompare(b[1].name)).map(([code, s]) => (
                <option key={code} value={code}>{s.name}{s.hasNoTax ? " (no income tax)" : ""}</option>
              ))}
            </select>
          </div>

          {/* 401k */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, display: "flex", justifyContent: "space-between" }}>
              <span>401(k) contribution</span>
              <span style={{ fontWeight: 400, color: "#6b7280" }}>{k401}% · {results ? fmt(results.k401Annual) + "/yr" : ""}</span>
            </label>
            <input type="range" min="0" max="30" step="1" value={k401} onChange={e => setK401(e.target.value)}
              style={{ width: "100%", accentColor: "#1a56db", height: 4 }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
              <span>0%</span><span>15%</span><span>30%</span>
            </div>
          </div>

          {/* Health */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Monthly health insurance premium</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontSize: 15 }}>$</span>
              <input type="number" value={healthPremium} onChange={e => setHealthPremium(e.target.value)} min="0"
                style={{ ...inputStyle, paddingLeft: 26 }} placeholder="200" />
            </div>
          </div>

          {/* Additional withholding */}
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Additional monthly withholding</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontSize: 15 }}>$</span>
              <input type="number" value={additionalWithholding} onChange={e => setAdditionalWithholding(e.target.value)} min="0"
                style={{ ...inputStyle, paddingLeft: 26 }} placeholder="0" />
            </div>
          </div>
        </div>

        {/* === RIGHT: Results === */}
        <div>
          {results ? (
            <>
              {/* Take-home hero */}
              <div style={{ background: "#1a56db", borderRadius: 16, padding: "28px", color: "#fff", marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: "#bfdbfe", marginBottom: 6, fontWeight: 500 }}>
                  Estimated take-home pay per {freqLabel[freq]}
                </p>
                <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-1px", marginBottom: 4 }}>
                  {fmt(results.perPeriodTakeHome)}
                </div>
                <p style={{ fontSize: 14, color: "#93c5fd" }}>
                  {fmt(results.annualTakeHome)} per year · {fmtPct(1 - results.totalDeductions / results.annualGross)} of gross
                </p>

                {/* Mini bar */}
                <div style={{ marginTop: 20, marginBottom: 4 }}>
                  <div style={{ display: "flex", height: 10, borderRadius: 6, overflow: "hidden", gap: 2 }}>
                    <div style={{ flex: results.annualTakeHome, background: "#60a5fa" }} title="Take-home" />
                    <div style={{ flex: results.federalTax, background: "#f97316" }} title="Federal tax" />
                    <div style={{ flex: results.stateTax, background: "#fb923c" }} title="State tax" />
                    <div style={{ flex: results.totalFica, background: "#fbbf24" }} title="FICA" />
                    {results.k401Annual > 0 && <div style={{ flex: results.k401Annual, background: "#34d399" }} title="401k" />}
                  </div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10, fontSize: 12, color: "#bfdbfe" }}>
                    {[["#60a5fa","Take-home"],["#f97316","Federal"],["#fb923c","State"],["#fbbf24","FICA"],["#34d399","401k"]].map(([c,l])=>(
                      <span key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: c, flexShrink: 0, display: "inline-block" }} />
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Breakdown rows */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, color: "#111827" }}>Full breakdown</h3>

                {/* Gross */}
                <Row label="Gross income" annual={results.annualGross} period={results.perPeriodGross} bold color="#111827" />
                <div style={{ height: 1, background: "#f3f4f6", margin: "12px 0" }} />

                {/* Pre-tax */}
                <SectionTitle>Pre-tax deductions</SectionTitle>
                {results.k401Annual > 0 && <Row label="401(k) contribution" annual={-results.k401Annual} period={-results.k401Annual / results.periods} color="#16a34a" note="Reduces taxable income" />}
                {results.annualHealthPremium > 0 && <Row label="Health insurance" annual={-results.annualHealthPremium} period={-results.annualHealthPremium / results.periods} color="#16a34a" />}
                <div style={{ height: 1, background: "#f3f4f6", margin: "12px 0" }} />

                {/* Taxes */}
                <SectionTitle>Taxes</SectionTitle>
                <Row label={`Federal income tax (${fmtPct(results.effectiveFedRate)} effective)`} annual={-results.federalTax} period={-results.federalTax / results.periods} color="#dc2626"
                  note={`Marginal rate: ${fmtPct(results.marginalRate)} · Std deduction: ${fmt(STD_DEDUCTIONS[filing])}`} />
                <Row label={`${STATE_TAXES[state]?.name} state tax${STATE_TAXES[state]?.hasNoTax ? " (none)" : ` (${fmtPct(results.stateRate)})`}`}
                  annual={-results.stateTax} period={-results.stateTax / results.periods} color={results.stateTax > 0 ? "#dc2626" : "#16a34a"} />
                <div style={{ height: 1, background: "#f3f4f6", margin: "8px 0" }} />
                <SectionTitle>FICA (Social Security & Medicare)</SectionTitle>
                <Row label={`Social Security (${fmtPct(SS_RATE)})`} annual={-results.ssTax} period={-results.ssTax / results.periods} color="#dc2626"
                  note={`Wage base: ${fmt(SS_WAGE_BASE)}`} />
                <Row label={`Medicare (${fmtPct(MEDICARE_RATE)})`} annual={-results.medicareTax} period={-results.medicareTax / results.periods} color="#dc2626" />
                {results.additionalMedicare > 0 && (
                  <Row label="Additional Medicare (0.9%)" annual={-results.additionalMedicare} period={-results.additionalMedicare / results.periods} color="#dc2626"
                    note={`Applies above ${filing === "married" ? "$250k" : "$200k"}`} />
                )}
                <div style={{ height: 1, background: "#f3f4f6", margin: "12px 0" }} />

                {/* Total rate */}
                <div style={{ background: "#f9fafb", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: "#6b7280" }}>Total effective tax rate</span>
                    <span style={{ fontWeight: 600, color: "#dc2626" }}>{fmtPct(results.effectiveTotalRate)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#6b7280" }}>Marginal federal bracket</span>
                    <span style={{ fontWeight: 600 }}>{fmtPct(results.marginalRate)}</span>
                  </div>
                </div>

                {/* Take-home final */}
                <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 500, marginBottom: 2 }}>Take-home pay</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#15803d" }}>{fmt(results.perPeriodTakeHome)}<span style={{ fontSize: 13, fontWeight: 400, color: "#16a34a" }}>/{freqLabel[freq]}</span></div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, color: "#16a34a" }}>{fmt(results.annualTakeHome)}/yr</div>
                    <div style={{ fontSize: 12, color: "#4ade80" }}>{fmtPct(1 - results.totalDeductions / results.annualGross)} of gross</div>
                  </div>
                </div>
              </div>

              {/* Comparison periods */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "20px 24px", marginTop: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: "#374151" }}>Take-home by pay period</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                  {(["weekly","biweekly","monthly","annual"] as Freq[]).map(f => (
                    <div key={f} style={{ textAlign: "center", background: f === freq ? "#eff6ff" : "#f9fafb", borderRadius: 8, padding: "12px 8px", border: `1px solid ${f === freq ? "#bfdbfe" : "#e5e7eb"}` }}>
                      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, textTransform: "capitalize" }}>{f === "biweekly" ? "Bi-weekly" : f}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{fmt(results.annualTakeHome / FREQ_PERIODS[f])}</div>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 16, lineHeight: 1.6, textAlign: "center" }}>
                * Estimates only. Does not account for local city taxes, other deductions, or tax credits. Consult a tax professional for personalised advice.
              </p>
            </>
          ) : (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "60px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Enter your salary to get started</h3>
              <p style={{ color: "#6b7280", fontSize: 14 }}>Fill in your details on the left to see your estimated take-home pay.</p>
            </div>
          )}
        </div>
      </div>

      {/* Info section */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>How US take-home pay is calculated</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
          {[
            { icon:"🏛️", title:"Federal income tax", desc:"Progressive tax with 7 brackets from 10% to 37%. Your effective rate is much lower than the top bracket you hit." },
            { icon:"🗺️", title:"State income tax", desc:"Ranges from 0% (TX, FL, NV etc.) to over 13% in California. 9 states have no state income tax at all." },
            { icon:"👴", title:"Social Security (6.2%)", desc:"Applies to earnings up to $168,600 in 2024. Both you and your employer each pay 6.2%." },
            { icon:"🏥", title:"Medicare (1.45%)", desc:"No wage cap. High earners (over $200k single) pay an additional 0.9% on income above the threshold." },
            { icon:"📊", title:"401(k) contributions", desc:"Pre-tax contributions reduce your federal and state taxable income, effectively giving you a tax discount on retirement savings." },
            { icon:"💊", title:"Health insurance", desc:"Employer-sponsored premiums paid pre-tax reduce your taxable income, making employer health plans highly tax-efficient." },
          ].map(c => (
            <div key={c.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .calc-grid{grid-template-columns:1fr !important}
        }
      `}</style>
    </div>
  );
}

function Row({ label, annual, period, bold, color, note }: { label: string; annual: number; period: number; bold?: boolean; color?: string; note?: string }) {
  const isNeg = annual < 0;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: bold ? 600 : 400, color: color || "#374151", flex: 1 }}>{label}</span>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: bold ? 700 : 500, color: color || (isNeg ? "#dc2626" : "#374151") }}>
            {isNeg ? "-" : ""}{fmt(Math.abs(annual))}<span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 400 }}>/yr</span>
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>{isNeg ? "-" : ""}{fmt(Math.abs(period))}/pay</div>
        </div>
      </div>
      {note && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{note}</div>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{children}</p>;
}
