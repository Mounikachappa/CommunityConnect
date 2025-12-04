import { Thread, ThreadType, ThreadStatus, Vendor, Store } from './types';

export const MOCK_THREADS: Thread[] = [
  {
    id: '1',
    title: '🚨 Urgent: Water Supply Disruption in Block C',
    author: 'Rahul Sharma',
    unit: 'C-302',
    type: ThreadType.RWA_ISSUE,
    status: ThreadStatus.OPEN,
    timestamp: '2 hrs ago',
    content: 'The water pressure has been extremely low since this morning. Has anyone else faced this? We need a quick resolution from the maintenance team.',
    comments: [
      { id: 'c1', author: 'Anita Roy', unit: 'C-304', content: 'Yes, same here. Not able to run the washing machine.', timestamp: '1 hr ago', avatar: 'https://picsum.photos/32/32?random=1' },
      { id: 'c2', author: 'RWA Admin', unit: 'Office', content: 'We are aware. The pump is being repaired and should be fixed by 4 PM.', timestamp: '30 mins ago', avatar: 'https://picsum.photos/32/32?random=2' },
      { id: 'c3', author: 'Rahul Sharma', unit: 'C-302', content: 'Thanks for the update. Please notify once done.', timestamp: '10 mins ago', avatar: 'https://picsum.photos/32/32?random=3' },
      { id: 'c4', author: 'Vikram Singh', unit: 'B-505', content: 'Is Block B affected too?', timestamp: '5 mins ago', avatar: 'https://picsum.photos/32/32?random=4' }
    ],
    poll: {
      id: 'p1',
      question: 'Should we upgrade the backup pump?',
      totalVotes: 45,
      options: [
        { label: 'Yes, upgrade', votes: 35 },
        { label: 'No, repair only', votes: 10 }
      ]
    }
  },
  {
    id: '2',
    title: 'Parking Lot Allocation Dispute',
    author: 'Suresh Raina',
    unit: 'B-102',
    type: ThreadType.RWA_ISSUE,
    status: ThreadStatus.IN_PROGRESS,
    timestamp: '5 hrs ago',
    content: 'My designated spot B-102 is constantly occupied by visitor cars. Security is not taking action despite multiple complaints.',
    comments: [
       { id: 'c21', author: 'Security Head', unit: 'Gate 1', content: 'We have clamped the vehicle. New sticker system starting tomorrow.', timestamp: '1 hr ago', avatar: 'https://picsum.photos/32/32?random=5' }
    ],
  },
  {
    id: '3',
    title: '✨ Diwali Mela 2025: Volunteers Needed',
    author: 'Cultural Comm.',
    unit: 'Admin',
    type: ThreadType.EVENT,
    status: ThreadStatus.OPEN,
    timestamp: '1 day ago',
    content: 'Calling for volunteers for the upcoming Diwali Mela. We need people for decoration, food stalls, and crowd management. Lets make it grand!',
    comments: [
       { id: 'c31', author: 'Priya K.', unit: 'A-404', content: 'I can handle the Rangoli competition.', timestamp: '4 hrs ago', avatar: 'https://picsum.photos/32/32?random=6' },
       { id: 'c32', author: 'Rohan M.', unit: 'A-004', content: 'I will sponsor the prizes for kids.', timestamp: '2 hrs ago', avatar: 'https://picsum.photos/32/32?random=24' }
    ],
  },
  {
    id: '4',
    title: 'Stray Dog Menace near Gate 2',
    author: 'Priya K.',
    unit: 'A-404',
    type: ThreadType.RWA_ISSUE,
    status: ThreadStatus.OPEN,
    timestamp: '3 hrs ago',
    content: 'A pack of stray dogs chased a delivery guy today. We need to contact the municipality for relocation or sterilization.',
    comments: [],
  },
  {
    id: '5',
    title: 'Gym Equipment Maintenance',
    author: 'Fitness Club',
    unit: 'Clubhouse',
    type: ThreadType.GENERAL,
    status: ThreadStatus.RESOLVED,
    timestamp: '2 days ago',
    content: 'The treadmill #2 has been repaired and is back in service.',
    comments: [],
  },
  {
    id: '6',
    title: '🔑 Lost Keys found in Park',
    author: 'Sneha Gupta',
    unit: 'A-101',
    type: ThreadType.LOST_FOUND,
    status: ThreadStatus.RESOLVED,
    timestamp: '1 day ago',
    content: 'Found a set of car keys (Honda) on the bench near the kids play area. Handed over to security.',
    comments: [
      { id: 'c4', author: 'Vikram Singh', unit: 'B-505', content: 'Oh! Those might be mine. I will check with security.', timestamp: '20 hrs ago', avatar: 'https://picsum.photos/32/32?random=4' },
      { id: 'c5', author: 'Vikram Singh', unit: 'B-505', content: 'Got them. Thanks Sneha!', timestamp: '19 hrs ago', avatar: 'https://picsum.photos/32/32?random=4' }
    ]
  },
  {
    id: '7',
    title: 'Yoga Classes Starting Next Week',
    author: 'Yoga Master',
    unit: 'Clubhouse',
    type: ThreadType.EVENT,
    status: ThreadStatus.OPEN,
    timestamp: '3 days ago',
    content: 'Morning batch starts at 6 AM. Evening batch at 7 PM. Register at the office.',
    comments: []
  }
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Reliable Plumbers Co.',
    category: 'Plumber',
    contact: '+91 98765 43210',
    rating: 4.8,
    reviewCount: 42,
    usedByCount: 156,
    imageUrl: 'https://picsum.photos/400/300?random=10',
    reviews: [
      { id: 'r1', author: 'Mrs. Verma', unit: 'D-202', rating: 5, text: 'Very professional and came on time. Fixed the leak instantly.' },
      { id: 'r2', author: 'Mr. Khan', unit: 'A-105', rating: 4, text: 'Good work but slightly expensive.' }
    ]
  },
  {
    id: 'v2',
    name: 'Sparkle Clean Maids',
    category: 'Maid Agency',
    contact: '+91 98989 89898',
    rating: 4.2,
    reviewCount: 28,
    usedByCount: 89,
    imageUrl: 'https://picsum.photos/400/300?random=11',
    reviews: [
      { id: 'r3', author: 'Priya S.', unit: 'C-901', rating: 5, text: 'Provided a very good backup maid when our regular one was on leave.' }
    ]
  },
  {
    id: 'v3',
    name: 'A-1 Electric Works',
    category: 'Electrician',
    contact: '+91 91234 56789',
    rating: 4.5,
    reviewCount: 15,
    usedByCount: 45,
    imageUrl: 'https://picsum.photos/400/300?random=12',
    reviews: []
  }
];

