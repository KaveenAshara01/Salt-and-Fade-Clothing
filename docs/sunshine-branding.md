# Current revision: action sessions and editorial merchandising

Inspired by the content hierarchy at https://www.thecriticalslidesociety.com/ (reviewed during this revision): collection campaign, browsable product rows, shop-the-look merchandising, and editorial stories. No third-party branding or photographs were copied.

Homepage order: full-width surf campaign; collection shortcuts; new-arrival product rail with collection filters and previous/next controls; paired surf/skate campaign tiles; Shop the session with actual matching catalog products; collection cards; editorial cards; compact shop callout. Product images change to the API's alternate view on hover or keyboard focus. Mobile supports swipe browsing.

Previous posed skate and pool campaign images are no longer used on the homepage. Original logo artwork remains unchanged, with the existing colour-only variant retained. Catalog photos, prices, stock and links remain sourced from the API.

## New images

Mode: built-in imagegen. Campaign photographs are AI-generated from actual product references. The graphics were visually compared with the references, but generated images are not a pixel-perfect reproduction guarantee. Catalog product photographs remain authoritative.

Asset: `frontend/public/images/surf-session-action.png`
Reference: `frontend/public/images/product-references/ride-the-east-white-0.webp`
Prompt: Create wide landscape 3:2 high energy close-up surf fashion editorial photo using the supplied image as exact garment reference. Fictional adult South Asian male surfer actively carving a small turquoise wave, shot very close from behind at water level, dynamic diagonal composition, powerful spray droplets frozen in foreground, wet curls, exertion, saltwater on skin, joyous intense session. White oversized wet cotton tee MUST show the exact supplied ARUGAM BAY back print: same blue and yellow illustrated letterforms, EAST COAST SRI LANKA above, RIDE THE EAST and SALT & FADE ISLAND WEAR below. Preserve all print design and placement, do not invent graphics. Surfer upper back and shoulders dominate right two thirds, surfboard edge and breaking water visible, left third mostly sea and spray suitable for text overlay. Crisp modern sports photography, 24mm action camera, hard tropical sun, vivid blue teal and white. Actually surfing, no standing portrait, no holding board on beach, no text outside the garment, no watermark.

Asset: `frontend/public/images/skate-session-action.png`
Reference: `frontend/public/images/product-references/born-to-ride-0.webp`
Prompt: Create a new vertical 2:3 close-up high-energy sports fashion editorial, exact garment reference supplied. Fictional adult South Asian woman actively riding a skateboard through a turquoise and hot pink Miami beach concrete bowl, crouched deeply in a fast carve, camera extremely close at hip height from behind and side, torso fills most of frame, black oversized tee back graphic sharp and unobstructed. Preserve exact supplied ISLAND SURF CLUB ESTD 2025 orange monkey on teal surfboard between teal palms, yellow Born to Ride script SOUTH COAST SRI LANKA, identical art, colours, placement and lettering. Sweat glistening on neck and forearms, loose hair, real skin texture, physical exertion with happy grin visible in profile, hard sun, wheels and board partly visible near lower edge, subtle motion blur only in background, dynamic tilted camera and strong sense of speed. Bright aqua ocean, blue sky and palms glimpsed above bowl. Crisp digital campaign photography, no grain. Actually skating, not standing holding board, not a product pose. No additional text or watermark.

---

Earlier revision notes follow for provenance.
# Modern coastal branding

The current revision restores the original wave-and-sun logo geometry. `frontend/public/images/salt-fade-bright.svg` differs from `Salt & Fade.svg` only in the two fill colours: cyan #00b6ee and yellow #ffde37.

The homepage uses vivid blue, hot pink, yellow, white, sans-serif headings, photographic sections, rounded controls and no paper/postcard styling.

## Product accuracy

Downloaded reference photographs come directly from the running catalog API. The hero and surf/happy-model sections use the original Ride the East (White) photos, without regenerating the garment print. The story uses original Born to Ride and Ride the East photos. Campaign links lead to the corresponding catalog products.

The skate image is an AI background edit of the catalog's original Born to Ride model photograph, inspected against the reference. Product listings continue to use their exact API images and prices.

## Current generated assets and prompts

Mode: built-in imagegen tool.

Asset: `frontend/public/images/skate-born-to-ride.png`
Reference: `frontend/public/images/product-references/born-to-ride-0.webp`
Prompt: Edit target: supplied product photo. Create a photorealistic vertical fashion campaign photograph. Preserve the adult woman and her entire black t-shirt EXACTLY, same pose, same garment shape, identical back graphic, all lettering ISLAND SURF CLUB ESTD 2025 Born to Ride SOUTH COAST SRI LANKA, identical orange surfing monkey illustration, teal palm trees, colours and print placement. Do not redraw, change or reinterpret the t-shirt artwork. Change only the background and surrounding atmosphere into a vivid modern Miami seaside skatepark with turquoise sea, blue sky, palms, hot pink and aqua concrete ramps. Woman holding a skateboard low at her side without obscuring shirt design. Keep original face, hairstyle and white denim shorts. Happy warm sunshine, crisp digital photo, natural skin, no grain, no additional text, no watermark. Product fidelity is highest priority.

Asset: `frontend/public/images/summer-pool.png`
Prompt: Wide 3:2 photorealistic summer website background. Overhead sunlit swimming pool water in vivid clear turquoise with gorgeous sharp caustic ripples, small glossy hot pink inflatable ring near right edge, palm frond shadow coming in from upper left, joyful Miami tropical summer mood, fresh contemporary digital photography, very bright cyan aqua and pink palette. No people, no words, no logos, no grain. Mostly open water in centre to place website copy over it.

The earlier `miami-campaign.png` remains on disk but is no longer displayed; its tees were based on generic local mockups rather than the live catalog.

