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
├── tests/
│   └── storage.test.cjs # Kiểm thử lưu trữ, không cần khi sử dụng website
└── README.md
```

Không cần thư mục ảnh/audio riêng: tranh được tạo trong trang; phần nghe sử dụng `SpeechSynthesis` của trình duyệt.

## Các khu vực

| Khu vực | Chức năng |
| --- | --- |
| Home | Nhiệm vụ tiếp theo, bản đồ 8 vùng khám phá, mục tiêu ngày, sticker và nhịp học từ vựng |
| Learn | Chọn tuần, ngày và một trong 6 kỹ năng; mini quiz mỗi ngày; kiểm tra cuối tuần |
| Practice | Chọn tuần và kỹ năng, luyện toàn bộ ngân hàng câu hỏi, không giới hạn lượt |
| Kho từ vựng | Tìm/lọc kho Starters–Movers, nghe từ, khám phá thẻ, nhận biết, xếp chữ và tự viết |
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

Các bài theo tuần cũ giữ **161 thẻ từ** để những bài đang học, câu sai và lịch sử cũ luôn mở được. Kho từ vựng mới có **1.015 mục**: 506 mục nền tảng Starters, 478 mục Movers và 31 mục mở rộng/biến thể đã có trong nội dung cũ. Từ khác nghĩa như *bat* (gậy/con dơi) và *fly* (bay/con ruồi) là các mục riêng; biến thể Anh–Mỹ và dạng số nhiều được gộp khi phù hợp.

Kho này dựa trên [wordlist Cambridge 2025](https://www.cambridgeenglish.org/Images/506166-starters-movers-flyers-word-list-2025.pdf), có thêm nghĩa tiếng Việt và ví dụ tự biên soạn. Đây là kho để học và ôn có hệ thống, không phải cam kết rằng trẻ phải học toàn bộ hơn 1.000 mục trong 8 tuần.

Nội dung ngữ pháp có giải thích tiếng Việt và 3 câu mẫu/tuần. Bài đọc có 2 đoạn ngắn/tuần cùng câu hỏi chi tiết, điền từ, True/False, định nghĩa, hội thoại và tiêu đề. Bài nói có câu hỏi cá nhân, tranh miêu tả, tìm 4 khác biệt, chuỗi 4 tranh và hình khác nhóm.

### Một ngày học

1. **Vocabulary:** tối đa 10 từ mới/ôn lại — khoảng 6–8 phút. Gia đình chọn ưu tiên Movers nếu con đã vững Starters, hoặc ưu tiên củng cố Starters.
2. **Grammar:** đọc giải thích rồi làm 5 câu — khoảng 5 phút.
3. **Listening:** 2 câu — khoảng 5 phút.
4. **Reading:** 2 câu — khoảng 5 phút.
5. **Writing:** 2 hoạt động — khoảng 7 phút.
6. **Speaking:** 2 gợi ý — khoảng 5 phút.
7. **Mini quiz:** 5 câu — khoảng 5 phút, có thể làm sau một lần nghỉ ngắn.

Có **240 bài học kỹ năng** và **40 mini quiz**. Bài học từ vựng hằng ngày ưu tiên từ được giao, từ cần ôn và từ chưa viết đúng; tuần 7–8 dành nhiều hơn cho ôn lại. Vào Kho từ vựng để làm toàn bộ ngân hàng. Với tuần 8, có thể thay một buổi học bằng mock test; tránh cộng dồn thời lượng gây mệt.

### Cách theo dõi từ vựng

- **Đã khám phá:** trẻ đã lật thẻ và xem từ.
- **Nhận biết được:** trẻ trả lời đúng dạng ghép nghĩa, nghe/chọn hoặc xếp chữ.
- **Viết đúng:** trẻ tự gõ đúng từ trong bài chính tả.
- **Cần ôn:** xuất hiện khi trả lời sai; hai lượt ôn đúng giúp bỏ cờ này.

Trạng thái là dữ liệu luyện trên website, không phải đánh giá đầy đủ khả năng dùng từ trong bài thi.

## Bài kiểm tra và cách chấm

- **Random Challenge:** mỗi lần bắt đầu tạo 25 câu mới, gồm 5 câu Vocabulary, Grammar, Listening, Reading và Writing. Câu hỏi lấy ngẫu nhiên từ ngân hàng có đáp án cố định; Speaking không nằm trong phần này vì website không thể chấm phát âm/nội dung nói tự động. Lượt đang làm được lưu để mở lại sau khi tải trang, kết quả xuất hiện trong lịch sử. Phần thưởng hoàn thành chỉ nhận một lần mỗi ngày.
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

Các nút Listen và Again dùng `window.speechSynthesis` với `SpeechSynthesisUtterance`. Website ưu tiên giọng tiếng Anh Anh, sau đó là giọng Anh-Australia/New Zealand hoặc một giọng tiếng Anh khác mà thiết bị có sẵn; các giọng được đánh dấu Enhanced, Natural, Neural, Siri, Microsoft hoặc Google được ưu tiên. Từ đơn đọc chậm hơn câu, còn câu dài được chia theo điểm ngắt tự nhiên. Website không gọi API âm thanh bên ngoài.

Khả năng phát âm phụ thuộc giọng tiếng Anh được cài trên hệ điều hành/trình duyệt. Một số giọng của thiết bị có thể cần mạng. Nếu không có giọng hoặc không phát được, trang hiển thị hướng dẫn cùng lời thoại để **bố mẹ đọc giúp**. Các bài nghe có câu thoại đầy đủ, bao gồm số, tên đánh vần, vị trí, hành động, ghép thông tin và chọn hình.

Giọng tổng hợp là phương tiện luyện nghe bổ trợ; nên dùng thêm audio Cambridge chính thức để làm quen giọng người thật. Con có thể nghe lại nhiều lần khi luyện.

## Tiến độ, sao và huy hiệu

Mỗi người học có một ID riêng, độc lập với tên. Trong `localStorage`:

- **`littleStepsMovers.profiles.v2`** lưu danh sách ID, tên, avatar và thời điểm tạo hồ sơ.
- **`littleStepsMovers.profile.<id>`** lưu tiến độ của riêng hồ sơ đó.
- **`littleStepsMovers.v1`** được giữ nguyên làm bản lưu cũ sau khi tự chuyển dữ liệu hợp lệ sang hồ sơ đầu tiên. Việc chuyển chỉ thực hiện khi chưa có danh sách v2; mở lại trang không tạo thêm bản sao.

Trong mỗi hồ sơ có:

- Tên, tuần/ngày hiện tại, các bài đã hoàn thành.
- Bài đang làm, vị trí câu hỏi, lựa chọn, bản nháp viết và trạng thái tự kiểm tra. Tải lại trang, chọn đúng người học rồi bấm Continue learning để tiếp tục.
- Danh sách từ đã khám phá, điểm từng câu, câu cần ôn.
- Sao, lịch ngày học, mục tiêu ngày và tối đa 100 kết quả quiz/test gần nhất.

**Cách nhận sao:** lần đầu trả lời đúng một câu nhận +2; lần đầu hoàn thành một bài/quiz/test nhận +10; hoàn thành đủ 4 mục Vocabulary, Grammar, Listening, Reading trong ngày nhận thêm +20. Lặp lại cùng câu hoặc bài không nhận lại cùng phần thưởng. Hoạt động vẫn được luyện và ghi nhận điểm mới.

**Daily goal:** hoàn thành 4 hoạt động kỹ năng trong ngày thực tế. Mục Vocabulary từ luồng Learn có tối đa 10 từ. Writing và Speaking vẫn thuộc bài học hằng ngày, nhưng không nằm trong 4 mục nhận thưởng này.

**Streak:** tính theo ngày lịch địa phương của thiết bị. Hôm nay chưa học vẫn giữ chuỗi kết thúc hôm qua; bỏ trọn một ngày thì chuỗi hiện tại về 0. Một câu trả lời hoặc một thẻ đã hoàn thành được tính là hoạt động học. Không tính bằng khoảng thời gian 24 giờ.

**Review Mistakes:** một câu cần 2 lượt trả lời đúng trong chế độ Review để thành Mastered. Trả lời sai lại sẽ đưa câu về 0 lượt đúng và mở lại mục cần ôn. Lặp bấm Check không tăng lượt.

**9 huy hiệu:** First Lesson, 3 Day Streak, 7 Day Streak, 50 Words Explored, Vocabulary Star, Grammar Hero, Listening Star, Perfect Quiz, Movers Champion. Ngoài ra trang chủ có sổ sticker cho các mốc học và ôn từ. Huy hiệu streak dựa trên chuỗi dài nhất đã đạt.

## Nhiều người học trên cùng máy

Khi mở hoặc tải lại website, màn hình **“Ai đang học hôm nay?”** cho phép chọn hồ sơ. Lần đầu sử dụng, website tạo sẵn hồ sơ **Bạn nhỏ** với avatar cú mèo để có thể bắt đầu ngay. Có thể đổi tên/avatar hoặc chọn **Thêm người học** để tạo hành trình riêng cho mỗi bạn.

Hai bạn có thể dùng cùng tên nhưng vẫn có ID khác nhau; 6 ký tự cuối của ID xuất hiện trên thẻ để phân biệt. Mỗi bạn có điểm, sao, câu sai, huy hiệu, streak, lịch sử và bài đang làm riêng.

Để đổi người học, nhấn avatar ở thanh trên (hoặc tên ở menu), rồi chọn **Đổi người học**. Bài đang làm và bản nháp được giữ lại trước khi chuyển; âm thanh và đồng hồ của lượt cũ được dừng. Khi chọn lại người học, nhấn Continue learning để tiếp tục. Thời gian kiểm tra vẫn tính từ lúc bắt đầu lượt, vì vậy thời gian gợi ý có thể đã hết sau khi nghỉ lâu; con vẫn được làm tiếp.

Đổi tên/avatar giữ nguyên ID và tiến độ. Ngoài các avatar emoji có sẵn, có thể chọn ảnh PNG, JPG hoặc WebP dưới 5 MB trong phần quản lý hồ sơ. Website tự cắt giữa ảnh thành hình vuông 160×160 và nén ảnh trước khi lưu cục bộ; ảnh đi kèm file xuất tiến độ nhưng không được tải lên máy chủ. **Đặt lại hồ sơ này** yêu cầu nhập `RESET`, chỉ xóa dữ liệu học của hồ sơ đang chọn; tên, avatar và các người học khác vẫn giữ nguyên.

Các tab chọn người học độc lập; việc ghi tiến độ của người này không ghi lại toàn bộ dữ liệu người khác. Nếu cùng một hồ sơ có bản lưu mới ở tab khác, lượt ghi tiếp theo bị chặn để tránh ghi đè; xuất bản nháp nếu cần rồi tải lại hoặc chọn lại hồ sơ đó để lấy dữ liệu mới. Đây không phải đồng bộ đồng thời cho cùng một người học.

## Sao lưu tiến độ

Một người lớn có thể nhấn avatar → **Sao lưu tiến độ**, hoặc dùng nút sao lưu trên Progress, để lưu một bản sao của hồ sơ đang chọn. Website không có chức năng nhập hay khôi phục từ tệp; mỗi bạn bắt đầu và tiếp tục hồ sơ riêng ngay trên thiết bị.

## Dữ liệu cá nhân

Không đăng nhập, không analytics, không gửi bài làm lên server. Hồ sơ cục bộ giúp tách tiến độ; mọi người dùng chung trình duyệt đều có thể chọn các hồ sơ này. Đây không phải cơ chế bảo mật bằng tài khoản.

Tiến độ chỉ thuộc **trình duyệt và địa chỉ đang mở**. Dữ liệu của file trực tiếp, localhost và website đã deploy không tự chia sẻ. Trình duyệt khác, chế độ riêng tư hoặc xóa site data có thể làm mất tiến độ.

Nếu trình duyệt chặn lưu hoặc hết dung lượng, website hiển thị thông báo và giữ các hồ sơ trong bộ nhớ của phiên hiện tại. Hãy lần lượt chọn và xuất tiến độ các hồ sơ trước khi đóng trang. Hồ sơ có dữ liệu hỏng không bị tự đặt lại; có thể nhập bản sao hợp lệ thành hồ sơ mới để tiếp tục.

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

## Kiểm thử lưu trữ

Không cần cài dependency. Nếu có Node.js, chạy:

```sh
node --test tests/storage.test.cjs
```

Bộ kiểm thử bao phủ tách hồ sơ, tên trùng, phần thưởng độc lập, nâng cấp v1 một lần, sao lưu tiến độ, các tab cùng/khác hồ sơ và trường hợp localStorage bị chặn.

Phiên bản nhiều người học đã vượt qua **7 bài kiểm thử lưu trữ** và **10 nhóm kiểm thử Chrome**: tạo/chuyển hồ sơ, khôi phục câu hỏi và bản nháp, tên/avatar, sao lưu riêng từng người, đặt lại độc lập, giao diện 834/390/320px, nâng cấp dữ liệu cũ có lịch sử quiz và lưu tạm khi trình duyệt chặn localStorage. Không ghi nhận lỗi JavaScript trong các luồng này.

## Checklist nghiệm thu thủ công

Đã kiểm thử tự động trên Chrome bằng cách mở `file://`: 15 nhóm kiểm tra luồng học, quiz/test, lưu và khôi phục bài, câu sai, huy hiệu, tên người học, sao lưu tiến độ, dữ liệu hỏng và localStorage bị chặn. Các màn hình chính được kiểm tra ở chiều rộng 1440, 834, 390 và 320px, không tràn ngang; không ghi nhận lỗi JavaScript hoặc request HTTP(S) trong luồng sử dụng. Logic streak qua ngày/tháng, ngày bỏ học và chống nhận thưởng trùng cũng được kiểm tra riêng. Kiểm tra kết nối SpeechSynthesis dùng giọng giả lập trong tự động hóa; chất lượng âm thanh thực tế cần kiểm tra bằng tai trên thiết bị sử dụng.

