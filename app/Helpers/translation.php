<?php

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;

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
        $lang = $lang ?? App::getLocale();
        static $dictionaries = [];

        // Charger le dictionnaire de la langue si nécessaire
        if (!isset($dictionaries[$lang])) {
            $path = resource_path("lang/{$lang}.json");
            $dictionaries[$lang] = File::exists($path)
                ? json_decode(File::get($path), true)
                : [];
        }

        // Récupérer la traduction ou fallback sur la clé/literal
        $translation = $dictionaries[$lang][$key] ?? $key;

        // Remplacer les paramètres :param si présents
        foreach ($params as $paramKey => $value) {
            $translation = str_replace(":$paramKey", $value, $translation);
        }

        return $translation;
    }
}
