<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TokenService
{

    /**
     *  Generate a token
     *  
     *  @param mixed $data 
     *  @param integer $expirationTime
     *  @return
     */
    static function generate($data, $expirationTime = null)
    { 
        $payload = [
            "iss" => "localhost",
            "iat" => time(),
            "data" => $data,
        ];

        if($expirationTime != null){
            $payload["exp"] = time() + $expirationTime;
        }

        return JWT::encode($payload, config('app.key'), "HS256");
    }

    static function decode($token)
    {
        try {
            $decoded = JWT::decode($token, new Key(config('app.key'),"HS256"));
            return $decoded->data;
        }catch(\Exception $e){
            return null;
        }
    }

}