import { Fragment } from 'react';
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from 'react-email';

export interface ContactSubmissionProps {
  name: string;
  email: string;
  role: string;
  message: string;
  /** ISO timestamp of the submission. */
  receivedAt: string;
}

// Brand palette with email-safe typography fallbacks.
const SITE_URL = 'https://goldenrecruiting.com';
const LOGO_URL = `${SITE_URL}/icon-192.png`;

export function ContactSubmission({ name, email, role, message, receivedAt }: ContactSubmissionProps) {
  const received = new Date(receivedAt).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const replySubject = encodeURIComponent(`Re: your message to Golden Recruiting`);

  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                ink: '#073F8B',
                'ink-dim': '#5B6775',
                paper: '#FFFFFF',
                raised: '#F2F7FC',
                line: '#D8E4F0',
                brand: '#0879C3',
                'brand-hover': '#FFFFFF',
              },
              fontFamily: {
                serif: ['Poppins', 'Arial', 'sans-serif'],
                sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
              },
            },
          },
        }}
      >
        <Head />
        <Body className="bg-paper font-sans text-ink m-0 p-0">
          <Preview>{`New inquiry from ${name} — ${role}`}</Preview>
          <Container className="max-w-[600px] mx-auto my-6 bg-white border border-solid border-line rounded-[4px] overflow-hidden">
            {/* Header */}
            <Section className="bg-ink px-8 py-6">
              <Row>
                <Column className="w-[48px] align-middle">
                  <Img src={LOGO_URL} alt="Golden Recruiting GR icon" width="40" height="40" className="rounded-[8px]" />
                </Column>
                <Column className="align-middle pl-3">
                  <Text className="m-0 font-serif text-[20px] text-[#FFFFFF]">Golden Recruiting</Text>
                  <Text className="m-0 text-[12px] text-brand-hover tracking-[0.5px]">Contact form · goldenrecruiting.com</Text>
                </Column>
              </Row>
            </Section>

            {/* Body */}
            <Section className="px-8 pt-7 pb-2">
              <Heading as="h1" className="m-0 mb-2 font-serif text-[24px] font-medium text-ink">
                New inquiry from {name}
              </Heading>
              <Text className="m-0 mb-6 text-[14px] text-ink-dim">
                Received {received} ET
              </Text>

              <Section className="bg-raised rounded-[4px] px-5 py-1 mb-6">
                <Row className="border-0 border-b border-solid border-line">
                  <Column className="w-[110px] py-3 text-[13px] text-ink-dim">Name</Column>
                  <Column className="py-3 text-[15px] text-ink">{name}</Column>
                </Row>
                <Row className="border-0 border-b border-solid border-line">
                  <Column className="w-[110px] py-3 text-[13px] text-ink-dim">Email</Column>
                  <Column className="py-3 text-[15px]">
                    <Link href={`mailto:${email}`} className="text-brand underline">
                      {email}
                    </Link>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-[110px] py-3 text-[13px] text-ink-dim">I am</Column>
                  <Column className="py-3 text-[15px] text-ink">{role}</Column>
                </Row>
              </Section>

              <Text className="m-0 mb-2 text-[13px] text-ink-dim">Message</Text>
              <Text className="m-0 mb-7 text-[15px] leading-[24px] text-ink">
                {message.split('\n').map((line, i) => (
                  <Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
              </Text>

              <Button
                href={`mailto:${email}?subject=${replySubject}`}
                className="box-border bg-brand text-white text-[14px] font-medium px-5 py-3 rounded-[3px] no-underline"
              >
                Reply to {name.split(' ')[0]}
              </Button>
            </Section>

            <Hr className="border-0 border-t border-solid border-line mx-8 my-6" />

            <Section className="px-8 pb-7">
              <Text className="m-0 text-[12px] leading-[18px] text-ink-dim">
                Sent by the contact form on{' '}
                <Link href={SITE_URL} className="text-ink-dim underline">
                  goldenrecruiting.com
                </Link>
                . Replying to this email goes straight to {name}.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ContactSubmission.PreviewProps = {
  name: 'Jordan Ellis',
  email: 'jordan.ellis@example.com',
  role: 'Hiring for a role',
  message:
    "We're adding two experienced advisors to our Charlotte office this quarter and would like to talk about a container search.\n\nBest times to reach me are mornings.",
  receivedAt: new Date().toISOString(),
} satisfies ContactSubmissionProps;

export default ContactSubmission;
