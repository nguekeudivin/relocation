<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'purpose',
        'disk',
        'path',
        'url',
        'size_bytes',
        'mime_type',
        'assetable_type',
        'assetable_id',
    ];

    public function assetable()
    {
        return $this->morphTo();
    }

    public function deleteWithFile(): bool|null
    {
        if ($this->path && Storage::disk($this->disk)->exists($this->path)) {
            Storage::disk($this->disk)->delete($this->path);
        }

        return $this->delete();
    }

    public static function makePublic($file, $folder, $purpose){
        $disk = 'public';
        $path = $file->store($folder, $disk);

        return [
            'name'       => $file->getClientOriginalName(),
            'mime_type'  => $file->getClientMimeType(),
            'path'       => $path,
            'url'        => Storage::disk($disk)->url($path),
            'purpose'    => $purpose,
            'size_bytes' => $file->getSize(),
        ];
    }

    public static function getPlaceholderAvatar($gender) {

        $position = random_int(1,15);
        if($gender == 'female')
            $position = random_int(1,10);

        return [
                'name' => 'Avatar',
                'mime_type' => 'image/webp',
                'path' => '',
                'url' => url("avatar/{$gender}/avatar-{$gender}-{$position}.webp"),
                'purpose' => 'image',
        ];
    }
}
