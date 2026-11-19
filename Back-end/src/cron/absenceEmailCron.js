
import cron from "node-cron";

import { Attendance } from "../models/Attendance.js";
import { User } from "../models/User.js";
import Leave from "../models/Leave.js";
import Holiday from "../models/Holiday.js";
import { mailTransporter } from "../config/mail.js";

const TIMEZONE = "Asia/Kolkata";

// ==========================================
// GET TODAY'S INDIA DATE
// ==========================================
function getIndiaDate() {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const get = (type) => parts.find((part) => part.type === type)?.value;
    return `${get("year")}-${get("month")}-${get("day")}`;
}

// ==========================================
// GET INDIA DAY RANGE
// ==========================================
function getDayRange(dateString) {
    const start = new Date(`${dateString}T00:00:00+05:30`);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    return { start, end };
}

// ==========================================
// CHECK SUNDAY
// ==========================================
function isSunday(dateString) {
    const date = new Date(`${dateString}T00:00:00+05:30`);

    return new Intl.DateTimeFormat("en-US", {
        timeZone: TIMEZONE,
        weekday: "long",
    }).format(date) === "Sunday";
}

// ==========================================
// FORMAT DATE
// ==========================================
function formatDate(dateString) {
    return new Date(`${dateString}T00:00:00+05:30`)
        .toLocaleDateString("en-IN", {
            timeZone: TIMEZONE,
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
}

// ==========================================
// ESCAPE HTML
// ==========================================
function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[char]);
}

