# Little Steps · Movers Adventure

Website tĩnh ôn tiếng Anh A1 Movers dành cho học sinh lớp 3, theo lộ trình **8 tuần × 5 ngày**, khoảng **30–45 phút/ngày**. Giao diện tiếng Anh kết hợp hướng dẫn tiếng Việt, có mascot cú mèo và tranh tự tạo bằng SVG/emoji.

## Mở website

Mở trực tiếp **`index.html`** bằng Chrome, Edge, Safari hoặc Firefox phiên bản hiện đại. Không cần cài thư viện, chạy terminal, dùng npm, build hay khởi động backend.

Các đường dẫn dùng đường dẫn tương đối; JavaScript dùng script thường, không dùng module hoặc `fetch`, nên có thể chạy qua `file://`. Website không tải font, hình hoặc thư viện từ CDN.

## Cấu trúc

```text
English-Study/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js       # Nội dung, bộ câu hỏi, lịch học, quiz và test
│   ├── storage.js    # localStorage, sao, streak, lịch sử, câu sai
│   └── app.js        # Giao diện, điều hướng, tương tác, chấm đáp án
└── README.md
```

Không cần thư mục ảnh/audio riêng: tranh được tạo trong trang; phần nghe sử dụng `SpeechSynthesis` của trình duyệt.

## Các khu vực

| Khu vực | Chức năng |
| --- | --- |
| Home | Tiếp tục bài đang học; tuần hiện tại; mục tiêu ngày; sao; streak; kỹ năng cần luyện |
| Learn | Chọn tuần, ngày và một trong 6 kỹ năng; mini quiz mỗi ngày; kiểm tra cuối tuần |
| Practice | Chọn tuần và kỹ năng, luyện toàn bộ ngân hàng câu hỏi, không giới hạn lượt |
| My tests | 8 bài kiểm tra tuần và 2 bài tổng hợp ở tuần 8 |
| Progress | Tiến độ 8 tuần, độ chính xác, tiến độ luyện nói, huy hiệu và lịch sử điểm |
| Review mistakes | Xem câu cần ôn, đáp án, giải thích và luyện lại |

Trên mobile, menu chính nằm phía dưới. Vào **Learn** để mở kiểm tra tuần; vào **Progress** để mở Review Mistakes. Vào tuần 8 để mở trang hai mock test.

## Nội dung thực tế

| Tuần | Chủ điểm | Từ vựng | Ngữ pháp | Đọc | Viết | Nghe | Nói |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | Home, Family & School | 20 | 12 | 13 | 8 | 10 | 8 |
| 2 | Animals & Nature | 21 | 12 | 13 | 8 | 10 | 8 |
| 3 | Food, Shopping & Health | 20 | 12 | 13 | 8 | 10 | 8 |
| 4 | Town, Transport & Prepositions | 20 | 12 | 13 | 8 | 10 | 8 |
| 5 | Sport, Hobbies & Comparisons | 20 | 12 | 13 | 8 | 10 | 8 |
| 6 | Holidays & Past Simple | 20 | 12 | 13 | 8 | 10 | 8 |
| 7 | Movers Review | 20 | 12 | 13 | 8 | 10 | 8 |
| 8 | Mock Test & Celebration | 20 | 12 | 13 | 8 | 10 | 8 |

**161 thẻ từ theo tuần**, mỗi thẻ có nghĩa, hình gợi ý và câu ví dụ. Một số từ được ôn ở nhiều tuần. Mỗi từ có 5 hoạt động: chọn nghĩa, chọn từ, thiếu chữ, chính tả và hoàn thành câu. Tổng ngân hàng có **1.213 hoạt động**, gồm các dạng từ vựng này và câu hỏi 5 kỹ năng còn lại.

Nội dung ngữ pháp có giải thích tiếng Việt và 3 câu mẫu/tuần. Bài đọc có 2 đoạn ngắn/tuần cùng câu hỏi chi tiết, điền từ, True/False, định nghĩa, hội thoại và tiêu đề. Bài nói có câu hỏi cá nhân, tranh miêu tả, tìm 4 khác biệt, chuỗi 4 tranh và hình khác nhóm.

