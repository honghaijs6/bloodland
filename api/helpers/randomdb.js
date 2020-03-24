let BOX_PERCENT = [
    { type: 0, percent: 80 }, //Hộp Bình Thường (normal-box)
    { type: 1, percent: 19 }, //Hộp Hiếm (rare-box)
    { type: 2, percent: 1 }, //Hộp Legend (legend-box)
];
let BOX_DATA = [
    {
        "name": "일반 랜덤 박스",
        "typeCode": "normal-box",
        "description": "무었이 나올지 알 수 없다.<br>하지만 실버 나무가 나올지도 !!|무었이 나올지 알 수 없는 박스<br>실버 나무가 나올지도...",
        "descriptionShop": "무었이 나올지 알 수 없다.<br>하지만 실버 나무가 나올지도 !!",
        "image" : "normal-box.png",
        "price": 500,
        "type" : "item",
    },
    {
        "name": "희귀 랜덤 박스",
        "typeCode": "rare-box",
        "description": "일반 랜덤 박스보다 더 좋은 것이 나올 수 있다.|무었이 나올지 알 수 없는 박스<br>일반 랜덤 박스보다 더 좋은 것이 <br>나올 수 있다.",
        "descriptionShop": "일반 랜덤 박스보다 더 좋은 것이 나올 수 있다.",
        "image" : "rare-box.png",
        "price": 1000,
        "type" : "item",
    },
    {
        "name": "전설 랜덤 박스",
        "typeCode": "legend-box",
        "description": "희귀 랜덤 박스보다 더 좋은 것이 나올 수 있다.<br>다이아 몬드 나무 가 나올지도...|어떤 것이 나올지 알 수 없지만<br>다이아 나무가 나온다는 소문이 있다.<br>혹시 여기에 다이아 나무가??",
        "descriptionShop": "희귀 랜덤 박스보다 더 좋은 것이 나올 수 있다.<br>다이아 몬드 나무 가 나올지도...",
        "image" : "legend-box.png",
        "price": 5000,
        "type" : "item",
    }
];

//500
const NORMAL_GIFT_PERCENT = [
    { type: 0, percent: 30 }, //Cây Bình Thường - ( normal-sprout )
    { type: 1, percent: 20 }, //Cây Trắng - ( white-sprout )
    { type: 2, percent: 10 }, /// Cây Xanh Lá Cây - ( green-sprout )
    { type: 3, percent: 6 }, //Cây Xanh Biển - ( blue-sprout )
    { type: 4, percent: 3 }, //Cây Đồng - ( bronze-sprout )
    { type: 5, percent: 1 }, //Cây Bạc - ( silver-sprout )
    //item
    { type: 6, percent: 15 }, //Thuốc Dinh Dưỡng - (nutritional-supplements)
    { type: 7, percent: 15 }, //Xẻng - (shovel)
];

