<?php
// No PHP logic here; just serving HTML. You can add session/auth if needed.
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WhatsApp Ban Checker</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="background"></div>
    
    <div class="container">
        <div class="header">
            <div class="team-name">⟨ TEAM XOST ⟩</div>
            <div class="logo">📱</div>
            <div class="ban-status" id="headerStatus">READY TO CHECK</div>
        </div>

        <div class="content">
            <div class="input-section">
                <div class="input-wrapper">
                    <input 
                        type="tel" 
                        id="phone" 
                        placeholder="+62 857-9866-39..." 
                        maxlength="20"
                    >
                </div>
                <p class="error" id="error"></p>
            </div>

            <button class="btn-primary" id="checkBtn" onclick="checkBan()">Check Status</button>

            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p class="loading-text">Checking ban status...</p>
            </div>

            <div class="result" id="result"></div>
        </div>
    </div>

    <div class="footer">Powered by Team Xost</div>

    <script src="script.js"></script>
</body>
</html>
