import { Button, IconOutlineForwardToInbox, IconOutlineMarkunreadMailbox } from '@novu/design-system';
import { css, cx } from '../../../styled-system/css';
import { HStack, Stack } from '../../../styled-system/jsx';
import { text } from '../../../styled-system/recipes';
import { IUserProfilePasswordEmailVerificationProps } from './UserProfilePasswordSidebar.shared';
import { Text } from './UserProfilePasswordSidebar';

export const UserProfilePasswordEmailVerificationSection: React.FC<IUserProfilePasswordEmailVerificationProps> = ({
  email,
  handleSendLinkEmail,
  countdownTimerSeconds,
}) => {
  const isButtonDisabled = countdownTimerSeconds > 0;

  return (
    <Stack direction={'column'} gap={'200'} mt="150">
      <HStack gap="100">
        {/* TODO: this is a different Icon from designs since the one from React Icons doesn't match the name */}
        <IconOutlineMarkunreadMailbox size="40" className={css({ flexShrink: 0 })} />
        <Text variant="main" color="typography.text.secondary">
          We have just sent a verification link to your email address{' '}
          <span className={text({ variant: 'main' })}>{email}</span>.<br />
          Please verify your email address to proceed with setting a password.
        </Text>
      </HStack>
      <HStack gap={'200'} justifyContent="flex-end">
        <Text>
          Didn't get the link? Resend in{' '}
          <strong
            className={cx(
              text({ variant: 'strong' }),
              // prevent layout from shifting when timer changes from 2 digits to 1 digit.
              css({ minWidth: '2ch', display: 'inline-block', textAlign: 'center' })
            )}
          >
            {countdownTimerSeconds}
          </strong>{' '}
          seconds
        </Text>
        <Button
          onClick={handleSendLinkEmail}
          disabled={isButtonDisabled}
          icon={
            <IconOutlineForwardToInbox
              aria-disabled={isButtonDisabled}
              className={css({
                fill: 'typography.text.main',
                '&[aria-disabled="true"]': { fill: 'typography.text.tertiary' },
              })}
            />
          }
        >
          Resend link
        </Button>
      </HStack>
    </Stack>
  );
};
