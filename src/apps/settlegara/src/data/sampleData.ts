
import { User, Network, Bill, Notification } from '../types';

export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  }
];

export const sampleNetworks: Network[] = [
  {
    id: '1',
    name: 'Roommates',
    description: 'House expenses and utilities',
    members: [sampleUsers[0], sampleUsers[1], sampleUsers[2]],
    createdBy: '1',
    createdAt: '2024-01-15',
    invitePending: ['newroommate@example.com']
  },
  {
    id: '2',
    name: 'Trip to Bali',
    description: 'Vacation expenses',
    members: [sampleUsers[0], sampleUsers[3]],
    createdBy: '1',
    createdAt: '2024-02-01',
    invitePending: []
  }
];

export const sampleBills: Bill[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    description: 'Weekly groceries from Whole Foods',
    totalAmount: 156.78,
    createdBy: '1',
    createdAt: '2024-01-20',
    networkId: '1',
    participants: [
      { userId: '1', amount: 52.26, paid: 156.78, owes: 0 },
      { userId: '2', amount: 52.26, paid: 0, owes: 52.26 },
      { userId: '3', amount: 52.26, paid: 0, owes: 52.26 }
    ],
    category: 'Food',
    settled: false
  },
  {
    id: '2',
    title: 'Electricity Bill',
    description: 'Monthly electricity bill',
    totalAmount: 89.50,
    createdBy: '2',
    createdAt: '2024-01-18',
    networkId: '1',
    participants: [
      { userId: '1', amount: 29.83, paid: 0, owes: 29.83 },
      { userId: '2', amount: 29.83, paid: 89.50, owes: 0 },
      { userId: '3', amount: 29.84, paid: 0, owes: 29.84 }
    ],
    category: 'Utilities',
    settled: false
  },
  {
    id: '3',
    title: 'Flight Tickets',
    description: 'Round trip tickets to Bali',
    totalAmount: 1200.00,
    createdBy: '1',
    createdAt: '2024-02-05',
    networkId: '2',
    participants: [
      { userId: '1', amount: 600.00, paid: 1200.00, owes: 0 },
      { userId: '4', amount: 600.00, paid: 0, owes: 600.00 }
    ],
    category: 'Travel',
    settled: true
  }
];

export const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'invitation',
    title: 'Network Invitation',
    message: 'You have been invited to join "Roommates" network',
    createdAt: '2024-01-20T10:30:00Z',
    read: false,
    actionRequired: true,
    relatedId: '1'
  },
  {
    id: '2',
    type: 'bill_added',
    title: 'New Bill Added',
    message: 'John added a new bill "Grocery Shopping" for $156.78',
    createdAt: '2024-01-20T09:15:00Z',
    read: true,
    actionRequired: false,
    relatedId: '1'
  },
  {
    id: '3',
    type: 'payment_reminder',
    title: 'Payment Reminder',
    message: 'You owe $52.26 for Grocery Shopping',
    createdAt: '2024-01-19T16:45:00Z',
    read: false,
    actionRequired: true,
    relatedId: '1'
  }
];
