import { useAuth } from '../../auth/context/AuthContext'
import { Link, useNavigate } from 'react-router';
import { userServices } from '../../../services/userServices';
import Navbar from '../../common/pages/Navbar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { postServices } from '../../../services/postServices';
import { Bookmark, ThumbsUp, MessageCircle, Ellipsis, Plus, Trash } from 'lucide-react';
import UserProfile from './UserProfile';
import type { ProfileResponse } from './type';
import { useState } from 'react';
import { timeAgo } from '../components/TimeFormat';

const OverviewTab = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openMenuId, setOpenMenuId] = useState(null);
  const { data: profileData } = useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: userServices.userProfile
  })

  const {
    data: allPosts,
    isPending: isPostsPending,
    isError: isPostsError,
    error: postsError,
  } = useQuery({
    queryKey: ['allPosts'],
    queryFn: () => postServices.getAllPost(),
  });

  const handleLogout = async () => {
    queryClient.clear();
    await logout();
    navigate('/login')
  }

  console.log(allPosts);

  const sortedPost = [...(allPosts?.data?.data?.posts ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-blue-800 px-6 text-white shadow-sm">
        <Navbar />
        <button
          onClick={handleLogout}
          className="rounded-md border border-blue-300 px-5 py-1.5 text-sm font-medium transition hover:bg-blue-700"
        >
          Logout
        </button>
      </header>

      {/* Main 3-Column Layout */}
      <main className="mx-auto flex max-w-7xl flex-col gap-5 p-5 lg:flex-row lg:items-start">

        {/* Left Section: Sticky Profile Card */}
        <UserProfile />

        {/* Middle Section: Scrollable Feed */}
        <section className="flex-1 space-y-4">
          {sortedPost.map((post: any) => {
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
                        <button
                          type="button"
                          onClick={() => {
                            // handleFollow(post?.author?.account?._id);
                            setOpenMenuId(null);
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-900"
                        >
                          <Plus size={16} />
                          <span>Follow</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            // handleSave(post._id);
                            setOpenMenuId(null);
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-900"
                        >
                          <Bookmark size={16} />
                          <span>Save</span>
                        </button>

                        <hr className="my-1 border-gray-100" />

                        <button
                          type="button"
                          onClick={() => {
                            // handleDelete(post._id);
                            setOpenMenuId(null);
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Caption */}
                <div className="px-4 pb-4">
                  <span className="text-sm text-gray-800">
                    {post?.content?.length > 200
                      ? `${post.content.substring(0, 200)}...`
                      : post?.content}
                  </span>

                </div>

                {/* Post Image */}
                {post?.images?.length > 0 && (
                  <img
                    src={post.images[0]?.url}
                    alt="Post content"
                    className="h-[400px] w-full object-cover"
                  />
                )}

                {/* Likes & Comments */}
                <div className="flex items-center gap-6 p-4">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-sm text-gray-700 transition hover:text-blue-800"
                  >
                    <ThumbsUp size={20} />
                    <span>{post?.likes}</span>
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

        {/* Right Section: Sticky Quick Actions */}
        <section className="w-full shrink-0 space-y-3 lg:sticky lg:top-20 lg:w-72">
          <Link
            to="/create-post"
            className="flex items-center gap-4 rounded-2xl border border-blue-200 bg-white p-3.5 shadow-sm transition hover:bg-blue-50"
          >
            <img
              src={profileData?.data?.account?.avatar?.url}
              alt="Create post"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-base font-bold text-blue-900">Create Post</span>
          </Link>

          <button
            type="button"
            className="flex w-full items-center gap-4 rounded-2xl border border-blue-200 bg-white p-3.5 text-left shadow-sm transition hover:bg-blue-50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-lg">
              <Bookmark />
            </span>
            <span className="text-base font-bold text-blue-900">Show Bookmarks</span>
          </button>
        </section>

      </main>
    </div>
  )
}

export default OverviewTab