
import { User, Network, Bill, Notification } from '../types';

export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  }
];

export const sampleNetworks: Network[] = [
  {
    id: '1',
    name: 'College Friends',
    description: 'Our college friend group expenses',
    members: sampleUsers,
    createdBy: '1',
    createdAt: '2024-01-15',
    invitePending: ['sarah@example.com']
  },
  {
    id: '2',
    name: 'Roommates',
    description: 'Apartment expenses and utilities',
    members: [sampleUsers[0], sampleUsers[1]],
    createdBy: '1',
    createdAt: '2024-02-01',
    invitePending: []
  }
];

export const sampleBills: Bill[] = [
  {
    id: '1',
    title: 'Dinner at Italian Restaurant',
    description: 'Group dinner for birthday celebration',
    totalAmount: 120.00,
    createdBy: '1',
    createdAt: '2024-06-18',
    networkId: '1',
    participants: [
      { userId: '1', amount: 40.00, paid: 120.00, owes: 0 },
      { userId: '2', amount: 40.00, paid: 0, owes: 40.00 },
      { userId: '3', amount: 40.00, paid: 0, owes: 40.00 }
    ],
    category: 'Food & Dining',
    settled: false
  },
  {
    id: '2',
    title: 'Monthly Electricity Bill',
    description: 'Apartment electricity for June',
    totalAmount: 85.50,
    createdBy: '2',
    createdAt: '2024-06-15',
    networkId: '2',
    participants: [
      { userId: '1', amount: 42.75, paid: 0, owes: 42.75 },
      { userId: '2', amount: 42.75, paid: 85.50, owes: 0 }
    ],
    category: 'Utilities',
    settled: false
  }
];

export const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'invitation',
    title: 'Network Invitation',
    message: 'John Doe invited you to join "College Friends" network',
    createdAt: '2024-06-20',
    read: false,
    actionRequired: true,
    relatedId: '1'
  },
  {
    id: '2',
    type: 'bill_added',
    title: 'New Bill Added',
    message: 'Jane Smith added "Monthly Electricity Bill" - You owe $42.75',
    createdAt: '2024-06-19',
    read: false,
    actionRequired: false,
    relatedId: '2'
  },
  {
    id: '3',
    type: 'payment_reminder',
    title: 'Payment Reminder',
    message: 'You have pending payments totaling $82.75',
    createdAt: '2024-06-18',
    read: true,
    actionRequired: false
  }
];
