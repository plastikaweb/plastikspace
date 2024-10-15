import { FormattingInput } from '../formatting';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const objectMocked: Record<string, any> = {
  id: 'kkk0000ads',
  name: 'TITLE',
  noFormatting: {
    child: {
      value: 12,
    },
  },
  text: {
    child: {
      value: 'value',
    },
  },
  link: 'www.example.com',
  time: '2021-09-01T02:10:06+00:00',
  image: 'thumb.png',
  percentage: 80,
  truthy: true,
  falsy: false,
  price: 3.08,
  custom: `---`,
} as const;

export type TypeMocked = FormattingInput<typeof objectMocked>;
