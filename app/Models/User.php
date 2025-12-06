<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'address_id',
        'status',
        'password',
        'current_user_role_id',
    ];

    public const STATUSES = ['active', 'inactive', 'banned'];

    protected $appends = [
        'image',
        'name'
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role');
    }

    public function image()
    {
        return $this->morphOne(Asset::class, 'assetable');
    }

    public function getImageAttribute(){
        return Asset::where('assetable_type',User::class)->where('assetable_id', $this->id)->first();
    }

    public function getNameAttribute(){
        return $this->first_name.' '.$this->last_name;
    }

    public function user_roles()
    {
        return $this->hasMany(UserRole::class);
    }

    public function getPermissions()
    {
        if (! $this->relationLoaded('roles') || $this->roles->isEmpty() || ! $this->roles->every(fn ($role) => $role->relationLoaded('permissions'))) {
            $this->load('roles.permissions');
        }
        return $this->roles->pluck('permissions')->flatten()->unique('id')->pluck('name')->toArray();
    }

    public function attachRole($roleId, $data = [])
    {
        $this->roles()->attach($roleId, $data);
        if ($this->current_user_role_id === null) {
            $this->current_user_role_id = UserRole::where('role_id', $roleId)
                ->where('user_id', $this->id)
                ->first()
                ->id;

            $this->save();
        }
    }

    public function getProfilesAttribute()
    {
        $profiles = [];

        foreach ($this->user_roles as $userRole) {
            switch ($userRole->role->type) {
                case 'admin':
                    $profiles[] = [
                        'name'    => $this->first_name.' '.$this->last_name,
                        'label'   => $userRole->role->name,
                        'type'    => 'admin',
                        'role_id' => $userRole->id, // Scoped user_role
                    ];
                    break;

                default:
                    $profiles[] = [
                        'name'    => $this->first_name.' '.$this->last_name,
                        'label'   => $userRole->role->name,
                        'type'    => 'client',
                        'role_id' => $userRole->id, // Scoped user_role
                    ];
            }
        }

        // Ensure current profile is in the list
        $userProfileExist = collect($profiles)->contains(fn ($p) => $p['role_id'] == $this->current_user_role_id);

        if (!$userProfileExist && count($profiles) > 0) {
            $this->current_user_role_id = $profiles[0]['role_id'];
            $this->save();
        }

        return $profiles;
    }

    public static function getAdmin(){
        return User::whereHas('roles', function ($query) {
                        $query->where('code', 'admin');
                    })->first();
    }
}
