<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use Carbon\Carbon;

class LeaveController extends Controller
{
    // ==============================
    // Employee: Apply Leave
    // ==============================
    public function apply(Request $req)
    {
        $req->validate([
            'leave_type' => 'required|in:vacation,sick,casual',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:500'
        ]);

        // 🔥 Prevent overlapping leave
        $overlap = LeaveRequest::where('user_id', auth()->id())
            ->where('status', '!=', 'rejected')
            ->where(function ($q) use ($req) {
                $q->whereBetween('start_date', [$req->start_date, $req->end_date])
                  ->orWhereBetween('end_date', [$req->start_date, $req->end_date])
                  ->orWhere(function ($q2) use ($req) {
                      $q2->where('start_date', '<=', $req->start_date)
                         ->where('end_date', '>=', $req->end_date);
                  });
            })->exists();

        if ($overlap) {
            return response()->json([
                'error' => 'Leave already exists in this date range'
            ], 400);
        }

        $leave = LeaveRequest::create([
            'user_id' => auth()->id(),
            'leave_type' => $req->leave_type,
            'start_date' => $req->start_date,
            'end_date' => $req->end_date,
            'reason' => $req->reason,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Leave applied successfully',
            'data' => $leave
        ]);
    }

    // ==============================
    // Employee: My Leaves
    // ==============================
    public function myLeaves()
    {
        $leaves = LeaveRequest::where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json([
            'data' => $leaves
        ]);
    }

    // ==============================
    // Manager: ALL Leaves (🔥 IMPORTANT FIX)
    // ==============================
    public function index()
    {
        $leaves = LeaveRequest::with('user')
            ->latest()
            ->get();

        return response()->json([
            'data' => $leaves
        ]);
    }

    // ==============================
    // Manager: Pending Leaves
    // ==============================
    public function pendingLeaves()
    {
        $leaves = LeaveRequest::where('status', 'pending')
            ->with('user')
            ->latest()
            ->get();

        return response()->json([
            'data' => $leaves
        ]);
    }

    // ==============================
    // Manager: Update Status
    // ==============================
    public function updateStatus(Request $req, $id)
    {
        $req->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $leave = LeaveRequest::findOrFail($id);

        $leave->status = $req->status;

        // ✅ Save optional comment
        $leave->manager_comment = $req->comment ?? null;

        $leave->save();

        return response()->json([
            'message' => 'Leave updated successfully',
            'data' => $leave
        ]);
    }

    // ==============================
    // Employee: Leave Balance
    // ==============================
    public function balance()
    {
        $user = auth()->user();

        $totalLeaves = 20;

        $usedLeaves = LeaveRequest::where('user_id', $user->id)
            ->where('status', 'approved')
            ->get()
            ->sum(function ($leave) {
                return Carbon::parse($leave->start_date)
                    ->diffInDays(Carbon::parse($leave->end_date)) + 1;
            });

        $balance = $totalLeaves - $usedLeaves;

        return response()->json([
            'balance' => $balance
        ]);
    }
}

