<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Element extends Model
{
    use HasFactory;

    protected $fillable = ['design_id', 'type', 'properties'];

    protected $casts = [
        'properties' => 'array',
    ];

    public function design()
    {
        return $this->belongsTo(Design::class);
    }
}
