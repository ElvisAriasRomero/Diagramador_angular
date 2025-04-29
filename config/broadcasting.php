<?php

return [

    'default' => env('BROADCAST_DRIVER', 'pusher'),

    'connections' => [

        'pusher' => [
            'driver' => 'pusher',
            'key' => 'app-key',
            'secret' => 'app-secret',
            'app_id' => 'app-id',
            'options' => [
                'host' => 'localhost',
                'port' => 6001,
                'scheme' => 'http',
                'encrypted' => false,
                'useTLS' => false,
            ],
            'client_options' => [
                // Guzzle client options
                'verify' => false,
            ],
        ],

        'ably' => [
            'driver' => 'ably',
            'key' => env('ABLY_KEY'),
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],

];
