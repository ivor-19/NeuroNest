<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuleCompletion extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'module_id', 'is_done'];
    
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
    
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
    
   
}
