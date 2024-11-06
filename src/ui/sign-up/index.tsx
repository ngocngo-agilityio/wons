'use client';

// Libs
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

// Actions
import { authenticate, signUp } from '@/actions';

// Hooks
import { useToast } from '@/hooks';

// Types
import { ISignUpFormData } from '@/types';

// Constants
import { IMAGES, MESSAGES, ROUTES } from '@/constants';

// Components
import { SignUpForm as SignUpFormComponent } from '@/components';

const SignUpForm = (): JSX.Element => {
  const [isPending, setIsPending] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleSignUp = useCallback(
    async (formData: ISignUpFormData) => {
      setIsPending(true);

      // Call API to create a new account
      const signUpRes = await signUp({
        ...formData,
        avatar: IMAGES.AVATAR_DEFAULT,
      });

      const { error: signUpError } = signUpRes || {};

      if (signUpError) {
        setIsPending(false);

        return showToast({
          description: signUpError,
          status: MESSAGES.STATUS.ERROR,
        });
      }

      const { email, password } = formData;
      const loginRes = await authenticate({ identifier: email, password });

      if (loginRes) {
        setIsPending(false);

        return showToast({
          description: loginRes,
          status: MESSAGES.STATUS.ERROR,
        });
      }

      // After sign up successfully, navigate to Account Success page
      return router.push(ROUTES.ACCOUNT_SUCCESS);
    },
    [router, showToast],
  );

  return <SignUpFormComponent isPending={isPending} onSubmit={handleSignUp} />;
};

export default SignUpForm;
