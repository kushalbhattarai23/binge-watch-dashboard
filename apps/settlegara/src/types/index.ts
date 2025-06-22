
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Network {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdBy: string;
  createdAt: string;
  invitePending: string[]; // email addresses
}

export interface BillParticipant {
  userId: string;
  amount: number;
  paid: number;
  owes: number;
}

export interface Bill {
  id: string;
  title: string;
  description?: string;
  totalAmount: number;
  createdBy: string;
  createdAt: string;
  networkId?: string;
  participants: BillParticipant[];
  category: string;
  settled: boolean;
}

export interface Notification {
  id: string;
  type: 'invitation' | 'bill_added' | 'payment_reminder' | 'bill_settled';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionRequired?: boolean;
  relatedId?: string; // bill or network id
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}
