import{i as d,x as t,r as u,a as f,n as m}from"./PageHeader-Bjb32J5Z.js";import{r as b}from"./state-C1qfjcW9.js";const c=class c extends d{render(){return t`
      <section>
        <h2>Ingredients</h2>
        <ul>
          <slot></slot>
        </ul>
      </section>
    `}};c.styles=[u.styles,f`
      section {
        background-color: var(--color-background-card);
        padding: var(--space-md);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      h2 {
        font-family: var(--font-family-heading);
        color: var(--color-accent);
        margin-bottom: var(--space-sm);
      }

      ul {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
      }
    `];let l=c;var g=Object.defineProperty,h=(n,e,r,y)=>{for(var s=void 0,i=n.length-1,p;i>=0;i--)(p=n[i])&&(s=p(e,r,s)||s);return s&&g(e,r,s),s};const o=class o extends d{createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}async hydrate(e){try{const r=await fetch(e);this.recipe=await r.json()}catch(r){console.error("Failed to fetch recipe:",r)}}computeNutrition(){return this.recipe?this.recipe.ingredients.reduce((e,r)=>(e.calories+=r.calories||0,e.protein+=r.protein||0,e.carbs+=r.carbs||0,e.fat+=r.fat||0,e),{calories:0,protein:0,carbs:0,fat:0}):{calories:0,protein:0,carbs:0,fat:0}}render(){if(!this.recipe)return t`<p>Loading recipe...</p>`;const e=this.computeNutrition();return t`
      <main class="main-grid section">
        <section class="col-span-6">
          <mpn-ingredients-list>
            ${this.recipe.ingredients.map(r=>t`<li>
                  ${r.name}${r.unit?` – ${r.amount} ${r.unit}`:""}
                </li>`)}
          </mpn-ingredients-list>
        </section>

        <section class="col-span-6 card">
          <h2>Nutrition Summary</h2>
          <p>
            Calories: ${Math.round(e.calories)} |
            Protein: ${Math.round(e.protein)}g |
            Carbs: ${Math.round(e.carbs)}g |
            Fat: ${Math.round(e.fat)}g
          </p>
        </section>

        <section class="col-span-12 card section">
          <h2>Instructions</h2>
          <ol class="sequence">
            ${this.recipe.steps.map(r=>t`<li>${r}</li>`)}
          </ol>
        </section>
      </main>
    `}};o.styles=[u.styles];let a=o;h([m()],a.prototype,"src");h([b()],a.prototype,"recipe");export{l as I,a as R};
