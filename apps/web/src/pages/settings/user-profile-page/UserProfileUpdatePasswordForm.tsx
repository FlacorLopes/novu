import { showNotification } from '@mantine/notifications';
import { Button, IconOutlineLockPerson, PasswordInput } from '@novu/design-system';
import { checkIsResponseError, IResponseError } from '@novu/shared';
import { api } from '@novu/shared-web';
import * as Sentry from '@sentry/react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { css } from '../../../styled-system/css';
import { Stack } from '../../../styled-system/jsx';
import { PasswordRequirementPopover } from '../../auth/components/PasswordRequirementPopover';
import { SHARED_PASSWORD_INPUT_REGISTER_OPTIONS } from './UserProfilePasswordSidebar.shared';

type UserProfileUpdatePasswordFormProps = {
  onSuccess?: () => void;
};

interface IPasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const UserProfileUpdatePasswordForm: React.FC<UserProfileUpdatePasswordFormProps> = ({ onSuccess }) => {
  const { isLoading, mutateAsync, error, isError } = useMutation<
    IPasswordUpdateData,
    IResponseError,
    IPasswordUpdateData
  >((data) => api.post(`/v1/auth/update-password`, data));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmitPasswords = async (data: IPasswordUpdateData) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });

      return;
    }

    try {
      await mutateAsync(data);

      showNotification({
        message: 'Password was set successfully',
        color: 'green',
      });
      reset();
      onSuccess?.();
    } catch (err: unknown) {
      let errMessage = 'Error while setting password';
      if (checkIsResponseError(err)) {
        if (err.statusCode !== 400) {
          Sentry.captureException(err);
        }

        errMessage = `${errMessage}: ${err.message}`;
      }

      showNotification({
        message: errMessage,
        color: 'red',
      });
    }

    return true;
  };

  const isSubmitDisabled = !isValid;

  return (
    <form noValidate name="reset-form" onSubmit={handleSubmit(onSubmitPasswords)}>
      <Stack direction={'column'} gap={'200'}>
        <PasswordInput
          error={errors.currentPassword?.message}
          {...register('currentPassword', {
            required: SHARED_PASSWORD_INPUT_REGISTER_OPTIONS.required,
          })}
          required
          label="Current Password"
          placeholder="Enter current password"
          data-test-id="password-current"
        />
        <PasswordRequirementPopover control={control} passwordInputName="newPassword">
          <PasswordInput
            error={errors.newPassword?.message}
            {...register('newPassword', {
              ...SHARED_PASSWORD_INPUT_REGISTER_OPTIONS,
            })}
            required
            label="Password"
            placeholder="Type your new password"
            data-test-id="password-new"
          />
        </PasswordRequirementPopover>
        <PasswordInput
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            ...SHARED_PASSWORD_INPUT_REGISTER_OPTIONS,
          })}
          required
          label="Repeat Password"
          placeholder="Type it again"
          data-test-id="password-repeat"
        />
        <Button
          icon={<IconOutlineLockPerson color="typography.text.main" />}
          inherit
          loading={isLoading}
          submit
          disabled={isSubmitDisabled}
          data-test-id="submit-btn"
          className={css({ alignSelf: 'flex-end', width: 'fit-content !important' })}
        >
          Update Password
        </Button>
      </Stack>
      {isError && (
        <p
          data-test-id="error-alert-banner"
          className={css({
            mt: '125',
            textAlign: 'right',
            color: 'typography.text.feedback.alert',
            fontWeight: 'strong',
          })}
        >
          {' '}
          {error?.message}
        </p>
      )}
    </form>
  );
};
