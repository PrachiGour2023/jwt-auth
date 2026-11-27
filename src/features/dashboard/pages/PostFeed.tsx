import { useState } from 'react';
import { Bookmark, BookmarkCheck, Heart, MessageCircle, Ellipsis, Plus, Trash } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postServices } from '../../../services/postServices';
import { timeAgo } from '../components/TimeFormat';
import { userServices } from '../../../services/userServices';
import ImageCarousel from '../../../components/ui/ImageCarousel';

const PostFeed = () => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [more, setMore] = useState(false);
    const queryClient = useQueryClient();

    const { data: profileData } = useQuery({
        queryFn: () => userServices.userProfile(),
        queryKey: ["profile"]
    })

    const {
        data: allPosts,
        isPending: isPostsPending,
    } = useQuery({
        queryKey: ['allPosts'],
        queryFn: () => postServices.getAllPost(),
    });

    const { mutate: deletePost } = useMutation({
        mutationFn: (id: string) => postServices.deletePost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allPosts"] });
        }
    })

    const { mutate: toggleBookmark } = useMutation({
        mutationFn: (id: string) => postServices.togglePostBookmark(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allPosts"] })
        }
    })

    const { mutate: toggleLike, isPending } = useMutation({
        mutationFn: (id: string) => postServices.likeunlikePost(id),
        onSettled: () => {
            return queryClient.invalidateQueries({ queryKey: ["allPosts"] })
        }
    })

    const { mutate: toggleFollow, isPending: isPendingLike } = useMutation({
        mutationFn: (id: string) => postServices.followunfollowUser(id),
        onSettled: () => {
            return queryClient.invalidateQueries({ queryKey: ["allPosts"] })
        }
    })

    const sortedPost = [...(allPosts?.data?.data?.posts ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return (
        <section className="flex-1 space-y-4">
            {isPostsPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : sortedPost.map((post: any) => {
                const isLiked = isPending ? !post.isLiked : post.isLiked;
                const likesCount = isPending
                    ? post.likes + (isLiked ? 1 : -1)
                    : post.likes;

                return (
                    <article
                        key={post._id}
                        className="w-full rounded-2xl border border-blue-200 bg-white shadow-sm"
                    >
                        {/* Post Header */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                        post?.author?.account?.avatar?.url ||
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX17MoywpLOvoaXdvS41rAOKhR-Uq7Xd0Rzocjx5cJRg&s=10"
                                    }
                                    alt="user"
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                                <div className='flex flex-col'>
                                    <p className="font-semibold text-gray-900">
                                        {post?.author?.account?.username}
                                    </p>
                                    <span className='text-gray-600 text-xs'>{timeAgo(post?.createdAt)}</span>
                                </div>
                            </div>

                            {/* Three-Dots Dropdown */}
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenMenuId((prev) => (prev === post._id ? null : post._id))
                                    }

                                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition hover:bg-blue-50 hover:text-blue-900"
                                >
                                    <Ellipsis size={20} />
                                </button>

                                {openMenuId === post._id && (
                                    <div className="absolute right-0 z-20 mt-1.5 w-44 rounded-xl border border-blue-100 bg-white py-1.5 shadow-lg">
                                        {post?.author.owner !== profileData?.data?.owner && <button
                                            type="button"
                                            onClick={() => {
                                                toggleFollow(post?.author?.account?._id);
                                                setOpenMenuId(null);
                                            }}
                                            className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-900"
                                        >
                                            <Plus size={16} />
                                            <span>Follow</span>
                                        </button>}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                toggleBookmark(post._id);
                                                setOpenMenuId(null);
                                            }}
                                            className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-900"
                                        >
                                            {
                                                post?.isBookmarked ? (
                                                    <>
                                                        <BookmarkCheck size={16} />
                                                        <span>Saved</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Bookmark size={16} />
                                                        <span>Save</span>
                                                    </>
                                                )
                                            }

                                        </button>

                                        {post?.author.owner === profileData?.data?.owner && (
                                            <>
                                                <hr className="my-1 border-gray-100" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        deletePost(post._id);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                >
                                                    <Trash size={16} />
                                                    <span>Delete</span>
                                                </button>
                                            </>
                                        )
                                        }
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Post Caption */}
                        <div className="px-4 pb-4">
                            <span className="text-sm text-gray-800">
                                {
                                    post?.content?.length > 200 && !more ? (
                                        <>
                                            {post.content.substring(0, 200)}...
                                            <button className='text-blue-900' onClick={() => setMore(true)}>more</button>
                                        </>
                                    ) : (
                                        post?.content
                                    )
                                }
                            </span>
                        </div>

                        {/* Post Image */}
                        {post?.images?.length > 0 && (
                            post?.images?.length > 1 ? (
                                <ImageCarousel slides={post?.images} autoPlay={true} interval={4000} />
                            ) : (
                                <img
                                    src={post.images[0]?.url}
                                    alt="Post content"
                                    className="h-[400px] w-full object-cover"
                                />
                            )
                        )}

                        {/* Likes & Comments */}
                        <div className="flex items-center gap-6 p-4">
                            <button
                                type="button"
                                className="flex items-center gap-1.5 text-sm text-gray-700 transition hover:text-blue-800 cursor-pointer"
                                onClick={() => toggleLike(post._id)}
                            >
                                {
                                    isLiked ? <Heart size={20} fill='red' strokeWidth={0} /> : <Heart size={20} />
                                }
                                <span>{likesCount}</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-1.5 text-sm text-gray-700 transition hover:text-blue-800"
                            >
                                <MessageCircle size={20} />
                                <span>{post?.comments}</span>
                            </button>
                        </div>
                    </article>
                )
            })}
        </section>
    )
}

export default PostFeed