### Một ngày học

1. **Vocabulary:** 10 thẻ từ có xoay vòng và ôn lặp lại — khoảng 6 phút.
2. **Grammar:** đọc giải thích rồi làm 5 câu — khoảng 5 phút.
3. **Listening:** 2 câu — khoảng 5 phút.
4. **Reading:** 2 câu — khoảng 5 phút.
5. **Writing:** 2 hoạt động — khoảng 7 phút.
6. **Speaking:** 2 gợi ý — khoảng 5 phút.
7. **Mini quiz:** 5 câu — khoảng 5 phút, có thể làm sau một lần nghỉ ngắn.

Có **240 bài học kỹ năng** và **40 mini quiz**. Bài học được lấy từ ngân hàng của tuần và có ôn lặp lại. Vào Practice để làm các dạng bổ sung và toàn bộ câu hỏi. Với tuần 8, có thể thay một buổi học bằng mock test; tránh cộng dồn thời lượng gây mệt.

## Bài kiểm tra và cách chấm

- Mini quiz: 5 câu kết hợp từ vựng, ngữ pháp, đọc và viết.
- Weekly test: 20 câu, mỗi kỹ năng Vocabulary/Grammar/Listening/Reading/Writing có 4 câu; gợi ý 25 phút.
- Mock Test 1 và 2: mỗi bài 40 câu, mỗi kỹ năng có 8 câu; gợi ý 45 phút. Hai bộ dùng câu khác nhau từ ngân hàng, nhưng có thể gặp lại câu từng luyện.
- Đồng hồ chỉ nhắc thời gian. Hết giờ vẫn được tiếp tục; không tự nộp khi con chưa xong.
- Kết quả có điểm tổng, phân tích 5 kỹ năng, phần làm tốt và các chủ điểm cần luyện. Có thể xem lại từng câu trong kết quả/lịch sử.
- Trắc nghiệm, chính tả và câu có đáp án cố định được chấm tự động. Không phân biệt hoa/thường, bỏ khoảng trắng thừa và dấu kết thúc câu. Câu nghe số chấp nhận chữ số hoặc cách viết số tiếng Anh đã khai báo.
- **Viết tự do không chấm ngữ nghĩa tự động.** Con viết, xem ví dụ và hoàn thành 3 tiêu chí tự kiểm tra, có thể nhờ bố mẹ hỗ trợ.
- **Nói không ghi âm và không chấm phát âm.** Con nói thành tiếng, dùng hint/example nếu cần rồi tự đánh giá.
- Viết tự do và nói không được tính thành câu “đúng” trong độ chính xác. Chỉ số Speaking là **phần trăm hoàn thành 40 bài luyện nói**, không phải trình độ nói.
- Độ chính xác trên Progress dùng **câu trả lời gần nhất cho mỗi câu đã làm**. Chưa làm thì hiển thị “Chưa có dữ liệu”, không tạo điểm mẫu.

