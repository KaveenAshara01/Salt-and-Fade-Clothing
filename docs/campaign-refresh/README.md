# Campaign image and homepage refresh

The current homepage follows the Incarnage reference's section rhythm: full-width hero, standalone latest-products rail, campaign banner, collection image rail, activity image rail, second campaign banner, three promotional image tiles, and a final product rail. Desktop rails show four cards; phone rails show two cards plus a hint of the next, while promotional tiles stack vertically. The prior fixed-photo/product rows have been replaced. Existing white, yellow (#FED925), logo blue (#0095FF), Fraunces banner headings, and bold product typography are retained. Footer source and shared palette styles are unchanged.

## Assets

All final browser assets are in `frontend/public/images/campaigns/`:

| Files | Source / treatment |
| --- | --- |
| `surf-original.jpg` | Supplied `ChatGPT Image Nov 10, 2026, 09_34_26 AM.png`, unchanged composition, JPEG export |
| `pool-original.jpg` | Supplied `Poolside Model with Salt & Fade Tee.png`, unchanged composition, JPEG export |
| `surf-desktop.jpg`, `surf-mobile.jpg` | Built-in imagegen outpainting from the supplied surf photograph |
| `pool-desktop.jpg`, `pool-mobile.jpg` | Built-in imagegen outpainting from the supplied pool photograph |
| `volleyball-desktop.jpg`, `volleyball-mobile.jpg` | Exact separate crops of the supplied finished volleyball designs, removing the dividing rule |
| `tennis-desktop.jpg`, `tennis-mobile.jpg` | Existing approved tennis photograph; desktop JPEG export and mobile subject crop |

Banner headings and buttons are live HTML with desktop-left and mobile-top placement. Volleyball already contains its artwork text and is a single accessible linked picture, with no duplicate overlay. The tennis mobile headline sits above the photograph to avoid covering the approved shirt graphic. The supplied clean photographs appear on the homepage and About page without text overlays. Original PNG sources are preserved.

## Imagegen prompt set

Built-in `image_gen` was used, with one referenced local source per prompt. No API/CLI generation was used. Generated PNG masters remain in the tool's generated-images directory; optimized JPEG exports are saved in this project.

### Surf desktop

Expand this exact surf campaign photograph horizontally into a wide 2400x1000 desktop website hero. Keep the woman, face, pose, white Salt & Fade printed T-shirt, yellow board and photography unchanged. Preserve the exact existing T-shirt print. Place the original scene on the RIGHT two thirds; outpaint additional natural blue sky and ocean on the LEFT third, calm and uncluttered for an HTML heading. Do not add text, typography, buttons, borders or watermarks. Photorealistic seamless outpainting, same warm sunlight and ocean horizon. Do not crop the woman or shirt.

### Surf mobile

Expand this exact surf photograph vertically into a 900x1400 portrait mobile website hero. Preserve the woman, her face, pose, anatomy, exact white Salt & Fade printed T-shirt and yellow surfboard. Recompose original scene intact into LOWER two thirds; extend natural clear blue sky into TOP third as uncluttered negative space for HTML title and button. Keep woman and board clearly recognizable, no distorted limbs. Same sunlit photography. NO new text, no typography, no buttons, no watermarks. Preserve existing T-shirt graphic exactly.

### Pool desktop

Expand this exact poolside campaign photograph horizontally into a wide 2400x1000 website banner. Preserve the exact man, sunglasses, face, white Salt & Fade printed T-shirt, original print, blue shorts, towel and reclining pose. Keep original man and lounger on RIGHT half; outpaint rippling bright blue pool water and subtle pool coping to LEFT half. Left third is simple uncluttered water for HTML text overlay. Seamless photoreal outpainting, identical sunlit lighting, no added people. NO text, typography, buttons, borders or watermarks. Do not change shirt graphic.

### Pool mobile

Expand this exact poolside photograph vertically into a 900x1400 mobile hero. Preserve the exact man's face, sunglasses, white Salt & Fade T-shirt with unchanged original chest print, blue shorts and lounging pose. Keep original person on LOWER two thirds, outpaint additional uninterrupted blue pool water on TOP third for HTML headline and button. Photoreal seamless background expansion, same sunlight and blue towel. No new text, buttons, watermarks, people or brand graphics. Do not alter printed clothing.

## Validation

`browser-check.py` uses a locally launched headless Chrome through DevTools to inspect 1440px desktop and 390px mobile layouts. Screenshots and `browser-report.json` record responsive image selection, loaded images, horizontal overflow, carousel movement, and runtime exceptions. The product backend must be available for live product checks. `prepare-originals.ps1` documents reproducible original exports and volleyball/tennis crops.

The layout reference is https://www.thecriticalslidesociety.com/ (image/product arrangement only).

The latest layout reference is https://incarnage.com/. `reference-layout.json` and `reference-*.png` document the inspected desktop/mobile section arrangement. `carnage-layout-check.py`, its JSON report, and `layout-*.png` validate the resulting local implementation. `layout-preserved-files.json` records unchanged footer, palette, and collection stylesheet hashes. No Carnage branding, product imagery, colours, or footer content is used in the storefront.

## Surf anatomy correction

Built-in imagegen edit prompts (one for each desktop, mobile, and clean lifestyle source):

