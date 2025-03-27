import{r as i}from"./utils-rFPDwf7D.js";import{P as a}from"./ProductData-BrgBjjpn.js";function n(t){return`
    <li class="product-card">
      <a href="product_pages/?product=${t.Id}">
        <img src="${t.Image}" alt="${t.Name}">
        <h2>${t.Brand.Name}</h2>
        <h3>${t.Name}</h3>
        <p class="product-card__price">$${t.FinalPrice}</p>
      </a>
    </li>
    `}class c{constructor(e,r,s){this.category=e,this.dataSource=r,this.listElement=s}async init(){const e=await this.dataSource.getData();this.renderList(e)}renderList(e){if(!this.listElement){console.error("List element is not defined!");return}i(n,this.listElement,e)}}const o=new a("tents"),l=document.querySelector(".product-list"),d=new c("Tents",o,l);d.init();
