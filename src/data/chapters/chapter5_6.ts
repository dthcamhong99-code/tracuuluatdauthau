import { Article, Section } from "../../types";

export const CHAPTER_5_ARTICLES: Article[] = [
  { id: "D53", number: 53, title: "Điều 53. Mua sắm tập trung", content: "Áp dụng cho hàng hóa dịch vụ số lượng lớn, chủng loại tương tự ở nhiều đơn vị." },
  { id: "D55", number: 55, title: "Điều 55. Lựa chọn nhà thầu cung cấp thuốc, vật tư y tế", content: "Cơ sở y tế có thể mua hóa chất kèm máy, mua dịch vụ kỹ thuật, hoặc mua sắm thuốc tập trung." }
];

export const CHAPTER_6_SECTIONS: Section[] = [
  {
    id: "CH-VI-S1",
    title: "Mục 1: PHƯƠNG PHÁP ĐÁNH GIÁ NHÀ THẦU",
    articles: [
      { id: "D58", number: 58, title: "Điều 58. Phương pháp đánh giá (Phi tư vấn, Hàng hóa, Xây lắp)", content: "Giá thấp nhất, Giá đánh giá, Kết hợp giữa kỹ thuật và giá, Dựa trên kỹ thuật." },
      { id: "D59", number: 59, title: "Điều 59. Phương pháp đánh giá (Tư vấn)", content: "Giá thấp nhất, Giá cố định, Kết hợp kỹ thuật và giá, Dựa trên kỹ thuật." }
    ]
  },
  {
    id: "CH-VI-S2",
    title: "Mục 2: PHƯƠNG PHÁP ĐÁNH GIÁ NHÀ ĐẦU TƯ",
    articles: [
      { id: "D62", number: 62, title: "Điều 62. Phương pháp đánh giá lợi ích xã hội", content: "Đánh giá năng lực, phương án kinh doanh và hiệu quả sử dụng đất, hiệu quả đầu tư phát triển." }
    ]
  }
];
