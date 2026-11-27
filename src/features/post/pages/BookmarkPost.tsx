import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    Bookmark,
    BookmarkX,
    Heart,
    MessageCircle,
} from "lucide-react";
import { postServices } from "../../../services/postServices";
import { Link } from "react-router";

export default function BookmarkPost() {
    const [expandedPosts, setExpandedPosts] = useState({});
    const queryClient = useQueryClient();

    // 1. Fetch bookmarked posts
    const { data, isPending, isError } = useQuery({
        queryKey: ["bookmarks"],
        queryFn: () => postServices.bookmarkPost(),
    });

    const bookmarks = data?.data?.bookmarkedPosts || data?.data || [];

    // 2. Remove from bookmarks mutation
    const { mutate: removeBookmark, isPending: isRemoving } = useMutation({
        mutationFn: (postId: string) => postServices.togglePostBookmark(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    const toggleExpand = (postId: string) => {
        setExpandedPosts((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-2xl space-y-5">

                {/* Page Header */}
                <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-white px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-blue-50 hover:text-blue-900"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Saved Posts</h1>
                            <p className="text-xs text-gray-500">
                                Posts you&apos;ve bookmarked for later
                            </p>
                        </div>
                    </div>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900">
                        {bookmarks.length} {bookmarks.length === 1 ? "Post" : "Posts"}
                    </span>
                </div>

                {/* Loading Skeletons */}
                {isPending && (
                    <div className="space-y-4">
                        {[1, 2].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                                    <div className="h-4 w-32 rounded bg-gray-200" />
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="h-3 w-full rounded bg-gray-200" />
                                    <div className="h-3 w-3/4 rounded bg-gray-200" />
                                </div>
                                <div className="mt-4 h-64 w-full rounded-xl bg-gray-200" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
                        Failed to load bookmarked posts. Please try refreshing the page.
                    </div>
                )}

                {/* Empty State */}
                {!isPending && !isError && bookmarks.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-blue-200 bg-white px-6 py-14 text-center shadow-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-900">
                            <Bookmark size={26} />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-gray-900">
                            No saved posts yet
                        </h3>
                        <p className="mt-1 max-w-xs text-sm text-gray-500">
                            Tap the options menu on any post in your feed and hit Save to see
                            it here.
                        </p>
                        {/* <Link
              to="/"
              className="mt-5 rounded-lg bg-blue-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Explore Feed
            </Link> */}
                    </div>
                )}

                {/* Bookmarked Posts List */}
                {!isPending && !isError && bookmarks.length > 0 && (
                    <div className="space-y-4">
                        {bookmarks.map((post) => (
                            <article
                                key={post._id}
                                className="w-full overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm"
                            >
                                {/* Post Header */}
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={post?.author?.account?.avatar?.url}
                                            alt={post?.author?.account?.username || "User"}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <p className="font-semibold text-gray-900">
                                            {post?.author?.account?.username}
                                        </p>
                                    </div>

                                    {/* Unsave Button */}
                                    <button
                                        type="button"
                                        disabled={isRemoving}
                                        onClick={() => removeBookmark(post._id)}
                                        title="Remove from bookmarks"
                                        className="flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-1.5 text-xs font-semibold text-blue-900 transition hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                                    >
                                        <BookmarkX size={15} />
                                        <span>Unsave</span>
                                    </button>
                                </div>

                                {/* Post Caption */}
                                {post?.content && (
                                    <div className="px-4 pb-4">
                                        <p className="whitespace-pre-line text-sm text-gray-800">
                                            {post.content.length > 200 ? (
                                                <>
                                                    {expandedPosts[post._id]
                                                        ? post.content
                                                        : `${post.content.substring(0, 200)}...`}{" "}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleExpand(post._id)}
                                                        className="font-semibold text-blue-800 hover:underline"
                                                    >
                                                        {expandedPosts[post._id] ? "less" : "more"}
                                                    </button>
                                                </>
                                            ) : (
                                                post.content
                                            )}
                                        </p>
                                    </div>
                                )}

                                {/* Post Image */}
                                {post?.images?.length > 0 && (
                                    <img
                                        src={post.images[0]?.url}
                                        alt="Bookmarked post"
                                        className="h-[400px] w-full object-cover"
                                    />
                                )}

                                {/* Post Stats Footer */}
                                <div className="flex items-center gap-6 border-t border-gray-100 px-4 py-3">
                                    <span className="flex items-center gap-1.5 text-sm text-gray-700">
                                        {
                                            post?.isLiked ? <Heart size={20} fill='red' strokeWidth={0} /> : <Heart size={20} />
                                        }
                                        <span>{post?.likes ?? 0}</span>
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm text-gray-700">
                                        <MessageCircle size={18} />
                                        <span>{post?.comments ?? 0}</span>
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}