<?php

namespace App\Services;

use ReflectionClass;
use ReflectionMethod;
use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Relations\Relation;

class ReflectionHelper
{
    public static function getModelClass($model)
    {
        return "App\\Models\\" . $model;
    }

    public static function getModelFromClass($class)
    {
        return  Arr::last(explode("\\", $class));
    }

    public static function getRelationClass($model, $relationName)
    {
        // We get the model class.
        $modelClass = ReflectionHelper::getModelClass($model);

        // We load the reflection of this model class to look for its method.
        $reflection = new ReflectionClass($modelClass);
        $relationInstance = $reflection->getMethod($relationName)->invoke(new $modelClass());


        if (is_subclass_of(get_class($relationInstance), Relation::class)) {
            return get_class($relationInstance->getRelated());
        } else {
            return null;
        }
    }
}
