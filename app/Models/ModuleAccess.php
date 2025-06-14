<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleAccess extends Model
{
    protected $table = 'module_access';
    
    protected $fillable = [
        'module_id',
        'class_instructor_id', 
        'is_accessible'
    ];

    protected $casts = [
        'is_accessible' => 'boolean'
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function classInstructor()
    {
        return $this->belongsTo(ClassInstructor::class);
    }
}
