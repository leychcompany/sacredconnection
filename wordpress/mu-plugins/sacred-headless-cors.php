<?php
/**
 * Plugin Name: Sacred Connection Headless CORS
 * Description: Allows the Next.js storefront to call WooCommerce Store API with Cart-Token.
 * Version: 1.0.0
 * Author: Leych Company
 *
 * Install: copy this file to wp-content/mu-plugins/sacred-headless-cors.php
 * Then set NEXT_PUBLIC_SITE_URL / allowed origins below.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Allowed front-end origins (no trailing slash).
 */
function sacred_headless_allowed_origins() {
    return array(
        'http://localhost:3000',
        'https://sacredconnection.vercel.app',
        // Add production domain when ready, e.g. 'https://www.sacredconnection.com',
    );
}

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        $allowed = sacred_headless_allowed_origins();

        if ($origin && in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, Nonce, Cart-Token, X-WC-Store-API-Nonce');
            header('Access-Control-Expose-Headers: Nonce, Cart-Token, X-WC-Store-API-Nonce');
        }

        if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
            status_header(200);
            exit;
        }

        return $value;
    }, 15);
}, 15);
