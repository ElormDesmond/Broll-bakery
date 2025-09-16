<?php
// API endpoint disabled — frontend-only site. No backend available.
http_response_code(410);
header('Content-Type: application/json');
echo json_encode(['success' => false, 'message' => 'This API endpoint has been disabled. The site is frontend-only.']);
exit;
?>