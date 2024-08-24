module.exports = `

<head>
    <title>Welcome to Our Service</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Welcome to How2MC GSM</h2>
        </div>
        <div class="content">
            <p>Hello, {{username}}!</p>
            <p>Thank you for logging in. We're excited to have you on board and look forward to serving you.</p>
            <a href="https://pterodactyl.how2mc.xyz" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; margin: 20px 0; border-radius: 5px; text-decoration: none;">Visit Our Website</a>
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to contact us at <a href="mailto:alphaxd2023@gmail.com">alphaxd2023@gmail.com</a>.</p>
        </div>
    </div>

`