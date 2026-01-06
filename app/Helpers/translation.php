<?php

if (!function_exists('t')) {
    /**
     * Translate a key or literal text using JSON dictionaries in resources/lang.
     *
     * @param string $key       The key or literal text
     * @param array $params     Optional parameters for interpolation (:param)
     * @param string|null $lang Optional language code ('fr', 'en', 'de'), default = app locale
     * @return string
     */
    function t(string $key, array $params = [], ?string $lang = null): string
    {
        return __($key, $params, $lang);
    }
}
