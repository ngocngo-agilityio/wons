// Constants
import { ROLES } from '@/constants';

// Types
import {
  TasksState,
  TaskWithStringAssignees,
  TLabelStatus,
  Level,
} from '@/types';

export const MOCK_TASKS: TasksState = {
  todo: [
    {
      id: 1,
      attributes: {
        title: 'Dashboard Design',
        label: 'todo',
        level: Level.Low,
        description: 'Discussion for management dashboard ui design',
        createdAt: '2024-09-23T03:07:18.697Z',
        updatedAt: '2024-10-04T02:02:44.110Z',
        publishedAt: '2024-09-23T03:07:19.719Z',
        images: [
          'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-yellow_FMT_WHH?wid=1280&hei=492&fmt=p-jpg&qlt=80&.v=bjlYUjk1NXN2Uy9CTWFMaXBneUF0bEthL1VsNXgveGUwQ1JqNzA0ZHArbjRRVTNjZitXallzNXA5ZUIwM25xZHVqay8zY0s4VHBsVmhRS2dCdnNPUHBwYUdQQkdYL0crTjZtOXJzeHgrYU02WjdNRmRCc09Pek5waThFRitZTkR0NEZTY1VIaEpLYkJrOVY3am50SHB3PT0=&traceId=1',
          'https://product.hstatic.net/1000300544/product/iphone-12-purple-select-2021_c2f1208cec9f4dcdab82932a1cc87c85.png',
        ],
        assignees: {
          data: [
            {
              id: 4,
              attributes: {
                username: 'ngocngo',
                email: 'user1@gmail.com',
                fullName: 'Ngoc Ngo',
                role: ROLES[1],
                token: '',
                avatar:
                  'https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg',
                password: '',
              },
            },
            {
              id: 5,
              attributes: {
                username: 'user',
                email: 'user@gmail.com',
                fullName: 'User User',
                avatar:
                  'https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg',
                password: '',
                role: ROLES[1],
                token: '',
              },
            },
            {
              id: 9,
              attributes: {
                username: 'user34',
                email: 'user34@gmail.com',
                fullName: 'user',
                role: ROLES[1],
                token: '',
                avatar:
                  'https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg',
                password: '',
              },
            },
          ],
        },
      },
    },
  ],
  inProgress: [
    {
      id: 2,
      attributes: {
        title: 'API Development',
        description: 'Create APIs',
        label: 'inProgress',
        level: Level.Low,
        createdAt: '2024-09-23T03:07:18.697Z',
        updatedAt: '2024-10-04T02:02:44.110Z',
        publishedAt: '2024-09-23T03:07:19.719Z',
        assignees: {
          data: [
            {
              id: 4,
              attributes: {
                username: 'ngocngo',
                email: 'user1@gmail.com',
                fullName: 'Ngoc Ngo',
                role: ROLES[1],
                token: '',
                avatar:
                  'https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg',
                password: '',
              },
            },
            {
              id: 5,
              attributes: {
                username: 'user',
                email: 'user@gmail.com',
                fullName: 'User User',
                avatar:
                  'https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg',
                password: '',
                role: ROLES[1],
                token: '',
              },
            },
            {
              id: 9,
              attributes: {
                username: 'user34',
                email: 'user34@gmail.com',
                fullName: 'user',
                role: ROLES[1],
                token: '',
                avatar:
                  'https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg',
                password: '',
              },
            },
          ],
        },
      },
    },
  ],
  inReview: [],
  done: [],
};

export const MOCK_TASK_WITH_STRING_ASSIGNEES: TaskWithStringAssignees = {
  title: 'Test Task',
  label: 'inProgress',
  level: Level.Medium,
  description: 'This is a test task',
  createdAt: '2024-10-13T10:00:00Z',
  updatedAt: '2024-10-13T12:00:00Z',
  publishedAt: '2024-10-13T12:00:00Z',
  images: [
    'https://t3.ftcdn.net/jpg/00/92/53/56/360_F_92535664_IvFsQeHjBzfE6sD4VHdO8u5OHUSc6yHF.jpg',
    'https://media.istockphoto.com/id/627795510/photo/example.jpg?s=612x612&w=0&k=20&c=lpUf5rjPVd6Kl_M6heqC8sUncR4FLmtsRzeYdTr5X_I=',
  ],
  assignees: [1],
};

export const MOCK_DATA_TASKS_WITHOUT_STRAPI_MODEL = {
  title: 'Updated Task',
  label: 'inReview' as TLabelStatus,
  level: 'High' as Level,
  description: 'This is an updated test task',
  images: ['image1.png', 'image3.png'],
  assignees: {
    data: [
      {
        id: 4,
        attributes: {
          username: 'ngocngo',
          email: 'user1@gmail.com',
          fullName: 'Ngoc Ngo',
          role: ROLES[1],
          token: '',
          avatar:
            'https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg',
          password: '',
        },
      },
      {
        id: 5,
        attributes: {
          username: 'user',
          email: 'user@gmail.com',
          fullName: 'User User',
          avatar:
            'https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg',
          password: '',
          role: ROLES[1],
          token: '',
        },
      },
      {
        id: 9,
        attributes: {
          username: 'user34',
          email: 'user34@gmail.com',
          fullName: 'user',
          role: ROLES[1],
          token: '',
          avatar:
            'https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg',
          password: '',
        },
      },
    ],
  },
};
