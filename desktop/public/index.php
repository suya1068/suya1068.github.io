<?php
$app = require __DIR__ . '/../bootstrap/app.php';

$ip = get_client_ip_server();

$app->run();