Repair anatomy only in this exact supplied photograph. The woman lying prone on the yellow surfboard currently appears to have only one leg. Add her anatomically correct SECOND leg, naturally connected to the far hip under the shirt/shorts. Both legs must be visually readable: retain the current near thigh, bent knee and raised foot, and show a second farther bent calf and foot slightly LEFT of and LOWER than the existing raised foot, with natural perspective and two separate feet. Keep the pose relaxed and believable, exactly two legs and two feet, no detached limbs. Preserve the woman's face, hair, torso, arms, hands, white shirt and exact Salt & Fade print, yellow shorts, board, ocean, lighting, colour and existing composition. Change ONLY the leg region, avoid changing anything else. Preserve this image's [desktop: wide landscape canvas and empty left sky for desktop heading; mobile: portrait canvas and large empty upper sky for mobile heading; lifestyle: landscape canvas]. No added text, graphics, buttons or watermarks. Match photographic skin texture and sunlight.

The corrected browser assets use versioned names (`surf-desktop-v2.jpg`, `surf-mobile-v2.jpg`, `surf-lifestyle-v2.jpg`), preserving the supplied originals and first exports.

### Final pose correction

The accepted direction is one original raised leg and one leg resting flat along the surfboard. Final assets use `surf-desktop-v3.jpg`, `surf-mobile-v3.jpg`, and `surf-lifestyle-v3.jpg`. Earlier versions remain as source history.

Built-in imagegen edit prompt, applied to each v2 asset:

Precise anatomy/pose correction to this photograph, not a new scene. There are currently TWO RAISED feet. Keep the ORIGINAL HIGHER raised leg and foot exactly unchanged (the taller foot nearer her body on the right). Change ONLY the newly added LOWER LEFT raised leg: lower that leg completely and straighten it backwards along the yellow surfboard. Its thigh, knee, shin, ankle and relaxed foot must lie HORIZONTALLY on the board deck, extending from her hip toward the LEFT edge, naturally resting flat. The corrected second foot must be visible at board height and NOT in the sky, NOT upright, NOT bent upward. Exactly TWO legs: ONE bent with foot raised as in original, ONE straight resting on the surfboard. Extend the board tail leftward only if necessary to support the resting leg. Keep anatomy believable and continuous. Preserve her face, hair, shirt and exact chest artwork, arms, hands, torso, yellow shorts, board nose, water, light, colours, canvas dimensions, composition and all negative space. Remove the unwanted lower-left upright calf/foot and restore the sky behind it. No new text or graphics.

### Waterline and buoyancy correction

Built-in imagegen edit prompt for the three v3 sources; final exports are `surf-desktop-v4.jpg`, `surf-mobile-v4.jpg`, and `surf-lifestyle-v4.jpg`:

Edit only the board-water contact in this exact photograph to make buoyancy physically believable. An adult woman lies on a substantial yellow longboard; her weight must settle the board low into the ocean, not perch above it. Raise the local waterline along the near rail so most of the thick side rail and all underside are submerged. Add small natural ripples washing against and intermittently over the rail near her hips and torso, subtle contact shadows, realistic wet reflections and displacement. Slight natural roll toward the camera and a gently lifted board nose, not a large tilt, no bent board. Keep enough yellow deck and nose visible to clearly identify a floating surfboard; do NOT sink the woman or swamp the whole deck. Retain the woman's exact anatomy and pose: ONE original leg bent upward, ONE leg lying straight flat on the board. Preserve face, body, arms, hands, T-shirt and chest print, shorts, skin, sky, lighting, horizon, framing, canvas aspect ratio and text-free negative space. No new text, logos, people or objects. Photorealistic restrained waterline correction, not dramatic waves.

### Mobile framing and banner typography

Final mobile asset: `frontend/public/images/campaigns/surf-mobile-editorial-v5.jpg`. The straight leg continues beyond the left photographic edge rather than ending inside the image. The desktop lying pose is retained, with vertical sky expansion. The mobile image renders at its intrinsic aspect ratio to avoid additional CSS cropping. Earlier full-leg and original-source experiments were rejected after the user clarified the desired crop.

Banner headlines use locally hosted Fraunces italic 600 (`frontend/public/fonts/fraunces-italic-600.ttf`) with the surf tagline accented in brand yellow. The open font license is included alongside the font. Product/category/nav fonts are unchanged.

Built-in imagegen final mobile edit prompt:

Make a portrait mobile banner from this EXACT photograph using a realistic photographic crop plus vertical sky extension. Keep the woman in the EXACT SAME lying pose, anatomy, face, T-shirt artwork, hands, and two leg positions as the source. Do not re-pose, redraw, shorten, or reconstruct any body part. The straight resting leg must CONTINUE NATURALLY OUT OF THE LEFT IMAGE EDGE, like an ordinary editorial crop through the middle of the calf. Its foot can be outside the frame. It must NEVER end as a stump inside the picture and must not appear amputated. Crop the source horizontally around the woman, keeping her entire head, torso, hands, near thigh, and the original raised bent leg/foot visible. Approximate crop region is original x=450 through the right edge; left image edge should cleanly intersect the straight leg well away from a joint. Keep the board-water contact and original perspective. Expand natural sky ABOVE the photograph and ocean BELOW to a 1080x1680 portrait. Upper 40 percent clear sky for a live HTML headline. Woman should be large enough to see the tee, not tiny full-body in the distance. Same photographic lighting and colours. NO added text, no anatomy changes, no detached limbs, no sitting upright, no new objects.
