import{c as l,i as p,O as m,x as i,n as d,d as f,P as g,a as v}from"./PageHeader-B6rjJ5UI.js";var P=Object.defineProperty,c=(n,t,e,h)=>{for(var r=void 0,s=n.length-1,a;s>=0;s--)(a=n[s])&&(r=a(t,e,r)||r);return r&&P(t,e,r),r};class o extends p{constructor(){super(...arguments),this._authObserver=new m(this,"mpn:auth")}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(t){try{const e=await fetch(t,{headers:this.authorization});this.mealPlan=await e.json()}catch(e){console.error("Error loading meal plan for shopping list:",e)}}computeShoppingList(){var e;const t=new Map;return(e=this.mealPlan)==null||e.days.forEach(h=>{h.recipes.forEach(r=>{r.ingredients.forEach(s=>{const a=`${s.name}|${s.unit}`,u=t.get(a);u?u.amount+=s.amount:t.set(a,{...s})})})}),Array.from(t.values())}render(){if(!this.mealPlan)return i`<p>Loading shopping list...</p>`;const t=this.computeShoppingList();return i`
      <section class="card">
        <h2>For: ${this.mealPlan.name}</h2>
        <ul class="sequence">
          ${t.map(e=>i`<li>${e.name} – ${e.amount} ${e.unit}</li>`)}
        </ul>
      </section>
    `}}c([d()],o.prototype,"src");c([l()],o.prototype,"mealPlan");f({"mu-auth":v.Provider,"mpn-page-header":g,"mpn-shopping-list":o});