export const MOCK_STORES: Store[] = [
  {
    id: 's1',
    name: "Auntie's Kitchen",
    ownerName: 'Mrs. Dsouza',
    unit: 'B-202',
    category: 'Home Bakery',
    imageUrl: 'https://picsum.photos/400/300?random=20',
    products: [
      { id: 'p1', name: 'Chocolate Truffle Cake (1kg)', price: 800, imageUrl: 'https://picsum.photos/100/100?random=21' },
      { id: 'p2', name: 'Cupcakes (Box of 6)', price: 350, imageUrl: 'https://picsum.photos/100/100?random=22' },
      { id: 'p3', name: 'Sourdough Bread', price: 200, imageUrl: 'https://picsum.photos/100/100?random=23' }
    ]
  },
  {
    id: 's2',
    name: "Rohan's Organic Farm",
    ownerName: 'Rohan M.',
    unit: 'A-004',
    category: 'Fresh Produce',
    imageUrl: 'https://picsum.photos/400/300?random=24',
    products: [
      { id: 'p4', name: 'Fresh Spinach (Bundle)', price: 40, imageUrl: 'https://picsum.photos/100/100?random=25' },
      { id: 'p5', name: 'Organic Tomatoes (1kg)', price: 80, imageUrl: 'https://picsum.photos/100/100?random=26' }
    ]
  }
];