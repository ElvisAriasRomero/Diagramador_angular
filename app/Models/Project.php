<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Project extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'owner_id'];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function designs()
    {
        return $this->hasMany(Design::class);
    }

    public function collaborators()
    {
        return $this->hasMany(Collaborator::class);
    }
}