1. Mở `index.html`, tạo/chọn hồ sơ, chọn Learn, tuần và ngày; kiểm tra 6 bài kỹ năng.
2. Học 10 thẻ, hoàn thành ngữ pháp, nghe và đọc; xác nhận mục tiêu ngày và sao.
3. Làm sai một câu, kiểm tra Review Mistakes, ôn đúng hai lượt và kiểm tra Mastered.
4. Đang làm bài thì đổi hồ sơ hoặc tải lại trang, chọn lại người học và Continue learning; xác nhận lựa chọn/bản nháp và vị trí được giữ.
5. Làm lại cùng mini quiz; kiểm tra điểm lưu mới nhưng không cộng sao trùng.
6. Làm weekly test và hai mock test; kiểm tra tổng số câu, phân tích kỹ năng và lịch sử.
7. Luyện viết tự do và nói: cần tự kiểm tra, không hiện điểm đúng tự động.
8. Kiểm tra Listen/Again bằng giọng tiếng Anh thật trên thiết bị; thử luồng lời thoại thay thế.
9. Tạo hai hồ sơ trùng tên; kiểm tra điểm độc lập. Sao lưu từng hồ sơ và đặt lại một hồ sơ rồi kiểm tra hồ sơ còn lại.
10. Kiểm tra các màn hình ở desktop, tablet và mobile; có thể dùng bàn phím Tab/Enter.

Toàn bộ câu hỏi, truyện, lời thoại và tranh trong dự án được tự biên soạn. Không sao chép đề thi, sách hay hình ảnh Cambridge.
# english-study
