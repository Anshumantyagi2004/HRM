export const notificationTemplate = ({
    username,
    title,
    message,
    type
}) => {

    return `
    
    <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        overflow: hidden;
    ">

        <div style="
            background: #111827;
            color: white;
            padding: 20px;
            text-align: center;
        ">
            <h2>HR Management Notification</h2>
        </div>

        <div style="padding: 25px;">

            <p>Hello <b>${username}</b>,</p>

            <p>
                You have received a new notification.
            </p>

            <div style="
                background: #f3f4f6;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
            ">

                <p>
                    <b>Type:</b> ${type}
                </p>

                <p>
                    <b>Title:</b> ${title}
                </p>

                <p>
                    <b>Message:</b>
                </p>

                <p>
                    ${message}
                </p>

            </div>

            <p style="margin-top: 30px;">
                Regards,<br/>
                HR Team
            </p>

        </div>

    </div>
    
    `;
};