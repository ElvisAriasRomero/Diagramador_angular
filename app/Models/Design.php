<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Design extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'name', 'canvas_data'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function elements()
    {
        return $this->hasMany(Element::class);
    }
}
