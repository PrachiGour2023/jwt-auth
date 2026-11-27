import React, { useEffect, useState } from 'react'
import InputField from '../../auth/component/InputField'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userServices } from '../../../services/userServices'
import { useNavigate, Link } from 'react-router'
import type { ProfileResponse, UserProfileState } from './type'
import { ArrowLeft } from 'lucide-react';

const UpdateProfile = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [input, setInput] = useState<UserProfileState>({
        lastName: '',
        firstName: '',
        dob: '',
        bio: '',
        countryCode: '',
        phoneNumber: '',
        location: ''
    })
    const [coverImage, setCoverImage] = useState<string | null>(null)
    const [profileImage, setProfileImage] = useState<string | null>(null)

    const profileData = queryClient.getQueryData<ProfileResponse>(['profile'])

    useEffect(() => {
        if (profileData?.data) {
            const date = new Date(profileData?.data?.dob).toISOString().split("T")[0]
            setInput({
                firstName: profileData?.data?.firstName,
                lastName: profileData?.data?.lastName,
                dob: date,
                bio: profileData?.data?.bio,
                countryCode: profileData?.data?.countryCode,
                phoneNumber: profileData?.data?.phoneNumber,
                location: profileData?.data?.location
            })
            setCoverImage(profileData?.data?.coverImage?.url ?? null)
            setProfileImage(profileData?.data?.account?.avatar?.url ?? null)
        }
    }, [profileData])

    const { mutate: UpdateProfile, isPending, } = useMutation<unknown, Error, UserProfileState>({
        mutationFn: (data) => userServices.updateProfile(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profile'] });
            navigate('/dashboard')
        }
    })

    const { mutate: UpdateCoverImage, } = useMutation<unknown, Error, FormData>({
        mutationFn: (formData) => userServices.updateCoverImage(formData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profile'] });
            navigate('/dashboard')
        }
    })

    const { mutate: UpdateAvatar } = useMutation<unknown, Error, FormData>({
        mutationFn: (formData) => userServices.updateAvatar(formData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profile'] });
            navigate('/dashboard')
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        UpdateProfile(input)
    }

    const updateCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverImage(URL.createObjectURL(file))
        const formData = new FormData();
        formData.append('coverImage', file)
        UpdateCoverImage(formData)

    }

    const updateUserAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProfileImage(URL.createObjectURL(file));
        const formData = new FormData();
        formData.append('avatar', file);
        UpdateAvatar(formData)
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <form onSubmit={updateProfile} className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">

                {/* Card Header */}
                <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                    <Link
                        to="/"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-blue-50 hover:text-blue-900"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Update Profile</h2>
                        <p className="text-xs text-gray-500">Manage your personal details and profile appearance</p>
                    </div>
                </div>

                {/* Cover Image & Avatar Preview Section */}
                <div>
                    {/* Cover Image */}
                    <div className="group relative h-36 w-full bg-blue-100 sm:h-44">
                        <img
                            src={coverImage ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8r881Y9yt4XmqJCQY7yZrdHHQuGFr_PyTrapfqVY4tw&s=10"}
                            alt="Cover preview"
                            className="h-full w-full object-cover"
                        />
                        <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-black/80">
                            <span>📷</span>
                            <span>Change Cover</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={updateCoverImage}
                            />
                        </label>
                    </div>

                    {/* Overlapping Avatar */}
                    <div className="px-6">
                        <div className="relative -mt-12 inline-block sm:-mt-14">
                            <img
                                src={profileImage ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX17MoywpLOvoaXdvS41rAOKhR-Uq7Xd0Rzocjx5cJRg&s=10"}
                                alt="Avatar preview"
                                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md sm:h-28 sm:w-28"
                            />
                            <label
                                title="Change Avatar"
                                className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-900 text-xs text-white shadow-sm transition hover:bg-blue-800"
                            >
                                ✎
                                <input type="file" accept="image/*" className="hidden" onChange={updateUserAvatar} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-5 p-6">

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                First Name
                            </label>
                            <InputField
                                type="text"
                                name="firstName"
                                value={input?.firstName ?? ''}
                                placeholder="Enter first name"
                                handleChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                Last Name
                            </label>
                            <InputField
                                type="text"
                                name="lastName"
                                value={input.lastName ?? ''}
                                placeholder="Enter last name"
                                handleChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            rows={3}
                            value={input.bio ?? ''}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Tell people a little about yourself..."
                            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Country Code & Phone Number */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                            Phone Number
                        </label>
                        <div className="flex gap-3">
                            <div className='w-20 shrink-0'>
                                <InputField
                                    type='text'
                                    name='countryCode'
                                    placeholder='+91'
                                    value={input.countryCode ?? ''}
                                    handleChange={handleInputChange}
                                    className="text-center"
                                />
                            </div>
                            <div className='flex-1'>
                                <InputField
                                    type='tel'
                                    name="phoneNumber"
                                    placeholder="Enter phone number"
                                    value={input.phoneNumber ?? ''}
                                    handleChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date of Birth & Location */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                Date of Birth
                            </label>
                            <InputField
                                type='date'
                                name='dob'
                                value={input.dob}
                                handleChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                Location
                            </label>
                            <InputField
                                type='text'
                                name='location'
                                value={input.location}
                                placeholder='City, Country'
                                handleChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-4">
                    <button
                        type="button"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                            "Save Changes"
                        )}

                    </button>
                </div>

            </form>
        </div>
    )
}

export default UpdateProfile