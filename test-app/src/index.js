import url from 'node:url';
import { glob } from 'glob';
import path from 'node:path';
import parseBool from 'parseboolean';
import educandu from '@educandu/educandu';
import customResolvers from './custom-resolvers.js';

const thisDir = path.dirname(url.fileURLToPath(import.meta.url));

const config = {
  appName: 'educandu-test-app',
  appRootUrl: process.env.TEST_APP_APP_ROOT_URL,
  port: Number(process.env.TEST_APP_PORT),
  trustProxy: true,
  mongoConnectionString: process.env.TEST_APP_WEB_CONNECTION_STRING,
  skipMaintenance: parseBool(process.env.TEST_APP_SKIP_MAINTENANCE),
  cdnEndpoint: process.env.TEST_APP_CDN_ENDPOINT,
  cdnRegion: process.env.TEST_APP_CDN_REGION,
  cdnAccessKey: process.env.TEST_APP_CDN_ACCESS_KEY,
  cdnSecretKey: process.env.TEST_APP_CDN_SECRET_KEY,
  cdnBucketName: process.env.TEST_APP_CDN_BUCKET_NAME,
  cdnRootUrl: process.env.TEST_APP_CDN_ROOT_URL,
  customResolvers,
  publicFolders: [
    {
      publicPath: '/',
      destination: path.resolve(thisDir, '../dist'),
      setHeaders: res => {
        res.setHeader('Cache-Control', 'public, max-age=604800');
      }
    }
  ],
  entryPoints: {
    scripts: (await glob(`main-${'[A-Z0-9]'.repeat(8)}.js`, { cwd: path.resolve(thisDir, '../dist') })).map(x => `/${x}`),
    styles: (await glob(`main-${'[A-Z0-9]'.repeat(8)}.css`, { cwd: path.resolve(thisDir, '../dist') })).map(x => `/${x}`)
  },
  resources: [path.resolve(thisDir, '../../src/translations.json')],
  additionalControllers: [],
  sessionSecret: process.env.TEST_APP_SESSION_SECRET,
  sessionCookieDomain: process.env.TEST_APP_SESSION_COOKIE_DOMAIN,
  sessionCookieName: process.env.TEST_APP_SESSION_COOKIE_NAME,
  sessionDurationInMinutes: Number(process.env.TEST_APP_SESSION_DURATION_IN_MINUTES) || 60,
  consentCookieNamePrefix: process.env.TEST_APP_CONSENT_COOKIE_NAME_PREFIX,
  uploadLiabilityCookieName: process.env.TEST_APP_UPLOAD_LIABILITY_COOKIE_NAME,
  announcementCookieNamePrefix: process.env.TEST_APP_ANNOUNCEMENT_COOKIE_NAME_PREFIX,
  xFrameOptions: process.env.TEST_APP_X_FRAME_OPTIONS,
  xRoomsAuthSecret: process.env.TEST_APP_X_ROOMS_AUTH_SECRET,
  smtpOptions: process.env.TEST_APP_SMTP_OPTIONS,
  emailSenderAddress: process.env.TEST_APP_EMAIL_SENDER_ADDRESS,
  adminEmailAddress: process.env.TEST_APP_ADMIN_EMAIL_ADDRESS,
  initialUser: JSON.parse(process.env.TEST_APP_INITIAL_USER),
  plugins: ['markdown', 'image', 'musikisum/educandu-plugin-progression-models'],
  exposeErrorDetails: true
};

educandu(config);
