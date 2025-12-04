export enum ThreadType {
  RWA_ISSUE = 'RWA Issue',
  LOST_FOUND = 'Lost & Found',
  GENERAL = 'General',
  EVENT = 'Event'
}

export enum ThreadStatus {
  OPEN = 'Open',
  RESOLVED = 'Resolved',
  IN_PROGRESS = 'In Progress'
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  unit: string;
}

export interface Poll {
  id: string;
  question: string;
  options: { label: string; votes: number }[];
  totalVotes: number;
}

export interface Thread {
  id: string;
  title: string;
  author: string;
  unit: string;
  type: ThreadType;
  status: ThreadStatus;
  content: string;
  timestamp: string;
  comments: Comment[];
  poll?: Poll;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  rating: number;
  reviewCount: number;
  usedByCount: number;
  imageUrl: string;
  reviews: { id: string; author: string; unit: string; rating: number; text: string }[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface Store {
  id: string;
  name: string;
  ownerName: string;
  unit: string;
  category: string;
  imageUrl: string;
  products: Product[];
}

export enum OrderStatus {
  NEW = 'New Order',
  IN_PROGRESS = 'In Progress',
  READY = 'Ready/Delivered'
}