import React from 'react';
import { Text, Linking } from 'react-native';
import { Screen, Card, SectionTitle } from '../components/ui';
import { useAuth } from '../components/AuthContext';
import { APP_NAME } from '../config';
import { colors } from '../theme';

const UPDATED = '21 November 2026';

// In-app privacy policy (Play Store / App Store). Shop name and contact details come from Shop settings.
export default function PrivacyScreen() {
  const { shop } = useAuth();
  const name = shop?.name || APP_NAME;
  const contacts = [
    shop?.email && { label: `Email: ${shop.email}`, url: `mailto:${shop.email}` },
    shop?.phone && { label: `Phone: ${shop.phone}`, url: `tel:${shop.phone}` },
    shop?.address && { label: `Address: ${shop.address}` },
  ].filter(Boolean);

  const sections = [
    ['Who we are',
      `${name} uses this app to take food orders for pickup and delivery. This policy explains what information the app collects, why, and the choices you have. By using the app you agree to this policy.`],
    ['Information you give us',
      [
        'Account details: your name, phone number, email address, delivery address and password (stored encrypted on our server) when you create an account.',
        'Order details: the items you order, your name, phone, email, delivery address and any note you add at checkout, including orders placed without an account.',
        'Payment proof: if you pay by Easypaisa, JazzCash or bank transfer, the screenshot of the payment you upload so we can confirm it. We never ask for or store your card, bank or wallet login details.',
        'Reviews: the star rating and comment you leave on an order.',
      ]],
    ['Information collected automatically',
      [
        'Push notification token: if you allow notifications, a device token from Expo / Google / Apple so we can send order updates and shop news. You can turn notifications off in your phone settings at any time.',
        'Data saved on your phone: your login session, cart and a copy of the shop menu are stored on the device so the app opens quickly. They are removed when you log out or uninstall the app.',
        'The app does not use advertising, analytics or tracking tools, and does not access your location, contacts or microphone.',
      ]],
    ['How we use your information',
      [
        'To prepare, deliver and update you about your orders.',
        'To contact you about an order by phone, WhatsApp or email.',
        'To manage your account, let you see past orders and reset your password.',
        'To send notifications about your orders and shop news.',
        'To keep sales and accounting records for the shop.',
      ]],
    ['Sharing',
      `We do not sell or rent your information. It is only seen by ${name} staff who handle your order, and by the service providers that run the app for us: our web hosting / server provider, and Expo, Google (Firebase) and Apple for delivering push notifications. We may also share information if the law requires it.`],
    ['Storage and security',
      'Your information is stored on our secure server and sent over encrypted (HTTPS) connections. Order records are kept as long as needed for business and legal purposes. No system is 100% secure, but we take reasonable steps to protect your data.'],
    ['Your choices and rights',
      [
        'View and update your name, phone, email and address from My account → Edit profile & address.',
        'Delete your account at any time from My account → Delete my account. Your account is closed and you are signed out on all devices; past order records may be kept for accounting.',
        'Ask us for a copy of your data or to delete it by contacting the shop (details below).',
      ]],
    ['Children',
      'The app is not directed at children under 13, and we do not knowingly collect their information.'],
    ['Changes to this policy',
      'We may update this policy from time to time. The latest version is always available in the app, with the date it was last updated.'],
  ];

  return (
    <Screen title="Privacy policy">
      <Text style={{ color: colors.muted, marginBottom: 4 }}>Last updated: {UPDATED}</Text>
      {sections.map(([title, body]) => (
        <React.Fragment key={title}>
          <SectionTitle>{title}</SectionTitle>
          <Card>
            {Array.isArray(body)
              ? body.map((line, i) => <Text key={i} style={[st, i > 0 && { marginTop: 8 }]}>{'•  '}{line}</Text>)
              : <Text style={st}>{body}</Text>}
          </Card>
        </React.Fragment>
      ))}
      <SectionTitle>Contact us</SectionTitle>
      <Card>
        <Text style={st}>Questions about this policy or your data? Contact {name}:</Text>
        {contacts.map((c) => (
          <Text key={c.label} style={[st, { marginTop: 6 }, c.url && { color: colors.primary, fontWeight: '700' }]}
            onPress={c.url ? () => Linking.openURL(c.url).catch(() => {}) : undefined}>{c.label}</Text>
        ))}
      </Card>
    </Screen>
  );
}

const st = { color: colors.text, lineHeight: 21 };
