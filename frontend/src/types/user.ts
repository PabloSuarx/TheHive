export interface Address {
    alias: string;
    street: string;
    city: string;
    state: string;
    countryState: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
}

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    avatar?: { url: string };
    address?: Address[];
    createdAt: string;
    updatedAt: string;
    jwt?: string;
}
