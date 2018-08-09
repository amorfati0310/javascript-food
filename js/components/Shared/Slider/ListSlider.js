import { qs, $on } from '../../../helper/helper.js';
import { cardTemplate, slidEButtonTemplate, padTemplate } from './template/template.js';
import animations from '../../../helper/animation/raf.js';
// import { mockData } from '../../../../assets/data/mainSlide.js';

export default class ListSlider {
  constructor(slideSelector, dataHelper, url, initPosition = -980, listItemCounts = 4 ) {
    this.slideEl = qs(slideSelector);
    this.url = url;
    this.dataHelper = dataHelper;
    this.maxIdx = null;
    this.slideButtonList = null;
    this.currentIdx = 0;
    this.padElCounts = 0;
    this.initPosition = initPosition;
    this.position = this.initPosition;
    this.listItemCounts = listItemCounts;
    this.init();
  }
  init(){
    this.dataHelper.sendReq({
      "method": 'GET',
       "url" : this.url, 
       "successCallback" : this.getData.bind(this)
      });
  }
  setMaxIdx(length){
    return this.maxIdx = Math.ceil(length/this.listItemCounts)-1;
  }
  getData(data){
    this.renderSlides(data);
  }
  makeEdgeData(slideData){
    
    let padSlide = '';

    if(this.padElCounts!==0){
      const padArr = [...new Array(this.padElCounts)];
      padSlide =  padTemplate(padArr)  
    }
    
    const firstSlide = padSlide+cardTemplate(slideData.slice(0,this.listItemCounts))
    const lastSlide = cardTemplate(slideData.slice(-this.listItemCounts+this.padElCounts))+padSlide

    this.slideEl.insertAdjacentHTML('beforeend', firstSlide);    
    this.slideEl.insertAdjacentHTML('afterbegin', lastSlide);
    
  }
  setPadCounts(length){
    const restSlides = length % this.listItemCounts
    if(restSlides === 0) return this.padElCounts = 0;
    else return this.padElCounts = this.listItemCounts - restSlides;
  }
  renderSlides(slideData){
    // changeLength data변경을 위한 단순 test용
    
    // const changeLength = 5;
    // const slideData = [...data, ...data.slice(changeLength)]

    const slidesCounts = slideData.length;

    this.setMaxIdx(slidesCounts)
    this.slideEl.innerHTML = cardTemplate(slideData);

    // animation을 위한 fakedata // 무한 롤링을 주기 위해서 first, last를 같 끝에 추가해줬습니다 .
    this.setPadCounts(slidesCounts)
    this.makeEdgeData(slideData);
    // renderButtons
    this.renderButtons();

    this.slideEl.style.transform = `translateX(${this.setPosition(this.currentIdx)}px)`;
    
    this.bindEvents();
  }
  bindEvents(){
    this.slideButtonList = this.slideEl.parentElement.nextElementSibling;
    $on(qs('.right-button',  this.slideButtonList), 'click', (e)=>this.handleButtonClicked(e));
    $on(qs('.left-button',  this.slideButtonList), 'click', (e)=>this.handleButtonClicked(e));
    $on(this.slideEl, 'transitionend', ()=>this.handleEdgeSlide())
  }
  setPosition(idx){
    return this.position = this.initPosition + idx * (this.initPosition);
  }
  setCurrentIdx(idx){
    return this.currentIdx = idx;
  }
  isEdgeSlide(){
    return !!(this.currentIdx === -1 || this.currentIdx === this.maxIdx+1);
  }
  renderButtons(){
    this.slideEl.parentElement.insertAdjacentHTML('afterend', slidEButtonTemplate);
  }
  handleEdgeSlide(){
    this.setDisableButton('remove');
    if(!this.isEdgeSlide()) return;
    this.slideEl.style.transitionDuration = "0s";
    const idx = (this.currentIdx === -1) ? this.maxIdx : 0
    this.setCurrentIdx(idx);
    this.slideEl.style.transform = `translateX(${this.setPosition(this.currentIdx)}px)`
  }
  setDisableButton(type){
    const leftBtn = qs('.left-button',  this.slideButtonList);
    const rightBtn = qs('.right-button',  this.slideButtonList);
    leftBtn.classList[type]('disable-btn')
    rightBtn.classList[type]('disable-btn');
  }
  handleButtonClicked({target}){
    this.setDisableButton('add');
    const nextIdx = (target.dataset.id==="left") ? this.currentIdx-1 : this.currentIdx+1
    this.slideEl.style.transitionDuration = "0.5s";
    this.setCurrentIdx(nextIdx)
    this.slideEl.style.transform = `translateX(${this.setPosition(this.currentIdx)}px)`;
  }
}
