import"./modulepreload-polyfill-B5Qt9EMX.js";import{i as h,x as l,r as m,a as g,n,d as x,P}from"./PageHeader-Bjb32J5Z.js";import{r as _}from"./state-C1qfjcW9.js";var k=Object.defineProperty,f=(s,e,r,c)=>{for(var t=void 0,a=s.length-1,o;a>=0;a--)(o=s[a])&&(t=o(e,r,t)||t);return t&&k(e,r,t),t};const u=class u extends h{constructor(){super(...arguments),this.day="",this.calories="",this.protein="",this.carbs="",this.fat=""}render(){return l`
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
    `}};u.styles=[m.styles,g`
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
    `];let i=u;f([n()],i.prototype,"day");f([n()],i.prototype,"calories");f([n()],i.prototype,"protein");f([n()],i.prototype,"carbs");f([n()],i.prototype,"fat");var C=Object.defineProperty,$=(s,e,r,c)=>{for(var t=void 0,a=s.length-1,o;a>=0;a--)(o=s[a])&&(t=o(e,r,t)||t);return t&&C(e,r,t),t};const v=class v extends h{constructor(){super(...arguments),this.href="",this.title=""}render(){return l`
      <a href="${this.href}">
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-recipe-checklist" />
        </svg>
        ${this.title}
      </a>
    `}};v.styles=[m.styles,g`
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
    `];let p=v;$([n()],p.prototype,"href");$([n()],p.prototype,"title");var j=Object.defineProperty,b=(s,e,r,c)=>{for(var t=void 0,a=s.length-1,o;a>=0;a--)(o=s[a])&&(t=o(e,r,t)||t);return t&&j(e,r,t),t};const y=class y extends h{connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}async hydrate(e){fetch(e).then(r=>r.json()).then(r=>{this.mealPlan=r}).catch(r=>console.error("Error fetching meal plan:",r))}computeNutrition(e){const r={calories:0,protein:0,carbs:0,fat:0};for(const c of e)for(const t of c.ingredients)r.calories+=t.calories||0,r.protein+=t.protein||0,r.carbs+=t.carbs||0,r.fat+=t.fat||0;return{calories:Math.round(r.calories).toString(),protein:Math.round(r.protein).toString(),carbs:Math.round(r.carbs).toString(),fat:Math.round(r.fat).toString()}}render(){return this.mealPlan?l`
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
    `:l`<p>Loading meal plan...</p>`}};y.styles=[m.styles];let d=y;b([n()],d.prototype,"src");b([_()],d.prototype,"mealPlan");x({"mpn-meal-day":i,"mpn-recipe-link":p,"mpn-meal-plan":d,"mpn-page-header":P});
