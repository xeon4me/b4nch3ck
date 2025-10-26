<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow CORS for local testing

require_once '../config.php'; // Include config for DB and encryption

$numero = $_GET['numero'] ?? '';

if (!$numero || !preg_match('/^[0-9]{10,15}$/', $numero)) {
    echo json_encode(['error' => 'Invalid phone number']);
    exit;
}

// Check DB for cached result
$stmt = $pdo->prepare("SELECT * FROM ban_checks WHERE phone = ?");
$stmt->execute([$numero]);
$cached = $stmt->fetch(PDO::FETCH_ASSOC);

if ($cached) {
    // Decrypt and return cached data
    $data = json_decode(decrypt($cached['data']), true);
    echo json_encode($data);
    exit;
}

// Fetch from external API
$externalUrl = "https://consultas.cc/apis/whatsapp/checkban.php?numero=$numero";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,
