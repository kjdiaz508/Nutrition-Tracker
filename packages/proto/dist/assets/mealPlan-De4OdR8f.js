import"./modulepreload-polyfill-B5Qt9EMX.js";import{f as C,u as _,i as v,x as p,r as m,a as $,d as k}from"./reset.css-CWSYUagB.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const w={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:C},j=(s=w,e,r)=>{const{kind:o,metadata:t}=r;let a=globalThis.litPropertyMetadata.get(t);if(a===void 0&&globalThis.litPropertyMetadata.set(t,a=new Map),o==="setter"&&((s=Object.create(s)).wrapped=!0),a.set(r.name,s),o==="accessor"){const{name:i}=r;return{set(l){const u=e.get.call(this);e.set.call(this,l),this.requestUpdate(i,u,s)},init(l){return l!==void 0&&this.C(i,void 0,s,l),l}}}if(o==="setter"){const{name:i}=r;return function(l){const u=this[i];e.call(this,l),this.requestUpdate(i,u,s)}}throw Error("Unsupported decorator location: "+o)};function n(s){return(e,r)=>typeof r=="object"?j(s,e,r):((o,t,a)=>{const i=t.hasOwnProperty(a);return t.constructor.createProperty(a,o),i?Object.getOwnPropertyDescriptor(t,a):void 0})(s,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function O(s){return n({...s,state:!0,attribute:!1})}var q=Object.defineProperty,f=(s,e,r,o)=>{for(var t=void 0,a=s.length-1,i;a>=0;a--)(i=s[a])&&(t=i(e,r,t)||t);return t&&q(e,r,t),t};const y=class y extends v{constructor(){super(...arguments),this.day="",this.calories="",this.protein="",this.carbs="",this.fat=""}render(){return p`
      <section>
        <h2>${this.day}</h2>
        <div>
          <slot></slot>
        </div>
        <p>
          Calories: ${this.calories} |
          Protein: ${this.protein} |
          Carbs: ${this.carbs} |
          Fat: ${this.fat}
        </p>
      </section>
    `}};y.styles=[m.styles,$`
      section {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
        background-color: var(--color-background-card);
        border-radius: 8px;
        padding: var(--space-md);
      }

      h2 {
        font-family: var(--font-family-heading);
        color: var(--color-accent);
        margin-bottom: var(--space-xs);
      }

      div {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
      }

      p {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
      }
    `];let c=y;f([n()],c.prototype,"day");f([n()],c.prototype,"calories");f([n()],c.prototype,"protein");f([n()],c.prototype,"carbs");f([n()],c.prototype,"fat");var U=Object.defineProperty,x=(s,e,r,o)=>{for(var t=void 0,a=s.length-1,i;a>=0;a--)(i=s[a])&&(t=i(e,r,t)||t);return t&&U(e,r,t),t};const g=class g extends v{constructor(){super(...arguments),this.href="",this.title=""}render(){return p`
      <a href="${this.href}">
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-recipe-checklist" />
        </svg>
        ${this.title}
      </a>
    `}};g.styles=[m.styles,$`
      a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: var(--color-text-primary);
        font-weight: 500;
      }

      a:hover {
        text-decoration: underline;
      }

      svg.icon {
        fill: var(--color-accent);
      }
    `];let d=g;x([n()],d.prototype,"href");x([n()],d.prototype,"title");var T=Object.defineProperty,P=(s,e,r,o)=>{for(var t=void 0,a=s.length-1,i;a>=0;a--)(i=s[a])&&(t=i(e,r,t)||t);return t&&T(e,r,t),t};const b=class b extends v{connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}async hydrate(e){const r=await fetch(e);r.ok&&(this.mealPlan=await r.json())}render(){return this.mealPlan?p`
      <section class="col-span-12 sequence">
        ${this.mealPlan.days.map(e=>p`
            <mpn-meal-day
              day=${e.day}
              calories=${e.calories}
              protein=${e.protein}
              carbs=${e.carbs}
              fat=${e.fat}
            >
              ${e.recipes.map(r=>p`
                  <mpn-recipe-link
                    href=${r.href}
                    title=${r.title}
                  ></mpn-recipe-link>
                `)}
            </mpn-meal-day>
          `)}
      </section>
    `:p`<p>Loading meal plan...</p>`}};b.styles=[m.styles];let h=b;P([n()],h.prototype,"src");P([O()],h.prototype,"mealPlan");k({"mpn-meal-day":c,"mpn-recipe-link":d,"mpn-meal-plan":h});