Các bài kiểm tra trên website là **bài luyện tổng hợp tự biên soạn theo mức độ A1**, không phải đề Cambridge, không mô phỏng đầy đủ tất cả dạng bài thi giấy và không quy đổi sang khiên. Để tập đúng cấu trúc kỳ thi, dùng thêm [sample papers chính thức](https://www.cambridgeenglish.org/exams-and-tests/qualifications/young-learners/paper/movers/preparation/).

## Audio

Các nút Listen và Again dùng `window.speechSynthesis` với `SpeechSynthesisUtterance`, ưu tiên giọng `en-GB`, tốc độ 0,82. Website không gọi API âm thanh bên ngoài.

Khả năng phát âm phụ thuộc giọng tiếng Anh được cài trên hệ điều hành/trình duyệt. Một số giọng của thiết bị có thể cần mạng. Nếu không có giọng hoặc không phát được, trang hiển thị hướng dẫn cùng lời thoại để **bố mẹ đọc giúp**. Các bài nghe có câu thoại đầy đủ, bao gồm số, tên đánh vần, vị trí, hành động, ghép thông tin và chọn hình.

Giọng tổng hợp là phương tiện luyện nghe bổ trợ; nên dùng thêm audio Cambridge chính thức để làm quen giọng người thật. Con có thể nghe lại nhiều lần khi luyện.

## Tiến độ, sao và huy hiệu

Dữ liệu lưu bằng khóa **`littleStepsMovers.v1`** trong `localStorage`:

- Tên, tuần/ngày hiện tại, các bài đã hoàn thành.
- Bài đang làm, vị trí câu hỏi, lựa chọn, bản nháp viết và trạng thái tự kiểm tra. Tải lại trang rồi bấm Continue learning để tiếp tục.
- Danh sách từ đã khám phá, điểm từng câu, câu cần ôn.
- Sao, lịch ngày học, mục tiêu ngày và tối đa 100 kết quả quiz/test gần nhất.

**Cách nhận sao:** lần đầu trả lời đúng một câu nhận +2; lần đầu hoàn thành một bài/quiz/test nhận +10; hoàn thành đủ 4 mục Vocabulary, Grammar, Listening, Reading trong ngày nhận thêm +20. Lặp lại cùng câu hoặc bài không nhận lại cùng phần thưởng. Hoạt động vẫn được luyện và ghi nhận điểm mới.

**Daily goal:** hoàn thành 4 hoạt động kỹ năng trong ngày thực tế. Mục Vocabulary từ luồng Learn yêu cầu hoàn thành 10 thẻ. Writing và Speaking vẫn thuộc bài học hằng ngày, nhưng không nằm trong 4 mục nhận thưởng này.

**Streak:** tính theo ngày lịch địa phương của thiết bị. Hôm nay chưa học vẫn giữ chuỗi kết thúc hôm qua; bỏ trọn một ngày thì chuỗi hiện tại về 0. Một câu trả lời hoặc một thẻ đã hoàn thành được tính là hoạt động học. Không tính bằng khoảng thời gian 24 giờ.

**Review Mistakes:** một câu cần 2 lượt trả lời đúng trong chế độ Review để thành Mastered. Trả lời sai lại sẽ đưa câu về 0 lượt đúng và mở lại mục cần ôn. Lặp bấm Check không tăng lượt.

**9 huy hiệu:** First Lesson, 3 Day Streak, 7 Day Streak, 50 Words Learned, Vocabulary Star, Grammar Hero, Listening Star, Perfect Quiz, Movers Champion. Mỗi huy hiệu có điều kiện ghi ngay trên thẻ. Huy hiệu streak dựa trên chuỗi dài nhất đã đạt.

## Dữ liệu cá nhân

Không đăng nhập, không analytics, không gửi bài làm lên server. Nhấn avatar/tên ở menu để đổi tên, tải bản sao JSON hoặc xóa tiến độ. Xóa dữ liệu cần nhập `RESET` để tránh nhấn nhầm. Nút xuất JSON cũng nằm trên Progress.

Tiến độ chỉ thuộc **trình duyệt và địa chỉ đang mở**. Dữ liệu của file trực tiếp, localhost và website đã deploy không tự chia sẻ. Trình duyệt khác, chế độ riêng tư hoặc xóa site data có thể làm mất tiến độ. Bản JSON xuất ra phục vụ lưu trữ/đối chiếu; phiên bản này **chưa có nhập dữ liệu hay đồng bộ thiết bị**.

Nếu trình duyệt chặn lưu hoặc dữ liệu JSON bị hỏng, website hiển thị thông báo và vẫn cho học trong phiên hiện tại. Nên xuất tiến độ trước khi đóng trang trong trường hợp này.

## Deploy hosting tĩnh

Đưa nguyên cấu trúc thư mục lên hosting, giữ `index.html` ở thư mục public gốc. Không cần build command, biến môi trường, function hay database. Điều hướng dùng hash (`#learn`, `#practice`...) nên không cần cấu hình rewrite SPA.

- **GitHub Pages:** đưa các tệp vào repository rồi chọn nhánh và thư mục gốc làm nguồn Pages.
- **Netlify:** upload thư mục chứa `index.html` bằng công cụ deploy tĩnh của Netlify.
- **Cloudflare Pages:** upload thư mục website bằng Direct Upload hoặc cấu hình repository cho website tĩnh không có bước build.

Website chưa được xuất bản tự động; các tệp sẵn sàng để upload.

## Chỉnh sửa nội dung

Mở `js/data.js`:

- `wordRows`: mỗi dòng có dạng `word|nghĩa|emoji|câu ví dụ`.
- `weekInfo`: tiêu đề tuần, giải thích và ví dụ ngữ pháp.
- `grammarRows`: `câu hỏi|đáp án|nhiễu 1|nhiễu 2|giải thích`.
- `readingPacks`: tiêu đề, đoạn đọc và các câu hỏi.
- `listeningPacks`: câu hỏi, lời thoại, đáp án, lựa chọn nhiễu, chủ điểm.
- `writingRows`, `personalPrompts`, `scenes`, `stories`, `oddSets`: hoạt động viết/nói và tranh.
- `quizzes`, `tests`, `mockTests`: chọn câu từ các ngân hàng trên.

`window.MoversData` cung cấp `weeks`, `vocabulary`, `grammarQuestions`, `readingQuestions`, `writingQuestions`, `speakingQuestions`, `listeningQuestions`, `quizzes`, `tests`, `mockTests` và bảng tra `allQuestions`.

Giữ ID ổn định khi sửa nội dung đã phát hành vì tiến độ/câu sai tham chiếu theo ID. Nếu thay hẳn cấu trúc ngân hàng, hãy tăng phiên bản dữ liệu/lưu trữ và cung cấp hướng chuyển đổi hoặc hướng dẫn bắt đầu lại.

## Checklist nghiệm thu thủ công

Đã kiểm thử tự động trên Chrome bằng cách mở `file://`: 15 nhóm kiểm tra luồng học, quiz/test, lưu và khôi phục bài, câu sai, huy hiệu, tên người học, xuất JSON, dữ liệu hỏng và localStorage bị chặn. Các màn hình chính được kiểm tra ở chiều rộng 1440, 834, 390 và 320px, không tràn ngang; không ghi nhận lỗi JavaScript hoặc request HTTP(S) trong luồng sử dụng. Logic streak qua ngày/tháng, ngày bỏ học và chống nhận thưởng trùng cũng được kiểm tra riêng. Kiểm tra kết nối SpeechSynthesis dùng giọng giả lập trong tự động hóa; chất lượng âm thanh thực tế cần kiểm tra bằng tai trên thiết bị sử dụng.

1. Mở `index.html`, chọn Learn, tuần và ngày; kiểm tra 6 bài kỹ năng.
2. Học 10 thẻ, hoàn thành ngữ pháp, nghe và đọc; xác nhận mục tiêu ngày và sao.
3. Làm sai một câu, kiểm tra Review Mistakes, ôn đúng hai lượt và kiểm tra Mastered.
4. Đang làm bài thì tải lại trang; xác nhận lựa chọn/bản nháp và vị trí được giữ.
5. Làm lại cùng mini quiz; kiểm tra điểm lưu mới nhưng không cộng sao trùng.
6. Làm weekly test và hai mock test; kiểm tra tổng số câu, phân tích kỹ năng và lịch sử.
7. Luyện viết tự do và nói: cần tự kiểm tra, không hiện điểm đúng tự động.
8. Kiểm tra Listen/Again bằng giọng tiếng Anh thật trên thiết bị; thử luồng lời thoại thay thế.
9. Đổi tên, tải lại trang, xuất JSON; chỉ thử xóa sau khi đã lưu bản sao cần thiết.
10. Kiểm tra các màn hình ở desktop, tablet và mobile; có thể dùng bàn phím Tab/Enter.

Toàn bộ câu hỏi, truyện, lời thoại và tranh trong dự án được tự biên soạn. Không sao chép đề thi, sách hay hình ảnh Cambridge.
# english-study
