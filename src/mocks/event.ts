export const EVENT_MOCKS = {
  title: 'Test Event',
  status: 'active',
  location: 'New York',
  date: new Date('2024-10-14'),
  startTime: '10:00',
  endTime: '12:00',
  users_permissions_users: [1, 2],
};

export const EVENTS_MOCKS = [
  {
    id: 1,
    attributes: {
      title: 'Test Event',
      status: 'active',
      location: 'New York',
      date: new Date('2024-10-14'),
      startTime: '10:00',
      endTime: '12:00',
      users_permissions_users: [1, 2],
    },
  },

  {
    id: 2,
    attributes: {
      title: 'Implement Component',
      descriptions: 'Implement for all component',
      date: '2024-10-20T01:30:00Z',
      time: '2024-10-20T01:30:00Z',
      createdAt: '2024-10-22T09:46:11.546Z',
      updatedAt: '2024-10-22T09:46:16.769Z',
      publishedAt: '2024-10-22T09:46:16.768Z',
    },
  },
];

export const CALENDAR_TASKS_MOCK = {
  data: [
    {
      id: 1,
      attributes: {
        title: 'Create UT ',
        descriptions: 'Create Unit Test for Task Calendar',
        date: '2024-11-16T01:30:00Z',
        time: '2024-11-16T01:30:00Z',
        createdAt: '2024-10-22T09:44:44.023Z',
        updatedAt: '2024-11-01T04:00:32.600Z',
        publishedAt: '2024-10-22T09:44:45.347Z',
      },
    },
    {
      id: 2,
      attributes: {
        title: 'Implement Component',
        descriptions: 'Implement for all component',
        date: '2024-10-20T01:30:00Z',
        time: '2024-10-20T01:30:00Z',
        createdAt: '2024-10-22T09:46:11.546Z',
        updatedAt: '2024-10-22T09:46:16.769Z',
        publishedAt: '2024-10-22T09:46:16.768Z',
      },
    },
  ],
};

export const EVENTS_MOCKS_WIDTH_USERS_PERMISSIONS = {
  title: 'Test Event',
  status: 'active',
  location: 'New York',
  date: new Date('2024-10-14'),
  startTime: '10:00',
  endTime: '12:00',
  users_permissions_users: {
    data: [
      {
        id: 3,
        attributes: {
          username: 'superadmin',
          email: 'admin1@gmail.com',
          provider: 'local',
          confirmed: false,
          blocked: false,
          fullName: 'Super Admin',
          createdAt: '2024-08-28T04:29:52.000Z',
          updatedAt: '2024-10-11T02:14:38.208Z',
          avatar:
            'https://watermark.lovepik.com/photo/20211209/large/lovepik-japanese-fresh-girl-park-photo-picture_501698500.jpg',
        },
      },
    ],
  },
};

