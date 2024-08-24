let orderCreatedHtml =`
<head>
    <title>Order Created</title>
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
            <h2>Order Created</h2>
        </div>
        <div class="content">
            <p>Hello, {{username}}!</p>
            <p>Thank you for placing order. We're excited to have you on board and look forward to serving you.</p>
            <p> Your order id : {{orderId}} </p>            
        </div>  
        
    </div>
</body>
</html>
`
export default  orderCreatedHtml;