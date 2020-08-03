//  【相關變數設定】
//  配合動畫設置按鍵間隔時間
let isMoving = false;
//  頁數索引需設為全域變數，不同函數執行後才能同步更新
let currentSlide = 0;
let comingSlide;
let movingDirection;
//  取出所有 slide 標籤，可直接根據索引值修改屬性
const slideList = document.getElementsByTagName('slide');
//  取出所有 icon 標籤，並解構為陣列以使用陣列內建函數
const iconList = [...document.getElementsByTagName('icon')];

//  【函數-依據進入頁面及方向設置屬性動畫，完成後更新目前頁面索引】
function Carousel(direction, coming) {
  //  如還在換頁中則取消執行(換頁動畫時間 600)
  if (isMoving) {
    return;
  }
  isMoving = true;
  setTimeout(() => { isMoving = false; }, 700);
  //  根據方向設置進入頁面屬性(transform)，並取消動畫
  if (direction === 'right') {
    slideList[coming].className = 'right transition-off';
  } else {
    slideList[coming].className = 'left transition-off';
  }
  //  增加短暫延遲，確保上方 transform 屬性"先"設定完成才能產生動畫效果
  setTimeout(() => {
    //  指定換頁鈕動畫
    if (direction === 'right') {
      iconList[currentSlide].classList.remove('currentPage');
      iconList[coming].classList.add('currentPage');
    } else {
      iconList[currentSlide].classList.remove('currentPage');
      iconList[coming].classList.add('currentPage');
    }
    //  目前頁面會往點擊的反方向離開
    const leaving = direction === 'right' ? 'left' : 'right';
    slideList[currentSlide].className = `${leaving} leavingRaise`;
    //  更改進入頁面的屬性(取消 transform → 回復原位動畫，並提高 z-index 避免被覆蓋)
    slideList[coming].className = 'comingRaise';
    //  完成移動，更新目前頁面索引
    currentSlide = coming;
  }, 100);
}

//  自動換頁計時器，如三秒無點擊換頁則自動往右
let timeID;
function autoPlay() {
  timeID = setInterval(() => {
    movingDirection = 'right';
    comingSlide = (currentSlide + 1 > slideList.length - 1) ? 0 : currentSlide + 1;
    Carousel(movingDirection, comingSlide);
  }, 3000);
}

//  【左右換頁按鈕監聽器設置】
document.querySelector('.arrowArea').addEventListener('click', (e) => {
  movingDirection = e.target.classList.contains('isLeft') ? 'left' : 'right';
  //  更新此次進入頁面索引值
  if (movingDirection === 'right') {
    comingSlide = (currentSlide + 1 > slideList.length - 1) ? 0 : currentSlide + 1;
  } else {
    comingSlide = (currentSlide - 1 < 0) ? slideList.length - 1 : currentSlide - 1;
  }
  //  手動換頁時先取消自動換頁
  clearInterval(timeID);
  //  確認相關參數後呼叫函數
  Carousel(movingDirection, comingSlide);
  //  完成換頁後，重啟自動換頁計時
  autoPlay();
});

//  【指定換頁按鈕監聽器設置】
document.querySelector('.slide-icon').addEventListener('click', (e) => {
  //  抓取點選按鈕的索引值
  const selectSlide = iconList.indexOf(e.target);
  //  如未點擊到 icon /點擊同一頁則取消執行
  if (e.target.tagName !== 'ICON' || selectSlide === currentSlide) {
    return;
  }
  //  更新此次進入頁面索引值
  movingDirection = selectSlide > currentSlide ? 'right' : 'left';
  comingSlide = selectSlide;
  //  手動換頁時先取消自動換頁
  clearInterval(timeID);
  //  確認相關參數後呼叫函數
  Carousel(movingDirection, comingSlide);
  //  完成換頁後，重啟自動換頁計時
  autoPlay();
});

autoPlay();
