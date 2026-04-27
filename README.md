# ChromeOS Device Attributes Kiosk Wrapper

This Chrome App launches fullscreen, reads ChromeOS enterprise device attributes with `chrome.enterprise.deviceAttributes`, and then loads your hosted web app.

Your hosted web app receives the device values in query parameters.

## Files

- `manifest.json` - App manifest and required permissions
- `background.js` - Launches the app window fullscreen
- `window.html` - UI shell
- `window.css` - Styling for kiosk display
- `window.js` - Reads device attributes and launches hosted web app
- `window.config.js` - Hosted web app URL configuration

## Important Requirements

- Device must be managed in Google Admin
- App must be force-installed as a kiosk app
- The app needs the `enterprise.deviceAttributes` permission
- Device fields should be configured in Admin Console (asset ID and annotated location)

## Configure Hosted Web URL

1. Edit `window.config.js`.
2. Set `window.KIOSK_WEB_APP_URL` to your hosted app URL.

Example:

```js
window.KIOSK_WEB_APP_URL = "https://kiosk.yourdomain.com/";
```

## GitHub Pages Setup

The hosted kiosk web app is included in the `docs/` folder.

1. Create a new GitHub repository.
2. Upload all files from this project (including the `docs/` folder).
3. In GitHub, open **Settings > Pages**.
4. Under **Build and deployment**, choose:
	- **Source**: Deploy from a branch
	- **Branch**: `main`
	- **Folder**: `/docs`
5. Save and wait for Pages to publish.
6. Your URL will be:

```text
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

7. Put that URL in `window.config.js` as `window.KIOSK_WEB_APP_URL`.

Example:

```js
window.KIOSK_WEB_APP_URL = "https://octocat.github.io/chrome-asset/";
```

## Query Parameters Sent To Hosted App

- `assetId`
- `serialNumber`
- `annotatedLocation`
- `deviceAttrStatus` (`ok` or `partial`)
- `deviceAttrWarnings` (present when status is `partial`)

Example URL loaded by wrapper:

```text
https://kiosk.yourdomain.com/?assetId=ABC-123&serialNumber=SN0001&annotatedLocation=HQ-Lab-3&deviceAttrStatus=ok
```

When using GitHub Pages, this will look like:

```text
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/?assetId=ABC-123&serialNumber=SN0001&annotatedLocation=HQ-Lab-3&deviceAttrStatus=ok
```

## Fallback Behavior

- If hosted URL is missing or invalid, the app shows local fallback cards with the attributes.
- If one or more attribute calls fail, the hosted app still loads and receives `deviceAttrStatus=partial`.

## Deploy as Kiosk App

1. Open Google Admin Console.
2. Go to **Devices > Chrome > Apps & extensions > Kiosks**.
3. Add this app package (or upload in your publishing flow).
4. Set it to auto-launch if desired.

## Local Testing Notes

Chrome Apps are intended for ChromeOS managed deployments. API calls can fail on non-managed devices or non-kiosk contexts.
