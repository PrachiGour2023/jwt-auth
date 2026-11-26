export interface UserProfileState {
    firstName: string;
    lastName: string;
    bio: string;
    countryCode: string;
    phoneNumber: string;
    dob: string;
    location: string
}

export interface ProfileResponse {
    data?: UserProfileState & {
        coverImage?: { url?: string },
        account?: { avatar?: { url?: string } },
        bio: string,
        dob: string,
        countryCode: string,
        firstName: string,
        lastName: string,
        phoneNumber: string
    }
}