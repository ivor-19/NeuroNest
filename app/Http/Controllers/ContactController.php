<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'contactNumber' => 'required|string|max:20',
            'emailAddress' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        Contact::create($validated);

        return redirect()->back()->with('success', 'Thank you for your message!');
    }

    public function index()
    {
        $contacts = Contact::select('id', 'firstName', 'lastName', 'contactNumber', 'emailAddress', 'message')
                          ->orderBy('created_at', 'desc')
                          ->get();
        
        return Inertia::render('Admin/ContactDash', [
            'contacts' => $contacts,
        ]);
    }

    public function destroy($id)
    {
        try {
            $contact = Contact::findOrFail($id);
            $contact->delete();

            return redirect()->back()->with('success', 'Contact deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete contact.');
        }
    }

    public function destroyMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:contacts,id',
        ]);

        try {
            Contact::whereIn('id', $validated['ids'])->delete();
            
            $count = count($validated['ids']);
            return redirect()->back()->with('success', "{$count} contact(s) deleted successfully!");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete contacts.');
        }
    }
}