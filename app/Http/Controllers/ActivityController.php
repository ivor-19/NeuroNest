<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function addActivity(Request $request){
        $request->validate([
            'user' => 'required|string',
            'type' => 'required|string',
            'action' => 'required|string|max:255',
            'details' => 'required|string',
          
           ]);
    
        $activity = Activity::create($request->all());
        return back()->with([
            'success' => 'Successfully added to recent actvity',
            'activity' => $activity
        ]);

    }
}
