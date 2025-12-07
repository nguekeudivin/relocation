<?php

namespace App\Http\Controllers\Slot;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UpdateSlot extends Controller
{
    public function __invoke(Request $request, $id)
    {
    
        // ✅ Validate input
        $validator = Validator::make($request->all(), [
            'user_id'  => 'sometimes|exists:users,id',
            'date'     => 'sometimes|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Données invalides.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();
            DB::commit();

            return response()->json([]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'status'  => 'error',
                'message' => 'Une erreur est survenue lors de la mise à jour de la réunion.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
