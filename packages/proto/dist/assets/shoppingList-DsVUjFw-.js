import"./modulepreload-polyfill-B5Qt9EMX.js";import{i as h,x as o,n as m,d,P as u}from"./PageHeader-Bjb32J5Z.js";import{r as f}from"./state-C1qfjcW9.js";var g=Object.defineProperty,c=(s,t,e,l)=>{for(var a=void 0,r=s.length-1,n;r>=0;r--)(n=s[r])&&(a=n(t,e,a)||a);return a&&g(t,e,a),a};class i extends h{createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}async hydrate(t){try{const e=await fetch(t);this.mealPlan=await e.json()}catch(e){console.error("Error loading meal plan for shopping list:",e)}}computeShoppingList(){var e;const t=new Map;return(e=this.mealPlan)==null||e.days.forEach(l=>{l.recipes.forEach(a=>{a.ingredients.forEach(r=>{const n=`${r.name}|${r.unit}`,p=t.get(n);p?p.amount+=r.amount:t.set(n,{...r})})})}),Array.from(t.values())}render(){if(!this.mealPlan)return o`<p>Loading shopping list...</p>`;const t=this.computeShoppingList();return o`
      <section class="card">
        <h2>For: ${this.mealPlan.name}</h2>
        <ul class="sequence">
          ${t.map(e=>o`<li>${e.name} – ${e.amount} ${e.unit}</li>`)}
        </ul>
      </section>
    `}}c([m()],i.prototype,"src");c([f()],i.prototype,"mealPlan");d({"mpn-page-header":u,"mpn-shopping-list":i});
