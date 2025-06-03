import{i as f,x as l,r as u,b as g,n,O as x,c as _,d as P,P as k,a as C}from"./PageHeader-B6rjJ5UI.js";var O=Object.defineProperty,d=(a,e,r,c)=>{for(var t=void 0,s=a.length-1,i;s>=0;s--)(i=a[s])&&(t=i(e,r,t)||t);return t&&O(e,r,t),t};const m=class m extends f{constructor(){super(...arguments),this.day="",this.calories="",this.protein="",this.carbs="",this.fat=""}render(){return l`
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
    `}};m.styles=[u.styles,g`
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
    `];let o=m;d([n()],o.prototype,"day");d([n()],o.prototype,"calories");d([n()],o.prototype,"protein");d([n()],o.prototype,"carbs");d([n()],o.prototype,"fat");var j=Object.defineProperty,b=(a,e,r,c)=>{for(var t=void 0,s=a.length-1,i;s>=0;s--)(i=a[s])&&(t=i(e,r,t)||t);return t&&j(e,r,t),t};const v=class v extends f{constructor(){super(...arguments),this.href="",this.title=""}render(){return l`
      <a href="${this.href}">
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-recipe-checklist" />
        </svg>
        ${this.title}
      </a>
    `}};v.styles=[u.styles,g`
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
    `];let p=v;b([n()],p.prototype,"href");b([n()],p.prototype,"title");var z=Object.defineProperty,$=(a,e,r,c)=>{for(var t=void 0,s=a.length-1,i;s>=0;s--)(i=a[s])&&(t=i(e,r,t)||t);return t&&z(e,r,t),t};const y=class y extends f{constructor(){super(...arguments),this._authObserver=new x(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{this._user=e.user,this.src&&this.hydrate(this.src)})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(e){fetch(e,{headers:this.authorization}).then(r=>r.json()).then(r=>{this.mealPlan=r}).catch(r=>console.error("Error fetching meal plan:",r))}computeNutrition(e){const r={calories:0,protein:0,carbs:0,fat:0};for(const c of e)for(const t of c.ingredients)r.calories+=t.calories||0,r.protein+=t.protein||0,r.carbs+=t.carbs||0,r.fat+=t.fat||0;return{calories:Math.round(r.calories).toString(),protein:Math.round(r.protein).toString(),carbs:Math.round(r.carbs).toString(),fat:Math.round(r.fat).toString()}}render(){return this.mealPlan?l`
      <section>
        ${this.mealPlan.days.map(e=>{const r=this.computeNutrition(e.recipes);return l`
            <mpn-meal-day
              day=${e.weekday}
              calories=${r.calories}
              protein=${r.protein}
              carbs=${r.carbs}
              fat=${r.fat}
            >
              ${e.recipes.map(c=>l`
                  <mpn-recipe-link
                    href=${c.href}
                    title=${c.name}
                  ></mpn-recipe-link>
                `)}
            </mpn-meal-day>
          `})}
      </section>
    `:l`<p>Loading meal plan...</p>`}};y.styles=[u.styles];let h=y;$([n()],h.prototype,"src");$([_()],h.prototype,"mealPlan");P({"mu-auth":C.Provider,"mpn-meal-day":o,"mpn-recipe-link":p,"mpn-meal-plan":h,"mpn-page-header":k});