const NORMAL_GIFT_DATA = [
    //character
    {
        "name": "일반 나무",
        "typeCode": "normal-sprout",
        "description": "가장 일반적인 나무<br/>연 0.6%의 고정이율을 <br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 0.6%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "가장 일반적인 나무 연 0.6%의 고정이율을 <br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "normal-sprout.png",
        "price": 0,
        "profit": 0,
        "profitDay": 0.0016/100,
        "profitMonth": 0.05/100,
        "profitYear": 0.6/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "normal-tree",
        "type":"bud"
    },
    {
        "name": "화이트 나무",
        "typeCode": "white-sprout",
        "description": "눈이 덮여 있는 나무<br/>연 7.2%의 고정이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 7.2%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "눈이 덮여 있는 나무 연 7.2%의 고정이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "white-sprout.png",
        "price": 180,
        "profit": 0,
        "profitDay": 0.0197/100,
        "profitMonth": 0.6/100,
        "profitYear": 7.2/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "white-tree",
        "type":"bud"
    },
    {
        "name": "그린 나무 ",
        "typeCode": "green-sprout",
        "description": "녹색으로 만들어진 나무<br/>연 7.8%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 7.8%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "녹색으로 만들어진 나무 연 7.8%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "green-sprout.png",
        "price": 260,
        "profit": 0,
        "profitDay": 0.0213/100,
        "profitMonth": 0.65/100,
        "profitYear": 7.8/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "green-tree",
        "type":"bud"
    },
    {
        "name": "블루 나무",
        "typeCode": "blue-sprout",
        "description": "파란색으로 만들어진 나무<br/>연 8.4%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를  받는다.|연 이율이 8.4%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "파란색으로 만들어진 나무 연 8.4%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를  받는다.",
        "image" : "blue-sprout.png",
        "price": 350,
        "profit": 0,
        "profitDay": 0.0230/100,
        "profitMonth": 0.7/100,
        "profitYear": 8.4/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "blue-tree",
        "type":"bud"
    },
    {
        "name": "브론즈 나무",
        "typeCode": "bronze-sprout",
        "description": "건강한 녹색의 나무<br/>연 9.6%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 9.6%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "건강한 녹색의 나무 연 9.6%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "bronze-sprout.png",
        "price": 480,
        "profit": 0,
        "profitDay": 0.0263/100,
        "profitMonth": 0.8/100,
        "profitYear": 9.6/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "bronze-tree",
        "type":"bud"
    },
    {
        "name": "실버 나무",
        "typeCode": "silver-sprout",
        "description": "은색으로 덮여있는 나무<br/>연 11.4%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 11.4%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "은색으로 덮여있는 나무 연 11.4%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "silver-sprout.png",
        "price": 760,
        "profit": 0,
        "profitDay": 0.0312/100,
        "profitMonth": 0.95/100,
        "profitYear": 11.4/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "silver-tree",
        "type":"bud"
    },
    //item
    {
        "name": "무럭무럭 영양제",
        "typeCode": "nutritional-supplements",
        "description": "나무의 연 이율을 180일동안 0.005%를 올려준다.<br>나무에 영양제를 많이 줄 수 없다.|나무의 연 이율이 0.005% <br>180일 동안 늘어나게 된다<br>나의 나무에만 사용 할 수 있으며<br>최대 0.01%까지 적용 된다.",
        "descriptionShop": "나무의 연 이율을 180일동안 0.005%를 올려준다.<br>나무에 영양제를 많이 줄 수 없다.",
        "image" : "nutrition.png",
        "price": 10,
        "type" : "forTree",
    },
    {
        "name": "없애버려 삽",
        "typeCode": "shovel",
        "description": "랜드에 심어져 있는 모든 나무를 제거 할 수 있다.<br>제거된 나무의 구입가는 반환되지 않는다.|나의 랜드에 심어져 있는 나무를 <br>제거 할 때 사용하는 삽",
        "descriptionShop": "랜드에 심어져 있는 모든 나무를 제거 할 수 있다.<br>제거된 나무의 구입가는 반환되지 않는다.",
        "image" : "shovel.png",
        "price": 50,
        "type" : "remove",
    },
]

