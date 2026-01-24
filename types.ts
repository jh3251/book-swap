
export interface UserProfile {
  uid: string;
  displayName: string;
  username?: string;
  email: string;
  photoURL?: string;
  phone?: string;
  createdAt: number;
}

export interface LocationInfo {
  divisionId: string;
  districtId: string;
  upazilaId: string;
  divisionName: string;
  districtName: string;
  upazilaName: string;
}

export interface BookListing {
  id: string;
  title: string;
  author: string;
  subject: string;
  condition: 'Like New' | 'Good' | 'Fair' | 'Poor' | 'Donation';
  price: number;
  contactPhone: string;
  description: string;
  sellerId: string;
  sellerName: string;
  location: LocationInfo;
  createdAt: number;
  imageUrl?: string;
}

export interface Division {
  id: string;
  name: string;
  nameBn: string;
}

export interface District {
  id: string;
  divisionId: string;
  name: string;
  nameBn: string;
}

export interface Upazila {
  id: string;
  districtId: string;
  name: string;
  nameBn: string;
}
