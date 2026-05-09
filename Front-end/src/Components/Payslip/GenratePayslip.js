import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import PayslipLayout from "../../Assets/Payslip.pdf";
import { months } from "../../Data/data";

export const generatePayslip = async (userPayRoll, totalPaidDays, month, year) => {

  const existingPdfBytes = await fetch(PayslipLayout).then(res =>
    res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const payroll = userPayRoll?.userPayroll?.[0];
  const work = userPayRoll?.userWork?.[0];

  /* ---------- EMPLOYEE DETAILS ---------- */
  page.drawText(userPayRoll?.username || "", {
    x: 418,
    y: 745,
    size: 8,
    font,
  });

  page.drawText(work?.empId || "", {
    x: 170,
    y: 745,
    size: 8,
    font,
  });

  page.drawText(new Date(work?.joiningDate).toLocaleDateString("en-IN") || "", {
    x: 418,
    y: 727,
    size: 8,
    font,
  });

  page.drawText(new Date(userPayRoll?.dob).toLocaleDateString("en-IN") || "", {
    x: 170,
    y: 727,
    size: 8,
    font,
  });

  /* ---------- BANK DETAILS ---------- */
  page.drawText(payroll?.bankName || "", {
    x: 170,
    y: 710,
    size: 8,
    font,
  });

  page.drawText(payroll?.accountNumber || "", {
    x: 418,
    y: 710,
    size: 8,
    font,
  });

  page.drawText(payroll?.panNumber || "", {
    x: 170,
    y: 692,
    size: 8,
    font,
  });

  page.drawText(totalPaidDays.toString() || "", {
    x: 170,
    y: 674,
    size: 8,
    font,
  });

  page.drawText(payroll?.pfNumber || "", {
    x: 418,
    y: 692,
    size: 8,
    font,
  });

  const payslipMonth = `${months[month]?.name} ${year}`;
  page.drawText(payslipMonth, {
    x: 158,
    y: 655,
    size: 10,
    font: fontBold,
  });

  /* ---------- EARNINGS ---------- */
  const monthDays = new Date(year, month + 1, 0).getDate();
  const monthlySalary =
    (payroll?.basicPay || 0) +
    (payroll?.HRA || 0) +
    (payroll?.bonus || 0) +
    (payroll?.specialAllowance || 0) +
    (payroll?.medicalAllowance || 0) +
    (payroll?.ta || 0);

  const netPay = Math.round((monthlySalary / monthDays) * totalPaidDays);
  const ratio = netPay / monthlySalary;
  const basic = Math.round((payroll?.basicPay || 0) * ratio);
  const hra = Math.round((payroll?.HRA || 0) * ratio);
  const bonus = Math.round((payroll?.bonus || 0) * ratio);
  const special = Math.round(((payroll?.specialAllowance || 0) + (payroll?.medicalAllowance || 0)) * ratio);
  const ta = Math.round((payroll?.ta || 0) * ratio);

  page.drawText(String(basic), { x: 160, y: 618, size: 8, font });
  page.drawText(String(hra), { x: 160, y: 600, size: 8, font });
  page.drawText(String(bonus), { x: 160, y: 582, size: 8, font });
  page.drawText(String(special), { x: 160, y: 564, size: 8, font });
  page.drawText(String(ta), { x: 160, y: 548, size: 8, font });

  page.drawText(String(netPay), {
    x: 160,
    y: 530,
    size: 8,
    font: fontBold,
  });

  /* ---------- Deductions ---------- */
  page.drawText("0", {
    x: 475,
    y: 530,
    size: 8,
    font: fontBold,
  });


  /* ---------- Total Section ---------- */
  page.drawText("0", {
    x: 160,
    y: 498,
    size: 8,
    font: fontBold,
  });

  page.drawText("0", {
    x: 475,
    y: 498,
    size: 8,
    font: fontBold,
  });

  page.drawText(String(netPay), {
    x: 160,
    y: 480,
    size: 8,
    font: fontBold,
  });

  page.drawText("0", {
    x: 475,
    y: 480,
    size: 8,
    font: fontBold,
  });

  page.drawText(String(netPay), {
    x: 160,
    y: 446,
    size: 8,
    font: fontBold,
  });

  page.drawText("0", {
    x: 160,
    y: 328,
    size: 8,
    font: fontBold,
  });

  page.drawText(String(netPay), {
    x: 160,
    y: 294,
    size: 8,
    font: fontBold,
  });


  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  return URL.createObjectURL(blob);
};