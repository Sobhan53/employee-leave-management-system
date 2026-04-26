<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // ✅ IMPORTANT

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // ✅ ADD HasApiTokens

    protected $fillable = [
        'name',
        'email',
        'password',
        'role' // ✅ ADD THIS
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ✅ Relationship (optional but important)
    public function leaves()
    {
        return $this->hasMany(LeaveRequest::class);
    }
}