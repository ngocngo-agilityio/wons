import Link from 'next/link';

// Constants
import { ROUTES } from '@/constants';

// Components
import { Button, Heading, Text } from '../common';

const NotFoundComponent = () => (
  <section className="text-center h-full flex justify-center items-center flex-col">
    <Heading title="Not Found" className="text-6xl" />
    <Text text="Could not find requested resource" className="mt-4" />
    <Link
      href={ROUTES.DASHBOARD}
      style={{ textDecoration: 'underline', textAlign: 'center' }}
    >
      <Button color="primary" className="mt-4">
        Return Home
      </Button>
    </Link>
  </section>
);

export default NotFoundComponent;
