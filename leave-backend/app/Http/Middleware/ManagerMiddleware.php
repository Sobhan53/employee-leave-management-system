<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ManagerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // 🚨 Check if user is logged in AND is manager
        if (!auth()->check() || auth()->user()->role !== 'manager') {
            return response()->json([
                'error' => 'Access denied. Manager only.'
            ], 403);
        }

        return $next($request);
    }
}