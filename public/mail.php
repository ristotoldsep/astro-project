<?php
/**
 * mail.php — QiNutritionist contact form handler
 *
 * Expects a multipart/form-data POST.
 * Returns JSON: { "success": true } | { "success": false, "error": "…" }
 *
 * Deploy inside the Astro `public/` folder so Apache serves it directly.
 * Requires PHP with mail() enabled (standard on most Apache shared hosts).
 */

declare(strict_types=1);

/* ── Configuration ─────────────────────────────────────────────────── */

const RECIPIENT_EMAIL = 'randveeyoga@gmail.com';
// const RECIPIENT_EMAIL = 'ristotoldsep@gmail.com';
const RECIPIENT_NAME  = 'Anett — QiNutritionist';
const SUBJECT_PREFIX  = 'QiNutritionist Enquiry';
const SENDER_EMAIL    = 'noreply@paavli.ee';  // must match the server's sending domain

/**
 * Allowed origins — add your production domain here.
 * Leave the array empty to skip origin checking (not recommended).
 */
const ALLOWED_ORIGINS = [
    'https://qinutritionist.com',
    'https://www.qinutritionist.com',
    'https://qinutritionist.paavli.ee',
];

/* ── Bootstrap ──────────────────────────────────────────────────────── */

header('Content-Type: application/json; charset=utf-8');

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'error' => 'Method not allowed.']));
}

// Origin check (relaxed in dev / when list is empty)
if (!empty(ALLOWED_ORIGINS)) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (!in_array(rtrim($origin, '/'), ALLOWED_ORIGINS, true)) {
        http_response_code(403);
        exit(json_encode(['success' => false, 'error' => 'Forbidden.']));
    }
}

/* ── Honeypot ───────────────────────────────────────────────────────── */

$honeypot = trim($_POST['website'] ?? '');
if ($honeypot !== '') {
    // Silently succeed so bots don't know they were caught
    exit(json_encode(['success' => true]));
}

/* ── Helpers ────────────────────────────────────────────────────────── */

function sanitize(string $input): string
{
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function isValidEmail(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function jsonError(string $message, int $status = 400): never
{
    http_response_code($status);
    exit(json_encode(['success' => false, 'error' => $message]));
}

/* ── Input validation ───────────────────────────────────────────────── */

$name     = sanitize($_POST['name']     ?? '');
$email    = sanitize($_POST['email']    ?? '');
$phone    = sanitize($_POST['phone']    ?? '');
$interest = sanitize($_POST['interest'] ?? '');
$message  = sanitize($_POST['message']  ?? '');

if (empty($name) || mb_strlen($name) < 2) {
    jsonError('Please provide your full name.');
}

if (empty($email) || !isValidEmail($email)) {
    jsonError('Please provide a valid email address.');
}

if (empty($interest)) {
    jsonError('Please select a topic of interest.');
}

// Guard against header injection in name / email fields
foreach ([$name, $email] as $field) {
    if (preg_match('/[\r\n]/', $field)) {
        jsonError('Invalid characters detected.');
    }
}

/* ── Build email ────────────────────────────────────────────────────── */

$subject = SUBJECT_PREFIX . ': ' . $interest;

$body  = "New enquiry from the QiNutritionist website\n";
$body .= str_repeat('─', 48) . "\n\n";
$body .= "Name:     {$name}\n";
$body .= "Email:    {$email}\n";
$body .= "Phone:    " . ($phone ?: '—') . "\n";
$body .= "Topic:    {$interest}\n\n";
$body .= "Message:\n" . ($message ?: '(no message provided)') . "\n\n";
$body .= str_repeat('─', 48) . "\n";
$body .= "Sent from: " . ($_SERVER['HTTP_HOST'] ?? 'qinutritionist.com') . "\n";
$body .= "Date:      " . date('Y-m-d H:i:s T') . "\n";

// RFC 2822 headers
// From must be an address on THIS server's domain — using the visitor's address
// causes SPF failures and lands mail in spam.
$headers  = "From: " . RECIPIENT_NAME . " <" . SENDER_EMAIL . ">\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . PHP_VERSION . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

/* ── Send ───────────────────────────────────────────────────────────── */

$sent = mail(RECIPIENT_EMAIL, $subject, $body, $headers);

if (!$sent) {
    // Log the failure server-side if possible
    error_log('[QiNutritionist] mail() failed for ' . $email);
    jsonError('Could not send the email. Please contact us directly.', 500);
}

echo json_encode(['success' => true]);
