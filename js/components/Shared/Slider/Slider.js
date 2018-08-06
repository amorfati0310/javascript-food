import { qs, $on } from '../../../helper/helper.js';
import { mainSlideData } from '../../../../assets/data/mainSlide.js';
import { mainSlideTemplate, slidEButtonTemplate } from './template/template.js';
import animations from '../../../helper/animation/raf.js';


export default class Slider {
  constructor(slideSelector, pagiNationEl) {
    this.slideEl = qs(slideSelector);
    this.pagiNationEl = pagiNationEl;
    this.pagiNationEl.init(mainSlideData.length);
    this.contentsMaxIdx = mainSlideData.length - 1;
    this.activeIdx = Math.floor(Math.random() * (mainSlideData.length));
    this.render();
    this.bindEvents();
    this.pagiNationEl.sendIdx = this.updateActiveIdx.bind(this);
  }
  setActiveIdx(idx) {
    return this.activeIdx = idx;
  }
  currentSlideEl() {
    return this.slideEl.children[this.activeIdx];
  }
  render() {
    this.renderContents();
    this.renderButtons();
  }
  renderContents() {
    this.slideEl.innerHTML = mainSlideTemplate(mainSlideData);
    this.currentSlideEl().classList.add('active');
  }
  renderButtons() {
    this.slideEl.insertAdjacentHTML('afterend', slidEButtonTemplate);
  }
  bindEvents() {
    const slideButtonList = this.slideEl.nextElementSibling;
    $on(qs('.right-button', slideButtonList), 'click', this.handleRightButtonClicked.bind(this));
    $on(qs('.left-button', slideButtonList), 'click', this.handleLeftButtonClicked.bind(this));
  }
  updateActiveIdx(idx) {
    animations.fadeOut(this.currentSlideEl());
    animations.fadeIn(this.slideEl.children[this.setActiveIdx(idx)]);
  }
  setNextActiveIdx() {
    this.activeIdx = this.activeIdx + 1;
    if (this.activeIdx > this.contentsMaxIdx) this.activeIdx = 0;
    return this.activeIdx;
  }
  setPrevActiveIdx() {
    this.activeIdx = this.activeIdx - 1;
    if (this.activeIdx < 0) this.activeIdx = this.contentsMaxIdx;
    return this.activeIdx;
  }
  handleRightButtonClicked() {
    animations.fadeOut(this.currentSlideEl());
    animations.fadeIn(this.slideEl.children[this.setNextActiveIdx()]);
  }
  handleLeftButtonClicked() {
    animations.fadeOut(this.currentSlideEl());
    animations.fadeIn(this.slideEl.children[this.setPrevActiveIdx()]);
  }
}
