import{g as n,q as e,s as i}from"./utils-rFPDwf7D.js";function l(t){return`<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${t.Image}" alt="${t.Name}" />
    </a>
    <div class="cart-card__details">
      <a href="#"><h2 class="card__name">${t.Name}</h2></a>
      <p class="cart-card__color">${t.Colors[0].ColorName}</p>
    </div>
    <p class="cart-card__price">$${(t.FinalPrice*t.quantity).toFixed(2)}</p>
    <button class="cart-card__removeItem" data-id="${t.Id}">🗑️</button>
    <div class="quantity-container">
      <button class="quantity-btn decrease" data-id="${t.Id}">-</button>
      <input type="number" class="quantity-input" value="${t.quantity}" min="1" data-id="${t.Id}">
      <button class="quantity-btn increase" data-id="${t.Id}">+</button>
    </div>
  </li>`}function o(){const t=n("so-cart")||[],c=e(".product-list"),a=e(".cart-footer"),r=e("#cartTotal");c.innerHTML=t.map(l).join(""),t.length>0?(a.classList.remove("hideTotal"),r.textContent=`$${I(t)}`):a.classList.add("hideTotal"),c.addEventListener("click",f),c.addEventListener("click",u)}o();function u(t){if(!t.target.classList.contains("cart-card__removeItem"))return;const c=t.target.dataset.id;let a=n("so-cart")||[];a=a.filter(r=>r.Id!==c),i("so-cart",a),o()}function f(t){const c=t.target;let a=n("so-cart")||[];const r=c.dataset.id,s=a.findIndex(d=>d.Id===r);s!==-1&&(c.classList.contains("increase")?a[s].quantity+=1:c.classList.contains("decrease")&&a[s].quantity>1&&(a[s].quantity-=1),i("so-cart",a),o())}function I(t){return t.reduce((c,a)=>c+a.FinalPrice*a.quantity,0).toFixed(2)}
