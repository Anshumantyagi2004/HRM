import cron from "node-cron";
import { CompanyInfo } from "../models/CompanyInfo.js";
import { UserExtraDetail } from "../models/UserExtraDetails.js";

cron.schedule("0 0 1 * *", async () => {
    console.log("Monthly Leave Credit Running");
    try {
        const companyRule = await CompanyInfo.findOne({
            defaultRule: true,
        });

        if (!companyRule) return;

        const monthlyLeave = Number((Number(companyRule.casualLeave || 0) / 12).toFixed(2));

        const currentMonth = new Date().getMonth() + 1;

        const users = await UserExtraDetail.find();

        for (const user of users) {
            if (user.lastLeaveCreditMonth === currentMonth) {
                continue;
            }

            user.casualLeave += monthlyLeave;
            user.casualLeaveRemaining += monthlyLeave;
            user.lastLeaveCreditMonth = currentMonth;
            await user.save();
        }
        console.log("Leave credited successfully");
    } catch (error) {
        console.log(error);
    }
});