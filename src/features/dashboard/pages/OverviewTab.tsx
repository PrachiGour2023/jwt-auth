import { useAuth } from '../../auth/context/AuthContext'
import { Link, useNavigate } from 'react-router';
import { userServices } from '../../../services/userServices';
import Navbar from '../../common/pages/Navbar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark, LogOut } from 'lucide-react';
import UserProfile from './UserProfile';
import type { ProfileResponse } from './type';
import PostFeed from './PostFeed';

const OverviewTab = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profileData } = useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: userServices.userProfile
  })

  const handleLogout = async () => {
    queryClient.clear();
    await logout();
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-blue-800 px-6 text-white shadow-sm">
        <Navbar />
        <div className="flex items-center gap-2 rounded-md border border-blue-300 px-5 py-1.5 text-sm font-medium transition hover:bg-blue-700">

          <button onClick={handleLogout}>
            Logout
          </button>
          <span>
            <LogOut size={16} />
          </span>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <main className="mx-auto flex max-w-7xl flex-col gap-5 p-5 lg:flex-row lg:items-start">
        {/* Left Section: Sticky Profile Card */}
        <UserProfile />

        {/* Middle Section: Scrollable Feed */}
        <PostFeed />


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

          <Link
            to={'/bookmarks'}
            className="flex w-full items-center gap-4 rounded-2xl border border-blue-200 bg-white p-3.5 text-left shadow-sm transition hover:bg-blue-50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-lg">
              <Bookmark />
            </span>
            <span className="text-base font-bold text-blue-900">Show Bookmarks</span>
          </Link>
        </section>

      </main>
    </div>
  )
}

export default OverviewTab