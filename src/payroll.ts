/**
 * Estimated monthly take-home pay for a Malaysian employee (citizen / PR, under 60, resident taxpayer).
 * Figures are approximations for comparing offers, not payroll-grade results.
 */

const WAGE_CEILING = 6000; // SOCSO & EIS insurable wage ceiling (from Oct 2024)
const round2 = (n: number) => Math.round(n * 100) / 100;

// Resident income tax bands (YA2025): [upper limit of band, rate]
const TAX_BANDS: [number, number][] = [
  [5_000, 0],
  [20_000, 0.01],
  [35_000, 0.03],
  [50_000, 0.06],
  [70_000, 0.11],
  [100_000, 0.19],
  [400_000, 0.25],
  [600_000, 0.26],
  [2_000_000, 0.28],
  [Infinity, 0.3],
];

export function annualTax(chargeable: number): number {
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of TAX_BANDS) {
    if (chargeable > lower) tax += (Math.min(chargeable, upper) - lower) * rate;
    lower = upper;
  }
  // Rebate of RM400 when chargeable income is RM35,000 or less.
  if (chargeable <= 35_000) tax = Math.max(0, tax - 400);
  return tax;
}

export interface PayResult {
  gross: number;
  epf: number;
  socso: number;
  eis: number;
  pcb: number;
  net: number;
  employerEpf: number;
  employerSocso: number;
  employerEis: number;
}

export function estimatePay(gross: number, epfRate: number): PayResult {
  const epf = Math.ceil(gross * epfRate); // EPF rounds up to the next ringgit
  const insurable = Math.min(gross, WAGE_CEILING);
  const socso = round2(insurable * 0.005);
  const eis = round2(insurable * 0.002);

  const chargeable = Math.max(
    0,
    gross * 12 - 9_000 - Math.min(epf * 12, 4_000) - Math.min((socso + eis) * 12, 350),
  );
  const pcb = round2(annualTax(chargeable) / 12);

  return {
    gross,
    epf,
    socso,
    eis,
    pcb,
    net: round2(gross - epf - socso - eis - pcb),
    employerEpf: Math.ceil(gross * (gross <= 5000 ? 0.13 : 0.12)),
    employerSocso: round2(insurable * 0.0175),
    employerEis: eis,
  };
}
