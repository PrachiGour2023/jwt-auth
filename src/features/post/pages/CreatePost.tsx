import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postServices } from '../../../services/postServices';
import { useState } from 'react';
import type { ProfileResponse } from '../../dashboard/pages/type';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

const CreatePost = () => {

    const navigate = useNavigate();
    const [images, setImages] = useState<File[]>([]);
    const [content, setContent] = useState<string>('');
    const queryClient = useQueryClient();
    const profileData = queryClient.getQueryData<ProfileResponse>(['profile'])

    const { mutate, isPending, isError, error: apiError } = useMutation({
        mutationFn: postServices.createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            setContent("");
            setImages([]);
            navigate("/dashboard")
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (images.length === 5) return;
        const selectFiles = Array.from(e.target.files ?? []);
        setImages((prev) => [...prev, ...selectFiles]);
        e.target.value = ""
    }

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("content", content);
        images.forEach((image) => formData.append("images", image))
        mutate(formData)
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">

                {/* Card Header */}
                <div className="flex items-center border-b border-gray-100 gap-3 px-6 py-4">
                    <Link
                        to="/"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-blue-50 hover:text-blue-900"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Create Post</h2>
                        <p className="text-xs text-gray-500">Share with us what you have in your mind</p>
                    </div>
                </div>

                <div className="space-y-5 p-6">
                    {/* User Profile Row */}
                    <div className="flex items-center gap-3">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX17MoywpLOvoaXdvS41rAOKhR-Uq7Xd0Rzocjx5cJRg&s=10"
                            alt="User avatar"
                            className="h-12 w-12 rounded-full border border-blue-100 object-cover"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {profileData?.data?.account?.username}
                            </h3>
                            <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                Public
                            </span>
                        </div>
                    </div>

                    {/* Post Content Input */}
                    {isError && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {apiError.message}
                        </div>
                    )}
                    <div>
                        <textarea
                            rows={5}
                            placeholder="What's on your mind? Share an update, project, or idea..."
                            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    {/* Image Upload & Preview Grid (Up to 6 Images) */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">
                                Add Photos
                            </span>
                            <span className="text-xs font-medium text-gray-500">
                                {images.length} / 5 images
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {
                                images.map((file, index) => {
                                    return (
                                        <div key={index} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                disabled={isPending}
                                                onClick={() => removeImage(index)}
                                                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs text-white transition hover:bg-black/80"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )
                                })
                            }

                            {/* Add Image Trigger Tile (Hide this when 6 images are selected) */}
                            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/40 text-blue-800 transition hover:border-blue-400 hover:bg-blue-50">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold">
                                    +
                                </span>
                                <span className="text-xs font-medium">Add Photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    disabled={isPending}
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-6 py-4">
                    <p className="text-xs text-gray-500">
                        PNG, JPG or WEBP (max 5 images)
                    </p>
                    <div className="flex items-center gap-3">
                        {/* <button
                            type="button"
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                            Cancel
                        </button> */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="rounded-lg bg-blue-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                "Post"
                            )}

                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CreatePost