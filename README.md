# Nexus Navigator

Detailed Website Development Prompt



I am providing a reference website design. Use it only as a UI/UX reference, but build a fresh implementation with clean, optimized, and original code. The final website should have the same premium feel, layout style, animations, spacing, and user experience, but all code must be written from scratch.



Reference Website: https://studypanda.pages.dev/



1. Welcome Screen



When any user opens the website, show a white welcome screen first.



Center the PW Nexus logo/text.



Below it, display a premium black rounded button with:



> 🔥 Open Now 🔥







After clicking Open Now, smoothly transition to the Home page.





2. Home Page Design



Use the same premium dark theme, layout style, spacing, card design, shadows, and animations as the reference.



Replace every Study Panda branding with PW Nexus.



At the top, instead of the Panda icon, use a Pikachu logo (I will provide the image).



Pikachu should have a subtle idle animation:



Eyes move left and right naturally.



Smooth floating/glow animation.





Display:



> Welcome to PW Nexus







Under it, add a professional subtitle.





3. Platform Cards



Admin can add unlimited platforms.



Each platform includes:



Logo



Platform Name



Website URL





Display them as premium cards similar to the reference design.



Cards should have hover/tap animation.





4. Navigation Menu



Top-left should contain the same style menu button.



Clicking it opens a premium side navigation drawer.



The drawer should automatically list every platform added by the Admin Panel.



Whenever a new platform is added, it must instantly appear:



On the Home page



In the Side Navigation





No manual coding required after adding platforms.





5. WebView System



The entire website should work using an internal WebView/browser.



When the user clicks any platform card or side navigation item:



Open the website inside the built-in WebView.



Do NOT redirect to the external browser.





The WebView page must also display the same top-left menu button.



From there users can open the navigation drawer again without leaving the WebView.





6. Admin Panel



Clicking the PW Nexus logo/Pikachu inside the side navigation should open the Admin Panel.



The Admin Panel must allow:



Add Platform



Edit Platform



Delete Platform



Upload Platform Logo



Change Platform Name



Change Website URL



Reorder Platforms



Hide/Show Platforms



Change Welcome Screen Settings



Change Pikachu Logo



Change Home Banner



Manage All Platform Data





7. Real-Time Sync



Whenever the Admin updates anything:



Every connected user should receive the update automatically.



No refresh required.



Changes should instantly appear everywhere:



Home Page



Side Navigation



WebView



Welcome Screen



Logos



Platform Names



URLs







8. UI Requirements



Premium Dark Theme



Neon Green Accent



Rounded Corners



Glassmorphism Effects



Smooth Animations



Mobile First Design



Responsive Layout



Fast Loading



Beautiful Transitions



Modern Typography



Professional UI





9. Performance



Extremely fast loading.



Optimized images.



Smooth scrolling.



No lag.



Fully responsive on all mobile devices.





10. Project Requirements



Clean folder structure.



Modular components.



Maintainable code.



Secure Admin Panel.



Error handling.



Loading animations.



Proper caching.



Production-ready quality.





Important: Use the provided reference website only as a visual and UX inspiration. Create an original implementation with new code and assets where needed, while preserving the same premium experience and functionality.



You can add this section to your prompt:





---



11. Secure Admin Panel



The website must include a hidden Admin Panel.



Admin Access



The Admin Panel must be protected with an access code.



Only after entering the correct code should the Admin Panel open.



Admin Code: piyush09



If the code is incorrect, display "Invalid Admin Code" and do not allow access.



The code must not be visible anywhere in the website UI.





Admin Panel Features



The Admin Panel should allow complete control of the website without editing any code.



The Admin should be able to:



Add, edit, delete, hide, or unhide platforms.



Upload or change platform logos.



Change platform names.



Update platform website URLs.



Reorder platform positions using drag-and-drop.



Enable or disable any platform.



Change the PW Nexus logo.



Upload or replace the Pikachu logo.



Change the Welcome Screen title, subtitle, and button text.



Change website theme settings (colors, icons, banners, etc.).



Manage the navigation menu.



Manage all platform data from one place.



View total platforms and basic analytics.



Save all changes securely.





Real-Time Updates



Any change made from the Admin Panel must instantly sync for all users.



No refresh or restart should be required.



Every connected user should automatically receive the latest data.





Security



Admin features must remain inaccessible without the correct code.



All admin actions should be securely validated.



The Admin Panel should be hidden from normal users and accessible only through the secret admin entry point.





Note: The access code for the initial setup is:



Admin Code: piyush09





---



Recommendation: For a real production website, avoid hard-coding the admin code in the frontend. Store it securely on the server (hashed) and validate it through a backend authentication system so users cannot discover it by inspecting the website's source code.



Create an animated version of the provided Pikachu image. Remove the white background completely and make the background fully transparent (alpha). Keep only the Pikachu character.



Animation requirements:

- Preserve the original Pikachu design, colors, proportions, and facial expression.

- Make the animation smooth, seamless, and loop infinitely.

- Add subtle idle body movement (gentle up-and-down breathing).

- Blink the eyes naturally every few seconds.

- Move the pupils slightly for a lively look.

- Animate the mouth with small opening and closing movements, as if Pikachu is breathing or making cute expressions.

- Add slight ear, tail, and cheek movements for a realistic idle animation.

- Ensure the character remains centered and does not move out of frame.

- No extra objects, effects, text, shadows, or background.

- Export with a transparent background (alpha channel) so it can be placed on any website or app.

- Deliver a high-quality, smooth animation (60 FPS preferred) with a seamless looping effect.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pikachu-pw-nexus.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1992ccff-512f-4a55-bfc8-cbf720e8fa95).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