// ==========================================
// EMAIL TEMPLATE
// ==========================================
function createAbsenceEmail(employeeName, absenceDate) {
    const name = escapeHtml(employeeName);
    const date = escapeHtml(absenceDate);

    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>

  <body style="
    margin:0;
    padding:25px;
    background:#f5f6fa;
    font-family:Arial,Helvetica,sans-serif;
    color:#333;
  ">

    <div style="
      max-width:650px;
      margin:0 auto;
      background:#ffffff;
      padding:35px;
      border-radius:8px;
    ">

      <p>Dear ${name},</p>

      <p>We hope you are doing well.</p>

      <p style="line-height:1.8;">
        This is to inform you that, as per our HRMS
        attendance records, you have been marked
        <strong>Absent</strong> on
        <strong>${date}</strong>,
        and no leave application has been submitted
        for the mentioned date.
      </p>

      <h3 style="margin-top:28px;">
        Attendance Details
      </h3>

      <table style="
        width:100%;
        border-collapse:collapse;
        margin-top:12px;
        font-size:14px;
      ">

        <tr>
          <td style="padding:12px;border:1px solid #ddd;">
            <strong>Employee Name</strong>
          </td>
          <td style="padding:12px;border:1px solid #ddd;">
            ${name}
          </td>
        </tr>

        <tr>
          <td style="padding:12px;border:1px solid #ddd;">
            <strong>Date</strong>
          </td>
          <td style="padding:12px;border:1px solid #ddd;">
            ${date}
          </td>
        </tr>

        <tr>
          <td style="padding:12px;border:1px solid #ddd;">
            <strong>Attendance Status</strong>
          </td>
          <td style="
            padding:12px;
            border:1px solid #ddd;
            color:#dc2626;
            font-weight:bold;
          ">
            Absent
          </td>
        </tr>

        <tr>
          <td style="padding:12px;border:1px solid #ddd;">
            <strong>Leave Application Status</strong>
          </td>
          <td style="padding:12px;border:1px solid #ddd;">
            Not Submitted
          </td>
        </tr>

      </table>

      <h3 style="margin-top:30px;">
        Action Required
      </h3>

      <p style="line-height:1.8;">
        You are requested to submit your leave
        application through the HRMS portal at the
        earliest, along with the appropriate reason
        for your absence.
      </p>

      <p style="line-height:1.8;">
        If you were present on the mentioned date
        or believe there is an error in your
        attendance record, kindly contact your
        reporting manager or the HR department
        for clarification.
      </p>

      <p style="line-height:1.8;">
        Please note that any absence without prior
        approval or a valid leave application may
        be considered
        <strong>Loss of Pay (LOP)</strong>
        in accordance with company policies.
      </p>

      <p style="line-height:1.8;">
        We request your cooperation in maintaining
        accurate attendance records and following
        the company's leave procedures.
      </p>

      <p style="margin-top:30px;line-height:1.8;">
        Best Regards,<br/>
        <strong>HR Department</strong><br/>
        <strong>Inquiry Bazaar Pvt. Ltd.</strong>
      </p>

    </div>

  </body>
  </html>
  `;
}

// ==========================================
// ABSENCE EMAIL CRON FUNCTION
// ==========================================
let isRunning = false;

export async function sendAbsenceEmails() {
    if (isRunning) {
        console.log("Absence email cron already running");
        return;
    }

    isRunning = true;

    try {
        const today = getIndiaDate();
        const { start, end } = getDayRange(today);

        console.log("=============Start==================");
        console.log("Absence Email Cron Started on Date:", today);

        // ======================================
        // 1. SKIP SUNDAY
        // ======================================
        if (isSunday(today)) {
            console.log("Today is Sunday. Skipping emails.");
            return;
        }

        // ======================================
        // 2. SKIP HOLIDAYS
        // ======================================
        const holiday = await Holiday.findOne({ date: { $gte: start, $lt: end, }, });

        if (holiday) {
            console.log(`Holiday found: ${holiday.title}. Skipping emails.`);
            return;
        }

        // ======================================
        // 3. GET ALL EMPLOYEES
        // ======================================

        const employees = await User.find({ role: "Employee", email: { $exists: true, $nin: ["", null] }, })
            .select("_id username email");

        console.log("Total employees:", employees.length);

        if (!employees.length) {
            console.log("No employees found.");
            return;
        }

        const employeeIds = employees.map((employee) => employee._id);

        // ======================================
        // 4. FIND TODAY'S ATTENDANCE
        // ======================================
        const attendanceRecords = await Attendance.find({
            userId: { $in: employeeIds },
            $or: [
                { date: { $gte: start, $lt: end, }, },
                { clockInTime: { $gte: start, $lt: end, }, },
            ],
        }).select("userId");

        // Employees who have attendance today
        const presentUserIds = new Set(attendanceRecords.map((attendance) => attendance.userId.toString()));
        console.log("Employees with attendance:", presentUserIds.size);

        // ======================================
        // 5. FIND LEAVE APPLICATIONS
        // ======================================
        const leaveRecords = await Leave.find({
            user: { $in: employeeIds },
            startDate: { $lt: end },
            endDate: { $gte: start },
        }).select("user status");

        // Any submitted leave counts as applied
        const leaveUserIds = new Set(leaveRecords.map((leave) => leave.user.toString()));
        console.log("Employees with leave applications:", leaveUserIds.size);

        // ======================================
        // 6. FIND ABSENT EMPLOYEES
        // ======================================
        const absentEmployees = employees.filter((employee) => {
            const userId = employee._id.toString();

            const hasAttendance = presentUserIds.has(userId);
            const hasLeave = leaveUserIds.has(userId);

            // Absent only when no attendance and no leave
            return !hasAttendance && !hasLeave;
        });

        console.log("Absent employees without leave:", absentEmployees.length);
        if (!absentEmployees.length) {
            console.log("No absence emails required.");
            return;
        }

        const admins = await User.find({ role: { $in: ["Admin", "Sub Admin"] }, officialEmail: { $exists: true, $nin: ["", null] }, }).select("officialEmail");

        const ccEmails = [...new Set(admins.map(admin => admin.officialEmail).filter(Boolean))];

        // ======================================
        // 7. SEND EMAILS ONLY TO EMPLOYEES
        // ======================================
        const formattedDate = formatDate(today);
        let sentCount = 0;
        let failedCount = 0;

        for (const employee of absentEmployees) {
            try {
                await mailTransporter.sendMail({
                    from: {
                        name: "Inquiry Bazaar Pvt. Ltd. - HR Department",
                        address: process.env.MAIL_USER,
                    },

                    // ONLY EMPLOYEE
                    to: employee.email,

                    cc: ccEmails.filter(email => email.toLowerCase() !== employee.email.toLowerCase()),

                    // NO CC OR BCC
                    subject: `Attendance Alert - Unreported Absence on ${formattedDate}`,
                    html: createAbsenceEmail(employee.username, formattedDate),
                });

                sentCount++;

                console.log(`Email sent to: ${employee.username} (${employee.email})`);
            } catch (error) {
                failedCount++;
                console.error(`Failed to send email to ${employee.email}:`, error.message);
            }
        }

        console.log("Absence Email Cron Completed on Date:", today);
        console.log(`Total Employees: ${employees.length}`, `Absent Without Leave: ${absentEmployees.length}`);
        console.log(`Emails Sent: ${sentCount}`, `Failed Emails: ${failedCount}`);
        console.log("============End================");

    } catch (error) {
        console.error("Absence Email Cron Error:", error);
    } finally {
        isRunning = false;
    }
}

// ==========================================
// RUN DAILY AT 6:00 PM IST
// ==========================================

cron.schedule("0 18 * * *", sendAbsenceEmails, { timezone: TIMEZONE, noOverlap: true, });
// cron.schedule("22 17 * * *", sendAbsenceEmails, { timezone: "Asia/Kolkata", noOverlap: true, });
console.log("Absence email cron scheduled for 6:00 PM IST");