import{i as u,r as h,b as m,x as f,c as p,n as l,d as b,P as g,a as v}from"./PageHeader-B0vX37UT.js";var y=Object.defineProperty,i=(d,r,e,s)=>{for(var t=void 0,o=d.length-1,c;o>=0;o--)(c=d[o])&&(t=c(r,e,t)||t);return t&&y(r,e,t),t};const n=class n extends u{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return f`
      <form
        @change=${r=>this.handleChange(r)}
        @submit=${r=>this.handleSubmit(r)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(r){const e=r.target,s=e==null?void 0:e.name,t=e==null?void 0:e.value,o=this.formData;switch(s){case"username":this.formData={...o,username:t};break;case"password":this.formData={...o,password:t};break}}handleSubmit(r){r.preventDefault(),this.canSubmit&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(({token:e})=>{const s=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:e,redirect:this.redirect}]});this.dispatchEvent(s)}).catch(e=>{console.error(e),this.error=e.toString()})}};n.styles=[h.styles,m`
      :host {
        margin-top: var(--space-md);
      }

      form {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
      }

      label {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        font-weight: bold;
      }

      input {
        padding: 0.5rem;
        font-size: 1rem;
        border-radius: 4px;
        border: 1px solid #ccc;
      }

      button {
        align-self: flex-start;
        background-color: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border: none;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .error:not(:empty) {
        color: var(--color-error, red);
        border: 1px solid var(--color-error, red);
        padding: var(--space-sm);
        background: #ffe5e5;
        border-radius: 6px;
      }
    `];let a=n;i([p()],a.prototype,"formData");i([l()],a.prototype,"api");i([l()],a.prototype,"redirect");i([p()],a.prototype,"error");b({"mu-auth":v.Provider,"login-form":a,"mpn-page-header":g});
