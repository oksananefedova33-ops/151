<?php
declare(strict_types=1);
session_start();
header('Content-Type: application/json; charset=utf-8');

$root = dirname(__DIR__, 2);
$configFile = $root . '/admin/config.php';

function readCanvasWH(string $configFile): array {
    if (is_file($configFile)) {
        require $configFile;
    }
    $w = defined('CANVAS_W') ? (int)CANVAS_W : 1200;
    $h = defined('CANVAS_H') ? (int)CANVAS_H : 1500;
    return [$w, $h];
}

function writeCanvasH(string $configFile, int $newH): bool {
    if (!is_file($configFile)) return false;
    $src = file_get_contents($configFile);
    if ($src === false) return false;

    // Убедимся, что есть CANVAS_W
    if (!preg_match("/define\\s*\\(\\s*'CANVAS_W'\\s*,\\s*\\d+\\s*\\)\\s*;/", $src)) {
        // Вставим после ADMIN_PASSWORD либо в конец
        if (preg_match("/define\\s*\\(\\s*'ADMIN_PASSWORD'[^;]*;\\s*/", $src, $m, PREG_OFFSET_CAPTURE)) {
            $pos = $m[0][1] + strlen($m[0][0]);
            $src = substr($src, 0, $pos) . "\nif (!defined('CANVAS_W')) define('CANVAS_W', 1200);" . substr($src, $pos);
        } else {
            $src .= "\nif (!defined('CANVAS_W')) define('CANVAS_W', 1200);\n";
        }
    }

    // Обновим/вставим CANVAS_H
    if (preg_match("/define\\s*\\(\\s*'CANVAS_H'\\s*,\\s*\\d+\\s*\\)\\s*;/", $src)) {
        $src = preg_replace("/define\\s*\\(\\s*'CANVAS_H'\\s*,\\s*\\d+\\s*\\)\\s*;/", "define('CANVAS_H', {$newH});", $src, 1);
    } else {
        $src .= "\nif (!defined('CANVAS_H')) define('CANVAS_H', {$newH});\n";
    }

    // Пишем файл
    $ok = (bool)file_put_contents($configFile, $src);
    if ($ok) @chmod($configFile, 0664);
    return $ok;
}

$action = $_REQUEST['action'] ?? 'get';

if ($action === 'get') {
    [$w, $h] = readCanvasWH($configFile);
    echo json_encode(['ok' => true, 'width' => $w, 'height' => $h]);
    return;
}

if ($action === 'set') {
    // Разрешаем изменять только авторизованному администратору
    $isAdmin = $_SESSION['is_admin'] ?? false;
    if (!$isAdmin) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Недостаточно прав (войдите через /admin).']);
        return;
    }
    $height = (int)($_POST['height'] ?? 0);
    if ($height < 1500 || $height > 10000) {
        echo json_encode(['ok' => false, 'error' => 'Высота вне диапазона 1500…10000']);
        return;
    }
    $ok = writeCanvasH($configFile, $height);
    echo json_encode(['ok' => $ok, 'saved' => $ok ? $height : null]);
    return;
}

echo json_encode(['ok' => false, 'error' => 'Unknown action']);