//1000
const RARE_GIFT_DATA = [
    //character
    {
        "name": "일반 나무",
        "typeCode": "normal-sprout",
        "description": "가장 일반적인 나무<br/>연 0.6%의 고정이율을 <br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 0.6%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "가장 일반적인 나무 연 0.6%의 고정이율을 <br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "normal-sprout.png",
        "price": 0,
        "profit": 0,
        "profitDay": 0.0016/100,
        "profitMonth": 0.05/100,
        "profitYear": 0.6/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "normal-tree",
        "type":"bud"
    },
    {
        "name": "블루 나무",
        "typeCode": "blue-sprout",
        "description": "파란색으로 만들어진 나무<br/>연 8.4%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를  받는다.|연 이율이 8.4%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "파란색으로 만들어진 나무 연 8.4%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를  받는다.",
        "image" : "blue-sprout.png",
        "price": 350,
        "profit": 0,
        "profitDay": 0.0230/100,
        "profitMonth": 0.7/100,
        "profitYear": 8.4/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "blue-tree",
        "type":"bud"
    },
    {
        "name": "브론즈 나무",
        "typeCode": "bronze-sprout",
        "description": "건강한 녹색의 나무<br/>연 9.6%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 9.6%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "건강한 녹색의 나무 연 9.6%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "bronze-sprout.png",
        "price": 480,
        "profit": 0,
        "profitDay": 0.0263/100,
        "profitMonth": 0.8/100,
        "profitYear": 9.6/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "bronze-tree",
        "type":"bud"
    },
    {
        "name": "실버 나무",
        "typeCode": "silver-sprout",
        "description": "은색으로 덮여있는 나무<br/>연 11.4%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 11.4%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "은색으로 덮여있는 나무 연 11.4%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "silver-sprout.png",
        "price": 760,
        "profit": 0,
        "profitDay": 0.0312/100,
        "profitMonth": 0.95/100,
        "profitYear": 11.4/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "silver-tree",
        "type":"bud"
    },
    {
        "name": "골드 나무",
        "typeCode": "gold-sprout",
        "description": "금색으로 덮여있는 나무<br/>연 13.2%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 13.2%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "금색으로 덮여있는 나무 연 13.2%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "gold-sprout.png",
        "price": 1500,
        "profit": 0,
        "profitDay": 0.0361/100,
        "profitMonth": 1.1/100,
        "profitYear": 13.2/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "gold-tree",
        "type":"bud"
    },
    {
        "name": "플래티넘 나무",
        "typeCode": "platinum-sprout",
        "description": "가장 좋은 나무<br/>연 15%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 15%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "가장 좋은 나무 연 15%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "platinum-sprout.png",
        "price": 3000,
        "profit": 0,
        "profitDay": 0.0410/100,
        "profitMonth": 1.25/100,
        "profitYear": 15/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "platinum-tree",
        "type":"bud"
    },
    //item
    {
        "name": "무럭무럭 영양제",
        "typeCode": "nutritional-supplements",
        "description": "나무의 연 이율을 180일동안 0.005%를 올려준다.<br>나무에 영양제를 많이 줄 수 없다.|나무의 연 이율이 0.005% <br>180일 동안 늘어나게 된다<br>나의 나무에만 사용 할 수 있으며<br>최대 0.01%까지 적용 된다.",
        "descriptionShop": "나무의 연 이율을 180일동안 0.005%를 올려준다.<br>나무에 영양제를 많이 줄 수 없다.",
        "image" : "nutrition.png",
        "price": 10,
        "type" : "forTree",
    },
    {
        "name": "없애버려 삽",
        "typeCode": "shovel",
        "description": "랜드에 심어져 있는 모든 나무를 제거 할 수 있다.<br>제거된 나무의 구입가는 반환되지 않는다.|나의 랜드에 심어져 있는 나무를 <br>제거 할 때 사용하는 삽",
        "descriptionShop": "랜드에 심어져 있는 모든 나무를 제거 할 수 있다.<br>제거된 나무의 구입가는 반환되지 않는다.",
        "image" : "shovel.png",
        "price": 50,
        "type" : "remove",
    },
];
const RARE_GIFT_PERCENT = [
    { type: 0, percent: 30 }, //Cây Bình Thường
    { type: 1, percent: 20 }, //Cây Xanh Biển
    { type: 2, percent: 10 }, //Cây Đồng
    { type: 3, percent: 6 }, //Cây Bạc
    { type: 4, percent: 3 }, //Cây Vàng - (gold-sprout)
    { type: 5, percent: 1 }, //Cây Bạch kim - (platinum-sprout)
    //item
    { type: 6, percent: 15 }, //Thuốc Dinh Dưỡng
    { type: 7, percent: 15 }, //Xẻng
];

