<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $movieId = $request->query('movie_id');

        $comments = Comment::where('movie_id', $movieId)
            ->whereNull('parent_id')
            ->whereIn('status', ['pending', 'approved'])
            ->with(['replies' => function ($query) {
                $query->where('status', 'approved')->with('user');
            }, 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'movie_id' => 'required|integer',
            'name' => 'required|string|max:255|regex:/^[a-zA-Z\s]+$/',
            'message' => 'required|string|max:1000|regex:/^[a-zA-Z0-9\s]+$/',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check for more than 3 same letters in message
        if (preg_match('/(.)\1{3,}/', $request->message)) {
            return response()->json(['errors' => ['message' => ['Message cannot contain more than 3 consecutive same letters.']]], 422);
        }

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'movie_id' => $request->movie_id,
            'name' => $request->name,
            'message' => $request->message,
            'status' => 'pending', // Require approval
        ]);

        return response()->json($comment, 201);
    }

    public function reply(Request $request, $commentId)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $parentComment = Comment::findOrFail($commentId);

        $reply = Comment::create([
            'user_id' => Auth::id(),
            'movie_id' => $parentComment->movie_id,
            'name' => 'streaminga',
            'message' => $request->message,
            'status' => 'approved', // Admin replies are auto-approved
            'parent_id' => $commentId,
        ]);

        return response()->json($reply, 201);
    }

    public function adminIndex(Request $request)
    {
        $query = Comment::with(['user', 'replies']);

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Movie filter
        if ($request->has('movie_filter') && $request->movie_filter !== 'all') {
            $query->where('movie_id', $request->movie_filter);
        }

        // Status filter
        if ($request->has('status_filter') && $request->status_filter !== 'all') {
            $query->where('status', $request->status_filter);
        }

        // Date filter
        if ($request->has('date_filter') && $request->date_filter !== 'all') {
            $now = now();
            switch ($request->date_filter) {
                case 'week':
                    $query->where('created_at', '>=', $now->subWeek());
                    break;
                case 'month':
                    $query->where('created_at', '>=', $now->subMonth());
                    break;
                case 'year':
                    $query->where('created_at', '>=', $now->subYear());
                    break;
            }
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 10);
        $comments = $query->paginate($perPage);

        return response()->json($comments);
    }

    public function updateStatus(Request $request, $commentId)
    {
        $comment = Comment::findOrFail($commentId);
        $comment->status = $request->status;
        $comment->save();

        return response()->json($comment);
    }

    public function destroy($commentId)
    {
        $comment = Comment::findOrFail($commentId);
        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
