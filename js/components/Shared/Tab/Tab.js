import { qs } from "../../../helper/helper.js";
import { badgeTemplate, deliveryTemplate, tabCardTemplate } from './tabTemplate.js';


export default class Tab {
  constructor(btnSelector, cardListSelector) {
    this.tabButtonsEl = qs(btnSelector);
    this.tabCardListEl = qs(cardListSelector);
    this.randomNumber = null;
    this.activedButton = null;
    this.bindEvents();
  }
  bindEvents() {
    this.tabButtonsEl.addEventListener("click", this.handleTabBtnClicked.bind(this));
  }
  getData(data){
    this.renderTabs(data);
  }
  renderTabs(data) {
    this.randomNumber = Math.floor(Math.random() * data.length);
    this.tabButtonsEl.innerHTML = this.tabButtonTemplate(data);
    this.tabCardListEl.innerHTML = this.tabCardsTemplate(
      data.map(v => ({
        items: v.items,
        id: v.category_id,
      }))
    );
    this.activedButton = qs(".active", this.tabButtonsEl);
  }
  tabButtonTemplate(data) {
    const isActiveButton = idx => (idx === this.randomNumber ? "tab-button active" : "tab-button");
    return data.reduce(
      (ac, c, ci) =>
        (ac += `<li>
      <a class="${isActiveButton(ci)}"  data-id=${c.category_id}>${c.name}</a>
    </li>`),
      ""
    );
  }
  tabCardsTemplate(data) {
    const isActiveClass = idx => (idx === this.randomNumber ? "tab-card-list" : "tab-card-list hide");
    const tabContes = data.reduce(
      (ac, c, ci) => (ac += `<ul id="cards-${c.id}" class="${isActiveClass(ci)}">${tabCardTemplate(c.items)}</ul>`),
      ""
    );
    return tabContes;
  }
  handleActiveButtons(beforeActiveBtn, activeBtn) {
    beforeActiveBtn.classList.remove("active");
    activeBtn.classList.add("active");
  }
  handleShowTabCard(hideId, showId) {
    const hideCards = qs(`#cards-${hideId}`, this.tabCardListEl);
    hideCards.classList.add("hide");

    const activedCards = qs(`#cards-${showId}`, this.tabCardListEl);
    activedCards.classList.remove("hide");
  }
  handleTabBtnClicked(e) {
    if (e.target.className !== "tab-button") return;
    const activeBtn = qs(".active", this.tabButtonsEl);
    const hideId = activeBtn.dataset.id;
    const showId = e.target.dataset.id;

    this.handleActiveButtons(activeBtn, e.target);
    this.handleShowTabCard(hideId, showId);
  }
}
