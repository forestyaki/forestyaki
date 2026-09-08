import { NotionStory } from "./notion";

/**
 * Curated authentic mountain journal stories
 * Used as high-quality default content and graceful fallback
 */
export const CURATED_STORIES: NotionStory[] = [
  {
    id: "curated-1",
    title: "走入南太平洋的荒野長征：Te Araroa 縱貫紐西蘭 3,000 公里徒步紀行",
    category: "海外遠征",
    slug: "te-araroa-new-zealand",
    summary: "背上 14 公斤重裝，穿越南阿爾卑斯山的雪嶺、冰蝕谷與急湍河流。在杳無人煙的山野中，學會與孤獨相伴，重新找回生活的純粹本質。",
    date: "2024.11.18",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
    featured: true,
  },
  {
    id: "curated-2",
    title: "從沙漠走入雪山的孤獨與光芒：PCT 太平洋屋脊步道 4,265 公里紀實",
    category: "長程縱走",
    slug: "pct-pacific-crest-trail",
    summary: "穿行於加州南端炙熱風蝕峽谷，一路向北抵達加拿大邊境。步履踏過的每一哩路，都是自我對話與大自然的深刻共鳴。",
    date: "2024.08.26",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    featured: false,
  },
  {
    id: "curated-3",
    title: "與毛孩走入時光青苔：淡蘭古道中路，穿梭在雙扇蕨與古石橋的慢步調",
    category: "單日步道",
    slug: "danlan-trail-central",
    summary: "攜著 Ronnie 踩過滿地金黃落葉與青苔石階，聽著淙淙溪水在林間流淌。這是一段不需要趕路的午後山行，只有微風與搖晃的尾巴。",
    date: "2024.07.14",
    coverImage: "/images/ronnie-trail.jpg",
    featured: false,
  },
  {
    id: "curated-4",
    title: "雪山圈谷杜鵑盛開時：攀上 3,886 公尺金頂破曉，凝望台灣最高的高山冰斗",
    category: "長程縱走",
    slug: "snow-mountain-cirque",
    summary: "黑森林中的冷杉林影漸漸退去，眼前驟然展開壯闊的一號圈谷。黎明的第一道晨曦穿透雲海，將整座山脊染上璀璨的暖金色。",
    date: "2024.06.12",
    coverImage: "/images/gallery-6.jpg",
    featured: false,
  },
  {
    id: "curated-5",
    title: "北極圈零下二十度的綠色奇蹟：在雪原凍土之上，守候一場穿越天際的歐若拉",
    category: "海外遠征",
    slug: "yellowknife-aurora",
    summary: "寂靜的大地只聽得見自己呼出的白煙與雪靴擠壓積雪的聲響。當天空突然被翻騰的翡翠綠弧劃開，所有的寒冷瞬間化為無聲的震撼。",
    date: "2024.03.05",
    coverImage: "/images/gallery-1.jpg",
    featured: false,
  },
  {
    id: "curated-6",
    title: "山野話與畫：在帳篷內點亮微光，以水彩與墨水留住山稜的溫柔",
    category: "生活散文",
    slug: "mountain-illustrations-notes",
    summary: "當落日隱入山壑，營燈在帳篷頂端泛起溫暖微光。翻開隨身的手帳本，用洗鍊的線條勾勒白天的松針、巨木與同伴的身影。",
    date: "2024.01.20",
    coverImage: "/images/gallery-2.jpg",
    featured: false,
  },
];

export function getCuratedStories(): NotionStory[] {
  return CURATED_STORIES;
}

export function getStoryBySlugFromCurated(slug: string): NotionStory | null {
  const decoded = decodeURIComponent(slug);
  return (
    CURATED_STORIES.find(
      (s) =>
        s.slug === decoded ||
        s.slug === slug ||
        s.id === decoded ||
        s.id === slug
    ) || null
  );
}
