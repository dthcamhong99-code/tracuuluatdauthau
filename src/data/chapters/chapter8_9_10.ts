import { Article, Section } from "../../types";

export const CHAPTER_8_ARTICLES: Article[] = [
  { id: "D77", number: 77, title: "Điều 77. Trách nhiệm của người có thẩm quyền", content: "Phê duyệt kế hoạch, đình chỉ cuộc thầu, hủy thầu, giải quyết kiến nghị." },
  { id: "D78", number: 78, title: "Điều 78. Trách nhiệm của chủ đầu tư", content: "Phê duyệt hồ sơ mời thầu, kết quả lựa chọn nhà thầu, ký kết hợp đồng." }
];

export const CHAPTER_9_10_SECTIONS: Section[] = [
  {
    id: "CH-IX-S1",
    title: "Mục 1: QUẢN LÝ NHÀ NƯỚC",
    articles: [
      { id: "D83", number: 83, title: "Điều 83. Nội dung quản lý nhà nước", content: "Ban hành văn bản pháp luật, thanh tra, kiểm tra, đào tạo nghiệp vụ." },
      { id: "D87", number: 87, title: "Điều 87. Xử lý vi phạm", content: "Xử phạt hành chính, đình chỉ, cấm tham gia hoạt động đấu thầu từ 6 tháng đến 5 năm." }
    ]
  },
  {
    id: "CH-IX-S2",
    title: "Mục 2: GIẢI QUYẾT KIẾN NGHỊ",
    articles: [
      { id: "D89", number: 89, title: "Điều 89. Giải quyết kiến nghị", content: "Nhà thầu có quyền kiến nghị xem xét lại các vấn đề trong quá trình lựa chọn và kết quả đấu thầu." }
    ]
  },
  {
    id: "CH-X",
    title: "Chương X: ĐIỀU KHOẢN THI HÀNH",
    articles: [
      { id: "D95", number: 95, title: "Điều 95. Hiệu lực thi hành", content: "Luật có hiệu lực từ ngày 01 tháng 01 năm 2024." },
      { id: "D96", number: 96, title: "Điều 96. Quy định chuyển tiếp", content: "Các gói thầu đã phát hành hồ sơ trước ngày luật có hiệu lực tiếp tục theo luật cũ." }
    ]
  }
];