export const MOCK_EVENTS_FORM = [
  {
    status: 'free',
    location: '1254 Xo Viet Nge Tinh',
    visibility: 'public',
    createdAt: '2024-08-28T10:17:34.061Z',
    updatedAt: '2024-11-01T04:02:01.393Z',
    publishedAt: '2024-08-28T10:17:34.061Z',
    title: 'Kich off project',
    eventType: 'event',
    repeatSetting: 'no_repeat',
    notificationTime: 10,
    endTime: '2024-11-16T02:30:00Z',
    startTime: '2024-11-16T01:30:00Z',
    date: '2024-11-16T09:30:00.000Z',
    users_permissions_users: {
      data: [
        {
          id: 3,
          attributes: {
            username: 'superadmin',
            email: 'admin1@gmail.com',
            provider: 'local',
            confirmed: false,
            blocked: false,
            fullName: 'Super Admin',
            createdAt: '2024-08-28T04:29:52.000Z',
            updatedAt: '2024-10-11T02:14:38.208Z',
            avatar:
              'https://watermark.lovepik.com/photo/20211209/large/lovepik-japanese-fresh-girl-park-photo-picture_501698500.jpg',
          },
        },
      ],
    },
    id: 7,
    start: '2024-11-15T18:30:00.000Z',
    end: '2024-11-15T19:30:00.000Z',
  },
  {
    status: 'free',
    location: '1254 Xo Viet Nge Tinh',
    visibility: 'public',
    createdAt: '2024-08-28T10:25:03.721Z',
    updatedAt: '2024-11-01T04:01:49.984Z',
    publishedAt: '2024-08-28T10:25:03.719Z',
    title: 'Kich off project',
    eventType: 'event',
    repeatSetting: 'no_repeat',
    notificationTime: 10,
    endTime: '2024-11-04T02:30:00Z',
    startTime: '2024-11-04T01:30:00Z',
    date: '2024-11-04T09:30:00.000Z',
    users_permissions_users: {
      data: [
        {
          id: 3,
          attributes: {
            username: 'superadmin',
            email: 'admin1@gmail.com',
            provider: 'local',
            confirmed: false,
            blocked: false,
            fullName: 'Super Admin',
            createdAt: '2024-08-28T04:29:52.000Z',
            updatedAt: '2024-10-11T02:14:38.208Z',
            avatar:
              'https://watermark.lovepik.com/photo/20211209/large/lovepik-japanese-fresh-girl-park-photo-picture_501698500.jpg',
          },
        },
        {
          id: 4,
          attributes: {
            username: 'joinnee',
            email: 'user1@gmail.com',
            provider: 'local',
            confirmed: false,
            blocked: false,
            fullName: 'Join Nee',
            createdAt: '2024-08-28T04:30:57.996Z',
            updatedAt: '2024-10-11T02:16:10.599Z',
            avatar:
              'https://cdn.pixabay.com/photo/2024/05/21/15/32/beautiful-8778428_640.png',
          },
        },
      ],
    },
    id: 8,
    start: '2024-11-03T18:30:00.000Z',
    end: '2024-11-03T19:30:00.000Z',
  },
  {
    status: null,
    location: '',
    visibility: 'public',
    createdAt: '2024-11-05T04:22:20.494Z',
    updatedAt: '2024-11-05T04:22:20.494Z',
    publishedAt: '2024-11-05T04:22:20.491Z',
    title: 'Test',
    eventType: 'event',
    repeatSetting: 'no_repeat',
    notificationTime: 10,
    endTime: '2024-11-16T00:30:00.000Z',
    startTime: '2024-11-16T00:00:00.000Z',
    date: '2024-11-16T07:00:00.000Z',
    users_permissions_users: {
      data: [
        {
          id: 3,
          attributes: {
            username: 'superadmin',
            email: 'admin1@gmail.com',
            provider: 'local',
            confirmed: false,
            blocked: false,
            fullName: 'Super Admin',
            createdAt: '2024-08-28T04:29:52.000Z',
            updatedAt: '2024-10-11T02:14:38.208Z',
            avatar:
              'https://watermark.lovepik.com/photo/20211209/large/lovepik-japanese-fresh-girl-park-photo-picture_501698500.jpg',
          },
        },
      ],
    },
    id: 9,
    start: '2024-11-15T17:00:00.000Z',
    end: '2024-11-15T17:30:00.000Z',
  },
  {
    title: 'Create UT ',
    descriptions: 'Create Unit Test for Task Calendar',
    date: '2024-11-16T08:30:00.000Z',
    time: '2024-11-16T01:30:00Z',
    createdAt: '2024-10-22T09:44:44.023Z',
    updatedAt: '2024-11-01T04:00:32.600Z',
    publishedAt: '2024-10-22T09:44:45.347Z',
    id: 1,
    start: '2024-11-15T18:30:00.000Z',
    end: '2024-11-15T18:30:00.000Z',
  },
  {
    title: 'Implement Component',
    descriptions: 'Implement for all component',
    date: '2024-10-20T08:30:00.000Z',
    time: '2024-10-20T01:30:00Z',
    createdAt: '2024-10-22T09:46:11.546Z',
    updatedAt: '2024-10-22T09:46:16.769Z',
    publishedAt: '2024-10-22T09:46:16.768Z',
    id: 2,
    start: '2024-10-19T18:30:00.000Z',
    end: '2024-10-19T18:30:00.000Z',
  },
];
