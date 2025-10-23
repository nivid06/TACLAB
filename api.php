<?php
/**
 * TACLAB Analytics API
 * Real-time visitor tracking and email collection system
 */

// Enable CORS for local development and production
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Data files
$dataDir = __DIR__ . '/data';
$visitorsFile = $dataDir . '/visitors.json';
$emailsFile = $dataDir . '/emails.json';
$statsFile = $dataDir . '/stats.json';

// Create data directory if it doesn't exist
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Initialize files if they don't exist
if (!file_exists($visitorsFile)) {
    file_put_contents($visitorsFile, json_encode([]));
}
if (!file_exists($emailsFile)) {
    file_put_contents($emailsFile, json_encode([]));
}
if (!file_exists($statsFile)) {
    file_put_contents($statsFile, json_encode([
        'total_visitors' => 0,
        'total_emails' => 0,
        'total_coupons' => 0,
        'last_updated' => date('Y-m-d H:i:s')
    ]));
}

// Get request action
$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

// Helper function to read JSON file
function readJsonFile($file) {
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    return json_decode($content, true) ?: [];
}

// Helper function to write JSON file
function writeJsonFile($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

// Helper function to get client IP
function getClientIP() {
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if(isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}

// Handle different actions
switch ($action) {
    
    // Track a new visitor
    case 'track_visitor':
        if ($method === 'POST') {
            $visitors = readJsonFile($visitorsFile);
            $stats = readJsonFile($statsFile);
            
            $visitorData = [
                'id' => 'V' . (count($visitors) + 1),
                'ip' => getClientIP(),
                'timestamp' => date('c'),
                'date' => date('Y-m-d H:i:s'),
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
                'referrer' => $_SERVER['HTTP_REFERER'] ?? 'Direct'
            ];
            
            $visitors[] = $visitorData;
            $stats['total_visitors'] = count($visitors);
            $stats['last_updated'] = date('Y-m-d H:i:s');
            
            writeJsonFile($visitorsFile, $visitors);
            writeJsonFile($statsFile, $stats);
            
            echo json_encode([
                'success' => true,
                'message' => 'Visitor tracked',
                'visitor_id' => $visitorData['id'],
                'total_visitors' => $stats['total_visitors']
            ]);
        }
        break;
    
    // Submit email and generate coupon
    case 'submit_email':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $email = isset($input['email']) ? filter_var($input['email'], FILTER_SANITIZE_EMAIL) : '';
            
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid email address'
                ]);
                break;
            }
            
            $emails = readJsonFile($emailsFile);
            $stats = readJsonFile($statsFile);
            
            // Check if email already exists
            foreach ($emails as $existing) {
                if ($existing['email'] === $email) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Email already registered',
                        'coupon_code' => $existing['coupon_code'],
                        'already_registered' => true
                    ]);
                    exit();
                }
            }
            
            // Generate unique coupon code
            $couponCode = 'WELCOME20' . strtoupper(substr(md5($email . time()), 0, 4));
            
            $emailData = [
                'email' => $email,
                'coupon_code' => $couponCode,
                'timestamp' => date('c'),
                'date' => date('Y-m-d H:i:s'),
                'ip' => getClientIP(),
                'used' => false
            ];
            
            $emails[] = $emailData;
            $stats['total_emails'] = count($emails);
            $stats['total_coupons'] = count($emails);
            $stats['last_updated'] = date('Y-m-d H:i:s');
            
            writeJsonFile($emailsFile, $emails);
            writeJsonFile($statsFile, $stats);
            
            echo json_encode([
                'success' => true,
                'message' => 'Email registered successfully',
                'coupon_code' => $couponCode,
                'already_registered' => false
            ]);
        }
        break;
    
    // Get all statistics
    case 'get_stats':
        if ($method === 'GET') {
            $stats = readJsonFile($statsFile);
            $visitors = readJsonFile($visitorsFile);
            $emails = readJsonFile($emailsFile);
            
            // Get visitors from last 7 days for chart
            $sevenDaysAgo = strtotime('-7 days');
            $dailyVisitors = array_fill(0, 7, 0);
            $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            
            foreach ($visitors as $visitor) {
                $visitTime = strtotime($visitor['timestamp']);
                if ($visitTime >= $sevenDaysAgo) {
                    $dayIndex = (int)date('N', $visitTime) - 1; // 1-7 to 0-6
                    if ($dayIndex >= 0 && $dayIndex < 7) {
                        $dailyVisitors[$dayIndex]++;
                    }
                }
            }
            
            echo json_encode([
                'success' => true,
                'stats' => [
                    'total_visitors' => count($visitors),
                    'total_emails' => count($emails),
                    'total_coupons' => count($emails),
                    'last_updated' => $stats['last_updated']
                ],
                'daily_visitors' => $dailyVisitors,
                'recent_visitors' => array_slice(array_reverse($visitors), 0, 10)
            ]);
        }
        break;
    
    // Get email subscribers list
    case 'get_emails':
        if ($method === 'GET') {
            $emails = readJsonFile($emailsFile);
            
            // Sort by most recent first
            usort($emails, function($a, $b) {
                return strtotime($b['timestamp']) - strtotime($a['timestamp']);
            });
            
            echo json_encode([
                'success' => true,
                'emails' => $emails,
                'total' => count($emails)
            ]);
        }
        break;
    
    // Health check
    case 'health':
        echo json_encode([
            'success' => true,
            'message' => 'TACLAB Analytics API is running',
            'timestamp' => date('Y-m-d H:i:s'),
            'php_version' => phpversion()
        ]);
        break;
    
    default:
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid action',
            'available_actions' => [
                'track_visitor' => 'POST - Track a new visitor',
                'submit_email' => 'POST - Submit email and get coupon',
                'get_stats' => 'GET - Get all statistics',
                'get_emails' => 'GET - Get email subscribers list',
                'health' => 'GET - API health check'
            ]
        ]);
        break;
}
?>