//5000
const LEGEND_GIFT_DATA = [
    //character
    {
        "name": "일반 나무",
        "typeCode": "normal-sprout",
        "description": "가장 일반적인 나무<br/>연 0.6%의 고정이율을 <br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 0.6%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "가장 일반적인 나무 연 0.6%의 고정이율을 <br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "normal-sprout.png",
        "price": 0,
        "profit": 0,
        "profitDay": 0.0016/100,
        "profitMonth": 0.05/100,
        "profitYear": 0.6/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "normal-tree",
        "type":"bud"
    },
    {
        "name": "브론즈 나무",
        "typeCode": "bronze-sprout",
        "description": "건강한 녹색의 나무<br/>연 9.6%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 9.6%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "건강한 녹색의 나무 연 9.6%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "bronze-sprout.png",
        "price": 480,
        "profit": 0,
        "profitDay": 0.0263/100,
        "profitMonth": 0.8/100,
        "profitYear": 9.6/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "bronze-tree",
        "type":"bud"
    },
    {
        "name": "실버 나무",
        "typeCode": "silver-sprout",
        "description": "은색으로 덮여있는 나무<br/>연 11.4%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 11.4%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "은색으로 덮여있는 나무 연 11.4%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "silver-sprout.png",
        "price": 760,
        "profit": 0,
        "profitDay": 0.0312/100,
        "profitMonth": 0.95/100,
        "profitYear": 11.4/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "silver-tree",
        "type":"bud"
    },
    {
        "name": "골드 나무",
        "typeCode": "gold-sprout",
        "description": "금색으로 덮여있는 나무<br/>연 13.2%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 13.2%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "금색으로 덮여있는 나무 연 13.2%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "gold-sprout.png",
        "price": 1500,
        "profit": 0,
        "profitDay": 0.0361/100,
        "profitMonth": 1.1/100,
        "profitYear": 13.2/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "gold-tree",
        "type":"bud"
    },
    {
        "name": "플래티넘 나무",
        "typeCode": "platinum-sprout",
        "description": "가장 좋은 나무<br/>연 15%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 15%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "가장 좋은 나무 연 15%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "platinum-sprout.png",
        "price": 3000,
        "profit": 0,
        "profitDay": 0.0410/100,
        "profitMonth": 1.25/100,
        "profitYear": 15/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "platinum-tree",
        "type":"bud"
    },
    {
        "name": "다이아 몬드 나무",
        "typeCode": "diamond-sprout",
        "description": "전설 랜덤 박스에서만 받을<br/>수 있는 희귀한 나무<br/>연 45%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.|연 이율이 45%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
        "descriptionShop": "전설 랜덤 박스에서만 받을 수 있는 희귀한 나무<br/>연 45%의 고정 이율을<br/>가지고 있다.<br/>하루마다 이자를 받는다.",
        "image" : "diamond-sprout.png",
        "price": 0,
        "profit": 0,
        "profitDay": 0.1232/100,
        "profitMonth": 3.75/100,
        "profitYear": 45/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "diamond-tree",
        "type":"bud"
    },
    //item
    {
        "name": "무럭무럭 영양제",
        "typeCode": "nutritional-supplements",
        "description": "나무의 연 이율을 180일동안 0.005%를 올려준다.<br>나무에 영양제를 많이 줄 수 없다.|나무의 연 이율이 0.005% <br>180일 동안 늘어나게 된다<br>나의 나무에만 사용 할 수 있으며<br>최대 0.01%까지 적용 된다.",
        "descriptionShop": "나무의 연 이율을 180일동안 0.005%를 올려준다.<br>나무에 영양제를 많이 줄 수 없다.",
        "image" : "nutrition.png",
        "price": 10,
        "type" : "forTree",
    }
    ,{
        "name": "없애버려 삽",
        "typeCode": "shovel",
        "description": "랜드에 심어져 있는 모든 나무를 제거 할 수 있다.<br>제거된 나무의 구입가는 반환되지 않는다.|나의 랜드에 심어져 있는 나무를 <br>제거 할 때 사용하는 삽",
        "descriptionShop": "랜드에 심어져 있는 모든 나무를 제거 할 수 있다.<br>제거된 나무의 구입가는 반환되지 않는다.",
        "image" : "shovel.png",
        "price": 50,
        "type" : "remove",
    },
];

const LEGEND_GIFT_PERCENT = [
    { type: 0, percent: 25999 }, //Cây Bình Thường
    { type: 1, percent: 20000 }, //Cây Đồng
    { type: 2, percent: 15000 }, //Cây Bạc
    { type: 3, percent: 6000 }, //Cây Vàng
    { type: 4, percent: 3000 }, //Cây Bạch kim
    { type: 5, percent: 1 }, //Cây Kim Cương - (diamond-sprout)
    //item
    { type: 6, percent: 15000 }, //Thuốc Dinh Dưỡng
    { type: 7, percent: 15000 }, //Xẻng
];

module.exports = {
    BOX_PERCENT,
    BOX_DATA,
    NORMAL_GIFT_PERCENT,
    NORMAL_GIFT_DATA,
    RARE_GIFT_PERCENT,
    RARE_GIFT_DATA,
    LEGEND_GIFT_PERCENT,
    LEGEND_GIFT_DATA,
};
