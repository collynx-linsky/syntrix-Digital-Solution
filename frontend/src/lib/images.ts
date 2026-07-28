/**
 * Curated free-license stock photography (Pexels — free for commercial use,
 * no attribution required). Centralized here so every photo used across the
 * site has one canonical source and can be swapped for real brand/client
 * photography later without hunting through components.
 */
function pexels(id: number, width = 1600) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

export const IMAGES = {
  heroTeam: pexels(30689114, 1800), // team collaboration meeting, Lagos office
  aboutTeam: pexels(36733315, 1600), // professional business meeting, modern office
  ctaOffice: pexels(9301291, 1800), // business people in a meeting
  whiteboardStrategy: pexels(7710077, 1400), // colleagues planning at a whiteboard
  teamDiscussion: pexels(7710150, 1600), // team discussing business strategy

  portfolio: {
    "beacon-secondary-school-erp": pexels(34162714), // African students, classroom
    "kilimanjaro-freight-platform": pexels(14005602), // truck on highway
    "savanna-retail-commerce": pexels(16211537), // grocery store shelves
    "amani-microfinance-portal": pexels(9301291), // business meeting
    "serengeti-tourism-site": pexels(33650535), // Serengeti plains, Tanzania
    "unity-university-portal": pexels(4314674), // students with laptop, Tanzania
  } as Record<string, string>,

  blog: {
    "why-tanzanian-businesses-need-custom-software": pexels(30688596),
    "seo-guide-tanzania-2026": pexels(3861957), // graph on laptop screen
    "erp-systems-for-schools": pexels(34162714),
    "cloud-migration-checklist": pexels(4508751), // server racks, data center
    "digital-transformation-roadmap": pexels(36733315),
    "multilingual-website-seo": pexels(30689114),
  } as Record<string, string>,
};
