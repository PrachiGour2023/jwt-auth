import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext'
import { useNavigate } from 'react-router';
import { userServices } from '../../../services/userServices';
import Navbar from '../../common/pages/Navbar';
import { useQuery } from '@tanstack/react-query';
import { postServices } from '../../../services/postServices';

const imgs = 'data:image/jpeg;base64,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'

const OverviewTab = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const {
    data: profile,
    isPending: isProfilePending,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userServices.userProfile(),
  });

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
    await logout();
    navigate('/login')
  }

  console.log(allPosts);


  return (
    <div>
      <header className='flex justify-around bg-blue-800 text-white py-4'>
        <Navbar />
        <button onClick={handleLogout} className='border-1 px-5 py-0.5 rounded-md border-blue-300'>Logout</button>
      </header>
      <main className='flex w-full h-screen space-x-3 p-5'>
        <section className="w-full max-w-sm lg:max-w-xs h-fit overflow-hidden rounded-2xl border border-blue-200 bg-white">
          {/* Cover Image */}
          <div className="h-24 sm:h-28 w-full overflow-hidden">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8r881Y9yt4XmqJCQY7yZrdHHQuGFr_PyTrapfqVY4tw&s=10"
              alt="Cover"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Profile Content */}
          <div className="px-4 pb-5">
            {/* Avatar: negative margin pulls it over the cover without breaking layout */}
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX17MoywpLOvoaXdvS41rAOKhR-Uq7Xd0Rzocjx5cJRg&s=10"
              alt="Profile"
              className="-mt-10 sm:-mt-12 h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white object-cover shadow-sm"
            />

            <div className="mt-3 space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold truncate">
                {profile?.firstName} {profile?.lastName}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Expert in react, next, cicd, typescript, javascript and llm api keys
              </p>
              <button className="mt-2 w-full sm:w-auto rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition">
                Update Profile
              </button>
            </div>
          </div>
        </section>
        <section className='flex-1'>
          <div className='w-full h-fit overflow-hidden rounded-2xl border border-blue-200 bg-white'>
            <div className='flex space-x-2 p-3'>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX17MoywpLOvoaXdvS41rAOKhR-Uq7Xd0Rzocjx5cJRg&s=10"
                className='w-10 h-10 rounded-full object-cover'
              />
              <p>Nency Tyagi</p>
            </div>
            <img src={imgs} className='w-full h-[400px] object-cover' />
            <span>helloo</span>
          </div>
        </section>
        <section className='w-80 space-y-2'>
            <div className='flex border-1 border-blue-300 rounded-2xl p-3 space-x-5'>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX17MoywpLOvoaXdvS41rAOKhR-Uq7Xd0Rzocjx5cJRg&s=10"
                className='w-10 h-10 rounded-full object-cover'
              />
              <button className='text-blue-900 font-bold text-lg'>Create Post</button>
            </div>
            <div className='flex border-1 border-blue-300 rounded-2xl p-3 space-x-5'>
              <span className='w-10 h-10'>🔖</span>
              <button className='text-blue-900 font-bold text-lg'>Show Bookmarks</button>
            </div>
        </section>
      </main>
    </div>
  )
}

export default OverviewTab