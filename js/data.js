/* Original teaching content. These are practice activities, not Cambridge exam papers. */
(function () {
  'use strict';
  const skills = {
    vocabulary: {name: 'Vocabulary', vi: 'Khám phá từ mới', icon: '▧', emoji: '🪴', color: 'green'},
    grammar: {name: 'Grammar', vi: 'Ghép ý thành câu', icon: '✧', emoji: '🧩', color: 'purple'},
    listening: {name: 'Listening', vi: 'Lắng nghe thật kỹ', icon: '♫', emoji: '🎧', color: 'yellow'},
    reading: {name: 'Reading', vi: 'Đọc một câu chuyện', icon: '▤', emoji: '📖', color: 'peach'},
    writing: {name: 'Writing', vi: 'Viết điều con nghĩ', icon: '✎', emoji: '✏️', color: 'blue'},
    speaking: {name: 'Speaking', vi: 'Tự tin cất lời', icon: '☏', emoji: '💬', color: 'pink'}
  };
  // word | Vietnamese meaning | visual | an original example sentence
  const wordRows = [
    `family|gia đình|👨‍👩‍👧|My family eats dinner together.
parents|bố mẹ|👨‍👩‍👦|My parents work in town.
cousin|anh chị em họ|🧒|My cousin is nine years old.
daughter|con gái|👧|Their daughter likes drawing.
son|con trai|👦|Their son has a green bag.
aunt|cô, dì, bác gái|👩|My aunt makes delicious soup.
uncle|chú, cậu, bác trai|👨|My uncle can play tennis.
classroom|lớp học|🏫|Our classroom has two doors.
homework|bài tập về nhà|📝|I do my homework after school.
lesson|bài học, tiết học|📚|Our English lesson is fun.
library|thư viện|📚|We read books in the library.
playground|sân chơi|🛝|The children run in the playground.
balcony|ban công|🪴|There are plants on the balcony.
stairs|cầu thang|🪜|Walk slowly on the stairs.
roof|mái nhà|🏠|A bird is on the roof.
floor|sàn nhà|🧹|My school bag is on the floor.
upstairs|ở tầng trên|⬆️|My bedroom is upstairs.
downstairs|ở tầng dưới|⬇️|The kitchen is downstairs.
teacher|giáo viên|🧑‍🏫|Our teacher tells funny stories.
subject|môn học|📒|English is my favourite subject.`,
    `dolphin|cá heo|🐬|The dolphin is swimming near the boat.
whale|cá voi|🐋|A whale is a very big animal.
shark|cá mập|🦈|The shark lives in the sea.
panda|gấu trúc|🐼|The panda is eating.
bat|con dơi|🦇|A bat can fly at night.
kangaroo|chuột túi|🦘|The kangaroo can jump far.
insect|côn trùng|🐞|This insect has six legs.
forest|rừng|🌲|Many animals live in the forest.
field|cánh đồng|🌾|There are cows in the field.
island|hòn đảo|🏝️|We can see a small island.
waterfall|thác nước|🏞️|The waterfall is beautiful.
mountain|núi|⛰️|There is snow on the mountain.
lake|hồ|🏞️|The ducks are on the lake.
river|sông|🌊|The river goes through the town.
climb|leo trèo|🧗|Monkeys can climb trees.
fly|bay|🕊️|These birds fly very fast.
jump|nhảy|🐸|The frog can jump.
swim|bơi|🏊|Fish swim in the water.
catch|bắt, đón lấy|🤲|The cat wants to catch a mouse.
hide|trốn, giấu|🫣|The rabbit can hide behind the tree.
feed|cho ăn|🥕|We feed the rabbits every morning.`,
    `vegetables|rau củ|🥦|We eat vegetables every day.
fruit|trái cây|🍎|I have some fruit for breakfast.
cheese|phô mai|🧀|There is cheese in my sandwich.
soup|súp|🥣|The soup is hot.
sandwich|bánh mì kẹp|🥪|I would like a cheese sandwich.
pancakes|bánh kếp|🥞|Dad makes pancakes on Sundays.
noodles|mì|🍜|These noodles are delicious.
supermarket|siêu thị|🛒|We buy milk at the supermarket.
market|chợ|🧺|The market has fresh fruit.
money|tiền|💰|I have money for a banana.
buy|mua|🛍️|We buy bread in the morning.
sell|bán|🏪|They sell apples at this shop.
headache|đau đầu|🤕|I have a headache today.
stomach-ache|đau bụng|😣|He has a stomach-ache.
toothache|đau răng|🦷|She has a toothache.
cough|ho, cơn ho|😷|The boy has a cough.
cold|cảm lạnh|🤧|I have a cold.
doctor|bác sĩ|🧑‍⚕️|The doctor is talking to Mum.
hospital|bệnh viện|🏥|My dad works at a hospital.
medicine|thuốc|💊|The medicine is in a small bottle.`,
    `bank|ngân hàng|🏦|The bank is next to the café.
café|quán cà phê|☕|We have lunch at the café.
cinema|rạp chiếu phim|🎬|The cinema is opposite the park.
hospital|bệnh viện|🏥|The hospital is near the station.
library|thư viện|📚|The library is behind the school.
market|chợ|🧺|We walk to the market.
station|nhà ga|🚉|The train is at the station.
supermarket|siêu thị|🛒|The supermarket is very big.
swimming pool|bể bơi|🏊|The swimming pool is open today.
bus|xe buýt|🚌|The bus stops near my house.
train|tàu hỏa|🚆|We go to the city by train.
taxi|xe taxi|🚕|The taxi is yellow.
helicopter|máy bay trực thăng|🚁|The helicopter is above the town.
motorbike|xe máy|🛵|My uncle has a motorbike.
bicycle|xe đạp|🚲|My bicycle is green.
between|ở giữa hai đối tượng|↔️|The shop is between the bank and the café.
opposite|đối diện|🏘️|My home is opposite the school.
behind|phía sau|🌳|The boy is behind the tree.
above|ở phía trên|⬆️|The clock is above the door.
below|ở phía dưới|⬇️|The picture is below the clock.`,
    `badminton|cầu lông|🏸|We play badminton after school.
basketball|bóng rổ|🏀|She is good at basketball.
football|bóng đá|⚽|My friends love football.
hockey|khúc côn cầu|🏑|They play hockey on Fridays.
tennis|quần vợt|🎾|I play tennis with my cousin.
swimming|môn bơi|🏊|Swimming is my favourite sport.
skating|trượt patin, trượt băng|🛼|We go skating in the park.
fishing|câu cá|🎣|Grandpa likes fishing.
sailing|chèo thuyền buồm|⛵|We go sailing on the lake.
climbing|leo trèo|🧗|Climbing is exciting.
riding|cưỡi, đi xe|🚴|I like riding my bike.
kick|đá|🦶|Kick the ball to me.
throw|ném|🤾|She can throw the ball far.
team|đội|👥|There are five children in our team.
player|người chơi, cầu thủ|⛹️|He is a good player.
race|cuộc đua|🏁|The race starts at ten.
fast|nhanh|🐆|This animal is fast.
slow|chậm|🐢|The turtle is slow.
strong|khỏe|💪|The horse is strong.
win|chiến thắng|🏆|We want to win the game.`,
    `holiday|kỳ nghỉ|🌴|Our holiday was wonderful.
trip|chuyến đi|🗺️|We went on a school trip.
hotel|khách sạn|🏨|The hotel had a small pool.
beach|bãi biển|🏖️|We played on the beach.
airport|sân bay|🛫|We arrived at the airport early.
suitcase|va li|🧳|My suitcase is blue.
ticket|vé|🎟️|Dad bought a train ticket.
picnic|buổi dã ngoại|🧺|We had a picnic by the lake.
countryside|vùng nông thôn|🌾|My grandma lives in the countryside.
museum|bảo tàng|🏛️|We saw old boats in the museum.
travel|đi lại, du lịch|🚆|I like to travel by train.
visit|thăm|👋|We visited our cousins.
arrive|đến nơi|📍|We arrive at school at eight.
carry|mang, xách|👜|Please carry this bag.
pack|xếp đồ vào hành lý|🧳|I pack my clothes before a trip.
sail|đi thuyền buồm|⛵|They sail on the lake.
sunny|có nắng|☀️|It was sunny yesterday.
cloudy|nhiều mây|☁️|It is cloudy today.
windy|có gió|🌬️|It was windy at the beach.
rain|mưa|🌧️|The rain stopped in the afternoon.`,
    `name|tên|🏷️|Please write your name here.
number|số|🔢|What is your phone number?
address|địa chỉ|🏠|This is my home address.
thirteen|mười ba|🔢|There are thirteen books.
thirty|ba mươi|🔢|The bus has thirty seats.
fifteen|mười lăm|🔢|My sister has fifteen stickers.
fifty|năm mươi|🔢|There are fifty pages.
purple|màu tím|🟣|The girl has a purple hat.
straight|thẳng|📏|He has straight hair.
curly|xoăn|🧑‍🦱|My aunt has curly hair.
striped|có sọc|👕|The boy has a striped shirt.
carefully|một cách cẩn thận|🔎|Read the question carefully.
quietly|một cách yên lặng|🤫|Please walk quietly.
quickly|một cách nhanh chóng|🏃|The rabbit runs quickly.
yesterday|hôm qua|📅|Yesterday I played tennis.
today|hôm nay|📆|Today we are reading a story.
because|bởi vì|💬|I like cats because they are funny.
before|trước|⏮️|Wash your hands before lunch.
after|sau|⏭️|We play after school.
different|khác nhau|🔀|These two pictures are different.`,
    `remember|nhớ|💡|I remember this word.
question|câu hỏi|❓|Read the question first.
answer|câu trả lời|💬|Write your answer here.
picture|bức tranh|🖼️|There is a dog in the picture.
story|câu chuyện|📖|This story is about a rabbit.
sentence|câu văn|✏️|Write one sentence about the boy.
mistake|lỗi sai|🩹|I can learn from a mistake.
practise|luyện tập|🎯|We practise English every day.
listen|lắng nghe|🎧|Listen to the whole sentence.
describe|miêu tả|🗣️|Describe the animal to your friend.
choose|chọn|☑️|Choose one picture.
finish|hoàn thành|🏁|I finish my homework at five.
ready|sẵn sàng|🎒|I am ready for my lesson.
excited|hào hứng|🤩|We are excited about the trip.
happy|vui vẻ|😊|I am happy to see my friend.
tired|mệt|🥱|I am tired after the game.
easy|dễ|🪶|This question is easy for me.
difficult|khó|🧩|This word is difficult to spell.
first|đầu tiên|🥇|First, I read the story.
finally|cuối cùng|🏁|Finally, we went home.`
  ];
  const weekInfo = [
    ['Home, Family & School', 'A place to begin', '🏡', 'Gặp gỡ gia đình, khám phá ngôi trường và nói về bản thân.', 'To be · Have got · There is/are · Present Simple', 'Dùng am/is/are để giới thiệu; have/has got để nói về sở hữu. There is + số ít, there are + số nhiều. Thói quen dùng hiện tại đơn; he/she/it thêm -s hoặc -es.', ['I am eight years old.', 'She has got a red bag.', 'There are two books on the desk.']],
    ['Animals & Nature', 'Into the wild', '🐼', 'Theo chân các loài vật, kể về thói quen và điều đang diễn ra.', 'Present Simple vs Present Continuous', 'Every day thường đi với hiện tại đơn. Now diễn tả việc đang xảy ra: am/is/are + động từ-ing. Vị trí có thể diễn tả bằng in, under, behind, next to.', ['The monkey eats fruit every day.', 'The monkey is eating a banana now.', 'The rabbit is behind the tree.']],
    ['Food, Shopping & Health', 'A delicious discovery', '🥑', 'Ghé chợ, chọn bữa ăn yêu thích và học cách nói khi không khỏe.', 'Some/any · Much/many · Must · Have to', 'Some thường dùng trong câu khẳng định, any trong phủ định/câu hỏi. Many + danh từ đếm được số nhiều; much + không đếm được. Must và have to diễn tả điều cần làm; mustn’t là không được làm.', ['There is some milk.', 'How many apples have you got?', 'We must wash our hands.']],
    ['Town, Transport & Prepositions', 'Around our little town', '🚌', 'Đi một vòng thị trấn và tìm vị trí các đồ vật.', 'Prepositions of place · Where questions', 'Next to: bên cạnh; opposite: đối diện; between: giữa hai đối tượng; behind: phía sau; in front of: phía trước; above/below: phía trên/dưới; near: gần.', ['The bank is next to the café.', 'The ball is under the chair.', 'The clock is above the door.']],
    ['Sport, Hobbies & Comparisons', 'Ready, set, play!', '🏸', 'Chơi thể thao, so sánh và tìm điểm khác biệt giữa hai tranh.', 'Comparatives · Superlatives · Like + -ing', 'So sánh hơn: tính từ ngắn + -er + than. So sánh nhất: the + tính từ ngắn + -est. Big → bigger/biggest; good → better/best. Sau like có thể dùng động từ-ing.', ['A horse is faster than a turtle.', 'This is the biggest ball.', 'I like playing badminton.']],
    ['Holidays & Past Simple', 'Oh, the places we’ll go', '🏖️', 'Xếp hành lý và kể lại một chuyến đi đáng nhớ.', 'Past Simple · Story words', 'Việc đã kết thúc dùng quá khứ đơn: played, watched, visited; go → went, see → saw, eat → ate, drink → drank, take → took, make → made, buy → bought, get → got, have → had, come → came. Sau did/didn’t dùng động từ nguyên mẫu.', ['We visited a museum yesterday.', 'I went to the beach.', 'Did you take a photo?']],
    ['Movers Review', 'Look how far you’ve come', '🧭', 'Ôn qua trò chơi: tên, số, đánh vần, đọc truyện và kể chuyện.', 'Review: present · past · questions · comparisons', 'Tìm dấu hiệu thời gian trước khi chọn động từ. Đọc cả câu, kiểm tra số ít/số nhiều và từ nối. Luyện phân biệt số 13/30 và 15/50 khi nghe.', ['She is reading now.', 'We bought some fruit yesterday.', 'My bag is smaller than yours.']],
    ['Mock Test & Celebration', 'Your next big step', '🏆', 'Luyện hai bài tổng hợp, ôn câu sai và ghi nhận tiến bộ.', 'Review your own tricky spots', 'Ôn lại lỗi của chính con. Kiểm tra: câu đã có chủ ngữ và động từ chưa? Sau did dùng nguyên mẫu chưa? Từ có thiếu chữ hoặc -s không? Làm từng câu bình tĩnh.', ['There are three children.', 'He didn’t go to the park.', 'First, they played. Then, they ate.']]
  ];
  // prompt | correct answer | two distractors | explanation
  const grammarRows = [
    `My sister ___ eight.|is|am|are|My sister là số ít: dùng is.
I ___ a student.|am|is|are|I đi với am.
They ___ my cousins.|are|is|am|They đi với are.
He ___ got a blue bag.|has|have|is|He đi với has got.
We ___ got two cats.|have|has|are|We đi với have got.
There ___ a book on the desk.|is|are|am|A book là số ít.
There ___ three chairs.|are|is|has|Three chairs là số nhiều.
She ___ to school every day.|walks|walk|walking|She + động từ thêm -s trong hiện tại đơn.
___ is your teacher? Ms Green.|Who|Where|When|Who hỏi về người.
___ is your classroom? Upstairs.|Where|Who|How old|Where hỏi vị trí.
My dad ___ work on Sundays.|doesn't|don't|isn't|He/my dad: doesn't + động từ nguyên mẫu.
___ you like English?|Do|Does|Are|Do + you + động từ nguyên mẫu.`,
    `The monkey ___ a banana now.|is eating|eats|eat|Now: is + eating.
Dolphins ___ in the sea.|live|lives|is living|Sự thật chung, chủ ngữ số nhiều: live.
Look! The birds ___.|are flying|flies|flew|Look! gợi việc đang diễn ra: are flying.
A panda ___ plants every day.|eats|eat|is eat|A panda là số ít: eats.
I ___ the rabbits now.|am feeding|feed|feeds|I + am + feeding.
The frog ___ under the leaf.|is hiding|hide|are hiding|The frog là số ít: is hiding.
___ those fish swimming?|Are|Is|Do|Those fish chỉ nhiều con cá: Are.
My cat usually ___ on the sofa.|sleeps|sleep|is sleep|Usually diễn tả thói quen; my cat + sleeps.
We ___ to the lake every Saturday.|go|goes|going|We + go cho thói quen.
The shark ___ flying. It is swimming.|isn't|aren't|doesn't|Isn't + động từ-ing.
What ___ the kangaroo doing?|is|are|do|Một con kangaroo: What is ... doing?
___ bats fly at night?|Do|Does|Are|Câu hỏi thói quen: Do + bats + fly.`,
    `There is ___ cheese in the fridge.|some|any|many|Câu khẳng định: some cheese.
We haven't got ___ milk.|any|some|many|Phủ định thường dùng any.
How ___ apples do you want?|many|much|any|Apples đếm được số nhiều: many.
How ___ water is there?|much|many|some|Water không đếm được: much.
There ___ some soup in the bowl.|is|are|have|Soup không đếm được: is.
There ___ five sandwiches.|are|is|has|Five sandwiches số nhiều: are.
You ___ run in the hospital. It isn't allowed.|mustn't|must|have to|Mustn't nghĩa là không được làm.
We ___ wash our hands before lunch.|must|mustn't|are|Must + động từ nguyên mẫu.
She ___ to do her homework.|has|have|must|She has to + động từ.
I would like ___ banana.|a|an|any|Banana bắt đầu bằng âm phụ âm: a.
Have you got ___ eggs?|any|much|a|Câu hỏi về danh từ số nhiều: any eggs.
He ___ got a toothache.|has|have|is|He has got a toothache.`,
    `The ball is ___ the box. You cannot see it.|in|above|next to|Ở bên trong hộp: in.
The picture is ___ the wall.|on|in|under|Tranh treo trên tường: on.
The shoes are ___ the bed, on the floor.|under|above|on|Giày ở sàn bên dưới giường: under.
The shop is ___ the bank and the café.|between|under|in|Between A and B: ở giữa A và B.
The café is ___ to the bank.|next|opposite|between|Cụm đúng là next to.
The bank is across the road, ___ the school.|opposite|inside|between|Đối diện qua đường: opposite.
The helicopter is high ___ the town.|above|below|under|Ở cao phía trên: above.
The clock is above the picture. The picture is ___ it.|below|above|in|Đảo quan hệ above thành below.
The boy stands ___ front of the bus.|in|on|at|Cụm in front of: phía trước.
___ is the station? Near the park.|Where|Who|When|Where hỏi vị trí.
We go to school ___ bus.|by|on|at|By bus: bằng xe buýt.
The library is not far away. It is ___ my house.|near|under|between|Near nghĩa là gần.`,
    `A horse is ___ than a turtle.|faster|fastest|fast|So sánh hai đối tượng và có than: faster.
This is the ___ ball in the shop.|biggest|bigger|big|The + so sánh nhất; big nhân đôi g.
My bag is ___ than yours.|smaller|smallest|small|Có than: smaller.
She is the ___ player in our team.|best|better|good|Good → better → the best.
I am ___ at tennis than last year.|better|best|good|So sánh tiến bộ với năm trước: better.
The snail is ___ than the rabbit.|slower|slowest|slow|So sánh hơn: slower than.
I like ___ badminton.|playing|play|played|Like + động từ-ing.
He ___ swimming on Saturdays.|goes|go|going|He goes swimming: thói quen.
___ you throw the ball?|Can|Are|Have|Can + chủ ngữ + động từ nguyên mẫu.
This is the ___ runner in the class.|fastest|faster|fast|Nhanh nhất cả lớp: the fastest.
My sister is ___ than me.|taller|tallest|tall|So sánh hai người: taller.
They love ___ their bikes.|riding|ride|rode|Love + động từ-ing.`,
    `Yesterday I ___ to the beach.|went|go|going|Go có quá khứ bất quy tắc went.
We ___ a museum last week.|visited|visit|visiting|Visit thêm -ed: visited.
She ___ an apple yesterday.|ate|eat|eats|Eat → ate.
Dad ___ some photos on our trip.|took|take|takes|Take → took.
I ___ a funny film last night.|watched|watch|watching|Watch → watched.
We ___ a picnic yesterday.|had|have|has|Have → had.
Did you ___ your bag?|pack|packed|packing|Sau did dùng pack nguyên mẫu.
He didn't ___ a ticket.|buy|bought|buying|Sau didn't dùng buy.
They ___ tired after the trip.|were|was|are|Quá khứ của are là were.
It ___ sunny yesterday.|was|were|is|It + was trong quá khứ.
She ___ some water after the walk.|drank|drink|drinks|Drink → drank.
I ___ a little boat yesterday.|made|make|making|Make → made.`,
    `She ___ a book now.|is reading|reads|read|Now: hành động đang diễn ra.
We ___ to the park yesterday.|went|go|going|Yesterday: dùng quá khứ went.
There ___ two bags on the floor.|are|is|has|Two bags số nhiều: are.
How ___ milk do you want?|much|many|a|Milk không đếm được.
My bike is ___ than yours.|faster|fastest|fast|Than đi với so sánh hơn.
___ is your best friend? Anna.|Who|Where|When|Hỏi người: Who.
He ___ got curly hair.|has|have|is|He has got.
Did they ___ the game?|win|won|winning|Did + động từ nguyên mẫu.
I like apples ___ they are sweet.|because|but|or|Because giới thiệu lý do.
The cat is between the chair ___ the table.|and|but|or|Between A and B.
She ___ breakfast at seven every day.|has|have|having|She has cho thói quen.
We must ___ carefully.|listen|listening|listened|Must + động từ nguyên mẫu.`,
    `Look! The children ___ in the park.|are playing|plays|played|Look gợi hành động đang xảy ra; children số nhiều.
My brother ___ to school every morning.|walks|walk|walking|Every morning: thói quen; he + walks.
Yesterday we ___ a dolphin.|saw|see|seeing|See → saw.
There isn't ___ bread.|any|many|a|Câu phủ định: any bread.
How ___ children are there?|many|much|any|Children đếm được số nhiều.
The red car is ___ than the blue car.|smaller|smallest|small|So sánh hơn có than.
The boy ___ a photo yesterday.|took|take|taken|Take → took.
Did she ___ home early?|come|came|coming|Did + come nguyên mẫu.
I ___ happy after the trip yesterday.|was|were|am|I was trong quá khứ.
The bag is ___ to the door.|next|between|opposite|Next to là cụm đầy đủ.
He ___ to finish his homework.|has|have|is|He has to + động từ.
This is the ___ day of my holiday.|best|better|good|The best là so sánh nhất của good.`
  ];
  // Each pair of short passages supplies ten original reading activities per week.
  const readingPacks = [
    [
      ['Mia’s school day', 'Mia is eight. She walks to school with her cousin Tom. Her classroom is upstairs. There are twenty desks in it. Mia likes English because the stories are funny.', [['How old is Mia?', 'eight', 'nine', 'ten'], ['Who walks with Mia?', 'her cousin Tom', 'her uncle', 'her teacher'], ['Where is her classroom?', 'upstairs', 'downstairs', 'outside'], ['How many desks are there?', 'twenty', 'twelve', 'ten'], ['Mia likes English stories.', 'True', 'False']]],
      ['An afternoon at home', 'Ben lives with his parents and his sister. After school, he does his homework at the kitchen table. Then he plays with his sister on the balcony. His dad makes dinner. Today they have soup.', [['Who does Ben live with?', 'his parents and sister', 'his grandparents', 'his uncle'], ['Ben does his homework at the kitchen ___.', 'table', 'door', 'window'], ['What does Ben do after his homework?', 'plays with his sister', 'goes to school', 'reads in the library'], ['Who makes dinner?', 'his dad', 'his sister', 'Ben'], ['What do they eat today?', 'soup', 'pancakes', 'fish']]]
    ],
    [
      ['A day by the lake', 'Kim and her dad are by a lake. Three ducks are swimming. A small frog is hiding under a leaf. Kim takes a picture of the frog. They eat their lunch under a big tree.', [['Where are Kim and her dad?', 'by a lake', 'at school', 'in a shop'], ['How many ducks are swimming?', 'three', 'two', 'four'], ['The frog is under a ___.', 'leaf', 'boat', 'bag'], ['What does Kim photograph?', 'the frog', 'her lunch', 'a whale'], ['They eat lunch under a tree.', 'True', 'False']]],
      ['The animal club', 'Our animal club meets on Friday. We read about dolphins this week. Dolphins live in water, but they are not fish. Next week we want to learn about bats. Leo brings a book with pictures of bats.', [['When does the club meet?', 'on Friday', 'on Monday', 'on Sunday'], ['This week they read about ___.', 'dolphins', 'pandas', 'cats'], ['Dolphins are fish.', 'False', 'True'], ['What do they want to learn about next?', 'bats', 'sharks', 'frogs'], ['Who brings a book?', 'Leo', 'Kim', 'the doctor']]]
    ],
    [
      ['At the market', 'On Saturday, Sam goes to the market with Mum. They buy six apples and some cheese. Sam wants pancakes, but there are no pancakes at the market. At home, Mum makes pancakes for lunch. Sam helps her.', [['When do they go to the market?', 'on Saturday', 'on Tuesday', 'on Friday'], ['How many apples do they buy?', 'six', 'seven', 'ten'], ['They buy some ___.', 'cheese', 'rice', 'fish'], ['They buy pancakes at the market.', 'False', 'True'], ['Who helps Mum at home?', 'Sam', 'Dad', 'Grandpa']]],
      ['A quiet afternoon', 'Lily has a cold today. She stays at home with Dad. She drinks some water and reads a story about a rabbit. Her friend May brings her a picture after school. Lily is happy to see May.', [['Why is Lily at home?', 'she has a cold', 'it is Sunday', 'she lost her bag'], ['Who is with Lily at home?', 'Dad', 'her teacher', 'her cousin'], ['What does she drink?', 'water', 'milk', 'juice'], ['The story is about a ___.', 'rabbit', 'dolphin', 'horse'], ['What does May bring?', 'a picture', 'a sandwich', 'a toy']]]
    ],
    [
      ['Our town', 'Our town has a library next to a café. The cinema is opposite the library. A small park is behind the café. We go to the park by bicycle. There is a swimming pool near the station.', [['What is next to the library?', 'a café', 'a hospital', 'a bank'], ['The cinema is ___ the library.', 'opposite', 'inside', 'under'], ['Where is the park?', 'behind the café', 'in the library', 'under the station'], ['How do they go to the park?', 'by bicycle', 'by taxi', 'by train'], ['The pool is near the station.', 'True', 'False']]],
      ['A blue bag', 'Eva is at the bus station with her uncle. Her blue bag is under her chair. A red bag is on the chair next to her. Their bus arrives at ten. They are going to visit Grandma in a small village.', [['Where is Eva?', 'at the bus station', 'at the airport', 'at school'], ['Who is with Eva?', 'her uncle', 'her aunt', 'her brother'], ['Where is her blue bag?', 'under her chair', 'on the bus', 'above the door'], ['The bag on the next chair is ___.', 'red', 'blue', 'yellow'], ['Who are they going to visit?', 'Grandma', 'a teacher', 'a doctor']]]
    ],
    [
      ['Sports day', 'Today is sports day. Jack runs in a race with five other children. His sister Amy plays basketball. Jack is faster than his friend Dan, but Leo wins the race. After the games, they all eat oranges.', [['What day is it?', 'sports day', 'a holiday', 'a school trip'], ['How many children run in the race altogether?', 'six', 'five', 'seven'], ['What does Amy play?', 'basketball', 'hockey', 'tennis'], ['Who wins the race?', 'Leo', 'Jack', 'Dan'], ['They eat oranges after the games.', 'True', 'False']]],
      ['Two friends', 'Nina likes swimming and her friend Fred likes skating. On Sundays they play badminton together. Nina has a green racket. Fred has a blue one. Today Fred wins, but they both have fun.', [['What does Nina like?', 'swimming', 'skating', 'fishing'], ['What does Fred like?', 'skating', 'sailing', 'climbing'], ['They play badminton on ___.', 'Sundays', 'Mondays', 'Fridays'], ['What colour is Nina’s racket?', 'green', 'blue', 'red'], ['Who wins today?', 'Fred', 'Nina', 'their teacher']]]
    ],
    [
      ['Our seaside holiday', 'Last week, Ruby went to the beach with her family. They stayed in a small hotel. On Monday it was windy, so they visited a museum. On Tuesday it was sunny. Ruby swam and her brother made a sandcastle.', [['Where did Ruby go last week?', 'to the beach', 'to a farm', 'to the forest'], ['Where did the family stay?', 'in a small hotel', 'in a tent', 'at school'], ['What was the weather like on Monday?', 'windy', 'sunny', 'snowy'], ['What did they visit on Monday?', 'a museum', 'a market', 'an airport'], ['Who made a sandcastle?', 'Ruby’s brother', 'Ruby', 'her dad']]],
      ['A picnic surprise', 'Yesterday, Max and his aunt had a picnic by a river. Max packed sandwiches and his aunt carried the drinks. A little dog came to their blanket. It had a ball in its mouth. Max played with the dog after lunch.', [['When was the picnic?', 'yesterday', 'last month', 'this morning'], ['Where did they have it?', 'by a river', 'in a café', 'at school'], ['What did Max pack?', 'sandwiches', 'drinks', 'books'], ['The dog had a ___ in its mouth.', 'ball', 'sandwich', 'shoe'], ['Max played with the dog before lunch.', 'False', 'True']]]
    ],
    [
      ['The missing book', 'On Wednesday, Alex could not find his library book. He looked under his bed and behind the sofa. Then his sister found it in his school bag. Alex laughed. He took the book back to the library after lunch.', [['What was missing?', 'a library book', 'a toy', 'a ticket'], ['When did this happen?', 'on Wednesday', 'on Saturday', 'on Monday'], ['Who found the book?', 'his sister', 'his dad', 'Alex'], ['Where was the book?', 'in his school bag', 'under the bed', 'behind the sofa'], ['He returned the book after lunch.', 'True', 'False']]],
      ['The school garden', 'Our class has a small garden behind the school. There are fifteen tomato plants. We water them every morning. Yesterday we found a frog near the plants. We watched it quietly and then went to our classroom.', [['Where is the garden?', 'behind the school', 'opposite the bank', 'on the roof'], ['How many tomato plants are there?', 'fifteen', 'fifty', 'five'], ['When do they water the plants?', 'every morning', 'only on Sundays', 'at night'], ['What did they find yesterday?', 'a frog', 'a bat', 'a rabbit'], ['They watched the animal ___.', 'quietly', 'angrily', 'sadly']]]
    ],
    [
      ['A new friend', 'Ella moved to a new school on Monday. At lunch, a girl called Zoe sat next to her. They both liked drawing animals. After school, they drew a big whale together. Ella felt happy because she had a new friend.', [['When did Ella move to the new school?', 'on Monday', 'on Friday', 'on Sunday'], ['Who sat next to Ella?', 'Zoe', 'her dad', 'her cousin'], ['They both liked drawing ___.', 'animals', 'cars', 'houses'], ['What did they draw together?', 'a whale', 'a panda', 'a shark'], ['Why was Ella happy?', 'she had a new friend', 'she won a race', 'she bought a toy']]],
      ['The little boat', 'On Sunday, Tom made a little boat with his grandpa. They painted it yellow. Then they took it to the lake. The boat sailed slowly near the ducks. Tom took three photos and showed them to Mum at home.', [['Who helped Tom make the boat?', 'his grandpa', 'his teacher', 'his sister'], ['What colour was the boat?', 'yellow', 'green', 'blue'], ['Where did they take it?', 'to the lake', 'to the sea', 'to the swimming pool'], ['The boat sailed quickly.', 'False', 'True'], ['How many photos did Tom take?', 'three', 'thirteen', 'thirty']]]
    ]
  ];
  // Ten listening items per week: contextual choice, number, spelling, location and matching.
  const listeningPacks = [
    [
      ['Which person is Anna?', 'Anna is the girl with a red bag. She is reading a book.', 'girl with a red bag', ['girl with a blue bag', 'boy with a red bag'], 'People'],
      ['How many desks are there? Write a number.', 'There are thirteen desks in our classroom. Thirteen, not thirty.', '13', null, 'Listening numbers'],
      ['Write the boy’s name.', 'My name is Ben. That is B, E, N.', 'Ben', null, 'Listening spelling'],
      ['Where is the book?', 'Is the book on the desk? No, it is under the chair.', 'under the chair', ['on the desk', 'in the bag'], 'Listening location'],
      ['Choose the school object.', 'I use this to write. It is a pencil, not a pen.', '✏️ pencil', ['📏 ruler', '📚 book'], 'Picture choice'],
      ['Match Tom to his activity.', 'Tom is drawing. His sister is reading and his dad is cooking.', 'drawing', ['reading', 'cooking'], 'Listening matching'],
      ['Where is the classroom?', 'Our classroom is upstairs, next to the music room.', 'upstairs', ['downstairs', 'outside'], 'Listening location'],
      ['What is her favourite subject?', 'I like maths, but my favourite subject is English.', 'English', ['maths', 'music'], 'Details'],
      ['How many cousins has she got? Write a number.', 'I have four cousins. Two boys and two girls.', '4', null, 'Listening numbers'],
      ['Write the girl’s name.', 'This is May. Her name is M, A, Y.', 'May', null, 'Listening spelling']
    ],
    [
      ['Which animal are they watching?', 'Look at the dolphin! It is jumping near our boat.', '🐬 dolphin', ['🐋 whale', '🦈 shark'], 'Picture choice'],
      ['How many ducks are on the lake? Write a number.', 'There are fifteen ducks on the lake. Fifteen.', '15', null, 'Listening numbers'],
      ['Write the dog’s name.', 'My dog is called Pat. P, A, T.', 'Pat', null, 'Listening spelling'],
      ['Where is the frog?', 'The frog is not on the rock. It is under a leaf.', 'under a leaf', ['on a rock', 'in a boat'], 'Listening location'],
      ['What is the panda doing?', 'The panda is eating. The monkey is climbing a tree.', 'eating', ['climbing', 'sleeping'], 'Actions'],
      ['Match Kim to her favourite animal.', 'Leo likes sharks. Kim likes kangaroos. May likes pandas.', 'kangaroo', ['shark', 'panda'], 'Listening matching'],
      ['Where are the cows?', 'The cows are in the field, next to the river.', 'in the field', ['in the forest', 'on the mountain'], 'Listening location'],
      ['Which animal can fly?', 'A bat can fly. It often flies at night.', '🦇 bat', ['🐸 frog', '🐼 panda'], 'Picture choice'],
      ['How many rabbits are there? Write a number.', 'I can see twelve rabbits, not twenty.', '12', null, 'Listening numbers'],
      ['Write the cat’s name.', 'Our cat is called Sam. S, A, M.', 'Sam', null, 'Listening spelling']
    ],
    [
      ['What does the child want for lunch?', 'Would you like soup? No, thank you. I would like a sandwich.', '🥪 sandwich', ['🥣 soup', '🍜 noodles'], 'Picture choice'],
      ['How many apples do they buy? Write a number.', 'We need fourteen apples for the class. Fourteen.', '14', null, 'Listening numbers'],
      ['Write the doctor’s surname.', 'The doctor is Doctor Hill. H, I, L, L.', 'Hill', null, 'Listening spelling'],
      ['Where is the cheese?', 'The cheese is in the fridge, above the vegetables.', 'in the fridge', ['on the table', 'in the bag'], 'Listening location'],
      ['What is the matter with the boy?', 'Have you got a headache? No, I have got a toothache.', 'toothache', ['headache', 'cold'], 'Details'],
      ['Match Lily to her breakfast.', 'Ben has bread. Lily has pancakes. Tom has fruit.', 'pancakes', ['bread', 'fruit'], 'Listening matching'],
      ['Where do they buy fruit?', 'We buy our fruit at the market, not at the supermarket.', 'market', ['supermarket', 'café'], 'Details'],
      ['Which drink does she choose?', 'I do not want milk today. Can I have some water, please?', '💧 water', ['🥛 milk', '🧃 juice'], 'Picture choice'],
      ['How many sandwiches are there? Write a number.', 'There are thirty sandwiches on the table. Thirty.', '30', null, 'Listening numbers'],
      ['Write the shop owner’s name.', 'Her name is Sue. S, U, E.', 'Sue', null, 'Listening spelling']
    ],
    [
      ['How does Eva go to town?', 'Eva usually walks, but today she is going by bus.', '🚌 bus', ['🚲 bicycle', '🚕 taxi'], 'Picture choice'],
      ['What is the bus number? Write a number.', 'We need bus fifty. That is five, zero.', '50', null, 'Listening numbers'],
      ['Write the street name.', 'The library is on Park Street. Park is P, A, R, K.', 'Park', null, 'Listening spelling'],
      ['Where is the bank?', 'The bank is next to the cinema, opposite the station.', 'next to the cinema', ['behind the cinema', 'inside the station'], 'Listening location'],
      ['Where is the helicopter?', 'Look up! There is a helicopter above the hospital.', 'above the hospital', ['below the bridge', 'in the park'], 'Listening location'],
      ['Match Tom to his transport.', 'Anna takes a taxi. Tom rides his bicycle. Ben takes a train.', 'bicycle', ['taxi', 'train'], 'Listening matching'],
      ['Where is the café?', 'The café is between the shop and the library.', 'between the shop and library', ['behind the bank', 'opposite the school'], 'Listening location'],
      ['Which place are they going to?', 'We want to watch a film. Let us go to the cinema.', '🎬 cinema', ['🏊 swimming pool', '🏦 bank'], 'Picture choice'],
      ['What time does the train leave? Write the hour.', 'The train leaves at eleven o’clock, not twelve.', '11', null, 'Listening numbers'],
      ['Write the driver’s name.', 'Our driver is called Dan. D, A, N.', 'Dan', null, 'Listening spelling']
    ],
    [
      ['Which sport does she play today?', 'I usually play tennis. Today I am playing badminton.', '🏸 badminton', ['🎾 tennis', '🏀 basketball'], 'Picture choice'],
      ['How many players are at practice? Write a number.', 'There are sixteen players at practice today. Sixteen.', '16', null, 'Listening numbers'],
      ['Write the player’s name.', 'The new player is called Fred. F, R, E, D.', 'Fred', null, 'Listening spelling'],
      ['Where is the ball?', 'The ball is behind the big tree, not under the bench.', 'behind the tree', ['under the bench', 'in the bag'], 'Listening location'],
      ['Who is the fastest?', 'Jack is faster than Ben, but Leo is the fastest of all.', 'Leo', ['Jack', 'Ben'], 'Comparisons'],
      ['Match Mia to her hobby.', 'Dan likes fishing. Mia likes skating. Sue likes swimming.', 'skating', ['fishing', 'swimming'], 'Listening matching'],
      ['What colour is the boy’s shirt?', 'The boy playing hockey is wearing a purple shirt.', 'purple', ['green', 'red'], 'Descriptions'],
      ['Which activity do they choose?', 'It is windy. We can go sailing on the lake.', '⛵ sailing', ['🎣 fishing', '🧗 climbing'], 'Picture choice'],
      ['How many points did the team get? Write a number.', 'Our team got twenty points. Twenty.', '20', null, 'Listening numbers'],
      ['Write the coach’s name.', 'Our coach is called Kim. K, I, M.', 'Kim', null, 'Listening spelling']
    ],
    [
      ['Where did they go on Monday?', 'We went to the beach on Sunday. On Monday we visited a museum.', '🏛️ museum', ['🏖️ beach', '🏝️ island'], 'Picture choice'],
      ['What was their room number? Write a number.', 'Our hotel room was number eighteen. Eighteen.', '18', null, 'Listening numbers'],
      ['Write the hotel name.', 'We stayed at the Star Hotel. Star is S, T, A, R.', 'Star', null, 'Listening spelling'],
      ['Where is the suitcase?', 'Your suitcase is next to the door. The small bag is on the bed.', 'next to the door', ['on the bed', 'under the chair'], 'Listening location'],
      ['What was the weather like yesterday?', 'It is sunny today, but yesterday it was cloudy.', 'cloudy', ['sunny', 'snowy'], 'Time details'],
      ['Match Ruby to her holiday activity.', 'Max went swimming. Ruby took photos. Eva played tennis.', 'taking photos', ['swimming', 'playing tennis'], 'Listening matching'],
      ['How did they travel?', 'We wanted to go by train, but we went by bus.', 'bus', ['train', 'plane'], 'Details'],
      ['What did he buy?', 'I bought a ticket for the boat trip. I did not buy a toy.', '🎟️ ticket', ['🧸 toy', '📚 book'], 'Picture choice'],
      ['How many photos did she take? Write a number.', 'I took forty photos at the beach. Forty.', '40', null, 'Listening numbers'],
      ['Write the girl’s name.', 'My friend is called Jane. J, A, N, E.', 'Jane', null, 'Listening spelling']
    ],
    [
      ['Which boy is Jack?', 'Jack has curly hair and a green shirt. The boy in blue is Tom.', 'curly hair, green shirt', ['straight hair, green shirt', 'curly hair, blue shirt'], 'Descriptions'],
      ['How many stickers has she got? Write a number.', 'I have thirteen stickers. My sister has thirty.', '13', null, 'Listening numbers'],
      ['Write the surname.', 'My surname is Brown. B, R, O, W, N.', 'Brown', null, 'Listening spelling'],
      ['Where is the purple hat?', 'The purple hat is between the bag and the box.', 'between the bag and box', ['in the box', 'under the bag'], 'Listening location'],
      ['What did they do yesterday?', 'Today we are swimming. Yesterday we played badminton.', 'played badminton', ['went swimming', 'went fishing'], 'Time details'],
      ['Match Anna to her book.', 'Tom has a book about boats. Anna has one about animals. Ben has one about sport.', 'animals', ['boats', 'sport'], 'Listening matching'],
      ['Which animal is smaller?', 'The brown dog is smaller than the black dog.', 'brown dog', ['black dog', 'they are the same size'], 'Comparisons'],
      ['Which food does he choose?', 'I like noodles, but today I would like soup.', '🥣 soup', ['🍜 noodles', '🥞 pancakes'], 'Picture choice'],
      ['How many chairs are there? Write a number.', 'There are fifty chairs in the hall, not fifteen.', '50', null, 'Listening numbers'],
      ['Write the street name.', 'I live on Green Street. G, R, E, E, N.', 'Green', null, 'Listening spelling']
    ],
    [
      ['What is the girl doing?', 'The girl with the yellow bag is drawing a picture. Her brother is reading.', 'drawing', ['reading', 'singing'], 'Actions'],
      ['How many books did he read? Write a number.', 'I read fifteen books this summer. Fifteen.', '15', null, 'Listening numbers'],
      ['Write the boy’s name.', 'This is Bill. B, I, L, L.', 'Bill', null, 'Listening spelling'],
      ['Where is the small boat?', 'The little boat is under the bridge, near the ducks.', 'under the bridge', ['on the bridge', 'behind the house'], 'Listening location'],
      ['When did they visit the zoo?', 'We did not go on Saturday. We visited the zoo on Sunday.', 'Sunday', ['Saturday', 'Friday'], 'Time details'],
      ['Match Zoe to her picture.', 'Ella drew a horse. Zoe drew a whale. Tom drew a panda.', 'whale', ['horse', 'panda'], 'Listening matching'],
      ['Who has the biggest bag?', 'My bag is bigger than Ben’s. But Dad has the biggest bag.', 'Dad', ['Ben', 'the speaker'], 'Comparisons'],
      ['What did they eat after the game?', 'We ate oranges after the game. We had sandwiches before it.', '🍊 oranges', ['🥪 sandwiches', '🍎 apples'], 'Picture choice'],
      ['How many photos did Tom take? Write a number.', 'Tom took three photos. His grandpa took thirteen.', '3', null, 'Listening numbers'],
      ['Write the name of the lake.', 'It is called Blue Lake. Blue is B, L, U, E.', 'Blue', null, 'Listening spelling']
    ]
  ];
  // Six objectively checked activities plus two guided, self-assessed writing tasks.
  const writingRows = [
    `Write the missing word: My mother and father are my ___.|parents
Complete the word: l _ b r _ r y|library
Put in order: eight / I / old / am / years|I am eight years old.
Put in order: got / She / a / has / sister|She has got a sister.
Complete: There ___ two books on the desk.|are
Put in order: homework / I / after / do / school / my|I do my homework after school.`,
    `Complete the animal word: d _ l p h _ n|dolphin
Complete: The panda is ___ (eat) now.|eating
Put in order: can / The / fly / bat|The bat can fly.
Put in order: swimming / are / The / ducks|The ducks are swimming.
Complete: A kangaroo can ___ (nhảy).|jump
Put in order: tree / rabbit / behind / is / The / the|The rabbit is behind the tree.`,
    `Complete the word: s _ n d w _ c h|sandwich
Complete: How ___ apples do you want?|many
Put in order: some / I / cheese / would / like|I would like some cheese.
Put in order: got / has / a / He / toothache|He has got a toothache.
Complete: There isn't ___ milk.|any
Put in order: our / must / We / hands / wash|We must wash our hands.`,
    `Complete the word: s t _ t _ o n|station
Complete: The bank is next ___ the café.|to
Put in order: is / The / under / ball / chair / the|The ball is under the chair.
Put in order: go / by / We / bus / school / to|We go to school by bus.
Complete: The shop is ___ the bank and the café.|between
Put in order: above / The / is / door / clock / the|The clock is above the door.`,
    `Complete the sport: b _ d m _ n t _ n|badminton
Complete: A horse is ___ (fast) than a turtle.|faster
Put in order: playing / I / tennis / like|I like playing tennis.
Put in order: is / biggest / This / the / ball|This is the biggest ball.
Complete: Good → better → ___.|best
Put in order: can / She / ball / the / catch|She can catch the ball.`,
    `Write the past form of go.|went
Write the past form of buy.|bought
Put in order: Yesterday / I / park / went / to / the|Yesterday I went to the park.
Put in order: visited / We / museum / a|We visited a museum.
Complete: Did you ___ (take) a photo?|take
Put in order: had / a / They / picnic / yesterday|They had a picnic yesterday.`,
    `Write the number 13 in words.|thirteen
Complete the word: h _ s p _ t _ l|hospital
Put in order: reading / is / She / now|She is reading now.
Put in order: bought / We / yesterday / fruit / some|We bought some fruit yesterday.
Complete: How ___ water is there?|much
Put in order: than / bag / is / My / smaller / yours|My bag is smaller than yours.`,
    `Write the past form of see.|saw
Complete the word: q _ e s t _ o n|question
Put in order: are / There / children / three|There are three children.
Put in order: didn't / He / to / go / park / the|He didn't go to the park.
Complete: The children ___ playing now.|are
Put in order: took / photos / Tom / three|Tom took three photos.`
  ];
  const personalPrompts = [
    [['What is your name and how old are you?', 'My name is ___. I am ___ years old.', 'My name is Alex. I am eight years old.'], ['Tell me about your family.', 'I live with ___.', 'I live with my parents and my sister.'], ['What is your favourite subject?', 'My favourite subject is ___.', 'My favourite subject is English. I like stories.'], ['What do you do after school?', 'After school, I ___.', 'After school, I do my homework and play.']],
    [['What is your favourite animal?', 'My favourite animal is ___.', 'My favourite animal is a dolphin. It can swim fast.'], ['Where do pandas live?', 'They live in ___.', 'They live in forests.'], ['Tell me about an animal you know.', 'It has got ___. It can ___.', 'A rabbit has got long ears. It can jump.'], ['What can you see near your home?', 'Near my home, there is ___.', 'Near my home, there is a lake with ducks.']],
    [['What is your favourite food?', 'My favourite food is ___.', 'My favourite food is noodles.'], ['What do you eat for breakfast?', 'For breakfast, I eat ___.', 'For breakfast, I eat bread and fruit.'], ['Where does your family buy food?', 'We buy food at ___.', 'We buy food at the market.'], ['How do you feel today?', 'I feel ___.', 'I feel happy today. I am ready to play.']],
    [['How do you go to school?', 'I go to school by ___. / I walk.', 'I go to school by bus.'], ['What is near your home?', 'There is a ___ near my home.', 'There is a park near my home.'], ['Where can you read books in your town?', 'I can read at the ___.', 'I can read books at the library.'], ['Tell me about your favourite place in town.', 'I like the ___ because ___.', 'I like the park because I can ride my bike.']],
    [['What sport do you like?', 'I like ___.', 'I like badminton. I play with my dad.'], ['Who do you play with?', 'I play with ___.', 'I play with my friends after school.'], ['What do you do at weekends?', 'At weekends, I ___.', 'At weekends, I go swimming.'], ['Which is faster, a horse or a turtle?', 'A ___ is faster than a ___.', 'A horse is faster than a turtle.']],
    [['Where did you go on your last holiday?', 'I went to ___.', 'I went to the beach with my family.'], ['What did you do yesterday?', 'Yesterday, I ___.', 'Yesterday, I visited my grandma.'], ['What was the weather like?', 'It was ___.', 'It was sunny and windy.'], ['What did you eat on your trip?', 'I ate ___.', 'I ate sandwiches and an apple.']],
    [['Tell me about your best friend.', 'My friend is ___. We like ___.', 'My friend is Ben. We like playing football.'], ['What did you do last Sunday?', 'Last Sunday, I ___.', 'Last Sunday, I read a book and went to the park.'], ['What are you wearing today?', 'I am wearing ___.', 'I am wearing a blue shirt and black shorts.'], ['Why do you like your favourite animal?', 'I like ___ because ___.', 'I like cats because they are funny.']],
    [['Tell me about yourself.', 'My name is ___. I like ___.', 'My name is Alex. I am eight. I like drawing.'], ['What is your favourite school day?', 'I like ___ because ___.', 'I like Friday because we have art.'], ['Tell me about a happy day.', 'I went to ___. I felt ___.', 'I went to the park with my cousin. I felt happy.'], ['What would you like to do this weekend?', 'I would like to ___.', 'I would like to go swimming with my family.']]
  ];
  const scenes = [
    {kind: 'scene', title: 'After school', sky: '#e9f2eb', figures: ['👧', '📖', '🪑', '🐈'], caption: 'A girl is reading on a chair. A cat is beside the chair.', model: 'The girl is reading a book. The cat is next to the chair.'},
    {kind: 'scene', title: 'By the lake', sky: '#e4f1f8', figures: ['🦆', '🌊', '🌳', '🐸'], caption: 'A duck is on the lake. A frog is under the tree.', model: 'The duck is swimming. The frog is under the tree.'},
    {kind: 'scene', title: 'At the market', sky: '#fff1de', figures: ['👦', '🍎', '🧺', '👩'], caption: 'A boy has an apple. A woman is holding a basket.', model: 'The boy has got an apple. The woman is holding a basket.'},
    {kind: 'town', title: 'A tiny town', figures: ['🏦', '☕', '📚'], caption: 'The bank, café and library are in one row, from left to right.', model: 'The café is between the bank and the library.'},
    {kind: 'scene', title: 'Time to play', sky: '#eaf1df', figures: ['👦', '⚽', '🌳', '🐕'], caption: 'A boy is playing football. A dog is next to the tree.', model: 'The boy is playing football. The dog is next to the tree.'},
    {kind: 'scene', title: 'At the beach', sky: '#e1f3fa', figures: ['👧', '🏖️', '🧒', '🏰'], caption: 'A girl is on the beach. A boy is next to a sandcastle.', model: 'The girl is at the beach. The boy is next to a sandcastle.'},
    {kind: 'scene', title: 'In the garden', sky: '#edf3df', figures: ['👧', '🪴', '🌳', '🐈'], caption: 'A girl is holding a plant. A cat is under the tree.', model: 'The girl is holding a plant. The cat is under the tree.'},
    {kind: 'scene', title: 'Our little adventure', sky: '#e4eff8', figures: ['👦', '⛵', '🌊', '🦆'], caption: 'A boy is beside the lake. A boat and a duck are on the water.', model: 'The boy is by the lake. The boat is on the water.'}
  ];
  const stories = [
    [['👧🎒', 'Mia goes to school.'], ['📚👧', 'She reads a book.'], ['👧🛝', 'She plays in the playground.'], ['👧🏠', 'She goes home.']],
    [['👦🌳', 'Ben walks in the forest.'], ['👦🐸', 'He sees a frog.'], ['🐸🌊', 'The frog jumps into the water.'], ['👦😊', 'Ben smiles.']],
    [['👧🧺', 'May goes to the market.'], ['👧🍎', 'She buys some apples.'], ['👧🥞', 'She makes pancakes with Dad.'], ['👨‍👩‍👧🥞', 'They eat together.']],
    [['👦🚉', 'Tom goes to the station.'], ['👦🚆', 'He gets on a train.'], ['🚆🏘️', 'The train arrives in a town.'], ['👦👵', 'He sees his grandma.']],
    [['👦⚽', 'Jack plays with a ball.'], ['⚽🌊', 'The ball falls into the water.'], ['🐕⚽', 'A dog gets the ball.'], ['👦😊', 'Jack is happy.']],
    [['👧🧳', 'Ruby packs her bag.'], ['👧🚌', 'She goes to the beach by bus.'], ['👧🏰', 'She makes a sandcastle.'], ['👧📷', 'She takes a photo.']],
    [['👦📖', 'Alex wants his book.'], ['👦🛏️', 'He looks under the bed.'], ['👧🎒', 'His sister finds it in his bag.'], ['👦😊', 'Alex says thank you.']],
    [['👦👴', 'Tom makes a boat with Grandpa.'], ['⛵🟡', 'They paint it yellow.'], ['⛵🌊', 'The boat sails on the lake.'], ['👦📷', 'Tom takes a photo.']]
  ];
  const oddSets = [
    [['📚 book', '✏️ pencil', '📏 ruler', '🍌 banana'], 'The banana is different because the others are school things.'],
    [['🐬 dolphin', '🐋 whale', '🦈 shark', '🐼 panda'], 'The panda is different because the others live in the sea.'],
    [['🍎 apple', '🍌 banana', '🥕 carrot', '🚌 bus'], 'The bus is different because the others are food.'],
    [['🚌 bus', '🚕 taxi', '🚲 bicycle', '🧀 cheese'], 'The cheese is different because the others are transport.'],
    [['⚽ football', '🏀 basketball', '🎾 tennis ball', '📖 book'], 'The book is different because the others are balls.'],
    [['☀️ sunny', '🌧️ rainy', '☁️ cloudy', '🧳 suitcase'], 'The suitcase is different because the others show weather.'],
    [['🐈 cat', '🐕 dog', '🐇 rabbit', '📚 book'], 'The book is different because the others are animals.'],
    [['🍎 apple', '🥪 sandwich', '🧀 cheese', '🚆 train'], 'The train is different because the others are food.']
  ];
  const allQuestions = {};
  const weeks = weekInfo.map((info, index) => {
    const number = index + 1;
    const week = {number, title: info[0], subtitle: info[1], emoji: info[2], description: info[3], grammar: {title: info[4], explanation: info[5], examples: info[6]}, scene: scenes[index]};
    week.vocabulary = wordRows[index].split('\n').map((row, i) => { const [word, meaning, emoji, example] = row.split('|'); return {id: `w${number}-word${i}`, word, meaning, emoji, example, week: number}; });
    function question(skill, i, fields) {
      const q = {id: `w${number}-${skill}${i}`, week: number, skill, topic: skills[skill].name, ...fields};
      if (q.options) {
        // Deterministic rotation avoids making every correct option A, including offline.
        const rotate = (i + number) % q.options.length;
        q.options = q.options.slice(rotate).concat(q.options.slice(0, rotate));
      }
      allQuestions[q.id] = q;
      return q;
    }
    week.vocabularyQuestions = week.vocabulary.flatMap((v, i) => {
      const other = [week.vocabulary[(i + 3) % week.vocabulary.length], week.vocabulary[(i + 7) % week.vocabulary.length]];
      return [
        question('vocabulary', i * 5, {type: 'choice', prompt: `“${v.word}” có nghĩa là gì?`, options: [v.meaning, ...other.map(o => o.meaning)], answer: v.meaning, explanation: v.example, topic: 'Word meanings'}),
        question('vocabulary', i * 5 + 1, {type: 'choice', prompt: `Chọn từ: ${v.emoji} ${v.meaning}`, options: [v.word, ...other.map(o => o.word)], answer: v.word, explanation: v.example, topic: 'Word recognition'}),
        question('vocabulary', i * 5 + 2, {type: 'input', prompt: `Điền đủ từ: ${v.word.replace(/[aeiou]/gi, '_')} (${v.meaning})`, answer: v.word, explanation: v.example, topic: 'Missing letters'}),
        question('vocabulary', i * 5 + 3, {type: 'input', prompt: `Viết từ tiếng Anh: ${v.meaning}`, answer: v.word, explanation: v.example, topic: 'Spelling'}),
        question('vocabulary', i * 5 + 4, {type: 'input', prompt: v.example.replace(new RegExp(v.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '_____'), context: `Từ gợi ý: ${v.meaning}`, answer: v.word, explanation: v.example, topic: 'Complete the sentence'})
      ];
    });
    week.grammarQuestions = grammarRows[index].split('\n').map((row, i) => { const [prompt, answer, a, b, explanation] = row.split('|'); return question('grammar', i, {type: 'choice', prompt, answer, options: [answer, a, b], explanation, topic: info[4]}); });
    week.readingQuestions = readingPacks[index].flatMap(([title, passage, qs], p) => qs.map(([prompt, answer, ...others], i) => question('reading', p * 5 + i, {type: i === 2 ? 'input' : 'choice', title, passage, prompt, answer, options: i === 2 ? null : [answer, ...others], explanation: `Đọc lại “${title}” và tìm chi tiết tương ứng. Đáp án: ${answer}.`, topic: prompt.includes('___') ? 'Reading gap fill' : answer === 'True' || answer === 'False' ? 'True / False' : 'Story details'})));
    // Reading extras cover definitions, conversations and choosing a title.
    week.readingQuestions.push(question('reading', 10, {type: 'choice', prompt: 'You go here to read and borrow books.', answer: 'library', options: ['library', 'hospital', 'station'], explanation: 'A library is a place to read and borrow books.', topic: 'Word definitions'}));
    week.readingQuestions.push(question('reading', 11, {type: 'choice', prompt: number > 5 ? 'How was your holiday?' : 'Would you like some water?', answer: number > 5 ? 'It was great!' : 'Yes, please.', options: number > 5 ? ['It was great!', 'At the beach.', 'On Monday.'] : ['Yes, please.', 'I am eight.', 'It is blue.'], explanation: number > 5 ? 'How was...? hỏi nhận xét về trải nghiệm.' : 'Lời mời Would you like...? có thể đáp Yes, please.', topic: 'Conversations'}));
    week.readingQuestions.push(question('reading', 12, {type: 'choice', title: 'Choose a title', passage: readingPacks[index][0][1], prompt: 'Choose the best title for this story.', answer: readingPacks[index][0][0], options: [readingPacks[index][0][0], 'A robot on the moon', 'My new shoes'], explanation: 'Chọn tiêu đề bao quát nội dung cả đoạn.', topic: 'Story titles'}));
    const numberWords = {3: 'three', 4: 'four', 11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 16: 'sixteen', 18: 'eighteen', 20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty'};
    week.listeningQuestions = listeningPacks[index].map(([prompt, audio, answer, distractors, topic], i) => question('listening', i, {type: distractors ? 'choice' : 'input', prompt, audio, answer, accept: numberWords[answer] ? [numberWords[answer]] : [], options: distractors ? [answer, ...distractors] : null, explanation: `Lời thoại: ${audio}`, topic}));
    // Extra short clips make Days 4–5 fresh while reinforcing the week's new words.
    week.vocabulary.slice(0, 5).forEach((v, i) => {
      const other = [week.vocabulary[(i + 4) % week.vocabulary.length], week.vocabulary[(i + 9) % week.vocabulary.length]];
      week.listeningQuestions.push(question('listening', 10 + i, {type: 'choice', prompt: 'Which word do you hear?', audio: `Listen carefully. ${v.example}`, answer: v.word, options: [v.word, ...other.map(item => item.word)], explanation: `You can hear the word “${v.word}”. ${v.example}`, topic: 'Listen for a word'}));
    });
    week.vocabulary.slice(0, 2).forEach((v, i) => {
      const other = [week.vocabulary[(i + 5) % week.vocabulary.length], week.vocabulary[(i + 10) % week.vocabulary.length]];
      week.readingQuestions.push(question('reading', 13 + i, {type: 'choice', title: 'Read a clue', passage: v.example, prompt: 'Which word can you find in the sentence?', answer: v.word, options: [v.word, ...other.map(item => item.word)], explanation: `The sentence uses “${v.word}”.`, topic: 'Read for a word'}));
    });
    week.writingQuestions = writingRows[index].split('\n').map((row, i) => { const [prompt, answer] = row.split('|'); return question('writing', i, {type: 'input', prompt, answer, explanation: `Câu/từ hoàn chỉnh: ${answer}`, topic: i === 0 || i === 1 ? 'Spelling' : i === 4 ? 'Grammar in writing' : 'Sentence order'}); });
    week.writingQuestions.push(question('writing', 6, {type: 'open', prompt: 'Write two sentences about the picture.', scene: scenes[index], answer: scenes[index].model, hint: 'Who / What + is/are + action or place.', checklist: ['Con viết hai câu đúng với tranh.', 'Mỗi câu có chủ ngữ và động từ.', 'Con kiểm tra chữ hoa, chính tả và dấu chấm.'], topic: 'Picture description'}));
    week.writingQuestions.push(question('writing', 7, {type: 'open', prompt: 'Write a short story: one sentence for each picture.', scene: {kind: 'story', panels: stories[index]}, answer: stories[index].map(p => p[1]).join(' '), hint: 'First… Then… Next… Finally…', checklist: ['Con viết theo đúng trình tự tranh.', 'Mỗi câu diễn tả một việc.', 'Con kiểm tra động từ và dấu câu.'], topic: 'Short story'}));
    week.vocabulary.slice(0, 7).forEach((v, i) => week.writingQuestions.push(question('writing', 8 + i, {type: 'input', prompt: i % 2 ? `Write the English word: ${v.meaning}` : v.example.replace(new RegExp(v.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '_____'), context: i % 2 ? '' : `Gợi ý: ${v.meaning}`, answer: v.word, explanation: v.example, topic: i % 2 ? 'Spelling' : 'Complete the sentence'})));
    week.speakingQuestions = personalPrompts[index].map(([prompt, hint, answer], i) => question('speaking', i, {type: 'speaking', prompt, hint, answer, scene: scenes[index], topic: 'Personal questions'}));
    week.speakingQuestions.push(question('speaking', 4, {type: 'speaking', prompt: 'Look at the picture. What can you see?', hint: 'I can see… The … is …', answer: scenes[index].model, scene: scenes[index], topic: 'Picture description'}));
    week.speakingQuestions.push(question('speaking', 5, {type: 'speaking', prompt: 'Find four differences between picture A and picture B.', hint: 'In picture A… In picture B… Look at the sun, shirt, balls and cat.', answer: 'In picture A, it is sunny. In B, it is cloudy. The shirt is blue in A and red in B. There is one ball in A and two in B. The cat is next to the tree in A and on the bench in B.', scene: {kind: 'differences'}, topic: 'Find the differences'}));
    week.speakingQuestions.push(question('speaking', 6, {type: 'speaking', prompt: `Listen to the first picture: “${stories[index][0][1]}” Now tell the rest of the story.`, hint: 'Then… Next… Finally…', answer: stories[index].slice(1).map(p => p[1]).join(' '), scene: {kind: 'story', panels: stories[index]}, topic: 'Picture story'}));
    week.speakingQuestions.push(question('speaking', 7, {type: 'speaking', prompt: 'Which one is different? Why?', hint: 'The … is different because…', answer: oddSets[index][1], scene: {kind: 'odd', items: oddSets[index][0]}, topic: 'Odd one out'}));
    week.vocabulary.slice(0, 7).forEach((v, i) => week.speakingQuestions.push(question('speaking', 8 + i, {type: 'speaking', prompt: `Can you make a sentence with “${v.word}”?`, hint: `Try: ${v.example}`, answer: v.example, scene: scenes[index], topic: 'Make a sentence'})));
    return week;
  });
  function lessonQuestions(weekNumber, day, skill) {
    const week = weeks[weekNumber - 1];
    const list = week[skill + 'Questions'];
    const count = skill === 'grammar' ? 5 : skill === 'vocabulary' ? 2 : 3;
    // Vocabulary lessons use daily flashcards. Other skills progress through larger daily sets.
    return Array.from({length: count}, (_, i) => list[((day - 1) * count + i) % list.length]);
  }
  const quizzes = weeks.map(w => Array.from({length: 5}, (_, d) => ({id: `quiz-${w.number}-${d + 1}`, week: w.number, day: d + 1, title: `Week ${w.number} · Day ${d + 1} mini quiz`, questions: [w.vocabularyQuestions[d * 10], w.vocabularyQuestions[d * 10 + 3], w.grammarQuestions[d * 2], w.readingQuestions[d * 2], w.writingQuestions[d % 6]]})));
  const tests = weeks.map(w => ({id: `weekly-${w.number}`, title: `Week ${w.number} check-in`, kind: 'weekly', week: w.number, minutes: 25, questions: ['vocabulary', 'grammar', 'listening', 'reading', 'writing'].flatMap(s => w[s + 'Questions'].filter(q => q.type !== 'open').slice(0, 4))}));
  const mockTests = [0, 1].map(n => ({id: `mock-${n + 1}`, title: `Mock Test ${n + 1}`, kind: 'mock', minutes: 45, questions: ['vocabulary', 'grammar', 'listening', 'reading', 'writing'].flatMap(s => weeks.map((w, wi) => {const pool = w[s + 'Questions'].filter(q => q.type !== 'open'); return pool[(wi + n * 3) % pool.length];}))}));
  window.MoversData = {skills, weeks, vocabulary: weeks.flatMap(w => w.vocabulary), grammarQuestions: weeks.flatMap(w => w.grammarQuestions), readingQuestions: weeks.flatMap(w => w.readingQuestions), writingQuestions: weeks.flatMap(w => w.writingQuestions), speakingQuestions: weeks.flatMap(w => w.speakingQuestions), listeningQuestions: weeks.flatMap(w => w.listeningQuestions), allQuestions, lessonQuestions, quizzes, tests, mockTests};
})();
