<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeaveController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Requires Login)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // ==============================
    // Auth Routes
    // ==============================
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // ==============================
    // Employee Routes
    // ==============================
    Route::post('/apply-leave', [LeaveController::class, 'apply']);
    Route::get('/my-leaves', [LeaveController::class, 'myLeaves']);
    Route::get('/balance', [LeaveController::class, 'balance']);

    // ==============================
    // Manager Routes (Protected by role)
    // ==============================
    Route::middleware('manager')->group(function () {

        // 🔥 IMPORTANT (used for stats + all data)
        Route::get('/leaves', [LeaveController::class, 'index']);

        // Only pending requests
        Route::get('/pending-leaves', [LeaveController::class, 'pendingLeaves']);

        // Approve / Reject
        Route::post('/leave-status/{id}', [LeaveController::class, 'updateStatus']);
    });

});

