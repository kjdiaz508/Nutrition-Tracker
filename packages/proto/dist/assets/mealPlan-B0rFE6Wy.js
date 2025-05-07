import"./modulepreload-polyfill-B5Qt9EMX.js";import{f as C,u as _,i as v,x as p,r as m,a as $,d as j}from"./reset.css-CWSYUagB.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const k={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:C},O=(s=k,r,e)=>{const{kind:i,metadata:t}=e;let a=globalThis.litPropertyMetadata.get(t);if(a===void 0&&globalThis.litPropertyMetadata.set(t,a=new Map),i==="setter"&&((s=Object.create(s)).wrapped=!0),a.set(e.name,s),i==="accessor"){const{name:o}=e;return{set(l){const u=r.get.call(this);r.set.call(this,l),this.requestUpdate(o,u,s)},init(l){return l!==void 0&&this.C(o,void 0,s,l),l}}}if(i==="setter"){const{name:o}=e;return function(l){const u=this[o];r.call(this,l),this.requestUpdate(o,u,s)}}throw Error("Unsupported decorator location: "+i)};function n(s){return(r,e)=>typeof e=="object"?O(s,r,e):((i,t,a)=>{const o=t.hasOwnProperty(a);return t.constructor.createProperty(a,i),o?Object.getOwnPropertyDescriptor(t,a):void 0})(s,r,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function w(s){return n({...s,state:!0,attribute:!1})}var U=Object.defineProperty,f=(s,r,e,i)=>{for(var t=void 0,a=s.length-1,o;a>=0;a--)(o=s[a])&&(t=o(r,e,t)||t);return t&&U(r,e,t),t};const y=class y extends v{constructor(){super(...arguments),this.day="",this.calories="",this.protein="",this.carbs="",this.fat=""}render(){return p`
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
    `];let c=y;f([n()],c.prototype,"day");f([n()],c.prototype,"calories");f([n()],c.prototype,"protein");f([n()],c.prototype,"carbs");f([n()],c.prototype,"fat");var q=Object.defineProperty,x=(s,r,e,i)=>{for(var t=void 0,a=s.length-1,o;a>=0;a--)(o=s[a])&&(t=o(r,e,t)||t);return t&&q(r,e,t),t};const g=class g extends v{constructor(){super(...arguments),this.href="",this.title=""}render(){return p`
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
    `];let d=g;x([n()],d.prototype,"href");x([n()],d.prototype,"title");var T=Object.defineProperty,P=(s,r,e,i)=>{for(var t=void 0,a=s.length-1,o;a>=0;a--)(o=s[a])&&(t=o(r,e,t)||t);return t&&T(r,e,t),t};const b=class b extends v{connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}async hydrate(r){fetch(r).then(e=>e.json()).then(e=>{this.mealPlan=e}).catch(e=>console.error("Error fetching meal plan:",e))}render(){return this.mealPlan?p`
      <section>
        ${this.mealPlan.days.map(r=>p`
            <mpn-meal-day
              day=${r.day}
              calories=${r.calories}
              protein=${r.protein}
              carbs=${r.carbs}
              fat=${r.fat}
            >
              ${r.recipes.map(e=>p`
                  <mpn-recipe-link
                    href=${e.href}
                    title=${e.title}
                  ></mpn-recipe-link>
                `)}
            </mpn-meal-day>
          `)}
      </section>
    `:p`<p>Loading meal plan...</p>`}};b.styles=[m.styles];let h=b;P([n()],h.prototype,"src");P([w()],h.prototype,"mealPlan");j({"mpn-meal-day":c,"mpn-recipe-link":d,"mpn-meal-plan":h});
