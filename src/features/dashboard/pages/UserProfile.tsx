import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { userServices } from '../../../services/userServices';

const UserProfile = () => {

    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => userServices.userProfile(),
        staleTime: 1000 * 60 * 1
    })

    return (
        <section className="w-full shrink-0 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm lg:sticky lg:top-20 lg:w-72">
            {/* Cover Image */}
            <div className="h-24 w-full overflow-hidden sm:h-28">
                <img
                    src={profile?.data?.coverImage?.url}
                    alt="Cover"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Profile Content */}
            <div className="px-4 pb-5">
                <img
                    src= {profile?.data?.account?.avatar?.url}
                    alt="Profile"
                    className="-mt-10 h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm sm:-mt-12 sm:h-24 sm:w-24"
                />

                <div className="mt-3 space-y-2">
                    <h3 className="truncate text-xl font-bold text-gray-900">
                        {profile?.data?.account?.username}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                        {profile?.data?.bio}
                    </p>
                    <p>
                        {profile?.data?.location}
                    </p>
                    <Link to={'/update-user-profile'} className="mt-2 w-full rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800">
                        Update Profile
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default UserProfile