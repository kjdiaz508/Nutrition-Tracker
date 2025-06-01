import{i as p,x as t,r as l,b as f,O as m,n as b,c as g}from"./PageHeader-B6rjJ5UI.js";const n=class n extends p{render(){return t`
      <section>
        <h2>Ingredients</h2>
        <ul>
          <slot></slot>
        </ul>
      </section>
    `}};n.styles=[l.styles,f`
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
    `];let h=n;var v=Object.defineProperty,d=(c,e,r,y)=>{for(var s=void 0,i=c.length-1,u;i>=0;i--)(u=c[i])&&(s=u(e,r,s)||s);return s&&v(e,r,s),s};const o=class o extends p{constructor(){super(...arguments),this._authObserver=new m(this,"mpn:auth")}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{this._user=e.user,this.src&&this.hydrate(this.src)})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(e){try{const r=await fetch(e,{headers:this.authorization});this.recipe=await r.json()}catch(r){console.error("Failed to fetch recipe:",r)}}computeNutrition(){return this.recipe?this.recipe.ingredients.reduce((e,r)=>(e.calories+=r.calories||0,e.protein+=r.protein||0,e.carbs+=r.carbs||0,e.fat+=r.fat||0,e),{calories:0,protein:0,carbs:0,fat:0}):{calories:0,protein:0,carbs:0,fat:0}}render(){if(!this.recipe)return t`<p>Loading recipe...</p>`;const e=this.computeNutrition();return t`
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
    `}};o.styles=[l.styles];let a=o;d([b()],a.prototype,"src");d([g()],a.prototype,"recipe");export{h as I,a as R};
